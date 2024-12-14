#!/bin/bash
npx cap telemetry off
npm run build
npx cap sync ios
cd ios
echo "Chemin après 'cd ios' : $(pwd)"
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath ./build/App.xcarchive archive
xcodebuild -exportArchive -archivePath ./build/App.xcarchive -exportOptionsPlist ./App/ExportOptions.plist -exportPath ./build/ipa
cd ..

