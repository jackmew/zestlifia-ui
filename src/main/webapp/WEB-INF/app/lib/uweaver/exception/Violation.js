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
    var name = "Violation";

    /**
     * ....
     *
     *
     * @constructor Violation#
     * @author  Jason Lin
     * @since   1.0
     * @param {String} [rule] - The validation rule.
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + properties(String[]) - The properties violate the validation rule.
     * + message(String) - The error message.
     */
    function initialize(rule, options) {
        options || (options = {});

        var defaults = {
            properties: []
        };

        _.defaults(options, defaults);

        this._rule = rule;
        this._properties = options.properties;

        options.message && (this._message = options.message);
    }

    function message() {
        if(this._localizedMessage==null) {
            this._localizedMessage = this.localizedMessage();
        }

        return this._localizedMessage;
    }

    function localizedMessage() {
        var key = this._message;
    }

    function format() {
        var args = {
            rule: this.rule,
            properties: this.properties.join()
        };
        this.message = string.substitute(this.message, args);
    }

    function toString() {
        return this.name + ": " + this.message;
    }

    var props = {
        _message: "Rule: ${rule}; Properties: ${properties}.",
        _localizedMessage: null,

        _rule: null,
        _properties: null
    };

    var Violation = declare(Base, {
        initialize: initialize,
        toString: toString,
        message: message,
        localizedMessage: localizedMessage
    }, props);

    return Violation;
});