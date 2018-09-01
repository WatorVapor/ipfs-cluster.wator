FROM node:8.11

WORKDIR /usr/src/app

ENV BUILD_DEPS='libnspr4 libnspr4-dev libnss3'
RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && npm install starbian \
    && npm cache clear --force
