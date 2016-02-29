/**
 * Created by jackho on 2/2/16.
 */
/**
 * Created by jackho on 2/1/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    'text!./tpl/Ajax.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup,
                                tpl, Logger) {

    var LOGGER = new Logger("applet/Test/Ajax");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {

        };

        this._title = i18n.translate("Grid System");
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

        var anchors = this._anchors;

        this.$('#btn1').on('click', function() {
            $.ajax({
                type : 'GET',
                dataType : 'json',
                url: '/crm/rest/activities',
                success : function(data) {
                    console.log(data);
                    alert('success');
                },
                error : function(xhr ,status){
                    alert("error");
                }
            });
        });

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
        _menu: undefined,
        _finder: undefined
    };


    var Ajax = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Ajax.COMMAND = {
    };

    return Ajax;
});