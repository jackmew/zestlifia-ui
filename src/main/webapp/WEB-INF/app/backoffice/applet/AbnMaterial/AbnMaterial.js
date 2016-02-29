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
    './gadget/Editor', './gadget/Draft',
    'text!./tpl/AbnMaterial.html', 'text!./tpl/Menu.html',
    'uweaver/Logger'], function(_, $, Applet, Triggers, Popup, Editor, Draft, tpl, tplMenu, Logger) {

    var LOGGER = new Logger("AbnMaterial");
    
    var declare = uweaver.lang.declare;
    var i18n = uweaver.i18n;
    var prompt = uweaver.prompt;

    var Base = Applet;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);

        var cfg = this._cfg;
        //cfg.tpl = tpl;

        this._title = i18n.translate("原料異常申請");
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
    function onGridDraftSelect(draftMode, evt) {
        var model = evt.data;
        var no = model.get('no');
        LOGGER.debug("Inbox select Model - no: ${0} - draft mode", no, draftMode);

        var path = './applet/AbnMaterial/gadget/';
        var gadgetName = "Editor";
        var module = path + gadgetName ;
        var mode = "DRAFT";
        var title ;
        switch(draftMode) {
            case Draft.MODE.REJECT:
                title = "驗退-"+no;
                break;
            case Draft.MODE.STORAGE:
                title = "倉退-"+no;
                break;
            case Draft.MODE.MATERIAL:
                title = "成品原料-"+no;
                break;
            case Draft.MODE.CASE:
                title = "接單-"+no;
                break;
            case Draft.MODE.CASENO:
                title = "接單不代料-"+no;
                break;

        }

        var context = this ;
        require([
            module
        ], function(Gadget) {
            var gadget = new Gadget({
                title: title,
                mode: mode
            }).render();
            context.add(gadget, {
                closable: true
            });
        });
    }
    function rejectCreate() {
        this._editor = new Editor({
            title: '驗退-申請',
            mode: Editor.MODE.NEW_REJECT
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }
    function rejectOpen() {
        this._draft = new Draft({
            title: '驗退-草稿',
            mode: Draft.MODE.REJECT
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this, Draft.MODE.REJECT));
    }

    function storageCreate() {
        this._editor = new Editor({
            title: '倉退-申請',
            mode: Editor.MODE.NEW_STORAGE
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }
    function storageOpen() {
        this._draft = new Draft({
            title: '倉退-草稿',
            mode: Draft.MODE.STORAGE
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this, Draft.MODE.STORAGE));
    }

    function materialCreate() {
        this._editor = new Editor({
            title: '成品原料-申請',
            mode: Editor.MODE.NEW_MATERIAL
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }
    function materialOpen() {
        this._draft = new Draft({
            title: '成品原料-草稿',
            mode: Draft.MODE.MATERIAL
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this, Draft.MODE.MATERIAL));
    }

    function caseCreate() {
        this._editor = new Editor({
            title: '接單代料-申請',
            mode: Editor.MODE.NEW_CASE
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }
    function caseOpen() {
        this._draft = new Draft({
            title: '接單代料-草稿',
            mode: Draft.MODE.CASE
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this, Draft.MODE.CASE));
    }

    function caseNoCreate() {
        this._editor = new Editor({
            title: '接單不代料-申請',
            mode: Editor.MODE.NEW_CASENO
        }).render();
        this.add(this._editor, {
            closable: true
        });
    }
    function caseNoOpen() {
        this._draft = new Draft({
            title: '接單不代料-草稿',
            mode: Draft.MODE.CASENO
        }).render();
        this.add(this._draft, {
            closable: true
        });
        this._draft.on('select', _.bind(onGridDraftSelect, this, Draft.MODE.CASENO));
    }

    function onCommandTrigger(event) {
        var value = event.data.value;
        var anchors = this._anchors;

        switch (value.toUpperCase()) {
            case AbnMaterial.COMMAND.REJECT_CREATE:
                rejectCreate.call(this);
                break;
            case AbnMaterial.COMMAND.REJECT_OPEN:
                rejectOpen.call(this);
                break;

            case AbnMaterial.COMMAND.STORAGE_CREATE:
                storageCreate.call(this);
                break;
            case AbnMaterial.COMMAND.STORAGE_OPEN:
                storageOpen.call(this);
                break;

            case AbnMaterial.COMMAND.MATERIAL_CREATE:
                materialCreate.call(this);
                break;
            case AbnMaterial.COMMAND.MATERIAL_OPEN:
                materialOpen.call(this);
                break;

            case AbnMaterial.COMMAND.CASE_CREATE:
                caseCreate.call(this);
                break;
            case AbnMaterial.COMMAND.CASE_OPEN:
                caseOpen.call(this);
                break;

            case AbnMaterial.COMMAND.CASENO_CREATE:
                caseNoCreate.call(this);
                break;
            case AbnMaterial.COMMAND.CASENO_OPEN:
                caseNoOpen.call(this);
                break;
            default:
                break;
        }
    }


    var props = {
        _editor: undefined,
        _draft: undefined
    };


    var AbnMaterial = declare(Base, {
        initialize: initialize,
        render: render
    }, props);

    // Enumeration of build in commands
    AbnMaterial.COMMAND = {
        REJECT_CREATE: 'REJECT_CREATE',
        REJECT_OPEN: 'REJECT_OPEN',

        STORAGE_CREATE: 'STORAGE_CREATE',
        STORAGE_OPEN: 'STORAGE_OPEN',

        MATERIAL_CREATE: 'MATERIAL_CREATE',
        MATERIAL_OPEN: 'MATERIAL_OPEN',

        CASE_CREATE: 'CASE_CREATE',
        CASE_OPEN: 'CASE_OPEN',

        CASENO_CREATE: 'CASENO_CREATE',
        CASENO_OPEN: 'CASENO_OPEN'
    };

    return AbnMaterial;
});