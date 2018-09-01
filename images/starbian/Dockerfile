FROM ubuntu:bionic

ENV USER wator
ENV HOME /home/${USER}
ENV SHELL /bin/bash


RUN apt-get update \
    && apt-get install --yes $BUILD_DEPS \
    && apt-get install -y curl 

RUN useradd -m ${USER}
RUN gpasswd -a ${USER} sudo

RUN apt-get install -y nodejs \
    && apt-get install -y build-essential 
RUN nodejs -v
RUN apt-get install -y npm
RUN npm install -g npm@latest
RUN apt-get install -y git
RUN npm install -g node-gyp@latest
RUN npm install -g starbian \
    && npm cache clear --force
