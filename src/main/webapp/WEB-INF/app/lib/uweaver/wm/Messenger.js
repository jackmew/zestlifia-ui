/**
 * Created by jasonlin on 9/23/14.
 */

define(['underscore', 'jquery',
    'uweaver/lang',
    'uweaver/widget/Widget',
    'text!./tpl/Messenger.html',
    'uweaver/Logger'], function (_, $, lang, Widget, tpl, Logger) {
    var declare = lang.declare;
    var Base = Widget;

    var Messenger = declare(Base, {
        /**
         * protected members
         */
        logger: new Logger("Messenger"),
        tpl: tpl

    });

    return Messenger;
});
