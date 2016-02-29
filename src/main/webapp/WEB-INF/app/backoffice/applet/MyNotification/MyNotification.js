/**
 * Created by jackho on 2/19/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers',
    './gadget/Finder',
    'uweaver/Logger'], function(_, $, Applet, Triggers,
                                Finder, Logger) {

    var LOGGER = new Logger("applet/MyNotification");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;
    var path = 'applet/MyNotification/gadget/';

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {

        };

        this._title = i18n.translate("通知");
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

        buildFinder.call(this);

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
    function buildFinder() {
        this.addClass('form-horizontal');
        this.once('attach', function() {

            this._finder = new Finder().render();
            this._finder.on('select', _.bind(onGridSelect, this));
            this.add(this._finder, {
                badge: '9'
            });

            LOGGER.debug("buildFinder done");

        }, this);
    }
    function onGridSelect(event) {
        var model = event.data;
        var no = model.get('no');
        var type = model.get('type');
        LOGGER.debug("MyNotification onGridAbnSelect - no: ${0} , type: ${1}", no, type);

        var module ;
        var mode ;
        var title = type+'-'+no ;
        if(type === '原料異常') {
            module = 'applet/AbnMaterial/gadget/Editor';
            mode = 'NOTIFICATION_REJECT';
        }
        //else if(type === '原料異常') {
        //    module = 'applet/AbnMaterial/gadget/Editor';
        //    mode = 'NOTIFICATION_STORAGE';
        //}
        else if(type === '委外異常') {
            module = 'applet/AbnOutSource/gadget/Editor';
            mode = 'NOTIFICATION_CREATE';
        }
        //else if(type === '委外異常') {
        //    module = 'applet/AbnOutSource/gadget/Editor';
        //    mode = 'NOTIFICATION_HALF_CREATE';
        //}
        else if(type === '成品特性異常') {
            module = 'applet/AbnEndProductFeature/gadget/Editor';
            mode = 'NOTIFICATION';
        } else if(type === '成品外觀異常') {
            module = 'applet/AbnEndProductAppearance/gadget/Editor';
            mode = 'NOTIFICATION';
        } else if(type === '客訴') {
            module = 'applet/IssueApl/gadget/Editor';
            mode = 'NOTIFICATION';
        } else if(type === '原料特採') {
            module = 'applet/SprocMaterialApl/gadget/Editor';
            mode = 'NOTIFICATION';
        } else if(type === '成品特採') {
            module = 'applet/SprocApl/gadget/Editor';
            mode = 'NOTIFICATION';
        }

        var context = this;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                mode: mode,
                title: title
            });

            gadget.render();
            context.add(gadget, {
                closable: true
            });
            //gadget.on('send', _.bind(gadgetSend, context));
        });
    }

    var props = {
    };


    var MyNotification = declare(Base, {
        initialize: initialize,
        render: render
    }, props);


    return MyNotification;
});