(function (name, definition) {
        if (typeof define == 'function') //we're probably using require.js or similar
                define(definition);
        else if (typeof module != 'undefined') //we're probably using node.js
                module.exports = definition();
        else //we're probably loading this directly in browser so assign the result to this (ie. window)
                this[name] = definition();
})('pong', function () {

	'use strict;';

	var _KEY_P1_UP   = 0x01, //bitmask 0x08 determines player #
	    _KEY_P1_DOWN = 0x02,
	    _KEY_P2_UP   = 0x09,
	    _KEY_P2_DOWN = 0x0a;

	var _UP   = 0x01,
	    _DOWN = 0x02;


    function Obj(o) {
        this.coords = {
            x: o.coords[0],
            y: o.coords[1]
        };
        this.velocity = {
            x: o.velocity[0],
            y: o.velocity[1]
        };
		this.force = [0, 0];
        this.mass = 1;
        this.bounds = o.bounds;
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
		box = [this.radius, box[0] - this.radius, box[1] - this.radius, this.radius]; //t r b l

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
	};

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

	/*
    function Bounds() {
    }

    Bounds.prototype.draw = function (ctx, obj) {
    };

    function BoundsCircle(r) {
        Bounds.call(this);
    }

    BoundsCircle.prototype.draw = function () {
    };

    function BoundsRect(x, y) {
        Bounds.call(this);
    }

    BoundsRect.prototype.draw = function () {
    };

    function BoundsSquare(x) {
        Bounds.call(this);
    }

    BoundsSquare.prototype.draw = function () {
    };

    BoundsRect.prototype = Object.create(Bounds.prototype);
    BoundsSquare.prototype = Object.create(BoundsRect.prototype);
    BoundsCircle.prototype = Object.create(Bounds.prototype);
	*/

	function Pong(dom) {
		this.canvas = dom;
		this.ctx = dom.getContext('2d');
		this.width = this.ctx.canvas.width;
		this.height = this.ctx.canvas.height;
		this.lastDraw = Date.now();

		//TODO instead of this we could use a gamestate / scene graph thingy and
		//call draw on that, and refresh the entire state every time a point is
		//scored and whatnot
		this.paddles = [
			new Paddle({coords: [20, this.height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
			new Paddle({coords: [this.width - 20, this.height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
		];

		this.players = [
			new Player(this.paddles[0]),
			new Player(this.paddles[1])
		];

		this.ball = new Ball({coords: [this.width / 2, this.height / 2], velocity: [250, 250], size: 20});
	}

    Pong.prototype.draw = function () {
		var ts_cur = Date.now();
		var ts = (ts_cur - this.lastDraw) / 1000;
		this.lastDraw = ts_cur;

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.paddles.forEach(function (p) {
			p.physics(ts);
			p.draw(this.ctx)
		}, this);

		this.ball.physics(ts, [this.width, this.height], this.paddles);
		this.ball.draw(this.ctx);

		this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
    };

	/**
	 * TODO make this listen for errors / exceptions
	 */
	Pong.prototype.die = function () {
		window.cancelAnimationFrame(this.animationFrame);
	};

	Pong.prototype.controls = function (type, action) {
		var player = this.players[0+!!(action & 0x08)]; //so dirty TODO

		if (type === 'keyup') {
			player.controlEnd(0x01 & action);
		}
		else {
			player.controlStart(0x01 & action);
		}
	};

	Pong.prototype.key = function (evt) {
		if (evt.type === 'keyup' || evt.type === 'keydown' || evt.charCode == 0) {
			var action;

			switch (evt.keyCode) {
				case 38: //UP
					action = _KEY_P2_UP;
					break;

				case 40: //DOWN
					action = _KEY_P2_DOWN;
					break;

				case 65: //A
					action = _KEY_P1_UP;
					break;

				case 90: //Z
					action = _KEY_P1_DOWN;
					break;

				case 27: //escape
					this.die();
					throw new Error('game over');
			}

			if (action) {
				evt.preventDefault();

				this.controls(evt.type, action);
			}
		}
	};

	Pong.prototype.keypress = function (evt) {
	};

    return {
        init: function (id) {
			var pong = new Pong(document.getElementById(id));

			document.addEventListener('keydown',  pong.key.bind(pong),      true);
			document.addEventListener('keyup',    pong.key.bind(pong),      true);
			document.addEventListener('keypress', pong.keypress.bind(pong), true);

			pong.draw();
        }
    };
});

