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

define(['uweaver/lang', 'uweaver/string', 'uweaver/exception/Violation'], function(lang, string, Violation) {
    var declare = lang.declare;

    var Base = null;

    /**
     * ....
     *
     *
     * @constructor ConstraintConflictException#
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + entity(Object) - The object caused the exception.
     * + violations(Violation[]) - The violations.
     * + message(String) - The error message.
     */
    function initialize(options) {
        options || (options = {});

        var defaults = {
            entity: null,
            violations: []
        };

        _.defaults(options, defaults);

        options.message && (this.message = options.message);
        this.entity = options.entity;
        this.violations = options.violations;

        var msgViolation = "";
        _.each(this.violations, function(violation){
            msgViolation + "\n" + violation.toString();
        });

        var args = [this.entity, msgViolation];

        this.message = string.substitute(this.message, args);
    }

    function toString() {
        return this.name + ": " + this.message;
    }

    var props = {
        name: "ConstraintConflictException",
        message: "Constraint violation! Object: {0}.\n{1}.",

        /**
         * The object caused the exception.
         *
         * @memberof NotEmptyConflictException#
         * @protected
         * @type Object
         */

        entity: null,
        /**
         * The violations
         *
         * @memberof ConstraintConflictException#
         * @protected
         * @type Violation[]
         */
        violations: null
    };

    var ConstraintConflictException = declare(Base, {
        initialize: initialize,
        toString: toString
    }, props);

    return ConstraintConflictException;
});