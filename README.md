# uobtheatre-web

## About 🕵️‍♀️

This repository is the frontend for uobtheatre.com, the Shows and Events platform operated by Bristol STA for use by Bristol SU socieities.

## Geting started 🌟

Here is what we recommend you have installed and use to develop:

- [Visual Studio Code](https://code.visualstudio.com/) - An free awesome code editor
- [Docker](https://www.docker.com/get-started) - Develop without cluttering your PC (essentially creates mini-VMs that are perfectly setup to run the code)

> Side note: If you use our devcontainer setup, you will need to authenticate with the GitHub container registry so we can get uobtheatre-api! Follow the steps [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry)

You should then clone this repository to somewhere on your PC. If using Windows Subsystem Linux (WSL), make sure to clone into your WSL filesystem.

**We highly recommend you use VS Code to develop on this project**. It includes multiple bits and bobs that will make your expierence better, and this project has been configured to take advantage of it's automation. If you are using VS Code, this project includes a Dev Container - this allows VS Code to automatically put up all of the required docker containers and manage these for you, with no work requried! Simply install the [VS Code Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)if you don't have it already, open the folder containing the code, and click "Open in remote container" when the notification pops up in the bottom right.

## Installing the application

1. Run `yarn dev`
2. Visit [`http://localhost:3000`](http://localhost:3000) in your browser

You can now edit the project files, and the browser will reload the page automatically.

You can run `yarn lint [--fix]` to lint and fix files.

> By default, you won't be able to test out payments via Square until you add the **sandbox** Square access token to the env file at `.devcontainer/.env` and rebuild the docker container (F1 > Rebuild Container). You will need to get these details from the webmaster.

## Project Structure and Form 🌴

This project utilises the following:

- [Nuxt JS](https://nuxtjs.org/) - A powerful framework for Vue applications
- [Vue JS](https://vuejs.org/) - A progressive JavaScript framework for reactive content
- [Tailwindcss](https://tailwindcss.com/) - A utility-first CSS framework

Here are the important areas to take a look at:

- `/components/` This folder contains reusable Vue components that are used across multiple components and pages
- `/graphql/` This folder contains GraphQL queries, fragments and partials that are used by the application. Use this for larger, more complex queries.
- `/layouts/` This folder contains the different page layouts available to Nuxt pages. The default layout is `default.vue`.
- `/middleware/` This folder contains middleware available to pages, such as `authed` and `not-authed`.
- `/pages/` This folder contains all the pages for the application. The folder structure automatically generates the routes for the application. (Read more on that [here](https://nuxtjs.org/docs/2.x/features/file-system-routing))

If you use VS Code, the uobtheatre-api is automatically put up with the dev container on port 9000.
In this way, you can access the [GraphQLi interface](localhost:9000/graphql/) and the [Django admin panel](localhost:9000/admin/).
This project is setup to automatically expect the API to be running at `localhost:9000`. If it is not (or you want to use a different instance), add `API_BASE={API_URL}` into your `.env` file.

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
