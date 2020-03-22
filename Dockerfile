FROM arm32v7/node:13-slim

COPY qemu-arm-static /usr/bin

WORKDIR /app

ADD index.js package.json package-lock.json /app/

RUN npm ci

USER nobody

VOLUME /config.json

CMD ["node", "index.js"]
