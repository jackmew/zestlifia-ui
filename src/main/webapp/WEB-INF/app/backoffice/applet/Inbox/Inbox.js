/**
 * This document is a part of the source code and related artifacts
 * for uWeaver, an open source application development framework for
 * Enterprise Application Software.
 *
 *      http://www.uweaver.org
 *
 * Copyright 2015 Jason Lin
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
define(['underscore', 'jquery', 'uweaver/applet/TDIApplet', 'uweaver/widget/Triggers', 'uweaver/widget/Popup',
    './gadget/Finder',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Finder,
                                 Logger) {

    var LOGGER = new Logger("applet/Inbox");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;

        this._anchors = {

        };

        this._title = i18n.translate("待簽核");
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };
        var cfg = this._cfg;

        options || (options = {});
        _.defaults(options, defaults);

        this.hide();

        var anchors = this._anchors;

        buildFinder.call(this);

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

    function buildFinder() {
        this.addClass('form-horizontal');
        this.once('attach', function() {

            this._finder = new Finder().render();
            this._finder.on('select', _.bind(onGridSelect, this));
            this.add(this._finder);

            LOGGER.debug("buildFinder done");

        }, this);
    }

    function onGridSelect(event) {
        var model = event.data;
        var activity = model.get('activity');
        LOGGER.debug("Inbox select Model - activity: ${0}", activity);

        var path ;
        var gadgetName ;
        var mode ;
        // all - 全部
        if(!_.isUndefined(activity)) {
            path = './applet/IssueApl/gadget/';

            if(activity === "組織專案團隊") {
                gadgetName = 'Editor';
                mode = 'INBOX_ORGANIZE'
            } else if(activity === "指定單位負責人") {
                gadgetName = 'Editor';
                mode = 'INBOX_SPECIFIC'
            } else if(activity === '初步原因分析'){
                gadgetName = 'Editor';
                mode = 'INBOX_ANALYZE'
            } else if(activity === '問題原因分析') {
                gadgetName = 'Editor';
                mode = 'INBOX_PROBLEMCAUSE'
            } else if(activity === '擬對策及廠內驗證') {
                gadgetName = 'Editor';
                mode = 'INBOX_STRATEGYVERIFY'
            } else if(activity === '效果驗證') {
                gadgetName = 'Editor';
                mode = 'INBOX_EFFECTVERIFY'
            } else if(activity === '客戶端驗證') {
                gadgetName = 'Editor';
                mode = 'INBOX_CLIENTVERIFY'
            } else if(activity === '送樣') {
                gadgetName = 'Editor';
                mode = 'INBOX_SENDSAMPLE'
            } else if(activity === '客戶端驗證結果') {
                gadgetName = 'Editor';
                mode = 'INBOX_CLIENT_VERIFYR_RESULT'
            } else if(activity === '品保檢閱廠內結案報告') {
                gadgetName = 'Editor';
                mode = 'INBOX_QUALITY_REPORT'
            } else if(activity === '業務檢閱廠內結案報告') {
                gadgetName = 'Editor';
                mode = 'INBOX_BUSINESS_REPORT';
            } else if(activity === '客戶端調查分析') {
                gadgetName = 'Editor';
                mode = 'INBOX_CLIENT_INVEST';
            } else if(activity === '技服檢閱廠外結案報告') {
                gadgetName = 'Editor';
                mode = 'INBOX_QUALITY_EXTERNAL_REPORT';
            }
        } else {
            // type == 驗退, 原料異常
            var type = model.get('type');
            var level = model.get('level');

            LOGGER.debug("Inbox select Model - type: ${0}", type);

            if(type === "驗退") {
                path = './applet/AbnMaterial/gadget/';
                gadgetName = "Editor";
                if(level === "2 品保IQC") {
                    mode = "INBOX_TWO";
                } else if(level === "3 品保SQE") {
                    mode = "INBOX_THREE";
                } else if(level === "4 資材專員") {
                    mode = "INBOX_FOUR";
                } else if(level === "5 資材主管") {
                    mode = "INBOX_FIVE";
                } else if(level === "6 品保SQE") {
                    mode = "INBOX_SIX";
                } else if(level === "7 品保主管") {
                    mode = "INBOX_SEVEN";
                } else if(level === "8 品保最高主管") {
                    mode = "INBOX_EIGHT";
                }
            } else if(type === "成品(特性)") {
                path = './applet/AbnEndProductFeature/gadget/';
                gadgetName = "Editor";
                if(level === "2 品保主管") {
                    mode = "INBOX_TWO";
                } else if(level === "3 處理單位主管") {
                    mode = "INBOX_THREE";
                } else if(level === "4 處理單位人員") {
                    mode = "INBOX_FOUR"
                } else if(level === "5 處理單位主管") {
                    mode = "INBOX_FIVE"
                } else if(level === "6 品保PQC") {
                    mode = "INBOX_SIX"
                } else if(level === "7 品保主管") {
                    mode = "INBOX_SEVEN"
                } else if(level === "8 品保最高主管") {
                    mode = "INBOX_EIGHT"
                }

            } else if(type === "委外半成品") {
                path = './applet/AbnOutSource/gadget/';
                gadgetName = "Editor";
                if(level === "2 品保FQC") {
                    mode = "INBOX_TWO";
                } else if(level === "3 品保主管") {
                    mode = "INBOX_THREE";
                } else if(level === "4 資材專員") {
                    mode = "INBOX_FOUR";
                } else if(level === "5 資材主管") {
                    mode = "INBOX_FIVE";
                } else if(level === "6 品保FQC") {
                    mode = "INBOX_SIX";
                } else if(level === "7 品保主管") {
                    mode = "INBOX_SEVEN";
                } else if(level === "8 品保最高主管") {
                    mode = "INBOX_EIGHT";
                }
            } else if(type === "sprocApl") {
                path = './applet/SprocApl/gadget/';
                gadgetName = "Editor";
                if(level === "2 品保覆核") {
                    mode = "INBOX_TWO";
                } else if(level === "3 會簽(主簽)") {
                    mode = "INBOX_THREE1"
                } else if(level === "3 會簽(通知)") {
                    mode = "INBOX_THREE2"
                } else if(level === "4 管理代表確認") {
                    mode = "INBOX_FOUR"
                }
            } else if(type === "sprocMateialApl") {
                path = './applet/SprocMaterialApl/gadget/';
                gadgetName = "Editor";
                if(level === "2 品保覆核") {
                    mode = "INBOX_TWO";
                } else if(level === "3 會簽(主簽)") {
                    mode = "INBOX_THREE1"
                } else if(level === "3 會簽(通知)") {
                    mode = "INBOX_THREE2"
                } else if(level === "4 管理代表確認") {
                    mode = "INBOX_FOUR"
                }
            }


        }


        var module = path + gadgetName ;

        //_.bind(addNewGadget, this, module);

        var context = this;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                mode: mode
            });

            gadget.render();
            context.add(gadget, {
                closable: true
            });
            gadget.on('send', _.bind(gadgetSend, context));
        });
    }
    // send後，關閉當下gadget，回到收件匣
    function gadgetSend(evt) {
        this.remove(evt.context);
        this.select(0);
    }
    function addNewGadget(module) {
        var context = this;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget().render();
            context.add(gadget);
        });
    }

    var props = {
        _anchors: undefined,
        _finder: undefined
    };


    var Inbox = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    return Inbox;
});