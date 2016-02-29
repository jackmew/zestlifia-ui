/**
 * Created by jackho on 2/1/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    'text!./tpl/GridSystem.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup,
                                tpl, Logger) {

    var LOGGER = new Logger("applet/Test/GridSystem");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {

        };

        this._title = i18n.translate("Grid System");
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

        //buildFinder.call(this);

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

    //function buildFinder() {
    //
    //    this.once('attach', function() {
    //
    //        this._finder = new Finder().render();
    //        this._finder.on('select', _.bind(onGridSelect, this));
    //        this.add(this._finder);
    //
    //        LOGGER.debug("buildFinder done");
    //
    //    }, this);
    //}

    var props = {
        _anchors: undefined,
        _menu: undefined,
        _finder: undefined
    };


    var GridSystem = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    GridSystem.COMMAND = {
    };

    return GridSystem;
});