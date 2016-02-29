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


define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/converter',
    'uweaver/widget/Widget', 'uweaver/data/Collection', 'uweaver/data/Model',
    'text!./tpl/Grid.html',
    'uweaver/Logger'], function (_, $, lang, converter, Widget, Collection, Model, tpl, Logger) {

    var declare = lang.declare;
    var Base = Widget;
    var LOGGER = new Logger("uweaver/widget/Grid");

    /**
     * This class represents a table.
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
     *
     *     var renderer = function(item) {
     *          return '<i value="DELETE" data-uw-params="' + item.id + '" class="fa fa-trash uw-hover uw-clickable" style="font-size:24px;"></i>';
     *     };
     *
     *     var grid = new Grid({
     *         data: items,
     *         columns: [
     *             {text: "", renderer: renderer},
     *             {text: "ID", dataIndex: "id", style: {width: '100px'}},
     *             {text: "Name", dataIndex: "name", style: {width: '150px'}},
     *             {text: "Price", dataIndex: "price", editable: true, style: {width: '80px'}},
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
     *     + table - the table.
     *     -->
     *     <table class="table table-striped"></table>
     *
     * ##### Events:
     * + 'select' - [select()]{@link Grid#select}, [toggle()]{@link Grid#toggle}
     * + 'deselect' - [deselect()]{@link Grid#deselect}, [toggle()]{@link Grid#toggle}
     * + 'transition' - [data()]{@link Grid#data}
     *
     * @constructor Grid
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl(String) - A html string to layout & construct the DOM element. Optional.
     * + data(Collection) - A collection to specify the models to display. Required.
     * + mode(Grid.MODE) - A value to specify the selection model. Grid.MODE.SINGLE for single selection,
     * Grid.MODE.MULTI for multiple selection or Grid.MODE.NONE to disable selection. Default = Grid.MODE.NONE.
     * + columns(Object[]) - An array of column configuration to define the columns. For examples:
     * [{text: "ID", dataIndex: "id"},{text: "Name", dataIndex: "name"}]. Required.
     *
     * #####Column Configuration:
     * + text(String) - the caption. required.
     * + dataIndex(String) - the property of the model. required.
     * + style(Object) - the css of the column. optional.
     * + editable(Boolean) - A boolean value to specify if the column is editable. default: false.
     * + format(String) - the presentation format of the column. optional.
     * + renderer(Function(item)) - a function to render the cells of the column. The current model is passed as the
     * item parameter and the function should return the html to display inside the cell. optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            data: new Collection(),
            mode: Grid.MODE.NONE,
            columns: []
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._columns = cfg.columns;

        var columnStyle = {overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis'};

        var fixed = 0;
        _.each(this._columns, function(column){
            column.style || (column.style = {});
            _.defaults(column.style, columnStyle);
            if(column.style.width) fixed++;
        });

        if(fixed+1>=this._columns.length) {
            var style = {'table-layout': 'fixed'};
            _.defaults(cfg.style, style);
        }

        this.mode(cfg.mode);

        this.data(cfg.data, {render: false});

        this._selection = [];

        cfg.tpl || (cfg.tpl = tpl);

        $(document).on('click', _.bind(onDocumentClick, this));
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

        if(this.$('thead').size()===0) this.$el.append('<thead></thead>');
        if(this.$('tbody').size()===0) this.$el.append('<tbody></tbody>');

        var $thead = this.$('thead');
        var $tbody = this.$('tbody');

        $thead.empty();
        $tbody.empty();

        var data = this._data;
        var row = "<tr>";
        _.each(this._columns, function(element, index){
            var text = element.text;
            var style = element.style;
            var indicator = "";

            if(element.editable) {
                indicator = indicator + "<i class='fa fa-pencil' style='margin-left:5px;'></i>";
            }
            row = row + "<th style= '" + toCssText(style) + "'>" + text + indicator + "</th>";
        });
        row = row + "</tr>";
        $thead.append(row);

        data.each(function(item){
            var row = "<tr>";
            _.each(this._columns, function(element, index){
                var value;
                var renderer = element.renderer;

                if(_.isFunction(renderer)) {
                    value = renderer(item);
                } else {
                    var dataIndex = element.dataIndex;
                    var style = element.style;
                    var format = element.format;
                    value = converter.convert(item.get(dataIndex), 'string', format);
                }

                row = row + "<td data-uw-index='" + index + "' style= '" + toCssText(style) + "'>"
                    + ((value==undefined||value==null) ? "" : value) + "</td>";
            });
            row = row + "</tr>";
            var $row = $(row);
            $row.data('cid', item.cid);
            $tbody.append($row);
        }, this);

        this.$('tbody>tr').on('click', _.bind(onRowClick, this));
        this.$('tbody>tr>td').on('click', _.bind(onCellClick, this));
        this.renderSelection();

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

    function toCssText(style) {
        var cssText = "";
        _.each(style, function(value, key) {
            cssText = cssText + key + ":" + value + ";";
        });
        return cssText;
    }

    function onRowClick(event) {
        var $row = $(event.currentTarget);
        var cid = $row.data('cid');
        this.toggle(cid);
    }

    function onCellClick(event) {
        var $cell = $(event.currentTarget);
        var index = $cell.attr('data-uw-index');
        var column = this._columns[index];

        if(!column.editable) return;

        if(_.first($cell)=== _.first(this._editableCell)) {
            return;
        }
        renderCell.call(this, this._editableCell);
        makeCellEditable.call(this, $cell);
    }

    function onDocumentClick(event) {
        var $cell = $(event.target).closest('td');

        if(_.first($cell)=== _.first(this._editableCell)) {
            return;
        }

        renderCell.call(this, this._editableCell);
    }

    function makeCellEditable(cell) {
        var $cell = cell;
        if($cell.data('mode')==='edit') return;

        var index = $cell.attr('data-uw-index');
        var column = this._columns[index];
        var dataIndex = column.dataIndex;
        var $row = $cell.parent();
        var cid = $row.data('cid');
        var value = this.data().get(cid).get(dataIndex);
        var type = selectType(value);

        // preserve cell's style
        $cell.data('padding-top', $cell.css('padding-top'));
        $cell.data('padding-bottom', $cell.css('padding-bottom'));

        $cell.css('padding-top', '4px');
        $cell.css('padding-bottom', '4px');

        var $inputbox = $("<input class='form-control' >");
        $inputbox.width("100%");$inputbox.height($cell.height());
        $inputbox.css('padding', '0px 6px');
        $inputbox.prop('type', type);
        $inputbox.val(converter.convert(value, 'string', 'yyyy-MM-dd'));
        $cell.html($inputbox);
        this._editableCell = $cell;
    }

    function selectType(value) {
        if(_.isDate(value)) return 'date';

        if(_.isNumber(value)) return 'number';
    }

    function renderCell(cell) {
        if(!cell) return;

        var $cell = cell;
        var index = $cell.attr('data-uw-index');
        var column = this._columns[index];
        var dataIndex = column.dataIndex;
        var format = column.format;
        var $row = $cell.parent();
        var cid = $row.data('cid');
        var value = this.data().get(cid).get(dataIndex);

        //restore cell's style
        $cell.css('padding-top', $cell.data('padding-top'));
        $cell.css('padding-bottom', $cell.data('padding-bottom'));
        $cell.data('padding-top', undefined);
        $cell.data('padding-bottom', undefined);

        $cell.html(converter.convert(value, format));
    }

    /**
     * Toggle a model's selection status.
     *
     * ##### Events:
     * + 'select' - triggered after a model is selected. event.data => the selected model.
     * + 'deselect' - triggered after a model is deselected. event.data => the deselected model.
     *
     * @memberof Grid#
     * @param {Object} item - The model, model.id or model.cid.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default = false.
     * @returns {Grid} this
     */
    function toggle(item, options) {
        if(!item) return this;
        var mode = this._mode;

        if(mode===Grid.MODE.NONE) return this;

        var model = (item instanceof Model) ? item : this.data().get(item);

        var cid = model.cid;

        options || (options = {});

        if(_.contains(this._selection, cid)) {
            this.deselect(item, options);
        } else {
            this.select(item, options);
        }

        return this;
    }

    /**
     * Deselect a model.
     *
     * ##### Events:
     * + 'deselect' - triggered after a model is selected. event.data => the deselected model.
     *
     * @memberof Grid#
     * @param {Object} item - The model, model.id or model.cid
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default = false.
     * @returns {Grid} this
     */
    function deselect(item, options) {
        if(!item) return this;

        var mode = this._mode;

        if(mode===Grid.MODE.NONE) return this;

        options || (options = {});

        var model = (item instanceof Model) ? item : this.data().get(item);

        if(!model) return this;

        var cid = model.cid;

        if(!_.contains(this._selection, cid)) return this;

        this._selection = _.without(this._selection, cid);

        this.renderSelection();

        var event = {
            context: this,
            source: this,
            data: model
        };

        (options.silent) || this.trigger('deselect', event);

    }

    /**
     * Select a model.
     *
     * ##### Events:
     * + 'select' - triggered after a model is selected. event.data => the selected model.
     *
     * @memberof Grid#
     * @param {Object} item - The model, model.id or model.cid
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default = false.
     * @returns {Grid} this
     *
     * @todo select multiple items.
     */
    function select(item, options) {
        if(!item) return this;

        var mode = this._mode;

        if(mode===Grid.MODE.NONE) return this;

        options || (options = {});

        var model = (item instanceof Model) ? item : this.data().get(item);

        if(!model) return this;

        var cid = model.cid;

        if(mode===Grid.MODE.SINGLE) {
            this.deselect(this._selection);
        }

        this._selection.push(cid);

        this.renderSelection();

        var event = {
            context: this,
            source: this,
            data: model
        };

        (options.silent) || this.trigger('select', event);
    }

    /**
     * Reset the grid to deselect all selection.
     *
     * @memberof Grid#
     * @returns {Grid} this
     */
    function reset() {
        this._selection = [];
        this.renderSelection();
        return this;
    }

    /**
     * Get the selected model.
     *
     * @memberof Grid#
     * @returns {Model[]} the array of selected model
     */
    function selection() {
        var items = [];
        var data = this._data;

        _.each(this._selection, function(id) {
            items.push(data.get(id));
        });

        return items;
    }

    function renderSelection() {
        _.each(this.$('tbody>tr'), function(element) {
            var $element = $(element);
            var cid = $element.data('cid');
            if(_.contains(this._selection, cid)) {
                $element.addClass('uw-mark')
            } else {
                $element.removeClass('uw-mark');
            }
        }, this);
    }

    /**
     * Get or set the data.
     *
     * ##### Events:
     * + 'transition' - triggered after a new collection is bound. event.data => the collection.
     *
     * @memberof Grid#
     * @param {Collection} items - the data.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default = false.
     * + render(Boolean) - A false value will prevent the events from being rendered. Default = true.
     * @returns {Grid} this
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

        this.listenTo(this._data, "update", _.bind(onItemsUpdate, this));

        options.render && this.render();

        var event = {
            context: this,
            source: this,
            data: items
        };

        (options.silent) || this.trigger('transition', event);

        return this;
    }


    /**
     * Get or set the selection model.
     *
     * @memberof Grid#
     * @param {Grid.MODE} [value] - An value to specify the selection model.
     * ##### Options:
     * + Grid.MODE.SINGLE - set the grid to single selection.
     * + Grid.MODE.MULTI - set the grid to multiple selection.
     * + Grid.MODE.NONE - set the grid to disable selection.
     * @returns {Grid.MODE}
     */
    function mode(value) {
        if(!value) return this._mode;

        this._mode = value;
        if(this._mode===Grid.MODE.NONE) {
            this.removeClass('uw-selectable');
        } else {
            this.addClass('uw-selectable');
        }
    }

    function onItemsUpdate(event) {
        this._selection = [];
        this.render();
    }


    var props = {
        tagName: 'table',
        className: 'table table-striped',
        _data: undefined,
        _columns: undefined,
        _mode: undefined,
        _selection: undefined,
        _editableCell: undefined
    };

    var Grid = declare(Base, {
        initialize: initialize,
        render: render,
        select: select,
        deselect: deselect,
        toggle: toggle,
        reset: reset,
        data: data,
        mode: mode,
        selection: selection,
        renderSelection: renderSelection
    }, props);

    // Enumeration of the selection model
    Grid.MODE = {
        SINGLE: 'SINGLE',
        MULTI: 'MULTI',
        NONE: 'NONE'
    };

    return Grid;
});