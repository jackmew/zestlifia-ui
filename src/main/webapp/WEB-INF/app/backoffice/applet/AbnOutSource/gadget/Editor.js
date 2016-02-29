/**
 * Created by jackho on 1/6/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Popup',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', 'uweaver/widget/Widget', '../../../util/FieldUtil',  'widget/Commandbar', 'widget/Dropdown', 'widget/Button',
    'text!../tpl/Editor.html', 'text!widget/tpl/TabPanel.html', 'text!../tpl/ToolbarSearchPopup.html',
    "widget/Modal", "widget/FormLayout", "widget/Textarea",
    './widget/SignoffRecord',
    './widget/SignOff', './widget/Oem', './widget/AbnOutSourceInfo', 'view/Attachment',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Popup, Collection, TabPanel, Widget, FieldUtil,
                                Commandbar, Dropdown, Button,
                                tpl, tabPanelEditorTpl, toolbarSearchPopup,
                                Modal, FormLayout, Textarea,
                                SignoffRecord, SignOff, Oem, AbnOutSourceInfo, Attachment,  Logger) {

    var LOGGER = new Logger("AbnOurSource/gadget/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            mode: Editor.MODE.NEW,
            tpl: tpl,
            title: undefined
        };
        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
            $gridInfo: undefined,
            $tabPanelEditor: undefined,
            $sideBtn: undefined,
            $toolbar: undefined,
            $abnNo: undefined,
            $createDate: undefined,
            $abnWorkAttribute: undefined,
            $createArea: undefined,
            $action: undefined
        };
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
    function addTabSignOffRecord(index) {
        var signoffTitle = "簽核紀錄";
        this._signoffRecord = new SignoffRecord().render();
        this._tabPanelEditor.add(this._signoffRecord, {
            title: signoffTitle,
            index: index
        });
    }
    function addTabOem(mode, index) {
        this._oem = new Oem({
            mode: mode
        }).render();
        this._tabPanelEditor.add(this._oem, {
            title: '代工廠',
            index: index
        });
    }
    function addTabSignOff(mode, index) {
        this._signOff = new SignOff({
            mode: mode
        }).render();
        this._tabPanelEditor.add(this._signOff, {
            title: "簽核",
            index: index
        });
    }
    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');

        this._tabPanelEditor = new TabPanel({
            el: anchors.$tabPanelEditor,
            tpl: tabPanelEditorTpl
        }).render();

        var mode = this._cfg.mode;

        this._abnOutSourceInfo = new AbnOutSourceInfo({
            mode: mode
        }).render();
        this._tabPanelEditor.add(this._abnOutSourceInfo, {
            title: "異常資料"
        });

        this._attachment = new Attachment().render();
        this._tabPanelEditor.add(this._attachment, {
            title: "相關附件"
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
            title: '其他',
            isTrigger: true
        }).render();
        this._dd.addAction(Dropdown.ACTION.SAVE);
        this._dd.addAction(Dropdown.ACTION.DELETE).hide();
        this._dd.addAction({
            value: 'Notify',
            text: '通知代工廠',
            icon: 'fa-envelope-o'
        }).hide();
        this._dd.addAction(Dropdown.ACTION.CLOSE);
        this._cmd.add(this._dd);

        this._cmd.attach(this.$el);

        var context = this ;
        this._dd.on('ddClick', function(evt) {
            var value = evt.data.value;
            if(value === 'Notify') {
                popNotify.call(context);
            }
        })

    }
    function onTabPanelSelect(evt) {
        var currentWidget = evt.data;
        // 目前是最後一個位置，之後會改為第一個位置
        if(currentWidget === this._signOff) {
            this._cmd.show();
        } else {
            this._cmd.hide();
        }
    }
    function setMode() {
        var mode = this._cfg.mode ;

        if(mode === Editor.MODE.NEW_HALF_CREATE) {

        } else if(mode === Editor.MODE.NEW_CREATE) {

        } else if(mode === Editor.MODE.MGNT_OUTSOURCE) {
            // 管理異常申請 -> 委外成品
            addTabOem.call(this, mode);
            addTabSignOffRecord.call(this);

            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        } else if(mode === Editor.MODE.DRAFT) {
            this._dd.getAction(Dropdown.ACTION.DELETE).show();
        // Inbox
        } else if(mode === Editor.MODE.INBOX_TWO) {
            this.title(i18n.translate("委外半成品-2 品保FQC"));
            FieldUtil.setIsEditable(this.$el, false);

            addTabSignOffRecord.call(this, 0);
            addTabSignOff.call(this, mode, 0);

            this._dd.getAction(Dropdown.ACTION.NOTIFY).show();
        } else if(mode === Editor.MODE.INBOX_THREE) {
            this.title(i18n.translate("委外半成品-3 品保主管"));
            FieldUtil.setIsEditable(this.$el, false);
            addTabSignOffRecord.call(this, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.INBOX_FOUR) {
            this.title(i18n.translate("委外半成品-4 資材專員"));
            FieldUtil.setIsEditable(this.$el, false);
            addTabSignOffRecord.call(this, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.INBOX_FIVE) {
            this.title(i18n.translate("委外半成品-5 資材主管"));
            FieldUtil.setIsEditable(this.$el, false);
            addTabSignOffRecord.call(this, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.INBOX_SIX) {
            this.title(i18n.translate("委外半成品-6 品保FQC"));
            FieldUtil.setIsEditable(this.$el, false);
            addTabSignOffRecord.call(this, 0);
            addTabOem.call(this, mode, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.INBOX_SEVEN) {
            this.title(i18n.translate("委外半成品-7 品保主管"));
            FieldUtil.setIsEditable(this.$el, false);
            addTabSignOffRecord.call(this, 0);
            addTabOem.call(this, mode, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.INBOX_EIGHT) {
            this.title(i18n.translate("委外半成品-8 品保最高主管"));
            FieldUtil.setIsEditable(this.$el, false);

            addTabSignOffRecord.call(this, 0);
            addTabOem.call(this, mode, 0);
            addTabSignOff.call(this, mode, 0);
        } else if(mode === Editor.MODE.MGNT_OUTSOURCE) {
            // 管理異常申請 -> 委外成品
            addTabOem.call(this, mode);
            addTabSignOffRecord.call(this);

            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);

        // Notification
        } else if(mode === Editor.MODE.NOTIFICATION_HALF_CREATE) {
            addTabOem.call(this);
            addTabSignOffRecord.call(this);
            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION_CREATE) {
            addTabOem.call(this);
            addTabSignOffRecord.call(this);
            this._tabPanelEditor.select(0);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        }
    }
    function setEvents() {
        var mode = this._cfg.mode;
        if(isInbox(mode)) {
            this._tabPanelEditor.on('select', _.bind(onTabPanelSelect, this));
        }

        if(isNew(mode)) {
            if (mode === Editor.MODE.NEW_CREATE) {
                var $isMerge = this.$anchor('isMerge').show();
                var $mergeNo = this.$anchor('mergeNo');

                $isMerge.find('input[type="radio"]').on('change', function (evt) {
                    var value = $isMerge.find('input[type="radio"]:checked').val();
                    if (value === 'Y') {
                        $mergeNo.show();
                    } else {
                        $mergeNo.hide();
                    }

                })
            }
        }
    }
    function isInbox(mode) {
        return (mode.indexOf('INBOX') > -1);
    }
    function isNew(name) {
        if(name.indexOf('NEW') > -1) {
            return true;
        } else {
            return false ;
        }
    }
    function isNotification(name) {
        if(name.indexOf('NOTIFICATION') > -1) {
            return true;
        } else {
            return false ;
        }
    }

    function popNotify() {
        if(_.isUndefined(this._notifyModal)) {
            this._notifyModal = new Modal({
                title: '代工廠通知信件',
                size: Modal.SIZE.M
            }).render();
            this._flNotify = new FormLayout().render();
            var row1 = this._flNotify.addRow();
            this._taLetterContent = new Textarea({
                caption: '信件內容'
            }).render();
            this._flNotify.addField(row1, this._taLetterContent, 'letterContent', 2, 10);

            this._notifyModal.setContent(this._flNotify);
        }
        this._notifyModal.show();
    }
    var props = {
        _mode: undefined,
        _anchors: undefined,
        _tabPanelEditor: undefined,
        _gridInfo: undefined,
        // tabs - new
        _abnOutSourceInfo: undefined,
        _attachment: undefined,
        // tabs - inbox
        _signOff: undefined,
        _signoffRecord: undefined,
        _oem: undefined, //代工廠
        // popup
        _relationalNoPopup: undefined,
        _toolbarPlusPopup: undefined,

        //_notifyPopup: undefined,
        _notifyModal: undefined,
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
        NEW_HALF_CREATE: 'NEW_HALF_CREATE',
        NEW_CREATE: 'NEW_CREATE',

        MGNT_OUTSOURCE: "MGNT_OUTSOURCE", //從 異常作業-管理異常申請 進入
        DRAFT: "DRAFT",

        NOTIFICATION_HALF_CREATE: 'NOTIFICATION_HALF_CREATE',
        NOTIFICATION_CREATE: 'NOTIFICATION_CREATE',

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