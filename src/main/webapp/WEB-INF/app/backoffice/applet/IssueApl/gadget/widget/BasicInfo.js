/**
 * Created by jackho on 1/22/16.
 *
 * A part one of IssueApl tab.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../widget/Modal' , 'view/AssigneeModal',
    'text!../../tpl/widget/BasicInfo.html', '../Editor', '../../../../util/FieldUtil',
    'text!../../tpl/CustomerNamePopup.html', 'text!../../tpl/AssigneeNoPopup.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, Modal, AssigneeModal,
                                 tpl, Editor, FieldUtil, customerNamePopupTpl, assigneeNoPopupTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/BasicInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $inputPopup: undefined,
            $assignee: undefined,
            $gridCustomerName: undefined,
            $gridAssigneeNo: undefined
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
        anchors.$inputPopup = this.$anchor('inputPopup');
        anchors.$assignee = this.$anchor('assignee');
        buildInputPopup.call(this);

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
    function buildInputPopup() {
        var anchors = this._anchors;

        this._inputPopup = new Triggers({
            el: anchors.$inputPopup
        }).render();

        this.listenTo(this._inputPopup, 'trigger', _.bind(onInputPopupClick, this));
        //anchors.$inputPopup.on('click',  _.bind(onInputPopupClick, this));

        LOGGER.debug("buildTextPopup done");
    }
    function onInputPopupClick(evt) {
        var value = evt.data.value;
        LOGGER.debug("onTextPopupClick - value: ${0}", value);
        if(value === 'CUSTOMER_NAME') {
            customerPopup.call(this);
        } else if(value === 'ASSIGNEE_NO') {
            assigneePopup.call(this);
        }
    }
    function assigneePopup() {
        var anchors = this._anchors;

        if(_.isUndefined(this._modaAssignee)){
            this._modaAssignee = new AssigneeModal().render();
        }

        this._modaAssignee.show();
    }
    function customerPopup() {
        if(this._customerNamePopup != undefined) {
            this._customerNamePopup.show();
        } else {
            this._customerNamePopup = new Popup({
                tpl: customerNamePopupTpl
            }).render();
            buildGridCustomerName.call(this);
            this._customerNamePopup.show();
        }
    }
    function buildGridCustomerName() {
        var anchors = this._anchors;
        anchors.$gridCustomerName = this._customerNamePopup.$anchor("gridCustomerName");

        var cns = new Collection();
        var items = [
            {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "May Shih", phone: "0911234098"},
            {no: "DF20121", customerName: "富葵", companyLocation: "台虹昆山電子", customerArea: "大陸鼎", contact: "Jack Ho", phone: "0912098123"},
            {no: "DF50111", customerName: "深圳精誠達", companyLocation: "深圳台虹", customerArea: "大陸華南", contact: "Frank Lin", phone: "0913098223"},
            {no: "DF0173", customerName: "台郡", companyLocation: "台虹科技", customerArea: "台灣南區", contact: "Jason Lin", phone: "0989123098"}
        ];
        cns.add(items);

        this._gridCustomerName = new Grid({
            el: anchors.$gridCustomerName,
            data: cns,
            columns: [
                {text: "客戶編號", dataIndex: "no"},
                {text: "客戶名稱", dataIndex: "customerName"},
                {text: "公司地區", dataIndex: "companyLocation"},
                {text: "客戶地區別", dataIndex: "customerArea"},
                {text: "客戶聯絡人", dataIndex: "contact"},
                {text: "客戶聯絡人電話", dataIndex: "phone"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    var props = {
        _anchors: undefined,
        // customerName
        _customerNamePopup: undefined,
        _gridCustomerName: undefined,
        // assigneeNo
        _modaAssignee: undefined
    };

    var BasicInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return BasicInfo;
});
