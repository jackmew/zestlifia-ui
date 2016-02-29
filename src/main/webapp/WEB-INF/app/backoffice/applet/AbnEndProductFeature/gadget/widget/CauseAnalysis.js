/**
 * Created by jackho on 1/14/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , 'uweaver/widget/TabPanel' ,
    'text!../../tpl/widget/CauseAnalysis.html', 'text!../../tpl/widget/PopupPlus.html', 'text!../../tpl/widget/TabPanelPlus.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, TabPanel,
                                 tpl, popupPlusTpl, tabPanelPlusTpl, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/CauseAnalysis");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: CauseAnalysis.MODE.NEW
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $gridMan: undefined,
            $gridMachine: undefined,
            $gridMaterial: undefined,
            $gridMethod: undefined,
            $gridEnvironment: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$gridMan = this.$anchor('gridMan');
        anchors.$gridMachine = this.$anchor('gridMachine');
        anchors.$gridMaterial = this.$anchor('gridMaterial');
        anchors.$gridMethod = this.$anchor('gridMethod');
        anchors.$gridEnvironment = this.$anchor('gridEnvironment');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildGridMan.call(this);
        buildGridMachine.call(this);
        buildGridMaterial.call(this);
        buildGridMethod.call(this);
        buildGridEnvironment.call(this);
        buildToolbar.call(this);
        buildPopupPlus.call(this);

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
        if(mode === CauseAnalysis.MODE.NEW) {
            this.$anchor('gridMan').find('th:nth-child(5)').hide();
            this.$anchor('gridMan').find('td:nth-child(5)').hide();

            this._gridMachine.$el.find('th:nth-child(5)').hide();
            this._gridMachine.$el.find('td:nth-child(5)').hide();

            this._gridMaterial.$el.find('th:nth-child(5)').hide();
            this._gridMaterial.$el.find('td:nth-child(5)').hide();

            this._gridMethod.$el.find('th:nth-child(5)').hide();
            this._gridMethod.$el.find('td:nth-child(5)').hide();

            this._gridEnvironment.$el.find('th:nth-child(5)').hide();
            this._gridEnvironment.$el.find('td:nth-child(5)').hide();
        } else if(mode === CauseAnalysis.MODE.EIGHT_REPORT) {
            this.$anchor('panelMan').addClass('panel-warning');
            this.$anchor('panelMachine').addClass('panel-warning');
            this.$anchor('panelMaterial').addClass('panel-warning');

            this.$anchor('panelMethod').removeClass('panel-danger');//danger的prioriy比較高
            this.$anchor('panelMethod').addClass('panel-warning');

            this.$anchor('panelEnvironment').addClass('panel-warning');

        }
    }
    function buildGridMan() {
        //var anchors = this._anchors;
        //
        //var mans = new Collection();
        //var items = [
        //    {causeType: "外觀", causeExplanation: "局部電鍍之孔還有瑕疵", isReal: "是", questionDescription: "針對盲孔孔破的部位進行確認，發現到孔環有些有電鍍上一層銅層，有的無電鍍上一層銅層", attachment: ""},
        //    {causeType: "管理性", causeExplanation: "人為漏檢", isReal: "否", questionDescription: "漏檢", attachment: ""}
        //];
        //mans.add(items);
        //
        //this._gridMan = new Grid({
        //    el: anchors.$gridMan,
        //    data: mans,
        //    columns: [
        //        {text: "原因類別", dataIndex: "causeType"},
        //        {text: "原因說明", dataIndex: "causeExplanation"},
        //        {text: "真因", dataIndex: "isReal"},
        //        {text: "問題描述", dataIndex: "questionDescription"},
        //        {text: "附件", dataIndex: "attachment"}
        //    ],
        //    mode: Grid.MODE.SINGLE
        //}).render();
    }
    function buildGridMachine() {
        var anchors = this._anchors;

        var machines = new Collection();
        var items = [
            {causeType: "外觀", causeExplanation: "局部電鍍之孔還有瑕疵", isReal: "是", questionDescription: "針對盲孔孔破的部位進行確認，發現到孔環有些有電鍍上一層銅層，有的無電鍍上一層銅層", createPerson:"Joseph Wu", attachment: ""},
            {causeType: "管理性", causeExplanation: "人為漏檢", isReal: "否", questionDescription: "漏檢", createPerson:"Drake Liao", attachment: ""}
        ];
        machines.add(items);

        this._gridMachine = new Grid({
            el: anchors.$gridMachine,
            data: machines,
            columns: [
                {text: "原因類別", dataIndex: "causeType"},
                {text: "原因說明", dataIndex: "causeExplanation"},
                {text: "真因", dataIndex: "isReal"},
                {text: "問題描述", dataIndex: "questionDescription"},
                {text: "建立人員", dataIndex: "createPerson"},
                {text: "附件", dataIndex: "attachment"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildGridMaterial() {
        var anchors = this._anchors;

        var materials = new Collection();
        var items = [];
        materials.add(items);

        this._gridMaterial = new Grid({
            el: anchors.$gridMaterial,
            data: materials,
            columns: [
                {text: "原因類別", dataIndex: "causeType"},
                {text: "原因說明", dataIndex: "causeExplanation"},
                {text: "真因", dataIndex: "isReal"},
                {text: "問題描述", dataIndex: "questionDescription"},
                {text: "建立人員", dataIndex: "createPerson"},
                {text: "附件", dataIndex: "attachment"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildGridMethod() {
        var anchors = this._anchors;

        var methods = new Collection();
        var items = [];
        methods.add(items);

        this._gridMethod = new Grid({
            el: anchors.$gridMethod,
            data: methods,
            columns: [
                {text: "原因類別", dataIndex: "causeType"},
                {text: "原因說明", dataIndex: "causeExplanation"},
                {text: "真因", dataIndex: "isReal"},
                {text: "問題描述", dataIndex: "questionDescription"},
                {text: "建立人員", dataIndex: "createPerson"},
                {text: "附件", dataIndex: "attachment"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildGridEnvironment() {
        var anchors = this._anchors;

        var environments = new Collection();
        var items = [];
        environments.add(items);

        this._gridEnvironment = new Grid({
            el: anchors.$gridEnvironment,
            data: environments,
            columns: [
                {text: "原因類別", dataIndex: "causeType"},
                {text: "原因說明", dataIndex: "causeExplanation"},
                {text: "真因", dataIndex: "isReal"},
                {text: "問題描述", dataIndex: "questionDescription"},
                {text: "建立人員", dataIndex: "createPerson"},
                {text: "附件", dataIndex: "attachment"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildToolbar() {
        var anchors = this._anchors;
        anchors.$toolbar = this.$anchor('toolbar');

        this._toolbar = new Triggers({
            el: anchors.$toolbar,
            selector: "i"
        }).render();

        this._toolbar.on("trigger", _.bind(onToolbarSelect, this));

        LOGGER.debug("buildToolbar done");
    }
    function buildPopupPlus() {

        this._popupMan = new Popup({
            tpl: popupPlusTpl
        }).render();
        this._popupMan.hide();
        var popupMan = this._popupMan;
        var tabPanelMan = new TabPanel({
            tpl: tabPanelPlusTpl,
            el: popupMan.$anchor('tabPanelPlus')
        }).render();

        this._popupMachine = new Popup({
            tpl: popupPlusTpl
        }).render();
        this._popupMachine.hide();
        var popupMachine = this._popupMachine;
        var tabPanelMachine = new TabPanel({
            tpl: tabPanelPlusTpl,
            el: popupMachine.$anchor('tabPanelPlus')
        }).render();

        this._popupMaterial = new Popup({
            tpl: popupPlusTpl
        }).render();
        this._popupMaterial.hide();
        var popupMaterial = this._popupMaterial;
        var tabPanelMaterial = new TabPanel({
            tpl: tabPanelPlusTpl,
            el: popupMaterial.$anchor('tabPanelPlus')
        }).render();

        this._popupMethod = new Popup({
            tpl: popupPlusTpl
        }).render();
        this._popupMethod.hide();
        var popupMethod = this._popupMethod;
        var tabPanelMethod = new TabPanel({
            tpl: tabPanelPlusTpl,
            el: popupMethod.$anchor('tabPanelPlus')
        }).render();

        this._popupEnvironment = new Popup({
            tpl: popupPlusTpl
        }).render();
        this._popupEnvironment.hide();
        var popupEnvironment = this._popupEnvironment;
        var tabPanelEnvironment = new TabPanel({
            tpl: tabPanelPlusTpl,
            el: popupEnvironment.$anchor('tabPanelPlus')
        }).render();
    }
    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === "MAN_PLUS"){
            popPlusMan.call(this);
        } else if(value === "MACHINE_PLUS") {
            popPlusMachine.call(this);
        } else if(value === "MATERIAL_PLUS") {
            popPlusMaterial.call(this);
        } else if(value === "METHOD_PLUS") {
            popPlusMethod.call(this);
        } else if(value === "ENVIRONMENT_PLUS") {
            popPlusEnvironment.call(this);
        }
    }
    function popPlusMan() {
        this._popupMan.$anchor('title').text('人(Man)-原因分析');
        //this._popupMan.$anchor('popupPanel').addClass('panel-warning');
        this._popupMan.show();
    }
    function popPlusMachine() {
        this._popupMachine.$anchor('title').text('機器(Machine)-原因分析');
        //this._popupMachine.$anchor('popupPanel').addClass('panel-warning');
        this._popupMachine.show();
    }
    function popPlusMaterial() {
        this._popupMaterial.$anchor('title').text('材料(Material)-原因分析');
        //this._popupMaterial.$anchor('popupPanel').addClass('panel-warning');
        this._popupMaterial.show();
    }
    function popPlusMethod() {
        this._popupMethod.$anchor('title').text('方法(Method)-原因分析');
        //this._popupMethod.$anchor('popupPanel').addClass('panel-warning');
        this._popupMethod.show();
    }
    function popPlusEnvironment() {
        this._popupEnvironment.$anchor('title').text('環境(Environment)-原因分析');
        //this._popupEnvironment.$anchor('popupPanel').addClass('panel-warning');
        this._popupEnvironment.show();
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

        _gridMan: undefined,
        _popupMan: undefined,

        _gridMachine: undefined,
        _popupMachine: undefined,

        _gridMaterial: undefined,
        _popupMaterial: undefined,

        _gridMethod: undefined,
        _popupMethod: undefined,

        _gridEnvironment: undefined,
        _popupEnvironment: undefined


    };

    var CauseAnalysis = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    CauseAnalysis.MODE = {
        NEW: "NEW",
        INBOX: "INBOX",
        EIGHT_REPORT: "EIGHT_REPORT"
    };

    return CauseAnalysis;
});