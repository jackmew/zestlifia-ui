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

define(['underscore', 'uweaver/lang', 'uweaver/data/proxy/Proxy', 'uweaver/environment',
    'uweaver/net'], function(_, lang, Proxy, env, net) {
    var declare = lang.declare;
    var Base = Proxy;

    /**
     * REST persist the state of a model/collection to the server
     *
     * @constructor Proxy
     * @extends Proxy
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [options] - optional configuration.
     */
    function initialize(options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);

        var REST = env.get("REST", {});

        this._server = options.server || REST.server;
        this._port = options.port || REST.port;
        this._context = options.context || REST.context;
    }


    /**
     * @override
     */
    function sync(resource, action, data, options) {
        options || (options = {});

        switch(action) {
            case 'create':
                return create.call(this, resource, data, options);
            case 'update':
                return update.call(this, resource, data, options);
            case 'patch':
                return update.call(this, resource, data, options);
            case 'delete':
                return erase.call(this, resource, data, options);
            case 'read':
                return read.call(this, resource, data, options);
            default:
                return action.call(this, resource, data, options);
        }
    }

    function action(resource, action, data, options) {
        var settings = {
            method: "PUT"
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(resource, data.id, action), settings);

        return promise;
    }

    function create(resource, data, options) {
        var payload = {
            items: [data.toJSON()],
            options: {}
        };

        var settings = {
            method: "POST",
            data: payload
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(resource), settings);

        return promise;
    }

    function read(resource, data, options) {
        var defaults = {};

        _.defaults(options, defaults);

        var filters = options.filters || [];
        var sorters = options.sorters || [];
        var limit = options.limit || 0;
        var offset = options.offset || 0;

        var settings = {
            method: "GET",
            data: {
                filters: JSON.stringify(filters),
                sorters: JSON.stringify(sorters),
                limit: limit,
                offset: offset
            }
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(resource, data.id), settings);

        return promise;
    }

    function update(resource, data, options) {
        var payload = {
            items: [data.toJSON()],
            options: {}
        };

        var settings = {
            method: "PUT",
            data: payload
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(resource, data.id), settings);

        return promise;
    }


    function erase(resource, data, options) {
        var settings = {
            method: "DELETE"
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(resource, data.id), settings);

        return promise;
    }

    function url(resource, id, action) {
        var url = "";

        if(this._server) {
            url = 'http://' + this._server;
            if(this._port) {
                url = url + ':' + this._port;
            }
        }

        this._context && (url = url + this._context);

        url = url + '/' + resource;

        if(id) {
            url = url + '/' + id;
        }

        action && (url = url + '/' + action);

        return url;
    }

    var props = {
        _server: undefined,
        _port: undefined,
        _context: undefined
    };

    var REST = declare(Base, {
        initialize: initialize,
        sync: sync,
        url: url
    }, props);

    return REST;

});