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
define(['underscore', 'jquery', 'uweaver/applet/Gadget', 'uweaver/widget/Triggers', 'uweaver/widget/Grid', 'uweaver/widget/Pagination',
    'uweaver/widget/TabPanel', 'uweaver/data/Collection',
    'text!../tpl/TabPanelInbox.html',
    'uweaver/Logger'], function(_, $, Gadget, Triggers, Grid, Pagination, TabPanel, Collection, tabPanelInboxTpl, Logger) {

    var LOGGER =  new Logger("Inbox/Finder");

    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Gadget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        cfg.tpl = undefined;

        this._anchors = {
            $tabPanelInbox: undefined,
            $gridInboxAll: undefined,
            $gridIssue: undefined,
            $gridAbn: undefined,
            $paginationAbn: undefined,
            $gridSpeProcure: undefined,
            $paginationSpeProcure: undefined
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

        buildTabPanelInbox.call(this);

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
    function buildTabPanelInbox() {

        this._tabPanelInbox = new TabPanel({
            tpl: tabPanelInboxTpl
        }).render();

        this._tabPanelInbox.attach(this.$el);

        LOGGER.debug("buildTabPanelInbox done");

        buildGridInboxAll.call(this);
        buildGridIssue.call(this);
        buildGridAbn.call(this);
        buildGridSpeProcure.call(this);
    }
    function buildGridInboxAll() {
        var anchors = this._anchors;
        anchors.$gridInboxAll = this._tabPanelInbox.$anchor("gridInboxAll");

        var issues = new Collection();
        var items = [];
        issues.add(items);

        this._gridInboxAll = new Grid({
            el: anchors.$gridInboxAll,
            data: issues,
            columns: [
                {text: "類別", dataIndex: "type"},
                {text: "單號", dataIndex: "no"},
                {text: "簽核截止日", dataIndex: "submitDate"},
                {text: "狀態", dataIndex: "status"},
                {text: "關卡", dataIndex: "activity"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();
    }
    function buildGridIssue() {
        var anchors = this._anchors;
        anchors.$gridInboxIssue = this._tabPanelInbox.$anchor("gridIssue");
        anchors.$paginationIssue = this._tabPanelInbox.$anchor("paginationIssue");

        var Issues = declare(Collection, {
            resource: 'inbox/issues'
        });

        var issues = new Issues();

        issues.fetch({async: false});

        var renderer = function(item) {
            var icon = item.get('icon');
            if(icon === 'back') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-backward i-info"></i>';
            } else if(icon === 'dueToday') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-warning"></i>';
            } else if(icon === 'overDue') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-danger"></i>';
            }
        };

        this._gridInboxIssue = new Grid({
            el: anchors.$gridInboxIssue,
            data: issues,
            columns: [
                {text: "", dataIndex: 'icon', style: {width: '20px'}, renderer: renderer},
                {text: '客訴單號', dataIndex: 'no'},
                {text: '客訴日期', dataIndex: 'issueDate'},
                {text: '客戶', dataIndex: 'customer'},
                {text: '簽核截止日', dataIndex: 'deadline'},
                {text: '關卡', dataIndex: 'activity'},
                {text: '前關卡動作', dataIndex: 'before'}
            ],
            mode: Grid.MODE.SINGLE
        });

        this._gridInboxIssue.render();

        this._gridInboxIssue.on('select', _.bind(onGridSelect, this));

        this._paginationIssue = new Pagination({
            data: issues,
            el: anchors.$paginationIssue
        }).render();
    }
    function buildGridAbn() {
        var anchors = this._anchors;
        anchors.$gridAbn = this._tabPanelInbox.$anchor("gridAbn");
        anchors.$paginationAbn = this._tabPanelInbox.$anchor("paginationAbn");

        var AbnApplys = declare(Collection, {
            resource: 'inbox/abnApplys'
        });

        var abnApplys = new AbnApplys();

        var renderer = function(item) {
            var icon = item.get('icon');
            if(icon === 'back') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-backward i-info"></i>';
            } else if(icon === 'dueToday') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-warning"></i>';
            } else if(icon === 'overDue') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-danger"></i>';
            }
        };

        abnApplys.fetch({async: false});
        this._gridAbn = new Grid({
            el: anchors.$gridAbn,
            data: abnApplys,
            columns: [
                {text: "", dataIndex: 'icon', style: {width: '20px'}, renderer: renderer},
                {text: "異常單號", dataIndex: "abnNo"},
                {text: "類別", dataIndex: "type"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "異常工作屬性", dataIndex: "abnWorkAttribute"},
                {text: "簽核截止日", dataIndex: "deadline"},
                {text: "關卡", dataIndex: "level"},
                {text: "前關卡動作", dataIndex: "beforeLevel"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        this._gridAbn.on('select', _.bind(onGridSelect, this));

        this._paginationAbn = new Pagination({
            data: abnApplys,
            el: anchors.$paginationAbn
        }).render();
    }
    function buildGridSpeProcure() {
        var anchors = this._anchors;
        anchors.$gridSpeProcure = this._tabPanelInbox.$anchor("gridSpeProcure");
        anchors.$paginationSpeProcure = this._tabPanelInbox.$anchor("paginationSpeProcure");

        var SpeProcures = declare(Collection, {
            resource: 'inbox/sprocApplys'
        });

        var speProcures = new SpeProcures();
        speProcures.fetch({async: false});

        var renderer = function(item) {
            var icon = item.get('icon');
            if(icon === 'back') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-backward i-info"></i>';
            } else if(icon === 'dueToday') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-warning"></i>';
            } else if(icon === 'overDue') {
                return '<i data-uw-params="' + item.id + '" class="fa fa-star i-danger"></i>';
            }
        };

        this._gridSpeProcure = new Grid({
            el: anchors.$gridSpeProcure,
            data: speProcures,
            columns: [
                {text: "", dataIndex: 'icon', style: {width: '20px'}, renderer: renderer},
                {text: "特採單號", dataIndex: "sprocNo"},
                {text: "開立地區", dataIndex: "createArea"},
                {text: "特採類別", dataIndex: "sprocType"},
                {text: "簽核截止日", dataIndex: "deadline"},
                {text: "關卡", dataIndex: "level"},
                {text: "前關卡動作", dataIndex: "beforeLevel"},
                {text: "類別", dataIndex: "type"}
            ],
            mode: Grid.MODE.SINGLE
        }).render();

        this._gridSpeProcure.on('select', _.bind(onGridSelect, this));

        this._paginationSpeProcure = new Pagination({
            data: speProcures,
            el: anchors.$paginationSpeProcure
        }).render();

        anchors.$gridSpeProcure.find('th:nth-child(8)').hide();
        anchors.$gridSpeProcure.find('td:nth-child(8)').hide();
    }
    function onGridSelect(evt) {
        var event = {
            context: this,
            source: evt.source,
            data: evt.data
        };

        this.trigger('select', event);
    }

    var props = {
        _anchors: undefined,
        _tabPanelInbox: undefined,
        _gridInboxAll: undefined,

        _gridIssue: undefined,
        _paginationIssue: undefined,

        _gridAbn: undefined,
        _paginationAbn: undefined,

        _gridSpeProcure: undefined,
        _paginationSpeProcure: undefined
    };


    var Finder = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    Finder.COMMAND = {
        OPEN: "OPEN"
    };

    return Finder;
});





















