/**
 * Created by jasonlin on 10/3/14.
 */
/**
 * Created by jasonlin on 9/23/14.
 */

define(['underscore', 'jquery',
    'uweaver/lang', 'uweaver/string', 'uweaver/identifier', 'uweaver/Deferred',
    'uweaver/widget/Panel',
    'text!./tpl/PerspectiveManager.html',
    'uweaver/Logger'], function (_, $, lang, string, identifier, Deferred, Panel, tpl, Logger) {
    var declare = lang.declare;

    var Desktop = declare(Panel, {

        logger: new Logger("Desktop"),

        cache: undefined,

        processes: {},
        index: {},

        $content: undefined,

        initialize: initialize,
        prepare: prepare,

        select: select,

        process: process,


        onTaskSelect: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);
            var pid = $target.attr('href');
            this.select(pid);

        }
    });

    function initialize(config) {
        Panel.prototype.initialize.apply(this, arguments);

        config || (config = {});

        this.tpl = tpl;

        this.cache = {
            toolbar: undefined,
            $launchpad: undefined,
            $desktop: undefined,

            $perspective: {},
            activePerspective: Workbench.PERSPECTIVE.HOME,
            $paragraphs: [],
            layout: Workbench.PERSPECTIVE.GRID,

            appletStore: undefined,
            visibleProcess: {},
            activeProcess: undefined
        }
    }

    function prepare() {
        Panel.prototype.prepare.apply(this, arguments);
        this.$content = this.$gear('content');
    }



    function execute(command, button) {
        switch (command.toUpperCase()) {
            case Desktop.COMMAND.ADD:
                break;
            case Desktop.COMMAND.REMOVE:
                break;
            default:
                var event = {
                    data: this.values(),
                    context: this
                };

                this.trigger(command, event);
                break;
        }
    }


    // Enumeration of build in commands
    Desktop.COMMAND = {
        ADD: 'ADD',
        REMOVE: 'REMOVE'
    };


    Desktop.PERSPECTIVE = {
        GRID: 1,
        FULLSCREEN: 2
    };

    return Desktop;
});
