/**
 * Created by jackho on 1/15/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/SignoffRecord.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Logger) {

    var LOGGER = new Logger("AbnEndProductFeature/gadget/widget/SignoffRecord");

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
            $gridLevel: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$gridLevel = this.$anchor('gridLevel');


        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        buildGridLevel.call(this);

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
    function buildGridLevel() {
        var anchors = this._anchors;

        var levels = new Collection();
        var items = [
            {level: "2 品保覆核", date: "20151130", action: "同意", comment: ""},
            {level: "3 會簽1(主簽)", date: "2015122", action: "同意", comment: ""},
            {level: "4 會簽2(通知)", date: "20151205", action: "同意", comment: ""}
        ];
        levels.add(items);

        this._gridLevel = new Grid({
            el: anchors.$gridLevel,
            data: levels,
            columns: [
                {text: "關卡", dataIndex: "level"},
                {text: "簽核日期", dataIndex: "date"},
                {text: "簽核動作", dataIndex: "action"},
                {text: "簽核意見", dataIndex: "comment"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function setTitle(title) {
        this._title = title ;
    }
    function getTitle(title) {
        return this._title;
    }
    var props = {
        _anchors: undefined,
        _gridLevel: undefined
    };

    var SignoffRecord = declare(Base, {
        initialize: initialize,
        render: render,
        setTitle: setTitle,
        getTitle: getTitle
    }, props);

    return SignoffRecord;
});