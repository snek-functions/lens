#!/usr/bin/env bash
# shellcheck disable=SC1090

# Check if parameters are provided
if [ "$#" -ne 5 ]; then
    echo "Usage: ./run_playbook.sh <username> <password>"
    exit 1
fi

# Variables
USERNAME="$1"
PASSWORD="$2"
EMAIL="$3"
FIRSTNAME="$4"
LASTNAME="$5"
PLAYBOOK="src/internal/playbooks/samba_create_or_update_user.yml"
VAULT_PASSWORD_FILE="/pw/pw.private"

# Run playbook
python3 -m ansible playbook -e "username=$USERNAME password=$PASSWORD email=$EMAIL firstname=$FIRSTNAME lastname=$LASTNAME" $PLAYBOOK --vault-password-file $VAULT_PASSWORD_FILE