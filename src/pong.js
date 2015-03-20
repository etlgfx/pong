if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	var Paddle = require('./paddle'),
		Obj = require('./obj'),
		Ball = require('./ball'),
		Mediator = require('./mediator'),
		Player = require('./player');

	var _KEY_P1_UP   = 0x01, //bitmask 0x08 determines player #
	    _KEY_P1_DOWN = 0x02,
	    _KEY_P2_UP   = 0x09,
	    _KEY_P2_DOWN = 0x0a;

	var _UP   = 0x01,
	    _DOWN = 0x02;


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

        Mediator.on('score', function (player, data) {
            switch (player) {
                case 'left':
                    this.players[0].score();
                    break;
                case 'right':
                    this.players[0].score();
                    break;
                default: throw new Error('what player: '+ player);
            }
        }, this);
	}

    Pong.prototype.draw = function () {
		var ts_cur = Date.now();
		var ts = (ts_cur - this.lastDraw) / 1000;
		this.lastDraw = ts_cur;

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.paddles.forEach(function (p) {
			p.physics(ts);
			p.draw(this.ctx);
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
		if (evt.type === 'keyup' || evt.type === 'keydown' || evt.charCode === 0) {
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
