/**
 * Created by jackho on 1/18/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection', 'text!../tpl/Finder.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, tpl, Logger) {

    var LOGGER =  new Logger("AbnEndProductEffect/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {
            $gridEffect: undefined
        };

        this._title = i18n.translate("成品異常效果確認");
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

        buildGridEffect.call(this);

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

    function buildGridEffect() {
        var anchors = this._anchors;
        anchors.$gridEffect = this.$anchor("gridEffect");

        var effects = new Collection();
        var items = [
            {no: "IT2015080061", type: "成品特性", createArea: "台灣地區", createDate: "20150816", endDate: "20151128", confirmResult: "對策審查中", latestUpdate: "201601013"},
            {no: "IT2015080063", type: "成品外觀", createArea: "台灣地區", createDate: "20150816", endDate: "20151130", confirmResult: "對策審查中", latestUpdate: "201601015"},
            {no: "IT2015080068", type: "成品特性", createArea: "台灣地區", createDate: "20150818", endDate: "20151230", confirmResult: "未執行",    latestUpdate: ""}
        ];
        effects.add(items);

        this._gridEffect = new Grid({
            el: anchors.$gridEffect,
            data: effects,
            columns: [
                {text: "異常單號", dataIndex: "no"},
                {text: "類別",    dataIndex: "type"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "建立日期", dataIndex: "createDate"},
                {text: "結案日期", dataIndex: "endDate"},
                {text: "確認效果", dataIndex: "confirmResult"},
                {text: "最近更新日期", dataIndex: "latestUpdate"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
        this.listenTo(this._gridEffect, 'select', _.bind(onGridEffectSelect, this));
    }
    function onGridEffectSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('select', event);
    }

    var props = {
        _anchors: undefined,
        _gridEffect: undefined
    };


    var Finder = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Finder.COMMAND = {
        OPEN: "OPEN"
    };

    return Finder;
});