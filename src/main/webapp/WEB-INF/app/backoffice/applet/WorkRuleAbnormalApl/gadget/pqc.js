/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'widget/Gridcrud',
    'uweaver/data/Collection',
    'widget/FormLayout', 'widget/Input', 'widget/InputButton',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Collection,
                                FormLayout, Input, InputButton,
                                Logger) {

    var LOGGER = new Logger("WorkRuleAbnormalApl/gadget/Pqc");

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

        var Iqcs = declare(Collection, {
            resource: 'workRuleAbnormalApl/pqcs'
        });
        var iqcs = new Iqcs();
        iqcs.fetch({async: false});

        this._gridcrud = new Gridcrud({
            data: iqcs,
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
                    {value: Gridcrud.BUTTON.NEW},
                    {value: Gridcrud.BUTTON.DELETE}
                ]
            },
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this._gridcrud.attach(this.$el);

        //this._gridcrud._grid.on('select', _.bind(onGridDraftSelect, this));

        buildModalNew.call(this);
    }
    function buildModalNew() {
        var modal = this._gridcrud._modalEdit;

        this._fl = new FormLayout().render();
        modal.setContent(this._fl);

        var textCode = new Input({
            caption: '代碼'
        }).render();
        this._fl.addRow().addField(textCode, 'code', 2, 8);

        var textName = new Input({
            caption: '名稱'
        }).render();
        var row2 = this._fl.addRow();
        row2.addField(textName, 'name', 2, 8);

        var ibSearch = new InputButton().render();
        row2.addField(ibSearch, 'newSearch', 0, 2);

        var row3 = this._fl.addRow();

        var codes = new Collection();
        var items = [
            {code: "1A14", name: "PEEL-90度平均值"},
            {code: "1A15", name: "PEEL-180度(1)"},
            {code: "1A16", name: "PEEL-180度(2)"}
        ];
        codes.add(items);

        this._gridNewSearch = new Gridcrud({
            data: codes,
            columns: [
                {text: "代碼", dataIndex: "code"},
                {text: "名稱", dataIndex: "name"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();
        row3.addGrid(this._gridNewSearch);
    }

    var props = {
        _anchors: undefined,

        _gridcrud: undefined,
        _fl: undefined,
        _gridNewSearch: undefined
    };


    var Pqc = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Pqc.COMMAND = {
    };

    return Pqc;
});