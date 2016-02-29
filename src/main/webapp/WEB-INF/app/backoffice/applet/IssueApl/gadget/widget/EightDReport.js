/**
 * Created by jackho on 1/22/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil', '../../../../widget/Panel',
    'text!../../tpl/widget/EightDReport.html', './IssueStatus' , './BasicInfo', 'applet/AbnEndProductFeature/gadget/widget/CauseAnalysis',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil, Panel,
                                 tpl, IssueStatus, BasicInfo, CauseAnalysis, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/EightDReport");

    var declare = lang.declare;
    var i18n = uweaver.i18n;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $dropdown: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        options || (options = {});
        _.defaults(options, defaults);

        var anchors = this._anchors;
        anchors.$d1 = this.$anchor('d1');
        anchors.$d2 = this.$anchor('d2');
        anchors.$d3 = this.$anchor('d3');
        anchors.$d4 = this.$anchor('d4');
        anchors.$d5 = this.$anchor('d5');
        anchors.$d6 = this.$anchor('d6');
        anchors.$d7 = this.$anchor("d7");
        anchors.$d8 = this.$anchor("d8");

        this.hide();

        buildDropdown.call(this);

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
    function buildDropdown() {
        var anchors = this._anchors;
        anchors.$dropdown = this.$('.dropdown');

        this._dropdownD = new Triggers({
            el: anchors.$dropdown,
            selector: "a"
        }).render();

        this._dropdownD.on("trigger", _.bind(onDSelect, this));

        LOGGER.debug("buildDropdown done");
    }
    function onDSelect(evt) {
        var anchors = this._anchors;

        var value = evt.data.value;
        LOGGER.debug("onDSelect - value: ${0}", value);

        anchors.$d1.hide();
        anchors.$d2.hide();
        anchors.$d3.hide();
        anchors.$d4.hide();
        anchors.$d5.hide();
        anchors.$d6.hide();
        anchors.$d7.hide();
        anchors.$d8.hide();


        if(value === 'D1') {
            buildD1.call(this);
        } else if(value === 'D2') {
            buildD2.call(this);
        } else if(value === 'D3') {
            buildD3.call(this);
        } else if(value === 'D4') {
            buildD4.call(this);
        } else if(value === 'D5') {
            buildD5.call(this);
        } else if(value === 'D6') {
            buildD6.call(this);
        } else if(value === 'D7') {
            buildD7.call(this);
        } else if(value === 'D8') {
            buildD8.call(this);
        } else if(value === 'DALL') {
            buildDAll.call(this);
        }
    }
    function buildD1() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD1)) {
            this._panelD1 = new Panel({
                collapse: true,
                title: i18n.translate('Team Formation'),
                theme: Panel.THEME.INFO
            }).render();

            var $gridD1 = this._panelD1._anchors.$content;

            // build grid
            var drafts = new Collection();
            var items = [
                {team: "技服", unit: "N", response: "xxx"},
                {team: "生產", unit: "Y", response: "xxx"},
                {team: "技術", unit: "N", response: ""},
                {team: "倉管", unit: "N", response: "xxx"},
                {team: "品保", unit: "N", response: ""},
                {team: "研發", unit: "N", response: "xxxx"}
            ];
            drafts.add(items);

            var renderer = function(item) {
                if(item.get('unit')!=='Y') return '';
                return '<i value="THUMB_UP" data-uw-params="' + item.id + '" class="fa fa-thumbs-o-up uw-hover uw-clickable" style="font-size:24px;"></i>';
            };

            this._gridD1 = new Grid({
                el: '<table class="table table-bordered table-striped table-hover uw-selectable"></table>',
                data: drafts,
                columns: [
                    {text: "專案團隊", dataIndex: "team"},
                    {text: "權責單位", dataIndex: "unit", renderer: renderer},
                    {text: "負責人", dataIndex: "response"}
                ],
                mode: Grid.MODE.SINGLE
            }).render();

            this._panelD1.setContent(this._gridD1);
            this._panelD1.attach(anchors.$d1);
        }

        anchors.$d1.show();
    }
    function buildD2() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD2)) {

            this._panelD2 = new Panel({
                collapse: true,
                title: i18n.translate('Problem Description'),
                theme: Panel.THEME.INFO
            }).render();

            this._issueStatus = new IssueStatus().render();
            FieldUtil.setIsEditable(this._issueStatus, false);
            this._panelD2.setContent(this._issueStatus);
            this._panelD2.attach(anchors.$d2);
        }

        anchors.$d2.show();
    }
    function buildD3() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD3)) {

            this._panelD3 = new Panel({
                collapse: true,
                title: i18n.translate('interim containment actions'),
                theme: Panel.THEME.INFO
            }).render();

            this._basicInfo = new BasicInfo().render();
            this._basicInfo.$anchor('basicInfoSection1').hide();
            this._basicInfo.$anchor('basicInfoSection2').hide();
            FieldUtil.setIsEditable(this._basicInfo, false);
            this._panelD3.setContent(this._basicInfo);

            this._panelD3.attach(anchors.$d3);
        }

        anchors.$d3.show();
    }
    function buildD4() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD4)) {

            this._panelD4 = new Panel({
                collapse: true,
                title: i18n.translate('root cause analysis'),
                theme: Panel.THEME.INFO
            }).render();

            this._causeAnalysis = new CauseAnalysis({
                mode: CauseAnalysis.MODE.EIGHT_REPORT
            }).render();
            FieldUtil.setIsEditable(this._causeAnalysis, false);
            this._panelD4.setContent(this._causeAnalysis);
            this._panelD4.attach(anchors.$d4);
        }

        anchors.$d4.show();
    }
    function buildD5() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD5)) {
            this._panelD5 = new Panel({
                collapse: true,
                title: i18n.translate('corrective actions'),
                theme: Panel.THEME.INFO
            }).render();

            buildD5GridShort.call(this);
            buildD5GridLong.call(this);

            this._panelD5.setContent(this._panelD5Short);
            this._panelD5.setContent(this._panelD5Long);

            this._panelD5.attach(anchors.$d5);
        }

        anchors.$d5.show();
    }
    function buildD5GridShort() {
        var anchors = this._anchors;

        this._panelD5Short = new Panel({
            title: '短期對策',
            mode: Panel.MODE.GRID,
            marginBottom: true,
            theme: Panel.THEME.WARNING
        }).render();
        var $gridD5Short = this._panelD5Short._anchors.$content;

        var shorts = new Collection();
        var items = [
            {description: "提供品質保證特採客戶端已壓合的產品", status: "已執行", completeDate: "2015-12-31", deadline: "2015-12-31", no: "AA0912300"},
            {description: "Bar code label 備註欄加註'分散三次+過濾'字樣內容", status: "執行中", completeDate: "2016-12-31", deadline: "2016-12-31", no: "AB0912300"}
        ];
        shorts.add(items);

        this._gridShort = new Grid({
            el: $gridD5Short,
            data: shorts,
            columns: [
                {text: "對策描述", dataIndex: "description"},
                {text: "執行狀況", dataIndex: "status"},
                {text: "完成日", dataIndex: "completeDate"},
                {text: "文件到期日", dataIndex: "deadline"},
                {text: "文件編號", dataIndex: "no"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildD5GridLong() {
        var anchors = this._anchors;

        this._panelD5Long = new Panel({
            title: '永久性對策',
            mode: Panel.MODE.GRID,
            theme: Panel.THEME.WARNING
        }).render();
        var $gridD5Long = this._panelD5Long._anchors.$content;

        var longs = new Collection();
        var items = [
            {description: "提供品質保證特採客戶端已壓合的產品", status: "已執行", completeDate: "2015-12-31", deadline: "2015-12-31", no: "AA0912300"},
            {description: "Bar code label 備註欄加註'分散三次+過濾'字樣內容", status: "執行中", completeDate: "2016-12-31", deadline: "2016-12-31", no: "AB0912300"}
        ];
        longs.add(items);

        this._gridLong = new Grid({
            el: $gridD5Long,
            data: longs,
            columns: [
                {text: "對策描述", dataIndex: "description"},
                {text: "執行狀況", dataIndex: "status"},
                {text: "完成日", dataIndex: "completeDate"},
                {text: "文件到期日", dataIndex: "deadline"},
                {text: "文件編號", dataIndex: "no"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildD6() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD6)) {
            this._panelD6 = new Panel({
                title: i18n.translate('verification of corrective actions'),
                collapse: true,
                theme: Panel.THEME.INFO
            }).render();

            var effects = new Collection();
            var items = [
                {description: "提供品質保證特採客戶端已壓合的產品", result: "成功", status: "7/30~8/3 人員取用膠料狀況無異常發生</br>7/30~8/3品保卡控分散執行成效無異常發生"},
                {description: "Bar code label 備註欄加註'分散三次+過濾'字樣內容", result: "成功", status: "7/30~8/3 人員取用膠料狀況無異常發生</br> 7/30~8/3品保卡控分散執行成效無異常發生"}
            ];
            effects.add(items);

            this._gridEffectVerify = new Grid({
                el: '<table class="table table-bordered table-striped table-hover uw-selectable"></table>',
                data: effects,
                columns: [
                    {text: "對策描述", dataIndex: "description"},
                    {text: "驗證結果", dataIndex: "result"},
                    {text: "驗證情形", dataIndex: "status"}
                ],
                mode: Grid.MODE.SINGLE
            }).render();

            this._panelD6.setContent(this._gridEffectVerify);
            this._panelD6.attach(anchors.$d6);
        }

        anchors.$d6.show();
    }

    function buildD7() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD7)) {
            this._panelD7 = new Panel({
                title: i18n.translate('preventive actions'),
                collapse: true,
                theme: Panel.THEME.INFO
            }).render();

            var prevents = new Collection();
            var items = [
                {description: "提供品質保證特採客戶端已壓合的產品", prevent: "提供品質保證特採客戶端已壓合的產品"},
                {description: "Bar code label 備註欄加註'分散三次+過濾'字樣內容", prevent: "增印一張Bar code label於桶身"}
            ];
            prevents.add(items);

            this._gridPrevent = new Grid({
                el: '<table class="table table-bordered table-striped table-hover uw-selectable"></table>',
                data: prevents,
                columns: [
                    {text: "對策描述", dataIndex: "description"},
                    {text: "防患機制", dataIndex: "prevent"}
                ],
                mode: Grid.MODE.SINGLE
            }).render();

            this._panelD7.setContent(this._gridPrevent);
            this._panelD7.attach(anchors.$d7);
        }
        anchors.$d7.show();
    }
    function buildD8() {
        var anchors = this._anchors;

        if(_.isUndefined(this._panelD8)) {
            this._panelD8 = new Panel({
                title: i18n.translate('standardization'),
                collapse: true,
                theme: Panel.THEME.INFO
            }).render();

            //var $gridNormalize = this._panelD8._anchors.$content;

            var normalizes = new Collection();
            var items = [
                {no: "AA0912300"},
                {no: "AB0912300"}
            ];
            normalizes.add(items);

            this._gridNormalize = new Grid({
                el: '<table class="table table-bordered table-striped table-hover uw-selectable"></table>',
                data: normalizes,
                columns: [
                    {text: "文件標號", dataIndex: "no"}
                ],
                mode: Grid.MODE.SINGLE
            }).render();

            this._panelD8.setContent(this._gridNormalize);
            this._panelD8.attach(anchors.$d8);
        }

        anchors.$d8.show();
    }
    function buildDAll() {
        buildD1.call(this);
        buildD2.call(this);
        buildD3.call(this);
        buildD4.call(this);
        buildD5.call(this);
        buildD6.call(this);
        buildD7.call(this);
        buildD8.call(this);
    }
    var props = {
        _anchors: undefined,
        _dropdownD: undefined,
        // D1
        _panelD1: undefined,
        _gridD1: undefined,
        // D2
        _panelD2: undefined,
        _issueStatus: undefined,
        // D3
        _panelD3: undefined,
        _basicInfo: undefined,
        // D4
        _panelD4: undefined,
        _causeAnalysis: undefined,
        // D5
        _panelD5: undefined,
        _panelD5Short: undefined,
        _panelD5Long: undefined,
        _gridShort: undefined,
        _gridLong: undefined,
        // D6
        _panelD6: undefined,
        _gridEffectVerify: undefined,
        // D7
        _panelD7: undefined,
        _gridPrevent: undefined,
        // D8
        _panelD8: undefined,
        _gridNormalize: undefined
    };

    var EightDReport = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    EightDReport.MODE = {
        QUALITY_REPORT: "QUALITY_REPORT",
        BUSINESS_REPORT: "BUSINESS_REPORT"
    };

    return EightDReport;
});