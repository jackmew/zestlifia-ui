/**
 * Created by jackho on 1/8/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Popup',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', '../../../util/FieldUtil', 'widget/Commandbar', 'widget/Dropdown', 'widget/Button',
    'applet/AbnEndProductFeature/gadget/widget/StrategyAnalysis', 'applet/AbnEndProductFeature/gadget/widget/CauseAnalysis', 'applet/AbnEndProductFeature/gadget/widget/SignoffRecord',
    'text!../tpl/Menu.html', 'text!../tpl/Editor.html', 'text!../tpl/TabPanelEditor.html',
    './widget/AppearanceInfo', './widget/AppearanceStatus', 'view/Attachment',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Popup, Collection, TabPanel, FieldUtil,
                                Commandbar, Dropdown, Button,
                                StrategyAnalysis, CauseAnalysis, SignoffRecord,
                                menuTpl, tpl, tabPanelEditorTpl,
                                AppearanceInfo, AppearanceStatus, Attachment, Logger) {

    var LOGGER = new Logger("EndProductAppearanceApply/gadget/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            title: "新增申請",
            mode: Editor.MODE.NEW
        };

        _.defaults(this._cfg, defaults);

        this._anchors = {
            $tabPanelEditor: undefined,
            $abnNo: undefined,
            $createDate: undefined,
            $abnWorkAttribute: undefined,
            $createArea: undefined,
            $isMerge: undefined,
            $mergeNo: undefined
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

        buildMenu.call(this);
        buildMerge.call(this);
        buildTabPanel.call(this);
        buildActions.call(this);

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
    function buildMenu() {
        this._menu = new Triggers({
            tpl: menuTpl
        }).render();
        this.menu(this._menu);
    }

    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');
        var mode = this._cfg.mode ;

        this._tabPanelEditor = new TabPanel({
            el: anchors.$tabPanelEditor,
            tpl: tabPanelEditorTpl
        }).render();

        this._tabPanelEditor.add(new Attachment().render(), {
            title: '相關附件'
        });

        this._tabPanelEditor.add(new AppearanceStatus().render(), {
            index: 0,
            title: '異常情形'
        });

        this._tabPanelEditor.add(new AppearanceInfo().render(), {
            index: 0,
            title: '異常資料'
        });

        LOGGER.debug("buildTabPanel done");
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

    function setValues() {
        this._anchors.$abnNo = this.$anchor('abnNo');
        this._anchors.$abnNo.val("T12016010005");
        this._anchors.$abnNo.prop('disabled', true);

        this._anchors.$createDate = this.$anchor('createDate');
        this._anchors.$createDate.val('2016-01-02');
        this._anchors.$createDate.prop('disabled', true);

        this._anchors.$abnWorkAttribute = this.$anchor('abnWorkAttribute');
        this._anchors.$abnWorkAttribute.children().each(function() {
            if($(this).text() == "PQC") {
                $(this).attr("selected", "selected");
            }
        });
        this._anchors.$abnWorkAttribute.prop('disabled', true);

        this._anchors.$createArea = this.$anchor('createArea');
        this._anchors.$createArea.children().each(function() {
            if($(this).text() == "台灣地區") {
                $(this).attr("selected", "selected");
            }
        });
        this._anchors.$createArea.prop('disabled', true);

        this._anchors.$isMerge = this.$anchor('isMerge');
        this._anchors.$isMerge.find("input[type='radio']").prop('disabled', true);

        this._anchors.$mergeNo = this.$anchor('mergeNo');
        this._anchors.$mergeNo.prop('disabled', true);
        this._anchors.$sideBtn = this.$anchor('sideBtn');
        this._anchors.$sideBtn.prop('disabled', true);
    }
    function buildMerge() {
        var anchors = this._anchors;
        anchors.$isMerge = this.$anchor('isMerge');
        anchors.$mergeNo = this.$anchor('mergeNo');

        anchors.$isMerge.find('input[name="isMerge"]').on('change', _.bind(function(evt){
            var isMergeValue = anchors.$isMerge.find('input[name="isMerge"]:checked').val();
            if(isMergeValue === 'Y') {
                anchors.$mergeNo.show();
            } else {
                anchors.$mergeNo.hide();
            }
        }, this));
    }
    function setMode() {
        var mode = this._cfg.mode;

        if(mode === Editor.MODE.NEW) {

        } else if(mode === Editor.MODE.DRAFT) {
            this._dd.getAction(Dropdown.ACTION.DELETE).show();
        } else if(mode === Editor.MODE.NOTIFICATION) {
            addTabCauseAnalysis.call(this);
            addTabStrategyAnalysis.call(this);
            addTabSignOffRecord.call(this);
            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        } else if(mode === Editor.MODE.MGNT_ENDPRODUCT) {
            FieldUtil.setIsEditable(this.$el, false);
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
    function getTabPanelEditor() {
        return this._tabPanelEditor;
    }

    var props = {
        _anchors: undefined,
        _menu: undefined,
        _tabPanelEditor: undefined,

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
    Editor.COMMAND = {
        //NEW: "NEW"
    };

    Editor.MODE = {
        NEW: "NEW",
        DRAFT: "DRAFT",
        MGNT_ENDPRODUCT: "MGNT_ENDPRODUCT", //從 異常作業-管理異常申請 進入
        ABNENDPRODUCT_EFFECT: "ABNENDPRODUCT_EFFECT", //從 成品異常效果確認 進入


        NOTIFICATION: 'NOTIFICATION'
    };



    return Editor;
});