/**
 * Created by jasonlin on 7/20/14.
 */
define(['underscore', 'jquery', 'uweaver/lang'], function (_, $, lang) {

    var Deferred = lang.declare(null, {

        initialize: initialize,

        resolve: resolve,
        reject: reject,
        notify: notify,

        promise: promise
    });

    function initialize() {
        this._deferred = $.Deferred();
        this._promise = new Promise(this._deferred.promise());
    }

    function resolve() {
        return this._deferred.resolve.apply(this, arguments);
    }

    function reject() {
        return this._deferred.reject.apply(this, arguments);
    }

    function notify() {
        return this._deferred.notify.apply(this, arguments);
    }

    function promise() {
        return this._promise;
    }

    function bind(callbacks, context) {
        if(!context) return callbacks;
        if(!callbacks) return callbacks;

        var fn = [];
        if(_.isArray(callbacks)) {
            _.each(callbacks, function(callback) {
                fn.push(_.bind(callback, context));
            });
        } else {
            fn.push(_.bind(callbacks, context));
        }
        return fn;
    }


    var Promise = lang.declare(null, {

        initialize: function (promise) {
            this._promise = promise;
        },

        then: function (doneCallbacks, failCallbacks, progressCallbacks, context) {
            if(_.isObject(_.last(arguments))) {
                context = _.last(arguments);
                (arguments.length > 3) || (progressCallbacks = undefined);
                (arguments.length > 2) || (failCallbacks = undefined);
            }

            this.done(doneCallbacks, context);
            this.fail(failCallbacks, context);
            this.progress(progressCallbacks, context);
            return this;
        },

        always: function (callbacks, context) {
            this._promise.always(bind(callbacks, context));
            return this;
        },

        done: function (callbacks, context) {
            this._promise.done(bind(callbacks, context));
            return this;
        },

        fail: function (callbacks, context) {
            this._promise.fail(bind(callbacks, context));
            return this;
        },

        progress: function (callbacks, context) {
            this._promise.progress(bind(callbacks, context));
            return this;
        },

        state: function () {
            return this._promise.state();
        },

        isResolved: function () {
            return this._promise.isResolved();
        },

        isRejected: function () {
            return this._promise.isRejected();
        }

    });

    return Deferred;
});