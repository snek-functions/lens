#!/usr/bin/env bash
# shellcheck disable=SC1090

# Check if parameters are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: ./run_playbook.sh <username> <password>"
    exit 1
fi

# Variables
USERNAME="$1"
PASSWORD="$2"
PLAYBOOK="src/internal/playbooks/samba_update_password.yml"
VAULT_PASSWORD_FILE="/pw/pw.private"

# Run playbook
python3 -m ansible playbook -e "username=$USERNAME password=$PASSWORD" $PLAYBOOK --vault-password-file $VAULT_PASSWORD_FILE