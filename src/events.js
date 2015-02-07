define(function(require) {
    'use strict;';

    var Events = {
        /**
         * TODO add multiple event processing
         */
        on: function (evt, callback, context) {
            if (this._events === undefined) {
                this._events = {evt: []};
            }

            if (this._events[evt] === undefined) {
                this._events[evt] = [];
            }

            //backbone doesn't do this, drop it?
            for (var i = 0; i < this._events[evt].length; i++) {
                if (this._events[evt][i] === callback) {
                    return;
                }
            }

            this._events[evt].push({
                callback: callback,
                context: context || this,
            });
        },

        off: function (evt, callback) {
            if (!this._events || !this._events[evt]) {
                return;
            }

            if (callback === undefined) {
                delete this._events[evt];
                return;
            }

            for (var i = 0; i < this._events[evt].length; i++) {
                if (this._events[evt][i] === callback) {
                    this._events[evt].splice(i, 1);
                    break;
                }
            }
        },

        removeAll: function () {
            this._events = {};
        },

        trigger: function (evt) {
            if (!this._events || !this._events[evt]) {
                return;
            }

            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            this._events[evt].forEach(function (listener) {
                listener.callback.apply(listener.context, args);
            });
        }
    };

    return Events;
});
