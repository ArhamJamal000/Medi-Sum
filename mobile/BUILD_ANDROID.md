# Building Android APK for Medi-Sum

## Prerequisites

1. **Node.js** (v18 or later)
2. **Android Studio** with:
   - Android SDK (API level 33 or higher)
   - Android SDK Build Tools
   - Android SDK Platform Tools
3. **Java JDK 17**

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

### 3. Initialize Android Project

```bash
# Add Android platform (first time only)
npx cap add android

# Sync web assets to Android project
npx cap sync android
```

### 4. Configure API URL

Edit `mobile/capacitor.config.json`:

```json
{
  "server": {
    "url": "https://your-backend-url.com",
    "cleartext": true
  }
}
```

### 5. Open in Android Studio

```bash
npx cap open android
```

### 6. Build Debug APK

In Android Studio:
1. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. The APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 7. Build Release APK (Production)

#### Create Keystore (first time only)

```bash
keytool -genkey -v -keystore release.keystore -alias medisum \
  -keyalg RSA -keysize 2048 -validity 10000
```

#### Configure Signing

Create `android/app/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=release.keystore
MYAPP_UPLOAD_KEY_ALIAS=medisum
MYAPP_UPLOAD_STORE_PASSWORD=your-password
MYAPP_UPLOAD_KEY_PASSWORD=your-password
```

Edit `android/app/build.gradle`, add in `android` block:

```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

#### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Testing on Device

### Via USB Debugging

1. Enable Developer Options on phone
2. Enable USB Debugging
3. Connect phone via USB
4. In Android Studio: Run > Select device > Run

### Via APK Install

```bash
adb install app-debug.apk
```

## Common Issues

### SDK Not Found

Set ANDROID_HOME environment variable:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Gradle Build Fails

```bash
cd android
./gradlew clean
./gradlew build
```

### Camera Permission

Ensure `android/app/src/main/AndroidManifest.xml` includes:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```
