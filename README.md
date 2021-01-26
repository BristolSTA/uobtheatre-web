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
2. Run `yarn setup` to copy the environment file
3. Run `yarn serve`
4. Visit the URL output in the command line

You can now edit the project files, and the browser will reload the page automatically.

You can run `yarn lint [--fix]` to lint and fix files.

## Project Structure and Form 🌴

This project utilises the following:

- [Vue CLI](https://cli.vuejs.org/) - Handles the compiliation and chores in the repository
- [Vue JS](https://vuejs.org/) - A progressive JavaScript framework for reactive content
- [Tailwindcss](https://tailwindcss.com/) - A utility-first CSS framework
- [MirageJS](https://miragejs.com/) - Provides a client-side framework to "mock" the real API server ([uobtheatre-api](https://github.com/BristolSTA/uobtheatre-api))

Here are the important areas to take a look at:

- `/public/` This folder contains the base HTML file that is compiled and used as the entry point for the application. Other files in here are copied like-for-like over into the dist folder during the build process
- `/src/` This folder contains all the JS and CSS for the application
  - `/src/views/` This folder contains all the pages for the application. These are later referenced by the router
  - `/src/router/` This folder contains the configuration for the router, which decides what to show to a user depending on their URI
  - `/src/components/` This folder contains reusable Vue components that are used across multiple views and pages
  - `/src/fakeApi/` This folder contains the files that setup the fake "mock" api instance for development environments
  - `/src/services/` This folder contains the interfaces to the API, which are called inside Vue components / pages to fetch to put data to the API
  - `/src/assets/` This folder currently only contains the SCSS entrypoint for the application. Because we are using Tailwind, you shouldn't really need to touch this at all
  - `/src/Playground.example.vue` If you don't want to go through the effort of creating a page component, linking it in the router, etc. to test out a component, copy this file to `/src/Playground.vue` and run `yarn run playground`. This will serve a sandbox environment for you to tinker around with

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
