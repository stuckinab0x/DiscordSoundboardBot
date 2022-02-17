FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
WORKDIR app/
COPY package.json yarn.lock ./
RUN yarn
COPY LICENSE tsconfig.json ./
COPY src/ src/
# RUN apk add yarn make libtool autoconf automake python3 gcc musl-dev zlib-dev && yarn global add node-gyp && yarn
ENTRYPOINT ["yarn", "run", "start"]
