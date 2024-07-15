# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base

LABEL description="This container serves as an entry point for our future Pylon projects."
LABEL org.opencontainers.image.source="https://github.com/cronitio/pylon-template"
LABEL maintainer="opensource@cronit.io"

ARG DEFAULT_PASSPHRASE="changeme"

ENV PYLON_APP_ROOT=/usr/src/pylon \
    PYLON_BUILD_DIR=/temp/dev \
    HOME=/home/bun \
    PASSPHRASE=$DEFAULT_PASSPHRASE

WORKDIR ${PYLON_APP_ROOT}

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
ARG NODE_VERSION=20
RUN apt update \
    && apt install -y curl
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

RUN mkdir -p ${PYLON_BUILD_DIR}
COPY package.json bun.lockb ${PYLON_BUILD_DIR}

RUN cd ${PYLON_BUILD_DIR} && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/

RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install ${PYLON_BUILD_DIR}/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run pylon build

# copy production dependencies and source code into final image
FROM base AS release
RUN apt-get update -y && apt-get install -y openssl
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease ${PYLON_APP_ROOT}/.pylon .pylon
COPY --from=prerelease ${PYLON_APP_ROOT}/package.json .
COPY --from=prerelease ${PYLON_APP_ROOT}/entrypoint.sh .
COPY --from=prerelease ${PYLON_APP_ROOT}/requirements.txt .
COPY --from=prerelease ${PYLON_APP_ROOT}/src/internal src/internal

# Grant bun user permission to write ${PYLON_APP_ROOT}/data
RUN mkdir -p ${PYLON_APP_ROOT}/data
RUN chown -R bun:bun ${PYLON_APP_ROOT}/data

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
    # Copy the built functions to the lambda function
    && pip3 install --no-cache-dir -r requirements.txt \
    && find src -mindepth 1 -maxdepth 1 -not -name internal -exec rm -rf {} + \
    && mkdir -p ${HOME}/.ssh \
    && chown -R bun:bun ${HOME}/.ssh \
    && mkdir -p ${HOME}/.ansible \
    && chown -R bun:bun ${HOME}/.ansible \
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

# Install curl
RUN apt-get update && apt-get install -y curl

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "./entrypoint.sh" ]

VOLUME [ "/usr/src/pylon" ]
