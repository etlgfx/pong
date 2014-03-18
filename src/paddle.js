if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	var Obj = require('./obj');

	function Paddle(o) {
		Obj.call(this, o);
	}

	Paddle.prototype = Object.create(Obj.prototype);

	Paddle.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.rect(this.coords.x - this.bounds.w / 2, this.coords.y - this.bounds.h / 2, this.bounds.w, this.bounds.h);
		ctx.fillStyle = 'rgb(0, 255, 0)';
		ctx.fill();
	};

	return Paddle;
});

