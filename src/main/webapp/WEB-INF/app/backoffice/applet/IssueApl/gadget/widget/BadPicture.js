/**
 * Created by jackho on 1/22/16.
 *
 * A part one of IssueApl tab.
 *
 * Self is form-group/Row
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!../../tpl/widget/BadPicture.html', '../Editor', '../../../../util/FieldUtil', 'widget/Carousel', '../../../../widget/Gridcrud',
    'text!widget/tpl/modal/upload/TypeFile.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Editor, FieldUtil, Carousel, Gridcrud, TypeFileTpl, Logger) {

    var LOGGER = new Logger("IssueApl/gadget/widget/BadPicture");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._anchors = {
            $carouselCol: undefined,
            $grid: undefined
        };

        var defaults = {
            //tpl: tpl
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

        var anchors = this._anchors;
        // carousel
        anchors.$carouselCol = FieldUtil.col.call(this, 8);
        this._carousel = new Carousel({
            imgArr: [
                {src: "./img/issue1.jpg", caption: "issue1"},
                {src: "./img/issue2.jpg", caption: "issue2"}
            ]
        }).render();
        anchors.$carouselCol.append(this._carousel.$el);

        // carousel about file details grid
        anchors.$gridCol = FieldUtil.col.call(this, 4);

        var renderer = function(item) {
            var isDownload = item.get('download');
            if(isDownload === 'Y') {
                return '<i value="DOWNLOAD" data-uw-params="' + item.id + '" class="fa fa-download uw-text-xl uw-hover uw-clickable" style="color: steelblue;"></i>';
            }
        };

        var imgs = new Collection();
        var items = [
            {type: "異常描述", fileName: "badpic.png", size: "9,872K", download: "Y"},
            {type: "臨時措施", fileName: "badpic2.png", size: "4,132K", download: "Y"},
            {type: "對策分析", fileName: "badpic3.png", size: "4,132K", download: "Y"}
        ];
        imgs.add(items);

        this._grid = new Gridcrud({
            data: imgs,
            columns: [
                {text: "類別", dataIndex: "type"},
                {text: "檔名", dataIndex: "fileName"},
                {text: "大小", dataIndex: "size"},
                {text: "下載", dataIndex: "download", renderer: renderer, style: {"text-align": "center"} }
            ],
            toolbar: {
                tools: [
                    {name: Gridcrud.TOOL.UPLOAD,tip:{title: "上傳"}},
                    {name: Gridcrud.TOOL.MINUS, noModal: true}
                ]
            },
            mode: Grid.MODE.SINGLE
        }).render();
        this._grid.attach(anchors.$gridCol);

        this._grid._modalUpload.title('上傳附件');
        this._grid._modalUpload.setContent($(TypeFileTpl));



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
    var props = {
        _anchors: undefined,
        _carousel: undefined,
        _grid: undefined,

        tagName: "div",
        className: 'form-group'
    };

    var BadPicture = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return BadPicture;
});
