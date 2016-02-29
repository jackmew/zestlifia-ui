/**
 * Created by jasonlin on 8/28/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget',
    'uweaver/identifier', 'uweaver/converter', 'uweaver/string', 'uweaver/calibrator', 'i18n!',
    'uweaver/Logger'], function(_, $, lang, Widget, identifier, converter, string, calibrator, i18n, Logger) {

    var declare = lang.declare;

    var Label = declare(Widget, {
        logger: new Logger("Label"),

        stylish: 'label',

        prepare: prepare,
        ready: ready,

        translate: translate,

        name: name,
        text: text

    });

    function prepare() {
        this.parent.prototype.prepare.apply(this, arguments);

        var $component = this.$component;

        $component.attr('name') || ($component.attr('name', '#' + identifier.uniqueId()));

        this.translate();
    }

    function ready() {
        var $label = this.$component;

        if(this.calibration) calibrator.calibrate($label, ['font-size', 'font-weight', 'text-align']);
    }

    function name() {
        var $label = this.$component;
        return $label.attr('name');
    }

    function text(words) {
        var $label = this.$component;
        if(!words) return $label.text;

        $label.text(words);
    }


    function translate() {
        var $label = this.$component;

        $label.text(i18n.translate($label.text()));
    }

    return Label;

});