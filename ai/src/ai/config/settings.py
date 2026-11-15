from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    backend_internal_url: str = "http://localhost:4000"
    conversation_mongodb_uri: SecretStr = SecretStr("mongodb://localhost:27017")
    conversation_mongodb_database: str = "ai_conversations"
    conversation_mongodb_server_selection_timeout_ms: int = 2_000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
