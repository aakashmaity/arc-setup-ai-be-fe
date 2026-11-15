# Implementation Plan: Forma Product Chatbot Services

**Date**: 2026-11-15 | **Spec**: Product Chatbot with Tool Calling (user-provided)

## Summary

Deliver the product-chat feature across three separately deployed services: the Next.js frontend, the Express backend, and the FastAPI/LangChain AI service. The browser calls only the backend's public API. The backend owns caller authentication/session controls, the canonical product catalog, and MongoDB Atlas search. It calls AI over a private authenticated API; AI tools call narrow backend catalog APIs for current product facts. AI owns model orchestration and a separate TTL-bounded conversation store. No service shares another service's database credentials. Existing nutrition and Chroma notebooks remain isolated experiments.

## Technical Context

**Language/Version**: Python 3.14; `uv` project with a `src/` layout  
**Primary Dependencies**: Express 5/Mongoose/Zod backend; FastAPI/Pydantic Settings/LangChain AI service; internal HTTP APIs with service identity  
**Storage**: Backend-owned MongoDB Atlas for canonical products, variants, and derived search index; AI-owned conversation store with seven-day TTL  
**Testing**: Node's built-in test runner for backend; pytest/pytest-asyncio/HTTPX for AI; contract and integration tests across internal APIs  
**Target Platform**: Three independently deployed services on private service networking; Atlas-backed staging environment  
**Performance Goals**: 60-second overall chat deadline, at most four tool rounds and eight tool executions per request, retrieval capped at twenty results  
**Constraints**: INR default with no currency conversion; backend is the browser-facing API/BFF; no shared databases; AI cannot access catalog credentials or issue arbitrary queries; product descriptions are untrusted data

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for Mermaid service and sequence diagrams, service ownership, security boundaries, and latency strategy.

```text
Browser → Frontend → Backend public API/BFF → private AI API
                            ↑                     │
                            └── catalog APIs ← validated AI tools
                                 │               │
                         Backend MongoDB      AI conversation store
```

Use service-owned data and private contracts. The backend is the sole owner of product records, derived search documents, Atlas queries, and catalog embedding/index synchronization. AI calls a backend catalog API for search, details, and comparison; it never connects to the catalog database. The AI service owns only conversation persistence and model orchestration. The backend validates browser requests and binds the anonymous/authenticated session, then sends a short-lived signed session context to AI. AI validates tool inputs, calls narrow backend endpoints, and grounds its answer in their fresh results. Both directions use service identity, propagated trace IDs, and a shared absolute deadline. Chat-model profiles remain server-selected and embedding configuration remains independent of chat-model selection.

## Constitution Check

No project `constitution.md` was present during planning. This plan follows the supplied constraints: strict boundaries, typed input validation, least-privilege data access, no arbitrary model-generated queries, current canonical product facts, bounded execution, and explicit failure modes. Revisit this check if project principles are added.

## Applied Guidelines

- Preserve the existing `src/ai` package and keep notebooks/experiments separate.
- Use `uv` for dependency resolution and lockfile maintenance.
- Keep HTTP schemas, domain/service behavior, persistence, and provider integrations in distinct modules.
- Keep product/catalog persistence in `backend/`; do not share MongoDB access with `ai/`.
- Keep the browser-facing chat endpoint in the backend BFF and the model-facing endpoint private to the AI service.
- Keep secrets out of source control; provide only placeholder values in `.env.example`.
- Use typed settings, strict Pydantic request schemas, and focused unit/integration tests.
- Maintain project-specific backend conventions in `skills/product-chatbot-backend/SKILL.md`.

## Implementation Steps

### Step 1: [Cross-cutting] Establish the Python service foundation
- **Requirements**: REQ-001, REQ-010
- **Description**: Create the private FastAPI service foundation, settings for the backend internal URL and AI-owned conversation store, lifespan-managed conversation Mongo client, health routes, development/test dependency groups, and the layered package skeleton.
- **Plan items**:
  - **1.1** Configure a reproducible `uv` project with runtime, development, and notebook-experiment dependencies.
    - [x] T001 [Plan:1.1] Declare application and development dependencies and keep notebook dependencies in the experiments group in `ai/pyproject.toml`; resolve them in `ai/uv.lock`.
    - [x] T002 [Plan:1.1] Create the layered `src/ai` package skeleton, test directories, project skill, and service diagrams; document local setup in `ai/README.md` and `ai/ARCHITECTURE.md`.
  - **1.2** Establish private-service settings, application composition, conversation-store lifecycle, health endpoints, and local setup documentation.
    - [x] T003 [Plan:1.2] Implement typed backend URL/conversation-store settings, FastAPI application factory, and lifespan-managed AI conversation MongoDB client in `ai/src/ai/config/settings.py` and `ai/src/ai/api/app.py`.
    - [x] T004 [Plan:1.2] Add liveness/readiness routes and focused API tests in `ai/src/ai/api/v1/routes/health.py` and `ai/tests/unit/`.
    - [x] T005 [Plan:1.2] Add placeholder local settings and ignore local credentials in `ai/.env.example` and `ai/.gitignore`.

### Step 2: [Cross-cutting] Define backend-owned catalog and ingestion
- **Requirements**: REQ-002, REQ-003
- **Description**: Keep product and variant records, Atlas collections/indexes, synthetic seeds, and derived search indexing in the Express backend. Generate/update vectors only when descriptive content changes; update price, stock, and status metadata without re-embedding.
- **Plan items**:
  - **2.1** Add catalog domain/validation schemas, collections, and indexes in the backend.
    - [ ] T006 [Plan:2.1] Define product/variant models, request schemas, collection indexes, and backend service boundaries in `backend/src/schema/`, `backend/src/validators/`, and `backend/src/`.
  - **2.2** Add idempotent seed/import and incremental indexing commands with content hash and embedding version tracking.
    - [ ] T007 [Plan:2.2] Implement backend catalog seeding/import, derived-index synchronization, and versioned embedding configuration in `backend/src/` and backend scripts.

### Step 3: [Cross-cutting] Implement backend catalog search APIs
- **Requirements**: REQ-004
- **Description**: Implement internal backend search/detail/compare operations. Backend repositories build safe Atlas text/vector queries, apply identical filters, fuse ranked candidates, and re-read canonical records. AI can reach these operations only over an authenticated internal API. Database failure remains distinct from no matches.
- **Plan items**:
  - **3.1** Implement allowlisted backend filters, hybrid retrieval, RRF, and keyword fallback.
    - [ ] T008 [Plan:3.1] Implement validated catalog search inputs, Atlas search, RRF, and typed retrieval status in `backend/src/validators/`, `backend/src/services/`, and `backend/src/repositories/`.
  - **3.2** Add internal catalog API contracts and canonical product/variant rereads.
    - [ ] T009 [Plan:3.2] Add authenticated internal search/details/compare routes that return current matching variants in `backend/src/routers/`, `backend/src/controllers/`, and `backend/src/services/`.
  - **3.3** Add freshness, deleted-record, fallback, result-cap, and database-failure coverage.
    - [ ] T010 [Plan:3.3] Cover fresh catalog data, deleted products, keyword fallback, result caps, API contracts, and distinct database failures in backend tests.

### Step 4: [Cross-cutting] Add validated product tools
- **Requirements**: REQ-005
- **Description**: Implement `search_products`, `get_product_details`, and `compare_products` as strict AI tools over a typed backend catalog API client. Backend independently validates every request and returns consistent envelopes with current facts or typed errors.
- **Plan items**:
  - **4.1** Implement bounded, extra-forbidden tool schemas and allowlisted dispatch.
    - [ ] T011 [Plan:4.1] Define strict tool schemas, typed envelopes, and allowlisted dispatch in `ai/src/ai/schemas/` and `ai/src/ai/tools/`.
  - **4.2** Implement typed internal backend client and search/detail/compare tool adapters.
    - [ ] T012 [Plan:4.2] Implement authenticated, deadline-aware catalog API client and tool operations in `ai/src/ai/services/` and `ai/src/ai/tools/`.
  - **4.3** Test unknown tools, invalid IDs/arguments, raw query injection, variant constraints, money handling, and execution caps.
    - [ ] T013 [Plan:4.3] Add tool/schema/dispatch tests and backend API contract tests for injection, money, variant filters, errors, and execution budgets in `ai/tests/` and `backend/test/`.

### Step 5: [Cross-cutting] Integrate model profiles and chat orchestration
- **Requirements**: REQ-006, REQ-007
- **Description**: Add a shared LangChain factory in AI for configured OpenAI, Gemini, and Ollama chat profiles. Keep backend catalog embedding/index configuration independent from chat-model profiles. Verify enabled models support tools; orchestrate bounded calls to backend catalog APIs, preserve tool-call IDs, and ask clarifying questions rather than inventing catalog facts.
- **Plan items**:
  - **5.1** Implement named server-side model profiles and provider factory with capability verification.
    - [ ] T014 [Plan:5.1] Add explicit AI chat profiles and provider/tool-capability checks in `ai/src/ai/integrations/chat_models/`.
  - **5.2** Implement bounded tool-call loop and typed tool-result handling.
    - [ ] T015 [Plan:5.2] Implement the bounded LangChain tool loop with preserved tool-call IDs in `ai/src/ai/orchestration/`.
  - **5.3** Add profile smoke tests and conversation cases for discovery, constraints, comparisons, follow-ups, ambiguity, and no matches.
    - [ ] T016 [Plan:5.3] Add provider smoke tests and grounded conversation acceptance cases in `ai/tests/conversation/`.

### Step 6: [Cross-cutting] Deliver secure chat API and operations
- **Requirements**: REQ-008, REQ-010
- **Description**: Add the public `POST /api/v1/chat` to the backend BFF and a private chat endpoint to AI. Backend authenticates the browser session and sends signed scoped context; AI stores bounded history keyed to that verified context. Apply controls at the public edge and internal service boundaries; keep AI model selection private.
- **Plan items**:
  - **6.1** Implement backend public chat proxy and private AI chat endpoint.
    - [ ] T017 [Plan:6.1] Add public backend `POST /api/v1/chat` and private AI chat endpoint/contracts in `backend/src/routers/`, `backend/src/controllers/`, and `ai/src/ai/api/v1/`.
  - **6.2** Implement signed session context, conversation TTL, ownership, and per-conversation turn serialization.
    - [ ] T018 [Plan:6.2] Add signed backend-to-AI session claims and AI-owned conversation persistence/serialization in `backend/src/` and `ai/src/ai/repositories/`.
  - **6.3** Add request-size/CORS/rate/deadline/retry controls and category-based logging.
    - [ ] T019 [Plan:6.3] Add public-edge and internal-call controls, propagated deadlines, bounded retries, and redacted logs in `backend/src/` and `ai/src/ai/api/`.
  - **6.4** Verify readiness against conversation storage, AI service, and backend catalog dependencies.
    - [ ] T020 [Plan:6.4] Implement dependency-aware readiness and backend/AI service health contracts in `backend/src/app.js` and `ai/src/ai/api/v1/routes/health.py`.
  - **6.5** Document least-privilege identities, secret management, private networking, deployment, and staging validation.
    - [ ] T021 [Plan:6.5] Document per-service database roles, service authentication, secret injection, deployment, and staging validation in `ai/ARCHITECTURE.md` and `ai/README.md`.

### Step 7: [Cross-cutting] Add model evaluation and acceptance validation
- **Requirements**: REQ-009, REQ-010
- **Description**: Implement a repeatable evaluation command against the backend-owned catalog API using the same catalog data, prompts, tools, and embeddings across selected AI profiles. Export correctness, grounding, relevance, latency, token usage, and failures. Validate service contracts and acceptance behavior in staging before frontend integration.
- **Plan items**:
  - **7.1** Implement evaluation case runner and machine-readable result export.
    - [ ] T022 [Plan:7.1] Implement multi-profile evaluation and export correctness, grounding, relevance, latency, token, and failure metrics in `ai/src/ai/evaluation/`.
  - **7.2** Validate all enabled profiles and acceptance cases against staging Atlas.
    - [ ] T023 [Plan:7.2] Run enabled-profile smoke tests and curated FE→BE→AI acceptance cases against staging services; record results without committing credentials.

## Project Structure

```text
frontend/
  src/app/                         # Public UI; calls backend only
backend/
  src/routers/v1/                  # Public API/BFF and internal catalog routes
  src/controllers/
  src/services/
  src/repositories/                # Sole owner of catalog queries
  src/schema/                      # Canonical product/variant models
  src/validators/
  test/
ai/
  ARCHITECTURE.md                  # Service and request-flow diagrams
  PLAN.md
  .env.example
  skills/product-chatbot-backend/SKILL.md
  pyproject.toml
  uv.lock
  src/ai/
    api/v1/routes/                 # Private chat contract and AI health
    config/                        # Backend URL, model profiles, conversation store
    integrations/chat_models/
    orchestration/
    tools/                         # Strict schema and allowlisted dispatch
    services/                      # Internal backend catalog API client
    repositories/                  # AI-owned conversation persistence only
    schemas/
    evaluation/
  tests/
    unit/
    integration/
    conversation/
```

Keep each service independently deployable and its database private. Backend repositories own all product/catalog persistence; AI repositories own conversation persistence only. Keep the frontend unaware of AI provider details and internal service URLs.

## Testing Strategy

- **appType**: API-only
- **Critical user journeys**: constrained product discovery; product details with current variant facts; comparison of selected SKUs; follow-up using conversation history; ambiguous request clarification; no-match response.
- **primaryValidationStack**: Node built-in test runner for Express, pytest/pytest-asyncio and HTTPX for FastAPI, service contract tests, and Atlas-compatible integration environment.
- **fallbackMatrix**:
  - `infra-tier`: MongoDB Atlas-compatible test deployment for backend hybrid-search/index tests → backend repository unit tests with mocked collection adapters. The fallback does not validate Atlas search syntax or index readiness.
  - `browser-tier`: Not applicable; this phase delivers no frontend.
- **Environment requirements**: Node.js 22.18+, Python 3.14, uv, MongoDB Atlas with text/vector indexes, private service networking, and configured provider credentials for smoke/evaluation runs.
- **knownGaps**: Unit-test mocks cannot prove Atlas search behavior or cross-service identity configuration; model tests require provider access and should be opt-in outside staging.
- **Test data strategy**: Seed synthetic products/variants with deterministic IDs and SKUs; isolate conversations by generated session; clean test data after integration runs.
- **Acceptance criteria**: Frontend uses only the public backend API; backend owns catalog truth and verifies browser sessions; AI has no catalog database access; explicit filters match the returned variant; cards contain current catalog facts; dependency failures remain distinct from no matches; all enabled profiles pass tool-calling smoke tests.
- **Validation review expectations**: Check service authentication, strict contracts, model/tool-round caps, session isolation, propagated deadlines, bounded retries, redacted logs, per-service readiness, and evaluation output before frontend integration.

## Requirement Mapping

| REQ ID | Description | Plan Items | Implementation Evidence |
|--------|-------------|------------|------------------------|
| REQ-001 | Separate FE/BE/AI deployments, FastAPI/Express service boundaries, provider integrations, per-service lifecycle | 1.1, 1.2 | `ai/pyproject.toml`, `ai/src/ai/api/`, `backend/src/app.js`, `ai/ARCHITECTURE.md` |
| REQ-002 | Backend-owned product/variant catalog and indexes | 2.1 | `backend/src/schema/`, `backend/src/validators/`, `backend/src/repositories/` |
| REQ-003 | Idempotent backend catalog seed and incremental derived-search indexing | 2.2 | `backend/src/` ingestion/indexing commands and scripts |
| REQ-004 | Filtered Atlas hybrid retrieval, RRF, fallback, and fresh canonical records behind backend API | 3.1, 3.2, 3.3 | `backend/src/repositories/`, `backend/src/services/`, backend tests |
| REQ-005 | Three validated AI tools over authenticated backend catalog APIs | 4.1, 4.2, 4.3 | `ai/src/ai/tools/`, `ai/src/ai/services/`, backend internal routes |
| REQ-006 | Configured OpenAI/Gemini/Ollama chat profiles and independent catalog embedding config | 5.1, 5.3 | `ai/src/ai/integrations/chat_models/`, backend catalog embedding/index config |
| REQ-007 | Bounded tool orchestration and grounded conversational behavior | 5.2, 5.3 | `ai/src/ai/orchestration/`, AI conversation tests |
| REQ-008 | Public backend chat API, private AI endpoint, scoped session history, controls and telemetry | 6.1, 6.2, 6.3 | `backend/src/routers/`, `backend/src/controllers/`, `ai/src/ai/api/v1/`, `ai/src/ai/repositories/` |
| REQ-009 | Cross-profile evaluation metrics and export | 7.1, 7.2 | `ai/src/ai/evaluation/`, AI conversation tests |
| REQ-010 | Per-service readiness, least privilege, service identity, secret management, staging guidance | 1.2, 6.4, 6.5, 7.2 | `ai/ARCHITECTURE.md`, `ai/.env.example`, `backend/src/app.js`, staging integration tests |
