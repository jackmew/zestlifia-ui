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

define(['backbone', 'underscore',  'jquery', 'uweaver/lang'], function(Backbone, _, $, lang) {
    var declare = lang.declare;
    var Base = Backbone.View;

    /**
     * A class representing an user interface components.
     *
     * The widget use html template to layout & construct the DOM element.
     *
     * ##### Events:
     * + 'render' - [render()]{@link Widget#render}
     * + 'attach' - [attach()]{@link Widget#attach}
     * + 'detach' - [detach()]{@link Widget#detach}
     * + 'destroy' - [destroy()]{@link Widget#destroy}
     *
     * @constructor Widget
     * @extends Backbone.View
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl(String) - A html string to layout & construct the DOM element.
     */
    function initialize(config) {
        var defaults = {
            style: {},
            tpl: undefined
        };

        config || (config = {});

        this._cfg = config;
        this._anchors = {};

        _.defaults(this._cfg, defaults);

        this._oid = _.uniqueId();

        this.prop('id') || (this.prop('id', this._oid))
    }

    /**
     * Render the widget.
     *
     * This method compiles the template to generate the html, then construct the DOM element from html.
     *
     * @memberof Widget#
     * @protected
     * @param {Object} [options] - Rendering options.
     * ##### Options:
     * + hidden(Boolean) - A boolean value to specify the visibility after rendered. Default value is false.
     * @returns {Widget} this.
     *
     */
    function render(options) {
        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        _.each(cfg.style, function(value, key) {
            this.css(key, value);
        }, this);

        if(this.el && this.$el.html().trim().length==0 && cfg.tpl) {
            this.$el.html(_.template(cfg.tpl)(this));
        }


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

    /**
     * Get or set the value of the config.
     *
     * @memberof Widget#
     * @returns {Object} the config.
     */
    function cfg() {
        return this._cfg;
    }

    function oid() {
        return this._oid;
    }

    /**
     * Get or set the value of a style property.
     *
     * @memberof Widget#
     * @param {Object} name - The css property name.
     * @param {Object} [value] - A value to set for the property.
     * @returns {Object} css style.
     */
    function css(name, value) {
        var $node = this.$el;
        return $node.css.apply($node, arguments);
    }

    /**
     * Get or set the value of an attribute.
     *
     * @memberof Widget#
     * @param {String} name - The name of the attribute.
     * @param {Object} [value] - A value to set for the attribute.
     * @returns {*} the value of the attribute.
     */
    function attr(name, value) {
        var $node = this.$el;
        return $node.attr.apply($node, arguments);
    }

    /**
     * Get or set the value of a property.
     *
     * @memberof Widget#
     * @param {String} name - The name of the property.
     * @param {Object} [value] - A value to set for the property.
     * @returns {*} The value of the property.
     */
    function prop(name, value) {
        var $node = this.$el;
        return $node.prop.apply($node, arguments);
    }

    /**
     * Add the specified class(es) to the widget.
     *
     * @memberof Widget#
     * @param {String} classNames - One or more space-separated classes to be added.
     * @returns {Widget} this
     */
    function addClass(classNames) {
        var $node = this.$el;
        $node.addClass.apply($node, arguments);
        return this;
    }

    /**
     * Remove the specified class(es) from the widget.
     *
     * @memberof Widget#
     * @param {String} names - One or more space-separated classes to be removed.
     * @returns {Widget} this
     */
    function removeClass(names) {
        var $node = this.$el;
        $node.removeClass.apply($node, arguments);
        return this;
    }

    /**
     * Determine whether the widget are assigned the given class.
     *
     * @memberof Widget#
     * @param {String} name - The class name to search for.
     * @returns {Boolean}
     */
    function hasClass() {
        var $node = this.$el;
        return $node.hasClass.apply($node, arguments);
    }

    /**
     * Display the widget.
     *
     * @memberof Widget#
     * @param {Object} [options] - A map of additional options to pass to the method.
     * See [jQuery.show(options)](https://api.jquery.com/show/) for details.
     * @returns {Widget} this
     */
    function show(options) {
        var $node = this.$el;
        $node.show.apply($node, arguments);

        this.trigger('show', {
            data: {},
            context: this,
            source: this
        });

        return this;
    }

    /**
     * Hide the widget.
     *
     * @memberof Widget#
     * @param {Object} [options] - A map of additional options to pass to the method.
     * See [jQuery.hide(options)](https://api.jquery.com/hide/) for details.
     * @returns {Widget} this
     */
    function hide() {
        var $node = this.$el;
        $node.hide.apply($node, arguments);

        this.trigger('hide', {
            data: {},
            context: this,
            source: this
        });

        return this;
    }

    /**
     * Display or hide the widget.
     *
     * @memberof Widget#
     * @param {Object} [options] - A map of additional options to pass to the method.
     * See [jQuery.toggle(options)](https://api.jquery.com/toggle/) for details.
     * @returns {Widget} this
     */
    function toggle() {
        var $node = this.$el;
        $node.toggle.apply($node, arguments);
        return this;
    }

    function isVisible() {
        var $node = this.$el;
        return $node.is(":visible");
    }

    function isRendered() {
        return this._isRendered;
    }
    /**
     * Attach the widget to the DOM element.
     *
     * ##### Events:
     * + 'attach' - triggered after attach.
     *
     * @memberof Widget#
     * @param {Element} element - specify the DOM element to which this widget is attached.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * #####Options
     * + {Boolean} prepend - Attach the widget to the begin of the element. Default: false.
     * @returns {Widget}
     */
    function attach(element, options) {
        options || (options = {});

        if(options.prepend) {
            this.$el.prependTo($(element));
        } else {
            this.$el.appendTo($(element));
        }
        this.trigger('attach', {
            data: {},
            context: this,
            source: this
        });

        return this;
    }

    /**
     * Detach the widget from the DOM.
     *
     * ##### Events:
     * + 'detached' - triggered after detach.
     *
     * The method removes the widget from the DOM but keeps all data associated with the removed widget.
     * This method is useful when removed widget is to be reinserted into the DOM at a later time.
     *
     * @memberof Widget#
     * @return void
     */
    function detach() {
        this.$el.detach();
        this.trigger('detach', {
            data: {},
            context: this,
            source: this
        });
    }

    /**
     * Destroy the widget from the DOM.
     *
     * This method removes the widget from the DOM & destroy the widget.
     * This method also remove the event handlers registered using .listenTo().
     *
     * ##### Events:
     * + 'destroy' - triggered before destroy.
     *
     * @memberof Widget#
     * @return void
     */
    function destroy() {
        this.trigger('destroy', {
            data: {},
            context: this,
            source: this
        });
        this.undelegateEvents();
        this.stopListening();
        this.remove();
    }

    /**
     * A helper method to find the specified DOM element within the widget.
     *
     * This method uses the data-uw-anchor attribute to locate the DOM element.
     *
     * @memberof Widget#
     * @param {String} name - The name of the anchor to search for.
     * @returns {Element}
     */
    function anchor(name) {
        return this.$("[data-uw-anchor=" + name + "]").first();
    }

    /**
     * A helper method to find the specified jQuery object within the widget.
     *
     * This method uses the data-uw-anchor attribute to locate the jQuery object.
     *
     * @memberof Widget#
     * @param {String} name - The name of the anchor to search for.
     * @returns {jQuery}
     */
    function $anchor(name) {
        return this.$("[data-uw-anchor=" + name + "]");
    }

    /**
     * A helper method to find the dom elements matched the selector.
     *
     * @memberof Widget#
     * @param {String} selector - css selector.
     * @returns {NodeList}
     */
    function query(selector) {
        return this.el.querySelectorAll(selector);
    }


    function width(value) {
        if(!value) return this.$el.outerWidth();

        this.$el.outerWidth(value);
    }


    function height(value) {
        if(!value) return this.$el.outerHeight();

        this.$el.outerHeight(value);
    }

    function left(value) {
        if(!value) return this.$el.position().left;

        this.$el.css({left: value});
    }

    function top(value) {
        if(!value) return this.$el.position().top;

        this.$el.css({top: value});
    }

    function moveTo(position) {
        if(position.right!==undefined) {
            position.left = 'auto';
        }
        this.css({top: position.top, left:position.left, right: position.right, position:'fixed'});

    }

    function toJSON() {
        return {
            class: this._class,
            oid: this._oid,
            tagName: this.tagName,
            className: this.className,
            html: this.$el.html()
        }
    }

    function disable() {
        this._availability = false;
    }

    function enable() {
        this._availability = true;
    }

    function isAvailable() {
        return this._availability;
    }

    var props = {
        /**
         * The initial configuration of the widget.
         *
         * @memberof Widget#
         * @protected
         * @type Object
         */
        _cfg: null,
        _class: 'Widget',
        _anchors: null,
        _oid: null,
        _availability: false,

        /**
         * The html tag name of the widget.
         *
         * @memberof Widget#
         * @protected
         * @type String
         * @default "div"
         */
        tagName: 'div'
    };

    var Widget = declare(Base, {
        initialize: initialize,
        cfg: cfg,
        oid: oid,
        css: css,
        prop: prop,
        attr: attr,
        height: height,
        width: width,
        moveTo: moveTo,
        toJSON: toJSON,


        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        show: show,
        hide: hide,
        enable: enable,
        disable: disable,
        toggle: toggle,
        isVisible: isVisible,
        isAvailable: isAvailable,
        attach: attach,
        detach: detach,
        destroy: destroy,
        anchor: anchor,
        $anchor: $anchor,
        query: query,
        render: render,
        isRendered: isRendered
    }, props);

    return Widget;

});