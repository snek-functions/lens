#!/usr/bin/env bash
# shellcheck disable=SC1090

python3 -m ansible playbook src/internal/playbooks/deploy.yml --ask-vault-pass

