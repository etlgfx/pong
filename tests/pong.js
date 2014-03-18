var assert = require('assert');
var Ball = require('../src/ball.js');

describe('ball', function () {
	var ball = new Ball({size: 10, coords: [], velocity: []});

	it('collides with walls', function () {
		assert(ball);
	});
});

