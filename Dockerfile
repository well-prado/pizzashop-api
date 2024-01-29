FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production && \
    bun migrate && \
    bun seed

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/server.ts"]

EXPOSE 3333
