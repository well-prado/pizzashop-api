FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["sh", "-c", "bun src/db/migrate.ts && bun src/db/seed.ts && bun src/server.ts"]
# CMD ["bun", "src/server.ts"]

EXPOSE 3333
