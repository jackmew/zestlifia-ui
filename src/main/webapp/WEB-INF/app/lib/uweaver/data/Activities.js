/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
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
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/data/Collection', 'uweaver/data/Activity'], function (_, $, lang, Collection, Activity) {

    var declare = lang.declare;
    var Base = Collection;

    /**
     * Store are ordered sets of items.
     *
     * @constructor Activities
     * @extends Collection
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [models] - the initial array of models.
     * @param {Object} [options] - optional configuration.
     */
    function initialize(models, options) {
        Base.prototype.initialize.apply(this, arguments);

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);
    }


    var props = {
        model: Activity
    };

    var Activities = declare(Base, {
        initialize: initialize
    }, props);


    return Activities;

});