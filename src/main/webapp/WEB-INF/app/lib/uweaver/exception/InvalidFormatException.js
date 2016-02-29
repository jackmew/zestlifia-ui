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
     * @constructor InvalidFormatException#
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * @param {Object} [config.entity] - The object caused the exception.
     * @param {String} [config.format] - The valid format.
     * @param {String} [config.message] - The error message.
     */
    function initialize(options) {
        options || (options = {});

        var defaults = {
            entity: null
        };

        _.defaults(options, defaults);

        options.message && (this.message = options.message);
        options.format && (this.format = options.format);
        this.entity = options.entity;

        var args = {
            entity: this.entity,
            format: this.format
        };

        this.message = string.substitute(this.message, args);
    }

    function toString() {
        return this.name + ": " + this.message;
    }

    var props = {
        name: "InvalidFormatException",
        message: "Invalid format! Entity: ${entity}, Format: ${format}.",

        /**
         * The object caused the exception.
         *
         * @memberof InvalidFormatException#
         * @protected
         * @type Object
         */
        entity: null,

        /**
         * The format.
         *
         * @memberof InvalidFormatException#
         * @protected
         * @type String
         */
        format: null
    };

    var InvalidFormatException = declare(Base, {
        initialize: initialize,
        toString: toString
    }, props);

    return InvalidFormatException;
});