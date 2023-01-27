# uobtheatre-web

## About 🕵️‍♀️

This repository is the frontend for uobtheatre.com, the Shows and Events platform operated by Bristol STA for use by Bristol SU socieities.

## Geting started 🌟

If you are new to programming and/or the repository, we recommend you take a look at our [Beginners Guide](https://github.com/BristolSTA/uobtheatre-web/wiki/Beginners-Guide)

## Running

1. Run `yarn dev`
2. Visit [`http://localhost:3000`](http://localhost:3000) in your browser

You can now edit the project files, and the browser will reload the page automatically.

You can run `yarn lint [--fix]` to lint and fix files.

> By default, you won't be able to test out payments via Square until you add the **sandbox** Square access token to the env file at `.devcontainer/.env` and rebuild the docker container (F1 > Rebuild Container). You will need to get these details from the webmaster.

## Hints and Tips

- If you use the supplied Dev Containers, the API is automatically put up with the dev container on port 9000. In this way, you can access the [GraphQLi interface](localhost:9000/graphql/) and the [Django admin panel](localhost:9000/admin/). This project is setup to automatically expect the API to be running at `localhost:9000`. If it is not (or you want to use a different instance), add `API_BASE={API_URL}` into your `.env` file.

## Compiling and Deploying 🔨

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
