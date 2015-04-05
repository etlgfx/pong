if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

    var Font = require('font');

	'use strict;';

	function Player(paddle) {
		this.paddle = paddle;
		this.maxSpeed = 300;
		this.acceleration = 600;
		this.brake = 600;
        this._data = {
            score: 0,
        };
	}

	Player.prototype.controlStart = function (action) {
		this.paddle.accelerateTo(this.acceleration, action ? -this.maxSpeed : this.maxSpeed);
	};

	Player.prototype.controlEnd = function (action) {
		this.paddle.stop(this.brake);
	};

    /**
     * give player a point and return new score
     */
    Player.prototype.score = function () {
        return this._data.score++;
    };

    /**
     * retrieve player score
     */
    Player.prototype.getScore = function () {
        return this._data.score;
    };

    Player.prototype.draw = function (ctx, coords) {
        var font = new Font(ctx, {
            align: 'center'
        });
        font.draw(coords, this.getScore());
    };

	return Player;
});
