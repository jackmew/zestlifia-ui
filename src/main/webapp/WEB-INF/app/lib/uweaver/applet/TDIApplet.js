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
    'uweaver/widget/Widget', 'uweaver/widget/TabPanel', 'uweaver/applet/Gadget',
    'uweaver/Logger',
    'uweaver/exception/UnsupportedTypeException'], function (_, $, lang, Widget, TabPanel, Gadget, Logger,  UnsupportedTypeException) {

    var declare = lang.declare;
    var Base = Widget;
    var LOGGER = new Logger("uweaver/applet/TDIApplet");

    /**
     * An applet is an application for one specific activity.
     *
     * ##### Usage
     *     var applet = new TDIApplet({
     *         el: $('#applet')
     *     });
     *     applet.render();
     *
     *     var messages = new Gadget({
     *         tpl: "<h3>Messages</h3><p>Here are messages for you ...</p>"
     *         title: "Messages",
     *         badge: "3"
     *     }).render();
     *
     *     applet.add(messages);
     *
     * ##### Events:
     * + 'select' - [select()]{@link TDIApplet#select}, [add()]{@link TDIApplet#add}, [remove()]{@link TDIApplet#remove}
     * + 'add' - [add()]{@link TDIApplet#add}
     * + 'remove' - [remove()]{@link TDIApplet#remove}
     * + 'transition:menu' - [menu()]{@link TDIApplet#menu}, [title()]{@link TDIApplet#title}
     *
     * @constructor TDIApplet
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the applet.
     * ##### Options
     * - tpl(String): A html string to layout & construct the DOM. Optional.
     * - title(String): The title of the applet.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._title = cfg.title;
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

        var tabPanel = new TabPanel().render();

        tabPanel.attach(this.$el);
        this.listenTo(tabPanel, 'all', _.bind(onTabPanelActions, this));

        this._tabPanel = tabPanel;

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        return this;
    }

    function onTabPanelActions(type, e) {
        var interested = ["add", "select", "remove"];

        if(!_.contains(interested, type)) return;

        var event = {
            context: this,
            source: e.context,
            data: e.data
        };

        this.trigger(type, event);
    }

    function isSingleton() {
        return this._singleton;
    }

    function start() {
        this.render();

        var event = {
            data: {},
            context: this,
            source: this
        };
        this.trigger('started', event);
    }

    function stop() {
        var event = {
            data: {},
            context: this,
            source: this
        };
        this.trigger('stop', event);
        this.destroy();
    }

    function pid() {
        return this.oid();
    }

    /**
     * Get or set the title of the applet.
     *
     * ##### Events:
     * - 'transition:title' => triggered after title changed.
     *
     * @memberof TDIApplet#
     * @param {Object} [text] - the title.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {String}
     */
    function title(text, options) {
        if(!text) return this._title;

        this._title = text;

        options || (options = {});

        options.silent || this.trigger('transition', {
            context: this,
            source: this,
            data: undefined
        });
    }

    /**
     *
     * Get or set the menu.
     *
     * ##### Events:
     * - 'transition:menu' => triggered after menu changed. event.data => the menu.
     *
     * @memberof TDIApplet#
     * @param {Triggers} triggers - the menu.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Triggers}
     *
     */
    function menu(triggers, options) {
        if(!triggers) return this._menu;

        options || (options = {});

        this._menu = triggers;
        options.silent || this.trigger('transition:menu', {
            context: this,
            source: this,
            data: this._menu
        });
    }

    /**
     * Add the gadget to the applet.

     * ##### Events:
     * + 'add' - triggered after added. event.data => the added gadget.
     * + 'select' - triggered after selected. event.data => the selected gadget.
     *
     * @memberof TDIApplet#
     * @param {Gadget} gadget - The gadget to add.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + title(String) - A text to specify the caption displayed in the tab. default: gadget.title().
     * + badge(String) - A text to specify the symbol displayed in the tab. default: gadget.badge().
     * + closable(Boolean) - A true value to display a close button in the tab. default: false.
     * + selected(Boolean) - A false value to prevent the new tabpane from being selected. default: true.
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * + index(Integer) - index at which the specified component is to be inserted. Default: null.
     * @returns {TDIApplet} this
     */
    function add(gadget, options) {
        if(!(gadget instanceof Gadget)) {
            throw new UnsupportedTypeException({
                supportedTypes: ['Gadget'],
                type: typeof gadget
            });
        }

        options || (options = {});

        var defaults = {
            closable: false,
            selected: true,
            title: gadget.title(),
            badge: gadget.badge()
        };

        _.defaults(options, defaults);

        this._tabPanel.add(gadget, options);

        this.listenTo(gadget, 'transition', _.bind(onGadgeTransition, this));

        return this;
    }

    /**
     * @todo update the tab's content(title & badge)
     * @param event
     */
    function onGadgeTransition(event) {
        var gadget = event.context;
    }

    /**
     * Remove the gadget from the applet.
     *
     * ##### Events:
     * + 'remove' - triggered after removed. event.data => the removed gadget.
     * + 'select' - triggered after selected. event.data => the selected gadget.
     *
     * @memberof TDIApplet#
     * @param {Gadget} gadget - The gadget to remove.
     * @returns {TDIApplet} this
     */
    function remove(gadget, options) {
        options || (options = {});
        this._tabPanel.remove(gadget, options);
        this.stopListening(gadget);
        return this;
    }

    /**
     * Select the gadget to show.
     *
     * ##### Events:
     * + 'select' - triggered after selected. event.data => the selected gadget.
     *
     * @memberof TDIApplet#
     * @param {Gadget|Integer} gadget - The gadget(or index of the gadget) to show.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {TDIApplet} this
     */
    function select(gadget, options) {
        this._tabPanel.select(gadget, options);
        return this;
    }

    /**
     * Get the gadget.
     *
     * @memberof TDIApplet#
     * @param {Integer} index - The index of gadget. zero-based.
     * @returns {Gadget}
     */
    function get(index) {
        return this._tabPanel.get(index);
    }

    /**
     * Get the active gadget.
     *
     * @memberof TDIApplet#
     * @returns {Gadget}
     */
    function current() {
        return this._tabPanel.current();
    }

    /**
     * Get the # of gadgets.
     *
     * @memberof TDIApplet#
     * @returns {Integer}
     */
    function size() {
        return this._tabPanel.size();
    }

    /**
     *
     * @param gadget
     *
     * @todo trigger a event when a gadget bring to front (focus).
     */
    function bringToFront(gadget) {
        if(this._activeGadget) this.listenTo(this._activeGadget, 'focus', _.bind(onGadgetFocus, this));
        this.stopListening(gadget, 'focus');
        this._activeGadget = gadget;
        if(gadget.css('z-index')==this._maxZIndex) return;
        gadget.css('z-index', ++this._maxZIndex);
    }

    function onGadgetFocus(event) {
        var gadget = event.context;

        this.bringToFront(gadget);
    }

    var props = {
        _singleton: false,
        _menu: undefined,
        _title: undefined,
        _tabPanel: undefined,
        _maxZIndex: 0,
        _gadgets: undefined,
        _activeGadget: undefined,
        className: "container-fluid"
    };

    var TDIApplet = declare(Base, {
        initialize: initialize,
        render: render,
        menu: menu,
        isSingleton: isSingleton,
        start: start,
        stop: stop,
        pid: pid,
        title: title,
        add: add,
        remove: remove,
        select: select,
        get: get,
        current: current,
        size: size,
        bringToFront: bringToFront
    }, props);

    return TDIApplet;
});