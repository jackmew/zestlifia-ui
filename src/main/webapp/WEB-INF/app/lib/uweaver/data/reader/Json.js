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

define(['underscore', 'backbone', 'uweaver/lang', 'uweaver/data/reader/Reader', 'uweaver/environment',
    'uweaver/datetime'], function(_, Backbone, lang, Reader, env, datetime) {
    var declare = lang.declare;
    var Base = Reader;

    // ISO 8601 data & time representation format.
    var DATETIMEPATTERN = "yyyy-MM-ddTHH:mm:ss.SSSZ";

    /**
     * REST persist the state of a model/collection to the server
     *
     * @constructor Json
     * @extends Reader
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
     * @memberof Json#
     * @param {Object} response - The raw response object.
     * @returns {Object}  the model attributes.
     */
    function parseModel(model, response) {
        var attributes;

        if(!response) {
            attributes = {}
        } else if(response.items) {
            attributes = _.first(response.items);
        } else if(_.isObject(response)){
            attributes = response;
        } else {
            attributes = {};
        }

        _.each(attributes, function(value, key) {
            if(_.isString(value)) {
                if(datetime.test(value, DATETIMEPATTERN)) {
                    attributes[key] = datetime.parse(value, DATETIMEPATTERN);
                }
            }
        });

        return attributes;
    }

    function parseCollection(collection, response) {
        collection._total = response.total;
        collection._limit = response.limit;
        collection._offset = response.offset;
        collection._filters = response.filters;
        collection._sorters = response.sorters;
        var items = [];
        _.each(response.items, function(item) {
            _.each(item, function(value, key) {
                if(typeof value === "string") {
                    if(datetime.test(value, DATETIMEPATTERN)) {
                        item[key] = datetime.parse(value, DATETIMEPATTERN);
                    }
                }
            });
            items.push(item);
        });

        return items;
    }

    var props = {};

    var Json = declare(Base, {
        initialize: initialize,
        parseModel: parseModel,
        parseCollection: parseCollection
    }, props);

    return Json;

});