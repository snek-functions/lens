#!/usr/bin/env bash
# shellcheck disable=SC1090

# Check if parameters are provided
if [ "$#" -ne 4 ]; then
    echo "Usage: ./run_playbook.sh <credentials>"
    exit 1
fi

# Variables
CREDENTIALS="$1"
PLAYBOOK="src/internal/playbooks/samba_create_or_update_user.yml"
VAULT_PASSWORD_FILE="/pw/pw.private"

# Run playbook
python3 -m ansible playbook -e "credentials=$CREDENTIALS" $PLAYBOOK --vault-password-file $VAULT_PASSWORD_FILE