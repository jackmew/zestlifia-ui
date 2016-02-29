/**
 * Created by jackho on 2/2/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    'text!./tpl/FormDemo.html',
    'widget/Input', 'widget/FormLayout', 'widget/Form', 'widget/CRBox', 'widget/Select',
    'widget/Textarea', 'widget/InputButton',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup,
                                tpl, Input, FormLayout, Form, CRBox, Select,
                                Textarea, InputButton, Logger) {

    var LOGGER = new Logger("applet/Test/FormDemo");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {

        };

        this._title = i18n.translate("FormDemo");
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

        var anchors = this._anchors;


        buildFormLayout.call(this);

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

    function buildFormLayout() {
        var $content = this.$anchor('formWidget');


        var fl = new FormLayout().render();
        var row1 = fl.addRow();
        //row1.gutter(20);
        // input text
        var t = new Input({
            value: 't',
            name: 't',
            caption: '客訴單號',
            isRequired: true
        }).render();
        fl.addField(row1, t, '');

        // input date
        var d = new Input({
            value: "2016-01-01",
            name: 'd',
            caption: '客訴日期',
            type: Input.TYPE.DATE
        }).render();
        fl.addField(row1, d,'');
        d.setIsRequired(true);


        // input number
        var n = new Input({
            value: 100,
            name: 'n',
            caption: '數量',
            type: Input.TYPE.NUMBER
        }).render();
        fl.addField(row1, n, '');


        var row2 = fl.addRow();

        // select
        var select = new Select({
            caption: "填單人",
            options: [
                {text: "XXX", value: "X"},
                {text: "YYY", value: "Y"}
            ],
            isRequired: true
        }).render();
        fl.addField(row2,  select,'');

        // radio
        var radio = new CRBox({
            caption: '符合HSF產品',
            name: 'isHSF',
            options: [
                {text: "是", value: "Y"},
                {text: "否", value: "N"}
            ],
            isRequired: true
        }).render();
        //fl.addField(row2, radio, 5, 3);
        fl.addField(row2, radio, '');

        // checkbox
        var check = new CRBox({
            caption: '臨時措施',
            name: 'temp',
            options: [
                {text: '更換原料', value: 'changeMaterial'},
                {text: '通知品保判定', value: 'notify'},
                {text: '開立異常單', value: 'createAbn'},
                {text: '擷取異常樣品', value: 'catchAbn'}
            ],
            layout: CRBox.LAYOUT.HORIZONTAL,
            type: CRBox.TYPE.CHECK,
            isRequired: true
        }).render();
        //fl.addField(row2, check, 1, 3);
        fl.addField(row2, check, '');


        var row3 = fl.addRow();

        var area = new Textarea({
            caption: '備註',
            isRequired: true,
            value: 'Nice to mee you!'
        }).render();
        fl.addField(row3, area, '');


        var ibSide = new InputButton({
            mode: InputButton.MODE.SIDE,
            caption: "發現者",
            isRequired: true,
            value: "兇手"
        }).render();
        fl.addField(row3,ibSide, '');

        var ibSearch = new InputButton({
            mode: InputButton.MODE.SEARCH
        }).render();
        ibSearch.on('trigger', function(evt) {
            alert("trigger");
        });
        fl.addField(row3, ibSearch, '');


        //this.$('button').on('click', function() {
        //    console.log(area.rows(10));
        //});




        fl.attach($content);
    }

    var props = {
        _anchors: undefined
    };


    var FormDemo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    FormDemo.COMMAND = {
    };

    return FormDemo;
});