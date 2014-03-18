if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	function Player(paddle) {
		this.paddle = paddle;
		this.maxSpeed = 300;
		this.acceleration = 600;
		this.brake = 600;
	}

	Player.prototype.controlStart = function (action) {
		this.paddle.accelerateTo(this.acceleration, action ? -this.maxSpeed : this.maxSpeed);
	};

	Player.prototype.controlEnd = function (action) {
		this.paddle.stop(this.brake);
	};

	return Player;
});
