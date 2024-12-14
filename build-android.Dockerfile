FROM ubuntu:latest

ARG JAVA_VERSION=17
ARG NODEJS_VERSION=20
# See https://developer.android.com/studio/index.html#command-tools
ARG ANDROID_SDK_VERSION=11076708
# See https://developer.android.com/tools/releases/build-tools
ARG ANDROID_BUILD_TOOLS_VERSION=34.0.0
# See https://developer.android.com/studio/releases/platforms
ARG ANDROID_PLATFORMS_VERSION=34
# See https://gradle.org/releases/
ARG GRADLE_VERSION=8.6
# See https://www.npmjs.com/package/@capacitor/cli
ARG CAPACITOR_VERSION=6.2.0

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=fr_FR.UTF-8

WORKDIR /tmp

RUN apt-get update -q

# Paquets génériques
RUN apt-get install -qy \
    apt-utils \
    locales \
    gnupg2 \
    build-essential \
    curl \
    usbutils \
    git \
    unzip \
    p7zip p7zip-full \
    python3 \
    openjdk-${JAVA_VERSION}-jre \
    openjdk-${JAVA_VERSION}-jdk

# Définir la locale
RUN locale-gen fr_FR.UTF-8 && update-locale

# Installer Gradle
ENV GRADLE_HOME=/opt/gradle
RUN mkdir $GRADLE_HOME \
    && curl -sL https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -o gradle-${GRADLE_VERSION}-bin.zip \
    && unzip -d $GRADLE_HOME gradle-${GRADLE_VERSION}-bin.zip
ENV PATH=$PATH:/opt/gradle/gradle-${GRADLE_VERSION}/bin

# Installer Android SDK tools
ENV ANDROID_HOME=/opt/android-sdk
RUN curl -sL https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip -o commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && unzip commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && mkdir $ANDROID_HOME && mv cmdline-tools $ANDROID_HOME \
    && yes | $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses \
    && $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" "platforms;android-${ANDROID_PLATFORMS_VERSION}"
ENV PATH=$PATH:${ANDROID_HOME}/cmdline-tools:${ANDROID_HOME}/platform-tools

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

# Application: Installation + Build
COPY . ./
RUN npm install -g npx
RUN npm install capp
RUN chmod +x ./build-android.sh

# Lancer le build
CMD ./build-android.sh