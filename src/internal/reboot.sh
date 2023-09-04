#!/usr/bin/env bash
# shellcheck disable=SC1090

python3 -m ansible playbook playbooks/reboot.yml --ask-vault-pass

