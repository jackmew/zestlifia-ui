/**
 * Created by jackho on 2/4/16.
 *
 * Carousel
 *
 * anchors.$carousel = FieldUtil.col.call(this, 8);
 *
 * 1.
 * this._carousel = new Carousel({
 *    imgArr: [
 *       {src: "./img/issue1.png",caption: "issue1"},
 *       {src: "./img/issue2.png",caption: "issue2"}
 *    ]
 * }).render();
 *
 *
 * 2.
 * this._carousel = new Carousel().render();
 * this._carousel.setContent([
 *  {src: "./img/issue1.png", caption: "issue1"},
 *  {src: "./img/issue2.png", caption: "issue2"}
 * ]);
 *
 * anchors.$carousel.append(this._carousel.$el);
 *
 * 2.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' ,
    'text!./tpl/Carousel.html',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Popup,
                                 tpl, Logger) {

    var LOGGER = new Logger("widget/Carousel");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            tpl: tpl,
            imgArr: [
                //{src: "./img/issue1.png", caption: "issue1"}
            ]
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $indicators: undefined,
            $content: undefined,
            $prev: undefined,
            $next: undefined
        };
        this._imgStore = [] ;
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        anchors.$prev = this.$('a.left');
        anchors.$next = this.$('a.right');
        anchors.$indicators = this.$('.carousel-indicators');
        anchors.$content = this.$('.carousel-inner');

        options || (options = {});
        _.defaults(options, defaults);

        setId.call(this);
        if(this._cfg.imgArr.length !== 0) {
            setContent.call(this, this._cfg.imgArr);
        }

        this.$el.carousel('pause');

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
    /**
     * <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
     *
     * <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
     *   <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
     *   <span class="sr-only">Previous</span>
     * </a>
     * <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
     *   <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
     *   <span class="sr-only">Next</span>
     * </a>
     *     */
    function setId() {
        var anchors = this._anchors;
        var id = this.prop('id');

        this.$el.addClass('carousel slide');
        this.$el.attr("data-ride", "carousel");


        anchors.$prev.attr("href","#"+id);
        anchors.$next.attr("href","#"+id);
    }
    /*
    *  <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
    *
    *  <div class="item">
    *    <img src="./img/issue2.png">
    *    <div class="carousel-caption">
    *        Issue2
    *    </div>
    *  </div>
    * */
    function setContent(imgs) {
        var anchors = this._anchors;
        var id = this.prop('id');
        var imgStore = this._imgStore ;

        _.each(imgs, function(img) {
            // indicator
            var index = imgStore.length;

            var $li = $('<li/>');
            $li.attr({
                "data-target": "#"+id,
                "data-slide-to": index
            });
            anchors.$indicators.append($li);

            // img
            var $item = $('<div/>');
            $item.addClass('item');

            var $img = $('<img/>');
            $img.attr("src", img.src);
            $item.append($img);

            if(!_.isUndefined(img.caption)) {
                var $caption = $('<div/>');
                $caption.addClass('carousel-caption');
                $caption.text(img.caption);
                $item.append($caption);
            }
            anchors.$content.append($item);

            if(index === 0) {
                $li.addClass('active');
                $item.addClass('active');
            }

            imgStore.push(img);
        });


    }
    var props = {
        _anchors: undefined,
        _class: 'Carousel',
        _imgStore: undefined
    };

    var Carousel = declare(Base, {
        initialize: initialize,
        render: render,

        setContent: setContent
    }, props);

    return Carousel;
});