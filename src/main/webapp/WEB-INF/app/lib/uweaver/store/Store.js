/**
 * @license
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2014 Jason Lin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


define(['backbone', 'underscore', 'uweaver/lang', 'uweaver/model/Model',
    'uweaver/net', 'uweaver/converter',
    'uweaver/Logger'], function(Backbone, _, lang, Model, net, converter, Logger) {
    var declare = lang.declare;
    var DEFAULT_PAGE_SIZE = 10;

    var Store = declare(Backbone.Collection, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interface
         */
        url: url,
        total: total,
        pageSize: pageSize,
        page: page,
        pages: pages,
        filters: filters,
        previousPage: previousPage,
        nextPage: nextPage,

        /**
         * protected members
         */
        logger: new Logger("Store"),
        sync: sync,
        parse: parse,

        /**
         * private members
         */
        _total: 0,
        _pageSize: 0,
        _page: 1,
        _filters: {}

    });

    function initialize(models, config) {
        config || (config = {});

        this.config = config;

        var defaults = {
            pageSize: DEFAULT_PAGE_SIZE,
            model: Model
        };

        _.defaults(this.config, defaults);

        this._pageSize = this.config.pageSize;
        this.resource = this.config.resource;
        this.resource || (this.resource = new this.model().resource);

        this.on('update', _.bind(onUpdate, this));
        this.on('add', _.bind(onAdd, this));
        this.on('remove', _.bind(onRemove, this));
        this.on('change', _.bind(onChange, this));
    }

    function total() {
        return this._total;
    }

    function pageSize() {
        return this._pageSize;
    }

    function page(value, options) {
        if(!value) return this._page;

        this._page = value;
        this.fetch(options);
    }

    function previousPage(options) {
        this._page--;
        this.fetch(options);
    }

    function nextPage(options) {
        this._page++;
        this.fetch(options);
    }

    function pages() {
        return (this._pageSize===0) ? 1 : Math.ceil(this._total / this._pageSize);
    }

    function filters() {
        return this._filters;
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
                filters: collection._filters,
                pageSize: collection._pageSize,
                page: collection._page
            };

            _.defaults(options, defaults);

            var filters = options.filters || {};
            var limit = options.pageSize;
            var offset = (options.page-1) * options.pageSize;

            var settings = {
                method: "GET",
                success: success,
                error: error,
                data: {
                    filters: JSON.stringify(filters),
                    limit: limit,
                    offset: offset
                }
            };

            _.defaults(settings, options);

            var promise = net.request(collection.url(), settings);

            promise.then(function(response, status, xhr) {
                var payload = response;
                collection._pageSize = payload.limit;
                collection._page = (payload.offset / payload.limit) + 1;
                collection._total = payload.total;
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

    function onUpdate(store) {
        var event = {
            context: this,
            source: this,
            data: {}
        };

        this.trigger('items:update', event);
    }

    function onAdd(model) {
        var event = {
            context: this,
            source: this,
            data: model
        };

        this.trigger('items:add', event);
    }

    function onRemove(model) {
        var event = {
            context: this,
            source: this,
            data: model
        };

        this.trigger('items:remove', event);
    }


    function onChange(model) {
        var event = {
            context: this,
            source: model,
            data: model
        };

        this.trigger('items:change', event);
    }


    return Store;
});