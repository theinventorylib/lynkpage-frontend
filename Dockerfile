ARG NODE_VERSION=lts-alpine
# Build step 1: initializing node_modules and preparing compiled builds
FROM node:lts-alpine as base

# ARG BUILD_ENVIRONMENT=production
ARG APP_HOME=/app

# npm build
FROM base as deps
WORKDIR ${APP_HOME}
COPY package.json ./

# update npm
RUN npm install -g npm@latest

# set npm config for proxy and long timeout
# Remove Proxies
RUN npm config rm proxy
RUN npm config rm https-proxy

RUN npm install

FROM base as build
WORKDIR ${APP_HOME}
COPY --from=deps ${APP_HOME}/node_modules ./node_modules
COPY . .

RUN npm prune

# ARG NUXT_PUBLIC_HOME_URL
# AENV NUXT_PUBLIC_HOME_URL=${NUXT_PUBLIC_HOME_URL}
# AARG NUXT_PUBLIC_API_URL
# AENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

RUN npm run build

FROM base as prod
WORKDIR ${APP_HOME}
ENV NODE_ENV=production

# AARG NUXT_PUBLIC_HOME_URL
# AENV NUXT_PUBLIC_HOME_URL=${NUXT_PUBLIC_HOME_URL}
# AARG NUXT_PUBLIC_API_URL
# AENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

COPY --from=build  ${APP_HOME}/.output ./.output

CMD [ "node", ".output/server/index.mjs" ]
