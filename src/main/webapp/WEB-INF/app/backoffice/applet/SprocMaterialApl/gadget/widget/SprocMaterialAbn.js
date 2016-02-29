/**
 * Created by jackho on 1/28/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', '../../../../widget/Gridcrud', 'uweaver/widget/Popup' , '../../../../widget/Panel',
    'applet/AbnMaterial/gadget/widget/AbnMaterialInfo','applet/AbnMaterial/gadget/widget/AbnMaterialProduct','view/Attachment',
    '../../../../util/FieldUtil',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Gridcrud, Popup, Panel,
                                 Info, Product, Attachment, FieldUtil,
                                 Logger) {

    var LOGGER = new Logger("SprocMaterialApl/gadget/widget/SprocMaterialAbn");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            //tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $panels: undefined,
            $label: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        //this.hide();
        buildGrid.call(this);
        buildPanels.call(this);

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
    function buildGrid() {
        var a = this._anchors;
        var drafts = new Collection();
        var items = [
            {no: "IT201601002", type: "驗退", createArea: "台灣地區", abnAttribute: "IQC"},
            {no: "IT201601006", type: "倉退", createArea: "台灣地區", abnAttribute: "IQC"}
        ];
        drafts.add(items);

        this._gridcrud = new Gridcrud({
            data: drafts,
            columns: [
                {text: "異常單號", dataIndex: "no"},
                {text: "類別", dataIndex: "type"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "異常工作屬性", dataIndex: "abnAttribute"}
            ],
            mode: Gridcrud.MODE.SINGLE

        }).render();

        this.$el.append(this._gridcrud.$el);

        this._gridcrud._grid.on('select', _.bind(onGridSelect, this));
        this._gridcrud._grid.on('deselect', function() {
            a.$panels.hide();
        })
    }

    function onGridSelect(evt) {
        var anchors = this._anchors;
        var model = evt.data ;
        var no = model.get('no');

        setPanel.call(this, no);
    }
    function buildPanels() {
        var a = this._anchors ;
        a.$panels = $('<div/>');
        a.$panels.hide();

        a.$label = $('<span/>');
        a.$label.addClass('label label-primary');
        a.$panels.append(a.$label);

        this._panelInfo = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '基本資料'
        }).render();
        var info = new Info().render();
        FieldUtil.setIsEditable(info, false);
        this._panelInfo.setContent(info);
        a.$panels.append(this._panelInfo.$el);

        this._panelProduct = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '異常產品'
        }).render();
        var product = new Product().render();
        //FieldUtil.setIsEditable(product, false); // 非常非常怪的問題，product.$anchor('toolbar')會同時選到Table
        product.$anchor('toolbar').find('.pull-right').remove();
        this._panelProduct.setContent(product);
        a.$panels.append(this._panelProduct.$el);

        this._panelAttachment = new Panel({
            collapse: true,
            theme: Panel.THEME.INFO,
            title: '相關附件'
        }).render();
        var attachment = new Attachment().render();
        FieldUtil.setIsEditable(attachment, false);
        this._panelAttachment.setContent(attachment);
        a.$panels.append(this._panelAttachment.$el);


        this.$el.append(a.$panels);
    }
    function setPanel(no) {
        var a = this._anchors ;
        a.$label.text(no);
        a.$panels.show();
    }
    function setLabel(title) {
        var anchors = this._anchors;
        anchors.$label.text(title);
    }
    var props = {
        _anchors: undefined,
        _gridcrud: undefined,

        _info: undefined,
        _panelInfo: undefined,

        _product: undefined,
        _panelProduct: undefined,

        _attachment: undefined,
        _panelAttachment: undefined,

        tagName: 'div'
    };

    var SprocMaterialAbn = declare(Base, {
        initialize: initialize,
        render: render,

        setLabel: setLabel
    }, props);

    return SprocMaterialAbn;
});