FROM alpine:3.15
EXPOSE 3000
RUN apk add yarn
WORKDIR app
COPY package.json yarn.lock tsconfig.json .eslintrc.json ./
WORKDIR projects/frontend
COPY projects/frontend/package.json projects/frontend/tsconfig.json ./
COPY projects/frontend/src/ src/
COPY projects/frontend/public/ public/
RUN yarn --pure-lockfile
ENTRYPOINT ["yarn", "run", "start"]
