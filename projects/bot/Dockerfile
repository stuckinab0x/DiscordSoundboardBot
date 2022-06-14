FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add git yarn
WORKDIR app/
COPY package.json yarn.lock ./
WORKDIR projects/bot
COPY projects/bot/package.json projects/bot/tsconfig.json ./
COPY projects/bot/src/ src/
WORKDIR ../sounds
COPY projects/sounds/package.json projects/sounds/tsconfig.json ./
COPY projects/sounds/src/ src/
RUN yarn
WORKDIR ../bot
ENTRYPOINT ["yarn", "run", "start"]
