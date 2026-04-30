# Trivia Web App

React and Flask trivia app backed by a MySQL-compatible database. The frontend
lets players filter trivia questions, answer a quiz, and view their score. The
backend fetches questions and calculates scores using server-side answer lookup.

## Prerequisites

- Docker and Docker Compose, or:
- Node.js 20+ and npm for the frontend
- Conda for the Flask backend
- A MySQL-compatible database reachable through the configured SSH tunnel

## Environment

Create a local environment file from the template:

```sh
cp .env.example .env
```

Fill in the SSH tunnel and database values in `.env`.

- `EC2_SSH_KEY_HOST_PATH` is used by Docker Compose. Compose exposes that file
  to the backend container at `/run/secrets/ec2_ssh_key`.
- `EC2_SSH_KEY_PATH` is used by local script/backend runs.
- `REACT_APP_API_BASE_URL` is the browser-facing backend URL used by the React
  dev server.

## Database

Create the database schema before seeding or running the app:

```sh
mysql -h <db-host> -u <db-user> -p < database/schema.sql
```

The schema creates:

- `trivia_questions`: question metadata and correct answers
- `wrong_answers`: incorrect answers linked to `trivia_questions`

Seed the database from the normalized JSON dataset:

```sh
python3 -m scripts.dump_trivia_questions
```

The seed script reads SSH/database settings from `.env`.

## Frontend

Install dependencies from the committed lockfile:

```sh
cd frontend
npm ci
```

Useful commands:

```sh
npm start
npm test -- --watchAll=false
npm run build
```

## Backend

Create the Conda environment:

```sh
cd backend
conda env create -f environment.yml
```

Run the Flask app locally:

```sh
conda run --no-capture-output -n flask_app_dev_env flask --app app.py run --host 0.0.0.0 --port 5001
```

## Docker

After creating `.env`, run the stack with:

```sh
docker compose up --build
```

The frontend is exposed on `FRONTEND_PORT` and the backend on `BACKEND_PORT`.
Both default to `3000` and `5001`.

## Data Scripts

`scripts/get_trivia_questions.py` appends unique, HTML-decoded Open Trivia DB
questions to `data/trivia_questions.json`. `OPEN_TRIVIA_DB_TOKEN` is optional.

`scripts/dump_trivia_questions.py` seeds the database from
`data/trivia_questions.json` and skips duplicate question stems.
