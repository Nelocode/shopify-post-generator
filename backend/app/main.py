from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, shopify, ai
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shopify AI Content Generator")

@app.post("/config", response_model=schemas.StoreConfig)
def create_config(config: schemas.StoreConfigCreate, db: Session = Depends(get_db)):
    db_config = db.query(models.StoreConfig).first()
    if db_config:
        # Update existing config
        db_config.shop_url = config.shop_url
        db_config.access_token = config.access_token
        db_config.ai_api_key = config.ai_api_key
        db_config.post_length = config.post_length
        db_config.regularity = config.regularity
    else:
        db_config = models.StoreConfig(**config.dict())
        db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@app.get("/config", response_model=schemas.StoreConfig)
def get_config(db: Session = Depends(get_db)):
    db_config = db.query(models.StoreConfig).first()
    if not db_config:
        raise HTTPException(status_code=404, detail="Config not found")
    return db_config

@app.post("/topics", response_model=List[schemas.Topic])
def add_topics(topics: List[schemas.TopicCreate], db: Session = Depends(get_db)):
    db_config = db.query(models.StoreConfig).first()
    if not db_config:
        raise HTTPException(status_code=400, detail="Config store first")
    
    db_topics = []
    for topic in topics:
        db_topic = models.Topic(theme=topic.theme, store_config_id=db_config.id)
        db.add(db_topic)
        db_topics.append(db_topic)
    
    db.commit()
    for t in db_topics: db.refresh(t)
    return db_topics

@app.get("/topics", response_model=List[schemas.Topic])
def list_topics(db: Session = Depends(get_db)):
    return db.query(models.Topic).all()

@app.post("/generate-draft/{topic_id}")
async def generate_draft(topic_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    # Trigger background task to generate content and image
    background_tasks.add_task(ai.generate_and_post_bilingual, topic.id, db)
    return {"message": "Generation started in background"}
