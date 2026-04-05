from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
import datetime
from .database import Base
import enum

class PostLength(str, enum.Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

class TopicStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class StoreConfig(Base):
    __tablename__ = "store_configs"

    id = Column(Integer, primary_key=True, index=True)
    shop_url = Column(String, unique=True, index=True)
    access_token = Column(String)
    ai_api_key = Column(String)
    
    # Settings
    post_length = Column(Enum(PostLength), default=PostLength.MEDIUM)
    regularity = Column(String, default="weekly") # "daily", "weekly", or cron
    
    topics = relationship("Topic", back_populates="store")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    theme = Column(String, index=True)
    status = Column(Enum(TopicStatus), default=TopicStatus.PENDING)
    store_config_id = Column(Integer, ForeignKey("store_configs.id"))
    
    store = relationship("StoreConfig", back_populates="topics")
    history = relationship("PostHistory", back_populates="topic", uselist=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PostHistory(Base):
    __tablename__ = "post_history"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), unique=True)
    
    # Shopify references for bilingual posts
    shopify_article_id_es = Column(String, nullable=True)
    shopify_article_id_en = Column(String, nullable=True)
    url_es = Column(String, nullable=True)
    url_en = Column(String, nullable=True)
    
    topic = relationship("Topic", back_populates="history")
    posted_at = Column(DateTime, default=datetime.datetime.utcnow)
