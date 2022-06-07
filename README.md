### Setup

Install expo:
```
npm i -g expo-cli
```

Install node modules:
```
npm ci
```

### Development

Start the dev server
```
expo start
```
In the dev server, press the `a` key to build and run the app on Android (you need to have hardware connected by USB or an emulator running). To build and run on iOS, press `i` (iOS emulator is automatically started).

### Refreshing cache

Sometimes, the Metro bundler may get stuck with old versions of modules, and you get errors like `Unable to resolve module ...`. To fix this, run
```
expo start -c
```
which will start the dev server with empty cache.

### Linting

The `eslint` and `prettier` packages are used for linting and code formatting.

You can check for lint problems using:
```
npm run lint:check
```

Some `eslint` problems and all `prettier` problems can be fixed automatically. The auto-fix can be performed with:
```
npm run lint:fix
```

There is a *pre-commit* hook to run `lint:fix` automatically when you commit code. If `eslint` detects unfixable errors in the changed files, you will not be able to commit the changes.

### Environment

The service runs in multiple different environments (`dev`, `test`, `prod`). To change the environment of the mobile app, open `app.json` and edit the `expo.extra.appEnv` property.

The default environment is `prod`.
