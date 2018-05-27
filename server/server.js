/**
 * Is a framework for building node.js web application
 * It allows us to respond to HTTP requests in REST architecture way
 * We create event listeners to HTTP methods like Get, Post and etc
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const moduleFolder = "modules";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const util = require('util')
const cors = require('cors');
app.use(cors());
const DButilsAzure = require('./DButils');
const auth = require(`./${moduleFolder}/auth`);
const guests = require(`./${moduleFolder}/guests`);
const poi = require(`./${moduleFolder}/poi`);

/**
 * START: HTTP REQUESTS ROUTES HANDLERS AND DB REQURESTS
 * 200 - OK
 * 400 - Bad Request (Client Error) - A json with error \ more details should return to the client.
 * 401 - Unauthorized
 * 500 - Internal Server Error - A json with an error should return to the client only when there is no security risk by doing that.
 */
app.use('/api/auth', auth);
app.use('/api/guests', guests);
app.use('/api/auth/protected/poi', poi);

// END: HTTP REQUESTS ROUTES HANDLERS AND DB REQURESTS

 /**
  * The server needs to listen to some port in order to handle requests it encounters.
  * In this file the server is listening to port 3000 and triggers a callback
  * function that only write to the log whenever it starts to listen.
  */
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});