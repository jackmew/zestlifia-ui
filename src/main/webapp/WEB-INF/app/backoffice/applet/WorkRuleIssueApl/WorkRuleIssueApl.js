/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Finder',
    'text!./tpl/WorkRuleIssueApl.html', 'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Finder, tpl, tplMenu, Logger) {

    var LOGGER = new Logger("WorkRuleIssueApl");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._title = i18n.translate("客訴不良項目");
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
            var finder = new Finder().render();
            this.add(finder);
        });

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

    //function create() {
    //    var editor = new Editor().render();
    //
    //    this.add(editor);
    //}
    //
    //
    //function erase() {
    //
    //}
    //
    //function onCommandTrigger(event) {
    //    var value = event.data.value;
    //    var anchors = this._anchors;
    //
    //    switch (value.toUpperCase()) {
    //        case WorkRuleIssueApl.COMMAND.CREATE:
    //            this.create();
    //            break;
    //        case WorkRuleIssueApl.COMMAND.SAVE:
    //            this.save();
    //            break;
    //        case WorkRuleIssueApl.COMMAND.OPEN:
    //            this.open();
    //            break;
    //        case WorkRuleIssueApl.COMMAND.SEND:
    //            this.send();
    //            break;
    //        case WorkRuleIssueApl.COMMAND.ERASE:
    //            this.delete();
    //            break;
    //        case WorkRuleIssueApl.COMMAND.CLOSE:
    //            this.close();
    //            break;
    //        default:
    //            break;
    //    }
    //}


    var props = {

    };


    var WorkRuleIssueApl = declare(Base, {
        initialize: initialize,
        render: render
        //create: create
    }, props);

    // Enumeration of build in commands
    WorkRuleIssueApl.COMMAND = {
        CREATE: 'CREATE',
        SAVE: 'SAVE',
        OPEN: 'OPEN',
        CHECK: 'CHECK',
        SEND: 'SEND',
        ERASE: 'ERASE',
        CLOSE: 'CLOSE'
    };

    return WorkRuleIssueApl;
});