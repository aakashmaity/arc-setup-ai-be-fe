from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pymongo import AsyncMongoClient

from ai.api.v1.routes.health import router as health_router
from ai.config.settings import Settings


def create_app(settings: Settings | None = None) -> FastAPI:
    app_settings = settings or Settings()

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        client = AsyncMongoClient(
            app_settings.conversation_mongodb_uri.get_secret_value(),
            serverSelectionTimeoutMS=app_settings.conversation_mongodb_server_selection_timeout_ms,
        )
        application.state.mongo_client = client
        application.state.conversation_database = client[
            app_settings.conversation_mongodb_database
        ]
        try:
            yield
        finally:
            await client.close()

    application = FastAPI(
        title="Product Chatbot API",
        version="0.1.0",
        lifespan=lifespan,
    )
    application.include_router(health_router)
    return application


app = create_app()
