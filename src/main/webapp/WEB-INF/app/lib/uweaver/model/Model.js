/**
 * Created by jasonlin on 6/17/14.
 */
define(['backbone', 'underscore', 'uweaver/lang',
    'uweaver/net', 'uweaver/validator', 'uweaver/Logger'], function(Backbone, _, lang, net, validator, Logger) {
    var declare = lang.declare;

    var Model = declare(Backbone.Model, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        validate: validate,
        clear: clear,

        /**
         * protected members
         */
        logger: new Logger("Model"),
        resource: undefined,
        constraints: {},
        sync: sync,
        url: url,
        parse: parse

        /**
         * private members
         */
    });

    function initialize(attributes, options) {
        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);
    }

    function validate(attrs) {

        var violations = validator.validate(attrs, this.constraints);

        if(violations.length>0) return violations;
    }

    function clear() {
        this.destroy();
        this.view.remove();
    }

    function url(options) {
        options = options || {};

        var url;
        if(this.collection) {
            url = this.collection.url();
        } else {
            url = uweaver.environment.serviceContext() + "/" + this.resource;
        }

        var id = this.id || 'default';
        url = url + "/" + id;
        if(options.action) url = url + "/" + options.action;

        return url;
    }

    function sync(method, model, options) {
        options || (options = {});

        switch(method) {
            case 'create':
                return create(model, success, error);
            case 'update':
                return update(model, success, error);
            case 'patch':
                return Backbone.sync.call(this, method, model, options);
            case 'delete':
                return erase(model, success, error);
            case 'read':
                return read(model, success, error);
        }

        function success(result) {
            if(options.success) {
                options.success(result);
            }
        }

        function error(result) {
            if(options.error) {
                options.error(result);
            }
        }

        function create(model, success, error) {
            var payload = {
                items: [model.toJSON()],
                options: {}
            };

            var settings = {
                method: "POST",
                success: success,
                error: error,
                data: payload
            };

            _.defaults(settings, options);

            var promise =  net.request(model.url(), settings);

            return promise;
        }

        function read(model, success, error) {
            var settings = {
                method: "GET",
                success: success,
                error: error
            };

            _.defaults(settings, options);

            var promise =  net.request(model.url(), settings);

            return promise;
        }

        function update(model, success, error) {
            var payload = {
                items: [model.toJSON()],
                options: {}
            };

            var settings = {
                method: "PUT",
                success: success,
                error: error,
                data: payload
            };

            _.defaults(settings, options);

            var promise =  net.request(model.url(), settings);

            return promise;
        }

        function erase(model, success, error) {
            var settings = {
                method: "DELETE",
                success: success,
                error: error
            };

            _.defaults(settings, options);

            var promise =  net.request(model.url(), settings);

            return promise;
        }

    }

    function parse(response, xhr) {
        var item;

        if(!response) {
            item = {}
        } else if(response.items) {
            item = _.first(response.items);
        } else if(_.isObject(response)){
            item = response;
        } else {
            item = {};
        }

        return item;
    }

    return Model;
});