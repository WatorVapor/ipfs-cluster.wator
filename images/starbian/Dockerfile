FROM ubuntu:bionic

ENV USER wator
ENV HOME /home/${USER}
ENV SHELL /bin/bash


RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && apt-get install -y curl sudo

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs

RUN npm install -g npm@latest
RUN apt-get install -y git
RUN npm install starbian \
    && npm cache clear --force
