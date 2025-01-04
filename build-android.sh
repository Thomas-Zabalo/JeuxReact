#!/bin/bash
npx cap telemetry off
npm run build
npx cap sync android
cd android
chmod +x ./gradlew
./gradlew assembleDebug
cd ..