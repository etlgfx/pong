if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

	function Mediator() {
		this.events = {};
	}

	Mediator.prototype.on = function (evt, callback) {
		if (this.events[evt] === undefined) {
			this.events[evt] = [callback];

			return;
		}

		for (var i = 0; i < this.events[evt].length; i++) {
			if (this.events[evt][i] === callback) {
				return;
			}
		}

		this.events[evt].push(callback);
	};

	Mediator.prototype.remove = function (evt, callback) {
		if (this.events[evt] === undefined) {
			return;
		}

		for (var i = 0; i < this.events[evt].length; i++) {
			if (this.events[evt][i] === callback) {
				this.events[evt].splice(i, 1);
				break;
			}
		}
	};

	Mediator.prototype.trigger = function (evt, data, context) {
		if (this.events[evt] === undefined) {
			return;
		}

		this.events[evt].forEach(function (callback) {
			if (context) {
				callback.call(context, data);
			}
			else {
				callback(data);
			}
		});
	};

	return new Mediator();
});
