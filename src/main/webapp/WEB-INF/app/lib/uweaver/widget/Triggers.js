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
    'uweaver/widget/Widget', 'uweaver/widget/Trigger'], function (_, $, lang, Widget, Trigger) {
    var declare = lang.declare;
    var Base = Widget;


    /**
     * **Triggers**
     * This class represents a group of triggers.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Triggers
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the triggers.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            selector: "button,a"
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._triggers = [];
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        var triggers = this._triggers;

        var $triggers = this.$(cfg.selector);
        _.each($triggers, function(element) {
            var $trigger = $(element);
            var trigger = new Trigger({
                el: $trigger
            });
            trigger.render();
            this.listenTo(trigger, 'trigger', _.bind(onCommandTrigger, this));
            triggers.push(trigger);
        }, this);

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

    function get(name) {
        return _.find(this._triggers, function(trigger) {
            if(trigger.name()===name) {
                return trigger;
            }
        });
    }

    function first() {
        return _.first(this._triggers);
    }

    function last() {
        return _.last(this._triggers);
    }

    function find(criteria) {
        return _.filter(this._triggers, function (trigger) {
            if(trigger.name()===criteria.name || trigger.value().toUpperCase()===criteria.value.toUpperCase()) {
                return trigger;
            }
        });
    }

    function destroy() {
        _.each(this._triggers, function(trigger) {
            trigger.destroy();
        });

        Base.prototype.destroy.apply(this, arguments);
    }

    function onCommandTrigger(event) {
        event.context = this;
        this.trigger('trigger', event);
    }
    var props = {
        _triggers: undefined
    };

    var Triggers = declare(Base, {
        initialize: initialize,
        render: render,
        get: get,
        find: find,
        first: first,
        last: last
    }, props);

    return Triggers

});