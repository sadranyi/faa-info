'use strict';

module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');
var FAADataHelper = require('./faa_data_helper');

app.launch(function(req, res){
    var prompt = "For Delay information, tell me an Airport code.";
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
    var propmt = 'Tell me an airport code to get delay information';

    if(_.isEmpty(airportCode)){
        var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
        res.say(prompt).reprompt(prompt).shouldEndSession(false);
        return true;
    }else{
        var faaHelper = new FAADataHelper();
        faaHelper.requestAirportStatus(airportCode).then(function(airportStatus){
            res.say(faaHelper.formatAirportStatus(airportStatus)).send();
        }).catch(function(err){
            console.log(err.statusCode);
            var propmt = 'I didn\'t have data for an airport code of ' + airportCode;
            res.say(prompt).reprompt(prompt).shouldEndSession(true).send();
        });
        return false;
    }
});

/** STOP and CANCEL function */
var exitfunction = function(req, res){
    var speechOut = 'GoodBye!';
    res.say(speechOut).shouldEndSession(true);
};

app.intent('AMAZON.StopIntent', exitfunction);
app.intent('AMAZON.CancelIntent', exitfunction);


app.intent('AMAZON.HelpIntent', function(req, res){
    var speechOut = 'To request information on an airport, request it by the Code, ' + 
    'For example, to get information about Portland International  airport, say airport status for P D X';
    res.say(speechOut);
});

console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;