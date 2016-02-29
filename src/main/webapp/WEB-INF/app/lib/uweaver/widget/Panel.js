/**
 * @license
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2014 Jason Lin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Container', 'uweaver/widget/Interact',
    'text!./tpl/Panel.html',
    'uweaver/Logger'], function(_, $, lang, Container, Interact, tpl, Logger) {

    var declare = lang.declare;
    var Base = Container;

    /**
     * **Panel**
     * A panel is a movable & draggable container.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     * - title(String): The title of the panel.
     * - collapsible(Boolean): Specify if the panel is collapsible.
     *
     * @constructor Panel
     * @extends Container
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the panel.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            title: undefined,
            collapsible: false
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $header: undefined,
            $content: undefined,
            $title: undefined
        };

        this._movement = {x:0, y:0};

        cfg.tpl || (cfg.tpl = tpl);
    }

    /**
     * @memberof Panel#
     * @protected
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        anchors.$header = this.$anchor("header");
        anchors.$content = this.$anchor("content");
        anchors.$title = anchors.$header.find('[data-uw-anchor=title]');

        if(cfg.title) {
            this.title(cfg.title);
            anchors.$header.show();
        } else {
            anchors.$header.hide();
        }

        if(cfg.collapsible) {
            anchors.$header.on('click', _.bind(this.toggle, this));
        }

        if(anchors.$header.length>0) {
            var mover = new Interact({
                el: anchors.$header
            });
            mover.render();

            this.listenTo(mover, 'dragmove', _.bind(onDragmove, this));
            this._mover = mover;
        }

        var resizer = new Interact({
            el: this.$el
        });
        resizer.render();
        this.listenTo(resizer, 'resizemove', _.bind(onResizemove, this));
        this._resizer = resizer;

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

    function title(html) {
        if(!html) return this._anchors.$title.html();

        this._anchors.$title.html(html);
    }

    function enable() {
        this.removeClass("uw-disable");
    }

    function disable() {
        this.addClass("uw-disable");
    }

    function collapse() {
        this._anchors.$content.hide();
    }

    function expand() {
        this._anchors.$content.show();
    }

    function isCollapsed() {
        return (this._anchors.$content.css("display")==='none');
    }

    function toggle() {
        this.isCollapsed() ? this.expand() : this.collapse();
    }

    function draggable(options) {
        options || (options = {});

        var defaults = {
            inertia: false
        };

        options = _.defaults(options, defaults);

        options.restrict || (options.restrict = {});

        options.restrict = _.defaults(options.restrict, {
            restriction: this.$el.parent(),
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        });

        var mover = this._mover;

        mover.addClass("uw-movable");

        mover.draggable(options);

        mover.show();
        this._anchors.$header.off('click');
    }

    function resizable(options) {
        var resizer = this._resizer;

        resizer.resizable({
            edges: { left: true, right: true, bottom: true, top: true }
        });
    }

    function onDragmove(event) {
        var movement = this._movement;
        var x = movement.x + event.data.dx;
        var y = movement.y + event.data.dy;


        this.el.style.webkitTransform =
            this.el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        movement.x = x;
        movement.y = y;
    }

    function onResizemove(event) {
        var anchors = this._anchors;
        var movement = this._movement;

        var width = this.$el.width() + event.data.dRect.width;
        var height = anchors.$content.height() + event.data.dRect.height;

        // update the element's style
        this.$el.width(width);
        anchors.$content.height(height);

        // prevent child elements from overflow
        if(anchors.$content.get(0).offsetHeight < anchors.$content.get(0).scrollHeight) {
            anchors.$content.height(anchors.$content.get(0).scrollHeight);
        }

        // translate when resizing from top or left edges
        var x = movement.x + event.data.dRect.left;
        var y = movement.y + event.data.dRect.top;

        this.el.style.webkitTransform =
            this.el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        this.el.style.webkitTransform = this.el.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        movement.x = x;
        movement.y = y;
    }


    var props = {
        LOGGER: new Logger("Panel"),

        _mover: undefined,
        _resizer: undefined,
        _movement: undefined,
        _anchors: undefined
    };

    var Panel = declare(Base, {

        initialize: initialize,
        render: render,

        title: title,
        collapse: collapse,
        expand: expand,
        isCollapsed: isCollapsed,
        toggle: toggle,
        close: close,
        enable: enable,
        disable: disable,
        draggable: draggable,
        resizable: resizable
    }, props);


    return Panel;
});
