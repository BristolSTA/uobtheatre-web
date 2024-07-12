# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.148.0/containers/javascript-node/.devcontainer/base.Dockerfile

# See here for documentation: https://github.com/devcontainers/images/tree/main/src/javascript-node
ARG VARIANT="20-bookworm"
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
#RUN sudo -u node npm install -g @vue/cli
