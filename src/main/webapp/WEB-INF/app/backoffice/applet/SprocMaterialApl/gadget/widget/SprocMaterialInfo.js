/**
 * Created by jackho on 1/28/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../widget/Modal' , 'view/AssigneeModal',
    'text!../../tpl/widget/SprocMaterialInfo.html', 'text!../../tpl/widget/ToolbarSearchPopup.html', 'text!../../tpl/widget/ToolbarExcelPopup.html',
    'text!../../tpl/widget/ToolbarPlusPopup.html',
    'widget/FormLayout', 'widget/Input', 'widget/InputButton', 'widget/Gridcrud',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Modal, AssigneeModal,
                                 tpl, toolbarSearchPopupTpl,
                                 toolbarExcelPopupTpl, toolbarPlusPopupTpl,
                                 FormLayout, Input, InputButton, Gridcrud,
                                 Logger) {

    var LOGGER = new Logger("SprocMaterialApl/gadget/widget/SprocMaterialInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $assignee: undefined,
            $gridInfo: undefined,
            $gridBatchSearchPopup: undefined,
            $gridLink: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$assignee = this.$anchor('assignee');
        anchors.$toolbar = this.$anchor('toolbar');
        anchors.$gridInfo = this.$anchor('gridInfo');


        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildSideBtn.call(this);
        buildToolbar.call(this);
        buildGridInfo.call(this);


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
    function buildSideBtn() {
        var anchors = this._anchors;
        anchors.$assignee.find('button').on('click', _.bind(function(evt){
            if(_.isUndefined(this._modalAssignee)) {
                this._modaAssignee = new AssigneeModal().render();
            }
            this._modalAssignee.show();
        },this));
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
    function buildGridInfo() {
        var anchors = this._anchors;


        var infoOrders = new Collection();
        var items = [];
        infoOrders.add(items);

        this._gridInfo = new Grid({
            el: anchors.$gridInfo,
            data: infoOrders,
            columns: [
                {text: "異常單號", dataIndex: "abnNo"},
                {text: "批號", dataIndex: "batch"},
                {text: "數量", dataIndex: "abnAmount"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
        LOGGER.debug("buildGridInfo done");
    }
    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value == "SEARCH") {
            popSearch.call(this);
        } else if(value == "EXCEL") {
            popExcel.call(this);
        } else if(value == "LINK") {
            popLink.call(this);
        } else if(value == "PLUS") {
            popPlus.call(this);
        }
    }
    function popSearch() {

        if(_.isUndefined(this._modalInfoSearch)) {
            this._modalInfoSearch = new Modal({
                size: Modal.SIZE.M
            }).render();
            this._modalInfoSearch.title('母批查詢');
            this._modalInfoSearch.setContent($(toolbarSearchPopupTpl));
            buildGridSearchPopup.call(this);
        }
        this._modalInfoSearch.show();
    }
    function buildGridSearchPopup() {
        var anchors = this._anchors;
        anchors.$gridBatchSearchPopup = this._modalInfoSearch.$anchor("gridBatchSearchPopup");

        var nos = new Collection();
        var items = [
            {batchNo: "IER204001"},
            {batchNo: "IER204002"},
            {batchNo: "IER204003"},
            {batchNo: "IER204004"},
            {batchNo: "IER204005"}
        ];
        nos.add(items);

        this._gridBatchSearchPopup = new Gridcrud({
            data: nos,
            columns: [
                {text: "批號", dataIndex: "batchNo"},
                {text: "數量", dataIndex: 'amount', editable: true}
            ],
            toolbar: {
                align: Gridcrud.BAR_ALIGN.LEFT,
                tools: [
                    {name: Gridcrud.TOOL.SELECT }
                ]
            },
            mode: Grid.MODE.MULTI
        }).render();
        this._gridBatchSearchPopup.attach(anchors.$gridBatchSearchPopup);
    }
    function popExcel() {
        if(this._toolbarExcelPopup != undefined) {
            this._toolbarExcelPopup.show();
        } else {
            this._toolbarExcelPopup = new Popup({
                tpl: toolbarExcelPopupTpl
            }).render();
            this._toolbarExcelPopup.show();
        }
    }
    function popLink() {
        if(_.isUndefined(this._modalLink)) {
            this._modalLink = new Modal({
                size: Modal.SIZE.M,
                title: '異常單查詢'
            }).render();

            var flLink = new FormLayout().render();
            this._modalLink.setContent(flLink);

            var row1 = flLink.addRow();

            var textAbn = new Input({
                caption: '異常單號'
            }).render();
            row1.addField(textAbn, '', 3, 6);

            var btnSearch = new InputButton().render();
            row1.addField(btnSearch, '', 0, 3);

            var nos = new Collection();
            var items = [
                {batchNo: "IER204001"},
                {batchNo: "IER204002"},
                {batchNo: "IER204003"},
                {batchNo: "IER204004"},
                {batchNo: "IER204005"}
            ];
            nos.add(items);

            this._gridLink = new Gridcrud({
                data: nos,
                columns: [
                    {text: "批號", dataIndex: "batchNo"},
                    {text: "數量", dataIndex: 'amount', editable: true}
                ],
                toolbar: {
                    align: Gridcrud.BAR_ALIGN.LEFT,
                    tools: [
                        {name: Gridcrud.TOOL.SELECT }
                    ]
                },
                mode: Grid.MODE.MULTI
            }).render();

            var row2 = flLink.addRow();
            row2.addGrid(this._gridLink);

        }
        this._modalLink.show();
    }
    function popPlus() {
        if(_.isUndefined(this._modalInfoPlus)) {
            this._modalInfoPlus = new Modal({
                size: Modal.SIZE.M
            }).render();
            this._modalInfoPlus.title('批號資料');
            this._modalInfoPlus.setContent($(toolbarPlusPopupTpl));
        }
        this._modalInfoPlus.show();
    }
    var props = {
        _anchors: undefined,
        _gridInfo: undefined,

        _gridBatchSearchPopup: undefined,
        _toolbarExcelPopup: undefined,
        _gridLink: undefined,

        _modalInfoSearch: undefined,
        _modalInfoPlus: undefined,
        _modalAssignee: undefined,
        _modalLink: undefined
    };

    var SprocMaterialInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return SprocMaterialInfo;
});