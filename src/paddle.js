if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	var Obj = require('./obj');

	function Paddle(o, box) {
		Obj.call(this, o);

        this.box = box;
	}

	Paddle.prototype = Object.create(Obj.prototype);

	Paddle.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.rect(this.coords.x - this.bounds.w / 2, this.coords.y - this.bounds.h / 2, this.bounds.w, this.bounds.h);
		ctx.fillStyle = 'rgb(0, 255, 0)';
		ctx.fill();
	};

    Paddle.prototype.physics = function (ts) {
        Obj.prototype.physics.call(this, ts);

        if (this.coords.y < this.bounds.h / 2) {
            this.velocity.y = 0;
            this.coords.y = this.bounds.h / 2;
        }
        else if (this.coords.y > this.box.h - this.bounds.h / 2) {
            this.velocity.y = 0;
            this.coords.y = this.box.h - this.bounds.h / 2;
        }
    };

	return Paddle;
});

