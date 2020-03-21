FROM node:13-slim

WORKDIR /app

ADD index.js package.json package-lock.json /app/

RUN npm ci

USER nobody

VOLUME /config.json

CMD ["node", "index.js"]
