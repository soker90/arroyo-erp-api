FROM node:20.17.0-alpine3.20

ENV PNPM_HOME="/pnpm"
ENV PATH $PNPM_HOME:$PATH
RUN corepack enable

RUN mkdir -p /home/node/app/ /var/log \
  && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

ENV TZ Europe/Madrid

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node . .

EXPOSE 3008

CMD ["pnpm", "start"]
