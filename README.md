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
