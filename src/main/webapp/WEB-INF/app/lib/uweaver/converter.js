/**
 * Created by jasonlin on 8/20/14.
 */
define(['underscore', 'uweaver/datetime', 'uweaver/number'], function(_, datetime, number) {

    initialize();

    function initialize() {}

    function convert(value, type, pattern) {
        if(value===undefined||value===null) return value;
        var result;

        switch(type.toUpperCase()) {
            case "DATE":
            case "DATETIME":
                result = datetime.convert(value, pattern);
                break;
            case "NUMBER":
                result = number.convert(value, pattern);
                break;
            case "STRING":
                if(value instanceof Date) {
                    result = datetime.format(value, pattern);
                } else if(_.isNumber(value)) {
                    result = number.format(value, pattern);
                } else {
                    result = value.toString();
                }
                break;
            default:
                result = value;
        }

        return result;
    }

    function isDate(value, pattern) {
        return datetime.test(value, pattern);
    }

    function isNumber(text, pattern, options) {
        return number.test(text, pattern, options);
    }

    return {
        convert: convert,
        isDate: isDate,
        isNumber: isNumber
    };
});