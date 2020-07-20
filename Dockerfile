FROM alpine
ENV NODE_ENV=production
WORKDIR app/
COPY package.json LICENSE yarn.lock ./
COPY src/ src/
RUN apk add yarn && yarn
# RUN apk add yarn make libtool autoconf automake python3 gcc musl-dev zlib-dev && yarn global add node-gyp && yarn
ENTRYPOINT ["yarn", "run", "start"]
