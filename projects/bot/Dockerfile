FROM alpine:3.19 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add git yarn python3 make gcc g++ musl-dev
RUN yarn global add node-gyp
WORKDIR app
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
WORKDIR ../users
COPY projects/users/package.json projects/users/tsconfig.json ./
COPY projects/users/src/ src/
WORKDIR ../frontend
COPY projects/frontend/package.json projects/frontend/tsconfig.json ./
COPY projects/frontend/src/ src/
COPY projects/frontend/public/ public/
RUN yarn --pure-lockfile
RUN if [ "$NODE_ENV" = "production" ] ; then set -e; yarn run build ; mv dist ../bot/src/web/public ; rm -rf ../frontend ; fi

FROM alpine:3.19
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
WORKDIR app/projects/bot
ENTRYPOINT ["yarn", "run", "start"]
