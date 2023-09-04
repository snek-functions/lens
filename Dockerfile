# SPDX-License-Identifier: (EUPL-1.2)
# Copyright © 2022 snek.at
FROM --platform=linux/amd64 node:18.8.0-slim

LABEL description="This container serves as an entry point for our future Snek Function projects."
LABEL org.opencontainers.image.source="https://github.com/snek-functions/lens"
LABEL maintainer="opensource@snek.at"

ARG DEFAULT_PASSPHRASE="changeme"

ENV LAMBDA_TASK_ROOT=/var/task \
    SNEK_FUNCTIONS_BUILD_DIR=/tmp/snek-functions \
    HOME=/var/task \
    PASSPHRASE=$DEFAULT_PASSPHRASE

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=amazon/aws-lambda-nodejs:latest /usr/local/bin/aws-lambda-rie /usr/local/bin/aws-lambda-rie
COPY --from=amazon/aws-lambda-nodejs:latest /var/runtime /var/runtime
COPY --from=amazon/aws-lambda-nodejs:latest /var/lang /var/lang
COPY --from=amazon/aws-lambda-nodejs:latest lambda-entrypoint.sh .
COPY --from=amazon/aws-lambda-nodejs:latest /etc/pki/tls/certs/ca-bundle.crt /etc/pki/tls/certs/ca-bundle.crt
# Override /bin/sh because some scripts are only compatible with the amazon version
COPY --from=amazon/aws-lambda-nodejs:latest /bin/sh /bin/sh

# Add static files from . to task root
COPY package.json entrypoint.sh ${LAMBDA_TASK_ROOT}/
# Copy all files form the . to the build dir
COPY ./ ${SNEK_FUNCTIONS_BUILD_DIR}/

RUN chmod +x entrypoint.sh

WORKDIR ${SNEK_FUNCTIONS_BUILD_DIR}

# Update, install and cleaning:
RUN set -ex \
    && BUILD_DEPS=" \
    build-essential \
    python3-dev \
    python3-pip \
    python3-setuptools \
    " \
    && apt-get update && apt-get install -y --no-install-recommends $BUILD_DEPS \
    #&& ln -s /usr/local/bin/node /var/lang/bin/node \
    && yarn install --production \
    && yarn sf build \
    # Copy the built functions to the lambda function
    && rm -rf venv \
    && mkdir -p venv/bin \
    && ln -s $(which python3) venv/bin/python \
    && venv/bin/python -m pip install -U pip \
    && venv/bin/python -m pip install -r requirements.txt \
    && find src -mindepth 1 -maxdepth 1 -not -name internal -exec rm -rf {} + \
    && mv .sf src node_modules venv ${LAMBDA_TASK_ROOT} \
    && rm -r ${SNEK_FUNCTIONS_BUILD_DIR}/* \
    && mkdir -p ${LAMBDA_TASK_ROOT}/.ssh \
    && mkdir -p ${LAMBDA_TASK_ROOT}/ansible \
    && touch ${LAMBDA_TASK_ROOT}/ansible/.ansible.cfg \
    && ln -s ${LAMBDA_TASK_ROOT}/ansible/.ansible.cfg ${LAMBDA_TASK_ROOT}/.ansible.cfg \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false $BUILD_DEPS \
    && rm -rf /var/lib/apt/lists

# Install packages needed to run your application (not build deps):
# We need to recreate the /usr/share/man/man{1..8} directories first because
# they were clobbered by a parent image.
RUN set -ex \
    && RUN_DEPS=" \
    python3 \
    openssh-client \
    " \
    && seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{} \
    && apt-get update && apt-get install -y --no-install-recommends $RUN_DEPS \
    && rm -rf /var/lib/apt/lists/*

WORKDIR ${LAMBDA_TASK_ROOT}

EXPOSE 3000

ENTRYPOINT [ "./entrypoint.sh" ]

# Start in serverless mode
#CMD [ "app.handler" ]

# SPDX-License-Identifier: (EUPL-1.2)
# Copyright © 2022 snek.at
