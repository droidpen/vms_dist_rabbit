#!/bin/bash
# sync.sh - Sync code and vault with source of truth

echo "--- Syncing Code from Git ---"
git pull origin main

echo "--- Syncing Vault via Rclone ---"
# Note: Ensure 'remote' is configured in rclone to point to your cloud storage
rclone sync remote:vms-vault/cipher ./cipher

echo "--- Synchronization Complete ---"
EOF
chmod +x VMS/sync.sh
