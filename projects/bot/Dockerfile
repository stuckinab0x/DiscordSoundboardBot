FROM alpine:3.15 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add git yarn python3 make gcc g++ musl-dev
RUN yarn global add node-gyp
WORKDIR app/
COPY package.json yarn.lock tsconfig.json ./
WORKDIR projects/bot
COPY projects/bot/package.json projects/bot/tsconfig.json ./
COPY projects/bot/src/ src/
WORKDIR ../mongo
COPY projects/mongo/package.json projects/mongo/tsconfig.json ./
COPY projects/mongo/src/ src/
WORKDIR ../sounds
COPY projects/sounds/package.json projects/sounds/tsconfig.json ./
COPY projects/sounds/src/ src/
WORKDIR ../bot
RUN yarn --pure-lockfile

FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
WORKDIR app/projects/bot
ENTRYPOINT ["yarn", "run", "start"]
