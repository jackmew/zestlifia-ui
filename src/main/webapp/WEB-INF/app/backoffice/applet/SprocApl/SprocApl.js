/**
 * Created by jackho on 1/4/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Editor', './gadget/Draft',
    'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Editor, Draft, tplMenu, Logger) {

    var LOGGER = new Logger("SprocApl");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._title = i18n.translate("成品特採申請");
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
        var menu = new Triggers({
            tpl: tplMenu
        }).render();

        menu.on("trigger", _.bind(onCommandTrigger, this));

        this.menu(menu);
    }

    function create() {
        var editor = new Editor().render();

        this.add(editor, {
            closable: true
        });
    }
    function open() {
        this._draft = new Draft({
            title: '草稿'
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this));
    }
    function onGridDraftSelect(evt) {
        var model = evt.data;
        var no = model.get('no');
        LOGGER.debug("Inbox select Model - no: ${0}", no);

        var path = './applet/SprocApl/gadget/';
        var gadgetName = "Editor";
        var module = path + gadgetName ;
        var mode = "DRAFT";
        var title = "草稿-"+no;

        var context = this ;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                title: title,
                mode: mode
            }).render();
            context.add(gadget, {
                closable: true
            });
        });
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case SprocApl.COMMAND.CREATE:
                this.create();
                break;
            case SprocApl.COMMAND.OPEN:
                this.open();
                break;
            default:
                break;
        }
    }


    var props = {

    };


    var SprocApl = declare(Base, {
        initialize: initialize,
        render: render,

        create: create,
        open: open
    }, props);

    // Enumeration of build in commands
    SprocApl.COMMAND = {
        CREATE: 'CREATE',
        SAVE: 'SAVE',
        OPEN: 'OPEN',
        CHECK: 'CHECK',
        SEND: 'SEND',
        ERASE: 'ERASE',
        CLOSE: 'CLOSE'
    };

    return SprocApl;
});