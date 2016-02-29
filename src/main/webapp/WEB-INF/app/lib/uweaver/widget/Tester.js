/**
 * Created by jasonlin on 8/8/14.
 */
define(['uweaver/widget/Widget', 'underscore', 'jquery', 'text!./tpl/Tester.html',
    'uweaver/Logger'], function (Widget, _, $, tpl, Logger) {
    var Tester = Widget.extend({
        logger: new Logger("Tester"),

        applet: undefined,

        initialize: initialize,
        prepare: prepare,
        ready: ready,

        showApplet: showApplet
    });

    function initialize(options) {
        var _options = options || {};

        this.applet = _options.applet;
        this.tpl = tpl;
    }

    function prepare() {
        this.$component = this.$("[data-role=page]");
        this.$desktop = this.$gear("desktop");
    }

    function ready() {
        this.showApplet(this.applet);
    }

    function showApplet(id) {
        if(!id) return;

        var appletPath = 'applet/' + id;
        var context = this;

        this.logger.debug(Logger.PROBE, 'showApplet', appletPath);

        require([appletPath], function(Applet) {
            context.activeApplet = new Applet({
                el: context.$desktop
            });
            context.activeApplet.render();
        });
    }

    return Tester;

});