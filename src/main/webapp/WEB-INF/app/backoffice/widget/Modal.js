/**
 * Created by jackho on 1/2916.
 *
 *
 * 非Bootstrap Modal
 * 繼承Popup，並固定有確認 & 取消按鈕
 *
 *
 * scenario:
 * 申請人工號的side button
 *
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers','uweaver/exception/UnsupportedTypeException',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Popup' , 'widget/Panel', 'widget/Commandbar', 'widget/Button',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, UnsupportedTypeException, Widget, Grid, Popup, Panel, Commandbar, Button,
                                 Logger) {

    var LOGGER = new Logger("widget/Modal");

    var declare = lang.declare;

    var Base = Popup;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            size: Modal.SIZE.L,
            title: 'title'
        };

        var cfg = this._cfg;
        _.defaults(cfg, defaults);

        this._anchors = {
            $title: undefined,
            $content: undefined,
            $grid: undefined
        };
    }
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var cfg = this._cfg;

        var defaults = {
            hidden: false
        };

        options || (options = {});
        _.defaults(options, defaults);

        buildPanel.call(this);
        buildCommandbar.call(this);

        var anchors = this._anchors;
        anchors.$content = this.$el.find('.panel-body');

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('render', {
                data: {},
                context: this,
                source: this
            });
            // modal跟popup一樣，render後不會自動show，call show()時才出現
            //options.hidden || this.show();
        }

        return this;
    }
    function buildPanel() {
        var cfg = this._cfg ;
        this._panel = new Panel({
            title: cfg.title
        }).render();

        this.size(cfg.size);

        this.$el.append(this._panel.$el);
    }

    function title(title) {
        return this._panel.title(title);
    }
    function size(size) {
        this._panel.$el.find('.panel-body').css('width', size);
    }
    function setContent(component, options) {
        var anchors = this._anchors;

        options || (options = {});

        var defaults = {
            reset: true
        };
        _.defaults(options, defaults);

        options.reset && anchors.$content.empty();

        if(component instanceof Widget) {
            component.attach(anchors.$content);
        } else if(component instanceof jQuery) {
            anchors.$content.append(component);
        } else if(component instanceof NodeList) {
            anchors.$content.append($(component));
        } else {
            throw new UnsupportedTypeException({
                supportedTypes: ['Widget', 'jQuery', 'NodeList'],
                type: typeof component
            });
        }

        options.reset && this.buildCommandbar();
    }
    function buildCommandbar() {
        this._commandbar = new Commandbar();
        this._commandbar.create(Button.VALUE.CONFIRM);
        this._commandbar.create(Button.VALUE.CLOSE);
        this._commandbar.render();
        this._commandbar.align(Commandbar.ALIGN.CENTER);

        this._panel.setContent(this._commandbar.$el);
    }

    var props = {
        _anchors: undefined,
        _grid: undefined,
        _commandbar: undefined
    };

    var Modal = declare(Base, {
        initialize: initialize,
        render: render,

        title: title,
        size: size, // width會覆蓋掉popup width 所以改為size
        setContent: setContent,
        buildCommandbar: buildCommandbar
    }, props);

    Modal.SIZE = {
        SS: "350",
        S: "400px",
        M: "500px",
        L: "800px",
        XL: "1000px",
        XXL: "1200px"

    };

    return Modal;
});