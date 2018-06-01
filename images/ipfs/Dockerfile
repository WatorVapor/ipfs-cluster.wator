FROM node:9.5.0
ENV BUILD_DEPS='libnspr4 libnspr4-dev libnss3'
RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && npm install ipfs --production \
    && npm cache clear --force
