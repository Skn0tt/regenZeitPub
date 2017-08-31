// app.js
// ======

//Module Requires
//If it's called often (e.g. each Alexa call) it's required up here, if not in the function body
const express = require("express");
const alexa = require("alexa-app");
const https = require("https");
const googleMapsClient = require('@google/maps').createClient({
  key: '# Insert your key here',
});

//Own Requires
const e = require('./error');
const speech = require('./speech');
const settings = require('./settings');

//Opens the express server and makes it listen on the heroku port, if there's none it uses #3000
const app = express();
const port_number = app.listen(process.env.PORT || settings.ALT_PORT);

// ALWAYS setup the alexa app and attach it to express before anything else.
const alexaApp = new alexa.app("regenZeit");

alexaApp.express({
  expressApp: app,

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: settings.DEBUG,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: settings.DEBUG,
});

// now POST calls in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

//Launch Intent, just answers the welcoming output.
alexaApp.launch(function(request, response) {
  response.say("Du hast Regenzeit gestartet, sag so was wie Wie ist das Wetter in Berlin oder wann regnet es in Bonn");
  response.shouldEndSession(false);
});

alexaApp.intent("ortIntent", {
    "dialog": {
      type: "delegate",
    },
    "slots": { "citySlot": "AMAZON.DE_CITY" },
    "utterances": [
      "Wann regnet es in {-|citySlot}",
      "Wie ist das Wetter in {-|citySlot}",
    ]
  },
  function(request, response) {
    return getCoordinates(request.slot("citySlot"))
      .then((res) => {
        return getWeather(res);
      })
      .then((res) => {
        response.say(speech.prognosis.de(res.prog, res.length, res.address));
    });
  }
);

alexaApp.intent("aboutIntent", {
        "dialog": {
            type: "delegate",
        },
        "utterances": [
            "Wie funktionerst du?",
            "Wie machst du diese Vorhersagen?",
        ]
    },
    function(request, response) {
        response.say(speech.about.de());
    }
);

function getCoordinates(address){
  return new Promise((resolve, reject) => {
    googleMapsClient.geocode({ address: address }, (err, response) => {
      if (err) reject(e.GEOCODEAPI_REQUEST_REJECTED);
      else resolve({
          lat: response.json.results[0].geometry.location.lat.toString(),
          lng: response.json.results[0].geometry.location.lng.toString(),
          address: response.json.results[0].address_components[0].long_name,
      });
    });
  });
}

function getWeather(coordinates){
  return new Promise((resolve, reject) => {
    https.get("# Insert Rain API URI here" + coordinates.lat + "," + coordinates.lng, (res) =>{
      const { statusCode } = res;
      if (statusCode !== 200){
        console.error(statusCode);
        reject(e.WEATHERAPI_OUT_OF_PICTURE);
      } else {
          res.on('data', (body) => {
              const resultArr = body.toString().split(';');

              if (settings.DEBUG) console.log(resultArr);

              if (typeof resultArr[2] === "undefined") {
                  if (settings.DEBUG) console.log("resultArr undefined");
                  reject(e.WEATHERAPI_RETURN_UNDEFINED);
              }

              resolve({
                  prog: resultArr[2],
                  length: resultArr[2].length,
                  address: coordinates.address,
                  direction: resultArr[3],
                  speed: resultArr[4],
                  percentile: resultArr[5]
              });
          });
      }
    });
  });
}

alexaApp.post = function(request, response, type, exception) {
  if (exception) {
    console.log(exception);
    // always turn an exception into a successful response
    return response.clear().say(speech.error.de(exception)).send();
  }
};

//Opens Epxress App, starts server
app.listen(port_number);
console.log("Listening on port " + process.env.PORT);