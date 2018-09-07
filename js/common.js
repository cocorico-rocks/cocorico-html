function console_log() {
    var DEBUG = true;
    if (DEBUG && console) {
        console.log.apply(console, arguments);
    }
}

jQuery(function () {
    initRadioPayinSwitcher();
    initClearable();
    cleanHash();// Facebook unwanted has characters
    fixIEMobile10();
    initPlaceholder();
    initProfileSwitcher();
});

jQuery(window).load(function () {
    initCheckedClasses();
    initLoading();
});

// Payin dashboard switcher
function initRadioPayinSwitcher() {
    jQuery("input[name=radio-payin-switcher]:radio").change(function () {
        window.location = $(this).val();
    });
}

// Clearable input types
function initClearable() {
    jQuery('input.clearable, .clearable input[type=text]').clearSearch({
        callback: function () {
        }
    });
}

// Facebook unwanted has characters
function cleanHash() {
    if (window.location.hash == '#_=_') {
        // Check if the browser supports history.replaceState.
        if (history.replaceState) {
            // Keep the exact URL up to the hash.
            var cleanHref = window.location.href.split('#')[0];
            // Replace the URL in the address bar without messing with the back button.
            history.replaceState(null, null, cleanHref);
        } else {
            // Well, you're on an old browser, we can get rid of the _=_ but not the #.
            window.location.hash = '';
        }
    }
}

// fix IE mobile
function fixIEMobile10() {
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style');
        msViewportStyle.appendChild(
            document.createTextNode(
                '@-ms-viewport{width:auto!important}'
            )
        );
        document.querySelector('head').appendChild(msViewportStyle)
    }
}

// init placeholder
function initPlaceholder() {
    jQuery('input, textarea').placeholder();
}


// bind profile switch change event. Submit form on change.
function initProfileSwitcher() {
    $('input[name="profileSwitch[profile]"]').on("change", function () {
        $('form[name="profileSwitch"]').submit();
    });
}

// init loading
function initLoading() {
    setTimeout(function () {
        jQuery('body').removeClass('loading');
    }, 500);
}

/**
 * get Nb unread messages
 * @param url
 */
function getNbUnReadMessages(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (result) {
            if (result.total > 0) {
                $('#nb-unread-msg').html(" (" + result.total + ")");
            }
            if (result.asker > 0) {
                $('#askerMsg').html(" (" + result.asker + ")");
                $('#nb-unread-asker').html(" (" + result.asker + ")");
            }
            if (result.offerer > 0) {
                $('#offererMsg').html(" (" + result.offerer + ")");
                $('#nb-unread-offerer').html(" (" + result.offerer + ")");
            }
        }
    });
}

/**
 * Handle Unauthorised Ajax Access
 * @param loginUrl
 */
function handleUnauthorisedAjaxAccess(loginUrl) {
    $(document).ajaxError(function (event, xhr) {
        if (403 === xhr.status) {
            location.href = loginUrl;
        }
    });
}