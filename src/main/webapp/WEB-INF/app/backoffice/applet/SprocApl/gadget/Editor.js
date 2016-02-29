/**
 * Created by jackho on 1/4/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/TabPanel',
    'uweaver/widget/Widget', '../../../util/FieldUtil', 'widget/Commandbar', 'widget/Dropdown', 'widget/Button', 'uweaver/data/Collection',
    'text!../tpl/Editor.html', 'text!../tpl/TabPanelEditor.html', 'text!../tpl/widget/QualityCheck.html', './widget/SignoffRecord',
    './widget/SprocInfo', 'view/Attachment',  './widget/SprocAbn',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, TabPanel, Widget, FieldUtil,
                                Commandbar, Dropdown, Button, Collection,
                                tpl, tabPanelEditorTpl, qualityCheckTpl, SignoffRecord,
                                SprocInfo, Attachment, SprocAbn,
                                Logger) {

    var LOGGER = new Logger("SprocApl/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            mode: Editor.MODE.NEW,
            tpl: tpl,
            title: i18n.translate("成品特採申請")
        };

        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $sprocType: undefined,
            $tabPanelEditor: undefined,
            $gridInfo: undefined,
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

        buildEditor.call(this);
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
            this._dd.getAction(Dropdown.ACTION.DELETE).show();
        } else if(mode === Editor.MODE.MGNT_SPROC) {
            // 待簽核 -> 特採作業 -> 未檢驗出貨 | 4 管理代表確認
            this._title = i18n.translate(this._cfg.newTitle);
            // 增加 簽核紀錄
            addTabSignoffRecord.call(this);
            this._tabPanelEditor.select(0);

            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION) {
            addTabSignoffRecord.call(this);
            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        // INBOX
        } else if(mode === Editor.MODE.INBOX_TWO) {
            addTabSignoffRecord.call(this, 0);
            addTab.call(this, qualityCheckTpl, "不符合客規出貨-2 品保覆核");

            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);

            FieldUtil.setIsEditable(this.$anchor('sprocType'), true);
        } else if(mode === Editor.MODE.INBOX_THREE1) {
            addTabSignoffRecord.call(this, 0);
            addTab.call(this, qualityCheckTpl, "保質期不足-3 會簽(主簽)");

            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);
        } else if(mode === Editor.MODE.INBOX_THREE2) {
            addTabSignoffRecord.call(this, 0);
            addTab.call(this, qualityCheckTpl, "保質期不足-3 會簽(通知)");
            // signOff
            this._tabPanelEditor.get(0).$anchor('backTitle').text('不同意');

            FieldUtil.setIsEditable(this.$el, false);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);
        } else if(mode === Editor.MODE.INBOX_FOUR) {
            addTabSignoffRecord.call(this, 0);
            addTab.call(this, qualityCheckTpl, "未檢驗出貨-4 管理代表確認");
        }
    }

    function buildEditor() {
        this._anchors.$sprocType = this.$anchor('sprocType');
    }
    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');
        var mode = this._cfg.mode ;

        this._tabPanelEditor = new TabPanel({
            el:  anchors.$tabPanelEditor,
            tpl: tabPanelEditorTpl
        }).render();

        this._SprocAbn = new SprocAbn().render();
        this._tabPanelEditor.add(this._SprocAbn, {
            title: "相關異常"
        });

        this._sprocAttachment = new Attachment().render();
        this._tabPanelEditor.add(this._sprocAttachment, {
            index: 0,
            title: "相關附件"
        });

        this._sprocInfo = new SprocInfo().render();
        this._tabPanelEditor.add(this._sprocInfo, {
            index: 0,
            title: "特採資料"
        });

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
    function addTabSignoffRecord(index) {
        var signoffTitle = "簽核紀錄";
        this._signoffRecord = new SignoffRecord().render();
        this._tabPanelEditor.add(this._signoffRecord, {
            title: signoffTitle,
            index: index
        });
    }
    function addTab(tpl, title) {
        this._signOff = new Widget({
            tpl: tpl
        }).render();

        this._tabPanelEditor.add(this._signOff, {
            title: "簽核",
            index: 0
        });
        this._title = i18n.translate(title);
    }
    function onTabPanelSelect(evt) {
        var currentWidget = evt.data ;
        if(currentWidget === this._signOff) {
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
        return (mode.indexOf('INBOX') > -1);
    }

    var props = {
        _anchors: undefined,
        _tabPanelEditor: undefined,
        // tabs - new
        _sprocInfo: undefined,
        _sprocAttachment: undefined,
        _SprocAbn: undefined,

        // tabs - inbox
        _signOff: undefined,
        _signoffRecord: undefined,

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