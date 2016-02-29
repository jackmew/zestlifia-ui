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

define([
    'underscore', 'uweaver/lang', 'uweaver/environment', 'uweaver/string'
], function(_, lang, environment, string) {
    var declare = lang.declare;

    var Base = null;

    /**
     * A class representing a logger.
     *
     * @constructor Logger
     * @param {String} name - The name of the logger.
     * @author  Jason Lin
     * @since   1.0
     */
    function initialize(name){
        this._name = name || "N/A";
        if(environment.get("logLevel")) {
            this._level = environment.get("logLevel");
        } else {
            this._level = Logger.Level.WARN;
        }
    }

    /**
     * Log a message at the specified level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {Logger.Level} level - the log level.
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function log(level, format) {
        if(!console) return;

        var name = this._name;

        if(level >= this._level) {
            var stack = format.stack;
            _.isString(format) || (format = format.toString());
            var message = string.substitute(format, _.rest(arguments, 2));

            var pattern = "${level}: ${name} @ ${when} - ${message}";
            var props = {level: Logger.CODETABLE[level] , name: name, when:new Date(), message: message};

            //var props = {level: Logger.CODETABLE[level] , name: name, when:new Date(), params:JSON.stringify(params)};

            console.log(string.substitute(pattern, props));
            stack && console.log(stack);
        }
    }

    /**
     * Log a message at the TRACE level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function trace(format, args) {
        log.apply(this, [Logger.Level.TRACE].concat(Array.prototype.slice.call(arguments)));
    }

    /**
     * Log a message at the DEBUG level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function debug(format, args) {
        log.apply(this, [Logger.Level.DEBUG].concat(Array.prototype.slice.call(arguments)));
    }

    /**
     * Log a message at the INFO level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function info(format, args) {
        log.apply(this, [Logger.Level.INFO].concat(Array.prototype.slice.call(arguments)));
    }

    /**
     * Log a message at the WARN level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function warn(format, args) {
        log.apply(this, [Logger.Level.WARN].concat(Array.prototype.slice.call(arguments)));
    }

    /**
     * Log a message at the ERROR level according to the specified format and arguments.
     *
     * @memberof Logger#
     * @param {String} format - the format string
     * @param {Arguments} [args] - the arguments
     */
    function error(format, args) {
        log.apply(this, [Logger.Level.ERROR].concat(Array.prototype.slice.call(arguments)));
    }

    /**
     * Get the name of this logger instance.
     *
     * @memberof Logger#
     * @returns {String} name of this logger instance.
     */
    function name() {
        return this._name;
    }

    var props = {
        _name: undefined,
        _level: undefined
    };

    var Logger = declare(Base, {
        initialize: initialize,
        log: log,
        trace: trace,
        debug: debug,
        info: info,
        warn: warn,
        error: error,
        name: name
    }, props);

    // Enumeration of Log Level
    Logger.Level = {
        ALL: 0,
        TRACE: 1,
        DEBUG: 2,
        INFO: 3,
        WARN: 4,
        ERROR: 5
    };

    Logger.CODETABLE = ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR"];

    return Logger;

});