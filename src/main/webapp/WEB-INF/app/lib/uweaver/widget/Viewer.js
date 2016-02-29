/**
 * Panel
 * Created by jasonlin on 8/7/14.
 */

define(['underscore', 'jquery', 'uweaver/widget/Widget',
    'uweaver/widget/Form', 'uweaver/validator',
    'uweaver/Logger'], function (_, $, Widget, Form, validator, Logger) {

    var i18n = uweaver.i18n;
    var resource = uweaver.resource;
    var prompt = uweaver.prompt;

    var Viewer = Widget.extend({
        logger: new Logger("Viewer"),

        form: undefined,

        initialize: initialize,
        prepare: prepare,
        ready: ready,

        name: name,
        mode: mode,
        values: values,

        execute: execute,
        reset: reset,
        enable: enable,
        disable: disable,

        translate: translate,

        events: {
            'click button': 'onExecute'
        },

        onExecute: function (e) {
            e.preventDefault();

            var $target = $(e.currentTarget);
            var command = $target.attr('value');
            this.execute(command);
        }
    });

    function initialize(options) {
        options || (options = {});

        var defaults = {
            readonly: false
        };

        _.defaults(options, defaults);

        Widget.prototype.initialize.apply(this, arguments);

        this._store = options.store;
        this.readonly = options.readonly;
        this._mode = options.mode;
    }

    function prepare() {


        Widget.prototype.prepare.apply(this, arguments);

        this.$component = this.$el;

        this.translate(this.$('legend, label, button, input'));

        this.form = new Form({
            el: this.$("form")
        });

        this.form.render({enhance: false});

        if(_.keys(this.labels).length==0) {
            _.extend(this.labels, this.form.labels);
        }
    }

    function ready() {
        if(this.readonly) {
            this.disable();
        } else if(this._mode) {
            this.mode(this._mode);
        }

        this.values(this.model.toJSON());
    }

    function name(name) {
        if(!name) return this._name;
        this._name = name;
    }

    function values(item) {
        return this.form.values(item);
    }

    function enable() {
        this.form.enable();
    }

    function disable() {
        this.form.disable();
    }

    function reset() {
        this.values(this.model.toJSON());
    }

    function mode(value) {
        if(!value) return this._mode;

        var $fields = this.form.$('input[data-uw-modes]');
        _.each($fields, function (element, index) {
            var $field = $(element);
            var modes = $field.attr('data-uw-modes');
            if(modes.indexOf(value)===-1) {
                this.form.disable($field.attr('name'));
            } else {
                this.form.enable($field.attr('name'));
            }
        }, this);
        var $commands = this.$('button[data-uw-modes]');
        _.each($commands, function (element, index) {
            var $command = $(element);
            var modes = $command.attr('data-uw-modes');
            if(modes.indexOf(value)===-1) {
                $command.prop('disabled', true);
            } else {
                $command.prop('disabled', false);
            }
        }, this);

        this._mode = value;
    }

    function execute(command) {
        switch (command.toUpperCase()) {
            case Viewer.RESET:
                this.reset();
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

    function translate(nodes) {

        _.each(nodes, function(element) {
            var $node = $(element);
            if($node.attr('placeholder')) {
                $node.attr('placeholder', i18n.translate($node.attr('placeholder')));
            } else if($node.text) {
                $node.text(i18n.translate($node.text()));
            } else if($node.val) {
                $node.val(i18n.translate($node.val()));
            }

        }, this);
    }


    // Enumeration of build in commands
    Viewer.RESET = 'RESET';

    return Viewer;
});
