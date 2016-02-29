/**
 * Created by jackho on 2/17/16.
 */
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers',
    'uweaver/data/Collection', 'uweaver/widget/Widget',
    'text!./tpl/Menu.html', './gadget/Finder', 'applet/IssueApl/gadget/Editor',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Collection, Widget,
                                tplMenu, Finder, IssueEditor,
                                Logger) {

    var LOGGER = new Logger("IssueMgnt/IssueMgnt");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._title = i18n.translate("客訴案件管理");
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

        //buildMenu.call(this);
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
    //function buildMenu() {
    //    this._menu = new Triggers({
    //        tpl: tplMenu
    //    }).render();
    //
    //    this.menu(this._menu);
    //}
    function buildFinder() {

        this.once('attach', function() {

            this._finder = new Finder().render();
            this._finder.on('gridSelect', _.bind(onGridSelect, this));
            this.add(this._finder);

            LOGGER.debug("buildFinder done");

        }, this);
    }
    function onGridSelect(evt) {
        var no = evt.data.get('no');
        var issueEditor = new IssueEditor({
            title: no,
            mode: IssueEditor.MODE.MGNT
        }).render();

        this.add(issueEditor, {
            closable: true
        });
    }

    var props = {
        _anchors: undefined,
        _finder: undefined
    };


    var IssueMgnt = declare(Base, {
        initialize: initialize,
        render: render
    }, props);



    return IssueMgnt;
});