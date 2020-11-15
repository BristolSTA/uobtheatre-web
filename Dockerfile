  
# pull official base image
FROM node:14-alpine as build

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN yarn
RUN yarn global add @vue/cli

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# run setup script
RUN yarn setup

# build app for production with minification
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "dist" ]