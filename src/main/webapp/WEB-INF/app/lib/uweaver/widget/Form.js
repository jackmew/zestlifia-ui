/**
 * @license
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2014 Jason Lin
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
define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget', 'uweaver/data/Model', 'uweaver/widget/Inputbox'], function (_, $, lang, Widget, Model, Inputbox) {
    var declare = lang.declare;
    var Base = Widget;


    /**
     * A Form is a container containing form controls, such as Inputbox, Selectbox, Listbox and so on.
     *
     * ##### JavaScript
     *
     *     var Product = declare(Model, {
     *          resource: 'products'
     *     });
     *
     *     var item = new Product({_id: "_rose"});
     *
     *     var form = new Form({
     *         el: $('#form'),
     *         data: item
     *     });
     *     form.render();
     *
     *     item.fetch({async: false});
     *     expect(form.value('price')).to.equal(item.get('price'));
     *
     *     form.value(5);
     *     expect(item.get('price')).to.equal(orm.value('price'));
     *
     *     item.set('price', 2.4);
     *     expect(form.value('price')).to.equal(item.get('price'));
     *
     * ##### HTML
     *     <!-- the following dom are required.
     *     + form - the DOM element.
     *     -->
     *     <form name="form" class="container form-horizontal">
     *         <label class="control-label col-sm-1 gutter">Name</label>
     *         <div class="col-sm-3 gutter">
     *             <input name="name" class="form-control" placeholder="Product Name">
     *         </div>
     *         <label class="control-label col-sm-1 gutter">Price</label>
     *         <div class="col-sm-3 gutter">
     *             <input name="price" type="number" class="form-control" placeholder="Unit Price">
     *         </div>
     *     </form>
     *
     * ##### Events:
     * + 'change' - [value()]{@link Form#value}, [values()]{@link Form#values}
     *
     * @constructor Form
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl:String - A html string to layout & construct the DOM element. Optional.
     * + data:Model - Thd data source. Optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {};

        this._controls = [];

        (cfg.data) ? this.data(cfg.data) : this.data(new Model());
    }


    /**
     * @override
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;
        var anchors = this._anchors;

        options || (options = {});
        _.defaults(options, defaults);

        clean.call(this);

        var controls = this._controls;

        var $inputboxes = this.$('input, textarea');
        _.each($inputboxes, function(element) {
            var $input = $(element);
            var inputbox = new Inputbox({
                el: $input
            }).render();
            this.listenTo(inputbox, 'change', _.bind(onControlChange, this));
            controls.push(inputbox);
        }, this);

        this.refresh();

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


    function onControlChange(event) {
        var control = event.context;

        this._data.set(control.name(), control.value());
    }


    /**
     * Get or set the data.
     *
     * ##### Events:
     * + 'transition' - triggered after a new model is bound. event.data => the data.
     *
     * @memberof Form#
     * @param {Model} item - the data.
     * @param {Object} [options] - A map of additional options to pass to the method.
     * ##### Options:
     * + silent(Boolean) - A false value will prevent the events from being triggered. Default = false.
     * @returns {Grid} this
     */
    function data(item, options) {
        if(!item) return this._data;

        options || (options = {});

        var defaults = {};

        _.defaults(options, defaults);

        if(this._data) this.stopListening(this._data);

        this._data = item;

        this.listenTo(this._data, "change", _.bind(onItemUpdate, this));

        this.isRendered() && this.refresh();

        (options.silent) || this.trigger('transition', {
            context: this,
            source: this,
            data: item
        });

        return this;
    }

    function onItemUpdate(event) {
        this.refresh();
    }

    function controls() {
        return this._controls;
    }

    function control(name) {
        var controls = this._controls;

        return _.find(controls, function(control) {
            return (control.name()===name)
        });

    }

    function refresh() {
        var controls = this._controls;
        _.each(controls, function (control) {
            control.value(this._data.get(control.name()), {silent: true});
        }, this);
    }
    /**
     * @override
     */
    function destroy() {
        clean.call(this);
        Base.prototype.destroy.apply(this, arguments);
    }


    function clean() {
        var controls = this._controls;
        var control;

        while(controls.length>0) {
            control = controls.shift();
            control.destroy();
        }
    }


    var props = {
        _controls: undefined,
        _data: undefined,
        /**
         * @override
         */
        className: 'form'
    };

    var Form = declare(Base, {
        initialize: initialize,
        render: render,
        destroy: destroy,
        refresh: refresh,
        data: data,
        controls: controls,
        control: control
    }, props);

    return Form

});