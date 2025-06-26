#!/data/data/com.termux/files/usr/bin/bash

### 🔐 CONFIG
REPO_DIR="$HOME/gamblecodez-bitsler"
GITHUB_BRANCH="main"
FLY_API_TOKEN="fm2_lJPECAAAAAAACJ+KxBDU6Z1+eX8J9VjNFsmIdVrxwrVodHRwczovL2FwaS5mbHkuaW8vdjGWAJLOABAsFB8Lk7lodHRwczovL2FwaS5mbHkuaW8vYWFhL3YxxDyhlm5iA/CvT7RREcUM1lmoyb+IRZR9D5KFAFpmKLrobyj6ZjYqPkyLfdQYhxxrSJckotmx6ceW4ZFsBj7ETkW4ZnAazKaGvss8JTyfSTtopXQoRIRPozDJHRPoYdRJ5Rj6fvNKwvP0YBRCvsjV/hR2w50G4NLmvIdYGkPbLZngjCPWmLVkOwCZpnHkCg2SlAORgc4AgP02HwWRgqdidWlsZGVyH6J3Zx8BxCDpAz/0UfyFCdueyatI4ixCJve1hFr22STBU1Ved+q2Kg=="
APP_NAME="gamblecodez-bitsler"

### 🏁 Step 1: Go to project
cd "$REPO_DIR" || { echo "❌ Repo not found at $REPO_DIR"; exit 1; }

### ⬇️ Step 2: Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin "$GITHUB_BRANCH"

### 🔑 Step 3: Auth with Fly.io token
echo "🔐 Authenticating to Fly.io..."
fly auth token "$FLY_API_TOKEN"

### 🚀 Step 4: Deploy (remote to avoid Docker issues on Android)
echo "🚀 Deploying to Fly.io..."
fly deploy --remote-only --app "$APP_NAME"

### 🌐 Step 5: Open app
fly open --app "$APP_NAME"
