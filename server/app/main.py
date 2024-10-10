from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware  # Add this import

from app.api.v1.endpoints import algorithms, tags
from app.db.session import engine
from app.models import algorithm, tag
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

algorithm.Base.metadata.create_all(bind=engine)
tag.Base.metadata.create_all(bind=engine)

app.include_router(algorithms.router, prefix="/api/v1/algorithms", tags=["algorithms"])
app.include_router(tags.router, prefix="/api/v1/tags", tags=["tags"])

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