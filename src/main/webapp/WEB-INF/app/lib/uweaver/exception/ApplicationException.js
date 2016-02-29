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

define(['uweaver/lang', 'uweaver/string'], function(lang, string) {
    var declare = lang.declare;
    var Base = null;
    var name = "ApplicationException";

    /**
     * ....
     *
     *
     * @constructor ApplicationException#
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + entity(Object) - The object caused the exception.
     * + property(String) - The property should not be empty or NULL.
     * + message(String) - The error message.
     */
    function initialize(options) {
        options || (options = {});

        var defaults = {
            entity: null
        };

        _.defaults(options, defaults);

        options.message && (this.message = options.message);
        options.property && (this.property = options.property);
        this.entity = options.entity;

        var args = [this.entity, this.property];

        this.message = string.substitute(this.message, args);
    }

    function message(locale) {
        return this.name + ": " + this.message;
    }

    var props = {
        _message: undefined,
        _localizedMessage: undefined,

        /**
         * The object caused the exception.
         *
         * @memberof NotEmptyConflictException#
         * @protected
         * @type Object
         */

        entity: null,
        /**
         * The property should not be empty or NULL.
         *
         * @memberof NotEmptyConflictException#
         * @protected
         * @type String
         */
        property: null
    };

    var ApplicationException = declare(Base, {
        initialize: initialize,
        toString: toString
    }, props);

    return ApplicationException;
});