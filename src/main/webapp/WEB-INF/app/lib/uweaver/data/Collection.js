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

define(['backbone', 'underscore', 'uweaver/lang',
    'uweaver/data/proxy/Proxy', 'uweaver/data/proxy/REST', 'uweaver/data/reader/Reader', 'uweaver/data/reader/Json',
    'uweaver/data/Model'], function(Backbone, _, lang, Proxy, REST, Reader, Json, Model) {
    var declare = lang.declare;
    var Base = Backbone.Collection;

    /**
     * Collections are ordered sets of models.
     *
     * This class extends Backbone.Collection with the following changes:
     * * model - change the default from Backbone.Model to uweaver/data/Model.
     * * url() - rewrite the url() to use the resource property to generate the URL of the model's resource on the server.
     * * fetch() & sync() - rewrite to support pagination. see [fetch()]{@link Collection#fetch} for details.
     *
     * ##### Usage
     *     // Declare a new type of collection, Products, with the following designs:
     *     // * the resource - 'products'
     *     var declare = uweaver.lang.declare;
     *     var Products = declare(Collection, {
     *         resource: 'products'
     *     });
     *     var filters = [{"key":"price", "value":0.5, "op":">="}, {"key":"price", "value":10, "op":"<="}];
     *     var sorters = [{"key":"price", "order":"desc"}];
     *
     *     // fetch products from the server.
     *     products.on('update', function(collection) {
     *        ....
     *     });
     *     products.fetch({
     *         limit: 20,
     *         offset: 40,
     *         filters: filters,
     *         sorters: sorters,
     *         async: false
     *     });
     *
     *     // Create a product & save it to the server.
     *     // Assign the product a business id - "sunflower".
     *     // The server will assign a object id for the product after saved.
     *     var products = new Products();
     *
     *     products.on('sync', function(model) {
     *        ....
     *     });
     *     products.create({
     *         id: "sunflower",
     *         name: "Sunflower",
     *         price: 0.5
     *     });
     *
     * See [Backbone.Collection's document](http://backbonejs.org/#Collection) for details.
     *
     * ##### Events:
     * See [Backbone.Collection's events](http://backbonejs.org/#Events) for details.
     *
     * @constructor Collection
     * @extends Backbone.Collection
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [models] - the initial array of models.
     * @param {Object} [options] - A map of additional options to pass to the constructor.
     * See [Backbone.Collection's constructor](http://backbonejs.org/#Collection-constructor) for details.
     */
    function initialize(models, options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);
    }

    /**
     * Get the total property(the total number of records) returned from the server.
     *
     * @memberof Collection#
     * @returns {Integer}
     */
    function total() {
        return this._total;
    }

    /**
     * Get the limit property(page size) returned from the server.
     *
     * @memberof Collection#
     * @returns {Integer}
     */
    function limit() {
        return this._limit;
    }

    /**
     * Get the offset property returned from the server.
     *
     * @memberof Collection#
     * @returns {Integer}
     */
    function offset() {
        return this._offset;
    }

    /**
     * Get the filters(criteria) property returned from the server.
     *
     * @memberof Collection#
     * @returns {Object[]}
     */
    function filters() {
        return this._filters;
    }

    /**
     * Get the sorters(ordering) property returned from the server.
     *
     * @memberof Collection#
     * @returns {Object[]}
     */
    function sorters() {
        return this._sorters;
    }

    /**
     * Get the number of models in the collection.
     *
     * @memberof Collection#
     * @returns {Integer}
     */
    function size() {
        return this.length;
    }

    function proxy(theProxy) {
        if(!theProxy) return this._proxy;

        this._proxy = theProxy;
    }

    function reader(theReader) {
        if(!theReader) return this._reader;

        this._reader = theReader;
    }

    /**
     * Retrieve the data from the server.
     *
     * @memberof Collection#
     * @param {String} method - The method name.
     * @param {Collection} data - The collection to be read.
     * @param {Object} options - success and error callbacks, and all other jQuery request options.
     * See [Backbone.sync()](http://backbonejs.org/#Sync) for details.
     * @returns {Promise}
     */
    function sync(method, data, options) {
        var resource = this.resource;
        var action = method;

        // use the model's resource property when the collection's is not available
        resource || (resource = (this.constructor.prototype.model && this.constructor.prototype.model.prototype.resource));

        return this.proxy().sync(resource, action, data, options);
    }

    /**
     * called whenever a store's items are returned by the server, in fetch.
     * The function is passed the raw response object, and should return the array of model attributes to be added to the collection.
     *
     * @memberof Collection#
     * @param {Object} response - The row response object.
     * @param {Object} options - optional arguments.
     * @returns {Array} the array of item attributes to be added to the collection.
     */
    function parse(response, options) {
        return this.reader().parseCollection(this, response, options);
    }

    /**
     * Fetch the default set of models for this collection from the server, setting them on the collection when they arrive.
     *
     * @memberof Collection#
     * @param {Object} options - optional arguments.
     * ##### Options
     * + limit -  limit the number of results returned .
     * + offset - skip the first N rows before beginning to return results.
     * + filters - An array of objects to specify the criteria of the results. Examples: [{"key":"price","value":12,"op":">="}].
     * + sorters - An array of objects to specify the ordering of the results. Examples: [{"key":"price","order":"desc"].
     * See [Backbone.Collection.fetch()](http://backbonejs.org/#Collection-fetch) for more options.
     * @returns {Collection} this
     */
    function fetch(options) {
        Base.prototype.fetch.apply(this, arguments);
        return this;
    }

    var props = {
        model: Model,
        resource: undefined,

        _proxy: new REST(),
        _reader: new Json(),
        _total: undefined,
        _limit: undefined,
        _offset: undefined,
        _filters: undefined,
        _sorters: undefined
    };

    var Collection = declare(Base, {
        initialize: initialize,
        proxy: proxy,
        reader: reader,
        sync: sync,
        parse: parse,
        fetch: fetch,
        size: size,
        total: total,
        limit: limit,
        offset: offset,
        filters: filters,
        sorters: sorters
    }, props);

    Collection.PROXY = {
        REST: new REST()
    };

    Collection.READER = {
        JSON: new Json()
    };

    return Collection;

});