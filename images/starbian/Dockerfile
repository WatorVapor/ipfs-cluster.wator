FROM node:8.11

RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && npm install -g starbian \
    && npm cache clear --force
