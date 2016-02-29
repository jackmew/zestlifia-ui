/**
 * Created by jackho on 1/25/16.
 *
 * The first tab of SprocApl.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', '../../../../widget/Gridcrud', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/SprocInfo.html', '../../../../util/FieldUtil',
    'text!applet/IssueApl/tpl/CustomerNamePopup.html', 'text!applet/IssueApl/tpl/AssigneeNoPopup.html',
    'text!../../tpl/widget/SprocInfoPlusPopup.html', 'text!../../tpl/widget/SprocInfoMinusPopup.html',
    'text!../../tpl/widget/SprocInfoSearchPopup.html', 'text!../../tpl/widget/SprocInfoEditPopup.html',
    'text!../../tpl/widget/SprocInfoExcelPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Gridcrud, Popup,
                                 tpl, FieldUtil, customerNamePopupTpl, assigneeNoPopupTpl,
                                 plusPopupTpl, minusPopupTpl, searchPopupTpl, editPopupTpl, excelPopupTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/BasicInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $gridInfo: undefined,
            $toolbar: undefined,
            // assignee popup
            $gridAssigneeNo: undefined
            // customerName popup
        };

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        var anchors = this._anchors;
        anchors.$gridInfo = this.$anchor('gridInfo');
        anchors.$toolbar = this.$anchor('toolbar');

        buildSideBtn.call(this);
        buildToolbar.call(this);
        buildGridInfo.call(this);

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
    function buildSideBtn() {
        var anchors = this._anchors;
        anchors.$sideBtn = this.$anchor('assigneeNo');

        this._sideBtn = new Triggers({
            el: anchors.$sideBtn
        }).render();

        this._sideBtn.on("trigger", _.bind(assigneePopup, this));

        LOGGER.debug("buildSideBtn done");

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
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === "PLUS") {
            plusPopup.call(this);
        } else if(value === 'MINUS') {
            //minusPopup.call(this);
        } else if(value === 'EDIT') {
            editPopup.call(this);
        } else if(value === 'EXCEL') {
            excelPopup.call(this);
        } else if(value === 'SEARCH') {
            searchPopup.call(this);
        }
        //else if(value === "CUSTOMER_NAME") {
        //    customerPopup.call(this);
        //}
    }
    function plusPopup() {
        if(this._toolbarPlusPopup != undefined) {
            this._toolbarPlusPopup.show();
        } else {
            this._toolbarPlusPopup = new Popup({
                tpl: plusPopupTpl
            }).render();
            this._toolbarPlusPopup.show();
        }
    }
    function minusPopup() {
        if(this._toolbarMinusPopup != undefined) {
            this._toolbarMinusPopup.show();
        } else {
            this._toolbarMinusPopup = new Popup({
                tpl: minusPopupTpl
            }).render();
            this._toolbarMinusPopup.show();
        }
    }
    function searchPopup() {
        if(_.isUndefined(this._toolbarSearchPopup)) {
            this._toolbarSearchPopup = new Popup({
                tpl: searchPopupTpl
            }).render();
            var $gridSearchSection = this._toolbarSearchPopup.$anchor('gridSearchSection');

            var searchs = new Collection();
            var items = [
                {itemNo: "A1234", sourceCustomer: "客戶一", amount: "1000", lotNo: ""},
                {itemNo: "A1235", sourceCustomer: "客戶二", amount: "2000", lotNo: ""},
                {itemNo: "A1236", sourceCustomer: "客戶三", amount: "3000", lotNo: ""}
            ];
            searchs.add(items);

            this._gridSearch = new Gridcrud({
                el: $gridSearchSection,
                data: searchs,
                columns: [
                    {text: "料號", dataIndex: "itemNo"},
                    {text: "來源客戶", dataIndex: "sourceCustomer"},
                    {text: "數量", dataIndex: "amount"},
                    {text: "批號", dataIndex: "lotNo", editable: true, style: {width: '200px'}},
                    {text: "異常項目", dataIndex: "abnItem", editable: true, style: {width: '400px'}}
                ],
                mode: Grid.MODE.SINGLE,
                toolbar: {
                    tools: [
                        {name: Gridcrud.TOOL.MINUS, noModal: true},
                        {name: Gridcrud.TOOL.PLUS, noModal: true}
                    ]
                }

            });

            this._gridSearch.setPlusControl({
                itemNo: "A1237", sourceCustomer: "客戶七", amount: "7000"
            });
            this._gridSearch.render();
        }
        this._toolbarSearchPopup.show();
    }
    function excelPopup() {
        if(this._toolbarExcelPopup != undefined) {
            this._toolbarExcelPopup.show();
        } else {
            this._toolbarExcelPopup = new Popup({
                tpl: excelPopupTpl
            }).render();
            this._toolbarExcelPopup.show();
        }
    }
    function editPopup() {
        if(this._toolbarEditPopup != undefined) {
            this._toolbarEditPopup.show();
        } else {
            this._toolbarEditPopup = new Popup({
                tpl: editPopupTpl
            }).render();
            this._toolbarEditPopup.show();
        }
    }
    function assigneePopup() {
        if(this._assigneeNoPopup != undefined) {
            this._assigneeNoPopup.show();
        } else {
            this._assigneeNoPopup = new Popup({
                tpl: assigneeNoPopupTpl
            }).render();
            buildGridAssigneeNo.call(this);
            this._assigneeNoPopup.show();
        }
    }
    function buildGridAssigneeNo() {
        var anchors = this._anchors;
        anchors.$gridAssigneeNo = this._assigneeNoPopup.$anchor("gridAssigneeNo");

        var nos = new Collection();
        var items = [
            {no: "S100618", name: "鮑之勇", extension: "86103", department: "秦皇島辦事處", branch: "珠海分公司"},
            {no: "S100620", name: "王小花", extension: "86930", department: "秦皇島辦事處", branch: "珠海分公司"}
        ];
        nos.add(items);

        this._gridAssigneeNo = new Grid({
            el: anchors.$gridAssigneeNo,
            data: nos,
            columns: [
                {text: "工號", dataIndex: "no"},
                {text: "姓名", dataIndex: "name"},
                {text: "分機", dataIndex: "extension"},
                {text: "部門", dataIndex: "department"},
                {text: "分公司", dataIndex: "branch"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    //function customerPopup() {
    //    if(this._customerNamePopup != undefined) {
    //        this._customerNamePopup.show();
    //    } else {
    //        this._customerNamePopup = new Popup({
    //            tpl: customerNamePopupTpl
    //        }).render();
    //        buildGridCustomerName.call(this);
    //        this._customerNamePopup.show();
    //    }
    //}
    //function buildGridCustomerName() {
    //    var anchors = this._anchors;
    //    anchors.$gridCustomerName = this._customerNamePopup.$anchor("gridCustomerName");
    //
    //    var cns = new Collection();
    //    var items = [
    //        {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "May Shih", phone: "0911234098"},
    //        {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "Jack Ho", phone: "0912098123"},
    //        {no: "DF50111", customerName: "深圳精誠達", companyLocation: "深圳台虹", customerArea: "大陸華南", contact: "Frank Lin", phone: "0913098223"},
    //        {no: "DF0173", customerName: "台郡", companyLocation: "台虹科技", customerArea: "台灣南區", contact: "Jason Lin", phone: "0989123098"}
    //    ];
    //    cns.add(items);
    //
    //    this._gridCustomerName = new Grid({
    //        el: anchors.$gridCustomerName,
    //        data: cns,
    //        columns: [
    //            {text: "客戶編號", dataIndex: "no"},
    //            {text: "客戶名稱", dataIndex: "customerName"},
    //            {text: "公司地區", dataIndex: "companyLocation"},
    //            {text: "客訴受理地區", dataIndex: "customerArea"},
    //            {text: "客戶聯絡人", dataIndex: "contact"},
    //            {text: "客戶聯絡人電話", dataIndex: "phone"}
    //        ],
    //        mode: Grid.MODE.SINGLE
    //    }).render();
    //}
    function buildGridInfo() {
        var anchors = this._anchors;

        var infoOrders = new Collection();
        var items = [
            {materialNo: "A110091", sourceCustomer: "客戶一", batch: "1B155331-B10061", orderAmount: 1000, abnItem: "5FHB1025L311BT 150m2--16157292離形力32.93不符客規8~11 。"},
            {materialNo: "A110092", sourceCustomer: "客戶一", batch: "1B155331-B10062", orderAmount: 1300, abnItem: ""}
        ];
        infoOrders.add(items);

        this._gridInfo = new Grid({
            el: anchors.$gridInfo,
            data: infoOrders,
            columns: [
                {text: "料號", dataIndex: "materialNo"},
                {text: "來源客戶", dataIndex: "sourceCustomer"},
                {text: "批號", dataIndex: "batch"},
                {text: "數量", dataIndex: "orderAmount"},
                {text: "異常項目", dataIndex: "abnItem"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        LOGGER.debug("buildGridInfo done");
    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _gridInfo: undefined,
        // assigneeNo
        _assigneeNoPopup: undefined,
        _gridAssigneeNo: undefined,
        // customerName
        _customerNamePopup: undefined,
        _gridCustomerName: undefined,
        // on grid
        _toolbarPlusPopup: undefined,
        _toolbarMinusPopup: undefined,
        _toolbarSearchPopup: undefined,
        _gridSearch: undefined,
        _toolbarExcelPopup: undefined,
        _toolbarEditPopup: undefined
    };

    var SprocInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return SprocInfo;
});

