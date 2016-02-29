/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2016 Jason Lin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The number module provides a collection of utility methods for manipulating numbers and allows you to choosing
 * user-defined patterns for number formatting.
 *
 * Number formats are specified by number pattern strings. The pattern strings are designed to
 * conform to java.text.DecimalFormat.
 *
 * ##### Usage
 *     var decimal = 123.78;
 *     var kDecimal = 123456.789;
 *     var decimalString = "123.78";
 *     var kDecimalString = "123,456.789";
 *     var userDecimalString = "123.780";
 *     var kUserDecimalString = "123456.789";
 *     var currencyString = "$123.78";
 *     var kCurrencyString = "$123,456.789";
 *     var roundingString = "123.78";
 *     var kRoundingString = "123456.79";
 *     var decimalPattern = "###,##0.###";
 *     var userDecimalPattern = "###.000";
 *     var currencyPattern = "$###,##0.###";
 *     var roundingPattern = "##0.##";
 *
 *     expect(number.parse(decimalString, decimalPattern)).to.equal(decimal);
 *     expect(number.parse(kDecimalString, decimalPattern)).to.equal(kDecimal);
 *     expect(number.parse(userDecimalString, userDecimalPattern)).to.equal(decimal);
 *     expect(number.parse(kUserDecimalString, userDecimalPattern)).to.equal(kDecimal);
 *     expect(number.parse(currencyString, currencyPattern)).to.equal(decimal);
 *     expect(number.parse(kCurrencyString, currencyPattern)).to.equal(kDecimal);
 *
 *     expect(number.format(decimal, decimalPattern)).to.equal(decimalString);
 *     expect(number.format(kDecimal, decimalPattern)).to.equal(kDecimalString);
 *     expect(number.format(decimal, roundingPattern)).to.equal(roundingString);
 *     expect(number.format(kDecimal, roundingPattern)).to.equal(kRoundingString);
 *     expect(number.format(decimal, userDecimalPattern)).to.equal(userDecimalString);
 *     expect(number.format(kDecimal, userDecimalPattern)).to.equal(kUserDecimalString);
 *     expect(number.format(decimal, currencyPattern)).to.equal(currencyString);
 *     expect(number.format(kDecimal, currencyPattern)).to.equal(kCurrencyString);
 *
 *     expect(number.convert(decimalString)).to.equal(decimal);
 *     expect(number.convert(decimalString, decimalPattern)).to.equal(decimal);
 *     expect(number.convert(kDecimalString, decimalPattern)).to.equal(kDecimal);
 *     expect(number.convert(userDecimalString, userDecimalPattern)).to.equal(decimal);
 *     expect(number.convert(kUserDecimalString, userDecimalPattern)).to.equal(kDecimal);
 *     expect(number.convert(currencyString, currencyPattern)).to.equal(decimal);
 *     expect(number.convert(kCurrencyString, currencyPattern)).to.equal(kDecimal);
 *
 *     expect(number.test(decimalString, decimalPattern)).to.equal(1);
 *     expect(number.test(kDecimalString, decimalPattern)).to.equal(1);
 *     expect(number.test(userDecimalString, userDecimalPattern)).to.equal(1);
 *     expect(number.test(kUserDecimalString, userDecimalPattern)).to.equal(1);
 *     expect(number.test(currencyString, currencyPattern)).to.equal(1);
 *     expect(number.test(kCurrencyString, currencyPattern)).to.equal(1);
 *     expect(number.test(kCurrencyString, decimalPattern)).to.equal(0);
 *
 *
 * @module number
 * @author  Jason Lin
 * @since   1.0
 */
define(['underscore', 'uweaver/string', 'uweaver/environment', 'uweaver/exception/InvalidFormatException',
    'uweaver/exception/UnsupportedTypeException'], function(_, string, environment, InvalidFormatException, UnsupportedTypeException) {

    var NUMBERPATTERN;
    var DECIMALSEPARATOR, GROUPINGSEPARATOR, CURRENCYSIGN;

    initialize();

    function initialize() {
        NUMBERPATTERN = environment.numberPattern();
        DECIMALSEPARATOR = environment.decimalSeparator();
        GROUPINGSEPARATOR = environment.groupingSeparator();
        CURRENCYSIGN = environment.currencySign();
    }

    /**
     * Convert text to Number.
     *
     * @memberof module:number
     * @param {String} text - the text to convert.
     * @param {String} [pattern] - specify a number pattern to parse the text.
     * @param {Object} [options] - specify a set of symbols (such as the decimal separator, the grouping separator, and so on).
     * @param {String} [options.decimalSeparator=environment.decimalSeparator()] - decimal separator.
     * @param {String} [options.groupingSeparator=environment.groupingSeparator] - grouping separator.
     * @returns {Number}
     */
    function parse(text, pattern, options) {
        if(!_.isString(text)) {
            throw new UnsupportedTypeException({
                type: typeof text,
                supportedTypes: ["String"]
            });
        }

        var compliant = test(text, pattern, options);
        if(!compliant) {
            throw new InvalidFormatException({
                entity: text,
                format: pattern
            });
        }

        options || (options = {});

        var decimalSeparator = options.decimalSeparator || DECIMALSEPARATOR,
            groupingSeparator = options.groupingSeparator || GROUPINGSEPARATOR;

        var n = new Number(text.replace(groupingSeparator, '').replace(decimalSeparator, '.').replace(/[^0-9\.]/g, ''));

        if(compliant===2) n = n * -1;

        return n.valueOf();

    }


    /**
     * Format Number to text.
     *
     * @memberof module:number
     * @param {Number} value - the number to format.
     * @param {String} [pattern] - specify a date pattern to format the value.
     * @param {Object} [options] - specify a set of symbols (such as the decimal separator, the grouping separator, and so on).
     * @param {String} [options.decimalSeparator=environment.decimalSeparator()] - decimal separator.
     * @param {String} [options.groupingSeparator=environment.groupingSeparator] - grouping separator.
     * @returns {String}
     */
    function format(value, pattern, options) {
        if(!_.isNumber(value)) {
            throw new UnsupportedTypeException({
                type: typeof text,
                supportedTypes: ["Number"]
            });
        }

        pattern || (pattern = NUMBERPATTERN);

        options || (options = {});

        var decimalSeparator = options.decimalSeparator || DECIMALSEPARATOR,
            groupingSeparator = options.groupingSeparator || GROUPINGSEPARATOR;

        var patterns = pattern.split(';');
        var positive = patterns[0];
        var negative = (patterns.length>1) ? patterns[1] : '-' + positive;

        var scale = calScale(value, positive, decimalSeparator);
        var groupingSize = calGroupingSize(positive, groupingSeparator, decimalSeparator);

        var result = Math.abs(value).toFixed(scale);

        if(groupingSize > 0) {
            var expr = '(\\d)(?=(\\d{' + groupingSize + '})+\\' + decimalSeparator +')';
            var regExp = new RegExp(expr, 'g');
            result = result.replace(regExp, '$1' + groupingSeparator);
        }

        var template = (value >= 0) ? positive : negative;

        var patternRegExp = new RegExp(genPatternExpr(groupingSeparator, groupingSize, decimalSeparator, scale));

        return template.replace(patternRegExp, result);
    }


    function calGroupingSize(pattern, groupingSeparator, decimalSeparator) {
        if(pattern.indexOf(groupingSeparator)===-1) return 0;

        // calculate the number of #|0 between the decimal separator & the grouping separator.
        var expr = groupingSeparator + '[#0]+(?=\\' + decimalSeparator + ')';

        return new RegExp(expr).exec(pattern)[0].length - 1;
    }


    function calScale(value, pattern, decimalSeparator) {
        var text = value.toString();

        var scale = (pattern.indexOf(decimalSeparator)===-1) ? 0 : pattern.length - (pattern.indexOf(decimalSeparator) + 1);

        var current = (text.indexOf(decimalSeparator)===-1) ? 0 : text.length - (text.indexOf(decimalSeparator) + 1);

        if(scale < current) return scale;

        var index = pattern.lastIndexOf('0');
        if(index!==-1 && index>pattern.indexOf(decimalSeparator)) {
            scale = pattern.lastIndexOf('0') - pattern.indexOf(decimalSeparator);
        } else {
            scale = current;
        }

        return scale;
    }

    function parseZero(pattern, decimalSeparator) {
        var zero;
        var index = pattern.indexOf(decimalSeparator);

        if(index>0) {
            zero = pattern.charAt(index-1);
        } else if(index===0) {
            zero = '#';
        }

        if(!zero) {
            zero = /[#0]{1}[^0#]*$/.exec(pattern);
        }

        return zero;

    }


    /**
     * Convert a value to Number
     *
     * @memberof module:number
     * @param {String|Number} value - the value to convert.
     * @param {String} [pattern] - specify a number pattern to parse the text.
     * @param {Object} [options] - specify a set of symbols (such as the decimal separator, the grouping separator, and so on).
     * @param {String} [options.decimalSeparator=environment.decimalSeparator()] - decimal separator.
     * @param {String} [options.groupingSeparator=environment.groupingSeparator] - grouping separator.
     * @returns {Number}
     */
    function convert(value, pattern, options) {
        if(value===undefined||value===null) return value;
        if(_.isNumber(value)) {
            return value;
        } else if(_.isString(value)) {
            if(value.length===0) return null;
            return parse(value, pattern, options);
        } else {
            throw new UnsupportedTypeException({
                type: typeof value,
                supportedTypes: ["String", "Number"]
            });
        }
    }

    /**
     * Test if text is a Number.
     *
     * @memberof module:number
     * @param {String} text - the text to check.
     * @param {String} [pattern] - specify a number pattern to test the text.
     * @param {Object} [options] - specify a set of symbols (such as the decimal separator, the grouping separator, and so on).
     * @param {String} [options.decimalSeparator=environment.decimalSeparator()] - decimal separator.
     * @param {String} [options.groupingSeparator=environment.groupingSeparator] - grouping separator.
     * @returns {Integer} - 0 => not a number, 1 => positive number, 2 => negative number.
     */
    function test(text, pattern, options) {
        if(!_.isString(text)) {
            throw new UnsupportedTypeException({
                type: typeof text,
                supportedTypes: ['String']
            });
        }

        if(!/[^0-9\.]/.test(text)) {
            return 1;
        } else if(!/[^0-9\.\-]/.test(text)) {
            return 2;
        }

        pattern || (pattern = NUMBERPATTERN);

        options || (options = {});

        var decimalSeparator = options.decimalSeparator || DECIMALSEPARATOR,
            groupingSeparator = options.groupingSeparator || GROUPINGSEPARATOR;

        var patterns = pattern.split(';');
        var positive = patterns[0];
        var negative = (patterns.length>1) ? patterns[1] : '-' + positive;

        var scale = calScale(text, positive, decimalSeparator);
        var zero = parseZero(positive, decimalSeparator);
        var groupingSize = calGroupingSize(positive, groupingSeparator, decimalSeparator);

        var numberExpr = genNumberExpr(groupingSeparator, groupingSize, decimalSeparator, scale, zero);
        var patternRegExp = new RegExp(genPatternExpr(groupingSeparator, groupingSize, decimalSeparator, scale));

        var regExp = new RegExp(positive.replace('$', '\\$').replace(patternRegExp, numberExpr));
        var matches = regExp.exec(text);
        if(matches && matches[0]==text) return 1;

        regExp = new RegExp(negative.replace('$', '\\$').replace(patternRegExp, numberExpr));
        var matches = regExp.exec(text);
        if(matches && matches[0]==text) return 2;

        return 0;
    }

    function genNumberExpr(groupingSeparator, groupingSize, decimalSeparator, scale, zero) {
        var expr;

        var minWholdDigits = (zero==='0') ? 1 : 0;

        if(groupingSize>0) {
            expr = '([0-9]{' + minWholdDigits + ',' + (groupingSize - 1) + '})+(\\' + groupingSeparator + '[0-9]{3})*';
        } else {
            expr = '[0-9]{' + minWholdDigits + ',}';
        }

        if(scale>0) {
            expr = expr + '\\' + decimalSeparator + '([0-9]{' + scale + '})';
        }

        return expr;
    }

    function genPatternExpr(groupingSeparator, groupingSize, decimalSeparator, scale) {
        var expr;

        if(groupingSize>0) {
            expr = '[#0,]*\\' + groupingSeparator + '[#0]{' + groupingSize + '}';
        } else {
            expr = '[#0]*';
        }

        if(scale>0) {
            expr = expr + '\\' + decimalSeparator + '([#0]+)';
        }

        return expr;
    }

    return {
        parse: parse,
        format: format,
        convert: convert,
        test: test
    };
});