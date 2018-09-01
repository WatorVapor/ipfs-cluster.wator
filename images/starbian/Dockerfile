FROM ubuntu:bionic

RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y build-essential 
RUN npm install -g npm@latest \
    && npm install -g starbian \
    && npm cache clear --force
