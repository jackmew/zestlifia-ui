/**
 * Created by jackho on 1/21/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/SignOff.html', '../Editor', '../../../../util/FieldUtil',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, Logger) {

    var LOGGER = new Logger("AbnOutSource/gadget/widget/SignOff");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $realReportDate: undefined,
            $signoffResult: undefined,
            $signoffComment: undefined
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
        anchors.$realReportDate = this.$anchor('realReportDate');
        anchors.$processMode = this.$anchor('processMode');
        anchors.$explanation = this.$anchor('explanation');

        anchors.$signoffResult = this.$anchor('signoffResult');
        anchors.$signoffComment = this.$anchor('signoffComment');

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
        var anchors = this._anchors;
        var mode = this._cfg.mode ;
        //var editor = new Editor();
        if(mode === SignOff.MODE.INBOX_TWO) {
            anchors.$realReportDate.show();
        } else if(mode === SignOff.MODE.INBOX_THREE) {
            anchors.$realReportDate.show();
            FieldUtil.setIsEditable(anchors.$realReportDate, false);
        } else if(mode === SignOff.MODE.INBOX_FOUR) {
            anchors.$realReportDate.show();
            FieldUtil.setIsEditable(anchors.$realReportDate, false);

            anchors.$processMode.show();
            setProcessMode.call(this);
        } else if(mode === SignOff.MODE.INBOX_FIVE) {
            anchors.$realReportDate.show();
            FieldUtil.setIsEditable(anchors.$realReportDate, false);

            anchors.$processMode.show();
            setProcessMode.call(this);
            FieldUtil.setIsEditable(anchors.$processMode, false);
        } else if(mode === SignOff.MODE.INBOX_SIX) {
            anchors.$realReportDate.hide();
        } else if(mode === SignOff.MODE.INBOX_SEVEN) {
            anchors.$realReportDate.hide();
        } else if(mode === SignOff.MODE.INBOX_EIGHT) {
            anchors.$realReportDate.hide();
        }
    }
    function setProcessMode() {
        var anchors = this._anchors;
        var $explanation = this.$anchor('explanation');

        anchors.$processMode.find('select').on('change', function(evt) {
            var value = anchors.$processMode.find('option:checked').val();
            if(value === 'other') {
                $explanation.show();
            } else {
                $explanation.hide();
            }
        });
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

    var SignOff = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    SignOff.MODE = {
        INBOX_TWO: "INBOX_TWO",
        INBOX_THREE: "INBOX_THREE",
        INBOX_FOUR: "INBOX_FOUR",
        INBOX_FIVE: "INBOX_FIVE",
        INBOX_SIX: "INBOX_SIX",
        INBOX_SEVEN: "INBOX_SEVEN",
        INBOX_EIGHT: "INBOX_EIGHT"
    };

    return SignOff;
});