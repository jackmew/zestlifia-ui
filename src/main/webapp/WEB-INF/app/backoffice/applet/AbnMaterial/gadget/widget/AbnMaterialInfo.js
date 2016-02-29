/**
 * Created by jackho on 1/27/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', '../../../../widget/Modal' , 'view/AssigneeModal',
    'text!../../tpl/widget/AbnMaterialInfo.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Modal, AssigneeModal,
                                 tpl, Logger) {

    var LOGGER = new Logger("AbnMaterial/gadget/widget/AbnMaterialInfo");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $assignee: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$assignee = this.$anchor('assignee');
        anchors.$finder = this.$anchor('finder');

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildSideBtn.call(this);

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
    function buildSideBtn() {
        var anchors = this._anchors;
        anchors.$assignee.find('button').on('click', _.bind(function(evt) {
            if(_.isUndefined(this._modalAssignee)) {
                this._modalAssignee = new AssigneeModal().render();
            }
            this._modalAssignee.show();
        },this));

        anchors.$finder.find('button').on('click', _.bind(function(evt) {
            if(_.isUndefined(this._modalFinder)) {
                this._modalFinder = new AssigneeModal().render();
            }
            this._modalFinder.show();
        },this));
    }
    var props = {
        _anchors: undefined,
        _modalAssignee: undefined,
        _modalFinder: undefined
    };

    var AbnMaterialInfo = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return AbnMaterialInfo;
});