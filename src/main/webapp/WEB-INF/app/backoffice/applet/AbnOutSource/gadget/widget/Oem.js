/**
 * Created by jackho on 1/21/16.
 *
 * Oem: Original Equipment Manufacturer
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/Oem.html', 'applet/AbnOutSource/gadget/Editor', '../../../../util/FieldUtil',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, Logger) {

    var LOGGER = new Logger("AbnOutSource/gadget/widget/Oem");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $factoryReport: undefined
        };

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$factoryReport = this.$anchor('factoryReport');


        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        setMode.call(this);

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
    function setMode() {
        var mode = this._cfg.mode ;
        var a = this._anchors;

        if(mode === Oem.MODE.INBOX_SIX) {

        } else if(mode === Oem.MODE.INBOX_SEVEN) {
            a.$factoryReport.parent().hide();
            FieldUtil.setIsEditable(this.$el, false);
        } else if(mode === Oem.MODE.INBOX_EIGHT) {
            a.$factoryReport.parent().hide();
            FieldUtil.setIsEditable(this.$el, false);
        }
    }
    function setTitle(title) {
        this._title = title ;
    }
    function getTitle(title) {
        return this._title;
    }
    var props = {
        _anchors: undefined
    };

    var Oem = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    Oem.MODE = {
        INBOX_SIX: "INBOX_SIX",
        INBOX_SEVEN: "INBOX_SEVEN",
        INBOX_EIGHT: "INBOX_EIGHT"
    };

    return Oem;
});