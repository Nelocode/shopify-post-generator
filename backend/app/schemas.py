from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import PostLength, TopicStatus

class TopicBase(BaseModel):
    theme: str

class TopicCreate(TopicBase):
    pass

class Topic(TopicBase):
    id: int
    status: TopicStatus
    store_config_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class StoreConfigBase(BaseModel):
    shop_url: str
    access_token: str
    ai_api_key: str
    post_length: Optional[PostLength] = PostLength.MEDIUM
    regularity: Optional[str] = "weekly"

class StoreConfigCreate(StoreConfigBase):
    pass

class StoreConfig(StoreConfigBase):
    id: int
    topics: List[Topic] = []
    created_at: datetime

    class Config:
        from_attributes = True

class PostHistory(BaseModel):
    id: int
    topic_id: int
    shopify_article_id_es: Optional[str] = None
    shopify_article_id_en: Optional[str] = None
    url_es: Optional[str] = None
    url_en: Optional[str] = None
    posted_at: datetime

    class Config:
        from_attributes = True
