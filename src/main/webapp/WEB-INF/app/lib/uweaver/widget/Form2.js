/**
 * Created by jasonlin on 7/1/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
        'uweaver/widget/Widget', 'uweaver/widget/Inputbox', 'uweaver/widget/Label', 'uweaver/widget/Button',
        'uweaver/prompt', 'i18n!', 'uweaver/converter', 'uweaver/validator', 'uweaver/string', 'uweaver/calibrator',
        'uweaver/Logger'], function(_, $, lang, Widget, Inputbox, Label, Button, prompt, i18n, converter, validator, string, calibrator, Logger) {

    var declare = lang.declare;

    var Form = declare(Widget, {
        logger: new Logger("Form"),

        constraints: {},

        initialize: initialize,
        prepare: prepare,
        ready: ready,

        cache: undefined,

        label: label,
        inputbox: inputbox,
        button: button,
        buttons: buttons,

        values: values,
        reset: reset,
        getValues: getValues,
        setValues: setValues,

        hint: hint,
        warn: warn,

        disable: disable,

        enable: enable,
        validate: validate,

        onButtonExecute: function(event) {
            var command = event.data.command;
            var source = event.context;

            var event = {
                context: this,
                data: {
                    command: command,
                    source: source
                }
            };
            this.trigger(command, event);
        }
    });

    function initialize(config) {
        Widget.prototype.initialize.apply(this, arguments);

        this.cache = {
            inputbox: {},
            label: {},
            button: [],
                dictionary: {}
        };
    }
    /**
     * parse the declaration dom to construct a prepared dom for the enhancement process.
     * @private
     */
    function prepare() {
        if(this.$component.prop('tagName')!=='FORM') {
            this.$component = this.$('form');
        }

        var $inputs = this.$('input');

        _.each($inputs, function (element, index) {
            var $input = $(element);
            var inputbox = new Inputbox({
                el: $input
            });

            inputbox.render({enhance: false});

            var name = inputbox.name();

            this.cache.inputbox[inputbox.name()] = inputbox;

            if(!this.constraints[name]) {
                this.constraints[name] = inputbox.constraints();
            }

            this.cache.dictionary[name] = inputbox.placeholder();

        }, this);

        var $labels = this.$('label');
        _.each($labels, function(element, index) {
            var $label = $(element);
            var label = new Label({
                el: $label
            });
            label.render({enhance: false});

            var name = label.name();
            this.cache.label[name] = label;
            this.cache.dictionary[name] = label.text();
        }, this);

        var $buttons = this.$('button');
        _.each($buttons, function(element, index) {
            var $button = $(element);
            var button = new Button({
                el: $button
            });
            button.render({enhance: false});

            this.listenTo(button, 'execute', _.bind(this.onButtonExecute, this));
            this.cache.button.push(button);
        }, this);


        this.$('legend').mixStyle('legend');
    }

    function ready() {
        var $legends = this.$('legend');

        //calibrator.calibrate($legends, ['font-size', 'font-weight']);
    }

    function values(item) {
        if(item===undefined) {
            return this.getValues();
        } else {
            return this.setValues(item);
        }
    }

    function reset() {
        this.el.reset();
    }

    function getValues() {
        var values = {};
        var $inputs = this.$("input");
        $inputs.each(function(index, element) {
            var $input = $(element);
            var name = $input.prop('name');
            var type = $input.attr("type");
            var value = converter.convert($input.val(), type);

            values[name] = value;
        });

        return values;
    }

    function setValues(item) {
        var $inputs = this.$("input");
        $inputs.each(function(index, element) {
            var $input = $(element);
            var name = $input.prop('name');
            var type = $input.attr("type");
            var value = converter.convert(item[name], type);

            if(type.toLowerCase()==="date" && value instanceof Date) {
                if(uweaver.browser.input.type.date) {
                    value = string.format(value, "yy-mm-dd");
                } else {
                    value = string.format(value);
                }
            }

            $input.val(value);
        });
    }

    function hint(tips, level) {
        level || (level=='info');
        var stylish = 'uw-textbox-' + level;
        _.each(tips, function(tip) {
            var selector = "input[name=" + tip.name + "]";
            var $input = this.$el.find(selector);
            $input.textinput( 'option', 'wrapperClass', stylish);
            $input.attr('title', tip.message);
            $input.on('keypress', function() {
                $(this).textinput( 'option', 'wrapperClass', '');
                $input.attr('title', '');
            });
        }, this);
    }

    function warn(warnings) {
        this.hint(warnings, 'warn');
    }

    function info(information) {
        this.hint(information, 'info');
    }

    function disable(name) {
        if(!name) {
            this.$(':input:not(:disabled)').prop('disabled',true);
            return;
        }
        this.$('input[name=' + name + ']').prop('disabled', true);
    }

    function enable(name) {
        if(!name) {
            this.$(':input:disabled').prop('disabled',false);
            return;
        }
        this.$('input[name=' + name + ']').prop('disabled', false);

    }

    function validate(options) {
        options || (options = {});
        var defaults = {
            prompt: true,
            hint: true
        };

        _.defaults(options, defaults);

        var violations = validator.validate(this.getValues(), this.constraints);

        var dictionary = this.cache.dictionary;
        _.each(violations, function(violation, index) {
            var name = violation.name;
            var label = (_.has(dictionary, name)) ? dictionary[name] : name;
            violation.label = label;
        }, this);

        this.validationError = violations;

        var passed = (this.validationError.length===0);
        if(!passed) {
            if(options.hint) this.warn(violations);
            if(options.prompt) prompt.warn(compose(violations));
        }

        return passed;
    }


    function label(name) {
        var widget = _.find(this.cache.label, function(widget) {
            if(widget.name()===name) {
                return widget;
            }
        });
        return widget;
    }

    function inputbox(name) {
        var widget = _.find(this.cache.inputbox, function(widget) {
            if(widget.name()===name) {
                return widget;
            }
        });
        return widget;
    }

    function button(name) {
        var widget = _.find(this.cache.button, function(widget) {
            if(widget.name()===name) {
                return widget;
            }
        });
        return widget;
    }

    function buttons(criteria) {
        var widgets = _.filter(this.cache.button, function (widget) {
            if(widget.name()===criteria.name || widget.value()===criteria.value.toUpperCase()) {
                return button;
            }
        });
        return widgets;
    }

    function compose(violations) {
        var message = "";
        _.each(violations, function(violation, index){
            message = message + violation.label + ": " + violation.message + "<br/>";
        });
        return message;
    }

    return Form;
});
