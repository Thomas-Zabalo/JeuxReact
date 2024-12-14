#!/bin/bash
npx cap telemetry off
npm run build
npx cap sync
cd android
echo "Chemin après 'cd android' : $(pwd)"
chmod +x ./gradlew
./gradlew assembleDebug
