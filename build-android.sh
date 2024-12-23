#!/bin/bash

# Path to the keystore file to be generated
KEYSTORE_PATH="production.keystore"

# Keystore and key passwords
KEYSTORE_PASSWORD="supersecretpassword123"
KEY_ALIAS="my-key"
KEY_PASSWORD="supersecretpassword123"

# Generate the keystore using keytool
keytool -genkeypair -v -keystore $KEYSTORE_PATH -keyalg RSA -keysize 2048 -validity 10000 -alias $KEY_ALIAS -storepass $KEYSTORE_PASSWORD -keypass $KEY_PASSWORD

# Check if the keystore was generated successfully
if [ -f "$KEYSTORE_PATH" ]; then
    echo "Keystore generated successfully."

    # Build the Android app using Capacitor CLI and provide the keystore information
    npx cap build android --keystorepath=$KEYSTORE_PATH --keystorepass=$KEYSTORE_PASSWORD --keystorealias=$KEY_ALIAS --keystorealiaspass=$KEY_PASSWORD --androidreleasetype=AAB
else
    echo "Failed to generate the keystore."
fi