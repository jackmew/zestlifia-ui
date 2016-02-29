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

define(['jquery', 'underscore', 'uweaver/lang',
    'uweaver/widget/Widget', 'uweaver/exception/NotEmptyConflictException'], function ($, _, lang, Widget, NotEmptyConflictException){
    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Trigger**
     * This class represents a trigger.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Trigger
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the trigger.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            value: undefined,
            name: undefined
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
    }

    /**
     * @override
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        if(cfg.value) {
            this.value(cfg.value);
        }

        this.name(cfg.name);

        this.name() || this.name(this.value());

        this.$el.on('click', _.bind(onTriggerClick, this));

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('render', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        return this;
    }

    function value(value) {
        var $node = this.$el;
        if(value===undefined) return $node.prop('value') || $node.attr('value');
        $node.prop('value', value);
    }

    function name(text) {
        var $node = this.$el;
        if(text===undefined) return $node.prop('name');
        $node.prop('name', text);
    }

    function onTriggerClick(event) {
        event.preventDefault();
        this.click();
    }

    function click() {
        if(!this.value()) {
            throw new NotEmptyConflictException({
                entity: this,
                property: 'value'
            });
        }

        var event = {
            context: this,
            source: this,
            data: {
                value: this.value()
            }
        };

        this.trigger("trigger", event);
    }

    var props = {
        _class: 'Trigger'
    };

    var Trigger = declare(Base, {
        initialize: initialize,
        render: render,

        click: click,

        value: value,
        name: name

    }, props);

    return Trigger;


});