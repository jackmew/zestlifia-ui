/**
 * Created by jasonlin on 8/21/14.
 */
define(['uweaver/lang', 'modernizr'], function (lang, modernizr) {

    var Browser = {
        input: {
            type: {}
        }
    };

    initialize();

    function initialize() {
        _.extend(Browser.input, modernizr.input);
        _.extend(Browser.input.type, modernizr.inputtypes);
    }

    return Browser;

});