// error.js
// ========

module.exports = {
    WEATHERAPI_OUT_OF_PICTURE: {
        id: 1,
        descr: {
            de: "Angefragter Ort ist ausßerhalb Deutschlands",
            en: "Requested addres is outside of weather api frame",
        }
    },
    WEATHERAPI_RETURN_UNDEFINED: {
        id: 2,
        descr: {
            de: "Anfrage der Wetter-API fehlgeschlagen",
            en: "WeatherAPI request failed"
        }
    },
    GEOCODEAPI_REQUEST_REJECTED: {
        id: 3,
        descr: {
            de: "Anfrage der GeoCode-API fehlgeschlagen",
            en: "GeocodeAPI request failed"
        }
    },
};