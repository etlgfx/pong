(function (name, definition) {
        if (typeof define == 'function') //we're probably using require.js or similar
                define(definition);
        else if (typeof module != 'undefined') //we're probably using node.js
                module.exports = definition();
        else //we're probably loading this directly in browser so assign the result to this (ie. window)
                this[name] = definition();
})('pong', function () {

    var canvas,
        ctx;

    function draw() {
    }

    function Obj(o) {
        this.coords = {
            x: o.coords[0],
            y: o.coords[1]
        };
        this.velocity = {
            x: o.velocity[0],
            y: o.velocity[1]
        };
        this.mass = 1;
        this.bounds = o.bounds;
    }

    function Paddle(o) {
    }
    Paddle.prototype = new Obj;

    function Player(o) {
    }

    function Ball(o) {
    }
    Ball.prototype = new Obj;

    function Bounds() {
    }

    Bounds.prototype.draw = function () {
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

    BoundsRect.prototype = new Bounds;
    BoundsSquare.prototype = new BoundsRect;
    BoundsCircle.prototype = new Bounds;

    return {
        init: function (id) {
            canvas = document.getElementById(id);
            ctx = canvas.getContext('2d');
        }
    };
});

