/**
 * Created by jasonlin on 9/23/14.
 */

define(['underscore', 'jquery',
        'uweaver/lang', 'uweaver/string', 'uweaver/identifier', 'uweaver/Deferred',
        'uweaver/widget/Widget',
        'text!./tpl/TaskManager.html',
        'uweaver/Logger'], function (_, $, lang, string, identifier, Deferred, Widget, tpl, Logger) {
    var declare = lang.declare;
    var Base = Widget;

    var TaskManager = declare(Base, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        start: start,
        select: select,
        task: task,
        stop: stop,

        /**
         * protected members
         */
        logger: new Logger("TaskManager"),
        render: render,

        /**
         * private members
         */
        _anchors: undefined,
        _tasks: {},

        /**
         * event handler
         */
        onTaskSelect: function(event) {
            event.preventDefault();

            var $target = $(event.currentTarget);
            var id = $target.attr('name');
            this.select(id);

        }
    });

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);
        this._anchors = {
            $content: undefined
        };

        cfg.tpl = tpl;

    }

    function start(module) {
        var context = this;
        var deferred = new Deferred();

        this.logger.debug("Start Task: ${0}", {module: module});

        require([module], function(Applet) {
            var task;

            try {
                task = new Applet();
            } catch(err) {
                context.logger.error(err);
                return;
            }

            task.start();

            context.listenTo(task, 'stop', _.bind(onStop, context));

            context._tasks[task.pid()] = task;

            var tpl = "<li class='list-group-item' name='${pid}'>${title}</li>";
            var entry = string.substitute(tpl, {
                pid: task.pid(),
                title: task.title()
            });
            var $entry = $(entry);

            context._anchors.$content.append($entry);
            $entry.on('click', _.bind(context.onTaskSelect, context));
            deferred.resolve(task);
        });
        
        return deferred.promise();
    }

    function onStop(event) {
        var task = event.context;
        this.stop(task);
    }

    function stop(task) {
        if(!task) return;

        var anchors = this._anchors;
        var pid = task.pid();

        var $entry = anchors.$content.find("[name='" + pid + "']");
        $entry.detach();

        // remove the task entry from tasks
        delete this._tasks[pid];

    }

    function select(pid) {
        var task = this.task(pid);

        var event = {
            context: this,
            data: {
                task: task
            }
        };

        this.trigger('select', event);
    }

    function task(pid) {
        return this._tasks[pid];
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        anchors.$content = this.$anchor('content');

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        return this;
    }

    return TaskManager;
});
