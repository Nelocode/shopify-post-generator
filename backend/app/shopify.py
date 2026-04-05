import httpx
import logging

logger = logging.getLogger(__name__)

class ShopifyClient:
    def __init__(self, shop_url: str, access_token: str):
        self.shop_url = shop_url
        self.access_token = access_token
        self.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.access_token
        }
        self.api_version = "2024-01"

    async def get_blog_by_title(self, title: str):
        """Busca un blog por título (ej: News, Noticias)."""
        url = f"https://{self.shop_url}/admin/api/{self.api_version}/blogs.json"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                blogs = response.json().get("blogs", [])
                for b in blogs:
                    if b["title"].lower() == title.lower():
                        return b["id"]
        return None

    async def create_article(self, blog_id: int, title: str, content: str, author: str, tags: str, image_url: str):
        """Crea un artículo oculto (published: false) en el blog indicado."""
        url = f"https://{self.shop_url}/admin/api/{self.api_version}/blogs/{blog_id}/articles.json"
        
        article_data = {
            "article": {
                "title": title,
                "body_html": content,
                "author": author,
                "tags": tags,
                "published": False,  # Requerimiento: Siempre oculto
                "image": {
                    "src": image_url
                }
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=article_data)
            if response.status_code == 201:
                return response.json().get("article")
            else:
                logger.error(f"Error creating article: {response.text}")
                return None
