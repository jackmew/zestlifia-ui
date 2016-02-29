/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection',
    'text!../tpl/energy.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, tpl, Logger) {

    var LOGGER = new Logger("WorkRuleCustomerApl/gadget/electronic");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {
            $gridMaster: undefined,
            $gridDetail: undefined
        };

        this._title = i18n.translate("能源");
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        setGridMaster.call(this);
        setGridDetail.call(this);

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

    function setGridMaster() {
        var anchors = this._anchors;
        anchors.$gridMaster = this.$anchor('gridMaster');

        var masterCollection = new Collection();
        var masterModels = [
            {no: '01'},
            {no: '02'}
        ];
        masterCollection.add(masterModels);

        this._gridMaster = new Grid({
            el: anchors.$gridMaster,
            data: masterCollection,
            columns: [
                {text: "客戶不良工站", dataIndex: "no"}
            ],
            mode: Grid.MODE.SINGLE
        });
        var gridMaster = this._gridMaster;
        gridMaster.render();
    }
    function setGridDetail() {
        var anchors = this._anchors;
        anchors.$gridDetail = this.$anchor('gridDetail');

        var detailCollection = new Collection();
        var detailModels = [
            {locale: '繁體中文', name: '裁切'},
            {locale: '英文', name: 'Shearing'}
        ];
        detailCollection.add(detailModels);

        this._gridDetail = new Grid({
            el: anchors.$gridDetail,
            data: detailCollection,
            columns: [
                {text: "語系", dataIndex: "locale"},
                {text: "名稱", dataIndex: "name"}
            ],
            mode: Grid.MODE.SINGLE
        });
        var gridDetail = this._gridDetail;
        gridDetail.render();
    }

    var props = {
        _anchors: undefined,
        _gridMaster: undefined,
        _gridDetail: undefined
    };


    var electronic = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    electronic.COMMAND = {
        //NEW: "NEW"
    };

    return electronic;
});