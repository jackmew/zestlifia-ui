/**
 * Created by jackho on 1/29/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../widget/Modal' , 'view/AssigneeModal',
    'text!../../tpl/widget/AbnOutSourceInfo.html', "text!view/tpl/Batch.html",
    'widget/FormLayout', 'widget/Input', 'widget/InputButton',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Modal, AssigneeModal,
                                 tpl, batchTpl,
                                 FormLayout, Input, InputButton,
                                 Logger) {

    var LOGGER = new Logger("AbnOutSource/gadget/widget/AbnOutSourceInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: AbnOutSourceInfo.MODE.NEW_CREATE
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $toolbar: undefined,
            $gridInfo: undefined,
            $assignee: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$toolbar = this.$anchor('toolbar');
        anchors.$gridInfo = this.$anchor('gridInfo');
        anchors.$assignee = this.$anchor('assignee');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildSideBtn.call(this);
        buildToolbar.call(this);
        buildGridInfo.call(this);

        buildModalSearch.call(this);
        buildModalPlus.call(this);
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


        var infos = new Collection();
        var info = [
            {batchNo: 'D213411-A12345', factoryNo: "", badItem: '折痕(其他型)', amount: '200', usedAmount: '0', abnAmount: '200'},
            {batchNo: 'D213411-A12346', factoryNo: "", badItem: '折痕(亮紋)', amount: '100', usedAmount: '200', abnAmount: '300'},
            {batchNo: 'D213412-B12345', factoryNo: "", badItem: '折痕(亮紋)', amount: '230', usedAmount: '300', abnAmount: '230'},
            {batchNo: 'D123413-C12345', factoryNo: "", badItem: '折痕(其他型)', amount: '250', usedAmount: '500', abnAmount: '200'}
        ];
        infos.add(info);

        this._gridInfo = new Grid({
            el: anchors.$gridInfo,
            data: infos,
            columns: [
                {text: "批號", dataIndex: "batchNo"},
                {text: "代工廠批號", dataIndex: "factoryNo", style: { display: "none"}},
                {text: "不良項目", dataIndex: "badItem"},
                {text: "原始數量", dataIndex: "amount"},
                {text: "已使用數量", dataIndex: "usedAmount"},
                {text: "異常數量", dataIndex: "abnAmount"}
            ],
            mode: Grid.MODE.SINGLE
        });
        var gridInfo = this._gridInfo;
        gridInfo.render();
        gridInfo.on('select', _.bind(onGridInfoSelect, this));

        LOGGER.debug("buildGridInfo Done");
    }
    function onGridInfoSelect(evt) {
        var model = evt.data;
        LOGGER.debug("異常資料 - gridInfo select: ${0}", model.get('item'));
    }
    function onToolbarSelect(evt) {
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === "search"){
            popSearch.call(this);
        } else if(value === "plus") {
            popPlus.call(this);
        }
    }
    function buildModalSearch() {
        this._modalSearch = new Modal({
            title: '批號'
        }).render();

        buildFormBatch.call(this);
        buildToolbarBatch.call(this);
        buildGridBatch.call(this);
    }
    // Batch
    function buildFormBatch() {
        this._modalSearch.setContent($(batchTpl));

        var anchors = this._anchors;
        anchors.$toolbarBatch = this._modalSearch.$anchor('toolbar');
        anchors.$selectAll = anchors.$toolbarBatch.find('i[value="SELECTALL"]');
        anchors.$selectNone = anchors.$toolbarBatch.find('i[value="SELECTNONE"]');
        anchors.$gridBatch = this._modalSearch.$anchor('grid');
    }
    function buildToolbarBatch(evt) {
        var anchors = this._anchors;


        this._toolbarBatch = new Triggers({
            el: anchors.$toolbarBatch,
            selector: "i"
        }).render();

        anchors.$selectNone.hide();
        this._toolbarBatch.on("trigger", _.bind(onToolbarBatchSelect, this));

        LOGGER.debug("buildToolbar done");
    }
    function onToolbarBatchSelect(evt) {
        var anchors = this._anchors;

        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        var models = this._grid.data().models;
        var context = this ;

        if(value === "SELECTALL"){
            anchors.$selectAll.hide();
            anchors.$selectNone.show();

            _.each(models, function(model) {
                context._grid.select(model);
            });
        } else if(value === "SELECTNONE") {
            anchors.$selectAll.show();
            anchors.$selectNone.hide();

            _.each(models, function(model) {
                context._grid.deselect(model);
            });
        }
    }
    function buildGridBatch() {
        var anchors = this._anchors;

        var nos = new Collection();
        var items = [
            {no: "D213411", factoryNo: "", amount: 200, usedAmount: 0, abnAmount: 200},
            {no: "D213412", factoryNo: "", amount: 100, usedAmount: 200, abnAmount: 300},
            {no: "D213413", factoryNo: "", amount: 230, usedAmount: 300, abnAmount: 230},
            {no: "D213414", factoryNo: "", amount: 250, usedAmount: 500, abnAmount: 200}

        ];
        nos.add(items);

        this._grid = new Grid({
            el: anchors.$gridBatch,
            data: nos,
            columns: [
                {text: "批號", dataIndex: "no"},
                {text: "代工廠批號", dataIndex: "factoryNo", style: { display: "none"}},
                {text: "原始數量", dataIndex: "amount"},
                {text: "已使用數量", dataIndex: "usedAmount", editable: true},
                {text: "異常數量", dataIndex: "abnAmount", editable: true}
            ],
            mode: Grid.MODE.MULTI
        }).render();
    }
    /*
    * default
    * mode = NEW_HALF_CREATE
    * */
    function buildModalPlus() {

        this._modalPlus = new Modal({
            size: Modal.SIZE.M
        }).render();
        this._modalPlus.title('批號資料');
        //this._modalPlus.setContent($(InfoPlusTpl));

        this._flPlus = new FormLayout().render();
        this._modalPlus.setContent(this._flPlus);

        var textBatchNo = new Input({
            caption: '批號',
            isRequired: true
        }).render();
        this._flPlus.addRow().addField(textBatchNo, 'batchNo', 3, 8);

        var textFactoryNo = new Input({
            caption: '代工廠批號'
        }).render();
        this._rowFactory = this._flPlus.addRow();
        this._rowFactory.addField(textFactoryNo, 'factoryNo', 3, 8);
        this._rowFactory.hide();

        var ibBadItem = new InputButton({
            caption: '不良項目',
            mode: InputButton.MODE.SIDE,
            isRequired: true
        }).render();
        this._flPlus.addRow().addField(ibBadItem, 'badItm', 3, 8);

        var numberAmount = new Input({
            caption: '原始數量',
            mode: Input.TYPE.NUMBER,
            isReadonly: true
        }).render();
        this._rowAmount = this._flPlus.addRow();
        this._rowAmount.addField(numberAmount, 'amount', 3, 8);

        var usedOriginal = new Input({
            caption: '已使用數量',
            mode: Input.TYPE.NUMBER
        }).render();
        this._rowUsedAmount = this._flPlus.addRow();
        this._rowUsedAmount.addField(usedOriginal, 'usedAmount', 3, 8);

        var abnOriginal = new Input({
            caption: '異常數量',
            mode: Input.TYPE.NUMBER,
            isRequired: true
        }).render();
        this._flPlus.addRow().addField(abnOriginal, 'abnAmount',3, 8);
    }
    function popSearch() {
        this._modalSearch.show();
    }
    function popPlus() {
        this._modalPlus.show();
    }
    function setMode() {
        var anchors = this._anchors;
        var mode = this._cfg.mode ;

        if(mode === AbnOutSourceInfo.MODE.NEW_CREATE) {
            // grid
            anchors.$gridInfo.find('th:nth-child(2)').show();
            anchors.$gridInfo.find('td:nth-child(2)').show();

            anchors.$gridInfo.find('th:nth-child(4)').hide();
            anchors.$gridInfo.find('td:nth-child(4)').hide();

            anchors.$gridInfo.find('th:nth-child(5)').hide();
            anchors.$gridInfo.find('td:nth-child(5)').hide();

            // modal-search
            var $gridSearch = this._modalSearch.$anchor('grid');
            $gridSearch.find('th:nth-child(2)').show();
            $gridSearch.find('td:nth-child(2)').show();

            $gridSearch.find('th:nth-child(3)').hide();
            $gridSearch.find('td:nth-child(3)').hide();

            $gridSearch.find('th:nth-child(4)').hide();
            $gridSearch.find('td:nth-child(4)').hide();

            // modal-plus
            this._rowFactory.show();
            this._rowAmount.hide();
            this._rowUsedAmount.hide();
        }
    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _gridInfo: undefined,
        _modalAssignee: undefined,
        _modalSearch: undefined,
        // modal plus
        _modalPlus: undefined,
        _rowFactory: undefined,
        _rowAmount: undefined,
        _rowUsedAmount: undefined

    };

    var AbnOutSourceInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    AbnOutSourceInfo.MODE = {
        NEW_HALF_CREATE: 'NEW_HALF_CREATE',
        NEW_CREATE: 'NEW_CREATE'
    };

    return AbnOutSourceInfo;
});