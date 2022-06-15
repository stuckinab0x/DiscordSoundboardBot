FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
WORKDIR app/
COPY package.json yarn.lock tsconfig.json ./
WORKDIR projects/ui-server
COPY projects/ui-server/package.json projects/ui-server/tsconfig.json projects/ui-server/*.ts ./
COPY projects/ui-server/public/ public/
RUN yarn
ENTRYPOINT ["yarn", "run", "start"]
