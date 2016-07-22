'use strict';

var chai = require('chai');
var FAADataHelper = require('../faa_data_helper');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

chai.use(chaiAsPromised);
chai.config.includeStack = true;



describe('FAADataHelper', function(){
	var subject = new FAADataHelper();
	var airport_code;

	describe('#getAirportStatus', function(){
		/** Assert Valid Airport Code */
		context('with a valid airport code', function(){
			it('returns matching airport code', function(){
				airport_code = 'SFO';
				var value = subject.requestAirportStatus(airport_code).then(function (obj) {
					return obj.IATA;
				});
				return expect(value).to.eventually.eq(airport_code);
			});
		});

		/** Assert Invalid Airport Code or non 200 Status code */
		context('with an invalid airport code', function () {
			it('return invalid airport code', function () {
				airport_code = 'PUNKYBREWSTER';
				return expect(subject.requestAirportStatus(airport_code)).to.be.rejectedWith(Error);
			});
		});
	});

	describe('#formatAirportStatus', function () {
		var status = {
			'delay' : 'true',
			'name': 'Kotoka-Jackson International',
			'ICAO': 'ACC',
			'city':'Accra',
			'weather': {
				'visibility': '5.00',
				'weather': 'Light Rain',
				'meta': {
					'credit': 'NOAA\'s National Weather Service',
					'updated': '3:54 PM Local',
					'url':'http://weather.gov/'
				},
				'temp':'36.0 F (2.2C)',
				'wind':'Northeast at 9.2mph'
			},
			'status': {
				'reason': 'AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY',
				'closureBegin':'',
				'endTime':'',
				'minDelay':'',
				'avgDelay': '57 minutes',
				'maxDelay': '',
				'closeEnd': '',
				'trend': '',
				'type': 'Ground Delay'
			}
		};

		context('with a status containing no delay', function () {
			it('format the status as expected', function () {
				status.delay = 'false';
				expect(subject.formatAirportStatus(status))
				.to.eq('There is currently no delay at Kotoka-Jackson International. The current weather conditions are Light Rain, 36.0 F (2.2C) and wind Northeast at 9.2mph.');
			});
		});

		context('with a status containing a delay', function () {
			it('format the status as expected', function () {
				status.delay = 'true';
				expect(subject.formatAirportStatus(status))
				.to.eq('There is currently a delay for Kotoka-Jackson International. The average delay time is 57 minutes. Delay is because of the following: AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY. The current weather conditions are Light Rain, 36.0 F (2.2C) and wind Northeast at 9.2mph.');
			});
		});
	});
});