if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	var Obj = require('./obj');

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

		this.coords.x += ts * this.velocity.x;
		this.coords.y += ts * this.velocity.y;

		if (this.coords.x < box[3]) { //left
			this.coords.x = box[3] - (this.coords.x - box[3]);
			this.velocity.x = -this.velocity.x;
		}
		else if (this.coords.x > box[1]) { //right
			this.coords.x = box[1] - (this.coords.x - box[1]);
			this.velocity.x = -this.velocity.x;
		}

		if (this.coords.y < box[0]) { //top
			this.coords.y = box[0] - (this.coords.y - box[0]);
			this.velocity.y = -this.velocity.y;
		}
		else if (this.coords.y > box[2]) { //bottom
			this.coords.y = box[2] - (this.coords.y - box[2]);
			this.velocity.y = -this.velocity.y;
		}

		//collisions
		if (this.velocity.x > 0) {
			var paddleBox = [
				paddles[1].coords[1] - paddles[1].bounds.y / 2, //top
				paddles[1].coords[0] + paddles[1].bounds.w / 2, //right
				paddles[1].coords[1] + paddles[1].bounds.y / 2, //bottom
				paddles[1].coords[0] - paddles[1].bounds.w / 2, //left
			];

			if (paddleBox[3] - this.coords.x < 0) {
				console.log('p2 point');
				//point
			}
		}
		else {
			var paddleBox = [
				paddles[0].coords[1] - paddles[0].bounds.y / 2, //top
				paddles[0].coords[0] + paddles[0].bounds.w / 2, //right
				paddles[0].coords[1] + paddles[0].bounds.y / 2, //bottom
				paddles[0].coords[0] - paddles[0].bounds.w / 2, //left
			];

			if (this.coords.x - paddleBox < 0) {
				console.log('p1 point');
				//point
			}
		}
	};

	return Ball;
});
