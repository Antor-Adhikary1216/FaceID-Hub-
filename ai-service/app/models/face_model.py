import logging
from dataclasses import dataclass, field
from typing import List, Optional

import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class FaceResult:
    bbox: np.ndarray  # shape (4,) -> [x1, y1, x2, y2]
    confidence: float
    embedding: Optional[np.ndarray] = None  # shape (512,)


class FaceModel:
    _instance: Optional["FaceModel"] = None
    _model = None
    _available: bool = False

    def __init__(self):
        self._load_model()

    @classmethod
    def get_instance(cls) -> "FaceModel":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def is_available(self) -> bool:
        return self._available

    def _load_model(self):
        try:
            from insightface.app import FaceAnalysis

            self._model = FaceAnalysis(
                name="buffalo_l",
                providers=["CPUExecutionProvider"],
            )
            self._model.prepare(ctx_id=0, det_size=(640, 640))
            self._available = True
            logger.info("InsightFace buffalo_l model loaded successfully.")
        except ImportError:
            logger.warning(
                "insightface package not installed. "
                "Face detection/embedding will not be available. "
                "Install with: pip install insightface"
            )
            self._available = False
        except Exception as e:
            logger.error(f"Failed to load InsightFace model: {e}")
            self._available = False

    def detect_faces(self, image: np.ndarray) -> List[FaceResult]:
        if not self._available:
            raise RuntimeError(
                "Face detection model is not available. "
                "Please install insightface: pip install insightface"
            )

        if image is None or image.size == 0:
            raise ValueError("Invalid image provided to detect_faces")

        faces = self._model.get(image)
        results: List[FaceResult] = []

        for face in faces:
            bbox = face.bbox.astype(float)
            confidence = float(face.det_score)
            embedding = face.embedding.astype(np.float32) if face.embedding is not None else None

            results.append(
                FaceResult(
                    bbox=bbox,
                    confidence=confidence,
                    embedding=embedding,
                )
            )

        return results
