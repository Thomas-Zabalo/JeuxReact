FROM ubuntu:24.04

# Variables d'environnement pour le build iOS
ARG NODEJS_VERSION=20
ARG CAPACITOR_VERSION=6.2.0

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8

# Installer les dépendances
RUN apt-get update -q && \
    apt-get install -qy \
    curl \
    git \
    build-essential \
    python3 \
    openjdk-17-jre \
    openjdk-17-jdk \
    xz-utils \
    unzip \
    ruby-full \
    libxml2-dev \
    libxslt-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer Node.js
RUN curl -sL https://deb.nodesource.com/setup_${NODEJS_VERSION}.x | bash - \
    && apt-get update -q && apt-get install -qy nodejs
ENV NPM_CONFIG_PREFIX=${HOME}/.npm-global
ENV PATH=$PATH:${HOME}/.npm-global/bin

# Nettoyer
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

WORKDIR /workdir

# Copier le projet et installer les dépendances
COPY . ./
RUN npm install

# Synchroniser Capacitor et construire l'IPA
RUN npx cap sync ios
RUN npx cap open ios

CMD ["npx", "cap", "sync", "ios", "&&", "xcodebuild", "-workspace", "ios/App.xcworkspace", "-scheme", "App", "-configuration", "Release", "-archivePath", "ios/build/App.xcarchive", "archive"]
