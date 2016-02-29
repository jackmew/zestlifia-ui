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
 * This module provides a collection of utility methods for internationalization.
 *
 * ##### Usage
 *     var locale = {
 *         language: "zh",
 *         country: "TW"
 *     };
 *
 *     var options = {
 *         locale: locale,
 *     };
 *     expect(i18n.translate("Purchase Order", options)).to.equal("採購單");
 *     expect(i18n.translate("total: ${0} records", options)).to.equal("總計：${0} 筆記錄");
 *
 *     options.namespace = "message";
 *     expect(i18n.translate("Please select one record.", options)).to.equal("請選擇一筆記錄．");
 *
 *     i18n.locale(locale);
 *     expect(i18n.locale()).to.deep.equal(locale);
 *
 *     expect(i18n.translate("Purchase Order")).to.equal("採購單");
 *
 * @module i18n
 * @author  Jason Lin
 * @since   1.0
 */

define(['underscore', 'i18next'], function (_, i18next) {

    /**
     * initialize the i18n module.
     *
     * @memberof module:i18n
     * @param {Object} [options] - A map of additional options to pass to the method.
     * @param {Object} [options.locale] - The locale for i18n.
     * @param {Object} [options.namespaces=['term', 'message']] - The message resources.
     * @param {Object} [options.fallback={language: 'en'}] - The fallback locale.
     */
    function initialize(options) {
        options || (options = {});

        var lang = navigator.language.split('-');

        var defaults = {
            locale: {language: lang[0], country: lang[1]},
            namespaces: ['term', 'message'],
            fallback: {language: 'en'}
        };

        _.defaults(options, defaults);

        var fallbackLng = options.fallback.language;
        (options.fallback.country) && (fallbackLng = fallbackLng + '-' + options.fallback.country);

        var settings = {
            resGetPath: 'nls/__lng__/__ns__.json',
            fallbackLng: fallbackLng,
            detectLngQS: 'lang',
            getAsync: false,
            ns: {
                namespaces: options.namespaces,
                defaultNs: options.namespaces[0]
            },
            nsseparator: '::',
            keyseparator: '->'
        };


        i18next.init(settings);

        locale(options.locale);
    }

    /**
     * translate the words.
     *
     * @memberof module:i18n
     * @param {String|Object} words - the words to translate.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * @param {String} [options.locale] - The locale to use for translation.
     * @param {String} [options.namespace] - The namespace to lookup the translation.
     * @returns {String|Object}
     */
    function translate(words, options) {
        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);

        if(typeof(words) === 'string') {
            return find(words, options);
        } else if(words instanceof Object) {
            var values = {};
            _.each(words, function (words, key) {
                if(words instanceof Object) {
                    values[key] = translate(words)
                } else {
                    values[key] = find(words, options);
                }
            });
            return values;
        }
    }

    function find(key, options) {
        options || (options = {});

        var lang = localeToLang(options.locale);

        return i18next.translate(key, {ns: options.namespace, lng: lang});
    }

    function localeToLang(locale) {
        if(!(locale && locale.language)) return undefined;

        var lang = locale.language;

        (locale.country) && (lang = lang + '-' + locale.country);

        return lang;
    }

    function langToLocale(lang) {
        var tokens = lang.split('-');
        return {
            language: tokens[0],
            country: tokens[1]
        };
    }

    /**
     * Get or set the locale of i18n.
     *
     * @memberof module:i18n
     * @param {Object} locale - the locale.
     * @returns {Object|void}
     */
    function locale(locale) {
        var lng = i18next.lng();

        if(!locale) {
            return langToLocale(lng);
        }

        var lang = localeToLang(locale);

        if(lang===lng) return;

        i18next.setLng(lang);
    }

    return {
        initialize: initialize,
        translate: translate,
        locale: locale
    };
});
