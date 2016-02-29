/**
 * Created by jackho on 1/27/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/AppearanceStatus.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Logger) {

    var LOGGER = new Logger("AbnEndProductAppearance/gadget/widget/AppearanceStatus");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();


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
    var props = {
        _anchors: undefined
    };

    var AppearanceStatus = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return AppearanceStatus;
});