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

define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget', 'text!./tpl/Menu.html',
    'uweaver/Logger'], function (_, $, lang, Widget, tpl, Logger) {
    var declare = lang.declare;

    var Base = Widget;

    /**
     * **Menu**
     * This class represents a dropdown menu.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Menu
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the menu.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        config || (config = {});

        var defaults = {};

        _.defaults(config, defaults);

        this.tpl = (config.tpl) || tpl;
    }

    function prepare() {
        Base.prototype.prepare.apply(this, arguments);
        var $items = this.$('a');

        $items.on('click', _.bind(onAnchorClick, this));
    }

    function select(value) {
        var event = {
            context: this,
            source: this,
            data: {
                value: value
            }
        };

        this.trigger('select', event);
    }

    function onAnchorClick(event) {
        event.preventDefault();

        value = $(event.currentTarget).attr('value');

        this.select(value);
    }

    var props = {
        LOGGER: new Logger("Menu")
    };

    var Menu = declare(Base, {
        initialize: initialize,
        prepare: prepare,
        select: select
    }, props);

    return Menu;
});
