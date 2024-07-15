#!/bin/sh

cp -f /.ssh/..data/* ${PYLON_APP_ROOT}/.ssh/
chmod 600 -Rv ${PYLON_APP_ROOT}/.ssh/

cp -f /.ssh/..data/.ansible.cfg ${PYLON_APP_ROOT}/
chmod 600 -Rv ${PYLON_APP_ROOT}/.ansible.cfg
cp -f /.ssh/..data/* ${PYLON_APP_ROOT}/.ansible/
chmod 600 -Rv ${PYLON_APP_ROOT}/.ansible/

bun pylon-server --https --key /private/tls.key --cert /private/tls.crt --passphrase $PASSPHRASE
