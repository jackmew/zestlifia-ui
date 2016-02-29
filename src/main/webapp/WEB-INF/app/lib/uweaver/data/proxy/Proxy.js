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

define(['underscore', 'uweaver/lang', 'uweaver/BaseObject'], function(_, lang, BaseObject) {
    var declare = lang.declare;
    var Base = BaseObject;

    /**
     * Proxy persist the state of a model/collection to the server
     *
     * @constructor Proxy
     * @extends BaseObject
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [options] - optional configuration.
     */
    function initialize(options) {
        Base.prototype.initialize.apply(this, arguments);
    }


    /**
     * Persist the state of a model to the server.
     *
     * @memberof Proxy#
     * @param {String} resource - The resource name.
     * @param {String} action - The action name.
     * @param {Collection|Model} data - The collection or the model.
     * @param {Object} options - optional arguments.
     */
    function sync(resource, action, data, options) {}

    var props = {};

    var Proxy = declare(Base, {
        initialize: initialize
    }, props);

    return Proxy;

});