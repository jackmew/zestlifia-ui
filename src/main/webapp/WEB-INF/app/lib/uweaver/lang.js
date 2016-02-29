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

/**
 * This module provides basic language functionality.
 *
 * @module lang
 * @author  Jason Lin
 * @since   1.0
 */
define(['underscore'], function(_) {

    /**
     * Declare a new class.
     *
     * @memberof module:lang
     * @param {Object} supreclass - a parent class to extend.
     * @param {Object} methods - methods of the new class.
     * @param {Object} [props] - properties of the new class.
     * @returns {function} constructor of the new class.
     */
    function declare(superclass, methods, props) {
        props || (props = {});
        props.serialVersionUID = _.uniqueId();

        var constructor;
        var model = _.extend(methods, props);

        model.parent = superclass;


        if(superclass && superclass.extend) {
            // for those extend Backbone's, such as BaseObject, Widget, Model or Store
            constructor = superclass.extend(model);
        } else {
            constructor = function() {
                if (this.initialize) {
                    this.initialize.apply(this, arguments);
                }
            };

            if(superclass) {
                _.extend(constructor.prototype, superclass.prototype);
                constructor.prototype.uber = superclass.prototype;
            }
            _.extend(constructor.prototype, model);
        }
        return constructor;
    }

    return {
        declare: declare
    };
});