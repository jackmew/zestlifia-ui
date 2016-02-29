/**
 * Created by jackho on 1/25/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Pagination',
    'uweaver/data/Collection', 'text!../tpl/Finder.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Pagination, Collection, tpl, Logger) {

    var LOGGER =  new Logger("AbnMgnt/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl
        };
        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
            $grid: undefined
        };

        this._title = i18n.translate("管理異常申請");
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
        anchors.$grid = this.$anchor("grid");

        buildGrid.call(this);

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
    function buildGrid() {
        var anchors = this._anchors;

        var abns = new Collection();
        var items = [
            {no: "IT2015120071", type: "驗退", createArea: "台灣地區", abnAttribute: "IQC", createDate: "2015-12-03", currentLevel: "6 品保SQE"},
            {no: "IT2015120073", type: "委外成品", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-04", currentLevel: "5 資材主管"},
            {no: "IT2015120075", type: "成品特性", createArea: "台灣地區", abnAttribute: "PQC", createDate: "2015-12-15", currentLevel: "4 處理單位人員"},
            {no: "IT2015120062", type: "成品外觀", createArea: "台灣地區", abnAttribute: "FQC", createDate: "2015-12-01", currentLevel: ""}
        ];
        abns.add(items);

        this._grid = new Grid({
            el: anchors.$grid,
            data: abns,
            columns: [
                {text: "異常單號", dataIndex: "no"},
                {text: "類別", dataIndex: "type"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "異常工作屬性", dataIndex: "abnAttribute"},
                {text: "建立日期", dataIndex: "createDate"},
                {text: "目前關卡", dataIndex: "currentLevel"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        this._grid.on('select', _.bind(onGridSelect, this));
    }
    function onGridSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('select', event);
    }

    var props = {
        _anchors: undefined,
        _grid: undefined
    };

    var Finder = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Finder.COMMAND = {
        OPEN: "OPEN"
    };

    return Finder;
});