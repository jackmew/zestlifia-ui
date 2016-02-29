/**
 * Created by jackho on 2/15/16.
 *
 作為框
 <div data-uw-anchor="anchor4" class="required">
     <label class="control-label col-sm-1">填單人</label>
     <div class="col-sm-3">

     </div>
 </div>
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Widget',
    'uweaver/Logger'], function (_, $, lang, Widget, Logger) {

    var LOGGER = new Logger("widget/Field");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            isRequired: false, // inputWrapper
            caption: "",// label
            className: []      // root
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $label: undefined,
            $inputWrapper: undefined
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

        buildFrame.call(this);
        setClasses.call(this);


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
    function buildFrame() {
        var a = this._anchors;
        var cfg = this._cfg;
        a.$label = $('<label/>');
        a.$label.addClass("control-label col-sm-1");
        this.$el.append(a.$label);

        a.$inputWrapper = $("<div/>");
        a.$inputWrapper.addClass("col-sm-3");
        this.$el.append(a.$inputWrapper);

        caption.call(this, cfg.caption);
    }

    function setClasses() {
        var context = this ;
        var classNames = this._cfg.className;
        _.each(classNames, function(className) {
            context.addClass(className);
        });
    }
    /*
     * set/get label caption
     * */
    function caption(title) {
        var a = this._anchors;

        if(_.isUndefined(title)) {
            return a.$label.text();
        }
        a.$label.text(title);
    }
    function isCaption(isCaption) {
        this.$el.find('.control-label').remove();
    }
    function setLabelCol(index) {
        var a = this._anchors;
        a.$label.removeClass('col-sm-1');
        a.$label.addClass('col-sm-'+index);
    }
    function setInputCol(index) {
        var a = this._anchors;
        a.$inputWrapper.removeClass('col-sm-3');
        a.$inputWrapper.addClass('col-sm-'+index);
    }
    function setIsRequired(isRequired) {
        if(_.isUndefined(isRequired)) {
            isRequired = this._cfg.isRequired;
        }
        if(isRequired) {
            this.$el.addClass('required');
        } else {
            this.$el.removeClass('required');
        }
    }
    function setId(param) {
        var a = this._anchors ;

        var id = this.prop("id");
        param && (id = param+"-"+id);
        this.$el.removeAttr("id");

        a.$label.prop('for',id);

        var element = "input";
        if(param === "select" || param === "textarea") {
            element = param;
        }
        a.$inputWrapper.find(element).prop('id', id);
    }
    var props = {
        _anchors: undefined,
        tagName: 'div'
    };

    var Field = declare(Base, {
        initialize: initialize,
        render: render,

        caption: caption,
        isCaption: isCaption,

        setIsRequired: setIsRequired,
        setLabelCol: setLabelCol,
        setInputCol: setInputCol,
        setId: setId

    }, props);

    return Field;
});