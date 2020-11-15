# uobtheatre-web

## About 🕵️‍♀️

This repository is the frontend for uobtheatre.com, the Shows and Events platform operated by Bristol STA for use by Bristol SU socieities.

## Geting started 🌟

Here is what we recommend you have installed and use to develop:

- [Visual Studio Code](https://code.visualstudio.com/) - A code editor
- [Docker](https://www.docker.com/get-started) - Develop without cluttering your PC

If you have the above, install the [VS Code Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), and when you open the folder with VS code, click open in remote container, and you'll be set up ready for the next step!

## Installing the application

1. Run `yarn`
2. Run `yarn serve`
3. Visit the URL output in the command line

You can now edit the project files, and the browser will reload the page automatically.

You can run `yarn lint` to lint and fix files.

## Project Structure and Form 🌴

This project utilises the following:

- [Vue CLI](https://cli.vuejs.org/) - Handles the compiliation and chores in the repository
- [Vue JS](https://vuejs.org/) - A progressive JavaScript framework for reactive content
- [Tailwindcss](https://tailwindcss.com/) - A utility-first CSS framework

Here are the important areas to take a look at:

- `/public/` This folder contains the base HTML file that is compiled and used as the entry point for the application. Other files in here are copied like-for-like over into the dist folder during the build process
- `/src/` This folder contains all the JS and CSS for the application
  - `/src/views/` This folder contains all the pages for the application. These are later referenced by the router
  - `/src/router/` This folder contains the configuration for the router, which decides what to show to a user depending on their URI
  - `/src/components/` This folder contains the Vue components utilised in the views

## To build and deploy 🔨

To build on a standalone system:

1. Run `yarn build`
2. Run `yarn setup` to create the `.env` file from the example. Edit this as required.
3. Deploy the files from `/dist`

If using docker:

1. `docker run --rm -it -p 8080:8080 $(docker build -q .)`

Checkout the `.env.example` file to see the environment variables to set/override

## Testing 👨‍💻

### Unit Tests

```
yarn test:unit
```

### End-to-end tests

```
yarn test:e2e --headless
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
