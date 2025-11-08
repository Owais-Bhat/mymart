# Fix GitHub Authentication Error - Step by Step

## The Problem
Git is authenticated as `Owais-13` but trying to push to `Owais-Bhat/mymart.git`

## Solution 1: Use Personal Access Token (EASIEST) ✅

### Step 1: Create Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `MyMart App`
4. Expiration: Choose 90 days or No expiration
5. Select scopes: Check **`repo`** (this gives full repository access)
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN** (you won't see it again! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Push with Token
Run this command (replace YOUR_TOKEN with the token you just copied):

```bash
cd /Users/aaradhaya/Desktop/test
git push https://YOUR_TOKEN@github.com/Owais-Bhat/mymart.git main
```

**Example:**
```bash
git push https://ghp_abc123xyz@github.com/Owais-Bhat/mymart.git main
```

### Step 3: Save Token for Future (Optional)
Update remote URL to save token:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Owais-Bhat/mymart.git
git push -u origin main
```

---

## Solution 2: Update Git Credentials

### Clear Old Credentials
```bash
# Clear macOS keychain credentials
git credential-osxkeychain erase
host=github.com
protocol=https
# Press Enter twice
```

### Push and Enter New Credentials
```bash
git push -u origin main
```

When prompted:
- **Username**: `Owais-Bhat`
- **Password**: Your Personal Access Token (NOT your GitHub password!)

---

## Solution 3: Use SSH (Most Secure)

### Step 1: Check if you have SSH key
```bash
ls -al ~/.ssh
```

### Step 2: Generate SSH key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for all prompts (or set a passphrase)
```

### Step 3: Copy your public key
```bash
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

### Step 4: Add SSH key to GitHub
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `My Mac`
4. Key: Paste your public key
5. Click **"Add SSH key"**

### Step 5: Change remote to SSH
```bash
git remote set-url origin git@github.com:Owais-Bhat/mymart.git
git push -u origin main
```

---

## Solution 4: Use GitHub CLI (If Installed)

### Install GitHub CLI (if not installed)
```bash
brew install gh
```

### Login
```bash
gh auth login
# Follow the prompts:
# - GitHub.com
# - HTTPS
# - Authenticate Git with your GitHub credentials
# - Login with a web browser
```

### Push
```bash
git push -u origin main
```

---

## Quick Fix (Try This First!)

If you're logged into GitHub as `Owais-Bhat` in your browser:

```bash
# Update remote URL (no token needed, will prompt)
git remote set-url origin https://github.com/Owais-Bhat/mymart.git

# Try pushing (will prompt for credentials)
git push -u origin main
```

When prompted:
- **Username**: `Owais-Bhat`
- **Password**: Use Personal Access Token (create one if you don't have it)

---

## Verify Your Setup

After pushing, verify it worked:

```bash
git remote -v
# Should show: origin  https://github.com/Owais-Bhat/mymart.git

git log --oneline
# Should show your commits
```

---

## Troubleshooting

### Still getting 403 error?
1. Make sure you created a Personal Access Token
2. Make sure the token has `repo` scope checked
3. Make sure you're using the token as password (not your GitHub password)
4. Try clearing credentials again

### Token not working?
1. Generate a new token
2. Make sure token hasn't expired
3. Check token has correct permissions

### Want to use a different GitHub account?
```bash
# Update Git config
git config --global user.name "Owais-Bhat"
git config --global user.email "your-email@example.com"

# Clear credentials and try again
git credential-osxkeychain erase
```

---

## Recommended: Solution 1 (Personal Access Token)

**This is the easiest and most reliable method!**

Just create a token and use it in the push command. Simple and works every time!

