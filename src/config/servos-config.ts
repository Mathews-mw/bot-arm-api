export default {
	servoBase: {
		pin: 5,
		minPosition: 0,
		maxPosition: 180,
		startAt: 90,
		type: 'continuous',
	},

	servoRight: {
		pin: 6,
		minPosition: 60,
		maxPosition: 150,
		startAt: 90,
		type: 'continuous',
	},

	servoLeft: {
		pin: 9,
		minPosition: 30,
		maxPosition: 120,
		startAt: 45,
		type: 'continuous',
	},

	servoClaw: {
		pin: 10,
		minPosition: 0,
		maxPosition: 120,
		startAt: 60,
		type: 'continuous',
		isInverted: true,
	},
};
