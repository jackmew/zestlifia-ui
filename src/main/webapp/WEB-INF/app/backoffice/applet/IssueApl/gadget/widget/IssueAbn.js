/**
 * Created by jackho on 1/28/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup', '../../../../widget/Panel',
    '../../../../util/FieldUtil',
    'text!../../tpl/widget/IssueAbn.html',
    'applet/SprocApl/gadget/widget/SprocInfo', 'applet/SprocApl/gadget/widget/SprocAbn', 'applet/SprocApl/gadget/widget/SignoffRecord',
    'applet/SprocMaterialApl/gadget/widget/SprocMaterialInfo', 'applet/SprocMaterialApl/gadget/widget/SprocMaterialStatus',
    'applet/SprocMaterialApl/gadget/widget/InvestLimit', 'applet/SprocMaterialApl/gadget/widget/SprocMaterialAbn', 'applet/SprocMaterialApl/gadget/widget/SignoffRecord',
    'view/Attachment',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Panel,
                                 FieldUtil,
                                 tpl,
                                 SprocInfo, SprocAbn, SignoffRecord,
                                 SprocMaterialInfo, SprocMaterialStatus, InvestLimit, SprocMaterialAbn, SignoffRecordMaterial,
                                 Attachment,
                                 Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/IssueAbn");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $gridAbn: undefined,
            $panelProducts: undefined,
            $panelMaterials: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$gridAbn = this.$anchor('gridAbn');
        anchors.$panelProducts = this.$anchor('panelProducts');
        anchors.$panelMaterials = this.$anchor('panelMaterials');


        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildGridAbn.call(this);
        buildPanelProducts.call(this);
        buildPanelMaterials.call(this);

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
    function buildGridAbn() {
        var anchors = this._anchors;

        var abns = new Collection();
        var items = [
            {no: "IT2015120035", type: "成品特採", sprocType: "保質期不足(含展延)-庫存調度",buildArea: "台灣地區", createDate: new Date("2015-12-06")},
            {no: "IT2015120030", type: "原料特採", sprocType: "未檢驗出貨-業務急拉單", decideType: "", buildArea: "台灣地區", createDate: new Date("2015-12-21")}

        ];
        abns.add(items);

        this._gridAbn = new Grid({
            el: anchors.$gridAbn,
            data: abns,
            columns: [
                {text: "特採單號", dataIndex: "no"},
                {text: "類別", dataIndex: "type"},
                {text: "特採類別", dataIndex: "sprocType"},
                {text: "開立地區", dataIndex: "buildArea"},
                {text: "建立日期", dataIndex: "createDate"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        this._gridAbn.on('select', _.bind(onGridAbnSelect, this));
    }
    function onGridAbnSelect(evt) {
        var anchors = this._anchors;
        var model = evt.data;
        var type = model.get('type');

        if(type === '成品特採') {
            anchors.$panelProducts.show();
            anchors.$panelMaterials.hide();
        } else {
            anchors.$panelProducts.hide();
            anchors.$panelMaterials.show();
        }
    }
    function buildPanelProducts() {
        var anchors = this._anchors;

        // sprocInfo
        this._panelSprocInfo = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '特採資料'
        }).render();
        var sprocInfo = new SprocInfo().render();
        FieldUtil.setIsEditable(sprocInfo, false);

        this._panelSprocInfo.setContent(sprocInfo);
        this._panelSprocInfo.attach(anchors.$panelProducts);

        // sprocAttachment
        this._panelSprocAttachment = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '相關附件'
        }).render();
        var sprocAttachment = new Attachment().render();
        FieldUtil.setIsEditable(sprocAttachment, false);

        this._panelSprocAttachment.setContent(sprocAttachment);
        this._panelSprocAttachment.attach(anchors.$panelProducts);

        // sprocAbn
        this._panelSprocAbn = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '相關異常'
        }).render();
        var sprocAbn = new SprocAbn().render();
        FieldUtil.setIsEditable(sprocAbn, false);

        this._panelSprocAbn.setContent(sprocAbn);
        this._panelSprocAbn.attach(anchors.$panelProducts);

        // signoffRecord
        this._panelSignOffRecord = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '簽核紀錄'
        }).render();
        var signoffRecord = new SignoffRecord().render();
        FieldUtil.setIsEditable(signoffRecord, false);

        this._panelSignOffRecord.setContent(signoffRecord);
        this._panelSignOffRecord.attach(anchors.$panelProducts);
    }
    function buildPanelMaterials() {
        var anchors = this._anchors;

        this._panelSprocMaterialInfo = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '特採資料'
        }).render();
        var sprocMaterialInfo = new SprocMaterialInfo().render();
        FieldUtil.setIsEditable(sprocMaterialInfo, false);
        this._panelSprocMaterialInfo.setContent(sprocMaterialInfo);
        this._panelSprocMaterialInfo.attach(anchors.$panelMaterials);

        this._panelSprocMaterialStatus = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '特採情形'
        }).render();
        var sprocMaterialStatus = new SprocMaterialStatus().render();
        FieldUtil.setIsEditable(sprocMaterialStatus, false);
        this._panelSprocMaterialStatus.setContent(sprocMaterialStatus);
        this._panelSprocMaterialStatus.attach(anchors.$panelMaterials);

        this._panelSprocMaterialAttachment = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '相關附件'
        }).render();
        var  sprocMaterialAttachment = new Attachment().render();
        FieldUtil.setIsEditable(sprocMaterialAttachment, false);
        this._panelSprocMaterialAttachment.setContent(sprocMaterialAttachment);
        this._panelSprocMaterialAttachment.attach(anchors.$panelMaterials);

        this._panelSprocInvestLimit = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '投產限制'
        }).render();
        var  investLimit = new InvestLimit().render();
        FieldUtil.setIsEditable(investLimit, false);
        this._panelSprocInvestLimit.setContent(investLimit);
        this._panelSprocInvestLimit.attach(anchors.$panelMaterials);

        this._panelSprocMaterialAbn = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '相關異常'
        }).render();
        var  sprocMaterialAbn = new SprocMaterialAbn().render();
        FieldUtil.setIsEditable(sprocMaterialAbn, false);
        this._panelSprocMaterialAbn.setContent(sprocMaterialAbn);
        this._panelSprocMaterialAbn.attach(anchors.$panelMaterials);

        this._panelSprocMaterialSignOffRecord = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '簽核紀錄'
        }).render();
        var  signoffRecordMaterial = new SignoffRecordMaterial().render();
        FieldUtil.setIsEditable(signoffRecordMaterial, false);
        this._panelSprocMaterialSignOffRecord.setContent(signoffRecordMaterial);
        this._panelSprocMaterialSignOffRecord.attach(anchors.$panelMaterials);
    }
    var props = {
        _anchors: undefined,
        _gridAbn: undefined,
        // panelProducts
        _panelSprocInfo: undefined,
        _panelSprocAttachment: undefined,
        _panelSprocAbn: undefined,
        _panelSignOffRecord: undefined,
        // panelMaterials
        _panelSprocMaterialInfo: undefined,
        _panelSprocMaterialStatus: undefined,
        _panelSprocMaterialAttachment: undefined,
        _panelSprocInvestLimit: undefined,
        _panelSprocMaterialAbn: undefined,
        _panelSprocMaterialSignOffRecord: undefined
    };

    var IssueAbn = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return IssueAbn;
});