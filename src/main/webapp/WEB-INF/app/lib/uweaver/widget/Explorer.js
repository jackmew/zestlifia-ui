/**
 * Created by jasonlin on 6/20/14.
 */
define(['uweaver/widget/Widget', 'underscore', 'jquery', 'text!./tpl/Explorer.html', 'uweaver/widget/Treebox',
        'uweaver/Logger'],
    function(Widget, _, $, tpl, Treebox, Logger) {
        var Explorer = Widget.extend({
            logger: new Logger("Explorer"),

            tpl: tpl,
            labels: {
                title: "Explorer",
                footnote: "Power by uWeaver"
            },

            $desktop: undefined,
            $sitemap: undefined,
            $sitemapSwitch: undefined,

            me: undefined,
            sitemapStore: undefined,

            startupApplet: undefined,
            activeApplet: undefined,

            initialize: initialize,
            prepare: prepare,
            ready: ready,

            showSitemap: showSitemap,
            hideSitemap: hideSitemap,

            open: open,

            onSitemapSwitchClick: function() {
                this.showSitemap();
            },

            onSitemapSelect: function(item) {
                this.open(item.id);
                this.hideSitemap();
            },

            onOpen: function(event) {
                this.open(event.applet);
            }
        });

        function initialize(options) {
            options || (options = {});

            Widget.prototype.initialize.apply(this, arguments);

            this.me = options.me;
            this.sitemapStore = options.sitemapStore;
            this.startupApplet = options.startupApplet;
        }

        function prepare() {
            this.$component = this.$("[data-role=page]");
            this.$sitemapSwitch = this.$gear("sitemapSwitch");
            this.$sitemap = this.$gear("sitemap");
            this.$desktop = this.$gear("desktop");

            renderSitemap(this);

        }

        function ready() {
            if(this.startupApplet) this.open(this.startupApplet);
        }

        function renderSitemap(context) {
            var sitemap = new Treebox({
                el: context.$sitemap,
                store: context.sitemapStore,
                displayField: 'name',
                folderField: 'activities',
                valueField: 'id'
            });

            sitemap.render();

            context.$sitemapSwitch.on('click', _.bind(context.onSitemapSwitchClick, context));
            sitemap.on('select', _.bind(context.onSitemapSelect, context));
        }

        function showSitemap() {
            this.$sitemap.panel('open');
        }

        function hideSitemap() {
            this.$sitemap.panel('close');
        }

        function open(id) {
            var appletPath = 'applet/' + id + "Applet";
            var context = this;

            this.logger.debug(Logger.PROBE, 'open', appletPath);

            require([appletPath], function(Applet) {
                context.activeApplet = new Applet({
                    el: context.$desktop
                });
                context.activeApplet.render();
                context.activeApplet.on('open', _.bind(context.onOpen, context));
            });
        }


        return Explorer;
    });