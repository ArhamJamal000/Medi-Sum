# Building iOS IPA for Medi-Sum

> ⚠️ **Requires macOS** with Xcode 15+ installed

## Prerequisites

1. **macOS** (Monterey 12.0 or later)
2. **Xcode 15+** from App Store
3. **Apple Developer Account** (for distribution)
4. **Node.js** (v18 or later)
5. **CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

## Setup Steps

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Build Web Assets

```bash
npm run build
```

### 3. Initialize iOS Project

```bash
# Add iOS platform (first time only)
npx cap add ios

# Sync web assets
npx cap sync ios
```

### 4. Configure API URL

Edit `mobile/capacitor.config.json`:

```json
{
  "server": {
    "url": "https://your-backend-url.com"
  }
}
```

### 5. Install CocoaPods Dependencies

```bash
cd ios/App
pod install
cd ../..
```

### 6. Open in Xcode

```bash
npx cap open ios
```

## Build for Development

### Simulator Testing

1. In Xcode: Select iPhone simulator
2. Click ▶️ Run button
3. App launches in simulator

### Device Testing

1. Connect iPhone via USB
2. In Xcode: Select your device
3. Sign the app (see Signing section)
4. Click ▶️ Run

## Code Signing

### Automatic Signing (Recommended)

1. In Xcode: Select project in navigator
2. Go to **Signing & Capabilities**
3. Check **Automatically manage signing**
4. Select your Development Team
5. Wait for provisioning profile to generate

### Manual Signing

1. Create App ID at [developer.apple.com](https://developer.apple.com)
2. Create Provisioning Profile
3. Download and double-click to install
4. In Xcode: Select provisioning profile manually

## Build for Distribution

### 1. Archive Build

1. In Xcode: Product > Archive
2. Wait for archive to complete
3. Organizer window opens automatically

### 2. Export IPA

#### For TestFlight / App Store:

1. Select archive in Organizer
2. Click **Distribute App**
3. Select **App Store Connect**
4. Follow prompts to upload

#### For Ad Hoc Distribution:

1. Select archive in Organizer
2. Click **Distribute App**
3. Select **Ad Hoc**
4. Export IPA file

### 3. Install via TestFlight

1. Upload to App Store Connect
2. Add testers in TestFlight
3. Testers install via TestFlight app

## App Store Submission

### Required Assets

- **App Icon**: 1024x1024 PNG
- **Screenshots**: Various iPhone/iPad sizes
- **Privacy Policy URL**
- **App Description**

### Info.plist Permissions

Ensure these are in `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Medi-Sum needs camera access to scan prescriptions</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Medi-Sum needs photo library access to upload prescriptions</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Medi-Sum saves prescription images to your library</string>
```

### Submit for Review

1. Complete App Store Connect listing
2. Upload build via Xcode or Transporter
3. Select build for review
4. Submit for App Review

## Common Issues

### Pod Install Fails

```bash
cd ios/App
pod repo update
pod install --repo-update
```

### Signing Issues

- Ensure Apple Developer account is active
- Check certificate validity
- Regenerate provisioning profiles if expired

### Build Errors

```bash
# Clean build
cd ios/App
xcodebuild clean
pod deintegrate
pod install
```

## Alternative: Cloud Build

If you don't have a Mac, use cloud build services:

- **Codemagic** (free tier available)
- **Bitrise**
- **App Center**
- **Expo EAS** (if using Expo)

These services provide macOS VMs for iOS builds.
