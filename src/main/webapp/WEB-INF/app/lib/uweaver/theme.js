/**
 * Created with IntelliJ IDEA.
 * User: jasonlin
 * Date: 10/1/13
 * Time: 5:45 AM
 * To change this template use File | Settings | File Templates.
 */

define([
    'underscore', 'jquery'
], function(_, $) {

    var BACKGROUNDS = ["uw-background-blue", "uw-background-yellow", "uw-background-red", "uw-background-green",
        "uw-background-orange", "uw-background-cyan", "uw-background-purple", "uw-background-pink", "uw-background-gray"];
    var FILLS = ["uw-fill-blue", "uw-fill-yellow", "uw-fill-red", "uw-fill-green", "uw-fill-orange", "uw-fill-cyan",
        "uw-fill-purple", "uw-fill-pink", "uw-fill-gray"];
    var LINES = ["uw-line-blue", "uw-line-yellow", "uw-line-red", "uw-line-green", "uw-line-orange", "uw-line-cyan",
        "uw-line-purple", "uw-line-pink", "uw-line-gray"];

    var _isLoaded = false;

    var _props = {};

    initialize();

    function initialize() {
        load();
    }

    function backgrounds() {
        return this.get('backgrounds');
    }

    function background(index) {
        (index===undefined) && (index=0);

        var backgrounds = this.backgrounds();

        index = index % backgrounds.length;

        return backgrounds[index];
    }

    function fills() {
        return this.get('fills');
    }

    function fill(index) {
        (index===undefined) && (index=0);

        var fills = this.fills();

        index = index % fills.length;

        return fills[index];
    }

    function lines() {
        return this.get('lines');
    }

    function line(index) {
        (index===undefined) && (index=0);

        var lines = this.lines();

        index = index % lines.length;

        return lines[index];
    }

    function get(name, defaultValue) {
        return _props[name] || defaultValue;
    }

    function set(name, value) {
        _props[name] = value;
    }

    function setDefault(name, value) {
        if(!_props[name]) _props[name] = value;
    }

    function isLoaded() {
        return _isLoaded;
    }


    function load(/*String*/ url) {

        url || (url = 'conf/theme.properties');

        var payload = {};
        payload.items = [];

        var dto = JSON.stringify(payload);

        var result = $.ajax(url, {
            headers: {
                "Content-Type": 'application/json; charset=UTF-8',
                "Accept": 'application/json'
            },
            dataType: 'json',
            data: dto,
            async: false
        }).then(
            function(response) {
                var payload = response;

                _props = payload;

                _props['backgrounds'] || (_props['backgrounds'] = BACKGROUNDS);
                _props['fills'] || (_props['backgrounds'] = FILLS);
                _props['lines'] || (_props['backgrounds'] = LINES);

                _isLoaded = true;
            },
            function(error) {
            }
        );

        return result;
    }

    return {
        load: load,
        isLoaded: isLoaded,
        get: get,
        set: set,
        backgrounds: backgrounds,
        fills: fills,
        lines: lines,
        background: background,
        fill: fill,
        line: line
    };

});
