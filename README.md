# DApp-generator

## Install

- Install `yo` globally: `npm i -g yo`.
- In the root of the project run: `yarn`.
- Link the generator module, in the root of the project run: `npm link`.
- To clone the project run: `yo dapp`. You will be prompted to choose the name under which the project will be created. This will clone the project and install the dependencies.
- When it finishes your project will be in the newlly created folder with the name you selected on the previous step.
- To initialize the `api`:
  - A `neo4j` instance must be running on `localhost:7687`. The default `neo4j` url:port can be changed in `src/js/api/.env`
  - Go to `src/js/api` and run: `yarn start:dev`
  - The `api` is running at `https://localhost/8443`
    - The default `api` url:port can be changed in `src/js/api/.env`
- To initialize the `web-app`:
  - The `api` must already be running.
  - Go to `src/js/web-app` and run: `yarn start:dev`
  - The `web-app` is running at `https://localhost/3002`
    - The default `web-app` url:port can be changed in `src/js/web-app/.env`
