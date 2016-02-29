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
    'uweaver/net', 'uweaver/converter',  'uweaver/validator'], function(Backbone, _, lang, net, converter, validator) {
    var declare = lang.declare;
    var Base = Backbone.Model;

    /**
     * A class representing an data components.
     *
     * @constructor Item
     * @extends Backbone.Model
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [attributes] - attributes.
     * @param {Object} options - optional arguments.
     */
    function initialize(attributes, options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);

        if(!this.resource) {
            this.resource = (this.collection && this.collection.resource) || options.resource;
        }

    }

    /**
     * Persist the state of a model to the server.
     *
     * @memberof Item#
     * @param {String} mothod - The method name.
     * @param {Model} model - The item.
     * @param {Object} options - optional arguments.
     */
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

            var url = (_.isFunction(model.url)) ? model.url() : model.url;
            var promise =  net.request(url, settings);

            return promise;
        }

        function read(model, success, error) {
            var settings = {
                method: "GET",
                success: success,
                error: error
            };

            _.defaults(settings, options);

            var url = (_.isFunction(model.url)) ? model.url() : model.url;
            var promise =  net.request(url, settings);

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

            var url = (_.isFunction(model.url)) ? model.url() : model.url;
            var promise =  net.request(url, settings);

            return promise;
        }

        function erase(model, success, error) {
            var settings = {
                method: "DELETE",
                success: success,
                error: error
            };

            _.defaults(settings, options);

            var url = (_.isFunction(model.url)) ? model.url() : model.url;
            var promise =  net.request(url, settings);

            return promise;
        }

    }

    /**
     * called whenever a model's data is returned by the server, in fetch, and save.
     * The function is passed the raw response object, and should return the attributes hash to be set on the model.
     *
     * @memberof Item#
     * @param {Object} response - The raw response object.
     * @param {Object} options - optional arguments.
     * @returns {Object}  the model attributes.
     */
    function parse(response, options) {
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

        _.each(item, function(value, key) {
            if(typeof value === "string") {
                if(converter.isDate(value)) {
                    item[key] = converter.toDate(value);
                }
            }
        });

        return item;
    }


    /**
     * Returns the relative URL where the item's resource would be located on the server.
     *
     * @memberof Item#
     * @param {Object} options - optional arguments.
     * @returns {String}  the URL.
     */
    function url(options) {
        var url = Base.prototype.initialize.apply(this, arguments);

        options = options || {};

        if(!url) {
            url = uweaver.environment.serviceContext() + "/" + this.resource;
        }

        (this.id) && (url = url + "/" + this.id);

        (options.action) && (url = url + "/" + options.action);

        return url;
    }

    /**
     * validation logic. Receives the item attributes as well as any options passed to set or save.
     * By default save checks validate before setting any attributes but you may also tell set to validate
     * the new attributes by passing {validate: true} as an option.
     *
     * @memberof Item#
     * @param {Object} attributes - item attributes.
     * @param {Object} options - optional arguments.
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
        constraints: undefined
    };

    var Item = declare(Base, {
        initialize: initialize,
        sync: sync,
        parse: parse,
        url: url,
        validate: validate
    }, props);

    return Item;

});