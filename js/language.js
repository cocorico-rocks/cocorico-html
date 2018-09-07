jQuery(function () {
    initSelectLanguage();
});

// Select Language init
function initSelectLanguage() {
    //abe ++
    // Get the ul that holds the collection of tags
    var $collectionHolder = $('ul.languages');

    // add the "add a tag" anchor and li to the tags ul
    $collectionHolder.data('index', $collectionHolder.find('li').length);
    var $userLanguages = $('#user_languages');
    if ($userLanguages) {
        $userLanguages.parent().remove();
    }
    //end abe++

    jQuery('.languages-block').each(function () {
        var holder = jQuery(this);
        var select = holder.find('select');
        var selectOptions = select.find('option');
        var itemsList = holder.find('.btns-list');
        var btnAdd = holder.find('.btn-add');

        function onSubmit() {
            var activeOption = selectOptions.eq(select.prop('selectedIndex'));
            var tags = itemsList.find('a.btn.btn-default');
            var itemText = activeOption.text();
            var stateFlag = false;

            tags.each(function () {
                if (jQuery(this).text() === itemText) stateFlag = true;
            });

            if (activeOption.index() == 0) {
                stateFlag = true;
            }

            if (stateFlag) return;

            //abe ++
            var item = jQuery('<li>' +
                '<a href="#" id="' + itemText + '" class="close" data-dismiss="alert" aria-label="Close"><i class="icon-cancel"></i><span class="hidden">close</span></a>' +
                '<a href="#" class="btn btn-default">' + itemText + '</a>' +
                '</li>').appendTo(itemsList);

            jQuery(window).trigger('refreshHeight');
            //abe ++
            addLanguageForm($collectionHolder, activeOption.val(), item);
        }

        btnAdd.on('click', function (e) {
            e.preventDefault();
            onSubmit();
        });
    });

    function addLanguageForm($collectionHolder, selectedValue, item) {
        // Get the data-prototype explained earlier
        var prototype = $collectionHolder.data('prototype');
        // get the new index
        var index = $collectionHolder.data('index');
        // Replace '__name__' in the prototype's HTML to
        // instead be a number based on how many items we have
        var newForm = prototype.replace(/__name__/g, index);
        // increase the index with one for the next item
        $collectionHolder.data('index', index + 1);
        // Display the form in the page in an li, before the "Add a tag" link li
        $(item).append(newForm);
        $('#user_languages_' + index + '_code').val(selectedValue);
    }
}
