var assert = require('assert');
var Ball = require('../src/ball.js');
var Paddle = require('../src/paddle.js');
var ball;
var paddles = [];
var width = 200, height = 200;

describe('ball', function () {
	beforeEach(function () {
		ball = new Ball({size: 10});
		paddles = [
			new Paddle({coords: [20, height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
			new Paddle({coords: [width - 20, height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
		];
	});

	it('collides with walls', function () {
		ball.coords = {x: 5, y: 5};
		ball.velocity.x = -10;
		ball.physics(0.1, [width, height], paddles)

		assert.equal(ball.coords.x, 6);

		ball.coords = {x: 5, y: 5};
		ball.velocity.x = 0;
		ball.velocity.y = -10;
		ball.physics(0.1, [width, height], paddles)

		assert.equal(ball.coords.y, 6);
	});
});

