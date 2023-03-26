## Air quality assignment

## Framework
### Server
Chose to do it in NestJS. Although this is very small assignment but just assumed that work wil be part of large application so NestJS is suited for RAD and is modern upto date framework
### Database
Chose MongoDB, again for the said reason above.

## Installation

```bash
$ yarn
```
or 

```bash
$ npm i
```
## Env variables (.env)
Although env shouldn't be part of code but just committing it for the sake of simplicity of your checking

#### PORT
By default port is set to 3030. you can update as per your choice

#### MONGO_CONNECTION
Provided already cloud mongodb connection string here. You won't need to update it ideally

## Running the app

```bash
# watch mode
$ npm run start:dev

# development
$ yarn run start

# production mode
$ npm run start:prod
```

## Swagger
Open browser http://locahost:3030 (or update the port if you changed). You will see Swagger docs. You can use it for testing

There would be cron running every minute which will populate the collection with data of Paris City (hard coded)

## Test
There wasn't much in unit tests as there was not much business logic so tests are more of itegration tests + E2E
```bash
# Integration / Unit
$ yarn run test

# End to end tests
$ npm run test:e2e
```
