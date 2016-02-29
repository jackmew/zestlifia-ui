/**
 * Created by jackho on 1/27/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/SprocAbn.html', '../../../../util/FieldUtil',
    'applet/AbnEndProductFeature/gadget/widget/FeatureInfo', 'applet/AbnEndProductFeature/gadget/widget/FeatureAttachment', 'applet/AbnEndProductFeature/gadget/widget/FeatureStatus',
    'applet/AbnEndProductAppearance/gadget/widget/AppearanceInfo', 'view/Attachment', 'applet/AbnEndProductAppearance/gadget/widget/AppearanceStatus',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, FieldUtil,
                                 FeatureInfo, FeatureAttachment, FeatureStatus,
                                 AppearanceInfo, Attachment, AppearanceStatus,
                                 Logger) {

    var LOGGER = new Logger("SprocApl/gadget/widget/SprocAbn");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $grid: undefined,
            // Feature
            $panelFeature: undefined,
            $panelFeatureInfo: undefined,
            $panelFeatureAttachment: undefined,
            $panelFeatureStatus: undefined,
            // Appearance
            $panelAppearance: undefined,
            $panelAppearanceInfo: undefined,
            $panelAppearanceAttachment: undefined,
            $panelAppearanceStatus: undefined
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
        // feature
        anchors.$panelFeature = this.$anchor('panelFeature');
        anchors.$panelFeatureInfo = this.$anchor('panelFeatureInfo');
        anchors.$panelFeatureAttachment = this.$anchor('panelFeatureAttachment');
        anchors.$panelFeatureStatus = this.$anchor('panelFeatureStatus');
        // appearance
        anchors.$panelAppearance = this.$anchor('panelAppearance');
        anchors.$panelAppearanceInfo = this.$anchor('panelAppearanceInfo');
        anchors.$panelAppearanceAttachment = this.$anchor('panelAppearanceAttachment');
        anchors.$panelAppearanceStatus = this.$anchor('panelAppearanceStatus');

        this.hide();

        buildGrid.call(this);
        // Feature
        buildPanelFeatureInfo.call(this);
        buildPanelFeatureAttachment.call(this);
        buildPanelFeatureStatus.call(this);
        // Appearance
        buildPanelAppearanceInfo.call(this);
        buildPanelAppearanceAttachment.call(this);
        buildPanelAppearanceStatus.call(this);


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
    function buildGrid() {
        var anchors = this._anchors;
        anchors.$grid = this.$anchor("grid");

        var drafts = new Collection();
        var items = [
            {no: "A12345", abnUnit: "IT20150089", defectItem: "peel溢膠", type: "成品特性"},
            {no: "A12346", abnUnit: "IT20150090", defectItem: "銅面氧化", type: "成品外觀"}
        ];
        drafts.add(items);

        this._grid = new Grid({
            el: anchors.$grid,
            data: drafts,
            columns: [
                {text: "批號", dataIndex: "no"},
                {text: "異常單號", dataIndex: "abnUnit"},
                {text: "不良項目", dataIndex: "defectItem"},
                {text: "類別", dataIndex: "type"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        this._grid.on('select', _.bind(onGridSelect, this));
    }
    function onGridSelect(evt) {
        var anchors = this._anchors;
        var model = evt.data ;
        var no = model.get('no');

        LOGGER.debug("onGridSelect no: ${0}", no);

        if(no === 'A12345') {
            anchors.$panelFeature.show();
            anchors.$panelAppearance.hide();
        } else {
            anchors.$panelFeature.hide();
            anchors.$panelAppearance.show();
        }
    }

    function buildPanelFeatureInfo() {
        var anchors = this._anchors;
        this._panelFeatureInfo = new FeatureInfo().render();
        anchors.$panelFeatureInfo.find('.panel-title').find('a').text('異常資料');
        this._panelFeatureInfo.render();
        this._panelFeatureInfo.attach(anchors.$panelFeatureInfo.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelFeatureInfo.$el, false);
    }
    function buildPanelFeatureAttachment() {
        var anchors = this._anchors;
        this._panelFeatureAttachment = new FeatureAttachment().render();
        anchors.$panelFeatureAttachment.find('.panel-title').find('a').text('相關附件');
        this._panelFeatureAttachment.render();
        this._panelFeatureAttachment.attach(anchors.$panelFeatureAttachment.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelFeatureAttachment.$el, false);
    }
    function buildPanelFeatureStatus() {
        var anchors = this._anchors;
        this._panelFeatureStatus = new FeatureStatus().render();
        anchors.$panelFeatureStatus.find('.panel-title').find('a').text('異常情形');
        this._panelFeatureStatus.render();
        this._panelFeatureStatus.attach(anchors.$panelFeatureStatus.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelFeatureStatus.$el, false);
    }
    function buildPanelAppearanceInfo() {
        var anchors = this._anchors;
        this._panelAppearanceInfo = new AppearanceInfo().render();
        anchors.$panelAppearanceInfo.find('.panel-title').find('a').text('異常資料');
        this._panelAppearanceInfo.render();
        this._panelAppearanceInfo.attach(anchors.$panelAppearanceInfo.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelAppearanceInfo.$el, false);
    }
    function buildPanelAppearanceAttachment() {
        var anchors = this._anchors;
        this._panelAppearanceAttachment = new Attachment().render();
        anchors.$panelAppearanceAttachment.find('.panel-title').find('a').text('相關附件');
        this._panelAppearanceAttachment.render();
        this._panelAppearanceAttachment.attach(anchors.$panelAppearanceAttachment.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelAppearanceAttachment.$el, false);
    }
    function buildPanelAppearanceStatus() {
        var anchors = this._anchors;
        this._panelAppearanceStatus = new AppearanceStatus().render();
        anchors.$panelAppearanceStatus.find('.panel-title').find('a').text('異常情形');
        this._panelAppearanceStatus.render();
        this._panelAppearanceStatus.attach(anchors.$panelAppearanceStatus.find('.panel-body'));

        FieldUtil.setIsEditable(this._panelAppearanceStatus.$el, false);
    }

    var props = {
        _anchors: undefined,
        _grid: undefined,
        // feature
        _panelFeatureInfo: undefined,
        _panelFeatureAttachment: undefined,
        _panelFeatureStatus: undefined,
        // appearance
        _panelAppearanceInfo: undefined,
        _panelAppearanceAttachment: undefined,
        _panelAppearanceStatus: undefined


    };

    var SprocAbn = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return SprocAbn;
});