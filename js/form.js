jQuery(function () {
    initRowRemove();
    initValidation();
    handleButtonClick();
});

/**
 * Simulate user click on a button type submit to make SF isClicked working if the click is done programmatically
 */
function handleButtonClick() {
    $("button[type=submit]").on('click', function (e) {
        var btnName = $(this).attr('name');
        var btnId = $(this).attr('id');
        if (btnId && btnName) {
            $(this).closest('form').find("input[type=hidden]#" + btnId).remove();
            $(this).closest('form').append('<input id="' + btnId + '" name="' + btnName + '" type="hidden" value="1">');
        }
    });
}


// form validation function
function initValidation() {
    var errorClass = 'error';
    var successClass = 'success';
    var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var regPhone = /^[0-9]+$/;

    //Disable html5 validation
    jQuery("form").each(function () {
        $(this).attr('novalidate', 'novalidate');
    });

    jQuery('.numbers-only').keyup(function (e) {
        $(this).val($(this).val().replace(/[^0-9\.,]/g, ''));
    });

    jQuery('form.validate-form').each(function () {
        var form = jQuery(this).attr('novalidate', 'novalidate');
        var successFlag = true;
        var inputs = form.find('input, textarea, select');

        // form validation function
        function validateForm(e) {
            successFlag = true;

            inputs.each(checkField);

            jQuery('.confirm-row').each(function () {
                var hold = jQuery(this);
                var field = hold.find('input');


                field.each(function () {
                    if (field.eq(0).val() !== field.eq(1).val()) {
                        hold.find('.validate-row').removeClass(errorClass);
                        successFlag = false;
                        hold.find('.validate-row').removeClass(successClass).addClass(errorClass);
                    }
                });
            });

            if (!successFlag) {
                e.preventDefault();
            }
        }

        // check field
        function checkField(i, obj) {
            var currentObject = jQuery(obj);
            var currentParent = currentObject.closest('.validate-row');

            // not empty fields
            if (currentObject.hasClass('required')) {
                setState(currentParent, currentObject, !currentObject.val().length || currentObject.val() === currentObject.prop('defaultValue'));
            }
            // correct email fields
            if (currentObject.hasClass('required-email')) {
                setState(currentParent, currentObject, !regEmail.test(currentObject.val()));
            }
            // correct number fields
            if (currentObject.hasClass('required-number')) {
                setState(currentParent, currentObject, !regPhone.test(currentObject.val()));
            }
            // something selected
            if (currentObject.hasClass('required-select')) {
                setState(currentParent, currentObject, currentObject.get(0).selectedIndex === 0);
            }
            // checkbox field
            if (currentObject.hasClass('required-checkbox')) {
                setState(currentParent, currentObject, !currentObject.is(':checked'));
            }
        }

        // set state
        function setState(hold, field, error) {
            hold.removeClass(errorClass).removeClass(successClass);
            if (error) {
                hold.addClass(errorClass);
                field.one('focus', function () {
                    hold.removeClass(errorClass).removeClass(successClass);
                });
                successFlag = false;
            } else {
                hold.addClass(successClass);
            }
        }

        // form event handlers
        form.submit(validateForm);
    });
}

// remove row init
function initRowRemove() {
    jQuery('.js-removed-row').each(function () {
        var holder = jQuery(this);
        var btnRemove = holder.find('.close');

        btnRemove.on('click', function (e) {
            e.preventDefault();
            holder.remove();
        });
    });
}


/**
 * Add form to collection function
 *
 * @param collection
 * @param item
 * @param callbackSuccess
 */
$.fn.addFormToCollection = function (collection, item, callbackSuccess) {
    var $container = this;
    var $addLink = $container.find("a.add");
    var $collectionHolder = $container.find(collection);
    $collectionHolder.data('index', $collectionHolder.find(item).length);

    $addLink.on('click', function (e) {
        e.preventDefault();
        addForm($collectionHolder);
    });

    function addForm($collectionHolder) {
        var prototype = $collectionHolder.parent('div').not(".errors").data('prototype');
        var index = $collectionHolder.data('index');

        var newForm = prototype.replace(/__name__/g, index);
        $collectionHolder.data('index', index + 1);
        $collectionHolder.append(newForm);
        jcf.replaceAll($collectionHolder);
        if (callbackSuccess !== undefined) {
            callbackSuccess();
        }
    }
};

/**
 * Submit ajax form function
 *
 * @param callbackSuccess
 */
$.fn.submitAjaxForm = function (callbackSuccess) {
    var $container = this;
    $container.find("form").submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            beforeSend: function (xhr) {
                $container.find(".flashes").hide();
            },
            success: function (response, status, xhr) {
                $container.replaceWith(response);
                callbackSuccess();
            }
        });

        return false;
    });
};
