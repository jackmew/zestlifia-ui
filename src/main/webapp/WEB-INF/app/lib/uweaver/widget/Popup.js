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


define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Widget',
    'uweaver/widget/Container'], function (_, $, lang, Widget, Container) {

    var declare = lang.declare;

    var Base = Container;

    /**
     * **Popup**
     * This class represents a popup window.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Popup
     * @extends Container
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the popup.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            dismissable: true,
            modal: false
        };

        var anchors = this._anchors;

        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        cfg.modal && (cfg.dismissable = false);

        this.css('z-index', 9999);

        anchors.$content = this.$el;

        this.css('overflow', 'auto');

        if(cfg.dismissable) {
            $(document).on('click', _.bind(onDocumentClick, this));
        }

        this.$el.on('click', _.bind(onPopupClick, this));

        if(cfg.modal) {
            this._backpanel = $("<div class='uw-background-gray' style='position:fixed;opacity:0.7'></div>");
            this._backpanel.width($(window).width()); this._backpanel.height($(window).height());
            this._backpanel.css({left:0, top:0});
            this._backpanel.on('click', function(event){event.stopPropagation();});
            $('body').append(this._backpanel);
            this._backpanel.hide();
        }
    }

    function onPopupClick() {
        this._skipDocumentClick = true;
    }

    function onDocumentClick() {
        if(!this.isVisible()) return;
        (this._skipDocumentClick) ? (this._skipDocumentClick = false) : this.hide();
    }

    /**
     * @override
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: true
        };

        var anchors = this._anchors;
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        cfg.el || this.attach($('body'));

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

    function show(options) {
        if(_.isEmpty(this.$el.html())) return;

        var cfg = this._cfg;

        if(cfg.modal) {
            this._backpanel.show();
        }

        options || (options = {});
        var position;

        if(options.position) {
            position = options.position;
        } else if(options.positionTo) {
            position = translatePosition.call(this, options.positionTo);
        } else if(!this._positioned) {
            position = {
                left: ($(window).outerWidth() - this.width()) * 0.5,
                top: ($(window).outerHeight() - this.height()) * 0.5
            }
        }

        position && this.moveTo(position) && (this._positioned = true);

        this._skipDocumentClick = true;

        Base.prototype.show.apply(this, arguments);
    }

    function hide() {
        var cfg = this._cfg;

        if(cfg.modal) {
            this._backpanel.hide();
        }

        Base.prototype.hide.apply(this, arguments);
    }

    function translatePosition(component) {
        var position;
        var $node;

        if(component instanceof jQuery) {
            $node = component;
        } else if(component instanceof Widget) {
            $node = component.$el;
        } else {
            $node = $(component);
        }

        position = {
            left: $node.offset().left + ($node.outerWidth() - this.width()) * 0.5,
            top: $node.offset().top + $node.outerHeight()
        };
        position = {left: Math.max(position.left, 0), top: Math.max(position.top, 0)};
        position.left = Math.min(position.left, $(window).outerWidth()-this.width() - 10);

        return position;
    }

    function toggle(options) {
        this.isVisible() ? this.hide() : this.show(options);
    }

    var props = {
        _skipDocumentClick: false,
        _positioned: false,
        _backpanel: undefined
    };

    var Popup = declare(Base, {
        initialize: initialize,
        render: render,
        show: show,
        hide: hide,
        toggle: toggle
    }, props);

    return Popup;
});