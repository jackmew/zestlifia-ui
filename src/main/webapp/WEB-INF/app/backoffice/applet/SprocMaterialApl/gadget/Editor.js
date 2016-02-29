/**
 * Created by jackho on 1/4/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/TabPanel',
    'uweaver/widget/Widget', '../../../util/FieldUtil', 'widget/Commandbar', 'widget/Dropdown', 'widget/Button', 'uweaver/widget/Popup', 'uweaver/data/Collection', './widget/InvestLimit',
    'text!../tpl/Editor.html', 'text!widget/tpl/TabPanel.html', 'text!../tpl/widget/Signoff.html',
    './widget/SignoffRecord', './widget/SprocMaterialInfo', './widget/SprocMaterialStatus', 'view/Attachment', './widget/SprocMaterialAbn',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, TabPanel, Widget, FieldUtil, Commandbar, Dropdown, Button, Popup, Collection, InvestLimit,
                                tpl, tabPanelEditorTpl,  signoffTpl, SignoffRecord,
                                SprocMaterialInfo, SprocMaterialStatus, Attachment, SprocMaterialAbn,
                                Logger) {

    var LOGGER = new Logger("SprocMaterialApl/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);
        
        var defaults = {
            mode: Editor.MODE.NEW,
            tpl: tpl,
            title: i18n.translate("原料特採申請")
        };
        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
            $sprocType: undefined,
            $tabPanelEditor: undefined,
            $action: undefined
        };
        this.title(cfg.title);
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

        buildTabPanel.call(this);
        buildActions.call(this);

        setMode.call(this);
        setEvents.call(this);

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
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
            this._dd.addAction(Dropdown.ACTION.DELETE).show();
        } else if(mode === Editor.MODE.MGNT_SPROC) {
            // 待簽核 -> 特採申請 -> 過期展延 | 4 管理代表確認
            // 移除 特採情形
            this._tabPanelEditor.remove(1);

            addInvestLimit.call(this);
            addSignOffRecord.call(this);
            this._tabPanelEditor.select(0);
            this._title = i18n.translate(this._cfg.newTitle);

            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION) {
            addInvestLimit.call(this);
            addSignOffRecord.call(this);
            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        // INBOX
        } else if(mode == Editor.MODE.INBOX_TWO) {
            //2 品保覆核
            this.title("新資材無檢視-2 品保覆核");

            addInvestLimit.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);

            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffComment'), true);

            this._signoff.$anchor('dateExtension').hide();
            FieldUtil.setIsEditable(this.$anchor('sprocType'), true);
            FieldUtil.setIsEditable(this._investLimit.$el, true);
        } else if(mode == Editor.MODE.INBOX_THREE1) {
            //3 會簽1(主簽)
            this.title("外觀不良-3 會簽(主簽)");
            addInvestLimit.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);

            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._signoff.$anchor('dateExtension'), true);
        } else if(mode == Editor.MODE.INBOX_THREE2) {
            //3 會簽2(通知)
            this.title("急料未檢-3 會簽(通知)");
            addInvestLimit.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);

            var signOff = this._tabPanelEditor.get(0);
            signOff.$anchor('backTitle').text('不同意');

            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._signoff.$anchor('dateExtension'), true);
        } else if(mode == Editor.MODE.INBOX_FOUR) {
            //4 管理代表確認
            this.title("過期展延-4 管理代表確認");
            addInvestLimit.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);

            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._signoff.$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this._signoff.$anchor('dateExtension'), true);
        }
    }
    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');

        this._tabPanelEditor = new TabPanel({
            el:  anchors.$tabPanelEditor,
            tpl: tabPanelEditorTpl
        }).render();

        this._sprocMaterialInfo = new SprocMaterialInfo().render();
        this._tabPanelEditor.add(this._sprocMaterialInfo, {
            title: '特採資料'
        });

        this._sprocMaterialStatus = new SprocMaterialStatus().render();
        this._tabPanelEditor.add(this._sprocMaterialStatus, {
            title: '特採情形'
        });

        this._sprocMaterialAttachment = new Attachment().render();
        this._tabPanelEditor.add(this._sprocMaterialAttachment, {
            title: '相關附件'
        });

        this._sprocMaterialAbn = new SprocMaterialAbn().render();
        this._tabPanelEditor.add(this._sprocMaterialAbn, {
            title: '相關異常'
        });

        this._tabPanelEditor.select(0);
        LOGGER.debug("buildTabPanel done");
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
    function addInvestLimit(index) {
        var mode = this._cfg.mode ;

        this._investLimit = new InvestLimit({
            mode: mode
        }).render();

        this._tabPanelEditor.add(this._investLimit, {
            title: "投產限制",
            index: index
        });
    }
    function addSignOffRecord(index) {
        var signoffTitle = "簽核紀錄";
        this._signoffRecord = new SignoffRecord().render();
        this._tabPanelEditor.add(this._signoffRecord, {
            title: signoffTitle,
            index: index
        });
    }
    function addSignOff(index) {
        this._signoff = new Widget({
            tpl: signoffTpl
        }).render();

        this._tabPanelEditor.add(this._signoff, {
            title: "簽核",
            index: index
        });
    }
    function onTabPanelSelect(evt) {
        var currentWidget = evt.data ;
        if(currentWidget === this._signoff) {
            this._cmd.show();
        } else {
            this._cmd.hide();
        }
    }
    function setEvents() {
        var mode = this._cfg.mode;
        if(isInbox(mode)) {
            this._tabPanelEditor.on('select', _.bind(onTabPanelSelect, this));
        }
    }
    function isInbox(mode) {
        return (mode.indexOf("INBOX") > -1);
    }
    var props = {
        _anchors: undefined,
        _tabPanelEditor: undefined,
        // tabs - new
        _sprocMaterialInfo: undefined,
        _sprocMaterialStatus: undefined,
        _sprocMaterialAttachment: undefined,
        _sprocMaterialAbn: undefined,
        // tabs - inbox
        _signoff: undefined,
        _signoffRecord: undefined,
        _investLimit: undefined,

        // actions
        _cmd: undefined,
        _btnSend: undefined,
        _dd: undefined
    };


    var Editor = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Editor.COMMAND = {
    };

    Editor.MODE = {
        NEW: "NEW",
        DRAFT: "DRAFT",

        MGNT_SPROC: "MGNT_SPROC", //從 特採作業-管理特採作業 進入
        
        NOTIFICATION: "NOTIFICATION",
        
        INBOX_TWO: "INBOX_TWO",
        INBOX_THREE1: "INBOX_THREE1",
        INBOX_THREE2: "INBOX_THREE2",
        INBOX_FOUR: "INBOX_FOUR"
    };

    return Editor;
});