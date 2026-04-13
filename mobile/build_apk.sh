#!/usr/bin/env bash
# build_apk.sh — The Curator Mobile: Production Build Script
# Run this from the mobile/ directory: bash build_apk.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$SCRIPT_DIR/android"

echo "=========================================="
echo " The Curator Mobile — Production Build"
echo "=========================================="

# Step 1: Detect Java (prefer 17 or 21, reject 25)
echo ""
echo "[1/5] Detecting Java..."
JAVA_VER=$(java -version 2>&1 | head -1 | sed 's/.*version "\([0-9]*\).*/\1/')
echo "  Active Java version: $JAVA_VER"
if [ "$JAVA_VER" = "25" ] || [ "$JAVA_VER" = "24" ] || [ "$JAVA_VER" = "23" ]; then
  echo "  ⚠️  Java $JAVA_VER is too new for Gradle 8.8. Searching for Java 17 or 21..."
  for v in 21 17; do
    JAVA_PATH=$(update-alternatives --list java 2>/dev/null | grep "java-$v" | head -1)
    if [ -z "$JAVA_PATH" ]; then
      JAVA_PATH=$(find /usr/lib/jvm -name "java" -path "*$v*" 2>/dev/null | head -1)
    fi
    if [ -n "$JAVA_PATH" ]; then
      export JAVA_HOME=$(dirname $(dirname "$JAVA_PATH"))
      echo "  ✅ Found Java $v at: $JAVA_HOME"
      break
    fi
  done
  if [ -z "$JAVA_HOME" ]; then
    echo "  ❌ Java 17 or 21 not found. Installing Java 21..."
    sudo dnf install -y java-21-openjdk-devel
    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
  fi
else
  export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
  echo "  ✅ Using Java $JAVA_VER at: $JAVA_HOME"
fi

# Step 2: Set Android SDK
echo ""
echo "[2/5] Configuring Android SDK..."
ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_HOME
echo "  SDK path: $ANDROID_HOME"
echo "sdk.dir=$ANDROID_HOME" > "$ANDROID_DIR/local.properties"
echo "  ✅ local.properties written"

# Step 3: Accept licenses
echo ""
echo "[3/5] Accepting Android SDK licenses..."
SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
if [ -f "$SDKMANAGER" ]; then
  yes | "$SDKMANAGER" --licenses > /dev/null 2>&1 && echo "  ✅ Licenses accepted"
else
  echo "  ⚠️  sdkmanager not found; skipping license step"
fi

# Step 4: Clean
echo ""
echo "[4/5] Cleaning previous build artifacts..."
cd "$ANDROID_DIR"
./gradlew clean --quiet
echo "  ✅ Clean done"

# Step 5: Build
echo ""
echo "[5/5] Building release APK..."
./gradlew assembleRelease

APK="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK" ]; then
  echo ""
  echo "=========================================="
  echo " ✅ APK READY!"
  echo " Location: $APK"
  echo " Size: $(du -sh "$APK" | cut -f1)"
  echo "=========================================="
  echo ""
  echo "📱 Install on Nothing Phone 1:"
  echo "  adb install $APK"
else
  echo ""
  echo "❌ Build failed — APK not found. Check error output above."
  exit 1
fi
