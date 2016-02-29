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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, eith
er express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(['underscore', 'jquery', 'uweaver/lang',
    'uweaver/widget/Widget'], function (_, $, lang, Widget) {

    var declare = lang.declare;

    var Base = Widget;

    /**
     * **Container**
     * This class represents a container.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     *
     * @constructor Container
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the container.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var defaults = {};
        var cfg = this._cfg;

        _.defaults(cfg, defaults);

        this._anchors = {
            $content: undefined
        }
    }

    /**
     * @override
     */
    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var anchors = this._anchors;
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        var $content = this.$anchor('content');
        ($content.length===0) && ($content = this.$el);
        anchors.$content = $content;

        cfg.content && this.content(cfg.content);

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

    function clear() {
        var $content = this._anchors.$content;
        $content.html("");
    }

    function content(node) {
        var $content = this._anchors.$content;

        this.clear();
        if(node instanceof Widget) {
            node.attach($content);
        } else if(node instanceof jQuery) {
            $content.append(node);
        } else if(typeof(node)==='string') {
            $content.html(node);
        }
    }

    function append(node) {
        var $content = this._anchors.$content;

        if(node instanceof Widget) {
            node.attach($content);
        } else if(node instanceof jQuery) {
            $content.append(node);
        } else if(typeof(node)==='string') {
            $content.append(node);
        }
    }

    var props = {};

    var Container = declare(Base, {
        initialize: initialize,
        render: render,
        content: content,
        append: append,
        clear: clear
    }, props);

    return Container;
});