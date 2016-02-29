/**
 * Created by jasonlin on 6/17/14.
 */
define(['backbone', 'underscore', 'uweaver/lang',
    'uweaver/net', 'uweaver/converter',
    'uweaver/Logger'], function(Backbone, _, lang, net, converter, Logger) {
    var declare = lang.declare;

    var Store = declare(Backbone.Collection, {

        logger: new Logger("TreeStore"),

        initialize: initialize,

        url: url,
        total: total,
        filter: filter,

        sync: sync,

        parse: parse,

        parentId: parentId,

        _total: 0,
        _filter: {}

    });

    function initialize(options) {
        options || (options = {});

        var defaults = {

        };

        _.defaults(options, defaults);


    }

    function parentId() {

    }

    function total() {
        return this._total;
    }


    function filter() {
        return this._filter;
    }

    function url(options) {
        options = options || {};

        var url = uweaver.environment.serviceContext() + "/" + this.resource;

        if(options.action) url = url + "/" + options.action;

        return url;
    }


    function sync(method, collection, options) {
        options || (options = {});

        switch(method) {
            case 'create':
                return Backbone.sync.call(this, method, collection, options);
            case 'update':
                return Backbone.sync.call(this, method, collection, options);
            case 'patch':
                return Backbone.sync.call(this, method, collection, options);
            case 'delete':
                return Backbone.sync.call(this, method, collection, options);
            case 'read':
                return read(collection, success, error);
        }

        function success(response) {
            if(options.success) {
                options.success(response);
            }
        }

        function error(response) {
            if(options.error) {
                options.error(response);
            }
        }

        function read(collection, success, error) {
            var defaults = {
                filter: collection._filter
            };

            _.defaults(options, defaults);

            var filter = options.filter || {};

            var settings = {
                method: "GET",
                success: success,
                error: error,
                data: {
                    filter: JSON.stringify(filter)
                }
            };

            var promise = net.request(collection.url(), settings);

            promise.then(function(response, status, xhr) {
                collection._filter = filter;
            }, function(xhr, status, error) {
                this.logger.error(Logger.EXCEPTION, "read", settings, status);
            }, collection);

            return promise;
        }
    }

    function parse(response) {
        this._total = response.total;

        var items = [];
        _.each(response.items, function(item) {
            _.each(item, function(value, key) {
                if(typeof value === "string") {
                    if(converter.isDate(value)) {
                        item[key] = converter.toDate(value);
                    }
                }
            });
            items.push(item);
        });

        return items;
    }


    return Store;
});