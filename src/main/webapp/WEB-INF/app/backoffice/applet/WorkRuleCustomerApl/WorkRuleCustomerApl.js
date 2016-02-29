/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/electronic', './gadget/energy',
    'text!./tpl/WorkRuleCustomerApl.html', 'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Electronic, Energy, tpl, tplMenu, Logger) {

    var LOGGER = new Logger("applet/WorkRuleCustomerApl");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._title = i18n.translate("客戶不良工站");
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

        //var menu = new Triggers({
        //    tpl: tplMenu
        //}).render();
        //
        //menu.on("trigger", _.bind(onCommandTrigger, this));
        //
        //this.menu(menu);

        this.once('attach', function() {
            var electronic = new Electronic().render();
            this.add(electronic);

            var energy = new Energy().render();
            this.add(energy);

        }, this);

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

    function open() {
    }

    //function onCommandTrigger(event) {
    //    var value = event.data.value;
    //    var anchors = this._anchors;
    //
    //    switch (value.toUpperCase()) {
    //        case WorkRuleCustomerApl.COMMAND.SAVE:
    //            this.save();
    //            break;
    //        case WorkRuleCustomerApl.COMMAND.OPEN:
    //            this.open();
    //            break;
    //        case WorkRuleCustomerApl.COMMAND.CLOSE:
    //            this.close();
    //            break;
    //        default:
    //            break;
    //    }
    //}


    var props = {

    };


    var WorkRuleCustomerApl = declare(Base, {
        initialize: initialize,
        render: render,
        open: open
    }, props);

    // Enumeration of build in commands
    WorkRuleCustomerApl.COMMAND = {

    };

    return WorkRuleCustomerApl;
});