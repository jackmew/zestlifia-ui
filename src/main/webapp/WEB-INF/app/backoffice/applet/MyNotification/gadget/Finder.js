/**
 * Created by jackho on 2/26/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers',
    'uweaver/widget/TabPanel', 'uweaver/data/Collection',
    'text!widget/tpl/TabPanel.html', 'widget/Gridcrud',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, TabPanel, Collection,
                                tabPanelTpl, Gridcrud,
                                Logger) {

    var LOGGER =  new Logger("MyNotification/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {
            $tabPanel: undefined
        };

        this.title('通知');
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

        buildTabPanel.call(this);

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
    function buildTabPanel() {

        this._tabPanel = new TabPanel({
            tpl: tabPanelTpl
        }).render();

        this._tabPanel.add(buildUnread.call(this), {
            title: "未讀"
        });

        this._tabPanel.add(buildRead.call(this), {
            title: "已讀"
        });

        this._tabPanel.select(0);
        this._tabPanel.attach(this.$el);

        LOGGER.debug("buildTabPanel done");
    }
    function buildUnread() {
        var Collect = declare(Collection, {
            resource: 'myNotification/notification'
        });
        var collect = new Collect();
        collect.fetch({async: false});

        this._gridUnread = new Gridcrud({
            data: collect,
            columns: [
                {text: "通知日期", dataIndex: "date"},
                {text: "單號", dataIndex: "no"},
                {text: "主旨",    dataIndex: "main"},
                {text: "類別", dataIndex: "type"}
            ],
            pagination: {
                is: true,
                render: true
            },
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this._gridUnread._grid.on('select', _.bind(onGridSelect, this));
        return this._gridUnread;
    }
    function buildRead() {
        var Collect = declare(Collection, {
            resource: 'myNotification/read'
        });
        var collect = new Collect();
        collect.fetch({async: false});

        this._gridRead = new Gridcrud({
            data: collect,
            columns: [
                {text: "通知日期", dataIndex: "date"},
                {text: "單號", dataIndex: "no"},
                {text: "主旨",    dataIndex: "main"},
                {text: "類別", dataIndex: "type"}

            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.MINUS, tip: {title: "刪除通知"}},
                    {name: Gridcrud.TOOL.EYE, tip: {title: "檢視內容"}}
                ]
            },
            pagination: {
                is: true,
                render: true
            },
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this._gridRead.on('command', _.bind(onCommandClick, this));
        return this._gridRead;
    }
    function onGridSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };
        this.trigger('select', event);
    }
    function onCommandClick(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data.value[0]
        };
        this.trigger('select', event);
    }

    var props = {
        _anchors: undefined,
        _tabPanel: undefined,

        _gridUnread: undefined,
        _gridRead: undefined
    };


    var Finder = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Finder.COMMAND = {
    };

    return Finder;
});