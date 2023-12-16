### Welcome to the

# InventoryTrackingFrontend

### Steps to run the Front end:

## Run Locally

Go to the project directory

```bash
  cd ITS-Frontend
```

If there is an error regarding ERR_OSSL_EVP_UNSUPPORTED
Docs: https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported

```bash
  export NODE_OPTIONS=--openssl-legacy-provider
```

Install dependencies

```bash
  npm install
```

Start the Project

```bash
npm run start
```

(Refer the package.json for the scripts if needed)

- This will start the React server for the frontend which will try to fetch contact the server for the data providing the server is running locally on the port 5000.

## Deployment

#### To Deploy, follow the steps below

(Assuming you have tested the frontend locally)

Create a build of the front end byu running the following command.

```bash
npm run build
```

(Refer the package.json for more information)

#### Attaching the frontend with the server:

Copy the build folder from the frontend and paste it in the Project folder i.e. inside "ITS-Server"

Follow the instructions given in the server side documentation (Readme file of ITS-Server)
