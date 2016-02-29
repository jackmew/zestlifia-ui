/**
 * Created by jasonlin on 6/17/14.
 */
define(['underscore'], function(_){
    var string = {
        substitute: substitute
    };

    function substitute(/*String*/ template, /*Object||Array*/ values) {
        if(!template || !template instanceof String) return template;

        if(!(_.isObject(values)|| _.isArray(values))) {
            var pattern = new RegExp("\\$\\{0\\}","g");
            template = template.replace(pattern, values);
            return template;
        }

        _.each(values, function(value, key) {
           var pattern = new RegExp("\\$\\{" + key + "\\}","g");
           var args =  (_.isObject(value)) ? JSON.stringify(value) : value;
            template = template.replace(pattern, args);
        });

        return template;
    }

    return string;
});