/**
 * Created by jackho on 1/27/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    '../../../../widget/Gridcrud',
    'text!../../tpl/widget/AbnMaterialProduct.html',     'text!../../tpl/ToolbarPlusPopup.html', 'text!../../tpl/ToolbarSearchPopup.html', 'text!../../tpl/ToolbarExcelPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 Gridcrud,
                                 tpl, plusPopupTpl, searchPopupTpl, excelPopuptpl, Logger) {

    var LOGGER = new Logger("AbnMaterial/gadget/widget/AbnMaterialProduct");

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
            $gridProduct: undefined
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
        anchors.$gridProduct = this.$anchor('gridProduct');


        this.hide();

        buildToolbar.call(this);
        buildGridProduct.call(this);
        //buildGridcrud.call(this);
        buildExtraInfo.call(this);
        setTooltips.call(this);

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


    function buildGridcrud() {
        var anchors = this._anchors;
        anchors.$gridCrudProduct = this.$anchor('gridCrudProduct');



        var abnProducts = new Collection();
        var items = [
            {batch: "D213411", mainProblem: "折痕(其他型)", problem: "",         originalAmount: 200, usedAmount: 0, abnAmountBefore: 200   , abnAmountAfter: 200, materialArrivedDate: "20150630", materialDeadline: "20151231", storage: 100, sprocNo: "IT20150031"},
            {batch: "D213412", mainProblem: "折痕(亮紋)",   problem: "",         originalAmount: 500, usedAmount: 200, abnAmountBefore: 100 , abnAmountAfter: 100, materialArrivedDate: "20150630", materialDeadline: "20151231", storage: 500, sprocNo: "IT20150031"},
            {batch: "D213413", mainProblem: "折痕(亮紋)",   problem: "幅寬不符",  originalAmount: 530, usedAmount: 300, abnAmountBefore: 230 , abnAmountAfter: 230, materialArrivedDate: "20151120", materialDeadline: "2060431", storage: 600},
            {batch: "D213414", mainProblem: "折痕(其他型)", problem: "",         originalAmount: 1000, usedAmount: 500, abnAmountBefore: 250 , abnAmountAfter: 250, materialArrivedDate: "20151120", materialDeadline: "2060431", storage: 700, sprocNo: "IT20150032"}
        ];
        abnProducts.add(items);

        this._gridcrudProduct = new Gridcrud({
            data: abnProducts,
            columns: [
                {text: "批號", dataIndex: "batch"},
                {text: "主要不良項目", dataIndex: "mainProblem"},
                {text: "次要不良項目", dataIndex: "problem"},

                {text: "原始數量", dataIndex: "originalAmount"},
                {text: "已使用數量", dataIndex: "usedAmount"},
                {text: "異常量(修改前)", dataIndex: "abnAmountBefore"},
                {text: "異常量(修改後)", dataIndex: "abnAmountAfter"},

                {text: "原料到廠日", dataIndex: "materialArrivedDate"},
                {text: "原料到期日", dataIndex: "materialDeadline"},
                {text: "庫存量", dataIndex: "storage"},
                {text: "特採單號", dataIndex: "sprocNo"}
            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.EDIT, tip:{title: "編輯"}},
                    {name: Gridcrud.TOOL.MINUS, noModal: true},
                    {name: Gridcrud.TOOL.EXCEL,tip:{title: "檔案"}},
                    {name: Gridcrud.TOOL.UPLOAD,tip:{title: "上傳"}}
                ]
            },
            mode: Grid.MODE.SINGLE
        }).render();

        this._gridcrudProduct.attach(anchors.$gridCrudProduct);
    }


    function setTooltips() {
        var anchors = this._anchors;
        anchors.$toolbar.find('[data-toggle="tooltip"]').tooltip();
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

        if(value === "SEARCH"){
            popSearch.call(this);
        } else if(value === "PLUS") {
            popPlus.call(this);
        } else if(value === "CLONE") {
            popClone.call(this);
        } else if(value === "EXCEL") {
            popExcel.call(this);
        }
    }
    function popSearch() {
        if(this._toolbarSearchPopup != undefined) {
            this._toolbarSearchPopup.show();
        } else {
            this._toolbarSearchPopup = new ToolbarSearchPopup({
                tpl: searchPopupTpl
            }).render();
            this._toolbarSearchPopup.show();
        }
    }
    function popPlus() {
        if(this._toolbarPlusPopup != undefined) {
            this._toolbarPlusPopup.show();
        } else {
            this._toolbarPlusPopup = new ToolbarPlusClonePopup({
                tpl: plusPopupTpl,
                mode: ToolbarPlusClonePopup.MODE.PLUS
            }).render();
            this._toolbarPlusPopup.show();
        }
    }
    function popClone() {
        if(this._toolbarClonePopup != undefined) {
            this._toolbarClonePopup.show();
        } else {
            this._toolbarClonePopup = new ToolbarPlusClonePopup({
                tpl: plusPopupTpl,
                mode: ToolbarPlusClonePopup.MODE.CLONE
            }).render();
            this._toolbarClonePopup.show();
        }
    }
    function popExcel() {
        if(_.isUndefined(this._toolbarExcelPopup)) {
            this._toolbarExcelPopup = new Popup({
                tpl: excelPopuptpl
            }).render();
        }
        this._toolbarExcelPopup.show();
    }
    function buildGridProduct() {
        var anchors = this._anchors;

        var abnProducts = new Collection();
        var items = [
            {batch: "D213411", mainProblem: "折痕(其他型)", problem: "",         originalAmount: 200, usedAmount: 0, abnAmountBefore: 200   , abnAmountAfter: 200, materialArrivedDate: "20150630", materialDeadline: "20151231", storage: 100, sprocNo: "IT20150031"},
            {batch: "D213412", mainProblem: "折痕(亮紋)",   problem: "",         originalAmount: 500, usedAmount: 200, abnAmountBefore: 100 , abnAmountAfter: 100, materialArrivedDate: "20150630", materialDeadline: "20151231", storage: 500, sprocNo: "IT20150031"},
            {batch: "D213413", mainProblem: "折痕(亮紋)",   problem: "幅寬不符",  originalAmount: 530, usedAmount: 300, abnAmountBefore: 230 , abnAmountAfter: 230, materialArrivedDate: "20151120", materialDeadline: "2060431", storage: 600},
            {batch: "D213414", mainProblem: "折痕(其他型)", problem: "",         originalAmount: 1000, usedAmount: 500, abnAmountBefore: 250 , abnAmountAfter: 250, materialArrivedDate: "20151120", materialDeadline: "2060431", storage: 700, sprocNo: "IT20150032"}
        ];
        abnProducts.add(items);

        this._gridProduct = new Grid({
            el: anchors.$gridProduct,
            data: abnProducts,
            columns: [
                {text: "批號", dataIndex: "batch"},
                {text: "主要不良項目", dataIndex: "mainProblem"},
                {text: "次要不良項目", dataIndex: "problem"},

                {text: "原始數量", dataIndex: "originalAmount"},
                {text: "已使用數量", dataIndex: "usedAmount"},
                {text: "異常量(修改前)", dataIndex: "abnAmountBefore"},
                {text: "異常量(修改後)", dataIndex: "abnAmountAfter"},

                {text: "原料到廠日", dataIndex: "materialArrivedDate"},
                {text: "原料到期日", dataIndex: "materialDeadline"},
                {text: "庫存量", dataIndex: "storage"},
                {text: "特採單號", dataIndex: "sprocNo"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
        //this._gridProduct.attach(anchors.$toolbar);
    }
    function buildExtraInfo() {
        var $extraInfo = this.$anchor('extraInfo');

        this.listenTo(this._gridProduct, 'select', function() {
            $extraInfo.show();
        });
        this.listenTo(this._gridProduct, 'deselect', function() {
            $extraInfo.hide();
        });

        FieldUtil.setIsEditable($extraInfo, false);
    }
    var ToolbarPlusClonePopup = declare(Popup, {
        _anchors: {
            $badFields: undefined,
            $abnLocation: undefined,
            $abnFrequency: undefined,
            $title: undefined
        },
        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var defaults = {
                tpl: plusPopupTpl,
                mode: ToolbarPlusClonePopup.MODE.PLUS
            };
            var cfg = this._cfg;

            _.defaults(cfg, defaults);

            this._anchors = {
                $badFields: undefined,
                $abnLocation: undefined,
                $abnFrequency: undefined,
                $title: undefined,
                // MODE.PLUS
                $originalAmount: undefined,
                $usedAmount: undefined,
                $abnAmountBefore: undefined,
                $abnAmountAfter: undefined
            };
        },
        render: function(options) {
            Popup.prototype.render.apply(this, arguments);

            var anchors = this._anchors;
            anchors.$badFields = this.$anchor('badFields');
            anchors.$abnLocation = this.$anchor('abnLocation');
            anchors.$abnFrequency = this.$anchor('abnFrequency');
            anchors.$title = this.$anchor('title');
            // MODE.PLUS
            anchors.$originalAmount = this.$anchor('originalAmount');
            anchors.$usedAmount = this.$anchor('usedAmount');
            anchors.$abnAmountBefore = this.$anchor('abnAmountBefore');
            anchors.$abnAmountAfter = this.$anchor('abnAmountAfter');
            // radio
            anchors.$left = this.$anchor('left');
            anchors.$middle = this.$anchor('middle');
            anchors.$right = this.$anchor('right');


            this.setMode.call(this);
            this.setRadio.call(this);

            return this;
        },
        setMode: function() {
            var mode = this._cfg.mode;
            var anchors = this._anchors;

            if(mode === ToolbarPlusClonePopup.MODE.PLUS) {
                anchors.$badFields.show();
                anchors.$abnLocation.show();
                anchors.$abnFrequency.show();
                anchors.$title.text('批號資料');



                var $btnCalculator = this.$anchor('btnCalculator');
                $btnCalculator.on('click', _.bind(function(evt) {

                    var oaValue = anchors.$originalAmount.val();
                    var uaValue = anchors.$usedAmount.val();
                    var aaBeforeValue = anchors.$abnAmountBefore.val();
                    anchors.$abnAmountAfter.val(aaBeforeValue);
                    anchors.$abnAmountBefore.val(oaValue - uaValue);


                }, this));
            } else if(mode === ToolbarPlusClonePopup.MODE.CLONE){
                anchors.$badFields.hide();
                anchors.$abnLocation.show();
                anchors.$abnFrequency.show();
                anchors.$title.text('異常情形');
            }
        },
        setRadio: function() {
            var anchors = this._anchors;
            var context = this ;
            // left
            context.$('input[name="left1"]').on('change', function(evt) {
                var left1Value = context.$('input[name="left1"]:checked').val();
                LOGGER.debug('radio[name="left1"]: ${0}',left1Value);

                if(left1Value === 'period') {
                    anchors.$left.find('input[type="text"]').show();
                } else {
                    anchors.$left.find('input[type="text"]').hide();
                }
            });
            // middle
            context.$('input[name="middle1"]').on('change', function(evt) {
                var middle1Value = context.$('input[name="middle1"]:checked').val();
                LOGGER.debug('radio[name="middle1"]: ${0}',middle1Value);

                if(middle1Value === 'period') {
                    anchors.$middle.find('input[type="text"]').show();
                } else {
                    anchors.$middle.find('input[type="text"]').hide();
                }
            });
            // right
            context.$('input[name="right1"]').on('change', function(evt) {
                var right1Value = context.$('input[name="right1"]:checked').val();
                LOGGER.debug('radio[name="right1"]: ${0}',right1Value);

                if(right1Value === 'period') {
                    anchors.$right.find('input[type="text"]').show();
                } else {
                    anchors.$right.find('input[type="text"]').hide();
                }
            });
        }
    }, {});
    ToolbarPlusClonePopup.MODE = {
        PLUS: "PLUS",
        CLONE: "CLONE"
    };
    var ToolbarSearchPopup = declare(Popup, {
        _anchors: {
            $toolbar:undefined,
            $selectAll: undefined,
            $selectNone: undefined,
            $grid: undefined
        },
        _toolbar: undefined,
        _grid: undefined,

        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var cfg = this._cfg;
            cfg.tpl = searchPopupTpl;
        },
        render: function(options) {
            Popup.prototype.render.apply(this, arguments);

            var defaults = {
                hidden: false
            };
            var cfg = this._cfg;

            options || (options = {});
            _.defaults(options, defaults);

            this.buildToolbar.call(this);
            this.buildGrid.call(this);

            return this;
        },
        buildToolbar: function() {

            var anchors = this._anchors;
            anchors.$toolbar = this.$anchor('toolbar');
            anchors.$selectAll = anchors.$toolbar.find('i[value="SELECTALL"]');
            anchors.$selectNone = anchors.$toolbar.find('i[value="SELECTNONE"]');

            this._toolbar = new Triggers({
                el: anchors.$toolbar,
                selector: "i"
            }).render();

            anchors.$selectNone.hide();
            this._toolbar.on("trigger", _.bind(this.onToolbarSelect, this));

            LOGGER.debug("buildToolbar done");

        },
        onToolbarSelect: function (evt) {
            var anchors = this._anchors;

            var source = evt.source ;
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
            } else if(value === "CALCULATE") {
                _.each(models, function(model) {
                    var a = model.get('originalAmount');
                    var b = model.get('usedAmount');
                    var c = model.get('abnAmountBefore');
                    var d = model.get('abnAmountAfter');
                    model.set({'abnAmountAfter': c});
                    model.set({'abnAmountBefore': a-b});
                });
                context._grid.render();
            }
        },
        buildGrid: function() {
            var anchors = this._anchors;
            anchors.$grid = this.$anchor('gridBatchNo');

            var batchs = new Collection();
            var items = [
                {no: "D213411", originalAmount: 1000, usedAmount: 200, abnAmountBefore: 0, abnAmountAfter: 0},
                {no: "D213412", originalAmount: 2000, usedAmount: 100, abnAmountBefore: 200, abnAmountAfter: 0},
                {no: "D213411", originalAmount: 3000, usedAmount: 230, abnAmountBefore: 300, abnAmountAfter: 0},
                {no: "D213411", originalAmount: 4000, usedAmount: 250, abnAmountBefore: 500, abnAmountAfter: 0}
            ];
            batchs.add(items);

            this._grid = new Grid({
                el: anchors.$grid,
                data: batchs,
                columns: [
                    {text: "批號", dataIndex: "no"},
                    {text: "原始數量", dataIndex: "originalAmount", editable: true},
                    {text: "已使用量", dataIndex: "usedAmount", editable: true},
                    {text: "異常量(修改前)", dataIndex: "abnAmountBefore", editable: true},
                    {text: "異常量(修改後)", dataIndex: "abnAmountAfter", editable: true}
                ],
                mode: Grid.MODE.MULTI
            }).render();
        }
    }, {});

    var props = {
        _anchors: undefined,
        _toolbar: undefined,

        _gridProduct: undefined,

        _toolbarSearchPopup: undefined,
        _toolbarPlusPopup: undefined,
        _toolbarClonePopup: undefined,
        _toolbarExcelPopup: undefined
    };

    var AbnMaterialProduct = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return AbnMaterialProduct;
});