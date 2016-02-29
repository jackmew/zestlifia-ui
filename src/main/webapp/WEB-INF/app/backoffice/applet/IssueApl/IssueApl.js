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
define(['underscore', 'jquery', 'uweaver/data/Collection', 'uweaver/applet/TDIApplet',
    'uweaver/widget/Triggers', 'uweaver/widget/Popup', 'uweaver/widget/Grid', './gadget/Editor', './gadget/Draft',
    'text!./tpl/IssueApl.html', 'text!./tpl/Menu.html','text!./tpl/QualityCheckPopup.html',
    'uweaver/Logger'], function(_, $, Collection, Applet, Triggers, Popup, Grid, Editor, Draft,
                                tpl, tplMenu, tplQualityCheckPopup, Logger) {

    var LOGGER = new Logger("IssueApl");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = tpl;

        this._anchors = {

        };

        this._title = i18n.translate("客訴案件受理");
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

        buildMenu.call(this);

        if(this.render === render) {
            this._isRendered = true;

            this.trigger('rendered', {
                data: {},
                context: this,
                source: this
            });
            options.hidden || this.show();
        }

        return this;
    }
    function buildMenu() {
        var menu = new Triggers({
            tpl: tplMenu
        }).render();

        menu.on("trigger", _.bind(onCommandTrigger, this));

        this.menu(menu);
    }

    function create(no) {
        var title = undefined;
        var mode = undefined;
        if(!_.isUndefined(no)) {
            title = '草稿-'+no ;
            mode = Editor.MODE.DRAFT;
        }
        var editor = new Editor({
            title: title,
            mode: mode
        }).render();

        this.add(editor, {
            closable: true
        });
    }
    function open() {
        var draft = new Draft().render();

        this.add(draft, {
            closable: true
        });

        this.listenTo(draft, 'gridSelect', _.bind(function(evt){
            var no = evt.data.get('no');
            this.create(no);
        },this));
    }

    function check() {
        var popup = new QualityCheckPopup();
        popup.render();
        popup.show();
    }
    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case IssueApl.COMMAND.CREATE:
                this.create();
                break;
            case IssueApl.COMMAND.OPEN:
                this.open();
                break;
            case IssueApl.COMMAND.CHECK:
                this.check();
                break;
            default:
                break;
        }
    }


    var props = {
        _anchors: undefined
    };


    var IssueApl = declare(Base, {
        initialize: initialize,
        render: render,
        create: create,
        check: check,
        open: open,
    }, props);

    // Enumeration of build in commands
    IssueApl.COMMAND = {
        CREATE: 'CREATE',
        SAVE: 'SAVE',
        OPEN: 'OPEN',
        CHECK: 'CHECK',
        SEND: 'SEND',
        ERASE: 'ERASE',
        CLOSE: 'CLOSE'
    };

    var QualityCheckPopup = declare(Popup, {
        initialize: function(config) {
            Popup.prototype.initialize.apply(this, arguments);

            var cfg = this._cfg;
            cfg.tpl = tplQualityCheckPopup;
        },
        render: function(options) {
            Popup.prototype.render.apply(this, arguments);

            var defaults = {
                hidden: false
            };
            var cfg = this._cfg;

            options || (options = {});
            _.defaults(options, defaults);

            //this.hide();

            var anchors = this._anchors;

            var issues = new Collection();
            var items = [
                {customer: "富葵", issueDate: "2015/03/12", issueNo: "AA2015030012", status: "品保最高主管檢閱", activity: "品保最高主管檢閱", amount: 1210},
                {customer: "台郡", issueDate: "2015/05/27", issueNo: "AA2015050082", status: "擬定改善對策", activity: "擬定改善對策", amount: 350}];
            issues.add(items);

            var issuesGrid = new Grid({
                el: this.$anchor('issues'),
                data: issues,
                columns: [
                    {text: "客戶", dataIndex: "customer", style: {width: '50px'}},
                    {text: "客訴日期", dataIndex: "issueDate", style: {width: '80px'}},
                    {text: "客訴單號", dataIndex: "issueNo"},
                    {text: "客訴狀態", dataIndex: "status"},
                    {text: "目前關卡", dataIndex: "activity"},
                    {text: "客訴數量", dataIndex: "amount"}
                ],
                mode: Grid.MODE.SINGLE
            });

            issuesGrid.render();

            if(this.render === render) {
                this._isRendered = true;

                this.trigger('rendered', {
                    data: {},
                    context: this,
                    source: this
                });
                options.hidden || this.show();
            }

            return this;
        }
    }, {});



    return IssueApl;
});