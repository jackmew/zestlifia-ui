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

define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/environment',
    'uweaver/widget/Widget',
    'uweaver/Logger'], function (_, $, lang, environment, Widget, Logger) {

    var declare = lang.declare;

    var Base = Widget;

    /**
     * **Window Manager**
     * A window manager controls the placement and appearance of windows in a graphical user interface.
     *
     * **Configs:**
     * - tpl(String): A html string to layout & construct the DOM.
     * - site(String): The site id.
     *
     * @constructor WindowManager
     * @extends Widget
     * @author  Jason Lin
     * @since   1.0
     * @param {Object} [config] - The configuration of the widget.
     */
    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        this._site = this.config.site;
        this._works = this.config.works;
    }

    /**
     * @override
     */
    function enhance() {
        Base.prototype.enhance.apply(this, arguments);
        $('body').append(this.$el);
    }

    /**
     * Return the site which the window manager connected to.
     *
     * @memberof WindowManager#
     * @returns {Site} The site.
     */
    function site() {
        return this._site;
    }

    var props = {
        LOGGER: new Logger("WindowManager"),
        _site: undefined,
        _works: undefined
    };

    var WindowManager = declare(Base, {
        initialize: initialize,
        site: site,
        enhance: enhance
    }, props);

    return WindowManager;
});