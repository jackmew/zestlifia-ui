/**
 * Created by jackho on 2/15/16.
 *
 *
 <div data-uw-anchor="anchor4" class="required">
     <label class="control-label col-sm-1">填單人</label>
     <div class="col-sm-3">
         <select class="form-control">
             <option value="">X</option>
             <option value="">Y</option>
             <option value="">Z</option>
         </select>
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
            //isRequired: false, // inputWrapper
            caption: undefined,       // label,
            options: [             // real values
                //{text: "", value: ""}
            ],
            isTrigger: true
        };
        _.defaults(this._cfg, defaults);

        this._anchors.$select = undefined;
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
        var cfg = this._cfg;
        var a = this._anchors;
        var options = cfg.options;

        a.$select = $('<select/>');
        a.$select.addClass("form-control");

        this.setOptions(options);

        cfg.isRequired && this.setIsRequired();
        this.setId("select");
    }
    function setEvents() {
        var cfg = this._cfg;
        var isTrigger = cfg.isTrigger;
        if(!isTrigger) {
            return ;
        }
        this.$el.find('select').on('change', _.bind(onTrigger, this));
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
                value: this.value(),
                text: this.text()
            }
        };

        this.trigger("valueChange", event);
    }
    /*
     * 塞入選項
     * */
    function setOptions(options) {
        var a = this._anchors;

        this.clear();

        _.each(options, function(option) {
            var $opt = $('<option/>');
            $opt.val(option.value);
            $opt.text(option.text);
            a.$select.append($opt);
        });
        a.$inputWrapper.append(a.$select);
    }
    /*
     * 清除所有選項
     * */
    function clear() {
        var a = this._anchors ;
        a.$inputWrapper.find('option').remove();
    }
    /*
    * 取得selected value
    * */
    function value(value) {
        var a = this._anchors;
        if(value === undefined) {
            return a.$select.val();
        }
        a.$select.val(value);
    }
    /*
    * 取得selected text
    * */
    function text() {
        var a = this._anchors;
        return a.$select.find('option:selected').text();
    }


    var props = {
        _class: 'Select'
    };

    var Select = declare(Base, {
        initialize: initialize,
        render: render,

        value: value,
        text: text,
        setOptions: setOptions,
        clear: clear

    }, props);

    return Select;
});

