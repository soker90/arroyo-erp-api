FROM node:18.15.0

RUN mkdir -p /home/node/app/ /var/log \
  && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

ENV TZ Europe/Madrid

COPY --chown=node:node package.json package-lock.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3008

CMD ["npm", "start"]
