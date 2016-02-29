/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/iqc', './gadget/fqc','./gadget/pqc',
     'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Iqc, Fqc, Pqc, tplMenu, Logger) {

    var LOGGER = new Logger("applet/WorkRuleAbnormalApl");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this.title(i18n.translate("異常作業規則"));

        this._anchors = {
        };

        this._gadgets = [];
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


        var menu = new Triggers({
            tpl: tplMenu
        }).render();

        menu.on("trigger", _.bind(onCommandTrigger, this));

        this.menu(menu);

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

    function abn() {
        clear.call(this);
        this.title(i18n.translate("異常不良項目"));
        var gadgets = this._gadgets;

        this._iqc = new Iqc().render();
        this.add(this._iqc);
        gadgets.push(this._iqc);

        this._fqc = new Fqc().render();
        this.add(this._fqc);
        gadgets.push(this._fqc);

        this._pqc = new Pqc().render();
        this.add(this._pqc);
        gadgets.push(this._pqc);

        this.select(0);
    }
    function factory() {
        clear.call(this);
        this.title(i18n.translate("異常不良項目"));
        var gadgets = this._gadgets;


    }
    function pattern() {


    }
    function clear() {
        var tabPanel = this._tabPanel;
        var gadgets = this._gadgets;
        if(gadgets.length !== 0) {
            _.each(gadgets, function(gadget) {
                tabPanel.remove(gadget);
            });
            gadgets.length = 0;
        }
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case WorkRuleAbnormalApl.COMMAND.ABN:
                abn.call(this);
                break;
            case WorkRuleAbnormalApl.COMMAND.FACTORY:
                factory.call(this);
                break;
            case WorkRuleAbnormalApl.COMMAND.PATTERN:
                pattern.call(this);
                break;
            default:
                break;
        }
    }


    var props = {
        _gadgets: undefined,
        // abn
        _iqc: undefined,
        _fqc: undefined,
        _pqc: undefined
    };


    var WorkRuleAbnormalApl = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    WorkRuleAbnormalApl.COMMAND = {
        ABN: "ABN",
        FACTORY: "FACTORY",
        PATTERN: "PATTERN"
    };

    return WorkRuleAbnormalApl;
});