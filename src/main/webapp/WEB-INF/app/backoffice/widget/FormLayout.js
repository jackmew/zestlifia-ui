/**
 * Created by jackho on 2/2/16.
 *
 * FormLayout. only for layout
 * 1. form-horizontal
 * 2. form-inline
 *
 * 1.FormLayout 擁有 Form。 -> complete
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'widget/Input', 'widget/Row', 'widget/Form',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Input, Row, Form,
                                 Logger) {

    var LOGGER = new Logger("widget/FormLayout");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            form: new Form(),
            mode: FormLayout.MODE.HORIZONTAL,
            rows: []
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        var cfg = this._cfg;
        this.addClass(cfg.mode);


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
    /*
    * add/get row
    * */
    function addRow() {
        var cfg = this._cfg ;
        var rows = cfg.rows;

        var row = new Row({
            form: cfg.form
        }).render();
        row.attach(this.$el);
        cfg.rows.push(row);

        LOGGER.debug("row numbers: ${0}",rows.length);
        return row ;
    }
    function getRow(index) {
        return this._cfg.rows[index];
    }
    /**
     * @param row - add field to row
     * @param field - Input Select CRBox Textarea ...
     * @param name - record your field
     * @param labelCol - bootstrap grid system - optional
     * @param inputCol - bootstrap grid system - optional
     */
    function addField(row, field, name, labelCol, inputCol) {
        row.addField(field, name, labelCol, inputCol);
    }
    function addGrid(row, grid, col) {
        row.addGrid(grid, col)
    }
    /*
    * get field from Form
    * */
    function getField(name) {
        var form = this._cfg.form;
        return form.getField(name);
    }
    function getForm() {
        return this._cfg.form;
    }

    var props = {
        tagName: 'div',
        _class: 'FormLayout',

        _anchors: undefined
    };

    var FormLayout = declare(Base, {
        initialize: initialize,
        render: render,

        addRow: addRow,
        getRow: getRow,
        addGrid: addGrid,

        getField: getField,
        addField: addField,

        getForm: getForm
    }, props);

    FormLayout.MODE = {
        HORIZONTAL: "form-horizontal",
        INLINE: "form-inline",
        /*
        為了放入Panel中時使用，因為panel-body已經具有form-horizontal。
        https://www.evernote.com/l/ATDwSKawgzZAOo9R4kbp6XxFRh81oXlbItQ
        */
        NONE: ""

    };

    return FormLayout;
});