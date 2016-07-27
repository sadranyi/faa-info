'use strict';

module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');
var FAADataHelper = require('./faa_data_helper');

app.launch(function(req, res){
    var prompt = "For Airport information, tell me an Airport code.";
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('airportinfo',{
    'slots':{
        'AIRPORTCODE': 'FAACODE'
    },
    'utterances': ['{|flight|airport} {|delay|delays|status} {|info|information} {|for|at} {-|AIRPORTCODE}']
}, function(req, res){
    /**Get the slot */
    var airportCode = req.slot('AIRPORTCODE');
    var propmt = 'Tell me an airport code to get delay information or say stop to quit';

    if(_.isEmpty(airportCode)){
        var prompt = 'I didn\'t hear an airport code. Tell me an airport code, or say no to quit.';
        res.say(prompt).reprompt(prompt).shouldEndSession(false);
        return true;
    }else{
        var faaHelper = new FAADataHelper();
        faaHelper.requestAirportStatus(airportCode).then(function(airportStatus){
            res.say(faaHelper.formatAirportStatus(airportStatus)).shouldEndSession(false).send();
        }).catch(function(err){
            console.log(err.statusCode);
            var propmt = 'I didn\'t have data for an airport code of ' + airportCode + ". Please say a valid airport code, or say stop to quit.";
            res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });
        return false;
    }
});

/** STOP and CANCEL function */
var exitfunction = function(req, res){
    var speechOut = 'Ok!, Thank you and GoodBye!';
    res.say(speechOut).shouldEndSession(true);
};

app.intent('AMAZON.StopIntent', exitfunction);

app.intent('AMAZON.CancelIntent', exitfunction);

app.intent('AMAZON.NoIntent', exitfunction);

app.intent('AMAZON.YesIntent', function(req, res) {
    var speechOut = "Ok!, say an airport code, or say no to quit.";
    res.say(speechOut).shouldEndSession(false);
});

app.intent('AMAZON.HelpIntent', function(req, res){
    var speechOut = 'To request information about an airport, say its FAA code, ' + 
    'For example, to get information about Portland International airport, say P D X. you can also say no to quit.';
    res.say(speechOut).shouldEndSession(false);
});

console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;