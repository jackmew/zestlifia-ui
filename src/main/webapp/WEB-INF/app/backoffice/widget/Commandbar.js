/**
 * Created by jackho on 2/17/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'widget/Button',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Button,
                                 Logger) {

    var LOGGER = new Logger("widget/Commandbar");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            mode: undefined
        };

        _.defaults(this.cfg, defaults);

        this._anchors = {

        };
        // button & a
        this._triggers = {};
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        build.call(this);


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
    function build() {
        var context = this;

        var triggers = new Triggers({
            el: context.$el
        }).render();

        /*
        * 學form-horizontal的方式，減掉最左右兩邊的margin
        * 配合Button
        * */
        this.addClass('commandbar');


        triggers.on("trigger", _.bind(onCommandTrigger, this));
    }
    function onCommandTrigger(evt) {
        //if(!this.value()) {
        //    throw new NotEmptyConflictException({
        //        entity: this,
        //        property: 'value'
        //    });
        //}

        //var event = {
        //    context: this,
        //    source: this,
        //    data: {
        //        value: this.value()
        //    }
        //};

        this.trigger("command", evt);
    }
    /*
    * add exist button (Button.js)
    * or
    * add exist dropdown
    * */
    function add(widget) {

        if(widget._class === 'Button') {
            var key = widget.$el.prop('value');
            this._triggers[key] = widget;
            //this._triggers.push(widget.$el); // <button value="" />
        } else if(widget._class == 'Dropdown') {
            widget.css('display', 'inline-block');
            var context = this ;
            $.each(widget.$el.find('a'), function(i, a) {
                //context._triggers.push($a); // <a value="" />
                var key = $(a).prop('value');
                context._triggers[key] = $(a) ;
            });
        }

        this.$el.append(widget.$el);
    }
    /*
    * create new button:
    *
    * mode:
    * 1.BUTTON.MODE.DEFAULT
    * 2.BUTTON.MODE.CIRCLE
    * */
    function create(value, text, mode) {
        //var buttons = this._triggers;
        if(_.isUndefined(value)) {
            return ;
        }
        //text || (text = value);

        var btn = new Button({
            value: value,
            text: text,
            mode: mode
        }).render();

        //icon || btn.setIcon(icon);

        this.$el.append(btn.$el);
        //buttons.push(btn);
        this._triggers[value] = btn ;
        return btn ;
    }
    function get(name) {
        return this._triggers[name];
    }

    function align(align) {
        this.css('text-align', align);
    }

    var props = {
        tagName: 'div',
        _class: 'Commandbar',
        //className: 'text-center',

        _anchors: undefined,
        _triggers: undefined
    };

    var Commandbar = declare(Base, {
        initialize: initialize,
        render: render,

        add: add,
        get: get,

        create: create,
        align: align
    }, props);

    Commandbar.ALIGN = {
        CENTER: 'center',
        RIGHT: 'right',
        LEFT: 'left'
    };
    Commandbar.MODE = {
    };


    return Commandbar;
});