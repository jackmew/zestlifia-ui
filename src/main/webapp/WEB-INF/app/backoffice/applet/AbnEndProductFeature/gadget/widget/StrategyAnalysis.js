/**
 * Created by jackho on 1/15/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil' ,
    'text!../../tpl/widget/StrategyAnalysis.html', 'text!../../tpl/widget/PopupPlusStrategy.html',
    'text!../../tpl/widget/PopupPlusStrategyTabPanel.html',
    'uweaver/widget/TabPanel' ,
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, popupPlusStrategyTpl, popupPlusStrategyTabPanelTpl, TabPanel, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/StrategyAnalysis");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: StrategyAnalysis.MODE.NEW
        };

        _.defaults(this._cfg, defaults);

        this._anchors = {
            $toolbar: undefined,
            $gridStrategy: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$toolbar = this.$anchor('toolbar');
        anchors.$gridStrategy = this.$anchor('gridStrategy');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildToolbar.call(this);
        buildGridStrategy.call(this);
        setMode.call(this);

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
        var mode = this._cfg.mode;
        if(mode === StrategyAnalysis.MODE.NEW) {
            this._gridStrategy.$el.find('th:nth-child(3)').hide();
            this._gridStrategy.$el.find('td:nth-child(3)').hide();
        } else if(mode === StrategyAnalysis.MODE.INBOX) {
            var $effectVerify = this.$anchor('effectVerify');

            var $verifyStatus = $effectVerify.find('textarea[name="verifyStatus"]');
            $verifyStatus.val('7/30~8/3 人員取用膠料狀況無異常發生\n7/30~8/3 品保卡控分散執行成效無異常發生');

            FieldUtil.setIsEditable($effectVerify, false);
            this.listenTo(this._gridStrategy, 'select', function() {
                $effectVerify.show();
            });

            this.listenTo(this._gridStrategy, 'deselect', function() {
                $effectVerify.hide();
            });

        }
    }
    function buildGridStrategy() {
        var anchors = this._anchors;

        var strategies = new Collection();
        var items = [
            {strategyType: "短期性", strategyDescription: "改用A供應商原料",                            foolProof: "XXX", executeStatus: "已執行", completeDate: "20151223" ,docDeadline: "20151231", docNo: "AT20150190"},
            {strategyType: "永久性", strategyDescription: "在膠料標示上採用制式之分散三次標示，鑑別度較高。",  foolProof: "XXX", executeStatus: "執行中", completeDate: "20160630" ,docDeadline: "20161231", docNo: "AT20150210"}
        ];
        strategies.add(items);

        this._gridStrategy = new Grid({
            el: anchors.$gridStrategy,
            data: strategies,
            columns: [
                {text: "對策種類", dataIndex: "strategyType"},
                {text: "對策描述", dataIndex: "strategyDescription"},
                {text: "防患機制", dataIndex: "foolProof"},
                {text: "執行狀況", dataIndex: "executeStatus"},
                {text: "完成日", dataIndex: "completeDate"},
                {text: "文件到期日", dataIndex: "docDeadline"},
                {text: "文件編號", dataIndex: "docNo"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildToolbar() {
        var anchors = this._anchors;

        this._toolbar = new Triggers({
            el: anchors.$toolbar,
            selector: "i"
        }).render();

        this._toolbar.on("trigger", _.bind(onToolbarSelect, this));

        LOGGER.debug("buildToolbar done");
    }
    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === "PLUS") {
            popPlus.call(this);
        }
    }
    function popPlus() {
        var mode = this._cfg.mode;
        if(this._popupPlus != undefined) {
            this._popupPlus.show();
        } else {
            this._popupPlus = new StrategyPlusPopup({
                tpl: popupPlusStrategyTpl,
                mode: mode
            }).render();

            var context = this;
            context._tabPanelPlusStrategy = new TabPanel({
                tpl: popupPlusStrategyTabPanelTpl,
                el: context._popupPlus.$anchor('tabPanelPlusStrategy')
            }).render();


            this._popupPlus.show();
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
        _title: undefined,
        _toolbar: undefined,
        _gridStrategy: undefined,
        // popup plus
        _popupPlus: undefined,
        _tabPanelPlusStrategy: undefined
    };

    var StrategyAnalysis = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    StrategyAnalysis.MODE = {
        NEW: "NEW",
        INBOX: "INBOX"
    };

    var StrategyPlusPopup = declare(Popup, {
        _anchors: undefined,
        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var defaults = {
                mode: StrategyAnalysis.MODE.NEW
            };
            var cfg = this._cfg;
            _.defaults(cfg, defaults);

            cfg.tpl = popupPlusStrategyTpl;
        },
        render: function(options) {
            Popup.prototype.render.apply(this, arguments);

            this._anchors = {
                $foolProof: this.$anchor('foolProof'),
                $verifyResult: this.$anchor('verifyResult'),
                $verifyStatus: this.$anchor('verifyStatus'),
                $verifyStaff: this.$anchor('verifyStaff')
            };

            this.showFoolProof.call(this);

            return this;
        },
        showFoolProof: function() {
            var mode = this._cfg.mode ;
            if(mode === StrategyAnalysis.MODE.INBOX) {
                this._anchors.$foolProof.show();
                this._anchors.$verifyResult.show();
                this._anchors.$verifyStatus.show();
                this._anchors.$verifyStaff.show();
            }
        }

    }, {});

    return StrategyAnalysis;
});