# web-app

## Docker setup

Create a local Compose environment file before running the app:

```sh
cp .env.example .env
```

Edit `.env` with the SSH tunnel and database values. `EC2_SSH_KEY_HOST_PATH`
must be the private key path on your host machine; Compose exposes it to the
backend container at `/run/secrets/ec2_ssh_key`.

Run the stack with:

```sh
docker compose up --build
```

## Data scripts

`scripts/get_trivia_questions.py` appends unique, HTML-decoded Open Trivia DB
questions to `data/trivia_questions.json`. `OPEN_TRIVIA_DB_TOKEN` is optional.

`scripts/dump_trivia_questions.py` seeds the database from
`data/trivia_questions.json` and reads SSH/database settings from the root
`.env`. For local runs, set `EC2_SSH_KEY_PATH` to the private key path on your
host machine.
