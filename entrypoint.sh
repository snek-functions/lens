#!/bin/sh

cp -f /.ssh/..data/* ${LAMBDA_TASK_ROOT}/.ssh/
chmod 600 -Rv ${LAMBDA_TASK_ROOT}/.ssh/

bun pylon-server --https --key /private/tls.key --cert /private/tls.crt --passphrase $PASSPHRASE
