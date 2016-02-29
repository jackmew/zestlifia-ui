/**
 * Created by jackho on 2/16/16.
 *
 *
 SIDE:
 <div data-uw-anchor="anchor8" class="required">
     <label class="control-label col-sm-1">發現者</label>
     <div class="col-sm-3">
         <div class="input-group">
             <input type="text" class="form-control" placeholder="" value="">
             <span class="input-group-btn">
                 <button class="btn btn-default" type="button">
                    <i class="fa fa-search" style="font-size:18px; color:steelblue;"></i>
                 </button>
             </span>
         </div>
     </div>
 </div>

 NORMAL:
 <div data-uw-anchor="anchor8">
     <label class="control-label col-sm-2"></label>
     <div class="col-sm-3">
         <button type="button" class="btn btn-default">
            <i value="bad" class="fa fa-search" style="font-size:18px; color:steelblue;"></i>
         </button>
     </div>
 </div>

 SEARCH:
 <div data-uw-anchor="anchor8">
     <label class="control-label col-sm-2"></label>
     <div class="col-sm-3">
         <button type="button" class="fa fa-search btn btn-default"></button>
     </div>
 </div>

 event: spark
 */
define(['underscore', 'jquery', 'uweaver/lang', 'widget/Field', 'widget/Modal',
    'uweaver/Logger'], function (_, $, lang, Field, Modal, Logger) {

    var LOGGER = new Logger("widget/InputButton");

    var declare = lang.declare;

    var Base = Field;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            isRequired: false,       // inputWrapper
            //caption: undefined,    // label
            mode: InputButton.MODE.NORMAL,
            isTrigger: true
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $btn: undefined,
            $i: undefined,      //MODE: NORMAL & SIDE
            $input: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };

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

        a.$btn = $('<button/>');
        a.$btn.addClass('btn');
        a.$btn.addClass('btn-default');
        a.$btn.prop('type', 'button');


        a.$btn.css('color', 'steelblue');
        a.$inputWrapper.append(a.$btn);

        if(cfg.mode === InputButton.MODE.SEARCH) {
            a.$btn.addClass('fa');
            a.$btn.addClass("fa-search");

            var $title = $('<span/>');
            $title.text('查詢');
            $title.css('margin-left', '5px');
            a.$btn.append($title);

        } else if(cfg.mode === InputButton.MODE.NORMAL) {
            addIcon.call(this);
        } else if(cfg.mode === InputButton.MODE.SIDE) {
            addIcon.call(this);

            a.$input = $("<input/>");
            a.$input.prop("type", "text");
            a.$input.addClass("form-control");

            var $inputGroup = $('<div/>');
            $inputGroup.addClass('input-group');

            var $groupBtn = $('<span/>');
            $groupBtn.addClass('input-group-btn');
            $groupBtn.append(a.$btn);

            $inputGroup.append(a.$input);
            $inputGroup.append($groupBtn);

            a.$inputWrapper.append($inputGroup);

            cfg.isRequired && this.setIsRequired();

            this._modal = new Modal({
                title: cfg.caption
            }).render();
        }

        cfg.isTrigger && a.$btn.on('click', _.bind(click, this));

    }
    function addIcon() {
        var a = this._anchors;
        a.$i = $('<i/>');
        a.$i.css('font-size', '18px');
        a.$i.addClass('fa');
        a.$i.addClass("fa-search");
        a.$btn.append(a.$i);
    }
    function click() {
        var mode = this._cfg.mode;
        var value ;
        if(mode === InputButton.MODE.SIDE) {
            value = this.value();
        } else {
            value = 'search';
        }

        var event = {
            context: this,
            source: this,
            data: {
                value: value
            }
        };
        LOGGER.debug('InputButton click - mode: ${0}, value: ${1}', mode, value);

        this.trigger("search", event);
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

    var props = {
        _class: 'InputButton',
        _modal: undefined
    };

    var InputButton = declare(Base, {
        initialize: initialize,
        render: render,

        value: value,
        name: name
    }, props);

    InputButton.MODE = {
        NORMAL: "NORMAL",
        SIDE: "SIDE",
        SEARCH: "SEARCH"
    };


    return InputButton;
});