jQuery(function () {
    initCategories();
});

// categories init
function initCategories() {
    var activeClass = 'jcf-hover';
    var animSpeed = 350;

    jQuery('.selection-area').each(function () {
        var holder = jQuery(this);
        var block = holder.find('.col ul');
        var links = block.find('a[href^="#"]');

        links.each(function () {
            var link = jQuery(this);

            link.on('click', function (e) {
                var src = link.attr('href');
                var box = jQuery(src);
                var column = link.closest('.col');
                var nextCol = link.closest('.col').next();
                var nextColumns = column.nextAll();
                var nextBoxes = nextColumns.find('.tab');
                var scrollBoxes = nextColumns.find('.jcf-scrollable');

                link.closest('li').siblings().find('a').removeClass(activeClass);
                scrollBoxes.find('a').removeClass(activeClass);
                link.addClass(activeClass);
                nextColumns.hide();
                nextBoxes.hide();
                nextCol.show();
                box.fadeIn(animSpeed);

                scrollBoxes.each(function () {
                    jQuery(this).data('jcfInstance').refresh();
                    setTimeout(function () {
                        jQuery(window).trigger('resize');
                    }, 100);
                });

                e.preventDefault();
            });
        });
    });
}
