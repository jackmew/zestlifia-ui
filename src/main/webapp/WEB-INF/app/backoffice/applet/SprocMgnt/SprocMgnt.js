/**
 * Created by jackho on 1/26/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers',
    'uweaver/data/Collection', 'uweaver/widget/Widget',
    'text!./tpl/Menu.html', './gadget/Finder',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Collection, Widget,
                                tplMenu, Finder,
                                Logger) {

    var LOGGER = new Logger("SprocMgnt/SprocMgnt");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._title = i18n.translate("管理特採申請");
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
        buildFinder.call(this);

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
    function buildMenu() {
        this._menu = new Triggers({
            tpl: tplMenu
        }).render();

        this.menu(this._menu);
    }
    function buildFinder() {

        this.once('attach', function() {

            this._finder = new Finder().render();
            this._finder.on('select', _.bind(onGridSelect, this));
            this.add(this._finder);

            LOGGER.debug("buildFinder done");

        }, this);
    }
    function onGridSelect(event) {
        var model = event.data;
        var type = model.get('type');
        LOGGER.debug("Inbox select Model - type: ${0}", type);

        var path;
        var gadgetName;
        var mode = "MGNT_SPROC";

        if(!_.isUndefined(type)) {
            if(type === "成品特採") {
                path = './applet/SprocApl/gadget/';
                gadgetName = "Editor";
            } else if(type === "原料特採") {
                path = './applet/SprocMaterialApl/gadget/';
                gadgetName = "Editor";
            }
        }
        var no = model.get('no');
        var newTitle = type+'-'+no;

        var module = path + gadgetName ;
        var context = this;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                mode: mode,
                newTitle: newTitle
            });

            gadget.render();
            context.add(gadget, {
                closable: true
            });
        });
    }
    var props = {
        _anchors: undefined,
        _finder: undefined
    };


    var SprocMgnt = declare(Base, {
        initialize: initialize,
        render: render
    }, props);



    return SprocMgnt;
});