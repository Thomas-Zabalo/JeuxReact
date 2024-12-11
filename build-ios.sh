#!/bin/bash
npm run build
npx cap sync
cd ios
chmod +x ./gradlew
xcodebuild -workspace ios/App.xcworkspace -scheme App -configuration Debug -derivedDataPath ./build

