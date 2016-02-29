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
    'uweaver/widget/Container', 'uweaver/string', 'uweaver/widget/Widget',
    'text!./tpl/TabPanel.html',
    'uweaver/exception/UnsupportedTypeException',
    'uweaver/Logger'], function(_, $, lang, Container, string, Widget, tpl, UnsupportedTypeException, Logger) {

    var declare = lang.declare;
    var Base = Container;
    var LOGGER = new Logger("uweaver/widget/TabPanel");

    /**
     * A TabPanel is a tabbed container.
     *
     * ##### Usage
     *     var panel = new TabPanel({
     *         el: $('#panel')
     *     });
     *     panel.render();
     *
     *     var $node = $('<h3>Messages</h3><p>Here are messages for you ...</p>');
     *     panel.add($node, {
     *         title: "Messages"
     *     });
     *
     *     var widget = new Widget({
     *         tpl: '<h3>Preferences</h3><p>Here are your personal preferences ...</p>'
     *     }).render();
     *
     *     panel.add(widget, {
     *         title: "Preferences"
     *     });
     *
     *
     * ##### Template
     *      <!-- Tabs dom -->
     *      <!-- the following dom are required.
     *      * ul.nav - contains all the tabs.
     *      * ul.nav > li - a tab.
     *      * ul.nav > li.active - the active tab.
     *      * ul.nav > li > a[data-toggle="tab"] - the link to trigger the transition. href reference the name or id of the tab pane. Name is recommended.
     *      -->
     *      <ul class="nav nav-tabs" role="tablist">
     *          <li class="active"><a href="#home" data-toggle="tab">Home</a></li>
     *          <li><a href="#profile"  data-toggle="tab">Profile</a></li>
     *      </ul>
     *     <!-- Tab Panes dom -->
     *     <!-- the following dom are required.
     *     * div.tab-content - contains all the tab panes.
     *     * div.tab-content > div.tab-pane - a tab pane. The name or id attribute is required.
     *     * div.tab-content > div.tab-pane.active - the active tab pane.
     *     -->
     *     <div class="tab-content">
     *         <div class="tab-pane active" name="home">
     *             <h3>Home</h3>
     *             <p>This is your home page.</p>
     *         </div>
     *         <div class="tab-pane" name="profile">
     *              <h3>Profile</h3>
     *              <p>Your profile info goes here ...</p>
     *         </div>
     *      </div>
     *
     * ##### Events:
     * + 'select' - [select()]{@link TabPanel#select}, [add()]{@link TabPanel#add}, [remove()]{@link TabPanel#remove}
     * + 'add' - [add()]{@link TabPanel#add}
     * + 'remove' - [remove()]{@link TabPanel#remove}
     *
     * @constructor TabPanel
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl(String) - A html string to layout & construct the DOM element. Optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $navbar: undefined,
            $content: undefined
        };

        this._components = [];
        this._indexes = {};

        cfg.tpl || (cfg.tpl = tpl);
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

        anchors.$navbar = this.$('ul.nav').first();
        anchors.$content = this.$('div.tab-content').first();

        // assumption: there should be the same # of tabs & tabpane.
        // 1. generate id for those tabpanes without id.
        // 2. rewrite the href for those tabs link to the name.
        var $tabpanes = anchors.$content.find('> .tab-pane');
        _.each($tabpanes, function(tabpane){
            var $tabpane = $(tabpane);
            if(!$tabpane.prop('id') && $tabpane.attr('name')) {
                $tabpane.prop('id', _.uniqueId());
                var href = '#' + $tabpane.prop('id');
                var links = anchors.$navbar.find("> li >a[href='#" + $tabpane.attr('name') + "']");
                $(links).attr('href', href);
            }
        }, this);

        var components = this._components;
        var indexes = this._indexes;
        var $links = anchors.$navbar.find('> li > a');
        _.each($links, function(link) {
            var $link = $(link);
            var id = $link.attr('href').substring(1);
            var tabpane = this.$('#' + id)[0];

            var component = (tabpane) ? tabpane.childNodes : undefined;
            components.push(component);
            indexes[id] = component;
        }, this);

        $links.on('click', _.bind(onTabClick, this));

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('render', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this._components.length===0 || this.show();
        }

        return this;
    }

    function onTabClick(e) {
        e.preventDefault();
        var id = $(e.currentTarget).attr('href').substring(1);
        var component = this._indexes[id];

        this.select(component);

    }

    /**
     * Add the component to the TabPanel.
     *
     * ##### Events:
     * + 'add' - triggered after added. event.data => the added component.
     * + 'select' - triggered after selected. event.data => the selected component.
     * + 'remove' - triggered after removed. event.data => the removed component.
     *
     * @memberof TabPanel#
     * @param {Widget|jQuery|NodeList} component - The component to add.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + title(String) - A text to specify the caption displayed in the tab. required.
     * + badge(String|Number) - A text(or number) to specify the symbol displayed in the tab. optional.
     * + closable(Boolean) - A true value to display a close button in the tab. Default: false.
     * + selected(Boolean) - A false value to prevent the new tabpane from being selected. Default: true.
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * + index(Integer) - index at which the specified component is to be inserted. Default: null.
     * @returns {TabPanel} this
     */
    function add(component, options) {
        if(component===undefined) return this;

        options || (options = {});

        var defaults = {
            closable: false,
            selected: true
        };

        _.defaults(options, defaults);

        var anchors = this._anchors;

        var tab = "<li><a href='#${id}' data-toggle='tab'>${title}<span class='badge' style='margin-left:3px;'>${badge}</span>${close}</a></li>";
        var tabpane = "<div  class='tab-pane' id='${id}'></div>";
        var close = (options.closable) ? "<i class='fa fa-close' style='position:relative;top: -10px;left: 10px;'></i>" : "";

        var args = {
            id: _.uniqueId(),
            title: options.title,
            badge: (options.badge) || "",
            close: close
        };

        var $tab = $(string.substitute(tab, args));
        var $tabpane = $(string.substitute(tabpane, args));

        if(component instanceof Widget) {
            component.attach($tabpane);
        } else if(component instanceof jQuery) {
            $tabpane.append(component);
        } else if(component instanceof NodeList) {
            $tabpane.append($(component));
        } else {
            throw new UnsupportedTypeException({
                supportedTypes: ['Widget', 'jQuery', 'NodeList'],
                type: typeof component
            });
        }

        if(options.index!==undefined && this.size()>=0) {
            var index = options.index;
            var $tabs = anchors.$navbar.find('>li');
            $tab.insertBefore($tabs.eq(index));
            this._components.splice(index, 0, component);
        } else {
            anchors.$navbar.append($tab);
            this._components.push(component);
        }

        anchors.$content.append($tabpane);

        $tab.find('> a').on('click', _.bind(onTabClick, this));

        $tab.find('> a > i').on('click', _.bind(onCloseClick, this));

        this._indexes[$tabpane.prop('id')] = component;

        if(options.selected || this.size()===1) {
            this.select(component, options);
        }

        options.silent || this.trigger('add', {
            data: {},
            context: this,
            source: this
        });

        this.isVisible() || this.show();

        return this;
    }

    function onCloseClick(event) {
        event.preventDefault();
        var target = event.target;
        var id = $(target).parent().attr('href').substring(1);
        var component = this._indexes[id];
        this.remove(component);
    }

    /**
     * Remove the component from the TabPanel.
     *
     * ##### Events:
     * + 'remove'- triggered after removed. event.data => the removed component.
     * + 'select' - triggered after selected. event.data => the selected component.
     *
     * @memberof TabPanel#
     * @param {Widget|jQuery|NodeList} component - The component to remove.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {TabPanel} this
     */
    function remove(component, options) {
        if(component===undefined) return this;

        options || (options = {});

        var anchors = this._anchors;
        var index = _.isNumber(component) ? component : _.findIndex(this._components, function(n) {
            return n === component;
        });

        var $tab = $(anchors.$navbar.find('> li')[index]);
        var id = $tab.find('>a').attr('href').substring(1);
        var $tabpane = anchors.$content.find('> div.tab-pane#'+id);

        this._components.splice(index, 1);
        delete this._indexes[$tabpane.prop('id')];

        this.hide();

        $tabpane.remove();
        $tab.remove();

        if(this.size()>0) {
            this.select(0, options);
            this.show();
        }

        options.silent || this.trigger('remove', {
            data: {},
            context: this,
            source: this
        });

        return this;
    }

    /**
     * Get the component.
     *
     * @memberof TabPanel#
     * @param {Integer} index - The index of component. zero-based.
     * @returns {Widget|jQuery|NodeList}
     */
    function get(index) {
        return this._components[index];
    }

    /**
     * Select the component to show(make it active).
     *
     * ##### Events:
     * + 'select' - triggered after selected.
     *
     * @memberof TabPanel#
     * @param {Widget|jQuery|NodeList|Integer} component - The component(or index of the component) to show.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {TabPanel} this
     */
    function select(component, options) {
        if(component===undefined) return this;

        options || (options = {});
        var anchors = this._anchors;

        var index = _.isNumber(component) ? component : _.findIndex(this._components, function(n) {
            return n === component;
        });

        anchors.$navbar.find('>li').removeClass('active');
        anchors.$content.find('>div.tab-pane').hide();

        var $tab = $(anchors.$navbar.find('> li')[index]);
        var id = $tab.find('>a').attr('href').substring(1);
        var $tabpane = anchors.$content.find('> div.tab-pane#'+id);
        $tab.addClass('active');
        $tabpane.show();

        (options.silent) || this.trigger("select", {
            context: this,
            source: this,
            data: this._components[index]
        });

        return this;
    }

    /**
     * Get the active component.
     *
     * @memberof TabPanel#
     * @returns {Widget|jQuery|NodeList}
     */
    function current() {
        var anchors = this._anchors;

        var $links = anchors.$navbar.find('>li>a');
        var link = _.find(_.toArray($links), function(link) {
            return $(link).parent().hasClass('active');
        });

        var id = link.getAttribute('href').substring(1);

        return this._indexes[id];
    }

    /**
     * Get the # of components.
     *
     * @memberof TabPanel#
     * @returns {Integer}
     */
    function size() {
        return this._components.length;
    }

    /**
     *
     * Get the current tab's title.
     *
     * @memberof TabPanel#
     * @returns {String}
     */
    function title() {
        var anchors = this._anchors;

        var $links = anchors.$navbar.find('> li a');
        var link = _.find(_.toArray($links), function(link) {
            return $(link).parent().hasClass('active');
        });

        var textNode = _.first($(link).contents().filter(function(){return this.nodeType===3;}));

        return textNode.textContent;

    }

    var props = {
        _anchors: undefined,
        _components: undefined,
        _indexes: undefined
    };

    var TabPanel = declare(Base, {
        initialize: initialize,
        render: render,

        add: add,
        remove: remove,
        select: select,
        get: get,
        current: current,
        size: size,
        title: title
    }, props);

    return TabPanel;
});
