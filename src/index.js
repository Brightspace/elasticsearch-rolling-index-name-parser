const moment = require( 'moment' );
const parsingLocale = 'en';

const datePatterns = [
	{
		period: 'hourly',
		format: 'YYYY-MM-DD-HH',
		regex: '^(.+)-(\\d{4}-\\d{2}-\\d{2}-\\d{2})$',
		endOfCalculator: start => start.clone().endOf( 'hour' )
	},
	{
		period: 'daily',
		format: 'YYYY-MM-DD',
		regex: '^(.+)-(\\d{4}-\\d{2}-\\d{2})$',
		endOfCalculator: start => start.clone().endOf( 'day' )
	},
	{
		period: 'weekly',
		format: [
			'gggg-[w]ww',
			'gggg-[W]ww'
		],
		regex: '^(.+)-(\\d{4}-[wW]\\d{2})$',
		endOfCalculator: start => start.clone().endOf( 'day' ).add( 6, 'day' )
	},
	{
		period: 'monthly',
		format: 'YYYY-MM',
		regex: '^(.+)-(\\d{4}-\\d{2})$',
		endOfCalculator: start => start.clone().endOf( 'month' )
	}
];

module.exports = function() {

	return function( name ) {

		for( let i = 0; i < datePatterns.length; i++ ) {

			const datePattern = datePatterns[ i ];
			const dateRegex = new RegExp( datePattern.regex, 'g' );

			const match = dateRegex.exec( name );
			if( match ) {

				const name = match[ 1 ];
				const dateString = match[ 2 ];

				const startMoment = moment.utc( dateString, datePattern.format, parsingLocale, true );
				if( !startMoment.isValid() ) {
					return null;
				}

				const endMoment = datePattern.endOfCalculator( startMoment );

				return {
					name,
					startMoment,
					endMoment,
					period: datePattern.period
				};
			}
		}

		return null;
	};
};
