/**
 * Created by jackho on 1/6/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection',
    'text!../tpl/MenuDraft.html', 'text!../tpl/Draft.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, menuTpl, tpl, Logger) {

    var LOGGER = new Logger("EndProductAppearanceApply/gadget/Draft");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {
            $gridDraft: undefined
        };

        this._title = i18n.translate("開啟草稿");
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

        buildMenu.call(this);
        buildGridDraft.call(this);

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
    function buildMenu() {
        this._menu = new Triggers({
            tpl: menuTpl
        }).render();
        this.menu(this._menu);
    }
    function buildGridDraft() {
        var anchors = this._anchors;
        anchors.$gridDraft = this.$anchor("gridDraft");

        var drafts = new Collection();
        var items = [
            {no: "1", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-09"},
            {no: "2", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-09"},
            {no: "3", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-10"},
            {no: "4", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-10"},
            {no: "5", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-12"}
        ];
        drafts.add(items);

        this._gridDraft = new Grid({
            el: anchors.$gridDraft,
            data: drafts,
            columns: [
                {text: "異常單號", dataIndex: "no"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "異常工作屬性", dataIndex: "abnAttribute"},
                {text: "建立日期", dataIndex: "createDate"}
            ],
            mode: Grid.MODE.SINGLE
        });

        this._gridDraft.render();

        this._gridDraft.on('select', _.bind(onGridDraftSelect, this));
    }
    function onGridDraftSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('selectDraft', event);
    }
    var props = {
        _anchors: undefined,
        _gridDraft: undefined,
        _menu: undefined
    };


    var Draft = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Draft.COMMAND = {
        //NEW: "NEW"
    };

    return Draft;
});