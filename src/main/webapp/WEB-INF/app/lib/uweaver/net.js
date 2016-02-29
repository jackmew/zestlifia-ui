/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * developing enterprise application software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2015 Jason Lin
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

/**
 *
 * This module provides a collection of utility methods for performing asynchronous HTTP(Ajax) requests.
 *
 * @module net
 * @author  Jason Lin
 * @since   1.0
 */
define(['underscore', 'jquery', 'uweaver/Deferred',
        'uweaver/Logger'], function(_, $, Deferred, Logger){

    var LOGGER = new Logger("uweaver/net");

    initialize();

    function initialize() {}

    /**
     * Perform a asynchronous HTTP request.
     *
     * @memberof module:net
     * @param {String} url - A string containing the URL to which the request is sent.
     * @param {Object} [options] - A map of additional options to pass to the method. All jQuery.ajax options can be passed directly as request options.
     * @param {String} [options.headers={}] - An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport.
     * @param {String} [options.contentType=application/json; charset=UTF-8] - An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport.
     * @param {String} [options.dataType=json] - The type of data that you're expecting back from the server. If you need synchronous requests, set this option to false
     * @param {Boolean} [options.async=true] - By default, all requests are sent asynchronously.
     * @returns {Deferred} the response
     */
    function request(url, options) {
        var defaults = {
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        };
        var settings = _.extend(defaults, options);


        if(settings.data && (settings.method && settings.method!=='GET')) {
            settings.data = JSON.stringify(settings.data);
        }

        var promise = $.ajax(url, settings);

        var caller = arguments.callee.caller.name;
        LOGGER.debug("Request sent by ${0} with ${1}", caller, {url: url, options: _.omit(options, 'context')});

        var deferred = new Deferred();

        promise.then(function(response, status, xhr) {
            LOGGER.debug("Response received by ${0} with ${1}", caller,
                {url: url, options: _.omit(options, 'context'), payload: response, status: xhr.status});

            deferred.resolve(response, status, xhr);
        }, function(xhr, status, error) {
            var params = {
                url: url,
                settings: settings
            };
            var message = xhr.statusText + "(" + xhr.status + "): " + xhr.responseText;
            LOGGER.error("Error received by ${0} with ${1}", caller, {params: params, message: message});

            deferred.reject(xhr, status, error);
        }, this);

        return deferred.promise();
    }

    var net = {
        request: request
    };

    return net;
});