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
    'uweaver/widget/Widget', 'uweaver/widget/Icon',
    'uweaver/identifier', 'uweaver/calibrator',
    'text!./tpl/Button.html'], function ($, _, lang, Widget, Icon, identifier, calibrator, tpl){
    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Button**
     * This class represents a button.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Button
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the button.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            value: undefined,
            icon: undefined,
            text: undefined,
            name: undefined
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $icon: undefined,
            $text: undefined
        };

        if(this.$el.html().length===0 && this.el.tagName==='BUTTON') {
            this.addClass('btn btn-default');
            cfg.tpl || (cfg.tpl = tpl);
        }
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

        var anchors = this._anchors;

        anchors.$text = this.$anchor('text');
        if(anchors.$text.length===0 && this.$el.html()===this.$el.text()) {
            anchors.$text = this.$el;
        }

        anchors.$icon = (this.el.tagName==='I') ? this.$el : this.$('i');
        (anchors.$icon.length>0) && (this._icon = new Icon({el: anchors.$icon}));

        if(cfg.value) {
            this.value(cfg.value);
        }

        cfg.text && this.text(cfg.text);
        cfg.icon && this.icon(cfg.icon);
        this.name(cfg.name);

        this.name() || this.name(this.value());

        //if(cfg.calibrate) calibrator.calibrate(anchors.$text, ['font-size', 'font-weight']);

        this.$el.on('click', _.bind(onButtonClick, this));

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
        var $button = this.$el;
        if(value===undefined) return $button.prop('value') || $button.attr('value');
        $button.prop('value', value);
    }

    function text(value) {
        var $text = this._anchors.$text;
        if(!$text) return;

        if(value===undefined) return $text.text();
        $text.text(value);
    }

    function icon(str) {
        var icon = this._icon;
        if(!icon) return;

        return icon.name.apply(icon, arguments);
    }

    function name(text) {
        var $button = this.$el;
        if(text===undefined) return $button.prop('name');
        $button.prop('name', text);
    }

    function onButtonClick(event) {
        event.preventDefault();
        this.click();
    }

    function click() {
        if(!this.value()) return;

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
        /**
         * @override
         */
        tagName: 'button',
        _icon: undefined
    };

    var Button = declare(Base, {
        initialize: initialize,
        render: render,

        click: click,

        value: value,
        text: text,
        icon: icon,
        name: name

    }, props);

    return Button;


});