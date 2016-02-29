/**
 * Created by jackho on 2/17/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers',
    'widget/Gridcrud', 'widget/FormLayout', 'widget/Select', 'widget/Input', 'widget/InputButton',
    'view/CustomerForm',
    'uweaver/data/Collection',
    'uweaver/Logger'], function(_, $, Gadget, Triggers,
                                Gridcrud, FormLayout,
                                Select, Input, InputButton,
                                CustomerForm,
                                Collection, Logger) {

    var LOGGER =  new Logger("IssueMgnt/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
        };
        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
        };

        this._title = i18n.translate("客訴案件管理");
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        buildForm.call(this);
        buildGrid.call(this);

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
    function buildForm() {
        this._fl = new FormLayout().render();
        //this.$el.append(this._fl.$el);
        this._fl.attach(this.$el);


        var row1 = this._fl.addRow();

        var dateIssueStart = new Input({
            caption: "客訴日期起",
            isRequired: true,
            type: Input.TYPE.DATE
        }).render();
        this._fl.addField(row1, dateIssueStart, '');

        var dateIssueEnd = new Input({
            caption: "客訴日期迄",
            isRequired: true,
            type: Input.TYPE.DATE
        }).render();
        this._fl.addField(row1, dateIssueEnd, '');

        var ibSearch = new InputButton({
            mode: InputButton.MODE.SEARCH,
            isTrigger: true
        }).render();
        ibSearch.on('search', _.bind(function(evt) {
            search.call(this);
        }, this));
        this._fl.addField(row1, ibSearch, '');


        var row2 = this._fl.addRow();

        var selectProductGroup = new Select({
            caption: '產品事業群'
        }).render();
        this._fl.addField(row2, selectProductGroup, '');
        // 客戶
        var inputButtonCustomer = new InputButton({
            caption: '客戶',
            mode: InputButton.MODE.SIDE,
            isTrigger: true
        }).render();
        inputButtonCustomer.on('search', _.bind(function(evt) {
            modalCustomer.call(this);
        }, this));
        this._fl.addField(row2, inputButtonCustomer, '');

        this._modalCustomer = inputButtonCustomer._modal;
        var customerForm = new CustomerForm().render();
        this._modalCustomer.setContent(customerForm);


        // 品目
        var inputItem = new Input({
            caption: '品目'
        }).render();
        this._fl.addField(row2, inputItem, '');


        var row3 = this._fl.addRow();
        var selectIssueStatus = new Select({
            caption: '客訴狀態',
            options: [
                {text: '未結案', value: 'yet'},
                {text: '已結案', value: 'done'}
            ]
        }).render();
        this._fl.addField(row3, selectIssueStatus, '');

        var inputButtonAppearance = new InputButton({
            caption: '外觀',
            mode: InputButton.MODE.SIDE
        }).render();
        this._fl.addField(row3, inputButtonAppearance, '');

        var inputButtonFeature = new InputButton({
            caption: '物性',
            mode: InputButton.MODE.SIDE
        }).render();
        this._fl.addField(row3, inputButtonFeature, '');


        var row4 = this._fl.addRow();

        var inputButtonManagement = new InputButton({
            caption: '管理性',
            mode: InputButton.MODE.SIDE
        }).render();
        this._fl.addField(row4, inputButtonManagement, '');

        var inputButtonROHS = new InputButton({
            caption: 'ROHS',
            mode: InputButton.MODE.SIDE
        }).render();
        this._fl.addField(row4, inputButtonROHS, '');

    }
    function search() {
        LOGGER.debug('search');

        var Collect = declare(Collection, {
            resource: 'issueMgnt'
        });
        var collect = new Collect();
        collect.fetch({async: false});

        this._gridcrud.data(collect);
    }
    function modalCustomer() {
        this._modalCustomer.show();

    }
    function buildGrid() {
        //var abns = new Collection();
        //var items = [
        //    {no: "IT2015120071", type: "驗退", createArea: "台灣地區", abnAttribute: "IQC", createDate: "2015-12-03", currentLevel: "6 品保SQE"},
        //    {no: "IT2015120073", type: "委外成品", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-04", currentLevel: "5 資材主管"},
        //    {no: "IT2015120075", type: "成品特性", createArea: "台灣地區", abnAttribute: "PQC", createDate: "2015-12-15", currentLevel: "4 處理單位人員"},
        //    {no: "IT2015120062", type: "成品外觀", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-01", currentLevel: ""}
        //];
        //abns.add(items);

        this._gridcrud = new Gridcrud({
            //data: abns,
            pagination: {
                is: true,
                render: false
            },
            columns: [
                {text: "客戶", dataIndex: "customer"},
                {text: "客訴日期", dataIndex: "date"},
                {text: "客訴單號", dataIndex: "no"},
                {text: "品目", dataIndex: "item"},
                {text: "客訴狀態", dataIndex: "status"},
                {text: "目前關卡", dataIndex: "currentLevel"},
                {text: "受理人", dataIndex: "receiver"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();

        this._gridcrud._grid.on('select', _.bind(onGridSelect, this));

        this.$el.append(this._gridcrud.$el);
    }
    function onGridSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('gridSelect', event);
    }

    var props = {
        _anchors: undefined,

        _fl: undefined,
        _grid: undefined,

        // modals
        _modalCustomer: undefined
    };

    var Finder = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Finder.COMMAND = {
    };

    return Finder;
});