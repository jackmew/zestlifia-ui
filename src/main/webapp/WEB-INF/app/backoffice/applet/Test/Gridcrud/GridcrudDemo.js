/**
 * Created by jackho on 2/23/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', '../../../widget/Gridcrud',
    'uweaver/data/Collection',
    'widget/FormLayout',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Gridcrud, Collection,
                                FormLayout,
                                Logger) {

    var LOGGER = new Logger("Test/GridcrudDemo");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {
        };

        this._title = i18n.translate("Gridcrud Demo");
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        var anchors = this._anchors;

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
        this._fl = new FormLayout().render();
        this._fl.css('margin-top', '30px');
        this._fl.attach(this.$el);

        var row1 = this._fl.addRow();

        buildGrid.call(this);

        row1.addGrid(this._gridcrud);

    }
    function buildGrid() {

        var GridcrudDemos = declare(Collection, {
            resource: 'workRuleAbnormalApl/iqcs'
        });
        var iqcs = new GridcrudDemos();
        iqcs.fetch({async: false});

        this._gridcrud = new Gridcrud({
            data: iqcs,
            columns: [
                {text: "代碼", dataIndex: "no"},
                {text: "名稱", dataIndex: "name"}
            ],
            pagination: {
                is: true,
                render: true
            },
            toolbar: {
                //align: Gridcrud.BAR_ALIGN.LEFT,
                tools: [
                    {name: Gridcrud.TOOL.MINUS, tip: {title: "MINUS"}},
                    {name: Gridcrud.TOOL.PLUS , tip: {title: "PLUS"} },
                    {name: Gridcrud.TOOL.EDIT , tip: {title: "EDIT"} },
                    {name: Gridcrud.TOOL.SEARCH , tip: {title: "SEARCH"} },
                    {name: Gridcrud.TOOL.CLONE , tip: {title: "CLONE"} },
                    {name: Gridcrud.TOOL.EXCEL , tip: {title: "EXCEL"} },
                    {name: Gridcrud.TOOL.UPLOAD , tip: {title: "UPLOAD"} },
                    {name: Gridcrud.TOOL.SELECT }
                ]
            },
            buttonbar: {
                btns: [
                    {value: Gridcrud.BUTTON.NEW},
                    {value: Gridcrud.BUTTON.MODIFY},
                    {value: Gridcrud.BUTTON.DELETE}
                ]
            },
            mode: Gridcrud.MODE.MULTI
        }).render();

        //this._gridDraft.on('select', _.bind(onGridDraftSelect, this));
    }

    var props = {
        _anchors: undefined,

        _fl: undefined,

        _gridcrud: undefined
    };


    var GridcrudDemo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    GridcrudDemo.COMMAND = {
        //NEW: "NEW"
    };

    return GridcrudDemo;
});