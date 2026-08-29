from typing import List, Optional

from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x: float = Field(..., description="X coordinate of the top-left corner")
    y: float = Field(..., description="Y coordinate of the top-left corner")
    width: float = Field(..., description="Width of the bounding box")
    height: float = Field(..., description="Height of the bounding box")


class DetectedFace(BaseModel):
    bbox: BoundingBox = Field(..., description="Bounding box of the detected face")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    index: int = Field(..., description="Index of the detected face")


class DetectResponse(BaseModel):
    faces: List[DetectedFace] = Field(..., description="List of detected faces")
    total_faces: int = Field(..., ge=0, description="Total number of detected faces")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")


class EmbeddingResponse(BaseModel):
    embedding: List[float] = Field(..., description="512-dimensional face embedding vector")
    bbox: BoundingBox = Field(..., description="Bounding box of the detected face")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    dimension: int = Field(..., description="Dimension of the embedding vector")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")


class ErrorResponse(BaseModel):
    error: ErrorDetail = Field(..., description="Error information")
