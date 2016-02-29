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

define(['backbone', 'uweaver/lang'], function(Backbone, lang) {
    var declare = lang.declare;

    var Base = undefined;

    /**
     * A class contains attributes and methods that are used by all objects within the system.
     * This class gives the object the ability to bind and trigger custom named events.
     *
     * @constructor BaseObject
     * @extends Backbone.Events
     * @author  Jason Lin
     * @since   1.0
     */
    function initialize() {}

    var props = {};

    var BaseObject = declare(Base, {
        initialize: initialize
    }, props);

    return BaseObject;
});