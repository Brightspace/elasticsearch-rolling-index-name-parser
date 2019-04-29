const moment = require( 'moment' );

const datePatterns = [
	{
		period: 'hourly',
		format: 'YYYY-MM-DD-HH',
		regex: '^(.+)-(\\d{4}-\\d{2}-\\d{2}-\\d{2})$',
		endOfUnit: 'hour'
	},
	{
		period: 'daily',
		format: 'YYYY-MM-DD',
		regex: '^(.+)-(\\d{4}-\\d{2}-\\d{2})$',
		endOfUnit: 'day'
	},
	{
		period: 'monthly',
		format: 'YYYY-MM',
		regex: '^(.+)-(\\d{4}-\\d{2})$',
		endOfUnit: 'month'
	}
];

module.exports = function( name ) {

	for( let i = 0; i < datePatterns.length; i++ ) {

		const datePattern = datePatterns[ i ];
		const dateRegex = new RegExp( datePattern.regex, 'g' );

		const match = dateRegex.exec( name );
		if( match ) {

			const name = match[ 1 ];
			const dateString = match[ 2 ];

			const startMoment = moment.utc( dateString, datePattern.format, true );
			if( !startMoment.isValid() ) {
				return null;
			}

			const endMoment = startMoment.clone().endOf( datePattern.endOfUnit );

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
