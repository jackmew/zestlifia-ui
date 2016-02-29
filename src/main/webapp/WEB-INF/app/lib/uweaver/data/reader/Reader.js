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
     * @constructor Reader
     * @extends BaseObject
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [options] - optional configuration.
     */
    function initialize(options) {
        Base.prototype.initialize.apply(this, arguments);
    }

    /**
     * called whenever a model's data is returned by the server, in fetch, and save.
     * The function is passed the raw response object, and should return the attributes hash to be set on the model.
     *
     * @memberof Reader#
     * @param {Object} response - The raw response object.
     * @returns {Object}  the object contains the attributes.
     */
    function parse(response) {}


    var props = {};

    var Reader = declare(Base, {
        initialize: initialize,
        parse: parse
    }, props);

    return Reader;

});