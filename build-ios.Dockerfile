FROM macos-latest

# Installer CocoaPods et autres dépendances iOS
RUN brew install cocoapods

# Installer Node.js et Capacitor
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update -q && apt-get install -qy nodejs \
    && npm install -g npx capacitor

# Configurer votre projet pour iOS
WORKDIR /app
COPY . .
RUN npm install
RUN npx cap sync ios

# Build iOS IPA
CMD ./build-ios.sh
