/**
 * Created by jackho on 2/4/16.
 *
 * CRBox : 1.CheckBox 2.Radio
 *
 *
 // radio & inline
 <div data-uw-anchor="anchor5" class="required">
     <label class="control-label col-sm-1">符合HSF產品</label>
     <div class="col-sm-3">
         <div class="radio-inline">
             <label>
                 <input type="radio" name="isHSF" value="Y">
                 <span>是</span>
             </label>
         </div>
         <div class="radio-inline">
             <label>
                 <input type="radio" name="isHSF" value="N">
                 <span>否</span>
             </label>
         </div>
     </div>
 </div>
 // checkbox & horizontal
 <div data-uw-anchor="anchor6" class="required">
     <label class="control-label col-sm-1">臨時措施</label>
     <div class="col-sm-3">
         <div class="checkbox">
             <label>
                 <input type="checkbox" name="solution" value="option1">
                 <span>更換原料</span>
             </label>
         </div>
         <div class="checkbox">
             <label>
                 <input type="checkbox" name="solution" value="option2">
                 <span>通知品保判定</span>
             </label>
         </div>
         <div class="checkbox">
             <label>
                 <input type="checkbox" name="solution" value="option3">
                 <span>開立異常單</span>
             </label>
             </div>
         <div class="checkbox">
             <label>
                 <input type="checkbox" name="solution" value="option3">
                 <span>截取異常樣品</span>
             </label>
         </div>
     </div>
 </div>
 */
define(['underscore', 'jquery', 'uweaver/lang', 'widget/Field',
    'uweaver/Logger'], function (_, $, lang, Field, Logger) {

    var LOGGER = new Logger("widget/CRBox");

    var declare = lang.declare;

    var Base = Field;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            type: CRBox.TYPE.RADIO,
            layout: CRBox.LAYOUT.INLINE,
            isRequired: false, // inputWrapper
            // necessary
            caption: undefined,       // label
            name: _.uniqueId(),    // input checkbox or radio
            options: [             // real values
                //{text: "", value: ""}
            ],
            isTrigger: true
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            //$label: undefined,
            //$inputWrapper: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        build.call(this);
        cfg.caption || this.isCaption(false);
        setEvents.call(this);

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
        var cfg = this._cfg ;

        cfg.isRequired && this.setIsRequired();
        setOptions.call(this, cfg.options);
    }
    function setEvents() {
        var cfg = this._cfg;
        var isTrigger = cfg.isTrigger;
        if(!isTrigger) {
            return ;
        }
        var name = cfg.name ;
        this.$el.find('input[name="'+name+'"]').on('change', _.bind(onTrigger, this));
    }
    function onTrigger(evt) {
        //if(!this.value()) {
        //    throw new NotEmptyConflictException({
        //        entity: this,
        //        property: 'value'
        //    });
        //}

        var event = {
            context: this,
            source: this,
            data: {
                value: this.getValue(),
                name: this._cfg.name
            }
        };

        this.trigger("valueChange", event);
    }
    /*
    * 1. radio: 回傳string
    * 2. check: 回傳string array
    * */
    function getValue() {
        var type = this._cfg.type;
        var name = this._cfg.name ;

        if(type === CRBox.TYPE.RADIO) {
            return this.$el.find('input[name="'+name+'"]:checked').val();

        } else {
            var values = [] ;

            var checkeds = this.$el.find('input[name="'+name+'"]:checked');
            _.each(checkeds, function(checked) {
                values.push($(checked).val());
            });
            return values;
        }
    }
    /*
    * 塞入選項
    * */
    function setOptions(options) {
        var cfg = this._cfg ;
        var type = cfg.type ;
        var layout = cfg.layout ;
        var name = cfg.name ;
        var a = this._anchors ;

        this.clear();

        _.each(options, function(option) {

            var $input = $('<input/>');
            $input.prop('name', name);
            $input.prop('checked', option.checked);
            option.value && $input.prop('value', option.value);

            var $inputContainer = $('<div/>');
            if(type === CRBox.TYPE.RADIO) {
                $input.prop("type", cfg.type);

                if(layout === CRBox.LAYOUT.INLINE) {
                    $inputContainer.addClass('radio-inline');
                } else {
                    $inputContainer.addClass('radio')
                }
                // CRBox.TYPE.CHECK
            } else {
                $input.prop("type", cfg.type);
                if(layout === CRBox.LAYOUT.INLINE) {
                    $inputContainer.addClass('checkbox-inline');
                } else {
                    $inputContainer.addClass('checkbox');
                }
            }
            var $labelWrapper = $('<label/>');
            var $option = $('<span/>');
            $option.css('white-space', 'nowrap');
            option.text &&  $option.text(option.text);


            $labelWrapper.append($input);
            $labelWrapper.append($option);
            $inputContainer.append($labelWrapper);
            a.$inputWrapper.append($inputContainer);
        });
    }
    function value(options) {

        if(options===undefined) {
            return getValue.call(this);
        } else {
            setOptions.call(this, options);
        }
    }
    /*
    * 取消所有checked
    * */
    function reset() {
        $.each(this.$el.find('input'), function(index, value) {
            $(value).prop('checked', false);
        });
    }
    /*
    * 清除所有選項
    * */
    function clear() {
        var a = this._anchors ;
        a.$inputWrapper.children().remove();
    }
    /*
    * check特定value的CRBox
    * */
    function check(value) {
        this.$el.find('input[value="'+value+'"]').prop('checked', true).trigger('change');
    }
    function checks(valueArr) {
        _.each(valueArr, function(value) {
            check(value);
        });
    }
    var props = {
        _class: 'CRBox'
    };

    var CRBox = declare(Base, {
        initialize: initialize,
        render: render,

        getValue: getValue,
        setOptions: setOptions,
        value: value,

        check: check,
        checks: checks,
        reset: reset,
        clear: clear
    }, props);

    CRBox.TYPE = {
        CHECK: "checkbox",
        RADIO: "radio"
    };
    CRBox.LAYOUT = {
        HORIZONTAL: "horizontal",
        INLINE: "inline"
    };

    return CRBox;
});