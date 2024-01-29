FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
RUN bun seed
RUN bun migrate
CMD ["bun", "src/server.ts"]

EXPOSE 3333
