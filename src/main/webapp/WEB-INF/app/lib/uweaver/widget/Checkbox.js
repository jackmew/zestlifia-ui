/**
 * Created by jasonlin on 7/4/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget',
    'uweaver/converter', 'uweaver/string', 'uweaver/calibrator',
    'uweaver/Logger'], function(_, $, lang, Widget, converter, string, calibrator, Logger) {

    var declare = lang.declare;

    var Checkbox = declare(Widget, {
        logger: new Logger("Checkbox"),

        readyEvent: 'checkboxradiocreate',

        name: name,
        type: type,
        constraints: constraints,

        prepare: prepare,
        ready: ready,

        value: value,
        getValue: getValue,
        setValue: setValue
    });

    /**
     * parse the declaration dom to construct a prepared dom for the enhancement process.
     * @private
     */
    function prepare() {
        if(this.$component.prop('tagName')!=='INPUT') {
            this.$component = this.$('input');
        }

        var $input = this.$component;

        if(!uweaver.browser.input.type.date) {
            $input.attr('data-role', 'date');
            $input.attr('data-inline', false);
            $input.addClass("date-input");
        }

        if(!$input.prop('style').cssText) {
            $input.css('cssText', uweaver.config().css.inputbox);
        }
    }

    function ready() {
        var $input = this.$component;

        calibrator.calibrate($input, ['font-size', 'font-weight', 'text-align']);
    }

    function constraints() {
        var $input = this.$component;
        var constraints = this.type();

        if($input.attr('data-uw-constraints')) {
            constraints = " " + $input.attr('data-uw-constraints');
        }

        return constraints;
    }

    function type() {
        var $input = this.$component;
        return $input.attr('type');
    }

    function name() {
        var $input = this.$component;
        return $input.attr('name');
    }

    function value(value) {
        if(value===undefined) {
            return this.getValue();
        } else {
            return this.setValue(value);
        }
    }

    function getValue() {
        var $input = this.$component;
        var type = this.type();
        var value = converter.convert($input.val(), type);

        return value;
    }

    function setValue(value) {
        var $input = this.$component;
        var type = this.type();
        value = converter.convert(value, type);

        if(type.toLowerCase()==="date" && value instanceof Date) {
            if(uweaver.browser.input.type.date) {
                value = string.format(value, "yy-mm-dd");
            } else {
                value = string.format(value);
            }
        }

        $input.val(value);
    }

    return Checkbox;

});