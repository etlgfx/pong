if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	var Obj = require('./obj'),
		Mediator = require('./mediator');

	function Ball(o) {
		o.bounds = {w: o.size, h: o.size};
		Obj.call(this, o);
		this.size = o.size;
		this.radius = o.size / 2;
	}

	Ball.prototype = Object.create(Obj.prototype);

	Ball.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2, true);
		ctx.fillStyle = 'rgb(0, 255, 0)';
		ctx.fill();
	};

	Ball.prototype.physics = function (ts, box, paddles) {
		box = [ //play area
			this.radius, //top
			box[0] - this.radius, //right
			box[1] - this.radius, //bottom
			this.radius //left
		];

		var dx = ts * this.velocity.x;
		var dy = ts * this.velocity.y;

		var newx = this.coords.x + dx;
		var newy = this.coords.y + dy;

		this.coords.x += ts * this.velocity.x;
		this.coords.y += ts * this.velocity.y;

		if (newx < box[3]) { //left
			this.coords.x = box[3] - (newx - box[3]);
			this.velocity.x = -this.velocity.x;

			Mediator.trigger('score', 'left', this);
		}
		else if (newx > box[1]) { //right
			this.coords.x = box[1] - (newx - box[1]);
			this.velocity.x = -this.velocity.x;

			Mediator.trigger('score', 'right', this);
		}

		if (newy < box[0]) { //top
			this.coords.y = box[0] - (newy - box[0]);
			this.velocity.y = -this.velocity.y;
		}
		else if (newy > box[2]) { //bottom
			this.coords.y = box[2] - (newy - box[2]);
			this.velocity.y = -this.velocity.y;
		}

        var paddleBox;

		//collisions
		if (this.velocity.x > 0) {
			paddleBox = [
				paddles[1].coords.y - paddles[1].bounds.h / 2, //top
				paddles[1].coords.x + paddles[1].bounds.w / 2, //right
				paddles[1].coords.y + paddles[1].bounds.h / 2, //bottom
				paddles[1].coords.x - paddles[1].bounds.w / 2, //left
			];

			if (paddleBox[0] < this.coords.y && paddleBox[2] > this.coords.y) {
				if (newx > paddleBox[3] - this.radius) { //straight collison
					this.coords.x = paddleBox[3] - this.radius - (newx - (paddleBox[3] - this.radius));
					this.velocity.x = -this.velocity.x;
				}
			}
			else if (newx > paddleBox[3] - this.radius) {
				if (paddleBox[0] - this.radius < this.coords.y && paddleBox[0] > this.coords.y) { //corner collision
					if (this.radius * this.radius > (newx - paddleBox[3]) * (newx - paddleBox[3]) + (newy - paddleBox[0]) * (newy - paddleBox[0])) {
					}
				}
				else if (paddleBox[2] + this.radius > this.coords.y && paddleBox[2] < this.coords.y) { //corner collision
					if (this.radius * this.radius > (newx - paddleBox[3]) * (newx - paddleBox[3]) + (newy - paddleBox[2]) * (newy - paddleBox[2])) {
					}
				}
			}
		}
		else {
			paddleBox = [
				paddles[0].coords.y - paddles[0].bounds.h / 2, //top
				paddles[0].coords.x + paddles[0].bounds.w / 2, //right
				paddles[0].coords.y + paddles[0].bounds.h / 2, //bottom
				paddles[0].coords.x - paddles[0].bounds.w / 2, //left
			];

			if (paddleBox[0] - this.radius < this.coords.y && paddleBox[2] + this.radius > this.coords.y) {
				if (newx < paddleBox[1] + this.radius) { //collison
					this.coords.x = paddleBox[1] + this.radius - (newx - (paddleBox[1] + this.radius));
					this.velocity.x = -this.velocity.x;
				}
			}
		}
	};

	return Ball;
});
