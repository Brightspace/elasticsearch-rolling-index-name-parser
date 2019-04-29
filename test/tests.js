const chai = require( 'chai' );
const assert = chai.assert;
const moment = require( 'moment' );
const rollingIndexNameParser = require( '../src/index.js' );

describe( 'elasticsearch-rolling-index-name-parser', function() {

	it( 'should parse hourly pattern', function() {

		const result = rollingIndexNameParser( 'test-2018-04-23-11' );
		assert( result, 'should parse index name' );

		assert.equal( result.name, 'test','name should be part before the date' );
		assert.equal( result.period, 'hourly', 'period should be hourly' );

		assert( moment.isMoment( result.startMoment ), 'start moment should be a moment' );
		assert.equal( result.startMoment.toISOString(), '2018-04-23T11:00:00.000Z', 'should parse correct start moment' );

		assert( moment.isMoment( result.endMoment ), 'end moment should be a moment' );
		assert.equal( result.endMoment.toISOString(), '2018-04-23T11:59:59.999Z', 'should construct correct end moment' );
	} );

	it( 'should parse daily pattern', function() {

		const result = rollingIndexNameParser( 'i-love-apples-2018-04-23' );
		assert( result, 'should parse index name' );

		assert.equal( result.name, 'i-love-apples', 'name should be part before the date' );
		assert.equal( result.period, 'daily', 'period should be daily' );

		assert( moment.isMoment( result.startMoment ), 'start moment should be a moment' );
		assert.equal( result.startMoment.toISOString(), '2018-04-23T00:00:00.000Z', 'should parse correct start moment' );

		assert( moment.isMoment( result.endMoment ), 'end moment should be a moment' );
		assert.equal( result.endMoment.toISOString(), '2018-04-23T23:59:59.999Z', 'should construct correct end moment' );
	} );

	it( 'should parse monthly pattern', function() {

		const result = rollingIndexNameParser( 'super_logs-2018-04' );
		assert( result, 'should parse index name' );

		assert.equal( result.name, 'super_logs', 'name should be part before the date' );
		assert.equal( result.period, 'monthly', 'period should be monthly' );

		assert( moment.isMoment( result.startMoment ), 'start moment should be a moment' );
		assert.equal( result.startMoment.toISOString(), '2018-04-01T00:00:00.000Z', 'should parse correct start moment' );
		
		assert( moment.isMoment( result.endMoment ), 'end moment should be a moment' );
		assert.equal( result.endMoment.toISOString(), '2018-04-30T23:59:59.999Z', 'should construct correct end moment' );
	} );

	it( 'should return null for non rolling index', function() {

		const result = rollingIndexNameParser( 'test' );
		assert.isNull( result, 'should not parse' );
	} );

	it( 'should return null for invalid hourly strings', function() {

		const result = rollingIndexNameParser( 'test-2018-04-23-55' );
		assert.isNull( result, 'should not parse' );
	} );

	it( 'should return null for invalid daily strings', function() {

		const result = rollingIndexNameParser( 'test-2018-04-55' );
		assert.isNull( result, 'should not parse' );
	} );

	it( 'should return null for invalid monthly strings', function() {

		const result = rollingIndexNameParser( 'test-2018-npm 55' );
		assert.isNull( result, 'should not parse' );
	} );
} );