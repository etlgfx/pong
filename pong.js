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

		this.coords.y += ts * this.velocity.y;

		//detect collisions
	};

	Obj.prototype.accelerateTo = function (force, speed) {
		this.animate = function (ts) {
			if (this.velocity.y < speed) {
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
	}

    function Ball(o) {
    }
    Ball.prototype = Object.create(Obj.prototype);

    function Player(paddle) {
		this.paddle = paddle;
		this.maxSpeed = 200;
		this.acceleration = 300;
		this.brake = 500;
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
		this.lastDraw = null;

		this.paddles = [
			new Paddle({coords: [20, this.height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
			new Paddle({coords: [this.width - 20, this.height / 2], velocity: [0, 0], bounds: {w: 20, h: 100}}),
		];

		this.players = [
			new Player(this.paddles[0]),
			new Player(this.paddles[1])
		];
	}

    Pong.prototype.draw = function () {
		var ts_cur = Date.now();
		var ts = ts_cur - this.lastDraw;
		this.lastDraw = ts_cur;

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.paddles.forEach(function (p) {
			p.physics(ts / 1000);
			p.draw(this.ctx)
		}, this);

		window.requestAnimationFrame(this.draw.bind(this));
    };

	Pong.prototype.controls = function (type, action) {
		var player = this.players[0+!!(action & 0x08)]; //so dirty

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
					action = _KEY_P1_UP;
					break;

				case 40: //DOWN
					action = _KEY_P1_DOWN;
					break;

				case 65: //A
					action = _KEY_P2_UP;
					break;

				case 90: //Z
					action = _KEY_P2_DOWN;
					break;
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

