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
 * The datetime module provides a collection of utility methods for manipulating dates and allows you to choosing
 * user-defined patterns for date-time formatting.
 *
 * Date and time formats are specified by date and time pattern strings. The pattern strings are designed to
 * conform to java.text.SimpleDateFormat.
 *
 * ##### Usage
 *     var defaultDatetimeString = "2010-03-04 05:06:07";
 *     var isoDatetimeString = "2010-03-04T05:06:07.008+0800";
 *     var simpleDateString = "2010-03-04";
 *     var userDateString = "2010/3/4";
 *     var userDatetimeString = "2010/03/04 05:06:07";
 *     var simpleDatePattern = 'yyyy-MM-dd';
 *     var isoDatetimePattern = "yyyy-MM-ddTHH:mm:ss.SSSZ";
 *     var userDatePattern = 'yyyy/M/d';
 *     var userDatetimePattern = 'yyyy/MM/dd HH:mm:ss';
 *     var isoTime= new Date(new Date(Date.UTC(2010, 2, 4, 5, 6, 7, 8)).getTime() - 8 * 3600000);
 *     var date = new Date(2010, 2, 4);
 *     var time = new Date(2010, 2, 4, 5, 6, 7);
 *
 *     expect(datetime.parse(defaultDatetimeString)).to.equalTime(time);
 *     expect(datetime.parse(isoDatetimeString, isoDatetimePattern)).to.equalTime(isoTime);
 *     expect(datetime.parse(simpleDateString, simpleDatePattern)).to.equalTime(date);
 *     expect(datetime.parse(userDateString, userDatePattern)).to.equalTime(date);
 *     expect(datetime.parse(userDatetimeString, userDatetimePattern)).to.equalTime(time);
 *
 *     expect(datetime.format(isoTime)).to.equal(defaultDatetimeString);
 *     expect(datetime.format(isoTime, isoDatetimePattern)).to.equal(isoDatetimeString);
 *     expect(datetime.format(isoTime, simpleDatePattern)).to.equal(simpleDateString);
 *     expect(datetime.format(isoTime, userDatePattern)).to.equal(userDateString);
 *     expect(datetime.format(isoTime, userDatetimePattern)).to.equal(userDatetimeString);
 *
 *     expect(datetime.convert(defaultDatetimeString)).to.equalTime(time);
 *     expect(datetime.convert(isoDatetimeString, isoDatetimePattern)).to.equalTime(isoTime);
 *     expect(datetime.convert(isoTime.getTime())).to.equalTime(isoTime);
 *     expect(datetime.convert(simpleDateString, simpleDatePattern)).to.equalTime(date);
 *     expect(datetime.convert(userDateString, userDatePattern)).to.equalTime(date);
 *     expect(datetime.convert(userDatetimeString, userDatetimePattern)).to.equalTime(time);
 *     expect(datetime.convert(time.getTime())).to.equalTime(time);
 *
 *     expect(datetime.test(defaultDatetimeString)).to.be.true;
 *     expect(datetime.test(isoDatetimeString, isoDatetimePattern)).to.be.true;
 *     expect(datetime.test(simpleDateString, simpleDatePattern)).to.be.true;
 *     expect(datetime.test(userDateString, userDatePattern)).to.be.true;
 *     expect(datetime.test(userDatetimeString, userDatetimePattern)).to.be.true;
 *     expect(datetime.test(userDatetimeString)).to.be.false;
 *
 *
 * @module datetime
 * @author  Jason Lin
 * @since   1.0
 */
define(['underscore', 'uweaver/string', 'uweaver/environment', 'uweaver/exception/InvalidFormatException',
    'uweaver/exception/UnsupportedTypeException'], function(_, string, environment, InvalidFormatException, UnsupportedTypeException) {
    var DATETIMEPATTERN;

    var MASKS = {
        y: {
            reg: new RegExp('[y]{4}', 'i'),
            expr: '[0-9]{4}'
        },
        M: {
            reg: new RegExp('[M]{1,2}'),
            expr: '[0-9]{1,2}'
        },
        d: {
            reg: new RegExp('[d]{1,2}'),
            expr: '[0-9]{1,2}'
        },
        H: {
            reg: new RegExp('[H]{1,2}'),
            expr: '[0-9]{1,2}'
        },
        m: {
            reg: new RegExp('[m]{1,2}'),
            expr: '[0-9]{1,2}'
        },
        s: {
            reg: new RegExp('[s]{1,2}'),
            expr: '[0-9]{1,2}'
        },
        S: {
            reg: new RegExp('\\.[S]{3}'),
            expr: '\\.[0-9]{1,3}'
        },
        Z: {
            reg: new RegExp('Z'),
            expr: '.[0-9]{4}'
        }
    };

    initialize();

    function initialize() {
        DATETIMEPATTERN = environment.datetimePattern();
    }

    /**
     * Convert text to Date.
     *
     * @memberof module:datetime
     * @param {String} text - the text to convert.
     * @param {String} [pattern=environment.datetimePattern()] - specify a date pattern to parse the text.
     * @returns {Date}
     */
    function parse(text, pattern) {
        if(!_.isString(text)) {
            throw new UnsupportedTypeException({
                type: typeof text,
                supportedTypes: ['String']
            });
        }

        pattern || (pattern = DATETIMEPATTERN);

        if(!test(text, pattern)) {
            throw new InvalidFormatException({
                entity: text,
                format: pattern
            });
        }

        var time;
        var year = 0, month = 0, date = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
        var timezone;

        try {
            year = parseInt(parseValue(text, pattern, 'y'));
            month = parseInt(parseValue(text, pattern, 'M'));
            date = parseInt(parseValue(text, pattern, 'd'));
            pattern.indexOf('H')>0 && (hours = parseInt(parseValue(text, pattern, 'H')));
            pattern.indexOf('m')>0 && (minutes = parseInt(parseValue(text, pattern, 'm')));
            pattern.indexOf('s')>0 && (seconds = parseInt(parseValue(text, pattern, 's')));
            pattern.indexOf('S')>0 && (milliseconds = parseInt(parseValue(text, pattern, 'S').substr(1)));
            pattern.indexOf('Z')>0 && (timezone = parseValue(text, pattern, 'Z'));
        } catch (err) {
            throw new InvalidFormatException({
                entity: text,
                format: pattern,
                cause: err
            });
        }

        if(timezone) {
            var sign = timezone.substr(0, 1);
            var hoursOffset = parseInt(timezone.substr(1, 2));
            var minutesOffset = parseInt(timezone.substr(3, 2));
            var offset = (hoursOffset * 60 + minutesOffset) * 60000;

            time = new Date(Date.UTC(year, month-1, date, hours, minutes, seconds, milliseconds));

            time = (sign==='+') ? new Date(time.getTime() - offset) : new Date(time.getTime() + offset);

        } else {
            time = new Date(year, month-1, date, hours, minutes, seconds, milliseconds);
        }

        return time;
    }

    function parseValue(text, pattern, name) {
        pattern = '^' + pattern + '$';
        var letters = MASKS[name].reg.exec(pattern);

        var tokens = pattern.split(letters);
        var exprBefore = tokens[0];
        var exprAfter = tokens[1];

        _.each(MASKS, function(mask, key) {
            if (key===name) return;
            exprBefore = exprBefore.replace(mask.reg, mask.expr);
            exprAfter = exprAfter.replace(mask.reg, mask.expr);
        });

        return text.replace(new RegExp(exprBefore), '').replace(new RegExp(exprAfter), '');
    }

    /**
     * Format Date to text.
     *
     * @memberof module:datetime
     * @param {Date} value - the date to format.
     * @param {String} [pattern=environment.datetimePattern()] - specify a date pattern to format the value.
     * @returns {String}
     */
    function format(value, pattern) {
        if(!_.isDate(value)) {
            throw new UnsupportedTypeException({
                type: typeof value,
                supportedTypes: ['Date']
            });
        }

        pattern || (pattern = DATETIMEPATTERN);

        var template = pattern;

        var values = {
            y: value.getFullYear(),
            M: value.getMonth()+1,
            d: value.getDate(),
            H: value.getHours(),
            m: value.getMinutes(),
            s: value.getSeconds(),
            S: value.getMilliseconds(),
            Z: ''
        };

        var letters;
        if(values.M<10) {
            letters = MASKS.M.reg.exec(pattern);
            (letters) && letters[0].length>=2 && (values.M = '0' + values.M);
        }
        if(values.d<10) {
            letters = MASKS.d.reg.exec(pattern);
            (letters) && letters[0].length>=2 && (values.d = '0' + values.d);
        }
        if(values.H<10) {
            letters = MASKS.H.reg.exec(pattern);
            (letters) && letters[0].length>=2 && (values.H = '0' + values.H);
        }
        if(values.m<10) {
            letters = MASKS.m.reg.exec(pattern);
            (letters) && letters[0].length>=2 && (values.m = '0' + values.m);
        }
        if(values.s<10) {
            letters = MASKS.s.reg.exec(pattern);
            (letters) && letters[0].length>=2 && (values.s = '0' + values.s);
        }
        if(values.S<100) {
            letters = MASKS.S.reg.exec(pattern);
            if(letters) {
                for(var i=values.S.toString().length+1; i<=letters[0].length-1; i++) {
                    values.
                        S = '0' + values.S;
                }
                values.S = '.' + values.S;
            }
        }

        var offset = new Date().getTimezoneOffset();
        values.Z = (offset>0) ? '-' : '+';
        offset = Math.abs(offset);
        var hoursOffset = Math.floor(offset/60);
        var minutesOffset = offset - hoursOffset * 60;
        if(hoursOffset<10) hoursOffset = '0' + hoursOffset;
        if(minutesOffset<10) minutesOffset = '0' + minutesOffset;
        values.Z = values.Z + hoursOffset + minutesOffset;

        _.each(MASKS, function(mask, key) {
            template = template.replace(mask.reg, '${' + key + '}');
        });

        return string.substitute(template, values);
    }

    /**
     * Convert a value to Date
     *
     * @memberof module:datetime
     * @param {String|Number|Date} value - the value to convert.
     * @param {String} [pattern=environment.datetimePattern()] - specify a date pattern to parse the text.
     * @returns {Date}
     */
    function convert(value, pattern) {
        if(value===undefined||value===null) return value;
        if(_.isDate(value)) {
            return value;
        } else if(_.isNumber(value)) {
            return new Date(value);
        } else if(_.isString(value)) {
            if(value.length===0) return null;
            return parse(value, pattern);
        } else {
            throw new UnsupportedTypeException({
                type: typeof value,
                supportedTypes: ["String", "Number", "Date"]
            });
        }
    }

    /**
     * Test if text is a Date.
     *
     * @memberof module:datetime
     * @param {String} text - the text to check.
     * @param {String} [pattern=environment.datetimePattern()] - specify a date pattern to check the text.
     * @returns {Boolean}
     */
    function test(text, pattern) {
        if(!_.isString(text)) {
            throw new UnsupportedTypeException({
                type: typeof text,
                supportedTypes: ['String']
            });
        }

        pattern || (pattern = DATETIMEPATTERN);

        var expr = '^' + pattern + '$';

        _.each(MASKS, function(mask) {
            expr = expr.replace(mask.reg, mask.expr);
        });

        return new RegExp(expr).test(text);
    }

    return {
        parse: parse,
        format: format,
        convert: convert,
        test: test
    };
});