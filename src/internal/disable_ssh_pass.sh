#!/usr/bin/env bash
# shellcheck disable=SC1090

python3 -m ansible playbook playbooks/disable_ssh_pass.yml --vault-password-file /private/pw.private

