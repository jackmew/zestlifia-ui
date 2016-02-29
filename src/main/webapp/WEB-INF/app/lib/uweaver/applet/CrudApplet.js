/**
 * Created by jasonlin on 6/20/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/applet/Applet', 'uweaver/widget/TabPanel', 'uweaver/widget/Finder2', 'uweaver/widget/Viewer',
    'text!./tpl/CrudApplet.html',
    'uweaver/validator',
    'uweaver/Logger'], function (_, $, lang, Applet, TabPanel, Finder, Viewer, tpl, validator, Logger) {

    var declare = lang.declare;
    var prompt = uweaver.prompt;

    var Base = Applet;

    var CrudApplet = declare(Base, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        browse: browse,
        add: add,
        edit: edit,
        save: save,
        erase: erase,

        /**
         * protected members
         */
        logger: new Logger("CrudApplet"),
        prepare: prepare,
        store: undefined,
        tplFinder: undefined,
        tplViewer: undefined,

        /**
         * private members
         */
        _tabPanel: undefined,
        _finder: undefined,
        _viewers: {},


        /**
         * event handler
         */
        onTabsActivate: function(event) {
            if(event.data.newTab==="finder") {
                this.finder.refresh();
            }
        },

        onFinderEdit: function(event) {
            if(event.data.length===0) {
                prompt.info("Please select one item.");
                return false;
            }
            this.edit(event.data);
        },

        onFinderAdd: function(event) {
            this.add();
        },

        onFinderDelete: function(event) {
            if(event.data.length===0) {
                prompt.info("Please select one record.");
                return false;
            }
            prompt.confirm("Delete?", {
                yes: function() {
                    var finder = event.context;
                    this.erase(finder);
                }
            });
            var finder = event.context;
            this.erase(finder);
        },

        onViewerSave: function(event) {
            var viewer = event.context;
            this.save(viewer);
        },

        onViewerClose: function(event) {
            var viewer = event.context;
            var name = viewer.name();
            this.viewers[name] = undefined;
            this.tabPanel.remove(name);
            viewer.destroy();
            this.browse();
        }
    });

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this.tpl = tpl;
    }

    function prepare() {
        Base.prototype.prepare.apply(this, arguments);

        var $tabPanel = this.$("[data-role=tabs]");
        var tabPanel = new TabPanel({
            el: $tabPanel
        });

        tabPanel.render({enhance: false});
        tabPanel.on("activate", _.bind(this.onTabsActivate, this));

        this._tabPanel = tabPanel;

        var $finder = tabPanel.$panel("finder");

        var finder = new Finder({
            el: $finder,
            tpl: this.tplFinder,
            store: this.store
        });
        finder.render();
        finder.on('edit', _.bind(this.onFinderEdit, this));
        finder.on('add', _.bind(this.onFinderAdd, this));
        finder.on('delete', _.bind(this.onFinderDelete, this));

        this._finder = finder;
    }

    function browse() {
        this._finder.refresh();
        this._tabPanel.active("finder");
    }

    function edit(items) {
        var model = _.first(items);
        model.fetch().then(function(args) {
            var viewer = new Viewer({
                tpl: this.tplViewer,
                model: model,
                mode: "edit"
            });
            viewer.render();
            viewer.on('save', _.bind(this.onViewerSave, this));
            viewer.on('close', _.bind(this.onViewerClose, this));
            var name = this._tabPanel.add("viewer", viewer.$el, {
                title: "Edit",
                icon: "edit"
            });
            viewer.name(name);
            this._viewers[name] = viewer;
            this._tabPanel.active(name);
        }, function(response){
            prompt.warn("Data not found!", {
                explanation: response.responseText
            });
        }, this);

    }

    function add() {
        var model = new this.store.model();
        var viewer = new Viewer({
            tpl: this.tplViewer,
            model: model,
            mode: "create"
        });
        viewer.render();
        viewer.on('save', _.bind(this.onViewerSave, this));
        viewer.on('close', _.bind(this.onViewerClose, this));
        var name = this._tabPanel.add("viewer", viewer.$el, {
            title: "Create",
            icon: "plus"
        });
        viewer.name(name);
        this._viewers[name] = viewer;
        this._tabPanel.active(name);
    }

    function erase(finder) {

        var items = finder.selection();
        var model = _.first(items);

        var promise = model.destroy({wait: true});
        promise.then(function() {
            finder.refresh();
        }, function() {
            prompt.warn("Failed to delete the record!");
        }, this);
    }


    function save(viewer) {
        var values = viewer.values();

        viewer.disable();

        if(!viewer.model.set(values, {validate: true})) {
            var violations = viewer.model.validationError;
            violations = validator.translate(violations, viewer.labels);
            prompt.warn(validator.compose(violations));
            viewer.enable();
            return;
        }

        var promise = viewer.model.save();

        promise.then(function() {
            viewer.mode('edit');
            viewer.enable();
        }, function() {
            prompt.warn("Failed to create the record!");
            viewer.enable();
        });

        return;
    }

    return CrudApplet;
});