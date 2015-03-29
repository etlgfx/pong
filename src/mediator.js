if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

	'use strict;';

    var Events = require('events'),
        util = require('util');

    /**
     * Just a singleton Event bus
     */
	function Mediator() { }

    util.mixin(Mediator.prototype, Events);

	return new Mediator();
});
