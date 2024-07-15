#!/bin/sh

cp -f /.ssh/..data/* ${HOME}/.ssh/
chmod 600 -Rv ${HOME}/.ssh/

cp -f /.ansible/..data/.ansible.cfg ${HOME}/
chmod 600 -Rv ${HOME}/.ansible.cfg

cp -f /.ansible/..data/* ${HOME}/.ansible/

bun pylon-server --https --key /private/tls.key --cert /private/tls.crt --passphrase $PASSPHRASE
