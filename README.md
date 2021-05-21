# uobtheatre-web

## About 🕵️‍♀️

This repository is the frontend for uobtheatre.com, the Shows and Events platform operated by Bristol STA for use by Bristol SU socieities.

## Geting started 🌟

Here is what we recommend you have installed and use to develop:

- [Visual Studio Code](https://code.visualstudio.com/) - A code editor
- [Docker](https://www.docker.com/get-started) - Develop without cluttering your PC

> Side note: If you use our devcontainer setup, you will need to authenticate with the GitHub container registry so we can get uobtheatre-api! Follow the steps [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry)

If you have the above, install the [VS Code Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), and when you open the folder with VS code, click open in remote container, and you'll be set up ready for the next step!

## Installing the application

1. Run `yarn dev`
2. Visit [`http://localhost:3000`](http://localhost:3000) in your browser

You can now edit the project files, and the browser will reload the page automatically.

You can run `yarn lint [--fix]` to lint and fix files.

> By default, you won't be able to test out payments via Square until you add the **sandbox** Square access token to the env file at `.devcontainer/.env` and rebuild the docker container (F1 > Rebuild Container)

## Project Structure and Form 🌴

This project utilises the following:

- [Nuxt JS](https://nuxtjs.org/) - A powerful framework Vue applications
- [Vue JS](https://vuejs.org/) - A progressive JavaScript framework for reactive content
- [Tailwindcss](https://tailwindcss.com/) - A utility-first CSS framework

Here are the important areas to take a look at:

- `/components/` This folder contains reusable Vue components that are used across multiple components and pages
- `/graphql/` This folder contains GraphQL queries, fragments and partials that are used by the application. Use this for larger, more complex queries.
- `/layouts/` This folder contains the different page layouts available to Nuxt pages. The default layout is `default.vue`.
- `/middleware/` This folder contains middleware available to pages, such as `authed` and `not-authed`.
- `/pages/` This folder contains all the pages for the application. The folder structure automatically generates the routes for the application. (Read more on that [here](https://nuxtjs.org/docs/2.x/features/file-system-routing))

## To build and deploy 🔨

This application targets a "static" site (frequently known as a SPA). It does not use the SSR or Universal app mode that is available with Nuxt.

To build on a standalone system:

1. Create the `.env` file from the example. Edit this as required.
2. Run `yarn generate`
3. Deploy the files from `/dist`

Checkout the `.env.example` file to see the environment variables to set/override

## Testing 👨‍💻

### Unit Tests

```
yarn test:unit
```

Add `--watch` to automatically re-run tests as you change files

### End-to-end tests

Start the server with `yarn pretest:e2e:local` (for testing with the local docker live api).

Then run:

```
yarn test:e2e:silent
```
