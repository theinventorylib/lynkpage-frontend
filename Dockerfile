ARG NODE_IMAGE=oven/bun:1-alpine

# Stage one - Base
FROM --platform=linux/amd64 $NODE_IMAGE AS base

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

# RUN apk --no-cache add openssh g++ make python3 git

# Stage two - Installing Deps
FROM base as install

RUN mkdir -p /temp/

COPY package.json bun.lockb /temp/

RUN cd /temp && bun install --frozen-lockfile

# Stage three - Build
FROM install as prerealease

COPY --from=install /temp/node_modules node_modules

COPY . .

ENV NODE_ENV=production

RUN bun run build

# Stage Four - Production
FROM base as release

COPY --chown=bun:bun --from=install /temp/node_modules node_modules
COPY --chown=bun:bun --from=prerealease ${APP_HOME}/.output .

USER bun
ENV HOST 0.0.0.0
EXPOSE 3000

ENTRYPOINT [ "bun", "run", "server/index.mjs"]
