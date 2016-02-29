/**
 * Created by jackho on 1/28/16.
 *
 *
 * How to use:
 *
 *
 this._panel = new Panel({
    collapse: true,
    title: '特採資料',
    theme: Panel.THEME.INFO

 }).render();
 var sprocInfo = new SprocInfo().render();
 this._panel.setContent(sprocInfo);
 this._panel.attach(this.$el);


 collapse     => make Panel collapsible
 theme => Panel.THEME.DEFAULT to Panel.THEME.XXX
 mode -> $content:
 1.panel-body
 2.table(collapse時，線條會重複，底下會多margin)，因此有做一些修改 =>
 anchors.$content.css('margin-bottom','0px');
 anchors.$content.find('th').css('border-bottom', '0px');

 template reference: Panel.html


 scenario:
 客訴作業 -> 客訴案件受理 -> 新增案件 -> 異常/特採

 how to use:

 this._panelD4 = new Panel({
    collapse: true,
    title: '問題原因分析'
 }).render();
 this._causeAnalysis = new CauseAnalysis({
    mode: CauseAnalysis.MODE.EIGHT_REPORT
 }).render();
 this._panelD4.setContent(this._causeAnalysis);

 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/string', 'uweaver/exception/UnsupportedTypeException',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, string, UnsupportedTypeException,
                                 Logger) {

    var LOGGER = new Logger("lib/widget/Panel");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            marginBottom: false,
            collapse: false,
            title: 'title',
            theme: Panel.THEME.PRIMARY,
            mode: Panel.MODE.NORMAL
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            // head
            $headSection: undefined,
            $panelHead: undefined,
            $panelTitle: undefined,

            $title: undefined,
            $content: undefined //1.panel-body 2.table
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;
        var anchors = this._anchors;
        // build panel
        setMarginBottom.call(this, cfg.marginBottom);
        anchors.$panelHead = $('<div/>');
        anchors.$panelHead.addClass('panel-heading');
        anchors.$panelTitle = $('<h4/>');
        anchors.$panelTitle.addClass('panel-title');

        anchors.$panelHead.append(anchors.$panelTitle);
        this.$el.append(anchors.$panelHead);


        if(cfg.theme !== Panel.THEME.DEFAULT) {
            this.$el.removeClass(Panel.THEME.DEFAULT);
            this.$el.addClass(cfg.theme)
        }

        var $body ;
        if(cfg.mode === Panel.MODE.NORMAL) {
            $body = $("<div class='panel-body'></div>");
            this.$el.append($body);

        } else if(cfg.mode === Panel.MODE.GRID) {
            var $grid = $("<table class='table table-bordered table-striped table-hover uw-selectable'></table>");
            this.$el.append($grid);

        }

        var bodyParent;
        if(cfg.collapse) {

            var toggleAnchor = "<a data-toggle='collapse' href='#${id}'>${title}</a>";
            if(cfg.mode === Panel.MODE.NORMAL) {
                this.$el.find('.panel-body').remove();
                bodyParent = "<div id='${id}' class='panel-collpase collapse'><div class='panel-body'></div></div>";
            } else if(cfg.mode === Panel.MODE.GRID) {
                this.$el.find('table').remove();
                bodyParent = "<div id='${id}' class='panel-collpase collapse'><table class='table table-striped table-hover uw-selectable'></table></div>";
            }


            var args = {
                id: _.uniqueId('panel_'),
                title: cfg.title
            };

            var $toggleAnchor = $(string.substitute(toggleAnchor, args));
            var $bodyParent = $(string.substitute(bodyParent, args));

            this.$el.find('.panel-title').append($toggleAnchor);
            this.$el.append($bodyParent);

            anchors.$title = this.$el.find('.panel-title').find('a');

        } else {
            bodyParent = $body;
            this.$el.append($(bodyParent));
            this.$el.find('.panel-title').text(cfg.title);

            anchors.$title = this.$el.find('.panel-title');
        }

        if(cfg.mode === Panel.MODE.NORMAL) {
            anchors.$content = this.$el.find('.panel-body');
        } else if(cfg.mode === Panel.MODE.GRID) {
            anchors.$content = this.$el.find('table');
            anchors.$content.css('margin-bottom','0px');
        }

        options || (options = {});
        _.defaults(options, defaults);


        this.hide();


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
    function title(title) {
        var anchors = this._anchors;
        if(_.isUndefined(title)) {
            return anchors.$title.text();
        }
        anchors.$title.text(title);
    }
    function setContent(component, options) {
        var anchors = this._anchors;

        options || (options = {});

        var defaults = {
            reset: false
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
        return this ;
    }
    function setMarginBottom(isMargin) {
        if(isMargin) {
            this.$el.removeAttr('style');
        } else {
            this.$el.css('margin-bottom',"0px");
        }
    }
    /*
    * 用來放東西在head上
    * option.align = right | left
    * */
    function appendHead(component, options) {
        options || (options = {
            align: 'right'
        });
        var pull ;
        if(options.align === 'right') {
            pull = "pull-right";
        } else if(options.align === 'left'){
            pull = "pull-left";
        }

        var a = this._anchors;

        if(_.isUndefined(a.$headSection)) {
            a.$panelHead.addClass('clearfix');
            a.$panelTitle.addClass('pull-left');


            a.$headSection = $('<div/>');
            a.$headSection.addClass(pull);

            a.$panelHead.append(a.$headSection);
        }
        a.$headSection.append(component);
    }

    //function attach() {
        //Widget.prototype.attach.apply(this, arguments);
        //
        //var anchors = this._anchors;
        //
        //if(this._cfg.mode === Panel.MODE.GRID) {
        //    anchors.$content.find('th').css('border-bottom', '0px');
        //    anchors.$content.find('tr th').css('border-right', '1px solid #ddd');
        //    anchors.$content.find('tr th:last-child').css('border-right', '0px');
        //
        //    anchors.$content.find('tr td').css('border-right', '1px solid #ddd');
        //    anchors.$content.find('tr td:last-child').css('border-right', '0px');
        //
        //}
    //}

    var props = {
        _anchors: undefined,
        tagName: 'div',
        className: 'panel',
        _class: 'Panel'
    };

    var Panel = declare(Base, {
        initialize: initialize,
        render: render,

        title: title,
        setContent: setContent,
        setMarginBottom: setMarginBottom,
        appendHead: appendHead
        //attach: attach
    }, props);

    Panel.THEME = {
        DEFAULT: 'panel-default',
        PRIMARY: 'panel-primary',
        INFO: 'panel-info',
        SUCCESS: 'panel-success',
        WARNING: 'panel-warning',
        DANGER: 'panel-danger'
    };
    Panel.MODE = {
        NORMAL: 'normal',   //panel with heading: http://getbootstrap.com/components/#panels-heading
        GRID: 'grid'        //panel-tables: http://getbootstrap.com/components/#panels-tables
    };

    return Panel;
});