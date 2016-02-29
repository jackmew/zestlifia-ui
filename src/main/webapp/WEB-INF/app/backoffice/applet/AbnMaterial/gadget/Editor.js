/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2015 Jason Lin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', 'uweaver/widget/Widget', '../../../util/FieldUtil',
    'widget/Commandbar', 'widget/Dropdown', 'widget/Button',
    'uweaver/widget/Popup', '../../../widget/Modal',
    'text!../tpl/Editor.html', 'text!widget/tpl/TabPanel.html',
    'text!../tpl/widget/TestBackFirst.html', 'text!../tpl/widget/TestBackSecond.html', 'text!../tpl/widget/TestBackRecordInvest.html',
    'text!../tpl/widget/TestBackSupplier.html', 'text!../tpl/widget/TestBackConfirmInvest.html', 'text!../tpl/widget/TestBackVerifySolution.html',
    'text!../tpl/widget/TestBackConfirmSolution.html', 'text!../tpl/widget/TestBackQuality.html', './widget/SignoffRecord',
    './widget/AbnMaterialInfo', './widget/AbnMaterialProduct', 'text!../tpl/widget/InfoIssueNo.html',
    'view/Attachment',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, TabPanel, Widget, FieldUtil,
                                Commandbar, Dropdown, Button,
                                Popup, Modal,
                                tpl, tabPanelEditorTpl, testBackFirstTpl, testBackSecondTpl, testBackRecordInvestTpl, testBackSupplierTpl,
                                testBackConfirmInvestTpl, testBackVerifySolutionTpl, testBackConfirmSolutionTpl, testBackQualityTpl, SignoffRecord,
                                AbnMaterialInfo, AbnMaterialProduct, InfoIssueNoTpl,
                                Attachment,
                                Logger) {

    var LOGGER = new Logger("AbnMaterial/gadget/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: Editor.MODE.NEW,
            title: "異常申請"
        };

        var cfg = this._cfg ;
        _.defaults(cfg, defaults);

        this._anchors = {
            $tabPanelEditor: undefined,
            $gridProduct: undefined,
            $gridApart: undefined,
            $actions: undefined,
            $ddAction: undefined,
            $btnActionNotify: undefined,
            $btnActionSave: undefined
        };

        this.title(cfg.title);
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };

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


        if(mode === Editor.MODE.NEW_REJECT) {
            this._tabPanelEditor.get(0).$anchor('finderClass').hide();
            this._tabPanelEditor.get(0).$anchor('machineType').hide();
        } else if(mode === Editor.MODE.NEW_STORAGE) {
        } else if(mode === Editor.MODE.NEW_MATERIAL) {
        } else if(mode === Editor.MODE.NEW_CASE) {
        } else if(mode === Editor.MODE.NEW_CASENO) {
            this._tabPanelEditor.get(1).$anchor('supplier').find('input[type="text"]').prop('readonly', false);
            this._tabPanelEditor.get(1).$anchor('supplier').find('button').prop('disabled', false);
        } else if(mode === Editor.MODE.DRAFT) {
            this._ddS.getAction(Dropdown.ACTION.DELETE).show();
        } else if(mode === Editor.MODE.MGNT_REJECT) {
            addMgntReject.call(this);
            FieldUtil.setIsEditable(this.$el, false);
            this._cmd.hide();
        // 待簽核
        } else if(mode === Editor.MODE.INBOX_TWO ) {
            addTestBackFirst.call(this);
            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('transferPerson'), true);

            FieldUtil.setIsEditable(this._abnMaterialInfo.$el.find('.form-group').last(), true);
        } else if(mode === Editor.MODE.INBOX_THREE) {

            this._ddS.getAction(Dropdown.ACTION.NOTIFY).show();

            addTestBackSecond.call(this);
            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffResult'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('signoffComment'), true);
            var supplierWidget = this._tabPanelEditor.get(2);
            FieldUtil.setIsEditable(supplierWidget.$el, true);
            var attachmentWidget = this._tabPanelEditor.get(5);
            FieldUtil.setIsEditable(attachmentWidget.$el, true);
        } else if(mode === Editor.MODE.INBOX_FOUR) {

            addTestBackRecordInvest.call(this);
            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('management'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('explanation'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('isApart'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('divApart'), true);
        } else if(mode === Editor.MODE.INBOX_FIVE) {

            addTestBackConfirmInvest.call(this);

            FieldUtil.setIsEditable(this.$anchor('createArea'), false);
            FieldUtil.setIsEditable(this.$anchor('isHSF'), false);
            FieldUtil.setIsEditable(this.$anchor('chemical'), false);
            FieldUtil.setIsEditable(this.$anchor('issueNo'), false);
            FieldUtil.setIsEditable(this.$anchor('relationalNo'), false);
        } else if(mode === Editor.MODE.INBOX_SIX) {

            addTestBackVerifySolution.call(this);
            FieldUtil.setIsEditable(this.$el, false);

            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('report8d'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('reportStatus'), true);
            FieldUtil.setIsEditable(this._tabPanelEditor.get(0).$anchor('executeStatus'), true);
        } else if(mode === Editor.MODE.INBOX_SEVEN) {

            addTestBackConfirmSolution.call(this);
            FieldUtil.setIsEditable(this.$el, false);
        } else if(mode === Editor.MODE.INBOX_EIGHT) {

            addTestBackQuality.call(this);
            FieldUtil.setIsEditable(this.$el, false);
        } else if(mode === Editor.MODE.MGNT_REJECT) {

            FieldUtil.setIsEditable(this.$el, false);

            this._tabPanelEditor.get(4).$anchor('signoffSection').hide();
            this._tabPanelEditor.select(0);
        // Notification
        } else if(mode === Editor.MODE.NOTIFICATION_REJECT) {
            addNotification.call(this);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION_STORAGE) {
            addNotification.call(this);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION_MATERIAL) {
            addNotification.call(this);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION_CASE) {
            addNotification.call(this);
            this._cmd.hide();
        } else if(mode === Editor.MODE.NOTIFICATION_CASENO) {
            addNotification.call(this);
            this._cmd.hide();
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

        this._ddS = new Dropdown({
            title: '其他'
        }).render();
        this._ddS.addAction(Dropdown.ACTION.SAVE);
        this._ddS.addAction(Dropdown.ACTION.DELETE).hide();
        this._ddS.addAction(Dropdown.ACTION.NOTIFY).hide();
        this._ddS.addAction(Dropdown.ACTION.CLOSE);
        this._cmd.add(this._ddS);

        this._cmd.attach(this.$el);
    }
    function buildEditor() {
        this._modalIssueNo = new Modal({
            size: Modal.SIZE.M
        }).render();
        this._modalIssueNo.title("客訴單");
        this._modalIssueNo.setContent($(InfoIssueNoTpl));
        var $gridIssueNo = this._modalIssueNo.$anchor('gridIssueNo');

        var issueNos = new Collection();
        var items = [
            {no: "IT2016010005", date: new Date("2016-01-05"), customer: "溙鼎"},
            {no: "IT2016010005", date: new Date("2016-01-05")}
        ];
        issueNos.add(items);

        var gridIssue = new Grid({
            el: $gridIssueNo,
            data: issueNos,
            columns: [
                {text: "客訴單號", dataIndex: "no"},
                {text: "客訴日期", dataIndex: "date"},
                {text: "客戶", dataIndex: "customer"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        var modalIssueNo = this._modalIssueNo;

        this.$anchor('issueNo').on('click', function(evt) {
            modalIssueNo.show();
        });
    }
    function buildTabPanel() {
        var anchors = this._anchors;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');

        this._tabPanelEditor = new TabPanel({
            el: anchors.$tabPanelEditor,
            tpl: tabPanelEditorTpl
        }).render();

        this._attachment = new Attachment().render();
        this._tabPanelEditor.add(this._attachment, {
            title: '相關附件'
        });
        this._abnMaterialProduct = new AbnMaterialProduct().render();
        this._tabPanelEditor.add(this._abnMaterialProduct, {
            index: 0,
            title: '異常產品'
        });

        this._abnMaterialInfo = new AbnMaterialInfo().render();
        this._tabPanelEditor.add(this._abnMaterialInfo, {
            index: 0,
            title: '基本資料'
        });

        LOGGER.debug("buildTabPanel done");
    }
    function onTabPanelSelect(evt) {
        var tabWidgetSelected = evt.source ;
        var mode = this._cfg.mode ;

        if(tabWidgetSelected.title() === '簽核') {
            this._cmd.show();
            this._btnSend.show();
            // 通知供應商
            if(mode == Editor.MODE.INBOX_THREE) {
                this._ddS.getAction(Dropdown.ACTION.NOTIFY).show();
            } else {
                this._ddS.getAction(Dropdown.ACTION.NOTIFY).hide();
            }
        } else {
            this._cmd.hide();
        }

        if(tabWidgetSelected.title() === '供應商') {
            this._cmd.show();
            this._btnSend.hide();
            this._ddS.getAction(Dropdown.ACTION.NOTIFY).hide();
        }
    }
    function onIsResultSelectChange(evt) {
        var value = this._tabPanelEditor.$('input[name="isResult"]:checked').val();
        LOGGER.debug("onIsResultSelectChange: ${0}", value);

        var $transferPerson = this._tabPanelEditor.$anchor('transferPerson');
        if(value == "TRANSFER") {
            $transferPerson.show();
        } else {
            $transferPerson.hide();
        }

    }
    function onManageSelectChange(evt) {
        var value = this._tabPanelEditor.$anchor('management').find('option:selected').val();
        LOGGER.debug("onManageSelectChange: ${0}", value);

        var $explanation = this._tabPanelEditor.$anchor("explanation");
        if(value == "其他") {
            $explanation.show();
        } else {
            $explanation.hide();
        }
    }
    function onIsApartChange(evt) {
        var value = this._tabPanelEditor.$('input[name="isApart"]:checked').val();
        LOGGER.debug("onIsApartChange: ${0}", value);

        var $divApart = this._tabPanelEditor.$anchor("divApart");
        if(value === "Y") {
            buildGridApart.call(this);
            $divApart.show();
        } else {
            $divApart.hide();
        }
    }
    function buildGridApart() {
        if(this._gridApart !== undefined) {
            return ;
        }

        var anchors = this._anchors;
        anchors.$gridApart = this.$anchor("gridApart");

        var aparts = new Collection();
        var items = [
            {batch: "77570-062", problem: "折痕(其他型)",   amount: 1000 , usedAmount: 0,   abnAmountBefore: 1000,   abnAmountAfter: 1000},
            {batch: "77570-063", problem: "折痕(亮紋)",     amount: 1000 , usedAmount: 200, abnAmountBefore: 1800, abnAmountAfter:   1800},
            {batch: "77570-064", problem: "折痕(亮紋)",    amount: 2000 , usedAmount: 300, abnAmountBefore:  1700,  abnAmountAfter:  1700},
            {batch: "77570-065", problem: "折痕(其他型)",  amount: 2000 , usedAmount: 500, abnAmountBefore:  1500,  abnAmountAfter:  1500}
        ];
        aparts.add(items);

        this._gridApart = new Grid({
            el: anchors.$gridApart,
            data: aparts,
            columns: [
                {text: "批號", dataIndex: "batch"},
                {text: "不良項目", dataIndex: "problem"},
                {text: "原始數量", dataIndex: "amount"},
                {text: "已使用數量", dataIndex: "usedAmount"},
                {text: "異常量(修改前)", dataIndex: "abnAmountBefore"},
                {text: "異常量(修改後)", dataIndex: "abnAmountAfter"}
            ],
            mode: Grid.MODE.MULTI
        });

        this._gridApart.render();
    }
    function addSupplier(index) {
        var title = "供應商";
        this._supplier = new Widget({
            tpl: testBackSupplierTpl,
            title: title
        }).render();

        this._tabPanelEditor.add(this._supplier, {
            title: title,
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
    function addSignOff(title, tpl, index) {
        this._signOff = new Widget({
            tpl: tpl
        }).render();

        this._tabPanelEditor.add(this._signOff, {
            title: title,
            index: index
        });
    }
    // 驗退-2 品保IQC
    function addTestBackFirst() {

        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackFirstTpl, 0);

        this._title = i18n.translate("驗退-2 品保IQC");
        // radio button
        this._tabPanelEditor.$('input[name="isResult"]').on('change', _.bind(onIsResultSelectChange, this));
    }
    // 驗退-3 品保SQE
    function addTestBackSecond() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackSecondTpl, 0);

        this._title = i18n.translate("驗退-3 品保SQE");

        // radio change
        this._tabPanelEditor.$('input[name="isResult"]').on('change', _.bind(onIsResultSelectChange, this));
    }
    // 驗退-4 資材專員
    function addTestBackRecordInvest() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackRecordInvestTpl, 0);

        this._title = i18n.translate("驗退-4 資材專員");

        // select change
        this._tabPanelEditor.$anchor('management').find('select').on('change', _.bind(onManageSelectChange, this));
        // radio
        this._tabPanelEditor.$anchor('isApart').find('input[name="isApart"]').on('change', _.bind(onIsApartChange, this));
    }
    // 驗退-5 資材主管
    function addTestBackConfirmInvest() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackConfirmInvestTpl, 0);

        this._title = i18n.translate("驗退-5 資材主管");
    }
    // 驗退-6 品保SQE
    function addTestBackVerifySolution() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackVerifySolutionTpl, 0);

        this._title = i18n.translate("驗退-6 品保SQE");
    }
    // 驗退-7 品保主管
    function addTestBackConfirmSolution() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackConfirmSolutionTpl, 0);

        this._title = i18n.translate("驗退-7 品保主管");
    }
    // 驗退-8 品保最高主管
    function addTestBackQuality() {

        addSupplier.call(this, 0);
        addSignOffRecord.call(this, 0);
        addSignOff.call(this, "簽核", testBackQualityTpl, 0);

        this._title = i18n.translate("驗退-8 品保最高主管");
    }
    // 管理異常申請 -> 驗退
    function addMgntReject() {
        addSupplier.call(this);
        this._supplier.$el.append('<hr/>');

        // 將signOff的一部份，放到Supplier
        var signOff = new Widget({
            tpl: testBackQualityTpl
        }).render();
        signOff.$anchor('signoffSection').hide();

        this._supplier.$el.append(signOff.$el);
        addSignOffRecord.call(this);
        this._tabPanelEditor.select(0);
    }
    // MyNotification -> 異常申請
    function addNotification() {
        addSupplier.call(this);
        addSignOffRecord.call(this);
        FieldUtil.setIsEditable(this.$el, false);
        this._tabPanelEditor.select(0);
    }
    function setEvents() {
        var mode = this._cfg.mode ;
        if(isInbox(mode)) {
            this._tabPanelEditor.on('select', _.bind(onTabPanelSelect, this));
        }
    }
    function isInbox(mode) {
        return (mode.indexOf('INBOX') > -1);
    }
    var props = {
        _anchors: undefined,
        _gridApart: undefined,
        _tabPanelEditor: undefined,

        _modalIssueNo: undefined,
        // tabs - new
        _abnMaterialInfo: undefined,
        _abnMaterialProduct: undefined,
        _attachment: undefined,
        // tabs - inbox
        _signOff: undefined,
        _signoffRecord: undefined,
        _supplier: undefined,
        // actions
        _cmd: undefined,
        _btnSend: undefined,
        _ddS: undefined
    };
    var Editor = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Editor.COMMAND = {
        NEW: "NEW",
        SEND: 'SEND',
        SAVE: 'SAVE',
        DELETE: 'DELETE'
    };

    Editor.MODE = {
        NEW_REJECT: "NEW_REJECT",
        NEW_STORAGE: "NEW_STORAGE",
        NEW_MATERIAL: "NEW_MATERIAL",
        NEW_CASE: "NEW_CASE",
        NEW_CASENO: "NEW_CASENO",

        MGNT_REJECT: "MGNT_REJECT", //從 異常作業-管理異常申請 進入
        DRAFT: "DRAFT",

        NOTIFICATION_REJECT: "NOTIFICATION_REJECT",
        NOTIFICATION_STORAGE: "NOTIFICATION_STORAGE",
        NOTIFICATION_MATERIAL: "NOTIFICATION_MATERIAL",
        NOTIFICATION_CASE: "NOTIFICATION_CASE",
        NOTIFICATION_CASENO: "NOTIFICATION_CASENO",

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