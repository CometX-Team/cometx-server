FROM gitpod/workspace-full
FROM gitpod/workspace-postgres

RUN sudo apt-get update \
    && sudo apt-get install -y \
    tool \
    && sudo rm -rf /var/lib/apt/lists/*
