/**
 * Finder
 * Created by jasonlin on 8/7/14.
 */

define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget', 'uweaver/widget/Form', 'uweaver/widget/Triggerbox',
    'uweaver/validator', 'uweaver/converter', 'uweaver/string',
    'uweaver/Logger'], function (_, $, lang, Widget, Form, Triggerbox, validator, converter, string, Logger) {

    var declare = lang.declare;
    var i18n = uweaver.i18n;

    var Base = Widget;

    var Finder = declare(Base, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        perform: perform,
        search: search,
        fetch: fetch,
        reset: reset,
        select: select,
        selection: selection,
        criteria: criteria,
        firstPage: firstPage,
        previousPage: previousPage,
        nextPage: nextPage,
        refresh: refresh,
        getCriteria: getCriteria,
        setCriteria: setCriteria,

        /**
         * protected members
         */
        logger: new Logger("Finder"),
        prepare: prepare,

        store: store,
        page: page,
        pages: pages,
        pageSize: pageSize,
        filter: filter,

        /**
         * private members
         */
        _form: undefined,


        /**
         * event handlers
         */
        events: {
            "click [data-uw-gear=list] > tbody > tr": "onSelect",
            "change [data-uw-gear=page]": "onChange"
        },

        onFormExecute: function(command, event) {
            this.perform(command);
        },

        onToolbarPerform: function (command, event) {
            this.perform(command);
        },

        onSelect: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);

            $target.toggle();
        },

        onChange: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);
            var page = $target.val();
            this.page(page);
        }
    });

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._markers = {
            form: {},
            toolbar: [],
            store: {},
            $criteria: undefined,
            $list: undefined,
            $page: undefined,
            $pages: undefined,
            $total: undefined
        };

        this.cache.store = config.store;
    }

    function prepare() {

        Base.prototype.prepare.apply(this, arguments);

        var markers = this._markers;

        markers.$list = this.$gear('list');
        markers.$list.css('display', 'table');
        markers.$list.css('cursor', 'pointer');
        markers.$page = this.$gear("page");
        markers.$pages = this.$gear("pages");
        markers.$total = this.$gear("total");
        markers.$criteria = this.$gear('criteria');

        //this.translate(this.$('legend, label, th, button, input, var'));

        var form = new Form({
            el:this.$gear('criteria')
        });
        form.render({enhance: false});
        this.listenTo(form, 'all', _.bind(this.onFormExecute, this));
        this._form = form;

        var $toolbars = this.$gear('toolbar');
        _.each($toolbars, function($toolbar) {
            var toolbar = new Triggerbox({
                el: $toolbar
            });
            toolbar.render({enhance: false});
            this.listenTo(toolbar, 'all', _.bind(this.onToolbarPerform, this));
            cache.toolbar.push(toolbar);
        }, this);


        this.page(1);
    }

    function store() {
        var cache = this.cache;
        return cache.store;
    }

    function filter() {
        var store = this.store();

        return store.filter();
    }

    function page(value) {
        var store = this.store();

        if(!value) return store.page();

        this.fetch({
            page: value
        });
    }

    function fetch(options) {
        var cache = this.cache;
        var store = this.store();

        options = options || {};

        store.fetch(options).done(function(response) {
            var $list = cache.$list;
            var $page = cache.$page;
            var $pages = cache.$pages;
            var $total = cache.$total;

            var $columns = $list.find('thead tr th');

            var tpl = "";
            var fields = {};
            $columns.each(function(index, column) {
                var $column = $(column);
                var name = $column.attr('name');
                var style = $column.attr('data-uw-style');
                var format = $column.attr('data-uw-format');
                tpl = tpl + "<td style='" + style + "'><%-" + name + "%></td>";
                fields[name] = format;
            });
            tpl = tpl + "";
            var template = _.template(tpl);

            var html = "<tbody>";
            store.each(function(item) {
                var values = {};
                _.each(fields, function(format, name) {
                    values[name] = string.format(item.get(name), format);
                });
                html = html + "<tr data-uw-id='" + item.id + "'>" + template(values) + "</tr>";
            }, this);
            html = html + "</tbody>";

            $list.find('tbody').remove();
            $list.append(html);
            $page.val(store.page());
            $pages.text(store.pages());
            if(store.total()==0) {
                $total.text(i18n.translate("No data to display"));
            } else {
                var str = i18n.translate("Total: ${0} records");
                $total.text(string.substitute(str, store.total()));
            }

            $list.table('rebuild');

            this.setCriteria(store.filter());

        }, this);
    }

    function pages() {
        return this.store().pages();
    }

    function pageSize() {
        return this.store().pageSize();
    }

    function criteria(item) {
        if(!item) return this.getCriteria();

        return this.setCriteria(item);
    }

    function getCriteria() {
        var cache = this.cache;
        var values = {};
        var fields = cache.$criteria.find('input');

        fields.each(function(index, field) {
            var $field = $(field);
            var op = $field.attr('data-uw-operand') || "eq";
            var value = converter.convert($field.val(), $field.attr("type"));

            if(value) {
                values[$field.attr('name') + "." + op] = value;
            }
        });

        return values;
    }

    function setCriteria(item) {
        var cache = this.cache;
        var values = {};
        var form = cache.form;
        _.each(item, function(value, key) {
            var name = key.split("\.")[0];

            values[name] = value;
        }, this);

        form.values(values);
    }

    function select() {

    }

    function selection() {
        var cache = this.cache;
        var store = this.store();
        var rows = cache.$list.find('tr');

        var items = [];
        rows.each(_.bind(function(index, element) {
            var $element = $(element);
            if($element.mark()) {
                var item = store.get($element.attr('data-uw-id'));
                items.push(item);
            }
        }, this));

        return items;

    }

    function perform(command) {
        switch(command.toUpperCase()) {
            case Finder.COMMAND.SEARCH:
                this.search();
                break;
            case Finder.COMMAND.RESET:
                this.reset();
                break;
            case Finder.COMMAND.FIRSTPAGE:
                this.firstPage();
                break;
            case Finder.COMMAND.PREVIOUSPAGE:
                this.previousPage();
                break;
            case Finder.COMMAND.NEXTPAGE:
                this.nextPage();
                break;
            case Finder.COMMAND.REFRESH:
                this.refresh();
                break;
            default:
                var event = {
                    context: this,
                    data: this.selection()
                };

                this.trigger(command, event);
                break;
        }
    }

    function search() {
        var cache = this.cache;
        var form = cache.form;

        if(!form.validate({prompt:true, mark:true})) {
            form.enable();
            return;
        }

        this.fetch({
            page: 1,
            filter: this.criteria()
        });
    }

    function reset() {
        var cache = this.cache;
        var form = cache.form;

        form.reset();

        this.fetch({
            page: 1,
            filter: {}
        });
    }

    function firstPage() {
        this.page(1);
    }

    function previousPage() {
        this.page(this.page() - 1);
    }

    function nextPage() {
        this.page(this.page() + 1);
    }

    function refresh() {
        this.fetch();
    }


    // Enumeration of build in commands
    Finder.COMMAND = {
        SEARCH: 'SEARCH',
        RESET: 'RESET',
        FIRSTPAGE: 'FIRSTPAGE',
        PREVIOUSPAGE: 'PREVIOUSPAGE',
        NEXTPAGE: 'NEXTPAGE',
        REFRESH: 'REFRESH'
    };
    return Finder;
});