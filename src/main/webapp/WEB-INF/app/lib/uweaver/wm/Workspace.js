/**
 * Created by jasonlin on 9/23/14.
 */

define(['underscore', 'jquery',
    'uweaver/lang', 'uweaver/string', 'uweaver/identifier', 'uweaver/Deferred',
    'uweaver/widget/Widget',
    'text!./tpl/Desktop.html',
    'uweaver/Logger'], function (_, $, lang, string, identifier, Deferred, Widget, tpl, Logger) {
    var declare = lang.declare;

    var Desktop = declare(Widget, {
        /**
         * public interface
         */
        layout: layout,
        put: put,
        remove: remove,
        maximize: maximize,
        restore: restore,
        focus: focus,

        /**
         * constructor
         */
        initialize: initialize,

        /**
         * protected member
         */
        prepare: prepare,
        logger: new Logger("Desktop"),

        /**
         * private member
         */
        _marker: {
            $content: undefined
        },
        _layout: undefined,
        _focusApplet: undefined

        /**
         * event handler
         */
    });

    function layout() {
        return this._layout;
    }

    function put(applet, x, y) {
        var $content = this._marker.$content;

        $content.append(applet);

    }

    function remove(applet) {

    }

    function maximize(applet) {

    }

    function restore(applet) {

    }

    function focus(applet) {

    }

    function initialize(config) {
        Widget.prototype.initialize.apply(this, arguments);

        config || (config = {});

        var defaults = {
            layout: Desktop.LAYOUT.SDI
        };

        _.defaults(config, defaults);

        this.tpl = tpl;
    }

    function prepare() {
        var marker = this._marker;

        Widget.prototype.prepare.apply(this, arguments);

        marker.$content = this.$gear('content');
    }

    function nextBlock() {

    }

    Desktop.LAYOUT = {
        MDI: 0,
        SDI: 1
    };

    return Desktop;
});
