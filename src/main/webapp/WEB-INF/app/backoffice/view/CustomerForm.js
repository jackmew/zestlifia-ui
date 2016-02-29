/**
 * Created by jackho on 2/18/16.
 *
 * scenario:
 * 客訴作業 -> 客訴案件管理 -> 客戶
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'widget/FormLayout', 'widget/Select', 'widget/Input', 'widget/InputButton', 'widget/Gridcrud',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, FormLayout,
                                 Select, Input, InputButton, Gridcrud,
                                 Logger) {

    var LOGGER = new Logger("view/CustomerForm");

    var declare = lang.declare;

    var Base = FormLayout;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
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

        build.call(this);

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
    function build() {
        var rowCustomer1 = this.addRow();

        var selectArea = new Input({
            caption: '公司地區',
            option: [
                {text: '', value: ''},
                {text: '台虹昆山電子', value: '台虹昆山電子'},
                {text: '深圳台虹', value: '深圳台虹'},
                {text: '台虹科技', value: '台虹科技'}
            ]
        }).render();
        this.addField(rowCustomer1, selectArea, '', 2, 3);

        var textNo = new Input({
            caption: '客戶編號'
        }).render();
        this.addField(rowCustomer1, textNo, '', 2, 3);

        var rowCustomer2 = this.addRow();

        var textName = new Input({
            caption: '客戶名稱'
        }).render();
        this.addField(rowCustomer2, textName, '' , 2, 3);

        var ibCustomer = new InputButton().render();
        this.addField(rowCustomer2, ibCustomer, '', 2, 3);

        var rowCustomer3 = this.addRow();

        var cns = new Collection();
        var items = [
            {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "May Shih", phone: "0911234098"},
            {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "Jack Ho", phone: "0912098123"},
            {no: "DF50111", customerName: "深圳精誠達", companyLocation: "深圳台虹", customerArea: "大陸華南", contact: "Frank Lin", phone: "0913098223"},
            {no: "DF0173", customerName: "台郡", companyLocation: "台虹科技", customerArea: "台灣南區", contact: "Jason Lin", phone: "0989123098"}
        ];
        cns.add(items);
        var gridCustomer = new Gridcrud({
            data: cns,
            columns: [
                {text: "客戶編號", dataIndex: "no"},
                {text: "客戶名稱", dataIndex: "customerName"},
                {text: "公司地區", dataIndex: "companyLocation"},
                {text: "客戶地區別", dataIndex: "customerArea"},
                {text: "客戶聯絡人", dataIndex: "contact"},
                {text: "客戶聯絡人電話", dataIndex: "phone"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this.addGrid(rowCustomer3, gridCustomer);
    }
    var props = {
        _anchors: undefined
    };

    var CustomerForm = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return CustomerForm;
});