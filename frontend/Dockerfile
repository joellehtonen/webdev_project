
# syntax=docker/dockerfile:1

# comments are provided throughout this file to help you get started.
# if you need more help, visit the dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# want to help us make this template better? share your feedback here: https://forms.gle/ybq9krt8jtbl3ick7

arg node_version=20.18.0

from node:${node_version}-alpine

# use production node environment by default.
env node_env development

workdir /usr/src/app

# download dependencies as a separate step to take advantage of docker's caching.
# leverage a cache mount to /root/.npm to speed up subsequent builds.
# leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
run --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# copy the rest of the source files into the image.
#copy --chown=node:node . .
copy . .

run npm install . && chown -R node:node .

# run the application as a non-root user.
user node

# expose the port that the application listens on.
expose 3000

# run the application.
cmd npm start
