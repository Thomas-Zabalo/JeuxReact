#!/bin/bash
npm run build
npx cap telemetry off
npx cap sync
cd android
chmod +x ./gradlew
./gradlew assembleDebug
