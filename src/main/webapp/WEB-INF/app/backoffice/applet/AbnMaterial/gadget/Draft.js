 /**
 * Created by jackho on 1/18/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection', 'uweaver/widget/TabPanel', 'uweaver/widget/Widget', '../../../util/FieldUtil', 'uweaver/widget/Popup',
    'text!../tpl/Draft.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, TabPanel, Widget, FieldUtil, Popup,
                                tpl,
                                Logger) {

    var LOGGER = new Logger("AbnMaterial/Draft");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            mode: undefined,
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
        var anchors = this._anchors;
        anchors.$gridDraft = this.$anchor("gridDraft");

        var drafts = new Collection();
        var items = [
            {no: "1", createArea: "台灣地區", abnAttribute: "IQC", createDate: "20151220"},
            {no: "3", createArea: "台灣地區", abnAttribute: "PQC", createDate: "20151230"}
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

    Draft.MODE = {
        REJECT: "REJECT",
        STORAGE: "STORAGE",
        MATERIAL: "MATERIAL",
        CASE: "CASE",
        CASENO: "CASENO"
    };


    return Draft;
});