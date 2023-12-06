#!/usr/bin/env bash

# Check if the required parameters are provided
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <username> <password> <userid> <vault_key>"
    exit 1
fi

USERNAME="$1"
PASSWORD="$2"
USERID="$3"
VAULT_KEY="$4"

# Properly format the token value
TOKEN_VALUE="username=${USERNAME}, password=${PASSWORD}"

# Create JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "token": "$TOKEN_VALUE"
}
EOF
)

# Use the created JSON payload in the curl request
RESPONSE=$(curl -k -s -X PUT \
    -H "X-Vault-Token: ${VAULT_KEY}" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD" \
    "https://192.168.1.102:8200/v1/users/${USERID}/samba")

# Handle response
if echo "$RESPONSE" | grep -q "errors"; then
    echo "Error updating Samba credentials:"
    echo "$RESPONSE"
    exit 1
else
    echo "Samba credentials updated successfully."
fi