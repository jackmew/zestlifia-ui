/**
 * Created by jackho on 1/22/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    'text!../../tpl/widget/ClientVerify.html',
    'text!../../tpl/widget/ClientVerifyEditPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, editPopupTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/ClientVerify");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $grid: undefined,
            $toolbar: undefined
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
        anchors.$toolbar = this.$anchor('toolbar');
        anchors.$grid = this.$anchor('grid');

        this.hide();

        buildToolbar.call(this);
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

        if(value === 'EDIT') {
            popEdit.call(this);
        }
    }
    function popEdit() {
        if(this._popupEdit != undefined) {
            this._popupEdit.show();
        } else {
            this._popupEdit = new Popup({
                tpl: editPopupTpl
            }).render();
            this._popupEdit.show();
        }
    }
    function buildGrid() {
        var anchors = this._anchors;

        var infos = new Collection();
        var items = [
            {type: "短期性", description: "改用A廠商原料", status: "成功", result: "", explain: ""},
            {type: "短期性", description: "針對盲孔孔破的部分進行確認，發現到孔環有些有電鍍上一層銅層", status: "成功", result: "", explain: ""},
            {type: "永久性", description: "在膠料標示上採用制式之分散三次標示，鑑別度較高", status: "執行中", result: "", explain: ""}
        ];
        infos.add(items);

        this._grid = new Grid({
            el: anchors.$grid,
            data: infos,
            columns: [
                {text: "對策種類", dataIndex: "type"},
                {text: "對策描述", dataIndex: "description"},
                {text: "廠內執行狀態", dataIndex: "status"},
                {text: "驗證結果", dataIndex: "result"},
                {text: "驗證說明", dataIndex: "explain"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
        LOGGER.debug("grid done");
    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _grid: undefined,
        _popupEdit: undefined
    }

    var ClientVerify = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return ClientVerify;
});