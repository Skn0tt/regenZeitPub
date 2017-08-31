// speech.js
// =========
const settings = require('./settings');

const getText = {};

getText.launch = {
    de: function(){ return "Hallo."; },
    en: function(){ return "Hello."; },
};

getText.errGeoCode = {
    de: function () {
        return "GeoCode API Zugriff Fehlgeschlagen."
    },
    en: function () {
        return "GeoCode API Access Denied."
    }
};

getText.prognosis = {
    de: function(prognosis, length, address) {
        const progAnalysis = getPrognosisProperties(prognosis);
        const first = progAnalysis.first;
        const most = progAnalysis.most;

        const sentences = [
            function(length, address) {
                return "Für die nächsten " + length + " Minuten in " + address + " konnte ich folgende Prognose aufstellen: ";
            },
        ];

        let result = sentences[Math.floor(Math.random()*sentences.length)](length, address);

        const noRain = [
            "Es regnet heute nicht.",
            "Es ist kein Regen in Sicht.",
            "Es wird nicht regnen.",
            "Kein Regen.",
            "Ich kein Regen sehen, junger Padawan."
        ];

        const atmRain = [
            "Es regnet gerade. Der Regen ist ",
            "Es ist gerade am regnen, und zwar",
            "Momentan ist der Regen ",
            "Der Regen ist im Moment ",
        ];

        const toRain = [
            function(first){
                return "Es regnet in " + first + " Minuten. Der Regen wird ";
            },
            function(first){
                return "Es wird in " + first + " Minuten. Regnen, und zwar ";
            }
        ] ;

        if (first === -1) result += noRain[Math.floor(Math.random()*noRain.length)];
        else if (first === 0) result += atmRain[Math.floor(Math.random()*atmRain.length)] + rainIntensity.de[prognosis.charAt(first)] + ".";
        else result += toRain[Math.floor(Math.random()*toRain.length)](first) + rainIntensity.de[prognosis.charAt(first)] + ".";

        const mostRain = [
            function(most){
                return "Der meiste Regen fällt in " + most + " Minuten. Der Regen ist ";
            },
            function(most){
                return "Der meiste Regen wird in " + most + " Minuten fallen. Er wird ";
            },
        ];

        if (most === first) return result;
        else result += mostRain[Math.floor(Math.random()*mostRain.length)](most) + rainIntensity.de[prognosis.charAt(most)] + ".";

        return result;
    },

    en: function(prognosis, length, address) {
        const progAnalysis= getPrognosisProperties(prognosis);
        const first = progAnalysis.first;
        const most = progAnalysis.most;

        const sentences = [
            function(length, address) {
                return "I was able to get the following prognosis for the next " + length + " minutes in " + address + ":";
            },
        ];

        let result = sentences[Math.floor(Math.random()*sentences.length)](length, address);

        if (first === -1) result += "It won't rain today.";
        else if (first === 0) result += "It's raining right now. The rain is " + rainIntensity.en[prognosis.charAt(first)] + ".";
        else result += "Es regnet in " + round(first) + " Minuten. Der Regen ist " + rainIntensity.en[prognosis.charAt(first)] + ".";

        if (most === first) return result;

        else result += "The most rain is going to come down in " + most + " Minutes. It will be " + rainIntensity.en[prognosis.charAt(most)] + ".";

        return result;
    }
};

getText.about = {
    de: function() {
        const sentences = [
            "Ich basiere auf einer pixelweisen Analyse einer Regenkarte. Meine Vorhersagen sind daher mit Vorsicht zu genießen.",
            "Meine Vorhersagen basieren auf einer pixelweisen Analyse einer Regenkarte. Bitte genieße sie daher mit Vorsicht.",
            "Meine Vorhersagen basieren auf einer pixelweisen Analyse einer Regenkarte. Nimm sie daher bitte nicht all zu ernst.",
            "Ich basiere auf einer pixelweisen Analyse einer Regenkarte. Nimm sie daher bitte nicht all zu ernst.",
        ];

        return sentences[Math.floor(Math.random()*sentences.length)];
    },
    en: function() {
        const sentences = [
            "I'm based on an Analysis of a rain radar. My prognosises therefore need to be taken with a grain of salt.",
            "My prognosis is based on an Analysis of a rain radar. They therefore need to be taken with a grain of salt.",
            "My prognosis is based on an Analysis of a rain radar. Please don't take them to seriously.",
            "I'm based on an Analysis of a rain radar. Please don't take them to seriuos therefore.",
        ];

        return sentences[Math.floor(Math.random()*sentences.length)];
    }
};

getText.error = {
  de: function(err) {
    return "Fehler Code " + err.id + ": " + err.descr.de;
  }
  ,
  en: function(err) {
    return "Error Code " + err.id + ": " + err.descr.en;
  }
};

//Dictionaries
const rainIntensity = {
    de: {
        'A': "sehr leicht",
        'B': "leicht",
        'C': "mäßig",
        'D': "mittel",
        'E': "stark",
        'F': "in Strömen"
    },
    en: {
        'A': "very light",
        'B': "light",
        'C': "mild",
        'D': "middle",
        'E': "strong",
        'F': "cats and dogs"
    }
};

//Tools
function getPrognosisProperties(prog) {
    //Get First Rain, Max Rain
    let first = -1, most = -1;
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((val) =>{
        let index = prog.indexOf(val);
        if (first === -1) first = index;
        if (index !== -1) most = index;
    });

    return {
        first: first,
        most: most
    };
}

function round(val){
    val /= settings.TIME_ROUNDING_VALUE;

    return Math.round(val) * settings.TIME_ROUNDING_VALUE;
}

//Exports
module.exports = getText;