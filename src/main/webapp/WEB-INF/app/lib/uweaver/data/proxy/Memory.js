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

define(['underscore', 'uweaver/lang', 'backbone', 'uweaver/data/Item'], function(_, lang, Backbone, Item) {
    var declare = lang.declare;
    var Base = Backbone.Collection;

    var DEFAULT_LIMIT = 500;

    /**
     * Store are ordered sets of items.
     *
     * @constructor Memory
     * @extends Backbone.Collection
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [models] - the initial array of models.
     * @param {Object} [options] - optional configuration.
     */
    function initialize(models, options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {
            limit: DEFAULT_LIMIT
        };

        _.defaults(options, defaults);

        this._limit = options.limit;
        if(!this.resource) {
            this.resource = this.model.prototype.resource || options.resource;
        }
    }

    function total() {
        return this._total;
    }

    function limit() {
        return this._limit;
    }

    function offset() {
        return this._offset;
    }

    function filters() {
        return this._filters;
    }

    function size() {
        return this.length;
    }

    /**
     * Persist the state of a model to the server.
     *
     * @memberof Store#
     * @param {String} mothod - The method name.
     * @param {Collection} collection - The collection.
     * @param {Object} options - optional arguments.
     */
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
                limit: collection._limit,
                offset: collection._offset
            };

            _.defaults(options, defaults);

            var filters = options.filters || {};
            var limit = options.limit || 0;
            var offset = options.offset || 0;

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

            var url = (_.isFunction(collection.url)) ? collection.url() : collection.url;

            var promise = net.request(url, settings);

            return promise;
        }
    }

    /**
     * called whenever a store's items are returned by the server, in fetch.
     * The function is passed the raw response object, and should return the array of model attributes to be added to the collection.
     *
     * @memberof Store#
     * @param {Object} response - The row response object.
     * @param {Object} options - optional arguments.
     * @returns {Array}  the array of item attributes to be added to the collection.
     */
    function parse(response) {
        this._total = response.total;
        this._limit = response.limit;
        this._offset = response.offset;
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

    /**
     * Returns the relative URL where the item's resource would be located on the server.
     *
     * @memberof Store#
     * @param {Object} options - optional arguments.
     * @returns {String}  the URL.
     */
    function url(options) {
        options = options || {};

        var url = uweaver.environment.serviceContext() + "/" + this.resource;

        if(options.action) url = url + "/" + options.action;

        return url;
    }

    var props = {
        _total: undefined,
        _limit: undefined,
        _offset: undefined,
        _filters: undefined,
        resource: undefined,
        model: Item
    };

    var Memory = declare(Base, {
        initialize: initialize,
        sync: sync,
        parse: parse,
        url: url,
        size: size,
        total: total,
        limit: limit,
        offset: offset,
        filters: filters
    }, props);

    return Memory;

});