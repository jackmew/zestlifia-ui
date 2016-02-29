/**
 * Created by jackho on 1/26/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'widget/Gridcrud', 'uweaver/widget/Pagination',
    'uweaver/data/Collection', '../../../util/FieldUtil',
    'widget/FormLayout', 'widget/Input', 'widget/Select', 'widget/InputButton',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Gridcrud, Pagination, Collection, FieldUtil,
                                FormLayout, Input, Select, InputButton,
                                Logger) {

    var LOGGER =  new Logger("SprocMgnt/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
        };
        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
            $selectType: undefined,
            $selectSprocType: undefined,
            $grid: undefined
        };

        this._title = i18n.translate("管理特採申請");
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

        buildEditor.call(this);
        buildGrid.call(this);

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
    function buildEditor() {
        this._flEditor = new FormLayout().render();
        this._flEditor.attach(this.$el);

        var row1 = this._flEditor.addRow();

        var selectType = new Select({
            caption: '類別',
            options: [
                {text: '', value: ''},
                {text: '原料特採', value: 'material'},
                {text: '成品特採', value: 'product'}
            ]
        }).render();
        row1.addField(selectType, 'type');

        var selectSprocType = new Select({
            caption: '特採類別',
            options: [
                {text: '', value: ''}
            ]
        }).render();
        row1.addField(selectSprocType, 'sprocType');

        var ibSearch = new InputButton({
            mode: InputButton.MODE.SEARCH
        }).render();
        row1.addField(ibSearch, 'ibSearch');

        var row2 = this._flEditor.addRow();
        var selectArea = new Select({
            caption: '開立地區',
            options: [
                {text: '', value: ''},
                {text: '台灣地區', value: ''},
                {text: '昆山地區', value: ''},
                {text: '深圳地區', value: ''}
            ]
        }).render();
        row2.addField(selectArea, 'area');

        var dateStart = new Input({
            caption: '建立日期(起)',
            mode: Input.TYPE.DATE,
            isRequired: true
        }).render();
        row2.addField(dateStart, 'start');

        var dateEnd = new Input({
            caption: '建立日期(迄)',
            mode: Input.TYPE.DATE,
            isRequired: true
        }).render();
        row2.addField(dateEnd, 'end');


        selectType.on('valueChange', function(evt) {
            var value = evt.data.value;
            var ops ;
            if (value === 'product') {
                ops = [
                    { value: '', text: ''},
                    { value: '', text: 'NG品(物性/外觀)'},
                    { value: '', text: '不符合客規出貨'},
                    { value: '', text: '保質期不足(含展延)-庫存調度'},
                    { value: '', text: '保質期不足(含展延)-客戶退貨'},
                    { value: '', text: '保質期不足(含展延)-取消訂單'},
                    { value: '', text: '保質期不足(含展延)-投產品質異常(外觀)'},
                    { value: '', text: '保質期不足(含展延)-投產品質異常(物性)'},
                    { value: '', text: '未檢驗出貨-業務急拉單'},
                    { value: '', text: '未檢驗出貨-生產延遲'},
                    { value: '', text: '未檢驗出貨-排程延遲'},
                    { value: '', text: '新產品-9料研發品'},
                    { value: '', text: '新產品-研發品品質異常'}
                ];
            } else if (value === 'material'){
                ops = [
                    { value: '', text: ''},
                    { value: '', text: '外觀不良'},
                    { value: '', text: '急料未檢'},
                    { value: '', text: '特性不良'},
                    { value: '', text: '新資材無檢視'},
                    { value: '', text: '過期展延'},
                    { value: '', text: '其他'}
                ];
            } else {
                ops = [] ;
            }
            selectSprocType.setOptions(ops);
        })

    }
    function buildGrid() {
        var sprocs = new Collection();
        var items = [
            {no: "IT2015120035", type: "成品特採", sprocType: "不符合客規出貨",createArea: "台灣地區", createDate: "2016-01-30", currentLevel: "2 品保覆核"},
            {no: "IT2015120031", type: "成品特採", sprocType: "保質期不足-投產品質異常",   createArea: "台灣地區", createDate: "2016-01-27", currentLevel: "3 會簽"},
            {no: "IT2015120030", type: "原料特採", sprocType: "急料未檢",     createArea: "台灣地區", createDate: "2016-01-24", currentLevel: "管理代表確認"}
        ];
        sprocs.add(items);

        this._gridcrud = new Gridcrud({
            data: sprocs,
            columns: [
                {text: "特採單號", dataIndex: "no"},
                {text: "類別", dataIndex: "type"},
                {text: "特採類別", dataIndex: "sprocType"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "建立日期", dataIndex: "createDate"},
                {text: "目前關卡", dataIndex: "currentLevel"}
            ],
            mode: Gridcrud.MODE.SINGLE
        }).render();
        this._gridcrud.attach(this.$el);

        this._gridcrud._grid.on('select', _.bind(onGridSelect, this));
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
        _flEditor: undefined,
        _gridcrud: undefined
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