/**
 * Created by jackho on 2/25/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'widget/Gridcrud',
    'uweaver/data/Collection',
    'widget/FormLayout', 'widget/Input', 'widget/InputButton',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Collection,
                                FormLayout, Input, InputButton,
                                Logger) {

    var LOGGER = new Logger("WorkRuleAbnormalApl/gadget/Factory");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {
        };

        this.title(i18n.translate("PQC"));
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

        buildGridcrud.call(this);

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
    function buildGridcrud() {

        var Factorys = declare(Collection, {
            resource: 'workRuleAbnormalApl/factory'
        });
        var factorys = new Factorys();
        factorys.fetch({async: false});

        this._gridcrud = new Gridcrud({
            data: factorys,
            columns: [
                {text: "代碼", dataIndex: "no"},
                {text: "名稱", dataIndex: "name"}
            ],
            pagination: {
                is: true,
                render: true
            },
            buttonbar: {
                btns: [
                    {value: Gridcrud.BUTTON.NEW, noModal: true},
                    {value: Gridcrud.BUTTON.DELETE}
                ]
            },
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this._gridcrud.attach(this.$el);

        //this._gridcrud._grid.on('select', _.bind(onGridDraftSelect, this));
    }


    var props = {
        _anchors: undefined,

        _gridcrud: undefined,
        _fl: undefined,
        _gridNewSearch: undefined
    };


    var Factory = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Factory.COMMAND = {
    };

    return Factory;
});