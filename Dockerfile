FROM node:alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

WORKDIR /opt/app

COPY . /opt/app

RUN yarn

RUN yarn build

RUN npx next telemetry disable

CMD [ "yarn", "start"]