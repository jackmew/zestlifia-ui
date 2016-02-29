/**
 * Created by jasonlin on 3/23/15.
 */
define(['jquery', 'underscore', 'interact',
    'uweaver/widget/Widget'], function ($, _, interact, Widget){
    var declare = uweaver.lang.declare;
    var Base = Widget;

    var Interact = declare(Base, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        draggable: draggable,
        dropzone: dropzone,
        resizable: resizable,
        gesturable: gesturable,

        dragmove: dragmove,
        resizemove: resizemove,
        gesturemove: gesturemove,

        /**
         * protected members
         */

        /**
         * private members
         */
        _interact: undefined,

        /**
         * event handlers
         */

        onDragstart: function(event) {
        },

        onDragmove: function(event) {
            var x = event.pageX, y = event.pageY;
            var dx = event.dx, dy = event.dy;
            var options = {
                target: event.target,
                x0: event.x0,
                y0: event.y0,
                speed: event.speed,
                timeStamp: event.timeStamp,
                velocityX: event.velocityX,
                velocityY: event.velocityY,
                zoneEnter: event.dragEnter,
                zoneLeave: event.dragLeave
            };

            this.dragmove(x, y , dx, dy, options);
        },

        onDragend: function(event) {


        },

        onResizestart: function(event) {

        },

        onResizemove: function(event) {
            var x = event.pageX, y = event.pageY;
            var dx = event.dx, dy = event.dy;
            var options = {
                target: event.target,
                x0: event.x0,
                y0: event.y0,
                speed: event.speed,
                timeStamp: event.timeStamp,
                velocityX: event.velocityX,
                velocityY: event.velocityY,
                dRect: event.deltaRect,
                axes: event.axes
            };

            this.resizemove(x, y , dx, dy, options);
        },

        onResizeend: function(event) {

        },

        onGesturestart: function(event) {

        },

        onGesturemove: function(event) {

        },

        onGestureend: function(event) {

        }



    });

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        config || (config = {});

        this._interact = interact(this.el);
    }

    function draggable(options) {
        options = options || {};
        var interact = this._interact;

        var defaults = {
            inertia: true,
            restrict: {
                restriction: undefined,
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }
        };

        _.defaults(options, defaults);

        if(options.restrict.restriction) {
            options.restrict.restriction = options.restrict.restriction.get(0);
        }

        options.onmove = _.bind(this.onDragmove, this);

        interact.draggable(options);
    }

    function dragmove(x, y, dx, dy, options) {
        var event = {
            context: this,
            data: {
                x: x,
                y: y,
                dx: dx,
                dy: dy
            }
        };

        _.defaults(event.data, options);

        this.trigger('dragmove', event);
    }

    function dragstart() {

    }

    function dragend() {

    }

    function resizable(options) {
        options = options || {};
        var interact = this._interact;

        var defaults = {
            edges: { left: true, right: true, bottom: true, top: true }
        };

        _.defaults(options, defaults);

        interact.resizable(options).on('resizemove', _.bind(this.onResizemove, this));

    }

    function resizemove(x, y, dx, dy, options) {
        var event = {
            context: this,
            data: {
                x: x,
                y: y,
                dx: dx,
                dy: dy
            }
        };

        _.defaults(event.data, options);

        this.trigger('resizemove', event);
    }

    function resizestart() {

    }

    function resizeend() {

    }

    function gesturable(options) {

    }

    function gesturemove() {

    }

    function gesturestart() {

    }

    function gestureend() {

    }

    function dropzone() {

    }

    return Interact;

});