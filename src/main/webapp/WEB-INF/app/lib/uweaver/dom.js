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
 * This module extends jQuery's functionality in dom manipulation.
 *
 * @module dom
 * @author  Jason Lin
 * @since   1.0
 */
define(['underscore', 'jquery'], function(_, $) {
    /**
     * Override jQuery's toggle method.
     *
     * @memberof module:dom
     * @param {Boolean} state
     * @returns {jQuery} jQuery object.
     */
    function toggle(state) {
        var tagName = this.prop('tagName');

        if(tagName!=='TR') {
            var fn = $.fn._toggle;
            return fn.apply(this, arguments);
        }

        if(state!==undefined) {
            this.mark(state);
            return this;
        }

        this.mark(!this.mark());

        return this;
    }

    function mark(state) {
        var selectClass = 'uw-mark';

        if(state===undefined) {
            return this.data('mark') || this.hasClass(selectClass);
        }

        this.data('mark', state);
        this.toggleClass(selectClass, state);

        return this;
    }

    function initialize() {
        //$.fn._toggle = $.fn.toggle;
        //$.fn.toggle = toggle;
        $.fn.mark = mark;
    }

    initialize();

    return $;
});