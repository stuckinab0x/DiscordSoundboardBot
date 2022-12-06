FROM alpine:3.15 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add yarn
WORKDIR app
COPY package.json yarn.lock tsconfig.json ./
WORKDIR projects/web
COPY projects/web/package.json projects/web/tsconfig.json ./
COPY projects/web/src/ src/
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
RUN if [ "$NODE_ENV" = "production" ] ; then set -e; yarn run build ; mv build ../web/src/public ; rm -rf ../frontend ; fi

FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
WORKDIR app/projects/web
ENTRYPOINT ["yarn", "run", "start"]
