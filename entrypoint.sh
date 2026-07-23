#!/bin/sh

cp -f /.ssh/..data/* ${HOME}/.ssh/
chmod 600 -v ${HOME}/.ssh/*

cp -f /.ansible/..data/.ansible.cfg ${HOME}/
chmod 600 -Rv ${HOME}/.ansible.cfg

cp -f /.ansible/..data/* ${HOME}/.ansible/

# Pylon v3: the standalone `pylon-server` binary is gone. Bun serves the built
# artifact's default export directly; TLS + WebSocket are configured in
# src/index.ts (reads /private/tls.{key,crt} and $PASSPHRASE when present).
exec bun run .pylon/index.js
