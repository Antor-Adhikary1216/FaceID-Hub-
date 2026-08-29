import logging
import time

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.detect import (
    DetectResponse,
    DetectedFace,
    ErrorResponse,
    ErrorDetail,
)
from app.services.detection import FaceDetectionService
from app.utils.image import ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, validate_image

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/detect",
    response_model=DetectResponse,
    responses={
        422: {"model": ErrorResponse, "description": "No face detected or validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
    summary="Detect faces in an image",
    description="Upload an image to detect all faces with bounding boxes and confidence scores.",
)
async def detect_faces(file: UploadFile = File(..., description="Image file to analyze")):
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

    service = FaceDetectionService()

    try:
        faces = service.detect(image_bytes)
    except RuntimeError as e:
        logger.error(f"Model not available: {e}")
        raise HTTPException(
            status_code=503,
            detail=ErrorDetail(
                code="MODEL_UNAVAILABLE",
                message="Face detection model is not available.",
                details=str(e),
            ).model_dump(),
        )
    except Exception as e:
        logger.error(f"Detection failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=ErrorDetail(
                code="DETECTION_FAILED",
                message="An error occurred during face detection.",
                details=str(e),
            ).model_dump(),
        )

    if not faces:
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(
                code="NO_FACE_DETECTED",
                message="No face was detected in the provided image.",
                details="Please upload a clear image with at least one visible face.",
            ).model_dump(),
        )

    elapsed = (time.time() - start_time) * 1000

    return DetectResponse(
        faces=faces,
        total_faces=len(faces),
        processing_time_ms=round(elapsed, 2),
    )
