/**
 * Created by jackho on 1/26/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , 'uweaver/widget/TabPanel' ,
    'text!../../tpl/widget/AppearanceInfo.html', 'text!../../tpl/MergeNoPopup.html','text!../../tpl/widget/InfoPlus.html',
    '../../../../widget/Modal',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, TabPanel,
                                 tpl, mergeNoPopupTpl, InfoPlusTpl,
                                 Modal,
                                 Logger) {

    var LOGGER = new Logger("AbnEndProductAppearance/gagdget/widget/AppearanceInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $sideBtn: undefined,
            $toolbar: undefined,
            $gridInfo: undefined
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
        anchors.$sideBtn = this.$anchor('sideBtn');

        this._sideBtn = new Triggers({
            el: anchors.$sideBtn
        }).render();

        this._sideBtn.on("trigger", _.bind(onSideBtnClick, this));

        LOGGER.debug("buildSideBtn done");

    }
    function onSideBtnClick(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onSideBtnClick - value: ${0}", value);

        if(source._mergeNoPopup != undefined) {
            source._mergeNoPopup.show();
        } else {
            source._mergeNoPopup = new MergeNoPopup().render();
            source._mergeNoPopup.show();
        }
    }
    function buildGridInfo() {
        var anchors = this._anchors;
        anchors.$gridInfo = this.$anchor('gridInfo');

        var infos = new Collection();
        var info = [
            {itemName: "FHK1025L", materialNo: "FHK1025L31", productType: "CL", lotNo: "1B055331-B12345", badItem: "折痕", abnAmount: "1200", machineType: "T1"}
        ];
        infos.add(info);

        this._gridInfo = new Grid({
            el: anchors.$gridInfo,
            data: infos,
            columns: [
                {text: "品名", dataIndex: "itemName"},
                {text: "料號", dataIndex: "materialNo"},
                {text: "產品類別", dataIndex: "productType"},
                {text: "批號", dataIndex: "lotNo"},
                {text: "不良項目", dataIndex: "badItem"},
                {text: "異常數量", dataIndex: "abnAmount"},
                {text: "機台別", dataIndex: "machineType"}
            ],
            mode: Grid.MODE.SINGLE
        });
        var gridInfo = this._gridInfo;
        gridInfo.render();

        LOGGER.debug("buildGridInfo Done");
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
    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value == "plus"){
            popPlus(source);
        }
    }
    function popPlus(source) {
        if(_.isUndefined(this._modalInfoPlus)) {
            this._modalInfoPlus = new Modal({
                size: Modal.SIZE.M
            }).render();
            this._modalInfoPlus.title('批號資料');
            this._modalInfoPlus.setContent($(InfoPlusTpl));
        }
        this._modalInfoPlus.show();
    }


    var MergeNoPopup = declare(Popup, {
        _anchors: {
            $gridMergeNo: undefined
        },
        _gridMergeNo: undefined,

        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var cfg = this._cfg;
            cfg.tpl = mergeNoPopupTpl;
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

            this.buildGridMergeNo.call(this);

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
        },
        buildGridMergeNo: function() {
            var anchors = this._anchors;
            anchors.$gridMergeNo = this.$anchor('gridMergeNo');

            var nos = new Collection();
            var items = [
                {absNo: "QD20151100981", createDate: "2015-06-01", createArea: "台灣地區"},
                {absNo: "QD20151100982", createDate: "2015-06-02", createArea: "台灣地區"},
                {absNo: "QD20151100983", createDate: "2015-06-03", createArea: "台灣地區"},
                {absNo: "QD20151100984", createDate: "2015-06-04", createArea: "台灣地區"},
                {absNo: "QD20151100985", createDate: "2015-06-05", createArea: "台灣地區"}
            ];
            nos.add(items);

            this._gridMergeNo = new Grid({
                el: anchors.$gridMergeNo,
                data: nos,
                columns: [
                    {text: "異常單號", dataIndex: "absNo"},
                    {text: "建立日期", dataIndex: "createDate"},
                    {text: "開立地區", dataIndex: "createArea"}
                ],
                mode: Grid.MODE.SINGLE
            }).render();

            LOGGER.debug("buildGridMergeNo done");
        }

    }, {});

    //var ToolbarPlusPopup = declare(Popup, {
    //
    //    initialize: function(config) {
    //        Popup.prototype.initialize.apply(this, arguments);
    //
    //        var cfg = this._cfg;
    //        cfg.tpl = toolbarPlusPopupTpl;
    //    },
    //    render: function(options) {
    //        Popup.prototype.render.apply(this, arguments);
    //
    //        var defaults = {
    //            hidden: false
    //        };
    //        var cfg = this._cfg;
    //
    //        options || (options = {});
    //        _.defaults(options, defaults);
    //
    //        this.hide();
    //
    //        if(this.render === render) {
    //            this._isRendered = true;
    //
    //            this.trigger('rendered', {
    //                data: {},
    //                context: this,
    //                source: this
    //            });
    //            options.hidden || this.show();
    //        }
    //
    //        return this;
    //    }
    //
    //}, {});


    var props = {
        _anchors: undefined,
        _gridInfo: undefined,
        _mergeNoPopup: undefined,
        //_toolbarPlusPopup: undefined
        _modalInfoPlus: undefined
    };

    var AppearanceInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return AppearanceInfo;
});