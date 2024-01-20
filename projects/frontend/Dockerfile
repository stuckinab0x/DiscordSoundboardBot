FROM alpine:3.19
EXPOSE 3000
RUN apk add yarn
WORKDIR app
COPY package.json yarn.lock tsconfig.json .eslintrc.json ./
WORKDIR projects/frontend
COPY projects/frontend/index.html projects/frontend/package.json projects/frontend/tsconfig.json projects/frontend/tsconfig.node.json projects/frontend/vite.config.ts ./
COPY projects/frontend/src/ src/
COPY projects/frontend/public/ public/
RUN yarn --pure-lockfile
ENTRYPOINT ["yarn", "run", "start"]
