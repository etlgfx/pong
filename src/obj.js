if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	function Obj(o) {
		this.coords = o.coords ?
			{ x: o.coords[0], y: o.coords[1] } :
			{ x: 0, y: 0 };
		this.velocity = o.velocity ?
			{ x: o.velocity[0], y: o.velocity[1] } :
			{ x: 0, y: 0 };
		this.force = [0, 0];
		this.mass = 1;
		this.bounds = o.bounds || { w: 0, h: 0 };
		this.animate = null;
	}

	Obj.prototype.draw = function (ctx) {
		/*
		if (this.bounds instanceof Array) {
			this.bounds.forEach((function (elm) {
				elm.draw(ctx, this);
			}).bind(this));
		}
		else if (this.bounds) {
			this.bounds.draw();
		}
		*/
	};

	Obj.prototype.physics = function (ts) {
		if (this.animate) {
			this.animate.call(this, ts);
		}

		this.coords.x += ts * this.velocity.x;
		this.coords.y += ts * this.velocity.y;

		//detect collisions TODO with what? this requires coupling to other things
	};

	Obj.prototype.accelerateTo = function (force, speed) {
		this.animate = function (ts) {
			if (speed > 0 && this.velocity.y < speed) {
				this.velocity.y += ts * force * this.mass;
			}
			else if (speed < 0 && this.velocity.y > speed) {
				this.velocity.y -= ts * force * this.mass;
			}
			else if (speed == 0 && this.velocity.y != 0) {
				this.velocity.y += ts * force * this.mass;
			}
			else {
				this.velocity.y = speed;
			}
		};
	};

	Obj.prototype.accelerate = function (force) {
		//this.a = [force[0], force[1]];
	};

	Obj.prototype.stop = function (force) {
		this.animate = function (ts) {
			if (this.velocity.y > 0) {
				this.velocity.y -= ts * Math.abs(force) * this.mass;

				if (this.velocity.y <= 0) {
					this.velocity.y = 0;
				}
			}
			else if (this.velocity.y < 0) {
				this.velocity.y += ts * Math.abs(force) * this.mass;

				if (this.velocity.y >= 0) {
					this.velocity.y = 0;
				}
			}
		};
	};

    Obj.prototype.stopNow = function () {
        this.velocity = {x: 0, y: 0};
    };

	return Obj;
});
