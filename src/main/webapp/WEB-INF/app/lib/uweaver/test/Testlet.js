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

define(['underscore', 'jquery', 'uweaver/lang', 'mocha',
    'uweaver/widget/Widget', 'uweaver/widget/Panel',
    'text!./tpl/Console.html', 'css!uweaver/_base/mocha/mocha'], function (_, $, lang, Mocha, Widget, Panel, tplConsole) {

    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Testlet**
     * An testlet is a for one specific test activity, usually one test suite.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     * - title(String): The title of the testlet.
     *
     * @constructor Testlet
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the testlet.
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
        var anchors = this._anchors;

        options || (options = {});

        _.defaults(options, defaults);

        var console = new Panel({
            tpl: tplConsole
        });
        console.render();
        console.width(750);
        console.draggable({
            restrict: {
                restriction: this.$el
            }
        });
        console.moveTo({left: 200, top: 200});
        console.resizable();

        console.attach(this.$el);

        this._console = console;

        this.clear();

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

    function title(text) {
        if(!text) return this._title;

        this._title = text;
    }

    function run() {}

    function test() {
        mocha.run();
    }

    function clear() {
        $('#mocha').html("");
        mocha.suite.suites=[];
    }

    var props = {
        _title: undefined,
        _console: undefined
    };

    var Testlet = declare(Base, {
        initialize: initialize,
        render: render,
        run: run,
        test: test,
        clear: clear,
        title: title
    }, props);

    return Testlet;
});