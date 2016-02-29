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

define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Popup',
    'uweaver/widget/Widget'], function(_, $, lang, Popup, Widget) {
    var declare = lang.declare;
    var Base = Popup;

    /**
     * A Tooltips is a widget for entering value.
     *
     * ##### JavaScript
     *     var inputbox = new Inputbox({
     *         el: $('#inputbox')
     *     });
     *     inputbox.render();
     *
     *     inputbox.value(12);
     *
     *     expect(inputbox.value()).to.equal(12);
     *
     * ##### HTML
     *     <!-- the following dom are required.
     *     + input - the DOM element.
     *     -->
     *     <form name="form" class="container form-horizontal">
     *         <label class="control-label col-sm-1 gutter">Price</label>
     *         <div class="col-sm-3 gutter">
     *             <input name="price" type="number" class="form-control" placeholder="Unit Price">
     *         </div>
     *     </form>
     *
     * ##### Events:
     * + 'change' - [value()]{@link Inputbox#value}
     *
     * @constructor Inputbox
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - A map of configuration to pass to the constructor.
     * ##### Options:
     * + tpl:String - A html string to layout & construct the DOM element. Optional.
     * + name:String - A text string to specify the name. Required.
     * + value:String|Number|Date|Boolean - The value. Optional.
     * + type:String - A text string to specify the type of inputbox. Possible options: text, number, date, email & phone.
     * Optional.
     * + placeholder:String - A text string to specify the help info. Optional.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {
            background: 'uw-background-blue'
        };
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this.addClass(cfg.background);
        this.addClass('uw-border');
        this.addClass('uw-corner');
        this.addClass('uw-border-blue');
        this.css('padding', '3px');
        this.css('font-size', '12px');
        cfg.dismissable = true;
        cfg.modal = false;

        if(cfg.target instanceof Widget) {
            cfg.target.$el.on('mousemove', _.bind(onTargetMousemove, this));
            cfg.target.$el.on('mouseout', _.bind(onTargetMouseout, this));
        } else {
            cfg.target.on('mousemove', _.bind(onTargetMousemove, this));
            cfg.target.on('mouseout', _.bind(onTargetMouseout, this));
        }
    }

    function onTargetMousemove(event) {
        this.isVisible() || this.show({
            position: {
                left: event.clientX,
                top: event.clientY
            },
            target: event.target
        })
    }

    function onTargetMouseout() {
        this.isVisible() && this.hide();
    }

    var props = {};

    var Tooltips = declare(Base, {
        initialize: initialize
    }, props);

    return Tooltips;
});
