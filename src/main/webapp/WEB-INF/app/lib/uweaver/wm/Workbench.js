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
    'uweaver/widget/Widget', 'uweaver/widget/Popup', 'uweaver/widget/Triggers',
    'uweaver/widget/Toolbox', 'uweaver/wm/TaskManager', 'uweaver/widget/Icon',
    'uweaver/Deferred',
    'text!./tpl/Workbench.html',
    'uweaver/Logger'], function(_, $, lang, theme, Widget, Popup, Triggers, Toolbox, TaskManager, Icon, Deferred, tpl, Logger) {

    var declare = lang.declare;
    var Base = Widget;
    var LOGGER = new Logger("uweaver/wm/Workbench");

    /**
     * A workbench is a window manager designed to provide a desktop-like environment.
     *
     * #### Configs ####
     * - tpl(String): A html string to layout & construct the DOM.
     * - site(String): The site id.
     *
     * @constructor Workbench
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the workbench.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
        this._anchors = {
            $titlebar: undefined,
            $workspace: undefined,
            $menu: undefined
        };

        cfg.tpl = tpl;

        this._sites = cfg.sites;
        this._user = cfg.user;
        this._activities = cfg.activities;
    }

    /**
     * @override
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var cfg = this._cfg;

        this.hide();

        var anchors = this._anchors;
        var sites = this._sites;
        var activities = this._activities;

        anchors.$titlebar = this.$anchor("titlebar");
        anchors.$workspace = this.$anchor("workspace");
        anchors.$menu = this.$anchor("menu");

        anchors.$workspace.addClass(theme.background());
        anchors.$titlebar.addClass(theme.fill());

        sites.fetch({async:false});
        activities.fetch({async:false});

        renderTitlebar.call(this);
        renderLaunchpad.call(this);
        renderTaskManager.call(this);

        this._logo = new Icon({name: "twitter"}).render();
        anchors.$menu.append(this._logo.$el);

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

        this.login();

        return this;
    }

    /**
     * @todo disable the workbench & launch the logon applet to authenticate and get the user info.
     */
    function login() {
        var user = this._user;
        var sites = this._sites;
        var site = this._site;
        user.set({_id: "S100618"}).fetch({async: false});
        site = sites.first();

        this.username(user.get('display'));

        this.title(site.get('title'));
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

    function home() {
        var cfg = this._cfg;

        if(cfg.home) this.startApplet(cfg.home);
    }

    function title(html) {
        this.$anchor('title').html(html);
    }
    function caption(html) {
        this.$anchor('caption').html(html);
    }
    function username(html) {
        this.$anchor('username').html(html);
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
        var activities = this._activities;
        var anchors = this._anchors;

        var launchpadPopup = new Popup();

        launchpadPopup.render();
        this._launchpadPopup = launchpadPopup;

        var launchpad = new Toolbox({
            data: activities
        });

        launchpad.width("252px");

        launchpad.render();
        launchpad.on('select', _.bind(onLaunchpadSelect, this));

        launchpadPopup.content(launchpad);

        this._launchpad = launchpad;
    }

    function toggleLaunchpad() {
        var anchors = this._anchors;
        this._launchpadPopup.toggle({
            position: {
                right: 0,
                top: anchors.$titlebar.outerHeight()
            }
        });
        // first time show up
        this._launchpad.height(anchors.$workspace.outerHeight());
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case Workbench.COMMAND.HOME:
                this.home();
                break;
            case Workbench.COMMAND.LAUNCHPAD:
                toggleLaunchpad.call(this);
                break;
            case Workbench.COMMAND.TASKMANAGER:
                toggleTaskManager.call(this);
                break;
            case Workbench.COMMAND.MENU:
                toggleMenu.call(this);
                break;
            default:
                break;
        }
    }

    function onLaunchpadSelect(event) {
        var activity = event.data;
        var module = activity.get('id');
        this.startApplet(module);
        this._launchpadPopup.hide();
    }

    function startApplet(module) {
        var taskManager = this._taskManager;

        taskManager.start("applet/" + module).then(function(applet) {
            this.showApplet(applet);
            this.listenTo(applet, 'forward', _.bind(onForward, this));
            this.listenTo(applet, 'transition', _.bind(onAppletTransition, this));
        }, this);
    }

    function stopApplet(applet) {
        var taskManager = this._taskManager;

        this._activeApplet = null;
        this.stopListening(applet);
        taskManager.stop(applet);
    }

    function showApplet(applet) {
        this.caption(applet.title());
        attachMenu.call(this, applet.menu());
        if(this._activeApplet) {
            this._activeApplet.detach();
        }
        applet.attach(this._anchors.$workspace);
        applet.height('100%');
        this.resize();
        this._activeApplet = applet;
    }

    function onAppletTransition(event) {
        var applet = event.context;
        if(applet!==this._activeApplet) {
            return;
        }

        this.caption(applet.title());
        attachMenu.call(this, applet.menu());
    }

    function attachMenu(menu) {
        var anchors = this._anchors;
        var $menu = anchors.$menu;

        $menu.contents().detach();

        if(menu) {
            menu.css("display", "inline-block");
            $menu.append(menu.$el);
        } else {
            $menu.append(this._logo.$el);
        }
    }

    function onForward(event) {
    }


    function renderTaskManager() {
        var anchors = this._anchors;
        var taskManagerPopup = new Popup();

        taskManagerPopup.render();
        this._taskManagerPopup = taskManagerPopup;

        var taskManager = new TaskManager();

        taskManager.render();
        taskManager.on('select', _.bind(onTaskManagerSelect, this));

        taskManagerPopup.content(taskManager);

        this._taskManager = taskManager;
    }


    function onTaskManagerSelect(event) {
        var applet = event.data.task;
        this.showApplet(applet);
        this._taskManagerPopup.hide();
    }

    function toggleTaskManager() {
        var titlebar = this._titlebar;
        var taskManagerPopup = this._taskManagerPopup;
        var taskManagerSwitch = titlebar.get(Workbench.COMMAND.TASKMANAGER);

        taskManagerPopup.toggle({
            positionTo: taskManagerSwitch.$el
        });
    }

    function showMessenger() {
        var titlebar = this._titlebar;
        var messengerPopup = this._messengerPopup;
        var messengerSwitch = titlebar.get(Workbench.COMMAND.MESSENGER);

        messengerPopup.show({
            positionTo: messengerSwitch.$el
        });
    }

    function hideMessenger() {
        var messengerPopup = this._messengerPopup;

        messengerPopup.hide();
    }

    function toggleMenu() {
        var activeApplet = this._activeApplet;
        var titlebar = this._titlebar;
        var menuSwitch = titlebar.get(Workbench.COMMAND.MENU);

        activeApplet.toggleMenu({
            positionTo: menuSwitch.$el
        });
    }

    function hideMenu() {
        var activeApplet = this._activeApplet;
        activeApplet.hideMenu();
    }



    function renderMessenger(context) {
        var anchors = this._anchors;
        var messengerPopup = new Popup();

        messengerPopup.render();
        this._messengerPopup = messengerPopup;

        var messenger = new Messenger();

        messenger.render();

        messengerPopup.content(messenger);

        this._messenger = messenger;
    }

    var props = {
        _sites: undefined,
        _activities: undefined,
        _user: undefined,
        _logo: undefined,
        _site: undefined,

        _titlebar: undefined,
        _launchpad: undefined,
        _launchpadPopup: undefined,
        _taskManager: undefined,
        _taskManagerPopup: undefined,
        _activeTask: undefined
    };

    var Workbench = declare(Base, {
        initialize: initialize,
        render: render,
        title: title,
        caption: caption,
        username: username,

        resize: resize,
        home: home,
        login: login,

        startApplet: startApplet,
        stopApplet: stopApplet,
        showApplet: showApplet
    }, props);

    // Enumeration of build in commands
    Workbench.COMMAND = {
        HOME: 'HOME',
        LAUNCHPAD: 'LAUNCHPAD',
        MESSENGER: 'MESSENGER',
        TASKMANAGER: 'TASKMANAGER',
        MENU: 'MENU'
    };

    return Workbench;
});