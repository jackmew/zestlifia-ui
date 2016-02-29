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
    'uweaver/widget/Widget', 'uweaver/string',
    'text!./tpl/Tabs.html',
    'uweaver/Logger'], function(_, $, lang, Widget, string, tpl, Logger) {

    var declare = lang.declare;
    var Base = Widget;

    /**
     * A tabs is a tabbed container.
     *
     * #### Configs ####
     * - tpl(String): A html string to layout & construct the DOM.
     * - title(String): The title of the panel.
     * - collapsible(Boolean): Specify if the panel is collapsible.
     *
     * @constructor Panel
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the panel.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $navbar: undefined,
            $content: undefined,
        };

        this._nodes = [];

        cfg.tpl || (cfg.tpl = tpl);
    }

    /**
     * @memberof Tabs#
     * @protected
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

        anchors.$navbar = this.$('.nav');
        anchors.$content = this.$('.tab-content');

        var nodes = anchors.$content.find('.tab-pane');
        this._nodes = _.toArray(nodes);

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this._nodes.length===0 || this.show();
        }

        return this;

    }

    function add(node, options) {
        options || (options = {});

        var anchors = this._anchors;

        var tab = "<li ><a href='#${id}' data-toggle='tab'>${title}</a></li>";
        var tabpane = "<div  class='tab-pane' id='${id}'></div>";

        var args = {
            id: _.uniqueId(),
            title: options.title
        };

        var $tab = $(string.substitute(tab, args));
        var $tabpane = $(string.substitute(tabpane, args));

        if(node instanceof Widget) {
            node.attach($tabpane);
        } else if(node instanceof jQuery) {
            $tabpane.append(node);
        } else if(typeof(node)==='string') {
            $tabpane.html(node);
        }

        anchors.$navbar.append($tab);
        anchors.$content.append($tabpane);
        $tab.find('a').tab('show');

        this._nodes.push(node);

        this.isVisible() || this.show();

        return node;
    }

    function remove(node) {
        var anchors = this._anchors;
        var index = _.findIndex(this._nodes, function(n) {
            return n === node;
        });

        var $tab = $(anchors.$navbar.find('li')[index]);
        var $tabpane = $(anchors.$content.find('.tab-pane')[index]);

        this.select(0);

        $tabpane.remove();
        $tab.remove();

        if(this._nodes.length===0) this.hide();
    }

    function get(index) {
        return this._nodes[index];
    }

    function select(node) {
        var anchors = this._anchors;

        if(node===undefined) {
            var $tabs = anchors.$navbar.find('li');
            var index = _.findIndex(_.toArray($tabs), function(tab) {
                return $(tab).hasClass('active');
            });

            return this._nodes[index];
        }

        var index = _.isNumber(node) ? node : _.findIndex(this._nodes, function(n) {
            return n === node;
        });
        var $tab = $(anchors.$navbar.find('li')[index]);
        $tab.find('a').tab('show');
    }

    var props = {
        LOGGER: new Logger("Tabs"),

        _anchors: undefined,
        _nodes: undefined
    };

    var Tabs = declare(Base, {
        initialize: initialize,
        render: render,

        add: add,
        remove: remove,
        get: get,
        select: select
    }, props);


    return Tabs;
});
