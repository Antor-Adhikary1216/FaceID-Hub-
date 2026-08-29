import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.detect import router as detect_router
from app.api.embed import router as embed_router
from app.models.face_model import FaceModel

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(application: FastAPI):
    logger.info("Loading face detection model...")
    model = FaceModel.get_instance()
    if model.is_available():
        logger.info("Face detection model loaded successfully.")
    else:
        logger.warning("Face detection model not available. Running in degraded mode.")
    yield
    logger.info("Shutting down AI service.")

app = FastAPI(
    title="Face Identity AI Service",
    description="AI service for face detection and embedding generation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect_router, prefix="/api/v1", tags=["detect"])
app.include_router(embed_router, prefix="/api/v1", tags=["embed"])

@app.get("/health")
async def health_check():
    model = FaceModel.get_instance()
    return {
        "status": "healthy",
        "model_available": model.is_available(),
        "service": "ai-service",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
