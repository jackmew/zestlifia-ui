/**
 * Created by jasonlin on 6/20/14.
 */
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Panel',
    'uweaver/Logger'], function (_, $, lang, Panel, Logger) {

    var declare = lang.declare;

    var Gadget = declare(Panel, {
        logger: new Logger("Gadget"),

        blocks: 0
    });

    return Gadget;
});