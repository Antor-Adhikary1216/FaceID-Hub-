import logging
import time

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.detect import (
    EmbeddingResponse,
    ErrorResponse,
    ErrorDetail,
)
from app.services.embedding import FaceEmbeddingService
from app.utils.image import validate_image

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/embed",
    response_model=EmbeddingResponse,
    responses={
        422: {"model": ErrorResponse, "description": "No face detected or validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
    summary="Generate face embedding from an image",
    description="Upload an image to extract a 512-dimensional face embedding vector for the most prominent face.",
)
async def embed_face(file: UploadFile = File(..., description="Image file to extract embedding from")):
    start_time = time.time()

    if file.content_type is None:
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(
                code="MISSING_CONTENT_TYPE",
                message="Could not determine file type. Please provide a valid image file.",
            ).model_dump(),
        )

    try:
        image_bytes = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {e}")
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(
                code="FILE_READ_ERROR",
                message="Failed to read the uploaded file.",
                details=str(e),
            ).model_dump(),
        )

    try:
        validate_image(image_bytes, file.content_type)
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(
                code="INVALID_IMAGE",
                message=str(e),
            ).model_dump(),
        )

    service = FaceEmbeddingService()

    try:
        result = service.embed(image_bytes)
    except RuntimeError as e:
        logger.error(f"Model not available: {e}")
        raise HTTPException(
            status_code=503,
            detail=ErrorDetail(
                code="MODEL_UNAVAILABLE",
                message="Face embedding model is not available.",
                details=str(e),
            ).model_dump(),
        )
    except ValueError as e:
        logger.warning(f"No face detected: {e}")
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(
                code="NO_FACE_DETECTED",
                message="No face was detected in the provided image.",
                details="Please upload a clear image with at least one visible face.",
            ).model_dump(),
        )
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=ErrorDetail(
                code="EMBEDDING_FAILED",
                message="An error occurred during face embedding generation.",
                details=str(e),
            ).model_dump(),
        )

    return result
