/**
 * Created by jackho on 2/2/16.
 * 1.
 * <div class="form-group thin-gutter"></div>
 *
 * 2.
 * <div class="row thin-gutter"></div>
 *
 * 1. Row 只會取得傳進來的Form，不會自己New。 -> complete
 *
 * 2. Row 需要具備排列的功能
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Logger) {

    var LOGGER = new Logger("widget/Row");

    var declare = lang.declare;

    var Base = Widget;

    var self = undefined;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            mode: Row.MODE.FORM_GROUP,
            form: undefined,
            gutter: Row.GUTTER.THIN
            //gutter: undefined
        };
        var cfg = this._cfg ;
        _.defaults(cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        self = this ;

        options || (options = {});
        _.defaults(options, defaults);

        this.addClass(this._cfg.mode);
        gutter(this._cfg.gutter);

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
    function getField() {
    }

    /**
     * 加入欄位到row中，若是有給labelCol / inputCol就可以改變佔據的位置
     * @param row - add field to row
     * @param field - Input Select CRBox Textarea ...
     * @param name - record your field
     * @param labelCol - bootstrap grid system - optional
     * @param inputCol - bootstrap grid system - optional
     */
    function addField(field, name, labelCol, inputCol) {
        var form = this._cfg.form;
        form.addField(field, name);

        //this._form.addField(field);
        this.$el.append(field.$el);
        if(!_.isUndefined(labelCol)) {
            var $label = field.$('label.col-sm-1');

            if(labelCol === 0) {
                $label.remove();
            }

            $label.removeClass('col-sm-1');
            $label.addClass('col-sm-'+labelCol);
        }
        if(!_.isUndefined(inputCol)) {
            var $inputWrapper = field.$('div.col-sm-3');
            $inputWrapper.removeClass('col-sm-3');
            $inputWrapper.addClass('col-sm-'+inputCol);
        }
        return field;
    }
    function addGrid(grid, col) {
        var $wrapper = $('<div/>');
        if(_.isUndefined(col)) {
            $wrapper.addClass("col-sm-12");
        } else {
            $wrapper.addClass("col-sm-"+col);
        }
        grid.attach($wrapper);
        this.$el.append($wrapper);

    }
    function gutter(index) {
        if(!_.isUndefined(index)) {
            if(index === Row.GUTTER.THIN) {
                self.addClass('thin-gutter');
            } else if(index === Row.GUTTER.NO) {
                self.addClass('no-gutter');
            } else if(index === Row.GUTTER.M) {
                self.addClass('gutter-10');
            } else if(index === Row.GUTTER.L) {
                self.addClass('gutter-12');
            } else if(index === Row.GUTTER.XL) {
                self.addClass('gutter-20');
            }
        }

    }
    var props = {
        tagName: 'div',
        _class: 'Row',

        _anchors: undefined
    };

    var Row = declare(Base, {
        initialize: initialize,
        render: render,

        addField: addField,
        getField: getField,
        addGrid: addGrid,
        gutter: gutter
    }, props);

    Row.MODE = {
        ROW: "row",
        FORM_GROUP: "form-group"
    };
    Row.GUTTER = {
        NO: 'no-gutter',
        THIN: 'thin-gutter',
        S: "thin-gutter",
        M: "gutter-10",
        L: "gutter-12",
        XL: "gutter-20"
    };

    return Row;
});