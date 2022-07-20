FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
WORKDIR app/
COPY package.json yarn.lock tsconfig.json ./
WORKDIR projects/ui-server
COPY projects/ui-server/package.json projects/ui-server/tsconfig.json ./
COPY projects/ui-server/src/ src/
WORKDIR ../sounds
COPY projects/sounds/package.json projects/sounds/tsconfig.json ./
COPY projects/sounds/src/ src/
WORKDIR ../ui-server
RUN yarn --pure-lockfile
ENTRYPOINT ["yarn", "run", "start"]
