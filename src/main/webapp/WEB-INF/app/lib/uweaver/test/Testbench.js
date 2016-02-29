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
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/theme',
    'uweaver/widget/Widget', 'uweaver/widget/Popup', 'uweaver/widget/Triggers', 'uweaver/widget/Toolbox',
    'uweaver/Deferred',
    'text!./tpl/Testbench.html',
    'uweaver/Logger'], function(_, $, lang, theme, Widget, Popup, Triggers, Toolbox, Deferred, tpl, Logger) {
    var declare = lang.declare;

    var Base = Widget;

    /**
     * A testbench is a window manager designed to provide a unit test environment.
     *
     * #### Configs ####
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Testbench
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the testbench.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
        this._anchors = {
            $titlebar: undefined,
            $workspace: undefined
        };

        cfg.tpl = tpl;

        this._tests = cfg.tests;

    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var cfg = this._cfg;

        this.hide();

        var anchors = this._anchors;

        anchors.$titlebar = this.$anchor("titlebar");
        anchors.$workspace = this.$anchor("workspace");

        anchors.$titlebar.addClass(theme.fill());

        renderTitlebar.call(this);
        renderLaunchpad.call(this);

        this.once('attach', _.bind(onAttached, this));

        this.attach($('body'));

        this.show();

        this.resize();

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('render', {
                data: {},
                context: this,
                source: this
            });
        }

        return this;
    }

    function onAttached() {
        var fn = _.bind(this.resize, this);
        $(window).resize(fn);
        this.home();
    }

    function resize() {
        var anchors = this._anchors;
        var workspaceHeight = $(window).height() - anchors.$titlebar.outerHeight();
        anchors.$workspace.outerHeight(workspaceHeight);
        this._launchpad.height(anchors.$workspace.outerHeight());
    }

    function runTest(test) {
        var context = this;

        var module = test.get('id');
        require(['testlet/' + module], function(Testlet) {
            var testlet;

            try {
                testlet = new Testlet();
            } catch(err) {
                context.logger.error(Logger.ERROR, err.message);
                return;
            }

            testlet.render();

            if(context._activeTestlet) {
                context._activeTestlet.destroy();
                context._activeTestlet = undefined;
            }

            testlet.attach(context._anchors.$workspace);
            testlet.height('100%');
            context.title(test.get("name"));
            context._activeTestlet = testlet;
            testlet.run();
            context.resize();
        });

    }

    function home() {
        var cfg = this._cfg;

        if(cfg.home) this.runTest(cfg.home);
    }

    function title(html) {
        this.$anchor('title').html(html);
    }

    function renderTitlebar() {
        var anchors = this._anchors;
        var titlebar = new Triggers({
            el: anchors.$titlebar,
            selector: "[data-uw-anchor=button]"
        });
        titlebar.render();
        this.listenTo(titlebar, 'trigger', _.bind(onCommandTrigger, this));

        this._titlebar = titlebar;
    }

    function renderLaunchpad() {
        var tests = this._tests;
        var anchors = this._anchors;

        var launchpadPopup = new Popup();

        launchpadPopup.render();
        this._launchpadPopup = launchpadPopup;

        var launchpad = new Toolbox({
            data: tests
        });

        launchpad.width("252px");

        launchpad.render();
        launchpad.on('select', _.bind(onLaunchpadSelect, this));

        launchpadPopup.content(launchpad);

        this._launchpad = launchpad;
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case Testbench.COMMAND.HOME:
                this.home();
                break;
            case Testbench.COMMAND.LAUNCHPAD:
                this._launchpadPopup.toggle({
                    position: {
                        right: 0,
                        top: anchors.$titlebar.outerHeight()
                    }
                });

                this._launchpad.height(anchors.$workspace.outerHeight());
                break;
            case Testbench.COMMAND.MENU:
                this.showMenu();
                break;
            default:
                break;
        }
    }

    function onLaunchpadSelect(event) {
        var item = event.data;
        this.runTest(item);
        this._launchpadPopup.hide();
    }

    var props = {
        LOGGER: new Logger("Testbench"),

        _tests: undefined,

        _titlebar: undefined,
        _launchpad: undefined,
        _launchpadPopup: undefined,
        _activeTestlet: undefined
    };


    var Testbench = declare(Base, {
        initialize: initialize,
        render: render,
        title: title,

        runTest: runTest,
        resize: resize,
        home: home
    }, props);

    // Enumeration of build in commands
    Testbench.COMMAND = {
        HOME: 'HOME',
        LAUNCHPAD: 'LAUNCHPAD',
        MENU: 'MENU'
    };

    return Testbench;
});