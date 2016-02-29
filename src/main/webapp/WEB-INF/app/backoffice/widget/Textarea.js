/**
 * Created by jackho on 2/16/16.
 *
 <div data-uw-anchor="anchor7" class="required">
     <label class="control-label col-sm-1">備註</label>
     <div class="col-sm-3">
        <textarea class="form-control" rows="5"></textarea>
     </div>
 </div>
 */
define(['underscore', 'jquery', 'uweaver/lang', 'widget/Field',
    'uweaver/Logger'], function (_, $, lang, Field, Logger) {

    var LOGGER = new Logger("widget/Textarea");

    var declare = lang.declare;

    var Base = Field;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            isRequired: false,     // inputWrapper
            value: undefined,      // input
            caption: undefined     // label
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $area: undefined
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

        a.$area = $("<Textarea/>");
        a.$area.addClass("form-control");
        rows.call(this, 5);
        a.$inputWrapper.append(a.$area);

        value.call(this, cfg.value);

        cfg.isRequired && this.setIsRequired();
        this.setId("Textarea");
    }
    function rows(no) {
        var a = this._anchors;
        if(_.isUndefined(no)) {
            return a.$area.prop('rows');
        }
        a.$area.prop('rows', no);
    }
    /**
     * set/get input value
     * */
    function value(value) {
        var a = this._anchors ;
        var $area = a.$area;
        if(value===undefined) return $area.prop('value') || $area.attr('value');
        $area.prop('value', value);
    }

    var props = {
        _class: 'Textarea'
    };

    var Textarea = declare(Base, {
        initialize: initialize,
        render: render,

        value: value,
        rows: rows
    }, props);

    return Textarea;
});