/**
 * centerModal centers the modal box when window resized
 * @return void
 */
function centerModal() {
    $(this).css('display', 'block');
    var $dialog = $(this).find(".modal-dialog");
    var offset = ($(window).height() - $dialog.height()) / 2;
    // Center modal vertically in window
    $dialog.css("margin-top", offset);
}


$.fn.extend({
    /**
     * @param width
     * @param {function} [callbackClose]
     * @returns {*|jQuery}
     */
    initDialogForm: function (width, callbackClose) {
        return $(this).dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            width: width,
            open: function () {

            },
            close: function () {
                $(this).empty();
                if (callbackClose !== undefined) {
                    callbackClose();
                }
            }
        });
    },
    /**
     *
     * @param url
     * @param title
     * @param callbackLoad
     */
    openDialog: function (url, title, callbackLoad) {
        var $dialog = $(this);
        $dialog.dialog("close");
        $dialog.dialog("option", "title", title);

        $.ajax({
            type: 'GET',
            url: url,
            //cache: false,
            success: function (html, status, xhr) {
                $dialog.dialog("open");
                $dialog.dialog("moveToTop");
                $dialog.html(html);
                if (callbackLoad !== undefined) {
                    callbackLoad();
                }
                //To close dialog on outside click
                $(".ui-widget-overlay").on("click", function () {
                    $dialog.dialog("close");
                });
            }
        });
    }
});

/**
 * Refresh modal on load
 */
$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
    $(this).find(".modal-content").html('');
});