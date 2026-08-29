import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def _make_test_image(width: int = 100, height: int = 100, color: tuple = (128, 64, 32)) -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
    assert "model_available" in body
    assert body["service"] == "ai-service"


def test_detect_no_file():
    response = client.post("/api/v1/detect")
    assert response.status_code == 422


def test_detect_invalid_file_type():
    csv_content = b"col1,col2\nval1,val2"
    response = client.post(
        "/api/v1/detect",
        files={"file": ("data.csv", io.BytesIO(csv_content), "text/csv")},
    )
    assert response.status_code == 422
    body = response.json()
    assert "detail" in body


def test_embed_no_file():
    response = client.post("/api/v1/embed")
    assert response.status_code == 422
