/**
 * Created by jackho on 2/15/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', '../../../widget/Gridcrud',
    'uweaver/data/Collection', 'text!../tpl/Draft.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Collection,
                                tpl, Logger) {

    var LOGGER =  new Logger("IssueApl/Draft");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {
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

        buildGrid.call(this);

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
    function buildGrid() {
        var drafts = new Collection();
        var items = [
            {no: "10", date: "20160120", customer: "富奎", itemName: "BTNTA01525W33", type: "2-Layer"},
            {no: "15", date: "20160130", customer: "臻鼎", itemName: "BTNTA01525W43", type: "3-Layer"}
        ];
        drafts.add(items);

        this._grid = new Gridcrud({
            data: drafts,
            columns: [
                {text: "客訴單號", dataIndex: "no"},
                {text: "客訴日期", dataIndex: "date"},
                {text: "客戶", dataIndex: "customer"},
                {text: "品目", dataIndex: "itemName"},
                {text: "產品類別", dataIndex: "type"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this.listenTo(this._grid, 'gridSelect', _.bind(onGridSelect, this));

        this._grid.attach(this.$el.find("div.col-sm-12"));
    }
    function onGridSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('gridSelect', event);
    }

    var props = {
        _grid: undefined
    };


    var Draft = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Draft.COMMAND = {
        OPEN: "OPEN"
    };

    return Draft;
});