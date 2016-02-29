/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2015 Jason Lin
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
define(['jquery', 'underscore', 'uweaver/lang', 'uweaver/string',
    'uweaver/widget/Widget', 'uweaver/widget/Triggers', 'uweaver/data/Collection',
    'uweaver/Logger',
    'text!./tpl/Pagination.html'], function ($, _, lang, string, Widget, Triggers, Collection, Logger, tpl){
    var declare = lang.declare;
    var Base = Widget;
    var LOGGER = new Logger("uweaver/widget/Pagination");

    /**
     * This class represents a pagination component.
     *
     * ##### Usage
     *     // Declare a new type of collection, Products, with the following designs:
     *     // * the resource - 'products'
     *     var declare = uweaver.lang.declare;
     *     var Products = declare(Collection, {
     *         resource: 'products'
     *     });
     *
     *     var items = new Products();
     *     var grid = new Grid({
     *         data: items,
     *         columns: [
     *             {text: "ID", dataIndex: "id", style: {width: '100px'}},
     *             {text: "Name", dataIndex: "name", style: {width: '150px'}},
     *             {text: "Note", dataIndex: "note"}],
     *        mode: Grid.MODE.SINGLE,
     *        el: $('#grid')
     *     });
     *     grid.render();
     *
     *     var pagination = new Pagination({
     *         data: items,
     *         el: this.$('#pagination')
     *     });
     *     pagination.render();
     *
     *     // fetch the data(models).
     *     // the grid & pagination will re-render after fetch completely.
     *     items.fetch();
     *
     * ##### Template
     *     <!-- the following dom are required.
     *     * ul.pagination - the pagination component.
     *     -->
     *     <ul class="pagination"></ul>
     *
     * ##### Events:
     * - 'transition' => [data()]{@link Pagination#data}
     *
     * @constructor Pagination
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl(String) - A html string to layout & construct the DOM element.
     * + data(Collection) - A collection to specify the models to display.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {};

        this.css('display', 'inline-block');

        this.data(cfg.data, {render: false});

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

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        this._triggers && this._triggers.destroy();

        var tpl = "<li><a href='#' value='${page}'>${page}</a></li>";
        var html;
        var items = this._data;
        var pages, page;
        var start, end;
        if(items.limit()) {
            pages = Math.ceil(items.total() / items.limit());
            page = (items.offset() / items.limit()) + 1;
        } else {
            pages = 1;
            page = 1;
        }
        start = Math.floor((page-1)/10) * 10 + 1;
        end = Math.min(start+9, pages);
        html = string.substitute("<li><a href='#' value='${page}'><span>&laquo;</span></a></li>", {page: Math.min(page-1, 1)});

        for(var i=start; i<=end; i++) {
            html = html + string.substitute(tpl, {page: i});
        }
        html = html + string.substitute("<li><a href='#' value='${page}'><span>&raquo;</span></a></li>", {page: Math.max(page+1, pages)});
        this.$el.html(html);

        this.$('li').css('display', 'inline-block');
        this.$('[value=' + page + ']').parent().addClass('active');
        this._page = page;

        var triggers = new Triggers({
            el: this.$('li'),
            selector: 'a'
        });
        triggers.render();
        this.listenTo(triggers, "trigger", _.bind(onCommandTrigger, this));
        this._triggers = triggers;

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
     * Get or set the data.
     *
     * ##### Events:
     * - 'transition' => triggered after a new collection is bound.
     *
     * @memberof Pagination#
     * @param {Collection} items - the data.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Pagination} this
     */
    function data(items, options) {
        if(!items) return this._data;

        options || (options = {});

        var defaults = {
            render: true
        };

        _.defaults(options, defaults);

        if(this._data) this.stopListening(this._data);

        this._data = items;

        this.listenTo(this._data, "sync", _.bind(onItemSync, this));

        options.render && this.render();

        var event = {
            context: this,
            source: this,
            data: items
        };

        (options.silent) || this.trigger('transition', event);
    }

    function onItemSync(event) {
        this.render();
    }

    function onCommandTrigger(event) {
        var page = event.data.value;

        switch (page.toUpperCase()) {
            case Pagination.COMMAND.PREVIOUS:
                this.previous();
                break;
            case Pagination.COMMAND.NEXT:
                this.next();
                break;
            default:
                this.page(page);
                break;
        }
    }

    /**
     * Get or go to the page specified.
     *
     * ##### Events:
     * - 'transition' => triggered after go to the page.
     *
     * @memberof Pagination#
     * @param {Integer} value - the page.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Pagination} this
     */
    function page(value, options) {
        if(!value) return this._page;

        options || (options = {});

        var items = this._data;
        var offset = items.limit() * (value - 1);

        items.fetch({
            offset: offset
        });
        this._page = value;

        var event = {
            context: this,
            source: this,
            data: items
        };

        (options.silent) || this.trigger('transition', event);
    }

    /**
     * Go to previous page.
     *
     * ##### Events:
     * - 'transition' => triggered after go to the previous page.
     *
     * @memberof Pagination#
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Pagination} this
     */
    function previous(options) {
        options || (options = {});
        this.page(this.page() - 1);

        var event = {
            context: this,
            source: this,
            data: items
        };

        (options.silent) || this.trigger('transition', event);
    }

    /**
     * Go to next page.
     *
     * ##### Events:
     * - 'transition' => triggered after go to the next page.
     *
     * @memberof Pagination#
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Pagination} this
     */
    function next() {
        this.page(this.page() + 1);
    }

    var props = {
        /**
         * @override
         */
        tagName: 'ul',
        className: 'pagination',
        _triggers: undefined,
        _page: page
    };

    var Pagination = declare(Base, {
        initialize: initialize,
        render: render,
        data: data,
        page: page,
        previous: previous,
        next: next

    }, props);

    // Enumeration of build in commands
    Pagination.COMMAND = {
        PREVIOUS: "PREVIOUS",
        NEXT: "NEXT"
    };

    return Pagination;


});