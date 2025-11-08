# How to Push to GitHub

## Option 1: Using Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "MyMart App"
4. Select scope: **repo** (check the box)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Push Using Token
Run this command (replace YOUR_TOKEN with your actual token):

```bash
git push https://YOUR_TOKEN@github.com/Owais-Bhat/mymart.git main
```

Or update the remote URL:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Owais-Bhat/mymart.git
git push -u origin main
```

## Option 2: Update Git Credentials

### Clear stored credentials:
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```

Then try pushing again. You'll be prompted for credentials.

## Option 3: Use SSH (Alternative)

### Step 1: Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Step 2: Add SSH Key to GitHub
1. Copy your public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste your key and save

### Step 3: Change Remote to SSH
```bash
git remote set-url origin git@github.com:Owais-Bhat/mymart.git
git push -u origin main
```

## Option 4: Use GitHub CLI

If you have GitHub CLI installed:
```bash
gh auth login
git push -u origin main
```

## Quick Fix (If you're the owner)

If you're logged into the correct GitHub account in your browser, you can try:

```bash
# This will prompt you to authenticate
git push -u origin main
```

If prompted, use:
- Username: Owais-Bhat
- Password: Your Personal Access Token (not your GitHub password)

---

**Note**: GitHub no longer accepts passwords for git operations. You must use a Personal Access Token.

