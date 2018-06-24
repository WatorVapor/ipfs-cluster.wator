FROM node:8.11

WORKDIR /usr/src/app
COPY ./init-and-daemon.sh /usr/src/app

ENV IPFS_WRTC_LINUX_WINDOWS=1
ENV IPFS_BOOTSTRAP=1
ENV IPFS_MONITORING=1
ENV IPFS_PATH=/data/ipfs
ENV IPFS_API_HOST=0.0.0.0

ENV BUILD_DEPS='libnspr4 libnspr4-dev libnss3'
RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && npm install ipfs --production \
    && npm install wrtc --production \
    && npm cache clear --force

CMD ./init-and-daemon.sh
