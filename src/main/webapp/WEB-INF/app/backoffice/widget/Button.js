/**
 * Created by jackho on 2/16/16.
 *
 *
 NORMAL:
 <button class="btn btn-default fa fa-search" type="button">
    <span>確認</span>
 </button>

 FIELD:
 <button class="btn btn-default" type="button">
    <i class="fa fa-search" style="font-size:18px; color:steelblue;"></i>
 </button>

 Modal & Action:
 <button value="TASKS" class="btn btn-default" style="margin:5px;width:100px;color:steelblue;padding:8px 0px;">
    <span>確認</span>
 </button>

 修改為Default & IconOnly
 Default:
 <button value="TASKS" class="btn btn-default" style="margin:5px;width:100px;color:steelblue;padding:8px 0px;">
    <span>確認</span>
 </button>



 event: trigger
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Widget', 'widget/Field',
    'uweaver/Logger'], function (_, $, lang, Widget, Field, Logger) {

    var LOGGER = new Logger("widget/Button");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {

        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            value: Button.VALUE.SEARCH,
            icon: "fa-search",
            text: undefined,
            mode: Button.MODE.DEFAULT,
            isTrigger: true
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            // DEFAULT
            $text: undefined
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

        build.call(this);

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
    function build() {
        var a = this._anchors;
        var cfg = this._cfg;

        this.addClass('btn');
        this.addClass('btn-default');
        this.prop('type', 'button');
        this.addClass('commandbar-btn');

        if(cfg.mode === Button.MODE.DEFAULT) {
            this.$el.css('width', '100px');
            this.$el.css('padding', '8px 0px');
            this.$el.css('color', 'steelblue');

            a.$text = $('<span/>');
            this.$el.append(a.$text);

            this.addClass('fa');
            this.addClass(cfg.icon);
        } else if(cfg.mode === Button.MODE.CIRCLE) {
            this.addClass('fa');
            this.addClass(cfg.icon);

            //this.$el.css('font-size', '18px');
            this.$el.css('color', 'steelblue');
            this.addClass('btn-circle');

            //if(cfg.text) {
            //    this.$el.attr('data-toggle', 'tooltip');
            //    this.$el.attr('data-placement', "top");
            //    this.$el.attr('title', cfg.text);
            //
            //    this.$el.tooltip();
            //}
        }



        this.prop('value', cfg.value);

        if(cfg.value === Button.VALUE.NEW) {
            text.call(this,'新增');
            setIcon.call(this, 'fa-plus');
        } else if(cfg.value === Button.VALUE.MODIFY) {
            text.call(this,'修改');
            setIcon.call(this, 'fa-edit');
        } else if(cfg.value === Button.VALUE.DELETE) {
            text.call(this,'刪除');
            setIcon.call(this, 'fa-minus');
        } else if(cfg.value === Button.VALUE.CONFIRM) {
            text.call(this,'確認');
            setIcon.call(this, 'fa-check');
        } else if(cfg.value === Button.VALUE.CLOSE) {
            text.call(this,'關閉');
            setIcon.call(this, 'fa-close');
        }  else if(cfg.value === Button.VALUE.SEARCH) {
            text.call(this,'查詢');
            setIcon.call(this, 'fa-search');
        // toolbar
        }  else if(cfg.value === Button.VALUE.EDIT) {
            text.call(this,'編輯');
            setIcon.call(this, 'fa-edit');
        }  else if(cfg.value === Button.VALUE.PLUS) {
            text.call(this,'新增');
            setIcon.call(this, 'fa-plus');
        }  else if(cfg.value === Button.VALUE.MINUS) {
            text.call(this,'刪除');
            setIcon.call(this, 'fa-minus');
        }  else if(cfg.value === Button.VALUE.CLONE) {
            text.call(this,'複製');
            setIcon.call(this, 'fa-clone');
        }  else if(cfg.value === Button.VALUE.EXCEL) {
            text.call(this,'上傳');
            setIcon.call(this, 'fa-file-excel-o');
        }  else if(cfg.value === Button.VALUE.UPLOAD) {
            text.call(this,'上傳');
            setIcon.call(this, 'fa-upload');
        }  else if(cfg.value === Button.VALUE.EYE) {
            text.call(this,'檢視');
            setIcon.call(this, 'fa-eye');
        // 全選
        } else if(cfg.value === Button.VALUE.SELECT_ALL) {
            text.call(this,'全選');
            setIcon.call(this, 'fa-check-square-o');
        }  else if(cfg.value === Button.VALUE.SELECT_NONE) {
            text.call(this,'不選');
            setIcon.call(this, 'fa-square-o');
        } else {
            text.call(this, cfg.text);
        }

        cfg.text && (text.call(this, cfg.text));
        cfg.isTrigger && this.$el.on('click', _.bind(onButtonClick, this));

    }
    function onButtonClick(event) {
        event.preventDefault();
        this.click();
    }

    function click() {
        if(!this.value()) return;

        var event = {
            context: this,
            source: this,
            data: {
                value: this.value()
            }
        };

        this.trigger("trigger", event);
    }
    function value(value) {
        var $button = this.$el;
        if(value===undefined) return $button.prop('value') || $button.attr('value');
        $button.prop('value', value);
    }
    /*
    * DEFAULT: text 顯示在 button
    * CIRCLE:  text 顯示在 tooltip
    * */
    function text(text) {
        var a = this._anchors;
        var mode = this._cfg.mode;
        if(mode === Button.MODE.DEFAULT) {
            if(text===undefined) {
                return a.$text.text();
            } else {
                a.$text.text(text);
                a.$text.css('margin-left', '5px');
            }
        } else {
            if(text===undefined) {
                return this.prop('value');
            } else {
                // tooltip會累積，所以每次加上，都先刪除掉原本的
                this.$el.tooltip('destroy');

                this.$el.attr('data-toggle', 'tooltip');
                this.$el.attr('data-placement', "top");
                this.$el.attr('title', text);

                this.$el.tooltip();
            }
        }
    }

    function setIcon(icon) {
        var cfg = this._cfg;

        this.removeClass(cfg.icon);
        this.addClass(icon)
    }
    /*
    * color = Button.THEME.PRIMARY
    * */
    function setColor(color) {
        this.removeClass('btn-default');
        this.addClass(color);
    }
    function setMode(mode) {
        this._cfg.mode = mode ;
    }

    var props = {
        tagName: 'button',
        _class: 'Button'
    };

    var Button = declare(Base, {
        initialize: initialize,
        render: render,

        value: value,
        text: text,
        click: click,
        setIcon: setIcon,
        setColor: setColor,
        setMode: setMode
    }, props);

    Button.MODE = {
        DEFAULT: 'DEFAULT',
        ONLYICON: 'ONLYICON',
        CIRCLE: 'CIRCLE'
    };
    Button.ICON = {
        SEARCH: 'fa-search',
        SEND: 'fa-send',
        SAVE: 'fa-save',
        DELETE: 'fa-trash-o',
        CLOSE: 'fa-times'
    };
    Button.THEME = {
        DEFAULT: "btn-default",
        PRIMARY: "btn-primary",
        SUCCESS: "btn-success",
        INFO: "btn-info",
        WARNING: "btn-warning",
        DANGER: "btn-danger"
    };
    /* default mapping text & icon
    *  Using in Gridcrud
     */
    Button.VALUE = {
        NEW: "new",
        MODIFY: "modify",
        DELETE: "delete",
        SEARCH: "search",
        CONFIRM: 'confirm',
        CLOSE: 'close',
        // toolbar
        EDIT: 'edit',
        PLUS: 'plus',
        MINUS: 'minus',
        SEARCH: 'search',
        CLONE: 'clone',
        EXCEL: 'file-excel-o',
        UPLOAD: 'upload',
        EYE: 'eye',

        SELECT_ALL: 'ALL',
        SELECT_NONE: 'NONE'

    };

    return Button;
});