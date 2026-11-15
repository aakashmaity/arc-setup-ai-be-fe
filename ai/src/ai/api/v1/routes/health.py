from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

router = APIRouter(tags=["health"])


@router.get("/health/live")
async def liveness() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
async def readiness(request: Request) -> JSONResponse:
    try:
        await request.app.state.conversation_database.command("ping")
    except PyMongoError:
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "dependency": "conversation_store"},
        )
    return JSONResponse(content={"status": "ready"})
