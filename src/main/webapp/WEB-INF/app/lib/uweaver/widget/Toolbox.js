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

define(['underscore', 'jquery',
    'uweaver/lang', 'uweaver/theme',
    'uweaver/widget/Widget', 'uweaver/data/Collection',
    'text!./tpl/Toolbox.html', 'text!./tpl/toolbox/Folder.html', 'text!./tpl/toolbox/Item.html',
    'uweaver/Logger'], function (_, $, lang, theme, Widget, Collection,
                                 tpl, tplFolder, tplItem, Logger) {
    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Toolbox**
     * A toolbox is a container for selectable items.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Toolbox
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the toolbox.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            data: new Collection(),
            nameField: 'name',
            iconField: 'icon',
            categoryField: 'category'
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $content: undefined
        };

        cfg.tpl || (cfg.tpl = tpl);

        this.data(cfg.data, {render: false});

    }

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
        var data = this._data;

        anchors.$content = this.$anchor('content');

        this._tplFolder = _.template(tplFolder);
        this._tplItem = _.template(tplItem);

        var html = "";

        var folders = _.uniq(data.pluck(cfg.categoryField));
        _.each(folders, function(folder, i) {
            var index = i + 1;
            html = html + renderFolder.call(this, folder, theme.fill(index), "uw-background-metal", theme.line(index));
        }, this);

        anchors.$content.html(html);

        var $headers = this.$anchor('header');
        $headers.on('click', _.bind(onFolderSelect, this));

        this.$anchor('items').hide();
        this.$anchor('items').first().show();


        var $items = this.$anchor('item');
        $items.on('click', _.bind(onItemClick, this));

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

    function select(value) {
        var item = this.get(value);
        var event = {
            context: this,
            source: this,
            data: item
        };

        this.trigger("select", event);
    }

    function get(id) {
        return this._data.get(id);
    }

    function renderFolder(folder, fill, background, line) {
        var data = this._data;
        var cfg = this._cfg;
        var categoryField = cfg.categoryField;
        var filter = {}; filter[categoryField] = folder;
        var items = data.where(filter);
        var htmlItems = "";

        _.each(items, function(item) {
            htmlItems = htmlItems + renderItem.call(this, item, fill, background, line);
        }, this);

        var html = this._tplFolder({
            name: folder,
            items: htmlItems,
            fill: fill,
            background: "uw-background-white"
        });

        return html;
    }


    function renderItem(item, fill, background, line) {
        var cfg = this._cfg;
        var nameField = cfg.nameField;
        var iconField = cfg.iconField;
        var icon = item.get(iconField) || 'gear';

        var html = this._tplItem({
            name: item.get(nameField),
            value: item.cid,
            icon: icon,
            line: line,
            background: background
        });

        return html;
    }

    function onItemClick(event) {
        event.preventDefault();
        var value = event.currentTarget.value;
        this.select(value);
    }

    function onFolderSelect(event) {
        event.preventDefault();
        var value = event.currentTarget.value;

        this.$anchor('items').hide();

        var $body = $(event.currentTarget).next();
        $body.show();
    }

    function height(value) {
        if(!value) return this.$el.outerHeight();

        this.$el.outerHeight(value);

        var $folders = this.$anchor('folder');
        var headerHeight = $folders.find('[data-uw-anchor=header]').outerHeight();
        $folders.find('[data-uw-anchor=items]').outerHeight(value - headerHeight * $folders.length);
    }

    function data(items, options) {
        if(!items) return this._data;

        options || (options = {});

        var defaults = {
            render: true
        };

        _.defaults(options, defaults);

        this._data = items;

        this.listenTo(this._data, "update", _.bind(onItemsUpdate, this));

        options.render && this.render();
    }

    function onItemsUpdate(event) {
        this.render();
    }

    var props = {
        LOGGER: new Logger("Toolbox"),
        _data: undefined,
        _anchors: undefined
    };

    var Toolbox = declare(Base, {
        initialize: initialize,
        render: render,
        height: height,
        data: data,

        select: select,
        get: get
    }, props);

    return Toolbox;
});
