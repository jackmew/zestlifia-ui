/**
 * Created by jackho on 2/2/16.
 *
 * Form. binding Model and Fields
 * 1. Form會記錄Fields -> complete
 * 2. Form決定是否trigger Fields event
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/data/Model', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'widget/Input', 'widget/Row',
    'uweaver/Logger'], function (_, $, lang, Collection, Model, Triggers, Widget, Input, Row,
                                 Logger) {

    var LOGGER = new Logger("widget/Form");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            model: new Model(), // {key: value}
            fieldMaps: new Model() // {field: field, name: 'name'}
            // key 跟 name 對應，用來實現data binding
        };
        var cfg = this._cfg ;
        _.defaults(cfg, defaults);

        this._anchors = {
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);


        if(this.render === render) {
            this._isRendered = true;

            this.trigger('render', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        return this;
    }
    /*
    *
    * */
    /**
     * attribute的意思是 model attribute
     * @param field - Input Select CRBox Textarea
     * @param attribute - record field
     */
    function addField(field, attribute) {
        var cfg = this._cfg;
        // model應該是被塞進來的，其實不會new，有new的情形(測試情形)，就給予model新的attribute。
        if(cfg.model.attributes.length !== 0) {
            cfg.model.set(attribute, '');
        }
        cfg.fieldMaps.set(attribute, field);
    }
    function getField(name) {
        var cfg = this._cfg ;
        return cfg.fieldMaps.get(name);
    }
    /*
    * return number of fields
    * */
    function size() {
        var cfg = this._cfg ;
        var attributes = cfg.fieldMaps.attributes;

        return _.size(attributes);
    }

    function setValues() {
        var cfg = this._cfg ;
        var fieldMaps = cfg.fieldMaps;
        var model = cfg.model ;

        _.each(fieldMaps, function(fieldMap) {
            var value = model.get(fieldMap.name);

            if(fieldMap.field._class === 'Input') {

            } else if(fieldMap.field._class === 'Select') {

            } else if(fieldMap.field._class === 'CRBox') {

            }
        })
    }

    var props = {
        _anchors: undefined,
        _class: 'Form'
    };

    var Form = declare(Base, {
        initialize: initialize,
        render: render,

        addField: addField,
        getField: getField,
        setValues: setValues,
        size: size

    }, props);


    return Form;
});