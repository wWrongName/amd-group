FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
RUN bun install

COPY . .

RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
