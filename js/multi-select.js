/**
 * Init Multi Select Box
 * See fields.html > listing_category_widget_options_tree for indentation management
 *
 * @param elt
 * @param allSelectedText
 * @param width
 */
function initMultiSelect(elt, allSelectedText, noneSelectedText, numSelectedText, width) {
    jcf.destroy(elt);
    jcf.refresh(elt);

    width = typeof width !== 'undefined' ? width : '180px';

    //Replace 160 by 'nbsp'
    $(elt).find('option').each(function (index) {
        $(this).html($(this).text().replace(/&#160;&#160;&#160;/g, "&nbsp;&nbsp;&nbsp;"));
    });

    $(elt).multiselect({
        //buttonWidth: width,
        allSelectedText: allSelectedText,
        nonSelectedText: noneSelectedText,
        nSelectedText: numSelectedText,
        numberDisplayed: 1,
        enableClickableOptGroups: true,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        buttonText: function (options, select) {
            //Replace nbsp by ''
            if (options.length === 0) {
                return this.nonSelectedText;
            }
            else if (this.allSelectedText
                && options.length === $('option', $(select)).length
                && $('option', $(select)).length !== 1
                && this.multiple) {

                if (this.selectAllNumber) {
                    return this.allSelectedText + ' (' + options.length + ')';
                }
                else {
                    return this.allSelectedText;
                }
            }
            else if (options.length > this.numberDisplayed) {
                return options.length + ' ' + this.nSelectedText;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;

                options.each(function () {
                    var label = ($(this).attr('label') !== undefined) ?
                        $(this).attr('label').replace(/&nbsp;&nbsp;&nbsp;/g, '').replace(' - ', '') :
                        $(this).html().replace(/&nbsp;&nbsp;&nbsp;/g, '').replace(' - ', '');

                    selected += label + delimiter;
                });

                return selected.substr(0, selected.length - 2);
            }
        },
        buttonTitle: function (options, select) {
            if (options.length === 0) {
                return this.nonSelectedText;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;

                options.each(function () {
                    var label = ($(this).attr('label') !== undefined) ?
                        $(this).attr('label').replace(/&nbsp;&nbsp;&nbsp;/g, '').replace(' - ', '') :
                        $(this).html().replace(/&nbsp;&nbsp;&nbsp;/g, '').replace(' - ', '');
                    selected += $.trim(label) + delimiter;
                });
                return selected.substr(0, selected.length - 2);
            }
        }
    });

    $(elt).next().find('.multiselect-group label').each(function (index) {
        $(this).html($(this).text().replace(/&#160;&#160;&#160;/g, "&nbsp;&nbsp;&nbsp;"));
    });
}
