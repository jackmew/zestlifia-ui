define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Widget', 'uweaver/widget/Triggers',
    ], function(_, $, lang, Widget, Triggers, tpl) {

    var declare = lang.declare;
    var Base = Widget;

    /**
     * A gadget is the component of the applet.
     *
     * ##### Usage
     *     var applet = new TDIApplet({
     *         el: $('#applet')
     *     });
     *     applet.render();
     *
     *     var gadget = new Gadget({
     *         tpl: "<h3>Preferences</h3><p>Here are your personal preferences ...</p>"
     *         title: "Preferences"
     *     }).render();
     *
     *     applet.add(gadget);
     *
     * ##### Events:
     * + 'transition:menu' - [menu()]{@link Gadget#menu}
     * + 'transition:title' - [menu()]{@link Gadget#title}
     * + 'transition:badge' - [menu()]{@link Gadget#badge}
     *
     * @constructor Gadget
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the gadget.
     * ##### Options
     * - tpl(String): A html string to layout & construct the DOM. Optional.
     * - title(String): The title of the gadget.
     * - badge(String): The badge of the gadget. Optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
        this._anchors = {};

        this.title(cfg.title);
        this.badge(cfg.badge);
    }

    /**
     * @override
     */
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

        this.$el.on('click', _.bind(onFocus, this));

        var titlebar = new Triggers({
            el: this._anchors.$header
        });

        titlebar.render();

        this.listenTo(titlebar, 'trigger', _.bind(onCommandTrigger, this));


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

    /**
     * Get or set the title of the gadget.
     *
     * ##### Events:
     * - 'transition:title' => triggered after title changed. event.data => the title.
     *
     * @memberof Gadget#
     * @param {String} [text] - the title.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {String}
     */
    function title(text, options) {
        if(!text) return this._title;

        options || (options = {});

        this._title = text;
        options.silent || this.trigger('transition:title', {
            context: this,
            source: this,
            data: this._title
        });
    }

    /**
     * Get or set the badge of the gadget.
     *
     * ##### Events:
     * - 'transition:badge' => triggered after badge changed. event.data => the badge.
     *
     * @memberof Gadget#
     * @param {String} [text] - the badge.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {String}
     */
    function badge(text, options) {
        if(!text) return this._badge;

        options || (options = {});

        this._badge = text;
        options.silent || this.trigger('transition:badge', {
            context: this,
            source: this,
            data: this._badge
        });
    }

    /**
     *
     * Get or set the menu.
     *
     * ##### Events:
     * - 'transition:menu' => triggered after menu changed. event.data => the menu.
     *
     * @memberof Gadget#
     * @param {Triggers} triggers - the menu.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default: false.
     * @returns {Triggers}
     *
     */
    function menu(triggers, options) {
        if(!triggers) return this._menu;

        options || (options = {});

        this._menu = triggers;
        options.silent || this.trigger('transition:menu', {
            context: this,
            source: this,
            data: this._menu
        });
    }

    function onFocus(event) {
        this.focus();
    }

    function focus() {
        var event = {
            context: this,
            source: this,
            data: {}
        };
        this.trigger('focus', event);
    }

    function show() {
        Base.prototype.show.apply(this, arguments);
        this.focus();
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var source = event.source;

        switch (value.toUpperCase()) {
            case Gadget.COMMAND.CLOSE:
                this.destroy();
                break;
            case Gadget.COMMAND.HIDE:
                this.hide();
                break;
            default:
                break;
        }
    }

    var props = {
        _oid: undefined,
        _title: undefined,
        _badge: undefined,
        _menu: undefined
    };

    var Gadget = declare(Base, {
        initialize: initialize,
        render: render,
        title: title,
        badge: badge,
        show: show,
        menu: menu,
        focus: focus
    }, props);

    Gadget.COMMAND = {
        CLOSE: "CLOSE",
        HIDE: "HIDE"
    };

    return Gadget;
});