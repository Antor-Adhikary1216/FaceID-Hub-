import io
from typing import Tuple

import cv2
import numpy as np
from PIL import Image

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
}

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB


def validate_image(file_bytes: bytes, content_type: str) -> bool:
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError(f"File size exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB")

    if content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(
            f"Invalid file type '{content_type}'. Allowed types: {', '.join(sorted(ALLOWED_MIME_TYPES))}"
        )

    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except Exception:
        raise ValueError("File is not a valid image or is corrupted")

    return True


def decode_image(file_bytes: bytes) -> np.ndarray:
    np_arr = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Failed to decode image. The file may be corrupted or in an unsupported format.")
    return image


def get_image_dimensions(image: np.ndarray) -> Tuple[int, int]:
    height, width = image.shape[:2]
    return width, height
