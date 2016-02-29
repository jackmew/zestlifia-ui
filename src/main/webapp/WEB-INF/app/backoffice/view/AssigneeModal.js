/**
 * Created by jackho on 2/17/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'widget/Gridcrud', 'widget/Modal', 'uweaver/widget/Popup', 'widget/Panel', 'widget/FormLayout', 'widget/Input', 'widget/InputButton',
    'widget/Commandbar',
    'text!./tpl/AssigneeModal.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Gridcrud, Modal, Popup, Panel, FormLayout, Input, InputButton,
                                 Commandbar,
                                 tpl, Logger) {

    var LOGGER = new Logger("view/AssigneeModal");

    var declare = lang.declare;

    var Base = Popup;

    function initialize() {

        Base.prototype.initialize.call(this, {tpl: tpl});
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildPanel.call(this);
        buildForm.call(this);
        buildGrid.call(this);
        buildCommandbar.call(this);

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
    function buildPanel() {
        this._panel = new Panel({
            title: '工號查詢'
        }).render();

        this._panel.$el.find('.panel-body').css('width','800px');

        this.$el.append(this._panel.$el);
    }
    function buildForm() {
        this._formLayout = new FormLayout().render();

        var row1 = this._formLayout.addRow();
        var inputNo = new Input({
            caption: '工號',
            name: 'no'
        }).render();
        this._formLayout.addField(row1, inputNo, '', 2, 8);

        var row2 = this._formLayout.addRow();
        var inputName = new Input({
            caption: '姓名',
            name: 'name'
        }).render();
        this._formLayout.addField(row2, inputName, '', 2, 8);

        var inputButton = new InputButton({
            value: 'search'
        }).render();
        this._formLayout.addField(row2, inputButton, '', 0, 2);

        this._panel.setContent(this._formLayout.$el);

    }
    function buildGrid() {
        var anchors = this._anchors;

        var nos = new Collection();
        var items = [
            {no: "S100618", name: "鮑之勇", extension: "86103", department: "秦皇島辦事處", branch: "珠海分公司"},
            {no: "S100620", name: "王小花", extension: "86930", department: "秦皇島辦事處", branch: "珠海分公司"}
        ];
        nos.add(items);

        this._grid = new Gridcrud({
            //el: anchors.$grid,
            data: nos,
            columns: [
                {text: "工號", dataIndex: "no"},
                {text: "姓名", dataIndex: "name"},
                {text: "分機", dataIndex: "extension"},
                {text: "部門", dataIndex: "department"},
                {text: "公司別", dataIndex: "branch"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();

        this._panel.setContent(this._grid.$el);
    }
    function buildCommandbar() {
        this._commandbar = new Commandbar();
        this._commandbar.create("confirm", "確認");
        this._commandbar.create("close", "關閉");
        this._commandbar.render();
        this._commandbar.align(Commandbar.ALIGN.CENTER);

        this._panel.setContent(this._commandbar.$el);
    }
    var props = {
        _anchors: undefined,

        _panel: undefined,
        _formLayout: undefined,
        _commandbar: undefined
    };

    var AssigneeModal = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return AssigneeModal;
});