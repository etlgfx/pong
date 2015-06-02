if (typeof define !== 'function') { var define = require('amdefine')(module); }

define((require) => {
    'use strict;';

    var Events = {
        /**
         * TODO add multiple event processing
         */
        on: (evt, callback, context) => {
            if (this._events === undefined) {
                this._events = {evt: []};
            }

            if (this._events[evt] === undefined) {
                this._events[evt] = [];
            }

            //backbone doesn't do this, drop it?
            for (var i of this._events[evt]) {
                if (this._events[evt][i] === callback) {
                    return;
                }
            }

            this._events[evt].push({
                callback: callback,
                context: context || this,
            });
        },

        off: (evt, callback) => {
            if (!this._events || !this._events[evt]) {
                return;
            }

            if (callback === undefined) {
                delete this._events[evt];
                return;
            }

            for (var i of this._events[evt]) {
                if (this._events[evt][i] === callback) {
                    this._events[evt].splice(i, 1);
                    break;
                }
            }
        },

        removeAll: () => {
            this._events = {};
        },

        trigger: (evt, ...args) => {
            if (!this._events || !this._events[evt]) {
                return;
            }

            this._events[evt].forEach((listener) => {
                listener.callback.apply(listener.context, args);
            });
        }
    };

    return Events;
});
