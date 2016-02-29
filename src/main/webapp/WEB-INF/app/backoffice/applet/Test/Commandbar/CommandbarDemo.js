/**
 * Created by jackho on 2/26/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'widget/Gridcrud',
    'uweaver/data/Collection',
    'widget/FormLayout', 'widget/Button', 'widget/InputButton', 'widget/Commandbar',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Gridcrud, Collection,
                                FormLayout, Button, InputButton, Commandbar,
                                Logger) {

    var LOGGER = new Logger("Test/CommandbarDemo");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {
        };

        this._title = i18n.translate("Commandbar Demo");
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        var anchors = this._anchors;

        buildButton.call(this);
        buildInputButton.call(this);
        buildCommandbar.call(this);

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
    function buildButton() {
        // Button
        var $buttonTitle = $('<h1/>');
        $buttonTitle.text('Button.js');
        this.$el.append($buttonTitle);


        var btnModal = new Button({
            text: "DEFAULT"
        }).render();
        this.$el.append(btnModal.$el);

        var btnOnlyIcon = new Button({
            mode: Button.MODE.CIRCLE
        }).render();
        this.$el.append(btnOnlyIcon.$el);
    }
    function buildInputButton() {

        var $ibTitle = $('<h1/>');
        $ibTitle.text('InputButton.js');
        this.$el.append($ibTitle);

        this._fl = new FormLayout().render();
        this._fl.attach(this.$el);

        var row1 = this._fl.addRow();

        var ibNormal = new InputButton({
            caption: "NORMAL",
            mode: InputButton.MODE.NORMAL
        }).render();
        row1.addField(ibNormal, 'ibNormal');

        var ibSide = new InputButton({
            caption: 'SIDE',
            mode: InputButton.MODE.SIDE
        }).render();
        row1.addField(ibSide, 'ibSide');

        var ibSearch = new InputButton({
            caption: 'SEARCH',
            mode: InputButton.MODE.SEARCH
        }).render();
        row1.addField(ibSearch, 'ibSearch');
    }
    function buildCommandbar() {
        var $commandbarTitle = $('<h1/>');
        $commandbarTitle.text('Commandbar.js');
        this.$el.append($commandbarTitle);
        // float
        var $floatTitle = $('<h3/>');
        $floatTitle.text('Float(最左最右的margin是button自己產生的)');
        this.$el.append($floatTitle);

        this.$el.append($('<hr/>'));
        var $floatDiv = $('<div/>');
        $floatDiv.addClass('clearfix');
        this.$el.append($floatDiv);

        var btnLeft = new Button({
            text: 'LEFT'
        }).render();
        btnLeft.addClass('pull-left');

        $floatDiv.append(btnLeft.$el);

        var btnRight = new Button({
            text: 'RIGHT',
            mode: Button.MODE.CIRCLE
        }).render();
        btnRight.addClass('pull-right');

        $floatDiv.append(btnRight.$el);

        // Commandbar
        // LEFT
        var $cmdLTitle = $('<h3/>');
        $cmdLTitle.text('Cmd align left(若是用Commandbar 則會因為class commandar 讓左右margin消失)');
        this.$el.append($cmdLTitle);
        this.$el.append($('<hr/>'));

        var commandbarL = new Commandbar();
        commandbarL.create(Button.VALUE.CONFIRM);
        commandbarL.create(Button.VALUE.CLOSE);
        commandbarL.render();
        commandbarL.align(Commandbar.ALIGN.LEFT);
        this.$el.append(commandbarL.$el);

        // CENTER
        var $cmdCTitle = $('<h3/>');
        $cmdCTitle.text('Cmd align center');
        this.$el.append($cmdCTitle);
        this.$el.append($('<hr/>'));

        var commandbarC = new Commandbar();
        commandbarC.create(Button.VALUE.DELETE);
        commandbarC.create(Button.VALUE.SEARCH);
        commandbarC.render();
        commandbarC.align(Commandbar.ALIGN.CENTER);
        this.$el.append(commandbarC.$el);

        // RIGHT
        var $cmdRTitle = $('<h3/>');
        $cmdRTitle.text('Cmd align right');
        this.$el.append($cmdRTitle);
        this.$el.append($('<hr/>'));

        var commandbarR = new Commandbar();
        commandbarR.create(Button.VALUE.NEW);
        commandbarR.create(Button.VALUE.MODIFY);
        commandbarR.render();
        commandbarR.align(Commandbar.ALIGN.RIGHT);
        this.$el.append(commandbarR.$el);

    }


    var props = {
        _anchors: undefined,
        _fl: undefined
    };


    var CommandbarDemo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    CommandbarDemo.COMMAND = {
    };

    return CommandbarDemo;
});