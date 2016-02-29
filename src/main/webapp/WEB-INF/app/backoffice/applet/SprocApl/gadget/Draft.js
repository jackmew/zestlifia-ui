/**
 * Created by jackho on 2/24/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', '../../../widget/Gridcrud',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', 'uweaver/widget/Widget', '../../../util/FieldUtil', 'uweaver/widget/Popup',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Collection, TabPanel, Widget, FieldUtil, Popup,
                                Logger) {

    var LOGGER = new Logger("AbnMaterial/Draft");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            title: '草稿'
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
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildGridDraft.call(this);

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
    function buildGridDraft() {
        var drafts = new Collection();
        var items = [
            {no: "1", createArea: "台灣地區", createDate: "2015-12-21", type: "不符合客規出貨"}
        ];
        drafts.add(items);

        this._gridDraft = new Gridcrud({
            data: drafts,
            columns: [
                {text: "特採單號", dataIndex: "no"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "建立日期", dataIndex: "createDate"},
                {text: "特採類別", dataIndex: "type"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();

        this._gridDraft.attach(this.$el);

        this._gridDraft._grid.on('select', _.bind(onGridDraftSelect, this));
    }
    function onGridDraftSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('select', event);
    }

    var props = {
        _anchors: undefined
    };


    var Draft = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Draft.COMMAND = {
    };

    return Draft;
});