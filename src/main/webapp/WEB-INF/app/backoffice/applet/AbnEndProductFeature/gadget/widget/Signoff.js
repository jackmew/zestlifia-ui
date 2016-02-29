/**
 * Created by jackho on 1/15/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    'text!../../tpl/widget/Signoff.html', 'text!../../tpl/widget/PopupPlus.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, popupPlusTpl, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/Signoff");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: Signoff.MODE.NEW
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $doc: undefined,
            $docNo: undefined,
            $reason: undefined,

            $fmea: undefined,
            $docFmeaNo: undefined,
            $reasonFmea: undefined,

            $signoffResult: undefined,
            $signoffComment: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$doc = this.$anchor('doc');
        anchors.$docNo = this.$anchor('docNo');
        anchors.$reason = this.$anchor('reason');

        anchors.$fmea = this.$anchor('fmea');
        anchors.$docFmeaNo = this.$anchor('docFmeaNo');
        anchors.$reasonFmea = this.$anchor('reasonFmea');

        anchors.$signoffResult = this.$anchor('signoffResult');
        anchors.$signoffComment = this.$anchor('signoffComment');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        anchors.$doc.find('input[name="isDoc"]').on('change', _.bind(onRadioDocChange, this));
        anchors.$fmea.find('input[name="isFmea"]').on('change', _.bind(onRadioFmeaChange, this));

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        setMode.call(this);

        return this;
    }
    function setMode() {
        var mode = this._cfg.mode ;
        if(mode === Signoff.MODE.EFFECTCONFIRM) {
            var $signOffContainer = this.$anchor('signOffContainer');
            $signOffContainer.hide();

            var $effectConfirmContainer = this.$anchor('effectConfirmContainer');
            $effectConfirmContainer.show();

            var $doc = this.$anchor('doc');
            FieldUtil.setIsEditable($doc, false);

            var $fmea = this.$anchor('fmea');
            FieldUtil.setIsEditable($fmea, false);
        } else if(mode === Signoff.MODE.INBOX_SEVEN) {
            var $signOffTransfer = this.$anchor('signOffTransfer');
            $signOffTransfer.css('display','inline-block');
        }
    }
    function onRadioDocChange(evt) {
        var value = this._anchors.$doc.find('input[name="isDoc"]:checked').val();
        LOGGER.debug("onRadioDocChange: ${0}", value);
        if(value === "Y") {
            this._anchors.$docNo.show();
            this._anchors.$reason.hide();
        } else {
            this._anchors.$docNo.hide();
            this._anchors.$reason.show();
        }

    }
    function onRadioFmeaChange(evt) {
        var value = this._anchors.$fmea.find('input[name="isFmea"]:checked').val();
        LOGGER.debug("onRadioFmeaChange: ${0}", value);
        if(value === "Y") {
            this._anchors.$docFmeaNo.show();
            this._anchors.$reasonFmea.hide();
        } else {
            this._anchors.$docFmeaNo.hide();
            this._anchors.$reasonFmea.show();
        }
    }
    function setTitle(title) {
        this._title = title ;
    }
    function getTitle(title) {
        return this._title;
    }
    var props = {
        _anchors: undefined,
        _title: undefined
    };

    var Signoff = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    Signoff.MODE = {
        NEW: "NEW",
        EFFECTCONFIRM: "EFFECTCONFIRM",
        INBOX_SEVEN: "INBOX_SEVEN"
    };

    return Signoff;
});