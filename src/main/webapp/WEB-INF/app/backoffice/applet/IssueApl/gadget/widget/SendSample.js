/**
 * Created by jackho on 1/22/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    'text!../../tpl/widget/SendSample.html',
    'text!../../tpl/widget/SendSamplePlusPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, plusPopupTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/SendSample");

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
            $sideBtn: undefined,
            $toolbar: undefined,
            $sendSampleSection: undefined
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
        anchors.$sideBtn = this.$anchor('sideBtn');
        anchors.$toolbar = this.$anchor('toolbar');
        anchors.$grid = this.$anchor('grid');
        anchors.$sendSampleSection = this.$anchor('sendSampleSection');

        this.hide();

        buildSideBtn.call(this);
        buildToolbar.call(this);
        buildGrid.call(this);

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
    function buildToolbar() {
        var anchors = this._anchors;

        this._toolbar = new Triggers({
            el: anchors.$toolbar,
            selector: "i"
        }).render();

        this.listenTo(this._toolbar, 'trigger', _.bind(onToolbarSelect, this));
        //this._toolbar.on("trigger", _.bind(onToolbarSelect, this));

        LOGGER.debug("buildToolbar done");
    }
    function buildSideBtn() {
        var anchors = this._anchors;

        this._toolbar = new Triggers({
            el: anchors.$sideBtn,
            selector: "button"
        }).render();

        this.listenTo(this._toolbar, 'trigger', _.bind(onSideBtnClick, this));
        //this._toolbar.on("trigger", _.bind(onToolbarSelect, this));

        LOGGER.debug("buildToolbar done");
    }
    function onToolbarSelect(evt) {
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === 'PLUS') {
            popPlus.call(this);
        }
    }
    function onSideBtnClick(evt) {
        var value = evt.data.value;
        LOGGER.debug("onSideBtnClick - value: ${0}", value);

        if(value === 'SENDSAMPLE_NO') {
            fillSendSampleNo.call(this);
        } else if(value === 'SHIPMENT_NO') {
            fillShipmentNo.call(this);
        }
    }
    function popPlus() {
        if(this._plusPopup != undefined) {
            this._plusPopup.show();
        } else {
            this._plusPopup = new Popup({
                tpl: plusPopupTpl
            }).render();
            this._plusPopup.show();
        }
    }
    function fillSendSampleNo() {
        var anchors = this._anchors;
        anchors.$itemName = this.$anchor('itemName');
        anchors.$amount = this.$anchor('amount');
        anchors.$requestDate = this.$anchor('requestDate');
        anchors.$toUse = this.$anchor('toUse');

        anchors.$itemName.find('input[type="text"]').val('ND12345');
        anchors.$amount.find('input[type="text"]').val('120');
        anchors.$requestDate.find('input[type="date"]').val('2015-09-20');
        anchors.$toUse.find('input[type="text"]').val('XXX驗證');
    }
    function fillShipmentNo() {
        var anchors = this._anchors;
        anchors.$address = this.$anchor('address');
        anchors.$address.find('input[type="text"]').val('台北市忠孝東路四段303號11樓');
    }
    function buildGrid() {
        var anchors = this._anchors;

        var infos = new Collection();
        var items = [];
        infos.add(items);

        this._grid = new Grid({
            el: anchors.$grid,
            data: infos,
            columns: [
                {text: "批號", dataIndex: "no"},
            ],
            mode: Grid.MODE.SINGLE
        }).render();
        LOGGER.debug("grid done");
    }
    function setMode() {

        FieldUtil.setIsEditable(this.$anchor('customerSection'), false);

        var $exportNo = this.$anchor('exportNo');
        $exportNo.find('input').prop('readonly', false);
        $exportNo.find('button').prop('disabled', false);

        var $sendNo = this.$anchor('sendNo');
        $sendNo.find('input').prop('readonly', false);
        $sendNo.find('button').prop('disabled', false);

    }
    var props = {
        _anchors: undefined,
        _toolbar: undefined,
        _popupPlus: undefined
    };

    var SendSample = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return SendSample;
});