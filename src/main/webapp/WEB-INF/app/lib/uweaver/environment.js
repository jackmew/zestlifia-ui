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
 * This module provides the system settings.
 *
 * @module environment
 * @author  Jason Lin
 * @since   1.0
 */
define([
    'underscore', 'jquery'
], function(_, $) {

    var _isLoaded = false;

    var _props = {};

    var DATETIMEDEFAULT = {
            "datetimePattern": "yyyy-MM-dd HH:mm:ss",
            "datetPattern": "yyyy-MM-dd",
            "timePattern" : "HH:mm:ss"},
        NUMBERDEFAULT = {
            "currencyPattern" : "$#,##0.##",
            "numberPattern" : "#,##0.##",
            "currencySign": "$",
            "groupingSeparator": ",",
            "decimalSeparator" : "."};

    initialize();

    function initialize() {
        load();
    }

    function appName() {
        return this.get('appName');
    }

    function appContext() {
        return this.get('appContext');
    }

    function serviceContext() {
        return this.get('serviceContext');
    }

    function profile() {
        return this.get('profile');
    }

    function device() {
        return 'touch';
    }

    function timeout() {
        return this.get('timeout');
    }

    /**
     * Get or Set the date time representation format.
     *
     * @memberof module:environment
     * @param {String} [pattern] - the date & time format.
     * @returns {String}
     */
    function datetimePattern(pattern) {
        if(pattern) this.set('datetime').datetimePattern = pattern;

        return this.get('datetime').datetimePattern;
    }

    /**
     * Get or Set the simple date representation format.
     *
     * @memberof module:environment
     * @param {String} [pattern] - the simple date format.
     * @returns {String}
     */
    function datePattern(pattern) {

        if(pattern) this.set('datetime').datePattern = pattern;

        return this.get('datetime').datePattern;
    }

    /**
     * Get or Set the time representation format.
     *
     * @memberof module:environment
     * @param {void|String} pattern - the time format.
     * @returns {String}
     */
    function timePattern(pattern) {
        if(pattern) this.set('datetime').timePattern = pattern;

        return this.get('datetime').timePattern;
    }

    /**
     * Get or Set the number representation format.
     *
     * @memberof module:environment
     * @param {String} [pattern] - the number format.
     * @returns {String}
     */
    function numberPattern(pattern) {
        if(pattern) this.set('number').numberPattern = pattern;

        return this.get('number').numberPattern;
    }

    /**
     * Get or Set the currency representation format.
     *
     * @memberof module:environment
     * @param {String} [pattern] - the number format.
     * @returns {String}
     */
    function currencyPattern(pattern) {
        if(pattern) this.set('number').currencyPattern = pattern;

        return this.get('number').currencyPattern;
    }

    /**
     * Get or Set the decimal separator.
     *
     * @memberof module:environment
     * @param {String} [separator] - the decimal separator.
     * @returns {String}
     */
    function decimalSeparator(separator) {
        if(separator) this.set('number').decimalSeparator = separator;

        return this.get('number').decimalSeparator;
    }

    /**
     * Get or Set the grouping separator.
     *
     * @memberof module:environment
     * @param {String} [separator] - the grouping separator.
     * @returns {String}
     */
    function groupingSeparator(separator) {
        if(separator) this.set('number').groupingSeparator = separator;

        return this.get('number').groupingSeparator;
    }

    /**
     * Get or Set the currency sign.
     *
     * @memberof module:environment
     * @param {String} [sign] - currency sign.
     * @returns {String}
     */
    function currencySign(sign) {
        if(sign) this.set('number').currencySign = sign;

        return this.get('number').currencySign;
    }

    /**
     * Get or Set the locale.
     *
     * @memberof module:environment
     * @param {String} [language] - ISO 639 language code.
     * @param {String} [country] - ISO 3166-1 country code.
     * @returns {Object}
     */
    function locale(language, country) {
        if(!language) return this.get('locale');

        this.set('locale', {language: language, country: country});
    }

    function site() {
        return this.get('site');
    }

    function multisite() {
        return this.get('multisite');
    }

    function anonymous() {
        return this.get('anonymous');
    }

    function get(name, defaultValue) {
        return _props[name] || defaultValue;
    }

    function set(name, value) {
        _props[name] = value;
    }

    function isLoaded() {
        return _isLoaded;
    }

    function load(url) {

        url || (url = 'conf/app.properties');

        var payload = {};
        payload.items = [];

        var dto = JSON.stringify(payload);

        var result = $.ajax(url, {
            headers: {
                "Content-Type": 'application/json; charset=UTF-8',
                "Accept": 'application/json'
            },
            dataType: 'json',
            data: dto,
            async: true
        }).then(
            function(response) {
                var payload = response;

                _props = payload;

                var lang = navigator.language.split('-');

                var defaults = {
                    profile: 'production',
                    timeout: 60000,
                    datetime: {},
                    number: {},
                    locale: {
                        language: lang[0],
                        country: lang[1]
                    }
                };

                _.defaults(_props, defaults);
                _.defaults(_props.datetime, DATETIMEDEFAULT);
                _.defaults(_props.number, NUMBERDEFAULT);

                _isLoaded = true;
            },
            function(xhr, status, error) {
                console.log("Failed to load the app.properties");
                console.log("status: " + status);
                console.log("xhr: " + xhr.statusText + "(" + xhr.status + ")");
                console.log("response: " + xhr.responseText);
            }
        );

        return result;
    }

    return {
        load: load,
        isLoaded: isLoaded,
        get: get,
        set: set,
        appName: appName,
        appContext: appContext,
        serviceContext: serviceContext,
        profile: profile,
        device: device,
        timeout: timeout,
        datePattern: datePattern,
        datetimePattern: datetimePattern,
        timePattern: timePattern,
        currencyPattern: currencyPattern,
        numberPattern: numberPattern,
        decimalSeparator: decimalSeparator,
        groupingSeparator: groupingSeparator,
        currencySign: currencySign,
        locale: locale,
        site: site,
        multisite: multisite,
        anonymous: anonymous
    };

});
