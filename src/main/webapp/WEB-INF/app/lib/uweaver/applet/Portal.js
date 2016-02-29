/**
 * Created by jasonlin on 8/21/14.
 */
define(['underscore', 'jquery', 'interact', 'uweaver/lang',
    'uweaver/applet/Applet', 'uweaver/widget/Menu',
    'text!./tpl/Portal.html', 'uweaver/Logger'], function (_, $, interact, lang, Applet, Menu, tpl, Logger) {
    var declare = lang.declare;
    var Portal = declare(Applet, {
        logger: new Logger("Portal"),

        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        showMenu: showMenu,
        hideMenu: hideMenu,

        /**
         * protected members
         */
        prepare: prepare,
        ready: ready,


        /**
         * private members
         */

        $selector: undefined,
        $content: undefined,
        _markers: {
            $content: undefined
        },
        _menu: undefined,


        add: add,
        nextBlock: nextBlock,
        forward: forward,


        /**
         * event handler
         */

        events: {
            "change [data-uw-gear=selector]": "onSelect",
            "click button": "onExecute"
        },

        onSelect: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);

            var gadget = $target.val();

            if(!gadget) return;

            this.add(gadget);

            //this.$selector.val('');
            //this.$selector.selectmenu('refresh', true);
        },

        onExecute: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);

            var gadget = $target.val();

            if(!gadget) return;

            this.add(gadget);
        },

        onForward: function(event) {
            this.forward(event);
        }
    });

    function initialize(config) {
        Applet.prototype.initialize.apply(this, arguments);

        config || (config = {});

        this.cache = {
            title: "Dashboard",
            layout: Applet.LAYOUT.WIDESCREEN
        };

        config.title && this.title(config.title);

        this.tpl || (this.tpl = tpl);
    }

    function prepare() {
        Applet.prototype.prepare.apply(this, arguments);
        this.$selector = this.$gear('selector');
        this.$content = this.$gear('content');
    }

    function ready() {
        this.$selector.attr('selectedIndex', -1);

        var menu = new Menu();
        menu.render({
            hidden: true
        });

        this._menu = menu;

        var pink = interact('#pink');

        pink
            .draggable({
                // enable inertial throwing
                inertia: false,
                // keep the element within the area of it's parent
                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },

                // call this function on every dragmove event
                onmove: dragMoveListener,
                // call this function on every dragend event
                onend: function (event) {
                    return;
                    var textEl = event.target.querySelector('p');

                    textEl && (textEl.textContent =
                        'moved a distance of '
                        + (Math.sqrt(event.dx * event.dx +
                        event.dy * event.dy)|0) + 'px');
                }
            });


        pink
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true }
            })
            .on('resizemove', function (event) {
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.width  = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                target.textContent = event.rect.width + '×' + event.rect.height;
            });
    }

    function dragMoveListener (event) {
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    function showMenu(options) {
        var menu = this._menu;

        menu.show(options);
    }

    function hideMenu() {
        var menu = this._menu;

        menu.hide();
    }

    function add(id) {
        var gadgetPath = 'gadget/' + id;
        var context = this;

        this.logger.debug(Logger.PROBE, 'add', gadgetPath);

        require([gadgetPath], function(Gadget) {
            var gadget = new Gadget();
            var $block = context.nextBlock(gadget.blocks);
            $block.append(gadget.render().$el);
            gadget.on('forward', _.bind(context.onForward, context));
        });
    }

    function nextBlock(blocks) {
        var $block;
        if(blocks>1 || !this._$availableParagraph) {
            var $paragraph = $("<div class='ui-grid-solo'>" +
                "<div class='ui-block-a uw-block-lead'></div>" +
                "</div>");
            this.$content.append($paragraph);
            $block = $paragraph.find('.ui-block-a');
            if(blocks<=1) this._$availableParagraph = $paragraph;
        } else {
            var $paragraph = this._$availableParagraph;
            $paragraph.removeClass('ui-grid-solo');
            $paragraph.addClass('ui-grid-a');
            $block = $("<div class='ui-block-b uw-block-tail'></div>");
            $paragraph.append($block);
            this._$availableParagraph = undefined;
        }

        return $block;
    }

    function forward(event) {

        this.trigger('forward', event);
    }

    return Portal;

});