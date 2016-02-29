/**
 * Created by jackho on 1/27/16.
 *
 * Grid + Toobars
 * 常出現的狀況是CRUD
 * MINS 刪除一個record
 * PLUS 加一筆record，內容跟table上的column一樣 model attribute，型別也一樣
 * EDIT 針對一筆record編輯
 * EXCEL & UPLOAD 目前是都上傳檔案
 *
 * SELECT 全選/全部選 -> 必須 mode: Gridcrud.MODE.MULTI
 *
 *
 * noModal:
 * 1.true  => 直接對Grid做修改
 * 2.false => 開啟Modal，再對Grid做修改
 *
 * scenario:
 * 異常作業 -> 原料異常申請 -> 新增申請 -> 異常產品
 *
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/data/Collection', 'uweaver/widget/Triggers',
    'uweaver/widget/Widget', 'uweaver/widget/Grid', 'uweaver/widget/Pagination', 'uweaver/widget/Popup', './Button',
    'text!./tpl/Gridcrud.html', './Modal', 'text!./tpl/modal/upload/File.html',
    'widget/FormLayout', 'widget/Input', 'widget/Select', 'widget/Commandbar',
    'uweaver/Logger'], function (_, $, lang, Collection, Triggers, Widget, Grid, Pagination, Popup, Button,
                                 tpl, Modal, fileTpl,
                                 FormLayout, Input, Select, Commandbar,
                                 Logger) {

    var LOGGER = new Logger("lib/widget/Gridcrud");

    var declare = lang.declare;

    var Base = Widget;

    function initialize(config) {
        Base.prototype.initialize.apply(this, arguments);
        /***
         * default
         * collection & columns to show how to set data to Grid
         *
         * columns 加上 field ， 為了可以自動產生Modal的Form
         * ***/

        //var collection = new Collection();
        //var items = [
        //    {no: "IT2015120003", amount: 1, createDate: new Date("2015-12-08")},
        //    {no: "IT2015120004", amount: 2, createDate: new Date("2015-12-09")},
        //    {no: "IT2015120006", amount: 3, createDate: new Date("2015-12-10")},
        //    {no: "IT2015120008", amount: 4, createDate: new Date("2015-12-11")},
        //    {no: "IT2015120009", amount: 5, createDate: new Date("2015-12-12")}
        //];
        //collection.add(items);
        //
        //var columns = [
        //    {
        //      text: "異常單號",
        //      dataIndex: "no",
        //      field: {    type: "Select",
        //                  value: 'value',
        //                  options: [
        //                      {text: "", value: ""}
        //                  ]
        //              }
        //    },
        //];

        var defaults = {
            //tpl: tpl,
            //data: collection,
            //columns: columns,
            isTrigger: true,
            toolbar: {
                //align: Gridcrud.BAR_ALIGN.RIGHT,
                tools: [
                    //{name: undefined, tip: {title: undefined,direction: undefined}, noModal: true}
                ]
            },
            buttonbar: {
                //align: Gridcrud.BAR_ALIGN.RIGHT,
                btns: [
                    //{value: Gridcrud.BUTTON.NEW, noModal: true}
                ]
            },
            pagination: {
                is: false,     // 是否使用pagination
                render: false  // 雖然使用pagination，但不一定一開始就有data，所以無法馬上render
            }

        };
        _.defaults(this._cfg, defaults);

        this._anchors = {
            $bar: undefined,
            $toolbar: undefined,
            $buttonbar: undefined
            //$grid: undefined
        };
    }

    function render(options) {
        Base.prototype.render.apply(this, arguments);

        var defaults = {
            hidden: false
        };

        options || (options = {});
        _.defaults(options, defaults);

        var anchors = this._anchors;
        //anchors.$toolbar = this.$anchor('toolbar');
        //anchors.$grid = this.$el.find('table');

        this.hide();

        buildBar.call(this);
        buildToolbar.call(this);
        buildButtonbar.call(this);

        buildGrid.call(this);
        buildToolbarModal.call(this);
        buildButtonbarModal.call(this);
        buildPagination.call(this);

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
    function buildBar() {
        var a = this._anchors;
        var toolbar = this._cfg.toolbar;
        var buttonbar = this._cfg.buttonbar;

        if(toolbar.tools.length === 0 && buttonbar.btns.length === 0) {
            return ;
        }
        a.$bar = $('<div/>');

        a.$bar.addClass('clearfix');
        a.$bar.css('margin-bottom', '5px');
        a.$bar.attr('data-uw-anchor', "toolbar");
        a.$bar.appendTo(this.$el);
    }
    function buildToolbar() {
        var a = this._anchors;
        var toolbar = this._cfg.toolbar;

        if(toolbar.tools.length === 0) {
            return ;
        }

        var tools = toolbar.tools;
        var context = this ;
        this._toolCmd = new Commandbar().render();;

        toolbar.align || (toolbar.align = Gridcrud.BAR_ALIGN.RIGHT);
        this._toolCmd.addClass(toolbar.align);
        _.each(tools, function(tool) {
            if(tool.name === Gridcrud.TOOL.SELECT) {
                addSelect.call(context);
                return;
            }
           addTool.call(context, tool)
        });
        a.$bar.append(this._toolCmd.$el);


        //// set toolbar section => toolbar right or left
        //toolbar.position || (toolbar.position = Gridcrud.TOOLBAR_POSITON.RIGHT);
        //
        //anchors.$toolbar = $('<div/>');
        //
        //anchors.$toolbar.addClass(toolbar.position);
        //anchors.$toolbar.css('color', "steelblue");
        //anchors.$bar.append(anchors.$toolbar);
        //
        //// set tools & tooltips
        //var tools = toolbar.tools;
        //var context = this ;
        //_.each(tools, function(tool) {
        //    if(tool.name === Gridcrud.TOOL.SELECT) {
        //        addSelect.call(context);
        //        return;
        //    }
        //    addTool.call(context, tool);
        //});
        ////// activate tooltip
        //anchors.$toolbar.find('[data-toggle="tooltip"]').tooltip();
        //
        //LOGGER.debug("buildToolbar done");
    }
    function addTool(tool) {
        var tipTitle = undefined;
        if(tool.tip) {
            tipTitle = tool.tip.title;
        }
        var toolCircle = this._toolCmd.create(tool.name, tipTitle, Button.MODE.CIRCLE);
        toolCircle.on('trigger', _.bind(onToolbarSelect, this));
        return toolCircle;
    }
    //function addTool(tool) {
    //    var anchors = this._anchors;
    //    var toolbar = this._cfg.toolbar;
    //
    //    var $i = $('<i class="fa uw-text-xl uw-hover uw-clickable">');
    //    if(toolbar.position === Gridcrud.TOOLBAR_POSITON.RIGHT) {
    //        $i.css('margin-left', '15px');
    //    } else {
    //        $i.css('margin-right', '15px');
    //    }
    //
    //    $i.prop('value', tool.name);
    //    $i.addClass('fa-'+tool.name);
    //
    //    if(tool.tip) {
    //        $i.attr('data-toggle', 'tooltip');
    //        tool.tip.direction || (tool.tip.direction = Gridcrud.TIP.TOP);
    //        $i.attr('data-placement', tool.tip.direction);
    //        tool.tip.title || (tool.tip.title = "title");
    //        $i.attr('title', tool.tip.title);
    //    }
    //
    //    $i.appendTo(anchors.$toolbar);
    //    $i.on('click', _.bind(onToolbarSelect, this));
    //    return $i ;
    //}
    function addSelect() {
        var selectTools = [
            {name: SELECT.SELECT_ALL},
            {name: SELECT.SELECT_NONE}
            //{name: SELECT.SELECT_ALL, tip: {title: "All"}},
            //{name: SELECT.SELECT_NONE , tip: {title: "None"} }
        ];
        addTool.call(this, selectTools[0]);
        addTool.call(this, selectTools[1]).hide();
    }
    function buildButtonbar() {
        var a = this._anchors;
        var buttonbar = this._cfg.buttonbar;
        if(buttonbar.btns.length === 0) {
            return ;
        }

        //buttonbar.position || (buttonbar.position = Gridcrud.BUTTONBAR.LEFT);
        //a.$buttonbar = $('<div/>');
        //a.$buttonbar.addClass('commandbar');
        //a.$buttonbar.css('margin-bottom', '5px');
        //if(!_.isUndefined(a.$toolbar)) {
        //    a.$toolbar.css('margin-top', '15px');
        //}
        //a.$buttonbar.addClass(buttonbar.position);
        //a.$bar.append(a.$buttonbar);
        //
        //
        //var btns = buttonbar.btns;
        //var context = this ;
        //_.each(btns, function(btn) {
        //    var button = new Button({
        //        value: btn.value
        //    }).render();
        //
        //    button.$el.appendTo(a.$buttonbar);
        //    if(buttonbar.position === Gridcrud.BUTTONBAR.LEFT) {
        //        button.css('margin-right', '5px');
        //    } else {
        //        button.css('margin-left', '5px');
        //    }
        //    button.on('trigger', _.bind(onButtonClick, context));
        //});




        var btns = buttonbar.btns;
        var context = this ;
        this._btnBar = new Commandbar();
        this._btnBar.addClass(buttonbar.align);
        _.each(btns, function(btn) {
            context._btnBar.create(btn.value).on('trigger', _.bind(onButtonClick, context));
        });
        this._btnBar.render();
        a.$bar.append(this._btnBar.$el);
    }
    function onButtonClick(evt) {
        var value = evt.data.value;
        LOGGER.debug("onButtonClick - value: ${0}", value);
        var isTrigger = this._cfg.isTrigger;

        isTrigger && cmdClick.call(this, value);

        if(value === Button.VALUE.NEW) {
            this._modalEdit.title("新增");
            this._modalEdit.show();
        } else if(value === Button.VALUE.MODIFY) {
            this._modalEdit.title("修改");
            this._modalEdit.show();
        } else if(value === Button.VALUE.DELETE) {
            minusControl.call(this);
        }
    }
    function cmdClick(name) {
        var value = this._grid.selection();
        var event = {
            context: this,
            source: this,
            data: {
                name: name,  // name表示名字是xxx的button發出
                value: value // value表示此時 grid被選擇的值
            }
        };
        LOGGER.debug('cmd click name: ${0}, value: ${1}', name, value);
        this.trigger("command", event);
    }
    function buildGrid() {
        var anchors = this._anchors;

        var data = this._cfg.data;
        var columns = this._cfg.columns;
        var mode = this._cfg.mode;


        this._grid = new Grid({
            el: '<table class="table table-bordered table-striped table-hover uw-selectable"></table>',
            data: data,
            columns: columns,
            mode: mode
        }).render();

        this._grid.attach(this.$el);
        this.listenTo(this._grid, 'select', _.bind(function(event){
            this.trigger('gridSelect', event);
        },this));
    }
    /*
    *
    * noModal: true  => 直接對Grid做操作
    * noModal: false => 開啟Modal後，間接對Grid做操作
    * */
    function buildToolbarModal() {
        var tools = this._cfg.toolbar.tools;
        var context = this ;
        //if(tools.length === 0) {
        //    return ;
        //}
        _.each(tools, function(tool) {
            switch(tool.name) {
                case Gridcrud.TOOL.EDIT:
                    tool.noModal || buildModalEdit.call(context);
                    break;
                case Gridcrud.TOOL.PLUS:
                    //tool.noModal || (context._modalEdit = new Modal().render());
                    tool.noModal || buildModalEdit.call(context);
                    break;
                case Gridcrud.TOOL.MINUS:

                    break;
                case Gridcrud.TOOL.SEARCH:
                    tool.noModal || (context._modalSearch = new Modal().render());
                    break;
                case Gridcrud.TOOL.CLONE:
                    tool.noModal || (context._modalClone = new Modal().render());
                    break;
                case Gridcrud.TOOL.EXCEL:
                    tool.noModal || (context._modalExcel = new Modal({size: Modal.SIZE.SS, title: "Excel匯入"}).render());
                    setModalExcel.call(context);
                    break;
                case Gridcrud.TOOL.UPLOAD:
                    tool.noModal || (context._modalUpload = new Modal({size: Modal.SIZE.SS, title: "檔案上傳"}).render());
                    setModalUpload.call(context);
                    break;
            }
        });
    }
    /*
    * plus & edit 用同一個modal,
    * 因為差別只在
    * 新增: 欄位皆是空的
    * 修改: 將選取的資料帶到欄位中
    * */
    function buildModalEdit() {
        // 避免plus build一次，edit又build一次
        if(!_.isUndefined(this._modalEdit)) {
            return ;
        }
        var columns = this._cfg.columns ;
        this._modalEdit = new Modal({
            size: Modal.SIZE.M
        }).render();

        var fl = new FormLayout().render();

        _.each(columns, function(column, index){
            if(_.isUndefined(column.field)) {
                return ;
            }
            if(column.field.type === 'Select') {
                var select = new Select({
                    caption: column.text
                }).render();
                fl.addRow().addField(select, '', 3 , 8);
            }
        });
        this._modalEdit.setContent(fl);
    }
    /*
     *
     * noModal: true  => 直接對Grid做操作
     * noModal: false => 開啟Modal後，間接對Grid做操作
     * */
    function buildButtonbarModal() {
        var btns = this._cfg.buttonbar.btns;
        var context = this ;

        _.each(btns, function(btn) {
            if(btn.value === Button.VALUE.NEW || btn.value === Button.VALUE.EDIT) {
                btn.noModal || buildModalEdit.call(context);
            }

        });
    }
    function buildPagination() {
        var cfg = this._cfg;

        if(cfg.pagination.is) {
            // for align center
            var $pageWrapper = $('<div/>');
            $pageWrapper.addClass('text-center');

            this._pagination = new Pagination({
                //data: cfg.data
            });

            $pageWrapper.append(this._pagination.$el);

            this.$el.append($pageWrapper);
        }
        if(cfg.pagination.render) {
            this._pagination.data(cfg.data);
        }
    }
    function getDataIndex() {
        var columns = this._cfg.columns ;
        _.each(columns, function(element, index) {
            LOGGER.debug('getDataIndex: ${0} , ${1}', element.text, element.dataIndex);
        });
    }
    /*
    * testing purpose
    * */
    function printAllData() {
        var data = this._cfg.data;
        var columns = this._cfg.columns;

        data.each(function(item, rowIndex) {
            _.each(columns, function(element, colIndex){
                var dataIndex = element.dataIndex;
                var value = item.get(dataIndex);
                var type = getDataType(value);
                LOGGER.debug("printAllData - [row:${0}|col:${1}] -- value:${2} -- type:${3}", rowIndex, colIndex, value, type);
            });
        });
    }
    /*
    * 最後在Grid上呈現時，其實都轉成string
    * */
    function getDataType(value) {
        if(_.isDate(value)) return 'date';

        if(_.isNumber(value)) return 'number';

        return 'string';
    }


    function onToolbarSelect(evt) {
        var anchors = this._anchors;
        //var value = evt.target.value;
        var value = evt.data.value;
        LOGGER.debug("onToolbarSelect - value: ${0}", value);

        if(value === Gridcrud.TOOL.EDIT){
            if(!_.isUndefined(this._modalEdit)) {
                this._modalEdit.title("修改");
                this._modalEdit.show();
            }
        } else if(value === Gridcrud.TOOL.PLUS) {
            /* 當有tool plus時，而沒有_modalEdit，表示不開啟modal編輯，
               而是直接在Grid加上一筆可編輯record */
            if(_.isUndefined(this._modalEdit)) {
                plusControl.call(this);
            } else {
                this._modalEdit.title("新增");
                this._modalEdit.show();
            }
        } else if(value === Gridcrud.TOOL.MINUS) {
            minusControl.call(this);
        } else if(value === Gridcrud.TOOL.SEARCH) {
            this._modalSearch && (this._modalSearch.show());
        } else if(value === Gridcrud.TOOL.CLONE) {
            this._modalClone && (this._modalClone.show());
        } else if(value === Gridcrud.TOOL.EXCEL) {
            this._modalExcel && (this._modalExcel.show());
        } else if(value === Gridcrud.TOOL.UPLOAD) {
            this._modalUpload && (this._modalUpload.show());
        // SELECT
        } else if(value === SELECT.SELECT_ALL) {
            //anchors.$toolbar.find(".fa-check-square-o").hide();
            //anchors.$toolbar.find(".fa-square-o").show();
            this._toolCmd.get(SELECT.SELECT_ALL).hide();
            this._toolCmd.get(SELECT.SELECT_NONE).show();

            selectAll.call(this);
        } else if(value === SELECT.SELECT_NONE) {
            this._toolCmd.get(SELECT.SELECT_ALL).show();
            this._toolCmd.get(SELECT.SELECT_NONE).hide();
            selectNone.call(this);
        }

        var isTrigger = this._cfg.isTrigger;
        isTrigger && cmdClick.call(this, value);
    }
    function selectAll() {
        var models = this._grid.data().models;
        var context = this ;
        _.each(models, function(model) {
            context._grid.select(model);
        });
    }
    function selectNone() {
        var models = this._grid.data().models;
        var context = this ;
        _.each(models, function(model) {
            context._grid.deselect(model);
        });
    }

    /*********************** Modals ***************************
     *
     * default content of modals
     *
     */
    function setModalEdit() {

    }
    function setModalPlus() {

    }
    function setModalMinus() {

    }
    function setModalSearch() {

    }
    function setModalClone() {

    }
    function setModalExcel() {
        var $file = $('<div/>').html(fileTpl).contents();
        this._modalExcel.setContent($file, {
            reset: true
        });
    }
    function setModalUpload() {
        var $file = $('<div/>').html(fileTpl).contents();
        this._modalUpload.setContent($file, {
            reset: true
        });
    }

    /***************** Grid Inline Management - toolbar ****************/
    function minusControl() {
        var selectedModels = this._grid.selection();
        LOGGER.debug('setMinusControl - selectedModels : ${0}', selectedModels);

        this._grid.data().remove(selectedModels);
    }
    function plusControl() {
        this._grid.data().add(this._plusModel);
    }
    /*
    * 設定plusControl前置作業
    * */
    function setPlusControl(model) {
        this._plusModel = model ;
    }

    /***************** Grid Inline Management - buttonbar ****************/
    function btnNew() {

    }
    function btnModify() {

    }

    function data(items, options) {
        if(!items) return this._data;

        options || (options = {});

        var defaults = {
            render: true
        };

        _.defaults(options, defaults);

        this._grid.data(items, options);
        this._pagination.data(items, options);

        return this;
    }
    var props = {
        _anchors: undefined,
        _class: 'Gridcrud',

        _btnBar: undefined,

        _toolbar: undefined,
        _grid: undefined,
        _pagination: undefined,
        /* modals */
        // toolbar
        //_modalEdit: undefined,
        _modalEdit: undefined, // plus & edit 共用同一個modal，開啟時顯示不同title: 新增 | 修改
        
        //_modalMinus: undefined,
        
        _modalSearch: undefined,
        _modalClone: undefined,
        _modalExcel: undefined,
        _modalUpload: undefined,
        /*
        * plusControl params
        * 當有tool plus時，而沒有_modalEdit，表示不開啟modal編輯，而是直接在Grid加上一筆可編輯record
        * 跟setPlusControl一起使用。
        */
        _plusModel: undefined,
    };

    var Gridcrud = declare(Base, {
        initialize: initialize,
        render: render,

        setPlusControl: setPlusControl,
        data: data,
        selectAll: selectAll,
        selectNone: selectNone
    }, props);

    Gridcrud.TOOL = {
        EDIT: 'edit',
        PLUS: 'plus',
        MINUS: 'minus',
        SEARCH: 'search',
        CLONE: 'clone',
        EXCEL: 'file-excel-o',
        UPLOAD: 'upload',
        EYE: 'eye',

        SELECT: 'select'

    };
    var SELECT = {
        SELECT_ALL: 'ALL',
        SELECT_NONE: 'NONE'
    };
    //Gridcrud.TOOLBAR_POSITON = {
    //    RIGHT: 'pull-right',
    //    LEFT: 'pull-left'
    //};
    Gridcrud.TIP = {
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right'
    };
    Gridcrud.BUTTON = {
        NEW: "new",
        MODIFY: "modify",
        DELETE: "delete"
    };
    //Gridcrud.BUTTONBAR = {
    //    RIGHT: 'pull-right',
    //    LEFT: "pull-left"
    //};
    Gridcrud.MODE = {
        SINGLE: 'SINGLE',
        MULTI: 'MULTI',
        NONE: 'NONE'
    };
    Gridcrud.BAR_ALIGN  = {
        RIGHT: 'pull-right',
        LEFT: 'pull-left',
        CENTER: 'text-center'
    };

    return Gridcrud;
});