import uvicorn


def main() -> None:
    uvicorn.run("ai.api.app:app", host="127.0.0.1", port=8000)
