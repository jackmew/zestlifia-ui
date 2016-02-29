/**
 * Created by jackho on 1/8/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Editor', './gadget/Draft',
    'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Editor, Draft, tplMenu, Logger) {

    var LOGGER = new Logger("AbnOutSource");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = undefined;

        this._title = i18n.translate("委外異常申請");
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
        this._menu = new Triggers({
            tpl: tplMenu
        }).render();

        this._menu.on("trigger", _.bind(onCommandTrigger, this));

        this.menu(this._menu);
    }
    function onGridDraftSelect(evt) {
        var model = evt.data;
        var no = model.get('no');
        LOGGER.debug("Inbox select Model - no: ${0}", no);

        var path = './applet/AbnOutSource/gadget/';
        var gadgetName = "Editor";
        var module = path + gadgetName ;
        var mode = 'DRAFT';
        var title ;
        if(this._draft._cfg.mode === Draft.MODE.NEW) {
            title = "委外成品-"+no;
        } else {
            title = "委外半成品-"+no;
        }

        var context = this ;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                no: no,
                mode: mode,
                title: title
            }).render();
            context.add(gadget, {
                closable: true
            });
        });
    }
    function halfCreate() {
        this._editor = new Editor({
            title: '委外半成品-申請',
            mode: AbnOutSource.COMMAND.NEW_HALF_CREATE
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }

    function halfOpen() {
        this._draft = new Draft({
            title: '委外半成品-草稿',
            mode: Draft.MODE.NEW_HALF
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this));
    }

    function create() {
        this._editor = new Editor({
            title: '委外成品-申請',
            mode: AbnOutSource.COMMAND.NEW_CREATE
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }

    function open() {
        this._draft = new Draft({
            title: '委外成品-草稿',
            mode: Draft.MODE.NEW
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this));
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case AbnOutSource.COMMAND.NEW_HALF_CREATE:
                halfCreate.call(this);
                break;
            case AbnOutSource.COMMAND.NEW_HALF__OPEN:
                halfOpen.call(this);
                break;
            case AbnOutSource.COMMAND.NEW_CREATE:
                create.call(this);
                break;
            case AbnOutSource.COMMAND.NEW_OPEN:
                open.call(this);
                break;
            default:
                break;
        }
    }


    var props = {
        _menu: undefined,
        _tabPanelEditor: undefined,
        _draft: undefined,
        _editor: undefined
    };


    var AbnOutSource = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    AbnOutSource.COMMAND = {
        NEW_HALF_CREATE: 'NEW_HALF_CREATE',
        NEW_HALF__OPEN: 'NEW_HALF__OPEN',

        NEW_CREATE: 'NEW_CREATE',
        NEW_OPEN: 'NEW_OPEN'
    };

    return AbnOutSource;
});