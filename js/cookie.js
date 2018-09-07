// plugin for the cookies add/remove
(function ($) {
    jQuery.fn.extend({
        cookieList: function (cookieName) {
            var cookie = Cookies.get(cookieName);
            var items = cookie ? cookie.split(',') : [];
            return {
                add: function (val) {
                    if (val) {
                        var index = items.indexOf(val);

                        // Note: Add only unique values.
                        if (index == -1) {
                            if (Math.floor(val) == val && jQuery.isNumeric(val)) {
                                items.push(val);
                                Cookies.set(cookieName, items.join(','), {expires: 365, path: '/'});
                            }
                        }
                    }
                },
                remove: function (val) {
                    if (val) {
                        var index = items.indexOf(val);
                        if (index > -1) {
                            items.splice(index, 1);
                            Cookies.set(cookieName, items.join(','), {expires: 365, path: '/'});
                        }
                    }
                },
                indexOf: function (val) {
                    return items.indexOf(val);
                },
                items: function () {
                    return items;
                },
                join: function (separator) {
                    return items.join(separator);
                }
            };
        }
    });
})(jQuery);