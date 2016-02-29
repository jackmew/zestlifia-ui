/**
 * Created by jasonlin on 7/6/14.
 */
define(['uweaver/widget/Widget', './Button', 'jquery', 'underscore',
    'text!./tpl/Messagebox.html'], function (Widget, Button, $, _, tpl){

    var Messagebox = Widget.extend({
        tpl: tpl,
        title: undefined,
        message: undefined,
        explanation: undefined,
        labels: {
            ok: "OK",
            cancel: "CANCEL",
            yes: "YES",
            no: "NO"
        },
        buttons: undefined,
        icon: undefined,

        initialize: initialize,
        prepare: prepare,
        destroy: destroy,

        show: open,
        open: open,

        close: close,
        hide: close,

        ok: ok,
        cancel: close,
        yes: yes,
        no: no
    });

    Messagebox.CANCEL = 1;
    Messagebox.OK = 2;
    Messagebox.NO = 4;
    Messagebox.YES = 8;
    Messagebox.OKCANCEL = 3;
    Messagebox.YESNO = 12;
    Messagebox.YESNOCANCEL = 13;

    Messagebox.INFO = 0;
    Messagebox.WARNING = 1;
    Messagebox.ERROR = 2;
    Messagebox.QUESTION = 3;

    var blockMap = ["a", "b", "c", "d"];

    function initialize(options) {
        Widget.prototype.initialize.apply(this, arguments);

        options || (options = {});

        if(options.buttons) this.buttons = options.buttons;
        if(options.title) this.title = options.title;
        if(options.message) this.message = options.message;
        if(options.explanation) this.explanation = options.explanation;
        if(options.icon) this.icon = options.icon;
    }

    function prepare() {
        this.$component = this.$("[data-role=popup]");
        this.$toolbar = this.$anchor("toolbar");

        $("body").append(this.$el);

        var buttons = this.buttons;
        var button;
        var block = -1;
        var fn = _.bind(renderButton, this);
        if(buttons >= Messagebox.YES) {
            block++;
            button = fn("yes", this.labels.yes, block);
            button.block(blockMap[block]);
            buttons = buttons - Messagebox.YES;
        }
        if(buttons >= Messagebox.NO) {
            block++;
            button = fn("no", this.labels.no, block);
            button.block(blockMap[block]);
            buttons = buttons - Messagebox.NO;
        }
        if(buttons >= Messagebox.OK) {
            block++;
            button = fn("ok", this.labels.ok, block);
            button.block(blockMap[block]);
            buttons = buttons - Messagebox.OK;
        }
        if(buttons >= Messagebox.CANCEL) {
            block++;
            button = fn("cancel", this.labels.cancel, block);
            button.block(blockMap[block]);
            buttons = buttons - Messagebox.CANCEL;
        }
        if(block>0) {
            this.$toolbar.addClass("ui-grid-" + blockMap[block-1]);
            this.$('button').css('width', '90%');
        } else {
            this.$toolbar.addClass("ui-grid-solo");
            this.$('button').css('width', '100%');
        }

    }

    function open() {
        this.$component.popup('open');
    }

    function close() {
        this.$component.popup('close');
        this.destroy();
    }

    function destroy() {
        this.$component.popup('destroy');
        Widget.prototype.destroy.apply(this, arguments);
    }

    function ok() {
        this.close();
    }

    function yes() {
        this.close();
    }

    function no() {
        this.close();
    }

    function renderButton(name, text) {
        var button = new Button({
            name: name,
            text: text,
            icon: "check",
            style: "font-size:13px;"
        });


        button.render({enhance: false});
        this.$toolbar.append(button.$el);
        button.on('execute', this[name], this);
        return button;
    }

    return Messagebox;
});