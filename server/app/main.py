from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.api.v1.endpoints import algorithms
from app.db.session import engine
from app.models import algorithm
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

algorithm.Base.metadata.create_all(bind=engine)

app.include_router(algorithms.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"Hello": "World"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="API para gerenciamento de algoritmos",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi