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
    'uweaver/validator'], function(Backbone, _, lang, Proxy, REST, Reader, Json, validator) {
    var declare = lang.declare;
    var Base = Backbone.Model;

    /**
     * A class representing an data component.
     *
     * This class extends Backbone.Model with the following changes:
     * * idAttribute - change the default from 'id' to '_id'.
     * * url() - rewrite the url() to use the resource property to generate the URL of the model's resource on the server.
     *
     * ##### Usage
     *     // Declare a new type of model, Product, with the following designs:
     *     // * the resource - 'products'
     *     // * the default properties - {price: 0}
     *     // * the business id - the 'id' property.
     *     // * the object id - the '_id' property.
     *     var declare = uweaver.lang.declare;
     *     var Product = declare(Model, {
     *         resource: 'products',
     *         defaults: {
     *             'price': 0
     *         }
     *     });
     *
     *     // Create a product & save it to the server.
     *     // Assign the product a business id - "sunflower".
     *     // The server will assign a object id for the product after saved.
     *     var sunflower = new Product({id: "sunflower", name: "Sunflower", price: 0.5});
     *     sunflower.on('sync', function(product) {
     *         ....
     *     });
     *     sunflower.save();
     *
     *     // fetch a product with a object id, 'F0001', from the server & update the price.
     *     var product = new Product({_id: "F0001"});
     *     product.fetch({async: false});
     *     product.set('price', 2.6);
     * See [Backbone.Model's document](http://backbonejs.org/#Model) for details.
     *
     * ##### Events:
     * See [Backbone.Model's events](http://backbonejs.org/#Events) for details.
     *
     * @constructor Model
     * @extends Backbone.Model
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [attributes] - attributes.
     * @param {Object} [options] - A map of additional options to pass to the constructor.
     * See [Backbone.Model's constructor](http://backbonejs.org/#Model-constructor) for details.
     */
    function initialize(attributes, options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);
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
     * Persist the state of a model to the server.
     *
     * @memberof Model#
     * @param {String} method - The method name.
     * @param {Model} data - The model to be saved.
     * @param {Object} [options] - success and error callbacks, and all other jQuery request options.
     * See [Backbone.sync()](http://backbonejs.org/#Sync) for details.
     * @returns {Promise}
     */
    function sync(method, data, options) {
        var resource = this.resource;
        var action = method;

        // use the collection's resource property if the model's is not available.
        resource || (resource = (this.collection && this.collection.resource));
        return this.proxy().sync(resource, action, data, options);
    }

    /**
     * called whenever a model's data is returned by the server, in fetch, and save.
     * The function is passed the raw response object, and should return the attributes hash to be set on the model.
     *
     * @memberof Model#
     * @param {Object} response - The raw response object.
     * @param {Object} [options] - optional arguments.
     * See [Backbone.Model.parse()](http://backbonejs.org/#Model-parse) for details.
     * @returns {Object}  the model attributes.
     */
    function parse(response) {
        return this.reader().parseModel(this, response);
    }

    /**
     * validation logic. Receives the item attributes as well as any options passed to set or save.
     * By default save checks validate before setting any attributes but you may also tell set to validate
     * the new attributes by passing {validate: true} as an option.
     *
     * @memberof Model#
     * @param {Object} attributes - item attributes.
     * @param {Object} [options] - optional arguments.
     * @returns {Array} the violations.
     */
    function validate(attributes, options) {
        var constraints = this.constraints || {};

        var violations = validator.validate(attributes, constraints);

        if(violations.length>0) return violations;
    }

    var props = {
        idAttribute: '_id',
        resource: undefined,
        constraints: undefined,
        _proxy: new REST(),
        _reader: new Json()
    };

    var Model = declare(Base, {
        initialize: initialize,
        proxy: proxy,
        reader: reader,
        sync: sync,
        parse: parse,
        validate: validate
    }, props);

    Model.PROXY = {
        REST: new REST()
    };

    Model.READER = {
        JSON: new Json()
    };

    return Model;

});