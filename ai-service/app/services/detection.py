import logging
import time
from typing import List

import numpy as np

from app.models.face_model import FaceModel
from app.schemas.detect import BoundingBox, DetectedFace
from app.utils.image import decode_image, validate_image

logger = logging.getLogger(__name__)


class FaceDetectionService:
    def __init__(self):
        self.model = FaceModel.get_instance()

    def detect(self, image_bytes: bytes) -> List[DetectedFace]:
        start_time = time.time()

        if not self.model.is_available():
            raise RuntimeError(
                "Face detection model is not available. "
                "Please ensure insightface is installed."
            )

        image = decode_image(image_bytes)

        face_results = self.model.detect_faces(image)

        detected_faces: List[DetectedFace] = []
        for idx, result in enumerate(face_results):
            x1, y1, x2, y2 = result.bbox
            bbox = BoundingBox(
                x=float(x1),
                y=float(y1),
                width=float(x2 - x1),
                height=float(y2 - y1),
            )
            detected_faces.append(
                DetectedFace(
                    bbox=bbox,
                    confidence=result.confidence,
                    index=idx,
                )
            )

        elapsed = (time.time() - start_time) * 1000
        logger.info(f"Detected {len(detected_faces)} face(s) in {elapsed:.2f}ms")

        return detected_faces
