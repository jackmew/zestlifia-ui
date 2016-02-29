/**
 * Created by jackho on 1/18/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Finder', '../AbnEndProductFeature/gadget/Editor', '../AbnEndProductAppearance/gadget/Editor', '../../util/FieldUtil',
    '../AbnEndProductFeature/gadget/widget/CauseAnalysis', '../AbnEndProductFeature/gadget/widget/StrategyAnalysis',
    '../AbnEndProductFeature/gadget/widget/Signoff', 'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Finder, EditorFeature, EditorAppearance, FieldUtil,
                                CauseAnalysis, StrategyAnalysis, Signoff, tplMenu, Logger) {

    var LOGGER = new Logger("AbnEndProductEffect");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._title = i18n.translate("成品異常效果確認");
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
    function buildFinder() {
        this._finder = new Finder({
            closable: true
        }).render();
        this.listenTo(this._finder, 'select', _.bind(onFinderTrigger, this));
        this.add(this._finder);
    }
    function onFinderTrigger(evt) {
        var model = evt.data;
        var no = model.get('no');
        var type = model.get('type');
        LOGGER.debug("GridEffect select Model - no: ${0} , type: ${1}", no,type);

        buildEditor.call(this, no, type);
    }
    function buildEditor(no, type) {
        if(type === '成品特性') {
            this._editor = new EditorFeature({
                title: no,
                mode: "ABNENDPRODUCT_EFFECT"
            }).render();
            this._tabPanelEditor = this._editor.getTabPanelEditor();
        // 成品外觀
        } else {
            this._editor = new EditorAppearance({
                title: no,
                mode: "ABNENDPRODUCT_EFFECT"
            }).render();
            this._tabPanelEditor = this._editor.getTabPanelEditor();
        }


        var strategyAnalysisTitle = "對策分析";
        this._tabPanelEditor.add(new StrategyAnalysis({
            title: strategyAnalysisTitle
        }).render(), {
            title: strategyAnalysisTitle,
            index: 0
        });

        var causeAnalysisTitle = "原因分析";
        this._tabPanelEditor.add(new CauseAnalysis({
            title: causeAnalysisTitle
        }).render(), {
            title: causeAnalysisTitle,
            index: 0
        });

        this.listenTo(this._tabPanelEditor, 'select', _.bind(onTabPanelSelect, this));

        var editorTabPanelTitle = "效果確認";
        var signoff = new Signoff({
            title: editorTabPanelTitle,
            mode: Signoff.MODE.EFFECTCONFIRM
        }).render();
        this._tabPanelEditor.add(signoff, {
            title: editorTabPanelTitle,
            index: 0
        });
        this.add(this._editor, {
            closable: true
        });

        var $actions = this._tabPanelEditor.$anchor('actions');
        $actions.show();
        var $ddAction = this._tabPanelEditor.$anchor('ddAction');
        $ddAction.hide();

        FieldUtil.setIsEditable(this._editor.$el, false);
        FieldUtil.setIsEditable(signoff.$anchor('effectConfirmContainer'), true);
    }
    function onTabPanelSelect(evt) {

        var $btnActionSave = this._tabPanelEditor.$anchor('btnActionSave');

        if(!_.isUndefined(evt.data._cfg.title)) {
            var title = evt.data._cfg.title;
            LOGGER.debug("onTabPanelSelect: ${0}", title);

            if(title === "效果確認") {
                $btnActionSave.show();
            } else {
                $btnActionSave.hide();
            }
        } else {
            $btnActionSave.hide();
        }
    }
    function create() {

    }
    function erase() {

    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case AbnEndProductEffect.COMMAND.CREATE:
                this.create();
                break;
            case AbnEndProductEffect.COMMAND.SAVE:
                this.save();
                break;
            case AbnEndProductEffect.COMMAND.OPEN:
                this.open();
                break;
            case AbnEndProductEffect.COMMAND.SEND:
                this.send();
                break;
            case AbnEndProductEffect.COMMAND.ERASE:
                this.delete();
                break;
            case AbnEndProductEffect.COMMAND.CLOSE:
                this.close();
                break;
            default:
                break;
        }
    }


    var props = {
        _finder: undefined,
        _editor: undefined,
        _tabPanelEditor: undefined
    };


    var AbnEndProductEffect = declare(Base, {
        initialize: initialize,
        render: render,
        create: create,
        open: open
    }, props);

    // Enumeration of build in commands
    AbnEndProductEffect.COMMAND = {
        CREATE: 'CREATE',
        SAVE: 'SAVE',
        OPEN: 'OPEN',
        CHECK: 'CHECK',
        SEND: 'SEND',
        ERASE: 'ERASE',
        CLOSE: 'CLOSE'
    };

    return AbnEndProductEffect;
});