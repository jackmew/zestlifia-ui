/**
 * Created by jasonlin on 8/28/14.
 */
define(['underscore'], function (_) {

    function calibrate($nodes, items) {
        if(!calibration()) return;

        _.each($nodes, function(element) {
            var $node = $(element);
            var cssText = $node.prop('style').cssText;
            _.each(items, function(item) {
                if(item==='font-size') cssText = cssText + fontSize($node);
                else if(item==='font-weight') cssText = cssText + fontWeight($node);
                else if(item==='text-align') cssText = cssText + textAlign($node);

            });
            $node.css('cssText', cssText);
        });

    }

    function fontSize($node) {
        var fontSize = $node.css('font-size').replace("px", "");

        if(!fontSize) return ";";

        fontSize = fontSize * calibration()['font-size'];
        return ";font-size:" + fontSize + "px !important;";
    }

    function textAlign($node) {
        var textAlign = calibration()['text-align'];
        return ";text-align:" + textAlign + " !important;";
    }

    function fontWeight($node) {
        var cssText = "";
        var fontWeight = $node.css('font-weight');
        var fontSize = $node.css('font-size').replace("px", "");

        if(fontWeight==='bold' && fontSize < calibration()['font-weight']) {
            cssText = ";font-weight: normal !important;";
        }

        return cssText;
    }

    function calibration() {
        var i18n = uweaver.i18n;
        var lang = i18n.lang().substr(0, 2);
        return uweaver.config().calibration[lang];
    }

    return {
        calibrate: calibrate
    }
});