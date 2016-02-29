/**
 * Created by jackho on 1/22/16.
 *
 * A part one of IssueApl tab.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/RelationalIssue.html', '../Editor', '../../../../util/FieldUtil',
    './BasicInfo', './IssueProduct', './IssueStatus', './BadPicture',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, BasicInfo, IssueProduct, IssueStatus, BadPicture, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/RelationalIssue");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $gridRelationalIssue: undefined,

            $panelDetails: undefined,
            $panelDetailsTitle: undefined,
            $panelBasicInfo: undefined,
            $panelIssueProduct: undefined,
            $panelIssueStatus: undefined,
            $panelBadPicture: undefined
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
        anchors.$gridRelationalIssue = this.$anchor('gridRelationalIssue');
        anchors.$panelDetails = this.$anchor('panelDetails');
        anchors.$panelDetailsTitle = this.$anchor('panelDetailsTitle');
        anchors.$panelBasicInfo = this.$anchor('panelBasicInfo');
        anchors.$panelIssueProduct = this.$anchor('panelIssueProduct');
        anchors.$panelIssueStatus = this.$anchor('panelIssueStatus');
        anchors.$panelBadPicture = this.$anchor('panelBadPicture');

        buildGridRelationalIssue.call(this);

        buildPanelBasicInfo.call(this);
        buildPanelIssueProduct.call(this);
        buildPanelIssueStatus.call(this);
        buildPanelBadPicture.call(this);

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
    function buildGridRelationalIssue() {
        var anchors = this._anchors;

        var relationals = new Collection();
        var items = [
            {no: "AA2015030012", date: "20150305", customer: "臻鼎", appearance: "氣泡"},
            {no: "AA2015050082", date: "20150508", customer: "富葵", appearance: "異物"}
        ];
        relationals.add(items);

        this._gridRelationalIssue = new Grid({
            el: anchors.$gridRelationalIssue,
            data: relationals,
            columns: [
                {text: "客訴單號", dataIndex: "no"},
                {text: "客訴日期", dataIndex: "date"},
                {text: "客戶", dataIndex: "customer"},
                {text: "外觀", dataIndex: "appearance"},
                {text: "物性", dataIndex: "feature"},
                {text: "管理性", dataIndex: "manage"},
                {text: "ROHS", dataIndex: "rohs"}
            ],
            mode: Grid.MODE.SINGLE
        });

        this._gridRelationalIssue.render();

        this._gridRelationalIssue.on('select', _.bind(function(evt) {
            var model = evt.data;
            LOGGER.debug('GridRelationalIssue select: ${0}', model);
            var no = model.get('no');

            anchors.$panelDetailsTitle.text(no);
            anchors.$panelDetails.show();
        }, this));

        this._gridRelationalIssue.on('deselect', _.bind(function(evt) {
            anchors.$panelDetails.hide();
        }, this));
    }
    function buildPanelBasicInfo() {
        var anchors = this._anchors;
        this._panelBasicInfo = new BasicInfo();
        this.$anchor('basicInfoTitle').text('基本資料');
        this._panelBasicInfo.render();
        this._panelBasicInfo.attach(anchors.$panelBasicInfo);

        FieldUtil.setIsEditable(this._panelBasicInfo.$el, false);
    }
    function buildPanelIssueProduct() {
        var anchors = this._anchors;
        this._panelIssueProduct = new IssueProduct();
        this.$anchor('issueProductTitle').text('客訴產品');
        this._panelIssueProduct.render();
        this._panelIssueProduct.attach(anchors.$panelIssueProduct);

        FieldUtil.setIsEditable(this._panelIssueProduct.$el, false);
    }
    function buildPanelIssueStatus() {
        var anchors = this._anchors;
        this._panelIssueStatus = new IssueStatus();
        this.$anchor('issueStatusTitle').text('客訴情形');
        this._panelIssueStatus.render();
        this._panelIssueStatus.attach(anchors.$panelIssueStatus);

        FieldUtil.setIsEditable(this._panelIssueStatus.$el, false);
    }
    function buildPanelBadPicture() {
        var anchors = this._anchors;
        this._panelBadPicture = new BadPicture();
        this.$anchor('badPictureTitle').text('不良照片');
        this._panelBadPicture.render();
        this._panelBadPicture.attach(anchors.$panelBadPicture);

        FieldUtil.setIsEditable(this._panelBadPicture.$el, false);
    }
    var props = {
        _anchors: undefined,
        _gridRelationalIssue: undefined,
        // panels
        _panelIssueProduct: undefined,
        _panelBasicInfo: undefined,
        _panelIssueStatus: undefined,
        _panelBadPicture: undefined
    };

    var RelationalIssue = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return RelationalIssue;
});
