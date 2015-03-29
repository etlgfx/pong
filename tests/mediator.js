var assert = require('assert');
var Mediator = require('../src/mediator');

describe('Mediator', function () {
	it('triggers callbacks and removes', function (done) {
		var handler = function (data) {
			assert.equal(data.key, 'value');
			done();
		};

		Mediator.on('event', handler);

		Mediator.trigger('event', {key: 'value'});

		Mediator.remove('event', handler);

		assert.deepEqual(Mediator.events['event'], []);
	});

	it('clears handlers', function () {
		Mediator.clear();
		assert.deepEqual(Mediator.events, {});
	});

});
