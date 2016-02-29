/**
 * Created by jackho on 1/22/16.
 *
 * A part one of IssueApl tab.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/IssueStatus.html', '../Editor', '../../../../util/FieldUtil',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/IssueStatus");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
        };

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        var anchors = this._anchors;

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

    var IssueStatus = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return IssueStatus;
});
