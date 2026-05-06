FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

COPY pyproject.toml ./
RUN uv sync --no-dev

COPY backend/ .

ENV FLASK_APP=app.py \
    FLASK_RUN_HOST=0.0.0.0 \
    FLASK_RUN_PORT=5001 \
    PYTHONUNBUFFERED=1

EXPOSE 5001

CMD ["uv", "run", "flask", "run"]
