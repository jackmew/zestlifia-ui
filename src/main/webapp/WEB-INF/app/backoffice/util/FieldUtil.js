/**
 * Created by jackho on 1/12/16.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/widget/Widget',
    'uweaver/Logger'], function (_, $, lang, Widget, Logger) {

    var LOGGER = new Logger("Util/FieldUtil");

    /*
        set is all fields isEditable
     */
    function setIsEditable(component, isEditable) {
        LOGGER.debug("setIsEditable: ${0}",isEditable );

        var $el;

        if(component instanceof Widget) {
            $el = component.$el;
        } else if(component instanceof jQuery) {
            $el = component;
        }

        setIsTextReadonly($el, !isEditable);
        setIsNumberReadonly($el, !isEditable);
        setIsDateReadonly($el, !isEditable);
        setIsTextareaReadonly($el, !isEditable);
        setIsSelectDisabled($el, !isEditable);
        setIsCheckboxDisabled($el, !isEditable);
        setIsRadioDisabled($el, !isEditable);
        setIsToolbarInvisible($el, isEditable);
        setIsButtonDisabled($el, !isEditable);
    }
    function setIsTextReadonly($el, isReadonly) {
        var inputArr = $el.find('input[type="text"]');
        _.each(inputArr, function(el) {
            $(el).prop('readonly', isReadonly);
        });
    }
    function setIsNumberReadonly($el, isReadonly) {
        var inputArr = $el.find('input[type="number"]');
        _.each(inputArr, function(el) {
            $(el).prop('readonly', isReadonly);
        });
    }
    function setIsDateReadonly($el, isReadonly) {
        var inputArr = $el.find('input[type="date"]');
        _.each(inputArr, function(el) {
            $(el).prop('readonly', isReadonly);
        });
    }
    function setIsTextareaReadonly($el, isReadonly) {
        var textArea = $el.find('textarea');
        _.each(textArea, function(el) {
            $(el).prop('readonly', isReadonly);
        });
    }
    function setIsSelectDisabled($el, isDisabled) {
        var selectArr = $el.find('select');
        _.each(selectArr, function(el) {
            $(el).prop('disabled', isDisabled);
        });
    }
    function setIsCheckboxDisabled($el, isDisabled) {
        var checkboxArr = $el.find('input[type="checkbox"]');
        _.each(checkboxArr, function(el) {
            $(el).prop('disabled', isDisabled);
        });
    }
    function setIsRadioDisabled($el, isDisabled) {
        var radioArr = $el.find('input[type="radio"]');
        _.each(radioArr, function(el) {
            $(el).prop('disabled', isDisabled);
        });
    }
    function setIsToolbarInvisible($el, isVisible) {
        //var iArr = $el.find('.form-group i');
        var iArr = $el.find("[data-uw-anchor='toolbar']");
        _.each(iArr, function(el) {
            if(isVisible) {
                $(el).show();
            } else {
                $(el).hide();
            }
        });
    }
    function setIsButtonDisabled($el, isDisabled) {
        var buttonArr = $el.find('.form-group button');
        _.each(buttonArr, function(el) {
            $(el).prop('disabled', true);
            $(el).find('i').show().off();
        });
    }
    /*
        populate <select> <option>s

        examples:
        $select -> $("select[name='sprocType']")
        selectedValue -> $("select[name='sprocType'] option:selected").val();
     */
    function populateSelect($select, ops) {
        $select.find("option").remove();

        _.each(ops, function(op) {
            var option = $('<option/>');
            option.attr({
                'value': op.value
            }).text(op.text);
            $select.append(option);
        });
    }

    function fieldWrapper(anchor) {
        return $('<div data-uw-anchor="'+anchor+'"</div>');
    }
    function inputWrapper(num) {
        return $('<div class="col-sm-'+num+'"></div>');
    }
    function col(num) {
        var $div = $('<div/>');
        $div.addClass('col-sm-'+num);
        this.$el.append($div);
        return $div;
    }

    var FieldUtil = {
        setIsEditable: setIsEditable,
        populateSelect: populateSelect,
        fieldWrapper: fieldWrapper,
        inputWrapper: inputWrapper,
        col: col
    };


    return FieldUtil;
});