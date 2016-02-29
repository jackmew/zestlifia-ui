/**
 * Created by jackho on 1/15/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    'text!../../tpl/widget/Signoff.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/Signoff");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: Signoff.MODE.INBOX_NEW
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $analyzeSection: undefined,
            $specificSection: undefined,
            $clientVerifySection: undefined,
            $resultReset: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$organizeSection = this.$anchor('organizeSection');
        anchors.$analyzeSection = this.$anchor('analyzeSection');
        anchors.$specificSection = this.$anchor('specificSection');
        anchors.$clientVerifySection = this.$anchor('clientVerifySection');

        anchors.$resultReset = this.$anchor('resultReset');
        anchors.$responsibility = this.$anchor('responsibility');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

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
        var anchors = this._anchors;
        var mode = this._cfg.mode;
        if(mode === Signoff.MODE.INBOX_ORGANIZE) {
            anchors.$organizeSection.show();
            setOrganize.call(this);
        } else if(mode === Signoff.MODE.INBOX_ANALYZE) {
            anchors.$analyzeSection.show();
        } else if(mode === Signoff.MODE.INBOX_SPECIFIC) {
            anchors.$specificSection.show();
            FieldUtil.setIsEditable(anchors.$specificSection.find('table'), false);
        } else if(mode === Signoff.MODE.INBOX_CLIENTVERIFY) {
            setClientVerify.call(this);
        } else if(mode === Signoff.MODE.INBOX_EFFECTVERIFY) {
            anchors.$resultReset.css('display', 'inline-block');
            setEffectVerify.call(this);
        }
    }
    function setOrganize() {
        var anchors = this._anchors;
        anchors.$radioIsOrgPrjTeam = this.$anchor('isOrgPrjTeam');
        anchors.$tAManagementWay = this.$anchor('tAManagementWay');
        anchors.$divGridOrgProjTeam = this.$anchor('divGridOrgProjTeam');

        anchors.$radioIsOrgPrjTeam.on('change', _.bind(onIsOrgPrjTeamChange, this));

        this.show();
    }
    function onIsOrgPrjTeamChange(event) {
        event.preventDefault();
        var selectedValue = this.$("input[name='isOrgPrjTeam']:checked").val();
        LOGGER.debug("是否組織專案團隊: ${0}", selectedValue);


        if(selectedValue === 'N') {
            //showTAManagementWay
            this._anchors.$tAManagementWay.show();
            this._anchors.$divGridOrgProjTeam.hide();
        } else {
            //showGridProjectTeam
            this._anchors.$tAManagementWay.hide();
            this._anchors.$divGridOrgProjTeam.show();
        }
    }
    function setClientVerify() {
        var anchors = this._anchors;
        anchors.$clientVerifySection.show();
        var $radioIsVerify = this.$anchor('radioClientVerify').find('input[name="isVerify"]');

        $radioIsVerify.on('change', _.bind(function(evt) {
            var value = this.$anchor('radioClientVerify').find('input[name="isVerify"]:checked').val();
            LOGGER.debug("radioIsVerify value: ${0}",value);

            var $assistant = this.$anchor('assistant');
            var $clientVerifyCompleteDate = this.$anchor('clientVerifyCompleteDate');
            if(value === 'Y') {
                $assistant.show();
                $clientVerifyCompleteDate.show();
            } else {
                $assistant.hide();
                $clientVerifyCompleteDate.hide();
            }

        }, this));
    }
    function setEffectVerify() {
        var anchors = this._anchors;
        var $radioSignOffResultSection = this.$anchor('radioSignOffResult');
        var $radioSignOffResult = $radioSignOffResultSection.find('input[name="isResult"]');

        $radioSignOffResult.on('change', _.bind(function(evt){
            var value = $radioSignOffResultSection.find('input[name="isResult"]:checked').val();
            LOGGER.debug("radioIsVerify value: ${0}",value);

            if(value === 'RESET') {
                anchors.$responsibility.show();
            } else {
                anchors.$responsibility.hide();
            }
        }, true));
    }
    var props = {
        _anchors: undefined
    };

    var Signoff = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    Signoff.MODE = {
        INBOX_NEW: "INBOX_NEW",
        INBOX_ORGANIZE: "INBOX_ORGANIZE",
        INBOX_ANALYZE: "INBOX_ANALYZE",
        INBOX_SPECIFIC: "INBOX_SPECIFIC",
        INBOX_CLIENTVERIFY: "INBOX_CLIENTVERIFY",
        INBOX_INBOX_SENDSAMPLE: "INBOX_INBOX_SENDSAMPLE",
        INBOX_EFFECTVERIFY: "INBOX_EFFECTVERIFY"
    };

    return Signoff;
});