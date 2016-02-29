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
    'uweaver/widget/Widget', 'uweaver/widget/Tooltips', 'uweaver/browser', 'uweaver/converter',
    'uweaver/exception/Violation',
    'uweaver/calibrator'], function ($, _, lang, Widget, Tooltips, browser, converter, Violation, calibrator){
    var declare = lang.declare;
    var Base = Widget;
    var i18n = uweaver.i18n;

    /**
     * A Inputbox is a widget for entering value.
     *
     * ##### JavaScript
     *     var inputbox = new Inputbox({
     *         el: $('#inputbox')
     *     });
     *     inputbox.render();
     *
     *     inputbox.value(12);
     *
     *     expect(inputbox.value()).to.equal(12);
     *
     * ##### HTML
     *     <!-- the following dom are required.
     *     + input - the DOM element.
     *     -->
     *     <form name="form" class="container form-horizontal">
     *         <label class="control-label col-sm-1 gutter">Price</label>
     *         <div class="col-sm-3 gutter">
     *             <input name="price" type="number" class="form-control" placeholder="Unit Price">
     *         </div>
     *     </form>
     *
     * ##### Events:
     * + 'change' - [value()]{@link Inputbox#value}
     *
     * @constructor Inputbox
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl:String - A html string to layout & construct the DOM element. Optional.
     * + name:String - A text string to specify the name. Required.
     * + value:String|Number|Date|Boolean - The value. Optional.
     * + type:String - A text string to specify the type of inputbox. Possible options: text, number, date, email & phone.
     * Optional.
     * + placeholder:String - A text string to specify the help info. Optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {};

        var tooltips = new Tooltips({
            target: this
        }).render();

        this._tooltips = tooltips;

        this.clear();
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
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        var $input = (this.tagName==='INPUT') ? this.$el : this.$el.closest('input');

        if($input.length===0) {
            $input = (this.tagName==='TEXTAREA') ? this.$el : this.$el.closest('textarea');
        }

        if(!browser.input.type.date) {
            $input.attr('data-role', 'date');
            $input.attr('data-inline', false);
            $input.addClass("date-input");
        }

        $input.on('change', _.bind(onChange, this));

        // calibrator.calibrate(this._component, ['font-size', 'font-weight', 'text-align']);

        this._$component = $input;

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

    function onChange(event) {
        this.change();
    }


    function value(value) {
        var $input = this._$component;
        var type = this.type();

        if(value===undefined) return this._value;

        if(type.toLowerCase()==='date' && value instanceof Date && browser.input.type.date) {
            value = converter.convert(value, 'string', "yyyy-MM-dd");
        } else {
            value = converter.convert(value, 'string');
        }

        if($input.val()==value) return;
        $input.val(value);
        this.change();
    }

    function change() {
        var $input = this._$component;
        var type = this.type();

        this.clear();
        this._value = undefined;

        try {
            if(type.toLowerCase()==='date' && browser.input.type.date) {
                this._value = converter.convert($input.val(), type, "yyyy-MM-dd");
            } else {
                this._value = converter.convert($input.val(), type);
            }

            this.trigger('change', {
                data: this.value(),
                context: this,
                source: this
            });
        } catch (ex) {
            this.violate(type);
        }
    }

    function name(name) {
        var $input = this._$component;

        if(!name) return $input.attr('name');

        $input.attr('name', name);
    }

    function type() {
        var $input = this._$component;

        return $input.attr('type') ? $input.attr('type') : 'text';
    }

    function placeholder(message) {
        var $input = this._$component;

        if(!message) return $input.attr('placeholder');

        $input.attr('placeholder', message);
    }

    function clear() {
        this._violations = [];
        this._tooltips.content("");
        this.removeClass('uw-border-warn');
    }

    function violate(rule, options) {
        var defaults = {
            properties: [this.name()],
            message: i18n.validation(rule)
        };

        options || (options = {});
        _.defaults(options, defaults);

        var violation = new Violation(rule, {
            properties: options.properties,
            message: options.message
        });

        this._violations.push(violation);

        this.hasClass('uw-border-warn') || this.addClass('uw-border-warn');

        this._tooltips.append(violation.toString() + "<br>");
    }

    var props = {
        /**
         * @override
         */
        tagName: 'input',

        /**
         * @override
         */
        className: 'form-control',

        _$component: undefined,
        _violations: undefined,
        _tooltips: undefined,
        _value: undefined
    };

    var Inputbox = declare(Base, {
        initialize: initialize,
        render: render,
        value: value,
        name: name,
        type: type,
        change: change,
        violate: violate,
        clear: clear
    }, props);

    return Inputbox;


});