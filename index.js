'use strict';

module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var FAADataHelper = require('./faa_data_helper');

var app = new Alexa.app('airportinfo');

app.launch(function(req, res){
    var prompt = "For Delay information, tell me an Airport code.";
    res.say(prompt).repromt(prompt).shouldEndSession(false);
});

module.exports = app;