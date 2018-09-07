/**
 * Favorite click handling
 */
jQuery(function () {
    // Favourites click event
    $('#main').on('click', 'a.favourit', function (evt) {
        var cookieList = $.fn.cookieList("favourite");
        var idString = $(this).attr('id');
        var ids = idString.split('-');
        var id = (ids[1]) ? ids[1] : null;
        // toggle the active class when clicked
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            cookieList.remove(id);
        } else {
            $(this).addClass('active');
            cookieList.add(id);
        }
        if (cookieList.items().length > 0) {
            $('#fav-count').html("(" + cookieList.items().length + ")");
        } else {
            $('#fav-count').html(" ");
        }
    });
});

/**
 * setFavourite class function
 */
function setDefaultFavourites() {
    var cookieList = $.fn.cookieList("favourite");
    $.each(cookieList.items(), function (index, value) {
        var $favorite = $('#favourite-' + value);
        if (!$favorite.hasClass('active')) {
            $favorite.addClass('active');
        }
    });
    if (cookieList.items().length > 0) {
        $('#fav-count').html("(" + cookieList.items().length + ")");
    } else {
        $('#fav-count').html(" ");
    }
}