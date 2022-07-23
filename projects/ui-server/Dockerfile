FROM alpine:3.15 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add yarn
WORKDIR app/
COPY package.json yarn.lock tsconfig.json ./
WORKDIR projects/ui-server
COPY projects/ui-server/package.json projects/ui-server/tsconfig.json projects/ui-server/webpack.config.ts ./
COPY projects/ui-server/src/ src/
WORKDIR ../sounds
COPY projects/sounds/package.json projects/sounds/tsconfig.json ./
COPY projects/sounds/src/ src/
WORKDIR ../ui-server
RUN yarn --pure-lockfile
RUN if [ "$NODE_ENV" = "production" ] ; then yarn run build:web ; rm -rf webpack.config.ts src/scripts/ ; fi

FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
WORKDIR app/projects/ui-server
ENTRYPOINT ["yarn", "run", "start"]
