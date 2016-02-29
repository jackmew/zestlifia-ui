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
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Popup',
    'uweaver/widget/TabPanel', 'uweaver/data/Collection', '../../../util/FieldUtil', 'widget/Commandbar', 'widget/Dropdown', 'widget/Button',
    'text!../tpl/Editor.html', 'text!widget/tpl/TabPanel.html',
    './widget/SignoffRecord',  './widget/Signoff',
    'applet/AbnEndProductFeature/gadget/widget/CauseAnalysis', 'applet/AbnEndProductFeature/gadget/widget/StrategyAnalysis',
    'applet/IssueApl/gadget/widget/SendSample', 'applet/IssueApl/gadget/widget/ClientVerify', 'applet/IssueApl/gadget/widget/EightDReport',
    './widget/BasicInfo', './widget/IssueProduct', './widget/IssueStatus', './widget/BadPicture', 'view/Attachment', './widget/RelationalIssue', './widget/IssueAbn',
    'applet/IssueApl/gadget/widget/ClientInvest',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Popup, TabPanel, Collection, FieldUtil, Commandbar, Dropdown, Button, tpl, tabPanelTpl,
                                SignoffRecord, Signoff, CauseAnalysis, StrategyAnalysis, SendSample, ClientVerify, EightDReport,
                                BasicInfo, IssueProduct, IssueStatus, BadPicture, Attachment, RelationalIssue, IssueAbn, ClientInvest, Logger) {

    var LOGGER = new Logger("IssueApl/Editor");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: Editor.MODE.NEW,
            title: i18n.translate("客訴案件")
        };
        var cfg = this._cfg ;
        _.defaults(cfg, defaults);

        this._anchors = {
            $toolbar: undefined,
            $gridProduct: undefined,
            $tabPanelEditor: undefined
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
        var mode = this._cfg.mode;

        if(mode === Editor.MODE.NEW) {
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();
        } else if(mode === Editor.MODE.DRAFT) {
            // issueProduct
            var $itemName = this._issueProduct.$anchor('itemName');
            var $productType = this._issueProduct.$anchor('productType');
            var $productGroup = this._issueProduct.$anchor('productGroup');
            $itemName.val("BTNTA01525W33");
            $productType.val("2-Layer");
            $productGroup.val("能源");

            var products = new Collection();
            var items = [
                {batch: "1B159191-A20111", shipDate: new Date("2015-01-18"), shipAmount: 1000, issueAmount: 1000, usedAmount: 0, unusedAmount: 1000, controlAmount: 1000},
                {batch: "1B159191-A20121", shipDate: new Date("2015-01-18"), shipAmount: 2000, issueAmount: 2000, usedAmount: 0, unusedAmount: 2000, controlAmount: 2000},
                {batch: "1B159191-A20131", shipDate: new Date("2015-01-18"), shipAmount: 3000, issueAmount: 3000, usedAmount: 0, unusedAmount: 3000, controlAmount: 3000}
            ];
            products.add(items);
            var gridProdcut = this._issueProduct._gridProduct;
            gridProdcut.data(products, {
                render: true
            });
            var $productDepartment = this._issueProduct.$anchor('productDepartment').find('select');
            $productDepartment.prop('disabled', false );
            $productDepartment.val('solar');
        } else if(mode === Editor.MODE.MGNT) {
            // action
            this._dd.hide();
            this._btnSend.hide();
            this._btnPrint.hide();

            addSendSample.call(this,4);
            addSignOffRecord.call(this);

            FieldUtil.setIsEditable(this.$el, false);

            // 避免讓 8D setIsEditable false
            add8D.call(this, 4);

            this._tabPanelEditor.select(0);
        } else if(mode === Editor.MODE.NOTIFICATION) {
            // action
            this._cmd.hide();

            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addSignOffRecord.call(this);

            FieldUtil.setIsEditable(this.$el, false);

            // 避免讓 8D setIsEditable false
            add8D.call(this, 4);

            this._tabPanelEditor.select(0);
        // 以下為 待簽核
        } else if(mode === Editor.MODE.INBOX_ORGANIZE) {
            this.title('組織專案團隊');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_ANALYZE) {
            this.title('初步原因分析');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            FieldUtil.setIsEditable(this._tabPanelEditor.get(3), true);

            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_SPECIFIC) {
            this.title('指定單位負責人');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_PROBLEMCAUSE) {
            this.title('問題原因分析');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addCauseAnalysis.call(this, 0);
            add8D.call(this, 0);

            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_STRATEGYVERIFY) {
            this.title('擬對策及廠內驗證');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            FieldUtil.setIsEditable(this._tabPanelEditor.get(3), true);

            addStrategyAnalysis.call(this, 0);
            add8D.call(this, 0);

            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_EFFECTVERIFY) {
            this.title('效果驗證');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_CLIENTVERIFY) {
            this.title('客戶端驗證');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_SENDSAMPLE) {
            this.title('送樣');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addSendSample.call(this, 0);
            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_CLIENT_VERIFYR_RESULT) {
            this.title('客戶端驗證結果');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            addClientVerify.call(this, 0);
            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_QUALITY_REPORT) {
            this.title('品保檢閱廠內結案報告');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_BUSINESS_REPORT) {
            this.title('業務檢閱廠內結案報告');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            add8D.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_CLIENT_INVEST) {
            this.title('客戶端調查');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            FieldUtil.setIsEditable(this._tabPanelEditor.get(3), true);
            addClientInvest.call(this, 0);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        } else if(mode === Editor.MODE.INBOX_QUALITY_EXTERNAL_REPORT) {
            this.title('技服檢閱廠外結案報告');
            // action
            this._dd.getAction(Dropdown.ACTION.DELETE).hide();

            FieldUtil.setIsEditable(this.$el, false);
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));
            this._tabPanelEditor.remove(this._tabPanelEditor.get(this._tabPanelEditor.size()-1));

            FieldUtil.setIsEditable(this._tabPanelEditor.get(3), true);
            addClientInvest.call(this, 0);
            FieldUtil.setIsEditable(this._tabPanelEditor.current(), false);
            addSignOffRecord.call(this, 0);
            addSignOff.call(this, 0);
        }
    }
    function buildActions() {

        this._cmd = new Commandbar().render();

        this._btnPrint = new Button({
            text: '列印',
            value: 'print',
            icon: 'fa-print'
        }).render();
        this._btnPrint.hide();
        this._cmd.add(this._btnPrint);
        
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
        this._dd.addAction(Dropdown.ACTION.DELETE);
        this._dd.addAction(Dropdown.ACTION.CLOSE);
        this._cmd.add(this._dd);

        this._cmd.attach(this.$el);
    }
    function onActionClick(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };
        this.trigger('send', event);
    }
    function addSignOff(index) {
        var mode = this._cfg.mode ;
        var signOffTitle = "簽核";
        this._signOff = new Signoff({
            title: signOffTitle,
            mode: mode
        }).render();
        this._tabPanelEditor.add(this._signOff, {
            title: signOffTitle,
            index: index
        });
    }
    function addSignOffRecord(index) {
        this._signOffRecord = new SignoffRecord().render();
        this._tabPanelEditor.add(this._signOffRecord, {
            title: "簽核紀錄",
            index: index
        });
    }
    function addSendSample(index) {
        this._sendSample = new SendSample().render();
        this._tabPanelEditor.add(this._sendSample, {
            title: "送樣資料",
            index: index
        });
    }
    function add8D(index) {
        var eightDTitle = "8D報告";
        this._eightDReport = new EightDReport({
            title: eightDTitle,
            mode: Editor.MODE.INBOX_QUALITY_REPORT
        }).render();

        this._tabPanelEditor.add(this._eightDReport , {
            title: eightDTitle,
            index: index
        });
    }
    function addCauseAnalysis(index){
        this._causeAnalysis = new CauseAnalysis({
            mode: "INBOX"
        }).render();
        this._tabPanelEditor.add(this._causeAnalysis, {
            title: "原因分析",
            index: index
        });
    }
    function addStrategyAnalysis(index) {
        this._strategyAnalysis = new StrategyAnalysis({
            mode: "INBOX"
        }).render();
        this._tabPanelEditor.add(this._strategyAnalysis, {
            title: "對策及驗證",
            index: index
        });
    }
    function addClientVerify(index) {
        this._clientVerify = new ClientVerify().render();
        this._tabPanelEditor.add(this._clientVerify, {
            title: "客戶端驗證",
            index: index
        });
    }
    function addClientInvest(index) {
        var clientInvestTitle = "客戶端調查";
        this._clientInvest = new ClientInvest({
            title: clientInvestTitle,
            mode: Editor.MODE.INBOX_CLIENT_INVEST
        }).render();
        this._tabPanelEditor.add(this._clientInvest, {
            title: clientInvestTitle,
            index: index
        });
    }
    function onTabPanelSelect(evt) {
        var currentWidget = evt.data ;
        //var title = currentWidget._cfg.title;
        if(currentWidget === this._signOff) {
            this._dd.show();
            this._btnSend.show();
            this._btnPrint.hide();
        } else if(currentWidget === this._eightDReport) {
            this._dd.hide();
            this._btnSend.hide();
            this._btnPrint.show();
        } else {
            this._dd.hide();
            this._btnSend.hide();
            this._btnPrint.hide();
        }

    }
    function buildTabPanel() {
        var anchors = this._anchors;
        var mode = this._cfg.mode ;
        anchors.$tabPanelEditor = this.$anchor('tabPanelEditor');

        this._tabPanelEditor = new TabPanel({
            tpl: tabPanelTpl,
            el: anchors.$tabPanelEditor
        }).render();

        // carousel必須放在TabPanel第一個
        buildBadPicture.call(this);

        buildIssueAbn.call(this);
        buildRelationalIssue.call(this);

        buildIssueStatus.call(this);
        buildIssueProduct.call(this);
        buildBasicInfo.call(this);

        LOGGER.debug("buildTabPanelIssue done");
    }
    function buildIssueAbn() {
        this._issueAbn = new IssueAbn().render();
        this._tabPanelEditor.add(this._issueAbn, {
            title: '異常/特採'
        });
    }
    function buildRelationalIssue() {
        this._relationalIssue = new RelationalIssue().render();
        this._tabPanelEditor.add(this._relationalIssue, {
            //index: 0,
            title: '相關客訴'
        });
    }
    function buildBadPicture() {
        this._badPicture = new Attachment().render();
        this._tabPanelEditor.add(this._badPicture, {
            //index: 0,
            title: '不良照片'
        });
    }
    function buildIssueStatus() {
        this._issueStatus = new IssueStatus().render();
        this._tabPanelEditor.add(this._issueStatus, {
            index: 0,
            title: '客訴情形'
        });
    }
    function buildIssueProduct() {
        this._issueProduct = new IssueProduct().render();
        this._tabPanelEditor.add(this._issueProduct, {
            index: 0,
            title: '客訴產品'
        });
    }
    function buildBasicInfo() {
        this._basicInfo = new BasicInfo().render();
        this._tabPanelEditor.add(this._basicInfo, {
            index: 0,
            title: '基本資料'
        })
    }
    function setEvents() {
        var mode = this._cfg.mode ;
        if(isInbox(mode) || mode === Editor.MODE.MGNT) {
            this.listenTo(this._tabPanelEditor, 'select', _.bind(onTabPanelSelect, this));
        }
    }
    function isInbox(mode) {
        return (mode.indexOf('INBOX') > -1) ;
    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _toolbarIssueProductPopup: undefined,
        _tabPanelEditor: undefined,
        _gridProduct: undefined,
        // tabs - new
        _basicInfo: undefined,
        _issueProduct: undefined,
        _issueStatus: undefined,
        _badPicture: undefined,
        _relationalIssue : undefined,
        _issueAbn: undefined,
        // tabs - inbox
        _signOff: undefined,
        _signOffRecord: undefined,
        _sendSample: undefined,
        _eightDReport: undefined,
        _causeAnalysis: undefined,
        _strategyAnalysis: undefined,
        _clientVerify: undefined,
        _clientInvest: undefined,
        // actions
        _cmd: undefined,
        _btnPrint: undefined,
        _btnSend: undefined,
        _dd: undefined
    };


    var Editor = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    Editor.COMMAND = {

    };


    Editor.MODE = {
        NEW: "NEW",
        DRAFT: "DRAFT",
        MGNT: "MGNT", // 客訴案件管理
        
        NOTIFICATION: "NOTIFICATION",

        INBOX_ORGANIZE: "INBOX_ORGANIZE",
        INBOX_SPECIFIC: "INBOX_SPECIFIC",
        INBOX_ANALYZE: "INBOX_ANALYZE",
        INBOX_PROBLEMCAUSE: "INBOX_PROBLEMCAUSE",
        INBOX_STRATEGYVERIFY: "INBOX_STRATEGYVERIFY",
        INBOX_EFFECTVERIFY: "INBOX_EFFECTVERIFY",
        INBOX_CLIENTVERIFY: "INBOX_CLIENTVERIFY",
        INBOX_SENDSAMPLE: "INBOX_SENDSAMPLE",
        INBOX_CLIENT_VERIFYR_RESULT: "INBOX_CLIENT_VERIFYR_RESULT",
        INBOX_QUALITY_REPORT: "INBOX_QUALITY_REPORT",
        INBOX_BUSINESS_REPORT: "INBOX_BUSINESS_REPORT",
        INBOX_CLIENT_INVEST: "INBOX_CLIENT_INVEST",
        INBOX_QUALITY_EXTERNAL_REPORT: "INBOX_QUALITY_EXTERNAL_REPORT"
    };

    return Editor;
});