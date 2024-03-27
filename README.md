# amd-group-test

This project aims to implement a REST API using the HAPI framework with the following features:
- Fetching Currency Rates from a Third-Party API
- Endpoints for retrieving currency rates for a specified date

## Prerequisites

Before you start developing, make sure you have the following prerequisites installed.

**Bun.js**: If you haven't installed Bun.js yet, you can do so using the following command:
```bash
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.30"
```
Then, install all Bun dependencies by running:
```bash
bun install
```
**Docker**: If you haven't installed Docker yet, you can do so using the following [link](https://docs.docker.com/engine/install/ubuntu/)

## Configs
Do not forget about dotenv configuration file. Copy example and change environments:
```bash
cp .env.example .env
```

## Migrations

To generate migrations use shell command:
```shell
bun typeorm migration:generate ./common/migrations/init -d ./common/configs/typeORMConfig.ts
```

## Build
To build and run the project run next command:
```bash
docker-compose -f docker-compose.yml --env-file .env up --build
```
