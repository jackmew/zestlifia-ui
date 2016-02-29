/**
 * Created by jackho on 1/22/16.
 *
 * A part one of IssueApl tab.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/IssueProduct.html', '../Editor', '../../../../util/FieldUtil', 'text!../../tpl/ToolbarIssueProductPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, ToolbarIssueProductPopupTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/IssueProduct");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $gridProduct: undefined,
            $toolbar: undefined
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
        anchors.$gridProduct = this.$anchor('gridProduct');
        anchors.$toolbar = this.$anchor('toolbar');

        buildToolbar.call(this);
        buildGridProduct.call(this);

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
    function buildToolbar() {
        var anchors = this._anchors;

        this._toolbar = new Triggers({
            el: anchors.$toolbar,
            selector: "i"
        }).render();

        this._toolbar.on("trigger", _.bind(onToolbarSelect, this));

        LOGGER.debug("buildToolbar done");

    }
    function buildGridProduct() {
        var anchors = this._anchors;


        var issueProducts = new Collection();
        var items = [
            {batch: "1B155311-B10061", shipDate: new Date("2015-06-01"), shipAmount: 2000, issueAmount: 100, usedAmount: 0, unusedAmount: 500, controlAmount: 500},
            {batch: "1B155311-B10062", shipDate: new Date("2015-06-01"), shipAmount: 2000, issueAmount: 200, usedAmount: 150, unusedAmount: 1850, controlAmount: 1850},
            {batch: "1B155311-B10065", shipDate: new Date("2015-06-01"), shipAmount: 2000, issueAmount: 300, usedAmount: 100, unusedAmount: 1900, controlAmount: 1900},
            {batch: "1B155316-B10016", shipDate: new Date("2015-06-10"), shipAmount: 3000, issueAmount: 500, usedAmount: 800, unusedAmount: 2200, controlAmount: 2200}
        ];
        issueProducts.add(items);

        this._gridProduct = new Grid({
            el: anchors.$gridProduct,
            data: issueProducts,
            columns: [
                {text: "批號", dataIndex: "batch", style: {width: '50px'}},
                {text: "出貨日期", dataIndex: "shipDate"},
                {text: "此母批出貨量", dataIndex: "shipAmount"},
                {text: "客訴數量", dataIndex: "issueAmount"},
                {text: "客戶使用量", dataIndex: "usedAmount"},
                {text: "此母批未使用量", dataIndex: "unusedAmount"},
                {text: "管制數量", dataIndex: "controlAmount"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        LOGGER.debug("buildGridProduct done");
    }


    function onToolbarSelect(evt) {
        var source = evt.source ;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(source._toolbarIssueProductPopup != undefined) {
            source._toolbarIssueProductPopup.show();
        } else {
            source._toolbarIssueProductPopup = new ToolbarIssueProductPopup().render();
            source._toolbarIssueProductPopup.show();
        }
    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _gridProduct: undefined
    };

    var IssueProduct = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    var ToolbarIssueProductPopup = declare(Popup, {
        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var cfg = this._cfg;
            cfg.tpl = ToolbarIssueProductPopupTpl;
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

            var anchors = this._anchors;

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

    return IssueProduct;
});