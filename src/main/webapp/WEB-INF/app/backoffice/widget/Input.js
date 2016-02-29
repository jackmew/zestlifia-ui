/**
 * Created by jackho on 2/2/16.
 *
 * 1.text
     <div data-uw-anchor="anchor1" class="required">
         <label class="control-label col-sm-1 ">客訴單號</label>
         <div class="col-sm-3">
            <input type="text" class="form-control"/>
         </div>
     </div>
   2.date
     <div data-uw-anchor="anchor2" class="required">
         <label class="control-label col-sm-1">客訴日期</label>
         <div class="col-sm-3">
            <input type="date" class="form-control" name="issueDate">
         </div>
     </div>
   3.number
     <div data-uw-anchor="anchor3" class="required">
         <label class="control-label col-sm-1">數量</label>
         <div class="col-sm-3">
            <input type="number" class="form-control" name="amount">
         </div>
     </div>
 *
 */
define(['underscore', 'jquery', 'uweaver/lang', 'widget/Field',
    'uweaver/Logger'], function (_, $, lang, Field, Logger) {

    var LOGGER = new Logger("widget/Input");

    var declare = lang.declare;

    var Base = Field;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            type: Input.TYPE.TEXT,
            isRequired: false,     // inputWrapper
            value: undefined,      // input
            name: undefined,       // input
            isReadonly: false,       // input
            caption: undefined     // label
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $input: undefined
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

        a.$input = $("<input/>");
        a.$input.prop("type", cfg.type);
        a.$input.addClass("form-control");

        cfg.isReadonly && readonly.call(this, true);

        a.$inputWrapper.append(a.$input);

        value.call(this, cfg.value);
        name.call(this, cfg.name);

        cfg.isRequired && this.setIsRequired();
        this.setId(cfg.type);
    }
    /**
     * set/get input value
     * */
    function value(value) {
        var a = this._anchors ;
        var $input = a.$input;
        if(value===undefined) return $input.prop('value') || $input.attr('value');
        $input.prop('value', value);
    }

    /*
    * set/get input name
    * */
    function name(name) {
        var a = this._anchors ;
        var $input = a.$input;
        if(name===undefined) return $input.prop('name');
        $input.prop('name', name);
    }

    function readonly(isReadonly) {
        var a = this._anchors ;
        var $input = a.$input;
        if(_.isUndefined(isReadonly)) {
            return $input.attr('readonly');
        }
        $input.attr('readonly', isReadonly);
    }

    var props = {
        _anchors: undefined,
        _class: 'Input'
    };

    var Input = declare(Base, {
        initialize: initialize,
        render: render,

        value: value,
        name: name,
        readonly: readonly
    }, props);

    Input.TYPE = {
        TEXT: "text",
        DATE: "date",
        NUMBER: "number"
    };

    return Input;
});