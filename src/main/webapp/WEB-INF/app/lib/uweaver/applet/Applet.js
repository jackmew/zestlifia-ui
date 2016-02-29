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
    'uweaver/widget/Widget', 'uweaver/applet/Gadget',
    'uweaver/widget/Menu'], function (_, $, lang, Widget, Gadget, Menu) {

    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Applet**
     * An applet is an application for one specific activity.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     * - title(String): The title of the applet.
     *
     * @constructor Applet
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the applet.
     */

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._title = cfg.title;
        this._gadgets = {};
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
        this.trigger('applet:started', event);
    }

    function stop() {
        var event = {
            data: {},
            context: this,
            source: this
        };
        this.trigger('applet:stop', event);
        this.destroy();
    }

    function pid() {
        return this.oid();
    }

    function title(text) {
        if(!text) return this._title;

        this._title = text;
    }


    function menu() {
        return this._menu;
    }

    function add(gadget, name) {
        (name !== undefined) || (name = gadget.oid());

        if(gadget.css('position')==='static' || gadget.css('position')==='') {
            gadget.css('position', 'fixed');
        }
        this._maxZIndex = Math.max(this._maxZIndex, gadget.css('z-index')) + 1;
        this.listenTo(gadget, 'focus', _.bind(onGadgetFocus, this));
        this.append(gadget);
        this._gadgets[name] = gadget;
        _.defer(_.bind(bringToFront, this), gadget);
    }

    function remove(name) {
        var gadget = this._gadgets[name];

        this._gadgets[name] = undefined;
        this.stopListening(gadget);
        gadget.destroy();
    }

    function get(name) {
        return this._gadgets[name];
    }

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
        _maxZIndex: 0,
        _gadgets: undefined,
        _activeGadget: undefined
    };

    var Applet = declare(Base, {
        initialize: initialize,
        isSingleton: isSingleton,
        start: start,
        stop: stop,
        pid: pid,
        menu: menu,
        title: title,
        add: add,
        remove: remove,
        get: get,
        bringToFront: bringToFront
    }, props);

    return Applet;
});