/**
 * Created by jackho on 2/2/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , '../../../../util/FieldUtil',
    'text!../../tpl/widget/ClientInvest.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup, FieldUtil,
                                 tpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/ClientInvest");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        options || (options = {});
        _.defaults(options, defaults);

        var anchors = this._anchors;

        this.hide();



        if (this.render === render) {
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
    var props = {
        _anchors: undefined
    };

    var ClientInvest = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return ClientInvest;
});