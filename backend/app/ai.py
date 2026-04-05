import os
from openai import OpenAI
from sqlalchemy.orm import Session
from . import models, shopify
import logging

logger = logging.getLogger(__name__)

async def generate_and_post_bilingual(topic_id: int, db: Session):
    topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if not topic:
        return

    db_config = db.query(models.StoreConfig).first()
    if not db_config:
        topic.status = models.TopicStatus.FAILED
        db.commit()
        return

    client = OpenAI(api_key=db_config.ai_api_key)
    
    # Parámetros de longitud
    length_map = {
        models.PostLength.SHORT: "aprox 300-500 palabras",
        models.PostLength.MEDIUM: "aprox 800-1000 palabras",
        models.PostLength.LONG: "más de 1500 palabras con estructura detallada"
    }
    target_length = length_map.get(db_config.post_length, "800 palabras")

    try:
        # 1. Generar Imagen (DALL-E 3) - Una sola imagen para ambos posts
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=f"A professional, high-quality feature image for a blog post about: {topic.theme}. Style: Modern, clean, photorealistic.",
            n=1,
            size="1024x1024"
        )
        image_url = image_response.data[0].url

        # 2. Generar Contenido (GPT-4o) - Loop para ES y EN
        languages = [("es", "Spanish", "Noticias"), ("en", "English", "News")]
        shopify_client = shopify.ShopifyClient(db_config.shop_url, db_config.access_token)
        
        post_links = {}

        for lang_code, lang_name, blog_title in languages:
            prompt = f"""
            Actúa como un experto en SEO y redacción de blogs. 
            Escribe un artículo de blog completo en {lang_name} sobre el tema: "{topic.theme}".
            Longitud deseada: {target_length}.
            Formato: HTML limpio (usa <h2>, <p>, <ul>, <strong>). No incluyas etiquetas <html> o <body>.
            Estructura: Introducción, varios subtítulos (h2), conclusión.
            Además, proporciona un Título SEO y una lista de 5 palabras clave separadas por comas para tags.
            
            Retorna el resultado estrictamente en este formato JSON:
            {{
                "title": "Título del artículo",
                "content": "Contenido HTML del artículo",
                "tags": "tag1, tag2, tag3"
            }}
            """
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            import json
            ai_data = json.loads(response.choices[0].message.content)
            
            # Postear a Shopify
            blog_id = await shopify_client.get_blog_by_title(blog_title)
            if not blog_id:
                logger.error(f"Blog '{blog_title}' not found in Shopify store.")
                continue
            
            article = await shopify_client.create_article(
                blog_id=blog_id,
                title=ai_data["title"],
                content=ai_data["content"],
                author="AI System",
                tags=ai_data["tags"],
                image_url=image_url
            )
            
            if article:
                post_links[lang_code] = {
                    "id": article["id"],
                    "url": f"https://{db_config.shop_url}/admin/articles/{article['id']}"
                }

        # Actualizar historial y estado
        topic.status = models.TopicStatus.COMPLETED
        history = models.PostHistory(
            topic_id=topic.id,
            shopify_article_id_es=str(post_links.get("es", {}).get("id")),
            shopify_article_id_en=str(post_links.get("en", {}).get("id")),
            url_es=post_links.get("es", {}).get("url"),
            url_en=post_links.get("en", {}).get("url")
        )
        db.add(history)
        db.commit()

    except Exception as e:
        logger.error(f"Error in generation process: {e}")
        topic.status = models.TopicStatus.FAILED
        db.commit()
