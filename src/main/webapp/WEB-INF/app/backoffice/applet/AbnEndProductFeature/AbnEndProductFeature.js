/**
 * Created by jackho on 1/6/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Editor', './gadget/Draft',
    'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Editor, Draft, tplMenu, Logger) {

    var LOGGER = new Logger("EndProductAbnormalApply");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = undefined;

        this._title = i18n.translate("成品特性異常申請");
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

        var anchors = this._anchors;

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
    function create() {
        this._editor = new Editor().render();
        this.add(this._editor, {
            closable: true
        });
    }

    function open() {
        this._draft = new Draft().render();
        this._draft.on('selectDraft', _.bind(onGridDraftSelect, this));
        this.add(this._draft, {
            closable: true
        });
    }
    function onGridDraftSelect(event) {
        var model = event.data;
        var no = model.get('no');
        LOGGER.debug("Draft select Model - no: ${0}", no);

        var module = './applet/AbnEndProductFeature/gadget/Editor';

        var context = this;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                title: "草稿-"+no,
                mode: Editor.MODE.DRAFT
            }).render();
            context.add(gadget, {
                closable: true
            });
            gadget.setValues();
        });
    }

    function erase() {

    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case EndProductAbnormalApply.COMMAND.CREATE:
                this.create();
                break;
            case EndProductAbnormalApply.COMMAND.SAVE:
                this.save();
                break;
            case EndProductAbnormalApply.COMMAND.OPEN:
                this.open();
                break;
            case EndProductAbnormalApply.COMMAND.SEND:
                this.send();
                break;
            case EndProductAbnormalApply.COMMAND.ERASE:
                this.delete();
                break;
            case EndProductAbnormalApply.COMMAND.CLOSE:
                this.close();
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


    var EndProductAbnormalApply = declare(Base, {
        initialize: initialize,
        render: render,
        create: create,
        open: open
    }, props);

    // Enumeration of build in commands
    EndProductAbnormalApply.COMMAND = {
        CREATE: 'CREATE',
        SAVE: 'SAVE',
        OPEN: 'OPEN',
        SEND: 'SEND',
        ERASE: 'ERASE',
        CLOSE: 'CLOSE'
    };

    return EndProductAbnormalApply;
});