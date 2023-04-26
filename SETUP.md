# ![URl Shortener ](project-logo.png)

> ### This is a URL Shortener backend service built with Nestjs.The project that performs the following functionalities;

- Encode an valid URL to a short URL
- Decode a short URl to the original URL
- Get Statistics of Short URL

---

# Getting started

## Installation Steps

Clone the repository

    git clone https://github.com/iamug/url-shortener.git

Switch to the repo folder

    cd url-shortener

Install dependencies

    pnpm install or npm install

Start application ( development )

    npm run start:dev

## Setup

You don't need to populate a `.env` file with configuration values. The default will work just fine.

To change the default values, create a .env with the follwoing environment configs

```dotenv
PORT=  #Default is 3000
BASEURL= # Default is http://localhost:3000/
```

A template `.env` file can be found at [`.env.example`](.env.example).

---

## Database

The project uses an In-Memeory datastore.

#### N.B Data is cleared once app is restarted.

---

## NPM scripts

- `npm start` - Start application
- `npm run start:dev` - Start application in watch mode
- `npm run test` - run unit tests with Jest test runner
- `npm run test:e2e` - run end to end tests with Jest and Supertest
- `npm run build` - Build application

---

## Start application

- `npm start`
- View and Test api endpoints with `http://localhost:3000/api/` in your favourite browser

#### N.B Default port is 3000, use .env to change port number.

---

# Swagger API docs

This project uses the NestJS swagger module for API documentation.
