/**
 * Created by jackho on 2/19/16.
 *
 *
 <div class="dropdown pull-left">
     <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
         動作
         <span class="caret" style="margin-left: 10px;"></span>
     </button>
     <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
         <li>
            <a href="#" value="SAVE" class="fa fa-save">
                <span style="margin-left: 5px;">儲存</span>
            </a>
        </li>
     </ul>
 </div>
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'widget/Button', 'uweaver/exception/NotEmptyConflictException',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget,
                                 Button,
                                 NotEmptyConflictException,
                                 Logger) {

    var LOGGER = new Logger("widget/Dropdown");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            title: '其他',
            btnMode: Button.MODE.MODAL,
            isTrigger: false
        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $content: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        var id =  _.uniqueId('dropdown_');
        buildButton.call(this, id);
        buildContent.call(this, id);

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
    function buildButton(id) {
        var cfg = this._cfg ;
        var isTrigger = cfg.isTrigger;

        this._button = new Button({
            mode: cfg.btnMode ,
            text: cfg.title,
            value: cfg.title
        }).render();
        this._button.addClass('dropdown-toggle');
        this._button.attr('data-toggle', 'dropdown');
        this._button.attr('aria-haspopup', 'true');
        this._button.attr('aria-expanded', 'true');
        this._button.attr('id', id);

        var $caret = $('<span/>');
        $caret.addClass('caret');
        $caret.css('margin-left', '10px');

        this._button.$el.append($caret);

        this._button.attach(this.$el);

        //if(isTrigger) {
        //    this._button.$el.on('click', _.bind(onTriggerClick, this));
        //}
    }
    function buildContent(id) {
        var a = this._anchors;
        a.$content = $('<ul/>');
        a.$content.addClass('dropdown-menu');
        a.$content.attr('aria-labelledby', id);

        a.$content.appendTo(this.$el);
    }
    function add(value, text, icon) {
        var isTrigger = this._cfg.isTrigger;
        var $content = this._anchors.$content;
        var $action = $('<li/>');
        var $a = $('<a/>');
        $a.attr('value', value);
        $a.addClass('fa');
        $a.addClass(icon);
        $a.css('color', 'steelblue');

        anchorText($a, text);


        $action.append($a);
        $content.append($action);

        if(isTrigger) {
            $a.on('click', _.bind(onTriggerClick, this));
        }
    }
    function addAction(action) {
        var isTrigger = this._cfg.isTrigger;
        var $content = this._anchors.$content;
        var $action = $('<li/>');
        var $a = $('<a/>');
        $a.css('color', 'steelblue');

        if(action === Dropdown.ACTION.SAVE) {
            $a.attr('value', 'SAVE');
            anchorText($a, '儲存');
            $a.addClass('fa');
            $a.addClass(action);
        } else if(action === Dropdown.ACTION.DELETE) {
            $a.attr('value', 'DELETE');
            anchorText($a, '刪除');
            $a.addClass('fa');
            $a.addClass(action);
        } else if(action === Dropdown.ACTION.CLOSE) {
            $a.attr('value', 'CLOSE');
            anchorText($a, '關閉');
            $a.addClass('fa');
            $a.addClass(action);
        } else if(action === Dropdown.ACTION.SEND) {
            $a.attr('value', 'SEND');
            anchorText($a, '送出');
            $a.addClass('fa');
            $a.addClass(action);
        } else if(action === Dropdown.ACTION.NOTIFY) {
            $a.attr('value', 'NOTIFY');
            anchorText($a, '通知供應商');
            $a.addClass('fa');
            $a.addClass(action);
        } else {
            $a.attr('value', action.value);
            anchorText($a, action.text);
            $a.addClass('fa');
            $a.addClass(action.icon);
        }

        $action.append($a);
        $content.append($action);

        if(isTrigger) {
            $a.on('click', _.bind(onTriggerClick, this));
        }

        return $action;
    }
    function getAction(action) {
        var $content = this._anchors.$content;
        return ($content.find('.'+action).parent()) ;
    }
    function anchorText($a, text) {
        var $text = $('<span/>');
        $text.css('margin-left', '5px');
        $text.text(text);
        $a.append($text);
    }
    function onTriggerClick(evt) {
        var a = evt.currentTarget;
        if(!$(a).attr('value')) {
            throw new NotEmptyConflictException({
                entity: this,
                property: 'value'
            });
        }

        var event = {
            context: this,
            source: this,
            data: {
                value: $(a).attr('value')
            }
        };

        this.trigger("ddClick", event);
    }
    var props = {
        tagName: 'div',
        className: 'dropdown',

        _class: 'Dropdown',

        _anchors: undefined,
        _button: undefined
    };

    var Dropdown = declare(Base, {
        initialize: initialize,
        render: render,

        add: add,
        addAction: addAction,
        getAction: getAction
    }, props);

    Dropdown.ACTION = {
        SAVE: 'fa-save',
        DELETE: 'fa-trash-o',
        CLOSE: 'fa-times',
        SEND: 'fa-send-o',
        NOTIFY: 'fa-envelope-o'
    };

    return Dropdown;
});