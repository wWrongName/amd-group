# Amd-Group

This project aims to implement a REST API using the HAPI framework with the following features:
- Fetching Currency Rates from a Third-Party API.
- Endpoints for retrieving currency rates for a specified date.

## Prerequisites

Before diving into development, ensure that you have the following prerequisites set up.

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
Don't forget to configure the dotenv file. Copy the example and adjust the environments accordingly:
```bash
cp .env.example .env
```

## Migrations

To generate migrations, utilize the following shell command:
```shell
bun typeorm migration:generate ./common/migrations/init -d ./common/configs/typeORMConfig.ts
```

## Build

To build and run the project just execute one of the following command:
```bash
bun run build
```
or
```bash
docker-compose -f docker-compose.yml --env-file .env up --build
```

## Endpoints
The API exposes the following endpoints:
- Get all the exchange rates for a specific date. Example:
```
GET http://{your_url}:3000/currencies/all?date=2024-03-27T13:37:17.810Z
```
- Get a currency pair for a specific date. Be sure to specify the base and target tickers. Example:
```
GET http://{your_url}:3000/currencies/custom?base=RUB&target=EUR&date=2024-03-27T13:37:17.810Z
```
