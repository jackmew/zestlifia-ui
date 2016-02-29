define(['jquery', 'underscore', 'uweaver/lang',
    'uweaver/widget/Widget'], function ($, _, lang, Widget){
    var declare = lang.declare;
    var Base = Widget;

    /**
     * **Icon**
     * This class represents a icon.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Icon
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the button.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        var defaults = {};

        _.defaults(cfg, defaults);

        _.each(this.$el.prop('className').split(' '), function(className) {
            if(className.length>3 && className.substr(0, 3)==='fa-') {
                var ascii = className.charCodeAt(3);
                if(ascii>48 && ascii<57 && className.charAt(4)==='x') {
                    this._size = parseInt(className.charAt(3));
                } else if(ascii>=97 && ascii<=122) {
                    this._name = className.substr(3)
                }
            }
        }, this);

        this._name ? this.show() : this.hide();

        this.addClass('fa');
        cfg.name && this.name(cfg.name);
        cfg.size && this.size(cfg.size);
    }

    function name(str) {
        if(arguments.length==0) return this._name;

        this._name && (this.removeClass('fa-' + this._name));

        if(str) {
            this.addClass('fa-' + str);
            this.show();
        } else {
            this.hide();
        }

        this._name = str;
    }

    function size(val) {
        if(!val) return this._size;

        this.removeClass('fa-' + this._size + 'x');
        this.addClass('fa-' + val + 'x');
        this._size = val;
    }


    var props = {
        /**
         * @override
         */
        tagName: 'i',

        _name: undefined,
        _size: 1
    };

    var Icon = declare(Base, {
        initialize: initialize,

        name: name,
        size: size

    }, props);

    return Icon;


});