'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = 'http://services.faa.gov/airport/status/';

function FAADataHelper(){}

FAADataHelper.prototype.requestAirportStatus = function(airportCode){
    return this.getAirportStatus(airportCode).then(function(res){
        return res.body;
    }).catch(function(err){
        return 'ERROR_404';
    });

    /** Handle cases where invalid response is sent: send an invalid object */
};

FAADataHelper.prototype.getAirportStatus = function(airportCode){
    var options = {
        method:'GET',
        uri:ENDPOINT + airportCode,
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};

FAADataHelper.prototype.formatAirportStatus = function(airportStatus){

    if(airportStatus === "ERROR_404")
        return "Invalid airport Code. Please say a valid airport code or say no to quit";

    var weather = _.template('The current weather conditions are ${weather}, ${temp} and wind ${wind}.')({
        weather: airportStatus.weather.weather,
        temp: airportStatus.weather.temp,
        wind: airportStatus.weather.wind
    });

    var reprompt = "Do you want information for another airport?";

    if(airportStatus.delay === 'true'){
        var template = _.template('There is currently a delay for ${airport}. ' + 
        'The average delay time is ${delay_time}. ' + 
        'Delay is because of the following: ${delay_reason}. ${weather} ${reprompt}');
        return template({
            airport: airportStatus.name,
            delay_time: airportStatus.status.avgDelay,
            delay_reason: airportStatus.status.reason,
            weather : weather,
            reprompt : reprompt
        });
    }
    else
    {
        return _.template('There is currently no delay at ${airport}. ${weather} ${reprompt}')({
            airport: airportStatus.name,
            weather: weather,
            reprompt : reprompt
        });
    }
};

module.exports = FAADataHelper;