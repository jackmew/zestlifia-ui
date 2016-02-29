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

    /**
     * ....
     *
     *
     * @constructor UnsupportedTypeException#
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * @param {String[]} [config.supportedTypes] - The type supported.
     * @param {String} [config.type] - The type of the object caused the exception.
     * @param {String} [config.message] - The error message.
     */
    function initialize(options) {
        options || (options = {});

        var defaults = {
            supportedTypes: []
        };

        _.defaults(options, defaults);

        options.message && (this.message = options.message);
        options.type && (this.type = options.type);
        this.supportedTypes = options.supportedTypes;

        var args = [this.supportedTypes.join(), this.type];

        this.message = string.substitute(this.message, args);
    }

    function toString() {
        return this.name + ": " + this.message;
    }

    var props = {
        name: "UnsupportedTypeException",
        message: "Unsupported object type! Supported Types: ${0}, Type: ${1}.",

        /**
         * The type supported.
         *
         * @memberof UnsupportedTypeException#
         * @protected
         * @type String[]
         */

        supportedTypes: null,
        /**
         * The type of the object caused the exception.
         *
         * @memberof UnsupportedTypeException#
         * @protected
         * @type String
         */
        type: null
    };

    var UnsupportedTypeException = declare(Base, {
        initialize: initialize,
        toString: toString
    }, props);

    return UnsupportedTypeException;
});