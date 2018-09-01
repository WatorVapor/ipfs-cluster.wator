FROM ubuntu:bionic

RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && apt-get install -y curl 
RUN apt-get install -y nodejs \
    && apt-get install -y build-essential 
RUN nodejs -v
RUN apt-get install -y npm
RUN npm install -g npm@latest
RUN apt-get install -y git
RUN npm install node-gyp@latest
RUN npm install -g starbian \
    && npm cache clear --force
