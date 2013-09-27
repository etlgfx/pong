var game = (function () {
	function Game(options) {
		this.objects = {};
		this.bounds = options && options.bounds ? options.bounds : [[0, 0], [0, 0]];
	}

	Game.prototype.animate = function() {
		var len = this.objects.length;

		for (var name in this.objects) {
			this.objects[name].animate();
		}

		this.collide();

		for (var name in this.objects) {
			this.objects[name].render();
		}
	};

	Game.prototype.add = function(name, obj) {
		if (!obj instanceof Obj) {
			throw new Error('not an Obj');
		}

		this.objects[name] = obj;

		return obj;
	};

	Game.prototype.collide = function() {
		var len = this.objects.length;

		//---- BALL COLLISIONS
		if (this.objects.ball.coords[1] < this.objects.ball.bounds[1][1]) {
			this.objects.ball.coords[1] = this.objects.ball.bounds[1][1] - this.objects.ball.coords[1];
			this.objects.ball.velo[1] = -this.objects.ball.velo[1];
		}

		if (this.objects.ball.coords[1] + this.objects.ball.bounds[1][1] > this.bounds[1][1]) {
			this.objects.ball.coords[1] += (this.bounds[1][1]) - (this.objects.ball.coords[1] + this.objects.ball.bounds[1][1]);
			this.objects.ball.velo[1] = -this.objects.ball.velo[1];
		}

		if (this.objects.ball.coords[0] < this.objects.ball.bounds[1][0]) {
			console.log('score right - hit left');
		}

		if (this.objects.ball.coords[0] + this.objects.ball.bounds[1][0] > this.bounds[1][0]) {
			this.objects.ball.velo[0] = -this.objects.ball.velo[0]; //TODO get rid of this should be score
		}

		if (this.objects.ball.coords[0] + this.objects.ball.bounds[0][0] < this.objects.batLeft.coords[0] + this.objects.batLeft.bounds[1][0] &&
				(this.objects.ball.coords[1] < this.objects.batLeft.coords[1] + this.objects.batLeft.bounds[1][1] &&
				this.objects.ball.coords[1] > this.objects.batLeft.coords[1] + this.objects.batLeft.bounds[0][1] )) {
			//this.objects.ball.coords[0] = this.objects.ball.bounds[1][1] - this.objects.ball.coords[1];
			this.objects.ball.velo[1] = - 1.01 * this.objects.ball.velo[0]; //accerelating!
		}

		/* TODO put paddle - ball collection back here
		if (this.objects.ball.coords[0] + this.objects.ball.bounds[1][0] > this.objects.batRight.coords[0] + this.objects.batLeft.bounds[0][0] &&
				(this.objects.ball.coords[1] < this.objects.batRight.coords[1] + this.objects.batRight.bounds[1][1] &&
				this.objects.ball.coords[1] > this.objects.batRight.coords[1] + this.objects.batRight.bounds[0][1] )) {
			//this.objects.ball.coords[0] = this.objects.ball.bounds[1][1] - this.objects.ball.coords[1];
			this.objects.ball.velo[0] = -this.objects.ball.velo[0];
		}
		*/

		//----- PADDLE COLLISIONS
		if (this.objects.batRight.coords[1] + this.objects.batLeft.bounds[0][1] < this.bounds[0][1]) {
			this.objects.batRight.velo[1] = 0;
		}
		else if (this.objects.batRight.coords[1] + this.objects.batRight.bounds[1][1] > this.bounds[1][1]) {
			this.objects.batRight.velo[1] = 0;
			this.objects.batRight.coords[1] = this.bounds[1][1] - this.objects.batRight.bounds[1][1];
		}

		if (this.objects.batLeft.coords[1] + this.objects.batLeft.bounds[0][1] < this.bounds[0][1]) {
			this.objects.batLeft.velo[1] = 0;
			this.objects.batLeft.coords[1] = this.bounds[0][1] - this.objects.batLeft.bounds[0][1];
		}
		else if (this.objects.batLeft.coords[1] + this.objects.batLeft.bounds[1][1] > this.bounds[1][1]) {
			this.objects.batLeft.velo[1] = 0;
			this.objects.batLeft.coords[1] = this.bounds[1][1] - this.objects.batLeft.bounds[1][1];
		}
	};

	function Obj(dom, options) {
		if (!dom instanceof Node) {
			throw new Error('not a Node');
		}

		this.dom = dom;
		this.coords = options && options.coords ? options.coords : [0, 0];
		this.velo = options && options.velo ? options.velo : [0, 0];
		this.mass = options && options.mass ? options.mass : 1;

		this.bounds = options && options.bounds ? options.bounds : [[0, 0], [0, 0]];
		this.radius = options && options.radius ? options.radius : 0;
	}

	Obj.prototype.pos = function (c) {
		this.coords = [c[0], c[1]];
	};

	Obj.prototype.animate = function() {
		this.coords[0] += this.velo[0];
		this.coords[1] += this.velo[1];
	};

	Obj.prototype.render = function () {
		this.dom.style.left = this.coords[0] +"px";
		this.dom.style.top = this.coords[1] +"px";
	};

	function Control(map) {
	}

	return {
		Obj: Obj,
		Game: Game
	};
})();

window.addEventListener('load', function () {
	var ball = document.querySelector('.ball');

	var w = [ball.offsetParent.clientWidth, ball.offsetParent.clientHeight];

	var g = new game.Game({bounds: [[0, 0], w]});

	ball = g.add('ball', new game.Obj(ball, {
		coords: [w[0] / 2, w[1] / 2],
		bounds: [[-10, -10], [10, 10]],
		velo: [7, -4],
	}));

	var batLeft = g.add('batLeft', new game.Obj(document.querySelector('.bat-left'), {
		coords: [20, w[1] / 2],
		bounds: [[0, -50], [20, 50]],
		velo: [0, -1],
	}));

	var batRight = g.add('batRight', new game.Obj(document.querySelector('.bat-right'), {
		coords: [w[0] - 40, w[1] / 2],
		bounds: [[0, -50], [20, 50]],
		velo: [0, 1],
	}));

	ball.collide = function(o) {
	};

	batLeft.collide = batRight.collide = function(o) {
	};

	var i = 0;

	function animate () {
		if (i++ > 300) {
			return;
		}

		g.animate();
		window.requestAnimationFrame(animate);
	}

	animate();
}, true);
