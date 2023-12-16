### Welcome to the

# InventoryTrackingServer

### Steps to run the server:

## Run Locally

Go to the project directory

```bash
  cd ITS-Server
```

Install dependencies

```bash
  npm install
```

#### Before starting the server:

1. Comment the marked lines in the server.js file
   (The lines will be marked using the comments above each line)

2. Save the file

Start the server

```bash
npm run server
```

(Refer the package.json for the scripts if needed)

- This will start the server which can continuously watch for any changes made in the code and will be automatically refresh in case the code changes. No need to restart the server.
- The server will start successfully given the mongodb database has been setup correctly.

## Deployment

#### To Deploy, follow the steps below

(Assuming you have tested the frontend locally)

Create a build of the front end.

Copy the build folder from the frontend and paste it in the Project folder i.e. inside "ITS-Server"

Uncomment the marked lines which we commented in order to run the server locally.

In simple terms, now you have clubbed the server with the frontend. To test it, run the below command in the server directory in the terminal.

```bash
npm run server
```

Congratulations!!!!, now you don't need to run the frontend separately, the server will pickup the the frontend from the build folder which ytou pasted.

Wait, we are not done yet, in order to deploy the project we have an option to create an .exe file which can we used to run the server directly using mouse clicks only.

```bash
Instructions to be added. Work in progress...
```
