/**
 * Created by jackho on 1/26/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../widget/Modal' , 'view/AssigneeModal',
    'text!../../tpl/widget/FeatureInfo.html', 'text!../../tpl/ToolbarPlusPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Modal, AssigneeModal,
                                 tpl, toolbarPlusPopupTpl, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/gadget/widget/FeatureInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
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
    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value == "plus"){
            popPlus(source);
        }
    }
    function popPlus(source) {
        if(source._toolbarPlusPopup != undefined) {
            source._toolbarPlusPopup.show();
        } else {
            source._toolbarPlusPopup = new ToolbarPlusPopup().render();
            source._toolbarPlusPopup.show();
        }
    }
    function buildGridInfo() {
        var anchors = this._anchors;


        var infos = new Collection();
        var info = [
            {item: "A12345", productType: "2-Layer", machineType: "分條_線檢#1", batchNo: "N123401-A1", badItem: "peel", upperLimit: "0.9", lowerLimit: "0.6", abnTotal: "2", value1: "0.53"},
            {item: "A12345", productType: "2-Layer", machineType: "分條_線檢#1", batchNo: "N123402-A2", badItem: "peel", upperLimit: "0.9", lowerLimit: "0.6", abnTotal: "3", value1: "0.51"},
            {item: "A12345", productType: "2-Layer", machineType: "1號烘箱", batchNo: "N123401-A1", badItem: "溢膠", upperLimit: "2", lowerLimit: "1", abnTotal: "5",      value1: "0.8", value2: "0.9"},
            {item: "A12345", productType: "2-Layer", machineType: "1號烘箱", batchNo: "N123402-A2", badItem: "溢膠", upperLimit: "2", lowerLimit: "1", abnTotal: "6",      value1: "2.2", value2: "2.11"}
        ];
        infos.add(info);

        this._gridInfo = new Grid({
            el: anchors.$gridInfo,
            data: infos,
            columns: [
                {text: "品目", dataIndex: "item"},
                {text: "產品類別", dataIndex: "productType"},
                {text: "機台別", dataIndex: "machineType"},
                {text: "批號", dataIndex: "batchNo"},
                {text: "不良項目", dataIndex: "badItem"},
                {text: "規格(上限)", dataIndex: "upperLimit"},
                {text: "規格(下限)", dataIndex: "lowerLimit"},
                {text: "異常數量", dataIndex: "abnTotal"},
                {text: "量測值1", dataIndex: "value1"},
                {text: "量測值2", dataIndex: "value2"},
                {text: "量測值3", dataIndex: "value3"},
                {text: "量測值4", dataIndex: "value4"},
                {text: "量測值5", dataIndex: "value5"}
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
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _gridInfo: undefined,
        _modalAssignee: undefined
    };

    var FeatureInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    var ToolbarPlusPopup = declare(Popup, {

        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var cfg = this._cfg;
            cfg.tpl = toolbarPlusPopupTpl;
        },
        render: function(options) {
            Popup.prototype.render.apply(this, arguments);

            var defaults = {
                hidden: false
            };
            var cfg = this._cfg;

            options || (options = {});
            _.defaults(options, defaults);

            this.hide();

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

    }, {});


    return FeatureInfo;
});