/**
 * Created by jasonlin on 8/20/14.
 */
define(['jquery', 'uweaver/_base/jquery-ui/datepicker'], function($) {

    var initialized = false;

    var dateFormat = undefined;

    initialize();

    function initialize() {

        if(initialized) return;

        var defaults = {
            dateFormat: "yy-mm-dd",
            ns: {}
        };

        var settings = _.extend({}, defaults);


        dateFormat = options.dateFormat;


        $.datepicker.setDefaults({
            dateFormat: dateFormat
        });

        $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );

        initialized = true;
    }

    function formatDate(value, format) {
        format || (format = dateFormat);


        return $.datepicker.formatDate(format, value);
    }

    return {
        formatDate: formatDate
    };
});