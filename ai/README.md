# Product chatbot backend

The `ai` project is the private Python AI microservice for the product chatbot. It uses a `src/` layout and a modular-monolith architecture inside the service. The frontend calls the Express backend only; the backend owns the catalog and public API, and AI calls the backend's private catalog APIs. AI has a separate MongoDB database for bounded conversation history. The existing notebooks and nutrition-document experiments remain separate from the product catalog application.

## Requirements

- Python 3.14 (see `.python-version`)
- [uv](https://docs.astral.sh/uv/)
- Node.js backend running on port 4000 for local end-to-end development
- MongoDB for the AI conversation store; the backend separately owns the catalog Atlas deployment

## Local AI service setup

From the `ai` directory:

```powershell
uv sync --group dev
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
uv run pytest
uv run ruff check .
uv run ai
```

The local AI service listens on `http://127.0.0.1:8000`. OpenAPI documentation is available at `/docs`; liveness and conversation-store readiness checks are at `/health/live` and `/health/ready`. In deployed environments, keep the AI service on private networking and accept chat traffic only from the backend. The backend's public chat endpoint is the only browser entry point.

To run the preserved notebook experiments, install their isolated dependency group with `uv sync --group dev --group experiments`.

## Configuration and secrets

Use `.env` for local, non-committed AI configuration. `.env.example` contains placeholders only. Never commit credentials or paste them into logs. In deployment, inject secrets through the platform's secret manager. AI chat-model selection is separate from the backend's catalog embedding/index configuration.

## Architecture and implementation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for service and sequence diagrams, [PLAN.md](./PLAN.md) for implementation phases and requirement traceability, and the project-specific [backend skill](./skills/product-chatbot-backend/SKILL.md) for package boundaries and conventions. The AI startup and conversation-store foundation are in place; cross-service chat, catalog APIs, and tool orchestration remain planned work.