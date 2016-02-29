/**
 * Created by jasonlin on 7/3/14.
 */
define(['underscore', 'uweaver/string', 'uweaver/converter'], function(_, string, converter) {

    var i18n = uweaver.i18n;

    function validate(values, constraints) {
        var violations = [];
        _.each(values, function(value, key) {
            var constraint = constraints[key];

            if(!constraint) return;

            var rules = constraint.split(" ");
            _.each(rules, function(rule){
                var tokens = rule.split("(");
                var validator = tokens[0];
                var args = prepareArgs(value, tokens[1]);
                if(!this[validator]) return;
                if(!this[validator].apply(this, args)) {
                    var violation = {
                        name: key,
                        value: args[0],
                        rule: validator,
                        message: validator
                    };
                    var template = i18n.validation(validator);
                    if(template) {
                        args[0] = string.format(args[0]);
                        violation.message = string.substitute(template, args);
                    }
                    violations.push(violation);
                }
            }, this);
        }, this);

        return violations;

    }

    function prepareArgs(value, rule) {
        var args = [];
        args.push(value);

        if(!rule) return args;

        return args.concat(rule.replace(/()/, "").split(","));
    }

    /**
     * A validation rule
     * @param value
     * @returns {boolean}
     */
    function required(value) {
        return (value) ? true : false;
    }

    /**
     * A validation rule
     * @param value
     * @returns {boolean}
     */
    function alphaNumeric(value) {
        if(!value) return true;

        var pattern = /\W/;

        return !pattern.test(value);
    }

    /**
     * a validation rule
     * @param value
     * @returns {boolean}
     */
    function date(value) {
        if(!value) return true;
        return converter.isDate(value);
    }

    /**
     * a validation rule
     * @param value
     * @returns {boolean}
     */
    function email(value) {
        if(!value) return true;
        return (value.indexOf("@")!==-1)
    }

    return {
        validate: validate,
        required: required,
        alphaNumeric: alphaNumeric,
        date: date,
        email: email
    };
});