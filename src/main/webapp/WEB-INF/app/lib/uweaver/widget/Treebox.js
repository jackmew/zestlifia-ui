/**
 * Created by jasonlin on 6/20/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
        'uweaver/widget/Widget',
        'uweaver/Logger', 'text!./tpl/Treebox.html', 'text!./tpl/treebox/Folder.html', 'text!./tpl/treebox/Item.html'],
    function(_, $, lang, Widget, Logger, tpl, tplFolder, tplItem) {
        var declare = lang.declare;
        var Treebox = declare(Widget, {
            logger: new Logger("Treebox"),

            labels: {
                title: ""
            },

            tpl: tpl,

            data: undefined,
            displayField: 'name',
            folderField: 'items',
            valueField: 'value',

            events: {
                'click [data-uw-gear=item]': 'onSelect'
            },

            initialize: initialize,
            prepare: prepare,

            select: select,

            onSelect: function(e) {
                e.preventDefault();

                var $target = $(e.currentTarget);
                var value = $target.attr('value');
                var item = JSON.parse(value);

                this.select(item);
            }
        });


        function initialize(config) {
            Widget.prototype.initialize.apply(this, arguments);

            config || (config = {});
            this.data = config.data;
            config.valueField && (this.valueField = config.valueField);
            config.displayField && (this.displayField = config.displayField);
            config.folderField && (this.folderField = config.folderField);
        }

        function prepare() {
            this.$component = this.$("[data-role=listview]");

            this._folder = _.template(tplFolder);
            this._item = _.template(tplItem);

            if(_.isArray(this.data)) {
                var nodes = this.data;
                var html = renderNodes(nodes, this);
                this.$component.html(html);
            } else {
                this.data.done(function(nodes) {
                    var html = renderNodes(nodes, this);
                    this.$component.html(html);
                }, this);
            }
        }

        function renderNodes(nodes, context) {
            var html = "";
            _.each(nodes, function(node) {
                html = html + renderNode(node, context);
            }, this);
            return html
        }

        function renderNode(node, context) {
            var html = "";
            if(node[context.folderField]) {
                var items = "";
                _.each(node[context.folderField], function(node){
                    items = items + renderNode(node, context);
                }, context);

                html = context._folder({
                    name: node[context.displayField],
                    items: items
                });
            } else {
                html = context._item({
                    name: node[context.displayField],
                    value: JSON.stringify(node)
                });
            }

            return html;
        }

        function select(item) {
            this.trigger('select', item);
            return true;
        }

        return Treebox;
    });