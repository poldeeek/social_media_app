# DarkSociety
> Responsive social media type application. This is project for my engineering thesis.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [Screenshots](#screenshots)

## General Information
The aim of the DarkSociety project is to create an application that will allow users to communicate with each other by posting/commenting and private chat messaging.

> The frontend of the application is based on React.js library, Node.js (with Express.js) as the backend and MongoDB as the database.

## Technologies Used
- TypeScript - version 3.7.5
- React.js - version 16.13.1
- Redux - version 4.0.5
- Node.js - version 6.14.11
- Express.js - version 4.17.1
- JsonWebToken - version 8.5.1
- Socket.io - version 2.3.0

## Setup

1. Install locally all dependecies in frontend and backend directories using commands:
    * For frontend:
    > `cd ../frontend`<br>
    > `npm install`
    * For backend:
    > `cd ../backend`<br>
    > `npm install`

2. Create `.env` file in frontend and backend directories, and set environment variables:
    * For frontend:
  	  - `REACT_APP_FB_API` - firebase API key (`apiKey` variable in firebase config object)
      - `REACT_APP_FB_PROJECT_ID` - firebase project ID (`projectId`  variable in firebase config object)
      - `REACT_APP_FB_APP_ID` - firebase application ID (`appId`  variable in firebase config object)
      - `REACT_APP_FB_MESSAGING_SENDER_ID` - Google Cloud Messaging Sender ID (`messagingSenderId`  variable in firebase config object)
      - `REACT_APP_FB_AUTH_DOMAIN` - type value `PROJECT_ID.firebaseapp.com` (`authDomain`  variable in firebase config object)
      - `REACT_APP_FB_DB_URL` - type value `https://PROJECT_ID.firebaseio.com` (`databaseURL`  variable in firebase config object)
      - `REACT_APP_FB_STORAGE_BUCKET` - type value `PROJECT_ID.appspot.com` (`storageBucket`  variable in firebase config object)
    * For backend:
      - `PORT` - port number for server
      - `MONGO` - connection MongoDB string 
      - `ACCESS_TOKEN_SECRET` - Secret key for JsonWebToken (access token)
      - `REFRESH_TOKEN_SECRET` - Secret key for JsonWebToken (refresh token)
2. Run project:<br>
    * To run both the server and the client, navigate to `./backend` directory
    > `cd ./backend`<br>
    * And run the script:<br>
    > `npm run start`


## Screenshots

