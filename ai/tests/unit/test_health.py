from fastapi.testclient import TestClient
from pymongo.errors import ServerSelectionTimeoutError

from ai.api.app import create_app


class UnavailableDatabase:
    async def command(self, _command: str) -> None:
        raise ServerSelectionTimeoutError("unavailable")


def test_liveness_is_available_without_database() -> None:
    with TestClient(create_app()) as client:
        response = client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_reports_conversation_store_unavailable() -> None:
    with TestClient(create_app()) as client:
        client.app.state.conversation_database = UnavailableDatabase()
        response = client.get("/health/ready")

    assert response.status_code == 503
    assert response.json() == {"status": "not_ready", "dependency": "conversation_store"}
