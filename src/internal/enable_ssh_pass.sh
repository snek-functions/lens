#!/usr/bin/env bash
# shellcheck disable=SC1090

python3 -m ansible playbook playbooks/enable_ssh_pass.yml --vault-password-file /private/pw.private

