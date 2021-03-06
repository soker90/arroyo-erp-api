FROM node:14

RUN mkdir -p /home/node/app/ /var/log \
  && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

ENV TZ Europe/Madrid

COPY package.json package-lock.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3008

CMD ["npm", "start"]
