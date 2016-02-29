/**
 * Created by jackho on 1/6/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'widget/Gridcrud',
    'uweaver/data/Collection',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Collection, Logger) {

    var LOGGER = new Logger("EndProductAbnormalApply/gadget/Draft");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            title: '草稿',
            mode: undefined
        };

        _.defaults(this._cfg, defaults);

        this._anchors = {
            $gridDraft: undefined
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
            {no: "1", createArea: "台灣地區", abnAttribute: "FQC", createDate: "20151220"},
            {no: "2", createArea: "台灣地區", abnAttribute: "PQC", createDate: "20151230"}
        ];
        drafts.add(items);

        this._gridDraft = new Gridcrud({
            data: drafts,
            columns: [
                {text: "異常單號", dataIndex: "no"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "異常工作屬性", dataIndex: "abnAttribute"},
                {text: "建立日期", dataIndex: "createDate"}
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
        _anchors: undefined,
        _gridDraft: undefined
    };


    var Draft = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Draft.COMMAND = {
        //NEW: "NEW"
    };

    Draft.MODE = {
        NEW_HALF: 'NEW_HALF',
        NEW: 'NEW'
    };

    return Draft;
});