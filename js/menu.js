// menu
jQuery(function () {
    $('.menu-sub-tabs li a').on("click", function (e) {
        e.preventDefault();
        var selectTabs = $(this).attr('data-id');

        $("ul.menu-sub-tabs li").removeClass("active");
        $(this).parent().addClass("active");

        if (selectTabs == 'offerer' || selectTabs == 'asker') {
            Cookies.set('userType', selectTabs, {'path': '/'});
            $('ul.display-sub-tabs').find('li.dropdown').removeClass('open');
        }
        $('ul.display-sub-tabs').find('li[data-id=' + selectTabs + '].dropdown').addClass('open');
        return false;
    });

    $('.display-tab .dropdown-menu li a').on("click", function (e) {
        var selectTabs = $(this).parents('.display-tab').attr('data-id');
        if (selectTabs == 'offerer' || selectTabs == 'asker') {
            Cookies.set('userType', selectTabs, {'path': '/'});
        }
    });
});