import logging
import time
from typing import List

import numpy as np

from app.models.face_model import FaceModel
from app.schemas.detect import BoundingBox, EmbeddingResponse
from app.utils.image import decode_image

logger = logging.getLogger(__name__)


class FaceEmbeddingService:
    def __init__(self):
        self.model = FaceModel.get_instance()

    def embed(self, image_bytes: bytes) -> EmbeddingResponse:
        start_time = time.time()

        if not self.model.is_available():
            raise RuntimeError(
                "Face embedding model is not available. "
                "Please ensure insightface is installed."
            )

        image = decode_image(image_bytes)

        face_results = self.model.detect_faces(image)

        if not face_results:
            raise ValueError("No face detected in the image")

        best_face = max(face_results, key=lambda f: f.confidence)

        if best_face.embedding is None:
            raise RuntimeError("Failed to extract embedding from detected face")

        embedding = self._l2_normalize(best_face.embedding)

        x1, y1, x2, y2 = best_face.bbox
        bbox = BoundingBox(
            x=float(x1),
            y=float(y1),
            width=float(x2 - x1),
            height=float(y2 - y1),
        )

        elapsed = (time.time() - start_time) * 1000

        logger.info(f"Embedding generated: dim={len(embedding)}, confidence={best_face.confidence:.4f}, time={elapsed:.2f}ms")

        return EmbeddingResponse(
            embedding=embedding.tolist(),
            bbox=bbox,
            confidence=best_face.confidence,
            dimension=len(embedding),
            processing_time_ms=round(elapsed, 2),
        )

    @staticmethod
    def _l2_normalize(embedding: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(embedding)
        if norm < 1e-12:
            logger.warning("Embedding norm is near zero, returning original embedding")
            return embedding
        return embedding / norm
