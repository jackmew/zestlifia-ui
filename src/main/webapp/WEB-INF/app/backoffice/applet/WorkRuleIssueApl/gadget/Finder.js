/**
 * Created by jackho on 1/5/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid',
    'uweaver/data/Collection',
    'text!../tpl/Finder.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Collection, tpl, Logger) {

    var LOGGER = new Logger("WorkRuleIssueApl/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {
            $gridDefectType: undefined,
            $gridDefectItem: undefined
        };

        this._title = i18n.translate("客訴不良項目");
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

        buildGridDefectType.call(this);
        buildGridDefectItem.call(this);

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
    function buildGridDefectType() {
        var anchors = this._anchors;
        anchors.$gridDefectType = this.$anchor('gridDefectType');

        var defectTypes = new Collection();
        var defectTypeModels = [
            {type: "exterior", locale: "繁體中文", name: "名稱"},
            {type: "physical", locale: "繁體中文", name: "物性"},
            {type: "management", locale: "繁體中文", name: "管理性"},
            {type: "rohs", locale: "繁體中文", name: "ROHS"}
        ];

        defectTypes.add(defectTypeModels);

        this._gridDefectType = new Grid({
            el: anchors.$gridDefectType,
            data: defectTypes,
            columns: [
                {text: "不良分類", dataIndex: "type"},
                {text: "單號", dataIndex: "locale"},
                {text: "名稱", dataIndex: "name"}
            ],
            mode: Grid.MODE.SINGLE
        });

        var gridDefectType = this._gridDefectType;
        gridDefectType.render();

        gridDefectType.on('select', _.bind(onDefectTypesGridSelect, this));
    }
    function buildGridDefectItem() {
        var anchors = this._anchors;
        anchors.$gridDefectItem = this.$anchor('gridDefectItem');

        var defectItems = new Collection();
        var defectItemsModels = [
            {item: "01", name: "異物"},
            {item: "01A", name: "晶點(原材)"},
            {item: "01B", name: "亮點"},
            {item: "01C", name: "氣泡"},
            {item: "01D", name: "霧物"},
            {item: "02", name: "週期打痕"},
            {item: "03", name: "隨機打痕(其他型)"},
            {item: "03A", name: "隨機打痕(異物針點)"},
            {item: "03B", name: "隨機打痕(橫百萬打痕)"},
            {item: "03C", name: "隨機打痕(直百萬打痕)"},
            {item: "05", name: "異線"},
            {item: "05A", name: "異線(原料)"},
            {item: "06", name: "刮傷(其他型)"},
            {item: "06A", name: "刮傷(連續型)"},
            {item: "06B", name: "刮傷(瀑布型)"},
            {item: "06C", name: "刮傷(雨滴型)"},
            {item: "06F", name: "刮傷(流星型)"}
        ];
        defectItems.add(defectItemsModels);

        this._gridDefectItem = new Grid({
            el: anchors.$gridDefectItem,
            data: defectItems,
            columns: [
                {text: "不良項目", dataIndex: "item"},
                {text: "名稱", dataIndex: "name"}
            ],
            mode: Grid.MODE.SINGLE
        });
        this._gridDefectItem.render();
    }
    function onDefectTypesGridSelect(evt) {
        var model = evt.data;
        LOGGER.debug("不良分類 - gridDefectType select: ${0}", model.get('type'));

        this._gridDefectType.selection();
    }

    var props = {
        _anchors: undefined,
        _gridDefectType: undefined,
        _gridDefectItem: undefined
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