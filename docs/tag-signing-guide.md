# Tag Signing Guide

> **Security Level**: Recommended for production releases

This guide explains how to sign Git tags for Greater Components releases and how consumers can verify the authenticity of releases.

## Why Sign Tags?

Signed releases provide:

- **Authenticity**: Proof that the release was created by a trusted maintainer
- **Integrity**: Assurance that the release hasn't been tampered with
- **Non-repudiation**: A cryptographic record of who created the release

## Signing Releases (Maintainers)

### Option 1: GPG Signing (Traditional)

#### Setup GPG

1. **Generate a GPG key** (if you don't have one):

   ```bash
   gpg --full-generate-key
   ```

   - Choose RSA and RSA (default)
   - Key size: 4096 bits
   - Expiration: 1-2 years recommended

2. **Configure Git to use GPG**:

   ```bash
   # List your keys
   gpg --list-secret-keys --keyid-format=long

   # Set your signing key
   git config --global user.signingkey <YOUR_KEY_ID>

   # Enable tag signing by default
   git config --global tag.gpgsign true
   ```

3. **Export your public key** (for key distribution):

   ```bash
   gpg --armor --export <YOUR_KEY_ID> > my-public-key.asc
   ```

#### Create Signed Tags

```bash
# Sign a tag (explicit)
git tag -s greater-v4.2.0 -m "Release 4.2.0"

# Or use the release script with --sign
pnpm release:tag --sign
```

### Option 2: SSH Signing (Modern)

SSH signing is simpler if you already use SSH keys for GitHub authentication.

#### Setup SSH Signing

1. **Configure Git to use SSH signing**:

   ```bash
   # Use your existing SSH key
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/id_ed25519.pub

   # Enable tag signing by default
   git config --global tag.gpgsign true
   ```

2. **Create an allowed signers file** (for verification):

   ```bash
   # Create ~/.config/git/allowed_signers
   echo "maintainer@example.com $(cat ~/.ssh/id_ed25519.pub)" >> ~/.config/git/allowed_signers

   # Configure Git to use it
   git config --global gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers
   ```

#### Create Signed Tags

```bash
# Sign a tag (explicit)
git tag -s greater-v4.2.0 -m "Release 4.2.0"

# Or use the release script with --sign
pnpm release:tag --sign
```

## Verifying Releases (Consumers)

### Using the Greater CLI

The CLI can verify tag signatures during installation:

```bash
# Verify signature when adding components
greater add button --verify-signature

# Verify signature during init
greater init --verify-signature
```

If the tag is unsigned or verification fails, the CLI will warn you but proceed unless you use `--require-signature`:

```bash
# Fail if signature is invalid or missing
greater add button --require-signature
```

### Manual Verification

You can verify tags manually using Git:

```bash
# Clone the repo
git clone https://github.com/equaltoai/greater-components.git
cd greater-components

# Verify a specific tag
git tag -v greater-v4.2.0
```

Expected output for a valid GPG signature:
```
gpg: Signature made Mon Dec 15 10:00:00 2025 EST
gpg:                using RSA key ABC123...
gpg: Good signature from "Maintainer Name <maintainer@example.com>"
```

Expected output for a valid SSH signature:
```
Good "git" signature for maintainer@example.com with ED25519 key SHA256:...
```

### Importing Maintainer Keys

To verify signatures, you need the maintainer's public key:

#### GPG Keys

```bash
# Import from keyserver
gpg --keyserver keyserver.ubuntu.com --recv-keys <KEY_ID>

# Or import from file
gpg --import maintainer-key.asc
```

#### SSH Keys

Add the maintainer's public key to your allowed signers file:

```bash
echo "maintainer@example.com ssh-ed25519 AAAA... maintainer@example.com" >> ~/.config/git/allowed_signers
```

## Verification Status Messages

The CLI uses these status messages for signature verification:

| Status | Icon | Meaning |
|--------|------|---------|
| `valid` | ✅ | Signature is valid and trusted |
| `invalid` | ❌ | Signature is present but verification failed |
| `unsigned` | ⚠️ | Tag has no signature |
| `unknown_key` | ⚠️ | Signature exists but key is not trusted |
| `expired` | ⚠️ | Signature key has expired |
| `error` | ❌ | Verification process failed |

## Security Best Practices

### For Maintainers

1. **Protect your signing key** - Use a strong passphrase
2. **Sign all releases** - Enable `tag.gpgsign = true` in Git config
3. **Use a dedicated signing key** - Separate from your regular commit signing key
4. **Document your public key** - Publish it in the repo and on keyservers
5. **Set key expiration** - Rotate keys periodically (every 1-2 years)

### For Consumers

1. **Verify signatures** - Use `--verify-signature` for production installs
2. **Import maintainer keys** - Trust keys from official sources only
3. **Check for warnings** - Review CLI output for signature status
4. **Pin specific refs** - Don't rely on `latest` for critical deployments

## Troubleshooting

### "gpg: Can't check signature: No public key"

Import the maintainer's public key:
```bash
gpg --keyserver keyserver.ubuntu.com --recv-keys <KEY_ID>
```

### "error: gpg failed to sign the data"

Ensure your GPG agent is running:
```bash
gpgconf --launch gpg-agent
```

### "error: SSH key not found"

Check your SSH key path:
```bash
git config --get user.signingkey
```

### SSH signing not working on macOS

Add this to `~/.ssh/config`:
```
Host *
  AddKeysToAgent yes
  UseKeychain yes
```

## Reference

- [Git Documentation: Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [GitHub: Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [OpenSSH Release Notes (SSH signing)](https://www.openssh.com/txt/release-8.0)
