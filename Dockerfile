FROM node:20.18.3-alpine3.20

ENV PNPM_HOME="/pnpm"
ENV PATH $PNPM_HOME:$PATH
RUN corepack enable

# FIX: Bad workaround (https://github.com/nodejs/corepack/issues/612)
ENV COREPACK_INTEGRITY_KEYS=0

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
