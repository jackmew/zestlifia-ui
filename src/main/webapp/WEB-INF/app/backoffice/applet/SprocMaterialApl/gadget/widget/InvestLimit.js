/**
 * Created by jackho on 1/13/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../widget/Panel', '../../../../widget/Gridcrud',
    'text!../../tpl/widget/PopupPlusCustomer.html', 'text!../../tpl/widget/PopupPlusItem.html', 'text!../../tpl/widget/PopupPlusMachine.html',
    'widget/FormLayout', 'widget/CRBox', 'widget/Select', 'widget/Gridcrud', 'widget/Modal',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Panel, Gridcrud,
                                 popupPlusCustomerTpl, popupPlusItemTpl, popupPlusMachineTpl,
                                 FormLayout, CRBox, Select, Gridcrud, Modal,
                                 Logger) {

    var LOGGER = new Logger("SprocMaterialApl/InvesetLimit");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            mode: undefined
        };
        var cfg = this._cfg;


        _.defaults(cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        buildCheckLimit.call(this);

        buildCustomer.call(this);
        buildMachine.call(this);
        buildItem.call(this);

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
    function buildCheckLimit() {
        var fl = new FormLayout().render();

        this._checkLimit = new CRBox({
            caption: '限制項目',
            options: [
                {text: '客戶', value: 'customer', checked: true},
                {text: '機台', value: 'machine', checked: true},
                {text: '品目', value: 'item', checked: true}
            ],
            type: CRBox.TYPE.CHECK
        }).render();

        var context = this ;
        this.listenTo(this._checkLimit, 'valueChange', _.bind(function(evt){
            if(this._checkLimit.getValue().indexOf('customer') === -1) {
                context._radioCustomer.reset();
                context._gridCustomer.hide();
            }
            if(this._checkLimit.getValue().indexOf('machine') === -1) {
                context._radioMachine.reset();
                context._gridMachine.hide();
            }
            if(this._checkLimit.getValue().indexOf('item') === -1) {
                context._radioItem.reset();
                context._gridItem.hide();
            }

        }, this));

        fl.addRow().addField(this._checkLimit, '');
        fl.attach(this.$el);
    }
    function buildCustomer() {
        this._panelCustomer = new Panel({
            collapse: true,
            title: '客戶',
            theme: Panel.THEME.WARNING
        }).render();
        this._panelCustomer.attach(this.$el);

        this._flCustomer = new FormLayout().render();
        this._panelCustomer.setContent(this._flCustomer);

        var row1 = this._flCustomer.addRow();

        this._radioCustomer = new CRBox({
            name: 'customer',
            options: [
                {text: "限出", value: "Y"},
                {text: "限不出", value: "N"}
            ]
        }).render();
        row1.addField(this._radioCustomer, '', 0, 3);

        var customers = new Collection();
        var items = [
            {customerArea: '大陸華南', customerName: ''},
            {customerArea: '大陸臻鼎', customerName: '宏啟勝'},
            {customerArea: '南灣北區', customerName: '恒通'},
            {customerArea: '大陸華東 ', customerName: ''},
            {customerArea: '台灣北區 ', customerName: '豪伯-太陽能'}
        ];
        customers.add(items);

        this._gridCustomer = new Gridcrud({
            data: customers,
            columns: [
                {text: "客戶地區別", dataIndex: "customerArea", field: {'type': 'Select'}},
                {text: "客戶名稱", dataIndex: "customerName", field: {'type': 'Select'}}
            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.MINUS, tip: {title: "MINUS"}},
                    {name: Gridcrud.TOOL.PLUS , tip: {title: "PLUS"} },
                    {name: Gridcrud.TOOL.EDIT , tip: {title: "EDIT"} }
                ]
            },
            mode: Grid.MODE.SINGLE
        }).render().hide();
        var row2 = this._flCustomer.addRow();
        row2.addGrid(this._gridCustomer);

        //var radioCustomerLimit = new CRBox({
        //    type: CRBox.TYPE.CHECK,
        //    options: [
        //        {text: '限制', value: 'Y'}
        //    ]
        //}).render();
        //radioCustomerLimit.$el.find('.checkbox-inline').css('padding-top', '0px');
        //this.listenTo(radioCustomerLimit, 'valueChange', function(evt) {
        //    console.log(radioCustomerLimit.getValue());
        //});
        //
        //this._panelCustomer.appendHead(radioCustomerLimit.$el, {
        //    align: 'left'
        //});

        var context = this ;
        // radio
        this.listenTo(this._radioCustomer, 'valueChange', function(evt) {
            //evt.data.value
            context._gridCustomer.show();
        });
    }

    function buildMachine() {
        this._panelMachine = new Panel({
            collapse: true,
            title: '機台',
            theme: Panel.THEME.WARNING
        }).render();
        this._panelMachine.attach(this.$el);

        this._flMachine = new FormLayout().render();
        this._panelMachine.setContent(this._flMachine);

        var row1 = this._flMachine.addRow();

        this._radioMachine = new CRBox({
            name: 'machine',
            options: [
                {text: "限投", value: "Y"},
                {text: "限不投", value: "N"}
            ]
        }).render();
        row1.addField(this._radioMachine, '', 0, 3);

        var machines = new Collection();
        var items = [
            {machine: 'KSA1 覆捲機/檢查機'},
            {machine: 'KSA2 覆捲機/檢查機'},
            {machine: 'KNB1 1號烘箱'}
        ];
        machines.add(items);

        this._gridMachine = new Gridcrud({
            data: machines,
            columns: [
                {text: "機台", dataIndex: "machine", field: {'type': 'Select'}}
            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.MINUS, tip: {title: "MINUS"}},
                    {name: Gridcrud.TOOL.PLUS , tip: {title: "PLUS"} }
                ]
            },
            mode: Grid.MODE.SINGLE
        }).render().hide();
        var row2 = this._flMachine.addRow();
        row2.addGrid(this._gridMachine);

        var context = this ;
        // radio
        this.listenTo(this._radioMachine, 'valueChange', function(evt) {
            //evt.data.value
            context._gridMachine.show();
        });
    }
    function buildItem() {
        this._panelItem = new Panel({
            collapse: true,
            title: '品目',
            theme: Panel.THEME.WARNING
        }).render();
        this._panelItem.attach(this.$el);

        this._flItem = new FormLayout().render();
        this._panelItem.setContent(this._flItem);

        var row1 = this._flItem.addRow();

        this._radioItem= new CRBox({
            name: 'item',
            options: [
                {text: "限投", value: "Y"},
                {text: "限不投", value: "N"}
            ]
        }).render();
        row1.addField(this._radioItem, '', 0, 3);

        var machines = new Collection();
        var items = [
            {machine: 'KSA1 覆捲機/檢查機'},
            {machine: 'KSA2 覆捲機/檢查機'},
            {machine: 'KNB1 1號烘箱'}
        ];
        machines.add(items);

        var temps = new Collection();
        var models = [
            {item: '33020527'},
            {item: '31100003', materialNo: '9301080120001'},
            {item: '31100004', materialNo: '9301080130001'}
        ];
        temps.add(models);

        this._gridItem = new Gridcrud({
            data: temps,
            columns: [
                {text: "品目", dataIndex: "item", field: {'type': 'Select'}},
                {text: "料號", dataIndex: "materialNo", field: {'type': 'Select'}}
            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.MINUS, tip: {title: "MINUS"}},
                    {name: Gridcrud.TOOL.PLUS , tip: {title: "PLUS"} }
                ]
            },
            mode: Grid.MODE.SINGLE
        }).render().hide();
        var row2 = this._flItem.addRow();
        row2.addGrid(this._gridItem);

        var context = this ;
        // radio
        this.listenTo(this._radioItem, 'valueChange', function(evt) {
            //evt.data.value
            context._gridItem.show();
        });
    }
    function setMode() {
        var mode = this._cfg.mode;
        if(mode === InvestLimit.MODE.INBOX_THREE1) {
            this._radioCustomer.check('Y');
            this._radioMachine.check('N');
            this._radioItem.check('Y');
        } else if(mode === InvestLimit.MODE.INBOX_THREE2) {
            this._radioCustomer.check('Y');
            this._radioMachine.check('N');
            this._radioItem.check('Y');
        } else if(mode === InvestLimit.MODE.INBOX_FOUR) {
            this._radioCustomer.check('Y');
            this._radioMachine.check('N');
            this._radioItem.check('Y');
        }
    }
    var props = {
        _anchors: undefined,
        _checkLimit: undefined,
        // customer
        _panelCustomer: undefined,
        _flCustomer: undefined,
        _radioCustomer: undefined,
        _gridCustomer: undefined,
        // machine
        _panelMachine: undefined,
        _flMachine: undefined,
        _radioMachine: undefined,
        _gridMachine: undefined,
        // item
        _panelItem: undefined,
        _flItem: undefined,
        _radioItem: undefined,
        _gridItem: undefined
    };

    var InvestLimit = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    InvestLimit.MODE = {
        NEW: "NEW",
        DRAFT: "DRAFT",

        MGNT_SPROC: "MGNT_SPROC", //從 特採作業-管理特採作業 進入

        NOTIFICATION: "NOTIFICATION",

        INBOX_TWO: "INBOX_TWO",
        INBOX_THREE1: "INBOX_THREE1",
        INBOX_THREE2: "INBOX_THREE2",
        INBOX_FOUR: "INBOX_FOUR"
    };

    return InvestLimit;
});