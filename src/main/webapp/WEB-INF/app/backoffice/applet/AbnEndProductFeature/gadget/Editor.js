/**
 * Created by jackho on 1/6/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Popup',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', 'uweaver/widget/Widget', '../../../util/FieldUtil',
    'widget/Commandbar', 'widget/Dropdown', 'widget/Button',
    './widget/StrategyAnalysis', './widget/CauseAnalysis', './widget/Signoff',
    'text!../tpl/Editor.html', 'text!widget/tpl/TabPanel.html', 'text!../tpl/RelationalNoPopup.html',
    'text!../tpl/widget/ManageUnit.html', 'text!../tpl/widget/PersonInCharge.html', 'text!../tpl/widget/RecordInvest.html', 'text!../tpl/widget/ConfirmInvest.html',
    'text!../tpl/widget/QualityFirst.html', 'text!../tpl/widget/QualitySecond.html', 'text!../tpl/widget/QualityHighest.html', './widget/SignoffRecord',
    './widget/FeatureInfo', './widget/FeatureStatus', 'view/Attachment',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Popup, Collection, TabPanel, Widget, FieldUtil,
                                Commandbar, Dropdown, Button,
                                StrategyAnalysis, CauseAnalysis, Signoff,
                                tpl, tabPanelEditorTpl, relationalNoPopupTpl,
                                manageUnitTpl, personInChargeTpl, recordInvestTpl, confirmInvestTpl,
                                qualityFirstTpl, qualitySecondTpl, qualityHighestTpl, SignoffRecord,
                                FeatureInfo, FeatureStatus, Attachment, Logger) {

    var LOGGER = new Logger("EndProductAbnormalApply/gadget/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: Editor.MODE.NEW,
            title: i18n.translate("新增申請")
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {

            $tabPanel: undefined,
            $sideBtn: undefined,
            $toolbar: undefined,
            $abnNo: undefined,
            $createDate: undefined,
            $abnWorkAttribute: undefined,
            $createArea: undefined,
            $actions: undefined
        };

        this._title = this._cfg.title;
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildEditor.call(this);
        buildTabPanel.call(this);
        buildActions.call(this);

        setMode.call(this);
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
    function setMode() {
        var mode = this._cfg.mode ;
        
        if(mode === Editor.MODE.NEW) {

        } else if(mode === Editor.MODE.DRAFT) {
            this._dd.getAction(Dropdown.ACTION.DELETE).show();
        } else if(mode == Editor.MODE.INBOX_TWO) {
            addManagementUnit.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('manageUnit'), true);
        } else if(mode == Editor.MODE.INBOX_THREE) {
            addPersonInCharge.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('gridAbn'), true);
        } else if(mode == Editor.MODE.INBOX_FOUR) {
            addRecordInvest.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$el, true);
            FieldUtil.setIsEditable(this._causeAnalysis.$el, true);
            FieldUtil.setIsEditable(this._strategyAnalysis.$el, true);
        } else if(mode == Editor.MODE.INBOX_FIVE) {
            addConfirmInvest.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

        } else if(mode == Editor.MODE.INBOX_SIX) {
            addQualityFirst.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signOffContainer'), true);
        } else if(mode == Editor.MODE.INBOX_SEVEN) {
            addQualitySecond.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signOffContainer'), true);
        } else if(mode == Editor.MODE.INBOX_EIGHT) {
            addQualityHighest.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signOffContainer'), true);
        } else if(mode === Editor.MODE.MGNT_ENDPRODUCT) {
            addMgntEndProduct.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION) {
            addNotification.call(this);
            this._cmd.hide();
        } else if(mode === Editor.MODE.ABNENDPRODUCT_EFFECT) {
            this._btnSend.hide();
        }
    }
    function buildActions() {
        this._cmd = new Commandbar().render();

        this._btnSend = new Button({
            text: '送出',
            value: 'send',
            icon: 'fa-send-o'
        }).render();
        this._cmd.add(this._btnSend);

        this._dd = new Dropdown({
            title: '其他'
        }).render();
        this._dd.addAction(Dropdown.ACTION.SAVE);
        this._dd.addAction(Dropdown.ACTION.DELETE).hide();
        this._dd.addAction(Dropdown.ACTION.CLOSE);
        this._cmd.add(this._dd);

        this._cmd.attach(this.$el);
    }
    function buildEditor() {
        var $isMerge = this.$anchor('isMerge').show();
        var $mergeNo = this.$anchor('mergeNo');

        $isMerge.find('input[type="radio"]').on('change', function(evt) {
            var value = $isMerge.find('input[type="radio"]:checked').val();
            if(value === 'Y') {
                $mergeNo.show();
            } else {
                $mergeNo.hide();
            }

        })
    }
    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanel = this.$anchor('tabPanel');

        this._tabPanelEditor = new TabPanel({
            el: anchors.$tabPanel,
            tpl: tabPanelEditorTpl
        }).render();

        this._attachment = new Attachment().render();
        this._tabPanelEditor.add(this._attachment, {
            title: '相關附件'
        });

        this._featureStatus = new FeatureStatus().render();
        this._tabPanelEditor.add(this._featureStatus, {
            index: 0,
            title: '異常情形'
        });

        this._featureInfo = new FeatureInfo().render();
        this._tabPanelEditor.add(this._featureInfo, {
            index: 0,
            title: '異常資料'
        });

        LOGGER.debug("buildTabPanel done");
    }

    function onTabPanelSelect(evt) {
        var currentWidget = evt.data;
        if(currentWidget === this._signOff) {
            this._cmd.show();
            this._btnSend.show();
        } else {
            this._cmd.hide();
        }
        if(currentWidget === this._strategyAnalysis || currentWidget === this._causeAnalysis) {
            this._cmd.show();
            this._btnSend.hide();
        }
    }
    function onIsResultSelectChange(evt) {
        var value = this._tabPanelEditor.$('input[name="isResult"]:checked').val();
        LOGGER.debug("onIsResultSelectChange: ${0}", value);

        var $backLevel = this._tabPanelEditor.$anchor('backLevel');
        if(value == "BACK") {
            $backLevel.show();
        } else {
            $backLevel.hide();
        }

    }
    function addTabSignOffRecord(index) {
        var signoffTitle = "簽核紀錄";
        this._signoffRecord = new SignoffRecord().render();
        this._tabPanelEditor.add(this._signoffRecord, {
            title: signoffTitle,
            index: index
        });
    }
    function addTabStrategyAnalysis(index) {
        var strategyAnalysisTitle = "對策分析";
        this._strategyAnalysis = new StrategyAnalysis({
            mode: 'INBOX'
        }).render();
        this._strategyAnalysis.setTitle(strategyAnalysisTitle);
        this._tabPanelEditor.add(this._strategyAnalysis, {
            title: strategyAnalysisTitle,
            index: index
        });
    }
    function addTabCauseAnalysis(index) {
        var causeAnalysisTitle = "原因分析";
        this._causeAnalysis = new CauseAnalysis().render();
        this._causeAnalysis.setTitle(causeAnalysisTitle);
        this._tabPanelEditor.add(this._causeAnalysis, {
            title: causeAnalysisTitle,
            index: index
        });
    }
    function addTabSignOffCustom(tpl, index) {
        this._signOff = new Widget({
            tpl: tpl
        }).render();

        this._tabPanelEditor.add(this._signOff, {
            title: "簽核",
            index: index
        });
    }
    function addTabSignOff(index, mode) {
        var signoffTitle = "簽核";
        this._signOff = new Signoff({
            mode: mode
        }).render();
        this._signOff.setTitle(signoffTitle);
        this._tabPanelEditor.add(this._signOff, {
            title: signoffTitle,
            index: index
        });
    }
    // 成品-2 品保主管
    function addManagementUnit() {
        addTabSignOffRecord.call(this, 0);
        addTabSignOffCustom.call(this, manageUnitTpl, 0);
        this._title = i18n.translate("成品(特性)-2 品保主管");
    }
    // 成品-3 處理單位主管
    function addPersonInCharge() {
        addTabSignOffRecord.call(this, 0);
        addTabSignOffCustom.call(this, personInChargeTpl, 0);
        this._title = i18n.translate("成品(特性)-3 處理單位主管");
    }
    // 成品-4 處理單位人員
    function addRecordInvest() {
        addTabStrategyAnalysis.call(this, 0);
        addTabCauseAnalysis.call(this, 0);
        addTabSignOffRecord.call(this, 0);
        addTabSignOff.call(this, 0);

        this._title = i18n.translate("成品(特性)-4 處理單位人員");
    }
    // 成品-5 處理單位主管
    function addConfirmInvest() {
        addTabStrategyAnalysis.call(this, 0);
        addTabCauseAnalysis.call(this, 0);
        addTabSignOffRecord.call(this, 0);
        addTabSignOff.call(this, 0);
        this._title = i18n.translate("成品(特性)-5 處理單位主管");
    }
    // 成品-6 品保PQC
    function addQualityFirst() {
        addTabStrategyAnalysis.call(this, 0);
        addTabCauseAnalysis.call(this, 0);
        addTabSignOffRecord.call(this, 0);
        addTabSignOff.call(this, 0);
        this._title = i18n.translate("成品(特性)-6 品保PQC");
        // radio change
        this._tabPanelEditor.$('input[name="isResult"]').on('change', _.bind(onIsResultSelectChange, this));
    }
    // 成品-7 品保主管
    function addQualitySecond() {
        var mode = this._cfg.mode ;
        addTabStrategyAnalysis.call(this, 0);
        addTabCauseAnalysis.call(this, 0);
        addTabSignOffRecord.call(this, 0);
        addTabSignOff.call(this, 0, mode);
        this._title = i18n.translate("成品(特性)-7 品保主管");
    }
    // 成品-8 品保最高主管
    function addQualityHighest() {
        addTabStrategyAnalysis.call(this, 0);
        addTabCauseAnalysis.call(this, 0);
        addTabSignOffRecord.call(this, 0);
        addTabSignOff.call(this, 0);
        this._title = i18n.translate("成品(特性)-8 品保最高主管");
    }
    // 管理異常申請 -> 成品外觀 || 成品特性
    function addMgntEndProduct() {
        addTabCauseAnalysis.call(this);
        addTabStrategyAnalysis.call(this);
        addTabSignOffRecord.call(this);
        this._tabPanelEditor.select(0);
        FieldUtil.setIsEditable(this.$el, false);
    }
    // MyNotification
    function addNotification() {
        addTabCauseAnalysis.call(this);
        addTabStrategyAnalysis.call(this);
        addTabSignOffRecord.call(this);
        this._tabPanelEditor.select(0);
        FieldUtil.setIsEditable(this.$el, false);
    }

    function setValues() {
        this._anchors.$abnNo = this.$anchor('abnNo');
        this._anchors.$abnNo.val("T12016010005");
        this._anchors.$abnNo.prop('readonly', false);

        this._anchors.$createDate = this.$anchor('createDate');
        this._anchors.$createDate.val('2016-01-02');
        this._anchors.$createDate.prop('readonly', false);

        this._anchors.$abnWorkAttribute = this.$anchor('abnWorkAttribute');
        this._anchors.$abnWorkAttribute.children().each(function() {
            if($(this).text() == "PQC") {
                $(this).attr("selected", "selected");
            }
        });
        this._anchors.$abnWorkAttribute.prop('readonly', false);

        this._anchors.$createArea = this.$anchor('createArea');
        this._anchors.$createArea.children().each(function() {
            if($(this).text() == "台灣地區") {
                $(this).attr("selected", "selected");
            }
        });
        this._anchors.$createArea.prop('readonly', false);
    }
    function setEvents() {
        var mode = this._cfg.mode;
        if(isInbox(mode)) {
            this._tabPanelEditor.on('select', _.bind(onTabPanelSelect, this));
        }
    }
    function getTabPanelEditor() {
        return this._tabPanelEditor;
    }
    function isInbox(mode) {
        return (mode.indexOf('INBOX') > -1);
    }

    var props = {
        _anchors: undefined,
        _tabPanelEditor: undefined,
        // tabs - new
        _attachment: undefined,
        _featureStatus: undefined,
        _featureInfo: undefined,
        // tabs - inbox
        _signOff: undefined,
        _signoffRecord: undefined,
        _strategyAnalysis: undefined,
        _causeAnalysis: undefined,


        _relationalNoPopup: undefined,
        _toolbarPlusPopup: undefined,

        // actions
        _cmd: undefined,
        _btnSend: undefined,
        _dd: undefined
    };


    var Editor = declare(Base, {
        initialize: initialize,
        render: render,
        setValues: setValues,
        getTabPanelEditor: getTabPanelEditor
    }, props);

    // Enumeration of build in commands
    Editor.MODE = {
        NEW: "NEW",
        DRAFT: "DRAFT",

        MGNT_ENDPRODUCT: "MGNT_ENDPRODUCT", //從 異常作業-管理異常申請 進入
        ABNENDPRODUCT_EFFECT: "ABNENDPRODUCT_EFFECT", //從 成品異常效果確認 進入

        NOTIFICATION: "NOTIFICATION",

        INBOX_TWO: "INBOX_TWO",
        INBOX_THREE: "INBOX_THREE",
        INBOX_FOUR: "INBOX_FOUR",
        INBOX_FIVE: "INBOX_FIVE",
        INBOX_SIX: "INBOX_SIX",
        INBOX_SEVEN: "INBOX_SEVEN",
        INBOX_EIGHT: "INBOX_EIGHT"
    };

    return Editor;
});