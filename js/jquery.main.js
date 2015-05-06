// page init
jQuery(function () {
    initPopups();
    initCustomForms();
    initAddClasses();
    initUiSlider();
    initRowRemove();
    initCategories();
    initValidation();
    initDatepicker();
    initRating();
    initSelectLanguage();
    jQuery('input, textarea').placeholder();
    jQuery('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});

jQuery(window).load(function () {
    initTooltipFix();
    initCalendar();
    initSlideShow();
    initSameHeight();
    initCarousel();
    initCheckedClasses();
    initFileUpload();
    initDraggable();
    initMap();
    setTimeout(function () {
        jQuery('body').removeClass('loading');
    }, 500);
});

// Select Language init
function initSelectLanguage() {
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

            if (stateFlag) return;

            var item = jQuery('<li>' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="Close"><i class="icon-cancel"></i><span class="hidden">close</span></a>' +
            '<a href="#" class="btn btn-default">' + itemText + '</a>' +
            '</li>').appendTo(itemsList);

            jQuery(window).trigger('refreshHeight');
        }

        btnAdd.on('click', function (e) {
            e.preventDefault();
            onSubmit();
        });
    });
}

// initialize custom form elements
function initCustomForms() {
    jcf.setOptions('Select', {
        wrapNative: false,
        wrapNativeOnMobile: false
    });
    jcf.replaceAll();
}

// star rating init
function initRating() {
    lib.each(lib.queryElementsBySelector('.star-rating'), function () {
        new StarRating({
            element: this,
            onselect: function (num) {
                // rating setted event
            }
        });
    });
}

// dragable init
function initDraggable() {
    var readyClass = 'js-upload-ready';
    var previewWidth = 150;
    var previewHeight = 120;

    jQuery('.file-selection').each(function () {
        var container = jQuery(this);
        var uploaderHolder = container.find('.uploader');
        var images = container.find('.files-list .img-thumbnail');
        var imagesHolder = container.find('.files-list');
        var jsFileuploadInput = container.find('input[type="file"]');

        ResponsiveHelper.addRange({
            '..767': {
                on: function () {
                    previewWidth = 108;
                    previewHeight = 87;
                    jsFileuploadInput.fileupload();
                }
            },
            '768..': {
                on: function () {
                    previewWidth = 148;
                    previewHeight = 120;
                }
            }
        });

        jsFileuploadInput.fileupload({
            url: uploaderHolder.data('url'),
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 10000000, // 10 MB
            previewMaxWidth: previewWidth,
            previewMaxHeight: previewHeight,
            previewCrop: true,
            dropZone: uploaderHolder,
            done: function (e, data) {
                var preview = jQuery('<div class="img-thumbnail"><a href="#" class="close" data-dismiss="alert" aria-label="Close"><span class="hidden">Close</span><i class="icon-cancel"></i></a><div class="image"></div></div>');
                preview.prependTo(imagesHolder);
                var imgHold = preview.find('.image');
                imgHold.html(data.files[0].preview || data.files[0].name);
            }
        });

        images.each(function () {
            var image = jQuery(this);
            var btnClose = image.find('a.close');

            btnClose.on('click', function (e) {
                e.preventDefault();
                image.remove();
            });
        });

        imagesHolder.sortable({
            revert: true
        });
    });

    jQuery('.js-drag-holder').sortable({
        revert: true
    });
}

// datepicker init
function initDatepicker() {
    jQuery('.datepicker-holder').each(function () {
        var holder = jQuery(this);
        var inputs = holder.find('input:text');
        var from = inputs.filter('input.from');
        var to = inputs.filter('input.to');

        inputs.each(function () {
            var input = jQuery(this);

            input.closest('.col').find('.add-on').on('click', function (e) {
                e.preventDefault();
                input.focus();
            });
        });

        inputs.datepicker({
            dateFormat: "dd  /  mm  /  y",
            onSelect: function (selectedDate) {
                var input = jQuery(this);
                var option = input.is(from) ? 'minDate' : 'maxDate';
                var instance = input.data('datepicker');
                var date = jQuery.datepicker.parseDate(instance.settings.dateFormat || jQuery.datepicker._defaults.dateFormat, selectedDate, instance.settings);

                inputs.not(input).datepicker('option', option, date);

                if (input.is(from)) {
                    setTimeout(function () {
                        to.focus();
                    }, 100);
                }
            }
        });
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

// tooltip fix init
function initTooltipFix() {
    var win = jQuery(window);
    var body = jQuery('body');
    var tooltipButtons = jQuery('[data-toggle="tooltip"]');
    var tooltipWidth = 311;

    ResponsiveHelper.addRange({
        '..767': {
            on: function () {
                tooltipWidth = 150;
            }
        },
        '..1699': {
            on: function () {
                tooltipWidth = 194;
            }
        },
        '1700..': {
            on: function () {
                tooltipWidth = 311;
            }
        }
    });

    function resizeHandler() {
        tooltipButtons.each(function () {
            var item = jQuery(this);

            if (item.offset().left + item.outerWidth(true) + tooltipWidth > body.width()) {
                item.attr('data-placement', 'left');

                item.on('mouseenter click', function () {
                    jQuery('.tooltip').removeClass('right').addClass('left').css({
                        left: item.offset().left - tooltipWidth - 20
                    });
                });
            } else {
                item.attr('data-placement', 'right');
                item.on('mouseenter click', function () {
                    jQuery('.tooltip').removeClass('left').addClass('right');
                });
            }
        });
    }

    resizeHandler();
    win.on('resize orientationchange', resizeHandler);
}

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

// calendar init
function initCalendar() {
    jQuery('.calendar-block').each(function () {
        var calendar = jQuery(this);
        var dataEvents = calendar.data('events');
        var lang = calendar.data('lang');

        calendar.fullCalendar({
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            lang: lang,
            firstDay: 0,
            views: {
                month: { // name of view
                    titleFormat: 'MMMM - YYYY'
                }
            },
            editable: false,
            eventLimit: false, // allow "more" link when too many events
            events: {
                url: dataEvents ? dataEvents : ' ',
            },
            loading: function (bool) {
                var self = jQuery(this);
                var title = self.find('.fc-center h2');

                if (!bool) {
                    var string = title.html();
                    var newString = '';

                    string = string.split(' ');
                    for (i = 0; i < string.length; i++) {
                        if (i !== 2) {
                            newString = newString + string[i] + ' ';
                        } else {
                            newString = newString + ' <span>' + string[i] + '</span> ';
                        }
                    }
                    title.html(newString);
                }
            }
        });
    });

    jQuery('.calendar-box').each(function () {
        var sheduleCalendar = jQuery(this);
        var defaultDate = sheduleCalendar.data('date');
        var dataSheduleEvents = sheduleCalendar.data('events');
        var lang = sheduleCalendar.data('lang');

        sheduleCalendar.fullCalendar({
            header: {
                left: '',
                center: 'title',
                right: ''
            },
            lang: lang,
            firstDay: 0,
            defaultDate: defaultDate,
            views: {
                month: { // name of view
                    titleFormat: 'MMMM YYYY'
                }
            },
            editable: true,
            eventLimit: false, // allow "more" link when too many events
            events: {
                url: dataSheduleEvents,
            }
        });
    });
}

// file upload init
function initFileUpload() {
    var doneClass = 'js-image-loaded';
    var readyClass = 'js-upload-ready';

    jQuery('.image-upload-holder').not('.' + readyClass).each(function () {
        var holder = jQuery(this).addClass(readyClass);
        var jsFileuploadInput = holder.find('input[type="file"]');
        var preview = holder.find('.img-holder');

        preview.on('click', function () {
            jsFileuploadInput.trigger('click');
        });

        jsFileuploadInput.fileupload({
            url: holder.data('url'),
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 10000000, // 10 MB
            previewMaxWidth: preview.width(),
            previewMaxHeight: preview.height(),
            previewCrop: true,
            dropZone: holder,
            done: function (e, data) {
                preview.html(data.files[0].preview || data.files[0].name);
                holder.addClass(doneClass);
            }
        });
    });
}

// iu slider init
function initUiSlider() {
    jQuery('.range-box').each(function () {
        var holder = jQuery(this);
        var slider = holder.find('.ui-slider');
        var valueFieldMin = holder.find('.value-min');
        var valueFieldMax = holder.find('.value-max');
        var sliderMin = parseInt(slider.data('min'), 10) || 0;
        var sliderMax = parseInt(slider.data('max'), 10) || 100;
        var sliderValue = parseInt(slider.data('value'), 10) || 0;
        var sliderStep = parseInt(slider.data('step'), 10) || 1;
        var valueLeft = slider.find('.value-left .text');
        var valueRight = slider.find('.value-right .text');

        slider.slider({
            range: true,
            values: [0, sliderValue],
            min: sliderMin,
            max: sliderMax,
            step: sliderStep,
            slide: function (event, ui) {
                sliderMin = ui.values[0];
                sliderValue = ui.values[1];
                refreshText();
            }
        });

        function refreshText() {
            valueFieldMin.val(sliderMin);
            valueFieldMax.val(sliderValue);
            valueLeft.text(sliderMin);
            valueRight.text(sliderValue);
        }

        refreshText();
    });
}

// scroll gallery init
function initCarousel() {
    jQuery('.gallery-slider').scrollGallery({
        mask: '.vertical-slider',
        slider: '.vertical-slideset',
        slides: '.vertical-slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        pagerLinks: '.pagination li',
        vertical: true,
        autoRotation: false,
        switchTime: 3000,
        animSpeed: 500,
        step: 1
    });
}

// fade galleries init
function initSlideShow() {
    jQuery('.slideshow').fadeGallery({
        slides: '.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        pagerLinks: '.pagination li',
        event: 'click',
        useSwipe: true,
        autoRotation: false,
        autoHeight: true,
        switchTime: 3000,
        animSpeed: 500
    });
    jQuery('.gallery-slider').fadeGallery({
        slides: '.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        pagerLinks: '.vertical-slideset .vertical-slide',
        event: 'click',
        useSwipe: true,
        autoRotation: false,
        autoHeight: true,
        switchTime: 3000,
        animSpeed: 500
    });
}

// popups init
function initPopups() {
    jQuery('.popup-holder').contentPopup({
        mode: 'click'
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.ad-holder').sameHeight({
        elements: '.ad-box',
        skipClass: 'ad-post',
        flexible: true,
        multiLine: true
    });
    jQuery('.about-info, .payment-info, .contact-info').sameHeight({
        elements: '.column',
        flexible: true,
        multiLine: true
    });
    jQuery('.location-holder').sameHeight({
        elements: '.contact-info, address',
        flexible: true,
        multiLine: true
    });
}

// add class on click
function initAddClasses() {
    jQuery('.tabset-holder .opener').clickClass({
        classAdd: 'active',
        addToParent: 'tabset-holder'
    });
    jQuery('.rating-opener').clickClass({
        classAdd: 'active',
        addToParent: 'user-rating'
    });
}

// checked classes when element active
function initCheckedClasses() {
    var checkedClass = 'input-checked', parentCheckedClass = 'input-checked-parent';
    var pairs = [];
    jQuery('label[for]').each(function (index, label) {
        var input = jQuery('#' + label.htmlFor);
        label = jQuery(label);

        // click handler
        if (input.length) {
            pairs.push({input: input, label: label});
            input.bind('click change', function () {
                if (input.is(':radio')) {
                    jQuery.each(pairs, function (index, pair) {
                        refreshState(pair.input, pair.label);
                    });
                } else {
                    refreshState(input, label);
                }
            });
            refreshState(input, label);
        }
    });

    // refresh classes
    function refreshState(input, label) {
        if (input.is(':checked')) {
            input.parent().addClass(parentCheckedClass);
            label.addClass(checkedClass);
        } else {
            input.parent().removeClass(parentCheckedClass);
            label.removeClass(checkedClass);
        }
    }
}

// map init
function initMap() {
    var win = jQuery(window);
    var zoom = 14;

    jQuery('.map-canvas').each(function () {
        var currMap = jQuery(this);
        var mapOptions = {
            zoom: zoom,
            center: new google.maps.LatLng(0, 0),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP]
            }
        };
        var map = new google.maps.Map(this, mapOptions);

        jQuery.getJSON(currMap.attr('data-markers'), function (data) {
            setMarkers(map, data.markers);
        });

        function setMarkers(map, markerData) {
            var bounds = new google.maps.LatLngBounds();
            var image = {
                url: 'images/pin.png',
                size: new google.maps.Size(20, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32)
            };

            for (var i = 0; i < markerData.length; i++) {
                var popup = markerData[i][2];
                var myLatLng = new google.maps.LatLng(markerData[i][0], markerData[i][1]);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: image
                });

                if (popup) {
                    var infobox = new InfoBox({
                        content: document.getElementById(popup),
                        disableAutoPan: false,
                        maxWidth: 150,
                        pixelOffset: new google.maps.Size(-140, 0),
                        zIndex: null,
                        boxStyle: {
                            width: "280px"
                        },
                        closeBoxURL: "",
                        infoBoxClearance: new google.maps.Size(1, 1)
                    });

                    infobox.open(map, marker);

                    jQuery('.map-holder .close').on('click', function (e) {
                        e.preventDefault();
                        infobox.close();
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infobox.open(map, this);
                        map.panTo(myLatLng);
                    });
                }

                bounds.extend(myLatLng);
            }

            map.fitBounds(bounds);
            currMap.data('bounds', bounds);
        }

        function setZoom() {
            var listener = google.maps.event.addListener(map, "idle", function () {
                if (map.getZoom() > zoom) map.setZoom(zoom);
                google.maps.event.removeListener(listener);
            });
        }

        function refreshMap() {
            google.maps.event.trigger(map, 'resize');
            map.fitBounds(currMap.data('bounds'));
            setZoom();
        }

        if (currMap.closest('.tab-content').length) {
            var tabLinks = currMap.closest('.tab-content').siblings('.tabset-holder').find('a[data-toggle="tab"]');

            tabLinks.on('shown.bs.tab', refreshMap);
        }

        setZoom();
        win.on('resize orientationchange', refreshMap);
    });
}

// form validation function
function initValidation() {
    var errorClass = 'error';
    var successClass = 'success';
    var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var regPhone = /^[0-9]+$/;

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

/*
 * jQuery Carousel plugin
 */
;
(function ($) {
    function ScrollGallery(options) {
        this.options = $.extend({
            mask: 'div.mask',
            slider: '>*',
            slides: '>*',
            activeClass: 'active',
            disabledClass: 'disabled',
            btnPrev: 'a.btn-prev',
            btnNext: 'a.btn-next',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            pagerLinks: '.pagination li',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            btnPlayPause: '.btn-play-pause',
            galleryReadyClass: 'gallery-js-ready',
            autorotationActiveClass: 'autorotation-active',
            autorotationDisabledClass: 'autorotation-disabled',
            stretchSlideToMask: false,
            circularRotation: true,
            disableWhileAnimating: false,
            autoRotation: false,
            pauseOnHover: isTouchDevice ? false : true,
            maskAutoSize: false,
            switchTime: 4000,
            animSpeed: 600,
            event: 'click',
            swipeThreshold: 15,
            handleTouch: true,
            vertical: false,
            useTranslate3D: false,
            step: false
        }, options);
        this.init();
    }

    ScrollGallery.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.refreshPosition();
                this.refreshState(true);
                this.resumeRotation();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function () {
            // define dimensions proporties
            this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
            this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
            this.slideSizeFunction = 'outerHeight';
            this.maskSizeProperty = 'height';
            this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

            // control elements
            this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.gallery.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.gallery.find(this.options.btnPrev);
            this.btnNext = this.gallery.find(this.options.btnNext);
            this.currentStep = 0;
            this.stepsCount = 0;

            // get start index
            if (this.options.step === false) {
                var activeSlide = this.slides.filter('.' + this.options.activeClass);
                if (activeSlide.length) {
                    this.currentStep = this.slides.index(activeSlide);
                }
            }

            // calculate offsets
            this.calculateOffsets();

            // create gallery pagination
            if (typeof this.options.generatePagination === 'string') {
                this.pagerLinks = $();
                this.buildPagination();
            } else {
                this.pagerLinks = this.gallery.find(this.options.pagerLinks);
                this.attachPaginationEvents();
            }

            // autorotation control buttons
            this.btnPlay = this.gallery.find(this.options.btnPlay);
            this.btnPause = this.gallery.find(this.options.btnPause);
            this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);

            // misc elements
            this.curNum = this.gallery.find(this.options.currentNumber);
            this.allNum = this.gallery.find(this.options.totalNumber);
        },
        attachEvents: function () {
            // bind handlers scope
            var self = this;
            this.bindHandlers(['onWindowResize']);
            $(window).bind('load resize orientationchange', this.onWindowResize);

            // previous and next button handlers
            if (this.btnPrev.length) {
                this.prevSlideHandler = function (e) {
                    e.preventDefault();
                    self.prevSlide();
                };
                this.btnPrev.bind(this.options.event, this.prevSlideHandler);
            }
            if (this.btnNext.length) {
                this.nextSlideHandler = function (e) {
                    e.preventDefault();
                    self.nextSlide();
                };
                this.btnNext.bind(this.options.event, this.nextSlideHandler);
            }

            // pause on hover handling
            if (this.options.pauseOnHover && !isTouchDevice) {
                this.hoverHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = true;
                        self.pauseRotation();
                    }
                };
                this.leaveHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = false;
                        self.resumeRotation();
                    }
                };
                this.gallery.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }

            // autorotation buttons handler
            if (this.btnPlay.length) {
                this.btnPlayHandler = function (e) {
                    e.preventDefault();
                    self.startRotation();
                };
                this.btnPlay.bind(this.options.event, this.btnPlayHandler);
            }
            if (this.btnPause.length) {
                this.btnPauseHandler = function (e) {
                    e.preventDefault();
                    self.stopRotation();
                };
                this.btnPause.bind(this.options.event, this.btnPauseHandler);
            }
            if (this.btnPlayPause.length) {
                this.btnPlayPauseHandler = function (e) {
                    e.preventDefault();
                    if (!self.gallery.hasClass(self.options.autorotationActiveClass)) {
                        self.startRotation();
                    } else {
                        self.stopRotation();
                    }
                };
                this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
            }

            // enable hardware acceleration
            if (isTouchDevice && this.options.useTranslate3D) {
                this.slider.css({'-webkit-transform': 'translate3d(0px, 0px, 0px)'});
            }

            // swipe event handling
            if (isTouchDevice && this.options.handleTouch && window.Hammer && this.mask.length) {
                this.swipeHandler = new Hammer.Manager(this.mask[0]);
                this.swipeHandler.add(new Hammer.Pan({
                    direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));

                this.swipeHandler.on('panstart', function () {
                    if (self.galleryAnimating) {
                        self.swipeHandler.stop();
                    } else {
                        self.pauseRotation();
                        self.originalOffset = parseFloat(self.slider.css(self.animProperty));
                    }
                }).on('panmove', function (e) {
                    var tmpOffset = self.originalOffset + e[self.options.vertical ? 'deltaY' : 'deltaX'];
                    tmpOffset = Math.max(Math.min(0, tmpOffset), self.maxOffset);
                    self.slider.css(self.animProperty, tmpOffset);
                }).on('panend', function (e) {
                    self.resumeRotation();
                    if (e.distance > self.options.swipeThreshold) {
                        if (e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
                            self.nextSlide();
                        } else {
                            self.prevSlide();
                        }
                    } else {
                        self.switchSlide();
                    }
                });
            }
        },
        onWindowResize: function () {
            if (!this.galleryAnimating) {
                this.calculateOffsets();
                this.refreshPosition();
                this.buildPagination();
                this.refreshState();
                this.resizeQueue = false;
            } else {
                this.resizeQueue = true;
            }
        },
        refreshPosition: function () {
            this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().css(this.tmpProps);
        },
        calculateOffsets: function () {
            var self = this, tmpOffset, tmpStep;
            if (this.options.stretchSlideToMask) {
                var tmpObj = {};
                tmpObj[this.innerSizeFunction] = this.mask[this.innerSizeFunction]();
                this.slides.css(tmpObj);
            }

            this.maskSize = this.mask[this.innerSizeFunction]();
            this.sumSize = this.getSumSize();
            this.maxOffset = this.maskSize - this.sumSize;

            // vertical gallery with single size step custom behavior
            if (this.options.vertical && this.options.maskAutoSize) {
                this.options.step = 1;
                this.stepsCount = this.slides.length;
                this.stepOffsets = [0];
                tmpOffset = 0;
                for (var i = 0; i < this.slides.length; i++) {
                    tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
                    this.stepOffsets.push(tmpOffset);
                }
                this.maxOffset = tmpOffset;
                return;
            }

            // scroll by slide size
            if (typeof this.options.step === 'number' && this.options.step > 0) {
                this.slideDimensions = [];
                this.slides.each($.proxy(function (ind, obj) {
                    self.slideDimensions.push($(obj)[self.fullSizeFunction](true));
                }, this));

                // calculate steps count
                this.stepOffsets = [0];
                this.stepsCount = 1;
                tmpOffset = tmpStep = 0;
                while (tmpOffset > this.maxOffset) {
                    tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
                    tmpStep += this.options.step;
                    this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
                    this.stepsCount++;
                }
            }
            // scroll by mask size
            else {
                // define step size
                this.stepSize = this.maskSize;

                // calculate steps count
                this.stepsCount = 1;
                tmpOffset = 0;
                while (tmpOffset > this.maxOffset) {
                    tmpOffset -= this.stepSize;
                    this.stepsCount++;
                }
            }
        },
        getSumSize: function () {
            var sum = 0;
            this.slides.each($.proxy(function (ind, obj) {
                sum += $(obj)[this.fullSizeFunction](true);
            }, this));
            this.slider.css(this.innerSizeFunction, sum);
            return sum;
        },
        getStepOffset: function (step) {
            step = step || this.currentStep;
            if (typeof this.options.step === 'number') {
                return this.stepOffsets[this.currentStep];
            } else {
                return Math.min(0, Math.max(-this.currentStep * this.stepSize, this.maxOffset));
            }
        },
        getSlideSize: function (i1, i2) {
            var sum = 0;
            for (var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
                sum += this.slideDimensions[i];
            }
            return sum;
        },
        buildPagination: function () {
            if (typeof this.options.generatePagination === 'string') {
                if (!this.pagerHolder) {
                    this.pagerHolder = this.gallery.find(this.options.generatePagination);
                }
                if (this.pagerHolder.length && this.oldStepsCount != this.stepsCount) {
                    this.oldStepsCount = this.stepsCount;
                    this.pagerHolder.empty();
                    this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                    for (var i = 0; i < this.stepsCount; i++) {
                        $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i + 1);
                    }
                    this.pagerLinks = this.pagerList.children();
                    this.attachPaginationEvents();
                }
            }
        },
        attachPaginationEvents: function () {
            var self = this;
            this.pagerLinksHandler = function (e) {
                e.preventDefault();
                self.numSlide(self.pagerLinks.index(e.currentTarget));
            };
            this.pagerLinks.bind(this.options.event, this.pagerLinksHandler);
        },
        prevSlide: function () {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.switchSlide();
                } else if (this.options.circularRotation) {
                    this.currentStep = this.stepsCount - 1;
                    this.switchSlide();
                }
            }
        },
        nextSlide: function (fromAutoRotation) {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if (this.currentStep < this.stepsCount - 1) {
                    this.currentStep++;
                    this.switchSlide();
                } else if (this.options.circularRotation || fromAutoRotation === true) {
                    this.currentStep = 0;
                    this.switchSlide();
                }
            }
        },
        numSlide: function (c) {
            if (this.currentStep != c) {
                this.currentStep = c;
                this.switchSlide();
            }
        },
        switchSlide: function () {
            var self = this;
            this.galleryAnimating = true;
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().animate(this.tmpProps, {
                duration: this.options.animSpeed, complete: function () {
                    // animation complete
                    self.galleryAnimating = false;
                    if (self.resizeQueue) {
                        self.onWindowResize();
                    }

                    // onchange callback
                    self.makeCallback('onChange', self);
                    self.autoRotate();
                }
            });
            this.refreshState();

            // onchange callback
            this.makeCallback('onBeforeChange', this);
        },
        refreshState: function (initial) {
            if (this.options.step === 1 || this.stepsCount === this.slides.length) {
                this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            }
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            this.curNum.html(this.currentStep + 1);
            this.allNum.html(this.stepsCount);

            // initial refresh
            if (this.options.maskAutoSize && typeof this.options.step === 'number') {
                this.tmpProps = {};
                this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep, this.slides.length - 1))[this.slideSizeFunction](true);
                this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
            }

            // disabled state
            if (!this.options.circularRotation) {
                this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
                if (this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
                if (this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
            }

            // add class if not enough slides
            this.gallery.toggleClass('not-enough-slides', this.sumSize <= this.maskSize);
        },
        startRotation: function () {
            this.options.autoRotation = true;
            this.galleryHover = false;
            this.autoRotationStopped = false;
            this.resumeRotation();
        },
        stopRotation: function () {
            this.galleryHover = true;
            this.autoRotationStopped = true;
            this.pauseRotation();
        },
        pauseRotation: function () {
            this.gallery.addClass(this.options.autorotationDisabledClass);
            this.gallery.removeClass(this.options.autorotationActiveClass);
            clearTimeout(this.timer);
        },
        resumeRotation: function () {
            if (!this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.gallery.removeClass(this.options.autorotationDisabledClass);
                this.autoRotate();
            }
        },
        autoRotate: function () {
            var self = this;
            clearTimeout(this.timer);
            if (this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
                this.timer = setTimeout(function () {
                    self.nextSlide(true);
                }, this.options.switchTime);
            } else {
                this.pauseRotation();
            }
        },
        bindHandlers: function (handlersList) {
            var self = this;
            $.each(handlersList, function (index, handler) {
                var origHandler = self[handler];
                self[handler] = function () {
                    return origHandler.apply(self, arguments);
                };
            });
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function () {
            // destroy handler
            $(window).unbind('load resize orientationchange', this.onWindowResize);
            this.btnPrev.unbind(this.options.event, this.prevSlideHandler);
            this.btnNext.unbind(this.options.event, this.nextSlideHandler);
            this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
            this.gallery.unbind('mouseenter', this.hoverHandler);
            this.gallery.unbind('mouseleave', this.leaveHandler);

            // autorotation buttons handlers
            this.stopRotation();
            this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
            this.btnPause.unbind(this.options.event, this.btnPauseHandler);
            this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);

            // destroy swipe handler
            if (this.swipeHandler) {
                this.swipeHandler.destroy();
            }

            // remove inline styles, classes and pagination
            var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
            this.gallery.removeClass(unneededClasses.join(' '));
            this.slider.add(this.slides).removeAttr('style');
            if (typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }
        }
    };

    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.scrollGallery = function (opt) {
        return this.each(function () {
            $(this).data('ScrollGallery', new ScrollGallery($.extend(opt, {holder: this})));
        });
    };
}(jQuery));

/*
 * jQuery SlideShow plugin
 */
;
(function ($) {
    function FadeGallery(options) {
        this.options = $.extend({
            slides: 'ul.slideset > li',
            activeClass: 'active',
            disabledClass: 'disabled',
            btnPrev: 'a.btn-prev',
            btnNext: 'a.btn-next',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            pagerLinks: '.pagination li',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            btnPlayPause: '.btn-play-pause',
            galleryReadyClass: 'gallery-js-ready',
            autorotationActiveClass: 'autorotation-active',
            autorotationDisabledClass: 'autorotation-disabled',
            autorotationStopAfterClick: false,
            circularRotation: true,
            switchSimultaneously: true,
            disableWhileAnimating: false,
            disableFadeIE: false,
            autoRotation: false,
            pauseOnHover: true,
            autoHeight: false,
            useSwipe: false,
            swipeThreshold: 15,
            switchTime: 4000,
            animSpeed: 600,
            event: 'click'
        }, options);
        this.init();
    }

    FadeGallery.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.refreshState(true);
                this.autoRotate();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function () {
            // control elements
            this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.slides = this.gallery.find(this.options.slides);
            this.slidesHolder = this.slides.eq(0).parent();
            this.stepsCount = this.slides.length;
            this.btnPrev = this.gallery.find(this.options.btnPrev);
            this.btnNext = this.gallery.find(this.options.btnNext);
            this.currentIndex = 0;

            // disable fade effect in old IE
            if (this.options.disableFadeIE && !$.support.opacity) {
                this.options.animSpeed = 0;
            }

            // create gallery pagination
            if (typeof this.options.generatePagination === 'string') {
                this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
                this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                for (var i = 0; i < this.stepsCount; i++) {
                    $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i + 1);
                }
                this.pagerLinks = this.pagerList.children();
            } else {
                this.pagerLinks = this.gallery.find(this.options.pagerLinks);
            }

            // get start index
            var activeSlide = this.slides.filter('.' + this.options.activeClass);
            if (activeSlide.length) {
                this.currentIndex = this.slides.index(activeSlide);
            }
            this.prevIndex = this.currentIndex;

            // autorotation control buttons
            this.btnPlay = this.gallery.find(this.options.btnPlay);
            this.btnPause = this.gallery.find(this.options.btnPause);
            this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);

            // misc elements
            this.curNum = this.gallery.find(this.options.currentNumber);
            this.allNum = this.gallery.find(this.options.totalNumber);

            // handle flexible layout
            this.slides.css({display: 'block', opacity: 0}).eq(this.currentIndex).css({
                opacity: ''
            });
        },
        attachEvents: function () {
            var self = this;

            // flexible layout handler
            this.resizeHandler = function () {
                self.onWindowResize();
            };
            $(window).bind('load resize orientationchange', this.resizeHandler);

            if (this.btnPrev.length) {
                this.btnPrevHandler = function (e) {
                    e.preventDefault();
                    self.prevSlide();
                    if (self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.btnPrev.bind(this.options.event, this.btnPrevHandler);
            }
            if (this.btnNext.length) {
                this.btnNextHandler = function (e) {
                    e.preventDefault();
                    self.nextSlide();
                    if (self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.btnNext.bind(this.options.event, this.btnNextHandler);
            }
            if (this.pagerLinks.length) {
                this.pagerLinksHandler = function (e) {
                    e.preventDefault();
                    self.numSlide(self.pagerLinks.index(e.currentTarget));
                    if (self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.pagerLinks.bind(self.options.event, this.pagerLinksHandler);
            }

            // autorotation buttons handler
            if (this.btnPlay.length) {
                this.btnPlayHandler = function (e) {
                    e.preventDefault();
                    self.startRotation();
                };
                this.btnPlay.bind(this.options.event, this.btnPlayHandler);
            }
            if (this.btnPause.length) {
                this.btnPauseHandler = function (e) {
                    e.preventDefault();
                    self.stopRotation();
                };
                this.btnPause.bind(this.options.event, this.btnPauseHandler);
            }
            if (this.btnPlayPause.length) {
                this.btnPlayPauseHandler = function (e) {
                    e.preventDefault();
                    if (!self.gallery.hasClass(self.options.autorotationActiveClass)) {
                        self.startRotation();
                    } else {
                        self.stopRotation();
                    }
                };
                this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
            }

            // swipe gestures handler
            if (this.options.useSwipe && window.Hammer && isTouchDevice) {
                this.swipeHandler = new Hammer.Manager(this.gallery[0]);
                this.swipeHandler.add(new Hammer.Swipe({
                    direction: Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));
                this.swipeHandler.on('swipeleft', function () {
                    self.nextSlide();
                }).on('swiperight', function () {
                    self.prevSlide();
                });
            }

            // pause on hover handling
            if (this.options.pauseOnHover) {
                this.hoverHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = true;
                        self.pauseRotation();
                    }
                };
                this.leaveHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = false;
                        self.resumeRotation();
                    }
                };
                this.gallery.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }
        },
        onWindowResize: function () {
            if (this.options.autoHeight) {
                this.slidesHolder.css({height: this.slides.eq(this.currentIndex).outerHeight(true)});
            }
        },
        prevSlide: function () {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                this.prevIndex = this.currentIndex;
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.switchSlide();
                } else if (this.options.circularRotation) {
                    this.currentIndex = this.stepsCount - 1;
                    this.switchSlide();
                }
            }
        },
        nextSlide: function (fromAutoRotation) {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                this.prevIndex = this.currentIndex;
                if (this.currentIndex < this.stepsCount - 1) {
                    this.currentIndex++;
                    this.switchSlide();
                } else if (this.options.circularRotation || fromAutoRotation === true) {
                    this.currentIndex = 0;
                    this.switchSlide();
                }
            }
        },
        numSlide: function (c) {
            if (this.currentIndex != c) {
                this.prevIndex = this.currentIndex;
                this.currentIndex = c;
                this.switchSlide();
            }
        },
        switchSlide: function () {
            var self = this;
            if (this.slides.length > 1) {
                this.galleryAnimating = true;
                if (!this.options.animSpeed) {
                    this.slides.eq(this.prevIndex).css({opacity: 0});
                } else {
                    this.slides.eq(this.prevIndex).stop().animate({opacity: 0}, {duration: this.options.animSpeed});
                }

                this.switchNext = function () {
                    if (!self.options.animSpeed) {
                        self.slides.eq(self.currentIndex).css({opacity: ''});
                    } else {
                        self.slides.eq(self.currentIndex).stop().animate({opacity: 1}, {duration: self.options.animSpeed});
                    }
                    clearTimeout(this.nextTimer);
                    this.nextTimer = setTimeout(function () {
                        self.slides.eq(self.currentIndex).css({opacity: ''});
                        self.galleryAnimating = false;
                        self.autoRotate();

                        // onchange callback
                        self.makeCallback('onChange', self);
                    }, self.options.animSpeed);
                };

                if (this.options.switchSimultaneously) {
                    self.switchNext();
                } else {
                    clearTimeout(this.switchTimer);
                    this.switchTimer = setTimeout(function () {
                        self.switchNext();
                    }, this.options.animSpeed);
                }
                this.refreshState();

                // onchange callback
                this.makeCallback('onBeforeChange', this);
            }
        },
        refreshState: function (initial) {
            this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.curNum.html(this.currentIndex + 1);
            this.allNum.html(this.stepsCount);

            // initial refresh
            if (this.options.autoHeight) {
                if (initial) {
                    this.slidesHolder.css({height: this.slides.eq(this.currentIndex).outerHeight(true)});
                } else {
                    this.slidesHolder.stop().animate({height: this.slides.eq(this.currentIndex).outerHeight(true)}, {duration: this.options.animSpeed});
                }
            }

            // disabled state
            if (!this.options.circularRotation) {
                this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
                if (this.currentIndex === 0) this.btnPrev.addClass(this.options.disabledClass);
                if (this.currentIndex === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
            }

            // add class if not enough slides
            this.gallery.toggleClass('not-enough-slides', this.stepsCount === 1);
        },
        startRotation: function () {
            this.options.autoRotation = true;
            this.galleryHover = false;
            this.autoRotationStopped = false;
            this.resumeRotation();
        },
        stopRotation: function () {
            this.galleryHover = true;
            this.autoRotationStopped = true;
            this.pauseRotation();
        },
        pauseRotation: function () {
            this.gallery.addClass(this.options.autorotationDisabledClass);
            this.gallery.removeClass(this.options.autorotationActiveClass);
            clearTimeout(this.timer);
        },
        resumeRotation: function () {
            if (!this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.gallery.removeClass(this.options.autorotationDisabledClass);
                this.autoRotate();
            }
        },
        autoRotate: function () {
            var self = this;
            clearTimeout(this.timer);
            if (this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.timer = setTimeout(function () {
                    self.nextSlide(true);
                }, this.options.switchTime);
            } else {
                this.pauseRotation();
            }
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function () {
            // navigation buttons handler
            this.btnPrev.unbind(this.options.event, this.btnPrevHandler);
            this.btnNext.unbind(this.options.event, this.btnNextHandler);
            this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
            $(window).unbind('load resize orientationchange', this.resizeHandler);

            // remove autorotation handlers
            this.stopRotation();
            this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
            this.btnPause.unbind(this.options.event, this.btnPauseHandler);
            this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);
            this.gallery.unbind('mouseenter', this.hoverHandler);
            this.gallery.unbind('mouseleave', this.leaveHandler);

            // remove swipe handler if used
            if (this.swipeHandler) {
                this.swipeHandler.destroy();
            }
            if (typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }

            // remove unneeded classes and styles
            var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
            this.gallery.removeClass(unneededClasses.join(' '));
            this.slidesHolder.add(this.slides).removeAttr('style');
        }
    };

    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.fadeGallery = function (opt) {
        return this.each(function () {
            $(this).data('FadeGallery', new FadeGallery($.extend(opt, {holder: this})));
        });
    };
}(jQuery));

/*
 * Popups plugin
 */
;
(function ($) {
    function ContentPopup(opt) {
        this.options = $.extend({
            holder: null,
            popup: '.popup',
            btnOpen: '.open',
            btnClose: '.close',
            openClass: 'popup-active',
            clickEvent: 'click',
            mode: 'click',
            hideOnClickLink: true,
            hideOnClickOutside: true,
            delay: 50
        }, opt);
        if (this.options.holder) {
            this.holder = $(this.options.holder);
            this.init();
        }
    }

    ContentPopup.prototype = {
        init: function () {
            this.findElements();
            this.attachEvents();
        },
        findElements: function () {
            this.popup = this.holder.find(this.options.popup);
            this.btnOpen = this.holder.find(this.options.btnOpen);
            this.btnClose = this.holder.find(this.options.btnClose);
        },
        attachEvents: function () {
            // handle popup openers
            var self = this;
            this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

            if (this.clickMode) {
                // handle click mode
                this.btnOpen.bind(self.options.clickEvent, function (e) {
                    if (self.holder.hasClass(self.options.openClass)) {
                        if (self.options.hideOnClickLink) {
                            self.hidePopup();
                        }
                    } else {
                        self.showPopup();
                    }
                    e.preventDefault();
                });

                // prepare outside click handler
                this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
            } else {
                // handle hover mode
                var timer, delayedFunc = function (func) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        func.call(self);
                    }, self.options.delay);
                };
                this.btnOpen.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
                this.popup.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
            }

            // handle close buttons
            this.btnClose.bind(self.options.clickEvent, function (e) {
                self.hidePopup();
                e.preventDefault();
            });
        },
        outsideClickHandler: function (e) {
            // hide popup if clicked outside
            var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
            if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
                this.hidePopup();
            }
        },
        showPopup: function () {
            // reveal popup
            this.holder.addClass(this.options.openClass);
            this.popup.css({display: 'block'});

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
                this.outsideHandlerActive = true;
                $(document).bind('click touchstart', this.outsideClickHandler);
            }
        },
        hidePopup: function () {
            // hide popup
            this.holder.removeClass(this.options.openClass);
            this.popup.css({display: 'none'});

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
                this.outsideHandlerActive = false;
                $(document).unbind('click touchstart', this.outsideClickHandler);
            }
        },
        bind: function (f, scope, forceArgs) {
            return function () {
                return f.apply(scope, forceArgs ? [forceArgs] : arguments);
            };
        }
    };

    // detect touch devices
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jQuery plugin interface
    $.fn.contentPopup = function (opt) {
        return this.each(function () {
            new ContentPopup($.extend(opt, {holder: this}));
        });
    };
}(jQuery));

/*
 * jQuery SameHeight plugin
 */
;
(function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }

            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize refreshHeight', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;
            var isBorderBox = element.css('boxSizing') === 'border-box' || element.css('-moz-box-sizing') === 'border-box' || element.css('-webkit-box-sizing') === 'border-box';

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (parent.is(this)) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));

/*
 * Add class plugin
 */
jQuery.fn.clickClass = function (opt) {
    var options = jQuery.extend({
        classAdd: 'add-class',
        addToParent: false,
        event: 'click'
    }, opt);

    return this.each(function () {
        var classItem = jQuery(this);
        if (options.addToParent) {
            if (typeof options.addToParent === 'boolean') {
                classItem = classItem.parent();
            } else {
                classItem = classItem.parents('.' + options.addToParent);
            }
        }
        jQuery(this).bind(options.event, function (e) {
            classItem.toggleClass(options.classAdd);
            e.preventDefault();
        });
    });
};

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function ($) {
    $(function () {
        var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
        var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

        // required styles
        resizeFrame.css({
            width: '100em',
            height: '10px',
            position: 'absolute',
            borderWidth: 0,
            top: '-9999px',
            left: '-9999px'
        }).appendTo('body');

        // use native IE resize event if possible
        if (window.attachEvent && !window.addEventListener) {
            resizeFrame.bind('resize', function () {
                $.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
            });
        }
        // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame[0].contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
        jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
    });
    return {
        // public method, so it can be called from within the iframe
        trigger: function (em) {
            $(window).trigger("fontresize", [em]);
        }
    };
}(jQuery));

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;
(function (window, document, $) {

    // Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var prototype = $.fn;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function () {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function () {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function (element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function (element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function () {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function () {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function () {
                    $inputs.each(setPlaceholder);
                }, 10);

            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function () {
            $('.placeholder').each(function () {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function (i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({'type': 'text'});
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {'type': 'text'}));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (err) {
        }
    }

}(this, document, jQuery));

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.jcf = factory(jQuery);
    }
}(this, function ($) {
    'use strict';

    // private variables
    var customInstances = [];

    // default global options
    var commonOptions = {
        optionsKey: 'jcf',
        dataKey: 'jcf-instance',
        rtlClass: 'jcf-rtl',
        focusClass: 'jcf-focus',
        pressedClass: 'jcf-pressed',
        disabledClass: 'jcf-disabled',
        hiddenClass: 'jcf-hidden',
        resetAppearanceClass: 'jcf-reset-appearance',
        unselectableClass: 'jcf-unselectable'
    };

    // detect device type
    var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
    commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

    // create global stylesheet if custom forms are used
    var createStyleSheet = function () {
        var styleTag = $('<style>').appendTo('head'),
            styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

        // crossbrowser style handling
        var addCSSRule = function (selector, rules, index) {
            if (styleSheet.insertRule) {
                styleSheet.insertRule(selector + '{' + rules + '}', index);
            } else {
                styleSheet.addRule(selector, rules, index);
            }
        };

        // add special rules
        addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
        addCSSRule('.' + commonOptions.rtlClass + '.' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
        addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;');
        addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

        // detect rtl pages
        var html = $('html'), body = $('body');
        if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
            html.addClass(commonOptions.rtlClass);
        }

        // handle form reset event
        html.on('reset', function () {
            setTimeout(function () {
                api.refreshAll();
            }, 0);
        });

        // mark stylesheet as created
        commonOptions.styleSheetCreated = true;
    };

    // simplified pointer events handler
    (function () {
        var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
            touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            eventList, eventMap = {}, eventPrefix = 'jcf-';

        // detect events to attach
        if (pointerEventsSupported) {
            eventList = {
                pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
                pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
                pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
                pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
            };
        } else {
            eventList = {
                pointerover: 'mouseover',
                pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
                pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
                pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
            };
        }

        // create event map
        $.each(eventList, function (targetEventName, fakeEventList) {
            $.each(fakeEventList.split(' '), function (index, fakeEventName) {
                eventMap[fakeEventName] = targetEventName;
            });
        });

        // jQuery event hooks
        $.each(eventList, function (eventName, eventHandlers) {
            eventHandlers = eventHandlers.split(' ');
            $.event.special[eventPrefix + eventName] = {
                setup: function () {
                    var self = this;
                    $.each(eventHandlers, function (index, fallbackEvent) {
                        if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
                        else self['on' + fallbackEvent] = fixEvent;
                    });
                },
                teardown: function () {
                    var self = this;
                    $.each(eventHandlers, function (index, fallbackEvent) {
                        if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
                        else self['on' + fallbackEvent] = null;
                    });
                }
            };
        });

        // check that mouse event are not simulated by mobile browsers
        var lastTouch = null;
        var mouseEventSimulated = function (e) {
            var dx = Math.abs(e.pageX - lastTouch.x),
                dy = Math.abs(e.pageY - lastTouch.y),
                rangeDistance = 25;

            if (dx <= rangeDistance && dy <= rangeDistance) {
                return true;
            }
        };

        // normalize event
        var fixEvent = function (e) {
            var origEvent = e || window.event,
                touchEventData = null,
                targetEventName = eventMap[origEvent.type];

            e = $.event.fix(origEvent);
            e.type = eventPrefix + targetEventName;

            if (origEvent.pointerType) {
                switch (origEvent.pointerType) {
                    case 2:
                        e.pointerType = 'touch';
                        break;
                    case 3:
                        e.pointerType = 'pen';
                        break;
                    case 4:
                        e.pointerType = 'mouse';
                        break;
                    default:
                        e.pointerType = origEvent.pointerType;
                }
            } else {
                e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
            }

            if (!e.pageX && !e.pageY) {
                touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
                e.pageX = touchEventData.pageX;
                e.pageY = touchEventData.pageY;
            }

            if (origEvent.type === 'touchend') {
                lastTouch = {x: e.pageX, y: e.pageY};
            }
            if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
                return;
            } else {
                return ($.event.dispatch || $.event.handle).call(this, e);
            }
        };
    }());

    // custom mousewheel/trackpad handler
    (function () {
        var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
            shimEventName = 'jcf-mousewheel';

        $.event.special[shimEventName] = {
            setup: function () {
                var self = this;
                $.each(wheelEvents, function (index, fallbackEvent) {
                    if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
                    else self['on' + fallbackEvent] = fixEvent;
                });
            },
            teardown: function () {
                var self = this;
                $.each(wheelEvents, function (index, fallbackEvent) {
                    if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
                    else self['on' + fallbackEvent] = null;
                });
            }
        };

        var fixEvent = function (e) {
            var origEvent = e || window.event;
            e = $.event.fix(origEvent);
            e.type = shimEventName;

            // old wheel events handler
            if ('detail'      in origEvent) {
                e.deltaY = -origEvent.detail;
            }
            if ('wheelDelta'  in origEvent) {
                e.deltaY = -origEvent.wheelDelta;
            }
            if ('wheelDeltaY' in origEvent) {
                e.deltaY = -origEvent.wheelDeltaY;
            }
            if ('wheelDeltaX' in origEvent) {
                e.deltaX = -origEvent.wheelDeltaX;
            }

            // modern wheel event handler
            if ('deltaY' in origEvent) {
                e.deltaY = origEvent.deltaY;
            }
            if ('deltaX' in origEvent) {
                e.deltaX = origEvent.deltaX;
            }

            // handle deltaMode for mouse wheel
            e.delta = e.deltaY || e.deltaX;
            if (origEvent.deltaMode === 1) {
                var lineHeight = 16;
                e.delta *= lineHeight;
                e.deltaY *= lineHeight;
                e.deltaX *= lineHeight;
            }

            return ($.event.dispatch || $.event.handle).call(this, e);
        };
    }());

    // extra module methods
    var moduleMixin = {
        // provide function for firing native events
        fireNativeEvent: function (elements, eventName) {
            $(elements).each(function () {
                var element = this, eventObject;
                if (element.dispatchEvent) {
                    eventObject = document.createEvent('HTMLEvents');
                    eventObject.initEvent(eventName, true, true);
                    element.dispatchEvent(eventObject);
                } else if (document.createEventObject) {
                    eventObject = document.createEventObject();
                    eventObject.target = element;
                    element.fireEvent('on' + eventName, eventObject);
                }
            });
        },
        // bind event handlers for module instance (functions beggining with "on")
        bindHandlers: function () {
            var self = this;
            $.each(self, function (propName, propValue) {
                if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
                    // dont use $.proxy here because it doesn't create unique handler
                    self[propName] = function () {
                        return propValue.apply(self, arguments);
                    };
                }
            });
        }
    };

    // public API
    var api = {
        modules: {},
        getOptions: function () {
            return $.extend({}, commonOptions);
        },
        setOptions: function (moduleName, moduleOptions) {
            if (arguments.length > 1) {
                // set module options
                if (this.modules[moduleName]) {
                    $.extend(this.modules[moduleName].prototype.options, moduleOptions);
                }
            } else {
                // set common options
                $.extend(commonOptions, moduleName);
            }
        },
        addModule: function (proto) {
            // add module to list
            var Module = function (options) {
                // save instance to collection
                options.element.data(commonOptions.dataKey, this);
                customInstances.push(this);

                // save options
                this.options = $.extend({}, commonOptions, this.options, options.element.data(commonOptions.optionsKey), options);

                // bind event handlers to instance
                this.bindHandlers();

                // call constructor
                this.init.apply(this, arguments);
            };

            // set proto as prototype for new module
            Module.prototype = proto;

            // add mixin methods to module proto
            $.extend(proto, moduleMixin);
            if (proto.plugins) {
                $.each(proto.plugins, function (pluginName, plugin) {
                    $.extend(plugin.prototype, moduleMixin);
                });
            }

            // override destroy method
            var originalDestroy = Module.prototype.destroy;
            Module.prototype.destroy = function () {
                this.options.element.removeData(this.options.dataKey);

                for (var i = customInstances.length - 1; i >= 0; i--) {
                    if (customInstances[i] === this) {
                        customInstances.splice(i, 1);
                        break;
                    }
                }

                if (originalDestroy) {
                    originalDestroy.apply(this, arguments);
                }
            };

            // save module to list
            this.modules[proto.name] = Module;
        },
        getInstance: function (element) {
            return $(element).data(commonOptions.dataKey);
        },
        replace: function (elements, moduleName, customOptions) {
            var self = this,
                instance;

            if (!commonOptions.styleSheetCreated) {
                createStyleSheet();
            }

            $(elements).each(function () {
                var moduleOptions,
                    element = $(this);

                instance = element.data(commonOptions.dataKey);
                if (instance) {
                    instance.refresh();
                } else {
                    if (!moduleName) {
                        $.each(self.modules, function (currentModuleName, module) {
                            if (module.prototype.matchElement.call(module.prototype, element)) {
                                moduleName = currentModuleName;
                                return false;
                            }
                        });
                    }
                    if (moduleName) {
                        moduleOptions = $.extend({element: element}, customOptions);
                        instance = new self.modules[moduleName](moduleOptions);
                    }
                }
            });
            return instance;
        },
        refresh: function (elements) {
            $(elements).each(function () {
                var instance = $(this).data(commonOptions.dataKey);
                if (instance) {
                    instance.refresh();
                }
            });
        },
        destroy: function (elements) {
            $(elements).each(function () {
                var instance = $(this).data(commonOptions.dataKey);
                if (instance) {
                    instance.destroy();
                }
            });
        },
        replaceAll: function (context) {
            var self = this;
            $.each(this.modules, function (moduleName, module) {
                $(module.prototype.selector, context).each(function () {
                    self.replace(this, moduleName);
                });
            });
        },
        refreshAll: function (context) {
            if (context) {
                $.each(this.modules, function (moduleName, module) {
                    $(module.prototype.selector, context).each(function () {
                        var instance = $(this).data(commonOptions.dataKey);
                        if (instance) {
                            instance.refresh();
                        }
                    });
                });
            } else {
                for (var i = customInstances.length - 1; i >= 0; i--) {
                    customInstances[i].refresh();
                }
            }
        },
        destroyAll: function (context) {
            var self = this;
            if (context) {
                $.each(this.modules, function (moduleName, module) {
                    $(module.prototype.selector, context).each(function (index, element) {
                        var instance = $(element).data(commonOptions.dataKey);
                        if (instance) {
                            instance.destroy();
                        }
                    });
                });
            } else {
                while (customInstances.length) {
                    customInstances[0].destroy();
                }
            }
        }
    };

    return api;
}));

/*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Select',
        selector: 'select',
        options: {
            element: null
        },
        plugins: {
            ListBox: ListBox,
            ComboBox: ComboBox,
            SelectList: SelectList
        },
        matchElement: function (element) {
            return element.is('select');
        },
        init: function () {
            this.element = $(this.options.element);
            this.createInstance();
        },
        isListBox: function () {
            return this.element.is('[size]:not([jcf-size]), [multiple]');
        },
        createInstance: function () {
            if (this.instance) {
                this.instance.destroy();
            }
            if (this.isListBox()) {
                this.instance = new ListBox(this.options);
            } else {
                this.instance = new ComboBox(this.options);
            }
        },
        refresh: function () {
            var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
                (!this.isListBox() && this.instance instanceof ListBox);

            if (typeMismatch) {
                this.createInstance();
            } else {
                this.instance.refresh();
            }
        },
        destroy: function () {
            this.instance.destroy();
        }
    });

    // combobox module
    function ComboBox(options) {
        this.options = $.extend({
            wrapNative: true,
            wrapNativeOnMobile: true,
            fakeDropInBody: true,
            useCustomScroll: true,
            flipDropToFit: true,
            maxVisibleItems: 10,
            fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
            fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
            optionClassPrefix: 'jcf-option-',
            selectClassPrefix: 'jcf-select-',
            dropContentSelector: '.jcf-select-drop-content',
            selectTextSelector: '.jcf-select-text',
            dropActiveClass: 'jcf-drop-active',
            flipDropClass: 'jcf-drop-flipped'
        }, options);
        this.init();
    }

    $.extend(ComboBox.prototype, {
        init: function (options) {
            this.initStructure();
            this.bindHandlers();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            // prepare structure
            this.win = $(window);
            this.doc = $(document);
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
            this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
            this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
            makeUnselectable(this.fakeElement);

            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

            // detect device type and dropdown behavior
            if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
                this.options.wrapNative = true;
            }

            if (this.options.wrapNative) {
                // wrap native select inside fake block
                this.realElement.prependTo(this.fakeElement).css({
                    position: 'absolute',
                    height: '100%',
                    width: '100%'
                }).addClass(this.options.resetAppearanceClass);
            } else {
                // just hide native select
                this.realElement.addClass(this.options.hiddenClass);
                this.fakeElement.attr('title', this.realElement.attr('title'));
                this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
            }
        },
        attachEvents: function () {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function () {
                setTimeout(function () {
                    self.refresh();
                    if (self.list) {
                        self.list.refresh();
                    }
                }, 1);
            };

            // native dropdown event handlers
            if (this.options.wrapNative) {
                this.realElement.on({
                    focus: this.onFocus,
                    change: this.onChange,
                    click: this.onChange,
                    keydown: this.onChange
                });
            } else {
                // custom dropdown event handlers
                this.realElement.on({
                    focus: this.onFocus,
                    change: this.onChange,
                    keydown: this.onKeyDown
                });
                this.fakeElement.on({
                    'jcf-pointerdown': this.onSelectAreaPress
                });
            }
        },
        onKeyDown: function (e) {
            if (e.which === 13) {
                this.toggleDropdown();
            } else if (this.dropActive) {
                this.delayedRefresh();
            }
        },
        onChange: function () {
            this.refresh();
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
                this.toggleListMode(true);
                this.focusedFlag = true;
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
                this.toggleListMode(false);
                this.focusedFlag = false;
            }
        },
        onResize: function () {
            if (this.dropActive) {
                this.hideDropdown();
            }
        },
        onSelectDropPress: function () {
            this.pressedFlag = true;
        },
        onSelectDropRelease: function (e, pointerEvent) {
            this.pressedFlag = false;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onSelectAreaPress: function (e) {
            // skip click if drop inside fake element or real select is disabled
            var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
            if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
                return;
            }

            // toggle dropdown visibility
            this.selectOpenedByEvent = e.pointerType;
            this.toggleDropdown();

            // misc handlers
            if (!this.focusedFlag) {
                if (e.pointerType === 'mouse') {
                    this.realElement.focus();
                } else {
                    this.onFocus(e);
                }
            }
            this.pressedFlag = true;
            this.fakeElement.addClass(this.options.pressedClass);
            this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
        },
        onSelectAreaRelease: function (e) {
            if (this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = false;
            this.fakeElement.removeClass(this.options.pressedClass);
            this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
        },
        onOutsideClick: function (e) {
            var target = $(e.target),
                clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

            if (!clickedInsideSelect) {
                this.hideDropdown();
            }
        },
        onSelect: function () {
            this.hideDropdown();
            this.refresh();
            this.fireNativeEvent(this.realElement, 'change');
        },
        toggleListMode: function (state) {
            if (!this.options.wrapNative) {
                if (state) {
                    // temporary change select to list to avoid appearing of native dropdown
                    this.realElement.attr({
                        size: 4,
                        'jcf-size': ''
                    });
                } else {
                    // restore select from list mode to dropdown select
                    if (!this.options.wrapNative) {
                        this.realElement.removeAttr('size jcf-size');
                    }
                }
            }
        },
        createDropdown: function () {
            // destroy previous dropdown if needed
            if (this.dropdown) {
                this.list.destroy();
                this.dropdown.remove();
            }

            // create new drop container
            this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
            this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
            makeUnselectable(this.dropdown);

            // set initial styles for dropdown in body
            if (this.options.fakeDropInBody) {
                this.dropdown.css({
                    position: 'absolute',
                    top: -9999
                });
            }

            // create new select list instance
            this.list = new SelectList({
                useHoverClass: true,
                handleResize: false,
                alwaysPreventMouseWheel: true,
                maxVisibleItems: this.options.maxVisibleItems,
                useCustomScroll: this.options.useCustomScroll,
                holder: this.dropdown.find(this.options.dropContentSelector),
                element: this.realElement
            });
            $(this.list).on({
                select: this.onSelect,
                press: this.onSelectDropPress,
                release: this.onSelectDropRelease
            });
        },
        repositionDropdown: function () {
            var selectOffset = this.fakeElement.offset(),
                selectWidth = this.fakeElement.outerWidth(),
                selectHeight = this.fakeElement.outerHeight(),
                dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
                winScrollTop = this.win.scrollTop(),
                winHeight = this.win.height(),
                calcTop, calcLeft, bodyOffset, needFlipDrop = false;

            // check flip drop position
            if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
                needFlipDrop = true;
            }

            if (this.options.fakeDropInBody) {
                bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
                if (this.options.flipDropToFit && needFlipDrop) {
                    // calculate flipped dropdown position
                    calcLeft = selectOffset.left;
                    calcTop = selectOffset.top - dropHeight - bodyOffset;
                } else {
                    // calculate default drop position
                    calcLeft = selectOffset.left;
                    calcTop = selectOffset.top + selectHeight - bodyOffset;
                }

                // update drop styles
                this.dropdown.css({
                    width: selectWidth,
                    left: calcLeft,
                    top: calcTop
                });
            }

            // refresh flipped class
            this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
        },
        showDropdown: function () {
            // do not show empty custom dropdown 
            if (!this.realElement.prop('options').length) {
                return;
            }

            // create options list if not created
            if (!this.dropdown) {
                this.createDropdown();
            }

            // show dropdown
            this.dropActive = true;
            this.dropdown.appendTo(this.fakeDropTarget);
            this.fakeElement.addClass(this.options.dropActiveClass);
            this.refreshSelectedText();
            this.repositionDropdown();
            this.list.setScrollTop(this.savedScrollTop);
            this.list.refresh();

            // add temporary event handlers
            this.win.on('resize', this.onResize);
            this.doc.on('jcf-pointerdown', this.onOutsideClick);
        },
        hideDropdown: function () {
            if (this.dropdown) {
                this.savedScrollTop = this.list.getScrollTop();
                this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
                this.dropdown.removeClass(this.options.flipDropClass).detach();
                this.doc.off('jcf-pointerdown', this.onOutsideClick);
                this.win.off('resize', this.onResize);
                this.dropActive = false;
                if (this.selectOpenedByEvent === 'touch') {
                    this.onBlur();
                }
            }
        },
        toggleDropdown: function () {
            if (this.dropActive) {
                this.hideDropdown();
            } else {
                this.showDropdown();
            }
        },
        refreshSelectedText: function () {
            // redraw selected area
            var selectedIndex = this.realElement.prop('selectedIndex'),
                selectedOption = this.realElement.prop('options')[selectedIndex],
                selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
                selectedOptionClasses,
                selectedFakeElement;

            if (!selectedOption) {
                if (this.selectImage) {
                    this.selectImage.hide();
                }
                this.selectText.removeAttr('class').empty();
            } else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
                selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
                this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

                if (selectedOptionImage) {
                    if (!this.selectImage) {
                        this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
                    }
                    this.selectImage.attr('src', selectedOptionImage).show();
                } else if (this.selectImage) {
                    this.selectImage.hide();
                }

                this.currentSelectedText = selectedOption.innerHTML;
                this.currentSelectedImage = selectedOptionImage;
            }
        },
        refresh: function () {
            // refresh fake select visibility
            if (this.realElement.prop('style').display === 'none') {
                this.fakeElement.hide();
            } else {
                this.fakeElement.show();
            }

            // refresh selected text
            this.refreshSelectedText();

            // handle disabled state
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
        },
        destroy: function () {
            // restore structure
            if (this.options.wrapNative) {
                this.realElement.insertBefore(this.fakeElement).css({
                    position: '',
                    height: '',
                    width: ''
                }).removeClass(this.options.resetAppearanceClass);
            } else {
                this.realElement.removeClass(this.options.hiddenClass);
                if (this.realElement.is('[jcf-size]')) {
                    this.realElement.removeAttr('size jcf-size');
                }
            }

            // removing element will also remove its event handlers
            this.fakeElement.remove();

            // remove other event handlers
            this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
            this.realElement.off({
                focus: this.onFocus
            });
        }
    });

    // listbox module
    function ListBox(options) {
        this.options = $.extend({
            wrapNative: true,
            useCustomScroll: true,
            fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
            selectClassPrefix: 'jcf-select-',
            listHolder: '.jcf-list-wrapper'
        }, options);
        this.init();
    }

    $.extend(ListBox.prototype, {
        init: function (options) {
            this.bindHandlers();
            this.initStructure();
            this.attachEvents();
        },
        initStructure: function () {
            var self = this;
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
            this.listHolder = this.fakeElement.find(this.options.listHolder);
            makeUnselectable(this.fakeElement);

            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
            this.realElement.addClass(this.options.hiddenClass);

            this.list = new SelectList({
                useCustomScroll: this.options.useCustomScroll,
                holder: this.listHolder,
                selectOnClick: false,
                element: this.realElement
            });
        },
        attachEvents: function () {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function (e) {
                if (e && e.keyCode == 16) {
                    // ignore SHIFT key
                    return;
                } else {
                    clearTimeout(self.refreshTimer);
                    self.refreshTimer = setTimeout(function () {
                        self.refresh();
                    }, 1);
                }
            };

            // other event handlers
            this.realElement.on({
                focus: this.onFocus,
                click: this.delayedRefresh,
                keydown: this.delayedRefresh
            });

            // select list event handlers
            $(this.list).on({
                select: this.onSelect,
                press: this.onFakeOptionsPress,
                release: this.onFakeOptionsRelease
            });
        },
        onFakeOptionsPress: function (e, pointerEvent) {
            this.pressedFlag = true;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onFakeOptionsRelease: function (e, pointerEvent) {
            this.pressedFlag = false;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onSelect: function () {
            this.fireNativeEvent(this.realElement, 'change');
            this.fireNativeEvent(this.realElement, 'click');
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
                this.focusedFlag = true;
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
                this.focusedFlag = false;
            }
        },
        refresh: function () {
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
            this.list.refresh();
        },
        destroy: function () {
            this.list.destroy();
            this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
            this.fakeElement.remove();
        }
    });

    // options list module
    function SelectList(options) {
        this.options = $.extend({
            holder: null,
            maxVisibleItems: 10,
            selectOnClick: true,
            useHoverClass: false,
            useCustomScroll: false,
            handleResize: true,
            alwaysPreventMouseWheel: false,
            indexAttribute: 'data-index',
            cloneClassPrefix: 'jcf-option-',
            containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
            containerSelector: '.jcf-list-content',
            captionClass: 'jcf-optgroup-caption',
            disabledClass: 'jcf-disabled',
            optionClass: 'jcf-option',
            groupClass: 'jcf-optgroup',
            hoverClass: 'jcf-hover',
            selectedClass: 'jcf-selected',
            scrollClass: 'jcf-scroll-active'
        }, options);
        this.init();
    }

    $.extend(SelectList.prototype, {
        init: function () {
            this.initStructure();
            this.refreshSelectedClass();
            this.attachEvents();
        },
        initStructure: function () {
            this.element = $(this.options.element);
            this.indexSelector = '[' + this.options.indexAttribute + ']';
            this.container = $(this.options.containerStructure).appendTo(this.options.holder);
            this.listHolder = this.container.find(this.options.containerSelector);
            this.lastClickedIndex = this.element.prop('selectedIndex');
            this.rebuildList();
        },
        attachEvents: function () {
            this.bindHandlers();
            this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
            this.listHolder.on('jcf-pointerdown', this.onPress);

            if (this.options.useHoverClass) {
                this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
            }
        },
        onPress: function (e) {
            $(this).trigger('press', e);
            this.listHolder.on('jcf-pointerup', this.onRelease);
        },
        onRelease: function (e) {
            $(this).trigger('release', e);
            this.listHolder.off('jcf-pointerup', this.onRelease);
        },
        onHoverItem: function (e) {
            var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
            this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
        },
        onItemPress: function (e) {
            if (e.pointerType === 'touch' || this.options.selectOnClick) {
                // select option after "click"
                this.tmpListOffsetTop = this.list.offset().top;
                this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
            } else {
                // select option immediately
                this.onSelectItem(e);
            }
        },
        onItemRelease: function (e) {
            // remove event handlers and temporary data
            this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

            // simulate item selection
            if (this.tmpListOffsetTop === this.list.offset().top) {
                this.listHolder.on('click', this.indexSelector, this.onSelectItem);
            }
            delete this.tmpListOffsetTop;
        },
        onSelectItem: function (e) {
            var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
                range;

            // remove click event handler
            this.listHolder.off('click', this.indexSelector, this.onSelectItem);

            // ignore clicks on disabled options
            if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
                return;
            }

            if (this.element.prop('multiple')) {
                if (e.metaKey || e.ctrlKey || e.pointerType === 'touch') {
                    // if CTRL/CMD pressed or touch devices - toggle selected option
                    this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
                } else if (e.shiftKey) {
                    // if SHIFT pressed - update selection
                    range = [this.lastClickedIndex, clickedIndex].sort(function (a, b) {
                        return a - b;
                    });
                    this.realOptions.each(function (index, option) {
                        option.selected = (index >= range[0] && index <= range[1]);
                    });
                } else {
                    // set single selected index
                    this.element.prop('selectedIndex', clickedIndex);
                }
            } else {
                this.element.prop('selectedIndex', clickedIndex);
            }

            // save last clicked option
            if (!e.shiftKey) {
                this.lastClickedIndex = clickedIndex;
            }

            // refresh classes
            this.refreshSelectedClass();

            // scroll to active item in desktop browsers
            if (e.pointerType === 'mouse') {
                this.scrollToActiveOption();
            }

            // make callback when item selected
            $(this).trigger('select');
        },
        rebuildList: function () {
            // rebuild options
            var self = this,
                rootElement = this.element[0];

            // recursively create fake options
            this.storedSelectHTML = rootElement.innerHTML;
            this.optionIndex = 0;
            this.list = $(this.createOptionsList(rootElement));
            this.listHolder.empty().append(this.list);
            this.realOptions = this.element.find('option');
            this.fakeOptions = this.list.find(this.indexSelector);
            this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
            delete this.optionIndex;

            // detect max visible items
            var maxCount = this.options.maxVisibleItems,
                sizeValue = this.element.prop('size');
            if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
                maxCount = sizeValue;
            }

            // handle scrollbar
            var needScrollBar = this.fakeOptions.length > maxCount;
            this.container.toggleClass(this.options.scrollClass, needScrollBar);
            if (needScrollBar) {
                // change max-height
                this.listHolder.css({
                    maxHeight: this.getOverflowHeight(maxCount),
                    overflow: 'auto'
                });

                if (this.options.useCustomScroll && jcf.modules.Scrollable) {
                    // add custom scrollbar if specified in options
                    jcf.replace(this.listHolder, 'Scrollable', {
                        handleResize: this.options.handleResize,
                        alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
                    });
                    return;
                }
            }

            // disable edge wheel scrolling
            if (this.options.alwaysPreventMouseWheel) {
                this.preventWheelHandler = function (e) {
                    var currentScrollTop = self.listHolder.scrollTop(),
                        maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight(),
                        maxScrollLeft = self.listHolder.prop('scrollWidth') - self.listHolder.innerWidth();

                    // check edge cases
                    if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
                        e.preventDefault();
                    }
                };
                this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
            }
        },
        refreshSelectedClass: function () {
            var self = this,
                selectedItem,
                isMultiple = this.element.prop('multiple'),
                selectedIndex = this.element.prop('selectedIndex');

            if (isMultiple) {
                this.realOptions.each(function (index, option) {
                    self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
                });
            } else {
                this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
                selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
                if (this.options.useHoverClass) {
                    selectedItem.addClass(this.options.hoverClass);
                }
            }
        },
        scrollToActiveOption: function () {
            // scroll to target option
            var targetOffset = this.getActiveOptionOffset();
            this.listHolder.prop('scrollTop', targetOffset);
        },
        getSelectedIndexRange: function () {
            var firstSelected = -1, lastSelected = -1;
            this.realOptions.each(function (index, option) {
                if (option.selected) {
                    if (firstSelected < 0) {
                        firstSelected = index;
                    }
                    lastSelected = index;
                }
            });
            return [firstSelected, lastSelected];
        },
        getChangedSelectedIndex: function () {
            var selectedIndex = this.element.prop('selectedIndex'),
                targetIndex;

            if (this.element.prop('multiple')) {
                // multiple selects handling
                if (!this.previousRange) {
                    this.previousRange = [selectedIndex, selectedIndex];
                }
                this.currentRange = this.getSelectedIndexRange();
                targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
                this.previousRange = this.currentRange;
                return targetIndex;
            } else {
                // single choice selects handling
                return selectedIndex;
            }
        },
        getActiveOptionOffset: function () {
            // calc values
            var dropHeight = this.listHolder.height(),
                dropScrollTop = this.listHolder.prop('scrollTop'),
                currentIndex = this.getChangedSelectedIndex(),
                fakeOption = this.fakeOptions.eq(currentIndex),
                fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
                fakeOptionHeight = fakeOption.innerHeight();

            // scroll list
            if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
                // scroll down (always scroll to option)
                return fakeOptionOffset - dropHeight + fakeOptionHeight;
            } else if (fakeOptionOffset < dropScrollTop) {
                // scroll up to option
                return fakeOptionOffset;
            }
        },
        getOverflowHeight: function (sizeValue) {
            var item = this.fakeListItems.eq(sizeValue - 1),
                listOffset = this.list.offset().top,
                itemOffset = item.offset().top,
                itemHeight = item.innerHeight();

            return itemOffset + itemHeight - listOffset;
        },
        getScrollTop: function () {
            return this.listHolder.scrollTop();
        },
        setScrollTop: function (value) {
            this.listHolder.scrollTop(value);
        },
        createOption: function (option) {
            var newOption = document.createElement('span');
            newOption.className = this.options.optionClass;
            newOption.innerHTML = option.innerHTML;
            newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

            var optionImage, optionImageSrc = option.getAttribute('data-image');
            if (optionImageSrc) {
                optionImage = document.createElement('img');
                optionImage.src = optionImageSrc;
                newOption.insertBefore(optionImage, newOption.childNodes[0]);
            }
            if (option.disabled) {
                newOption.className += ' ' + this.options.disabledClass;
            }
            if (option.className) {
                newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
            }
            return newOption;
        },
        createOptGroup: function (optgroup) {
            var optGroupContainer = document.createElement('span'),
                optGroupName = optgroup.getAttribute('label'),
                optGroupCaption, optGroupList;

            // create caption
            optGroupCaption = document.createElement('span');
            optGroupCaption.className = this.options.captionClass;
            optGroupCaption.innerHTML = optGroupName;
            optGroupContainer.appendChild(optGroupCaption);

            // create list of options
            if (optgroup.children.length) {
                optGroupList = this.createOptionsList(optgroup);
                optGroupContainer.appendChild(optGroupList);
            }

            optGroupContainer.className = this.options.groupClass;
            return optGroupContainer;
        },
        createOptionContainer: function () {
            var optionContainer = document.createElement('li');
            return optionContainer;
        },
        createOptionsList: function (container) {
            var self = this,
                list = document.createElement('ul');

            $.each(container.children, function (index, currentNode) {
                var item = self.createOptionContainer(currentNode),
                    newNode;

                switch (currentNode.tagName.toLowerCase()) {
                    case 'option':
                        newNode = self.createOption(currentNode);
                        break;
                    case 'optgroup':
                        newNode = self.createOptGroup(currentNode);
                        break;
                }
                list.appendChild(item).appendChild(newNode);
            });
            return list;
        },
        refresh: function () {
            // check for select innerHTML changes
            if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
                this.rebuildList();
            }

            // refresh custom scrollbar
            var scrollInstance = jcf.getInstance(this.listHolder);
            if (scrollInstance) {
                scrollInstance.refresh();
            }

            // scroll active option into view
            this.scrollToActiveOption();

            // refresh selectes classes
            this.refreshSelectedClass();
        },
        destroy: function () {
            this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
            this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
            this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
            this.listHolder.off('jcf-pointerdown', this.onPress);
        }
    });

    // helper functions
    var getPrefixedClasses = function (className, prefixToAdd) {
        return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
    };
    var makeUnselectable = (function () {
        var unselectableClass = jcf.getOptions().unselectableClass;

        function preventHandler(e) {
            e.preventDefault();
        }

        return function (node) {
            node.addClass(unselectableClass).on('selectstart', preventHandler);
        };
    }());

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Radio Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Radio',
        selector: 'input[type="radio"]',
        options: {
            wrapNative: true,
            checkedClass: 'jcf-checked',
            uncheckedClass: 'jcf-unchecked',
            labelActiveClass: 'jcf-label-active',
            fakeStructure: '<span class="jcf-radio"><span></span></span>'
        },
        matchElement: function (element) {
            return element.is(':radio');
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            // prepare structure
            this.doc = $(document);
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
            this.labelElement = this.getLabelFor();

            if (this.options.wrapNative) {
                // wrap native radio inside fake block
                this.realElement.prependTo(this.fakeElement).css({
                    position: 'absolute',
                    opacity: 0
                });
            } else {
                // just hide native radio
                this.realElement.addClass(this.options.hiddenClass);
            }
        },
        attachEvents: function () {
            // add event handlers
            this.realElement.on({
                focus: this.onFocus,
                click: this.onRealClick
            });
            this.fakeElement.on('click', this.onFakeClick);
            this.fakeElement.on('jcf-pointerdown', this.onPress);
        },
        onRealClick: function (e) {
            // redraw current radio and its group (setTimeout handles click that might be prevented)
            var self = this;
            this.savedEventObject = e;
            setTimeout(function () {
                self.refreshRadioGroup();
            }, 0);
        },
        onFakeClick: function (e) {
            // skip event if clicked on real element inside wrapper
            if (this.options.wrapNative && this.realElement.is(e.target)) {
                return;
            }

            // toggle checked class
            if (!this.realElement.is(':disabled')) {
                delete this.savedEventObject;
                this.currentActiveRadio = this.getCurrentActiveRadio();
                this.stateChecked = this.realElement.prop('checked');
                this.realElement.prop('checked', true);
                this.fireNativeEvent(this.realElement, 'click');
                if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
                    this.realElement.prop('checked', this.stateChecked);
                    this.currentActiveRadio.prop('checked', true);
                } else {
                    this.fireNativeEvent(this.realElement, 'change');
                }
                delete this.savedEventObject;
            }
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.focusedFlag = true;
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.focusedFlag = false;
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
            }
        },
        onPress: function (e) {
            if (!this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = true;
            this.fakeElement.addClass(this.options.pressedClass);
            this.doc.on('jcf-pointerup', this.onRelease);
        },
        onRelease: function (e) {
            if (this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = false;
            this.fakeElement.removeClass(this.options.pressedClass);
            this.doc.off('jcf-pointerup', this.onRelease);
        },
        getCurrentActiveRadio: function () {
            return this.getRadioGroup(this.realElement).filter(':checked');
        },
        getRadioGroup: function (radio) {
            // find radio group for specified radio button
            var name = radio.attr('name'),
                parentForm = radio.parents('form');

            if (name) {
                if (parentForm.length) {
                    return parentForm.find('input[name="' + name + '"]');
                } else {
                    return $('input[name="' + name + '"]:not(form input)');
                }
            } else {
                return radio;
            }
        },
        getLabelFor: function () {
            var parentLabel = this.realElement.closest('label'),
                elementId = this.realElement.prop('id');

            if (!parentLabel.length && elementId) {
                parentLabel = $('label[for="' + elementId + '"]');
            }
            return parentLabel.length ? parentLabel : null;
        },
        refreshRadioGroup: function () {
            // redraw current radio and its group
            this.getRadioGroup(this.realElement).each(function () {
                jcf.refresh(this);
            });
        },
        refresh: function () {
            // redraw current radio button
            var isChecked = this.realElement.is(':checked'),
                isDisabled = this.realElement.is(':disabled');

            this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
                .toggleClass(this.options.uncheckedClass, !isChecked)
                .toggleClass(this.options.disabledClass, isDisabled);

            if (this.labelElement) {
                this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
            }
        },
        destroy: function () {
            // restore structure
            if (this.options.wrapNative) {
                this.realElement.insertBefore(this.fakeElement).css({
                    position: '',
                    width: '',
                    height: '',
                    opacity: '',
                    margin: ''
                });
            } else {
                this.realElement.removeClass(this.options.hiddenClass);
            }

            // removing element will also remove its event handlers
            this.fakeElement.off('jcf-pointerdown', this.onPress);
            this.fakeElement.remove();

            // remove other event handlers
            this.doc.off('jcf-pointerup', this.onRelease);
            this.realElement.off({
                blur: this.onBlur,
                focus: this.onFocus,
                click: this.onRealClick
            });
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Checkbox Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Checkbox',
        selector: 'input[type="checkbox"]',
        options: {
            wrapNative: true,
            checkedClass: 'jcf-checked',
            uncheckedClass: 'jcf-unchecked',
            labelActiveClass: 'jcf-label-active',
            fakeStructure: '<span class="jcf-checkbox"><span></span></span>'
        },
        matchElement: function (element) {
            return element.is(':checkbox');
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            // prepare structure
            this.doc = $(document);
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
            this.labelElement = this.getLabelFor();

            if (this.options.wrapNative) {
                // wrap native checkbox inside fake block
                this.realElement.appendTo(this.fakeElement).css({
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    opacity: 0,
                    margin: 0
                });
            } else {
                // just hide native checkbox
                this.realElement.addClass(this.options.hiddenClass);
            }
        },
        attachEvents: function () {
            // add event handlers
            this.realElement.on({
                focus: this.onFocus,
                click: this.onRealClick
            });
            this.fakeElement.on('click', this.onFakeClick);
            this.fakeElement.on('jcf-pointerdown', this.onPress);
        },
        onRealClick: function (e) {
            // just redraw fake element (setTimeout handles click that might be prevented)
            var self = this;
            this.savedEventObject = e;
            setTimeout(function () {
                self.refresh();
            }, 0);
        },
        onFakeClick: function (e) {
            // skip event if clicked on real element inside wrapper
            if (this.options.wrapNative && this.realElement.is(e.target)) {
                return;
            }

            // toggle checked class
            if (!this.realElement.is(':disabled')) {
                delete this.savedEventObject;
                this.stateChecked = this.realElement.prop('checked');
                this.realElement.prop('checked', !this.stateChecked);
                this.fireNativeEvent(this.realElement, 'click');
                if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
                    this.realElement.prop('checked', this.stateChecked);
                } else {
                    this.fireNativeEvent(this.realElement, 'change');
                }
                delete this.savedEventObject;
            }
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.focusedFlag = true;
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.focusedFlag = false;
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
            }
        },
        onPress: function (e) {
            if (!this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = true;
            this.fakeElement.addClass(this.options.pressedClass);
            this.doc.on('jcf-pointerup', this.onRelease);
        },
        onRelease: function (e) {
            if (this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = false;
            this.fakeElement.removeClass(this.options.pressedClass);
            this.doc.off('jcf-pointerup', this.onRelease);
        },
        getLabelFor: function () {
            var parentLabel = this.realElement.closest('label'),
                elementId = this.realElement.prop('id');

            if (!parentLabel.length && elementId) {
                parentLabel = $('label[for="' + elementId + '"]');
            }
            return parentLabel.length ? parentLabel : null;
        },
        refresh: function () {
            // redraw custom checkbox
            var isChecked = this.realElement.is(':checked'),
                isDisabled = this.realElement.is(':disabled');

            this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
                .toggleClass(this.options.uncheckedClass, !isChecked)
                .toggleClass(this.options.disabledClass, isDisabled);

            if (this.labelElement) {
                this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
            }
        },
        destroy: function () {
            // restore structure
            if (this.options.wrapNative) {
                this.realElement.insertBefore(this.fakeElement).css({
                    position: '',
                    width: '',
                    height: '',
                    opacity: '',
                    margin: ''
                });
            } else {
                this.realElement.removeClass(this.options.hiddenClass);
            }

            // removing element will also remove its event handlers
            this.fakeElement.off('jcf-pointerdown', this.onPress);
            this.fakeElement.remove();

            // remove other event handlers
            this.doc.off('jcf-pointerup', this.onRelease);
            this.realElement.off({
                focus: this.onFocus,
                click: this.onRealClick
            });
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Scrollbar Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Scrollable',
        selector: '.jcf-scrollable',
        plugins: {
            ScrollBar: ScrollBar
        },
        options: {
            mouseWheelStep: 150,
            handleResize: true,
            alwaysShowScrollbars: false,
            alwaysPreventMouseWheel: false,
            scrollAreaStructure: '<div class="jcf-scrollable-wrapper"></div>'
        },
        matchElement: function (element) {
            return element.is('.jcf-scrollable');
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.rebuildScrollbars();
        },
        initStructure: function () {
            // prepare structure
            this.doc = $(document);
            this.win = $(window);
            this.realElement = $(this.options.element);
            this.scrollWrapper = $(this.options.scrollAreaStructure).insertAfter(this.realElement);

            // set initial styles
            this.scrollWrapper.css('position', 'relative');
            this.realElement.css('overflow', 'hidden');
            this.vBarEdge = 0;
        },
        attachEvents: function () {
            // create scrollbars
            var self = this;
            this.vBar = new ScrollBar({
                holder: this.scrollWrapper,
                vertical: true,
                onScroll: function (scrollTop) {
                    self.realElement.scrollTop(scrollTop);
                }
            });
            this.hBar = new ScrollBar({
                holder: this.scrollWrapper,
                vertical: false,
                onScroll: function (scrollLeft) {
                    self.realElement.scrollLeft(scrollLeft);
                }
            });

            // add event handlers
            this.realElement.on('scroll', this.onScroll);
            if (this.options.handleResize) {
                this.win.on('resize orientationchange load', this.onResize);
            }

            // add pointer/wheel event handlers
            this.realElement.on('jcf-mousewheel', this.onMouseWheel);
            this.realElement.on('jcf-pointerdown', this.onTouchBody);
        },
        onScroll: function () {
            this.redrawScrollbars();
        },
        onResize: function () {
            // do not rebuild scrollbars if form field is in focus
            if (!$(document.activeElement).is(':input')) {
                this.rebuildScrollbars();
            }
        },
        onTouchBody: function (e) {
            if (e.pointerType === 'touch') {
                this.touchData = {
                    scrollTop: this.realElement.scrollTop(),
                    scrollLeft: this.realElement.scrollLeft(),
                    left: e.pageX,
                    top: e.pageY
                };
                this.doc.on({
                    'jcf-pointermove': this.onMoveBody,
                    'jcf-pointerup': this.onReleaseBody
                });
            }
        },
        onMoveBody: function (e) {
            var targetScrollTop,
                targetScrollLeft,
                verticalScrollAllowed = this.verticalScrollActive,
                horizontalScrollAllowed = this.horizontalScrollActive;

            if (e.pointerType === 'touch') {
                targetScrollTop = this.touchData.scrollTop - e.pageY + this.touchData.top;
                targetScrollLeft = this.touchData.scrollLeft - e.pageX + this.touchData.left;

                // check that scrolling is ended and release outer scrolling
                if (this.verticalScrollActive && (targetScrollTop < 0 || targetScrollTop > this.vBar.maxValue)) {
                    verticalScrollAllowed = false;
                }
                if (this.horizontalScrollActive && (targetScrollLeft < 0 || targetScrollLeft > this.hBar.maxValue)) {
                    horizontalScrollAllowed = false;
                }

                this.realElement.scrollTop(targetScrollTop);
                this.realElement.scrollLeft(targetScrollLeft);

                if (verticalScrollAllowed || horizontalScrollAllowed) {
                    e.preventDefault();
                } else {
                    this.onReleaseBody(e);
                }
            }
        },
        onReleaseBody: function (e) {
            if (e.pointerType === 'touch') {
                delete this.touchData;
                this.doc.off({
                    'jcf-pointermove': this.onMoveBody,
                    'jcf-pointerup': this.onReleaseBody
                });
            }
        },
        onMouseWheel: function (e) {
            var currentScrollTop = this.realElement.scrollTop(),
                currentScrollLeft = this.realElement.scrollLeft(),
                maxScrollTop = this.realElement.prop('scrollHeight') - this.embeddedDimensions.innerHeight,
                maxScrollLeft = this.realElement.prop('scrollWidth') - this.embeddedDimensions.innerWidth,
                extraLeft, extraTop, preventFlag;

            // check edge cases
            if (!this.options.alwaysPreventMouseWheel) {
                if (this.verticalScrollActive && e.deltaY) {
                    if (!(currentScrollTop <= 0 && e.deltaY < 0) && !(currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
                        preventFlag = true;
                    }
                }
                if (this.horizontalScrollActive && e.deltaX) {
                    if (!(currentScrollLeft <= 0 && e.deltaX < 0) && !(currentScrollLeft >= maxScrollLeft && e.deltaX > 0)) {
                        preventFlag = true;
                    }
                }
                if (!this.verticalScrollActive && !this.horizontalScrollActive) {
                    return;
                }
            }

            // prevent default action and scroll item
            if (preventFlag || this.options.alwaysPreventMouseWheel) {
                e.preventDefault();
            } else {
                return;
            }

            extraLeft = e.deltaX / 100 * this.options.mouseWheelStep;
            extraTop = e.deltaY / 100 * this.options.mouseWheelStep;

            this.realElement.scrollTop(currentScrollTop + extraTop);
            this.realElement.scrollLeft(currentScrollLeft + extraLeft);
        },
        setScrollBarEdge: function (edgeSize) {
            this.vBarEdge = edgeSize || 0;
            this.redrawScrollbars();
        },
        saveElementDimensions: function () {
            this.savedDimensions = {
                top: this.realElement.width(),
                left: this.realElement.height()
            };
            return this;
        },
        restoreElementDimensions: function () {
            if (this.savedDimensions) {
                this.realElement.css({
                    width: this.savedDimensions.width,
                    height: this.savedDimensions.height
                });
            }
            return this;
        },
        saveScrollOffsets: function () {
            this.savedOffsets = {
                top: this.realElement.scrollTop(),
                left: this.realElement.scrollLeft()
            };
            return this;
        },
        restoreScrollOffsets: function () {
            if (this.savedOffsets) {
                this.realElement.scrollTop(this.savedOffsets.top);
                this.realElement.scrollLeft(this.savedOffsets.left);
            }
            return this;
        },
        getContainerDimensions: function () {
            // save current styles
            var desiredDimensions,
                currentStyles,
                currentHeight,
                currentWidth;

            if (this.isModifiedStyles) {
                desiredDimensions = {
                    width: this.realElement.innerWidth() + this.vBar.getThickness(),
                    height: this.realElement.innerHeight() + this.hBar.getThickness()
                };
            } else {
                // unwrap real element and measure it according to CSS
                this.saveElementDimensions().saveScrollOffsets();
                this.realElement.insertAfter(this.scrollWrapper);
                this.scrollWrapper.detach();

                // measure element
                currentStyles = this.realElement.prop('style');
                currentWidth = parseFloat(currentStyles.width);
                currentHeight = parseFloat(currentStyles.height);

                // reset styles if needed
                if (this.embeddedDimensions && currentWidth && currentHeight) {
                    this.isModifiedStyles |= (currentWidth !== this.embeddedDimensions.width || currentHeight !== this.embeddedDimensions.height);
                    this.realElement.css({
                        overflow: '',
                        width: '',
                        height: ''
                    });
                }

                // calculate desired dimensions for real element
                desiredDimensions = {
                    width: this.realElement.outerWidth(),
                    height: this.realElement.outerHeight()
                };

                // restore structure and original scroll offsets
                this.scrollWrapper.insertAfter(this.realElement);
                this.realElement.css('overflow', 'hidden').prependTo(this.scrollWrapper);
                this.restoreElementDimensions().restoreScrollOffsets();
            }

            return desiredDimensions;
        },
        getEmbeddedDimensions: function (dimensions) {
            // handle scrollbars cropping
            var fakeBarWidth = this.vBar.getThickness(),
                fakeBarHeight = this.hBar.getThickness(),
                paddingWidth = this.realElement.outerWidth() - this.realElement.width(),
                paddingHeight = this.realElement.outerHeight() - this.realElement.height(),
                resultDimensions;

            if (this.options.alwaysShowScrollbars) {
                // simply return dimensions without custom scrollbars
                this.verticalScrollActive = true;
                this.horizontalScrollActive = true;
                resultDimensions = {
                    innerWidth: dimensions.width - fakeBarWidth,
                    innerHeight: dimensions.height - fakeBarHeight
                };
            } else {
                // detect when to display each scrollbar
                this.saveElementDimensions();
                this.verticalScrollActive = false;
                this.horizontalScrollActive = false;

                // fill container with full size
                this.realElement.css({
                    width: dimensions.width - paddingWidth,
                    height: dimensions.height - paddingHeight
                });

                this.horizontalScrollActive = this.realElement.prop('scrollWidth') > this.containerDimensions.width;
                this.verticalScrollActive = this.realElement.prop('scrollHeight') > this.containerDimensions.height;

                this.restoreElementDimensions();
                resultDimensions = {
                    innerWidth: dimensions.width - (this.verticalScrollActive ? fakeBarWidth : 0),
                    innerHeight: dimensions.height - (this.horizontalScrollActive ? fakeBarHeight : 0)
                };
            }
            $.extend(resultDimensions, {
                width: resultDimensions.innerWidth - paddingWidth,
                height: resultDimensions.innerHeight - paddingHeight
            });
            return resultDimensions;
        },
        rebuildScrollbars: function () {
            // resize wrapper according to real element styles
            this.containerDimensions = this.getContainerDimensions();
            this.embeddedDimensions = this.getEmbeddedDimensions(this.containerDimensions);

            // resize wrapper to desired dimensions
            this.scrollWrapper.css({
                width: this.containerDimensions.width,
                height: this.containerDimensions.height
            });

            // resize element inside wrapper excluding scrollbar size
            this.realElement.css({
                overflow: 'hidden',
                width: this.embeddedDimensions.width,
                height: this.embeddedDimensions.height
            });

            // redraw scrollbar offset
            this.redrawScrollbars();
        },
        redrawScrollbars: function () {
            var viewSize, maxScrollValue;

            // redraw vertical scrollbar
            if (this.verticalScrollActive) {
                viewSize = this.vBarEdge ? this.containerDimensions.height - this.vBarEdge : this.embeddedDimensions.innerHeight;
                maxScrollValue = this.realElement.prop('scrollHeight') - this.vBarEdge;

                this.vBar.show().setMaxValue(maxScrollValue - viewSize).setRatio(viewSize / maxScrollValue).setSize(viewSize);
                this.vBar.setValue(this.realElement.scrollTop());
            } else {
                this.vBar.hide();
            }

            // redraw horizontal scrollbar
            if (this.horizontalScrollActive) {
                viewSize = this.embeddedDimensions.innerWidth;
                maxScrollValue = this.realElement.prop('scrollWidth');

                if (maxScrollValue === viewSize) {
                    this.horizontalScrollActive = false;
                }
                this.hBar.show().setMaxValue(maxScrollValue - viewSize).setRatio(viewSize / maxScrollValue).setSize(viewSize);
                this.hBar.setValue(this.realElement.scrollLeft());
            } else {
                this.hBar.hide();
            }

            // set "touch-action" style rule
            var touchAction = '';
            if (this.verticalScrollActive && this.horizontalScrollActive) {
                touchAction = 'none';
            } else if (this.verticalScrollActive) {
                touchAction = 'pan-x';
            } else if (this.horizontalScrollActive) {
                touchAction = 'pan-y';
            }
            this.realElement.css('touchAction', touchAction);
        },
        refresh: function () {
            this.rebuildScrollbars();
        },
        destroy: function () {
            // remove event listeners
            this.win.off('resize orientationchange load', this.onResize);
            this.realElement.off({
                'jcf-mousewheel': this.onMouseWheel,
                'jcf-pointerdown': this.onTouchBody
            });
            this.doc.off({
                'jcf-pointermove': this.onMoveBody,
                'jcf-pointerup': this.onReleaseBody
            });

            // restore structure
            this.saveScrollOffsets();
            this.vBar.destroy();
            this.hBar.destroy();
            this.realElement.insertAfter(this.scrollWrapper).css({
                touchAction: '',
                overflow: '',
                width: '',
                height: ''
            });
            this.scrollWrapper.remove();
            this.restoreScrollOffsets();
        }
    });

    // custom scrollbar
    function ScrollBar(options) {
        this.options = $.extend({
            holder: null,
            vertical: true,
            inactiveClass: 'jcf-inactive',
            verticalClass: 'jcf-scrollbar-vertical',
            horizontalClass: 'jcf-scrollbar-horizontal',
            scrollbarStructure: '<div class="jcf-scrollbar"><div class="jcf-scrollbar-dec"></div><div class="jcf-scrollbar-slider"><div class="jcf-scrollbar-handle"></div></div><div class="jcf-scrollbar-inc"></div></div>',
            btnDecSelector: '.jcf-scrollbar-dec',
            btnIncSelector: '.jcf-scrollbar-inc',
            sliderSelector: '.jcf-scrollbar-slider',
            handleSelector: '.jcf-scrollbar-handle',
            scrollInterval: 10,
            scrollStep: 5
        }, options);
        this.init();
    }

    $.extend(ScrollBar.prototype, {
        init: function () {
            this.initStructure();
            this.attachEvents();
        },
        initStructure: function () {
            // define proporties
            this.doc = $(document);
            this.isVertical = !!this.options.vertical;
            this.sizeProperty = this.isVertical ? 'height' : 'width';
            this.fullSizeProperty = this.isVertical ? 'outerHeight' : 'outerWidth';
            this.invertedSizeProperty = this.isVertical ? 'width' : 'height';
            this.thicknessMeasureMethod = 'outer' + this.invertedSizeProperty.charAt(0).toUpperCase() + this.invertedSizeProperty.substr(1);
            this.offsetProperty = this.isVertical ? 'top' : 'left';
            this.offsetEventProperty = this.isVertical ? 'pageY' : 'pageX';

            // initialize variables
            this.value = this.options.value || 0;
            this.maxValue = this.options.maxValue || 0;
            this.currentSliderSize = 0;
            this.handleSize = 0;

            // find elements
            this.holder = $(this.options.holder);
            this.scrollbar = $(this.options.scrollbarStructure).appendTo(this.holder);
            this.btnDec = this.scrollbar.find(this.options.btnDecSelector);
            this.btnInc = this.scrollbar.find(this.options.btnIncSelector);
            this.slider = this.scrollbar.find(this.options.sliderSelector);
            this.handle = this.slider.find(this.options.handleSelector);

            // set initial styles
            this.scrollbar.addClass(this.isVertical ? this.options.verticalClass : this.options.horizontalClass).css({
                touchAction: this.isVertical ? 'pan-x' : 'pan-y',
                position: 'absolute'
            });
            this.slider.css({
                position: 'relative'
            });
            this.handle.css({
                touchAction: 'none',
                position: 'absolute'
            });
        },
        attachEvents: function () {
            var self = this;
            this.bindHandlers();
            this.handle.on('jcf-pointerdown', this.onHandlePress);
            this.btnDec.add(this.btnInc).on('jcf-pointerdown', this.onButtonPress);
        },
        onHandlePress: function (e) {
            if (e.pointerType === 'mouse' && e.button > 1) {
                return;
            } else {
                e.preventDefault();
                this.sliderOffset = this.slider.offset()[this.offsetProperty];
                this.innerHandleOffset = e[this.offsetEventProperty] - this.handle.offset()[this.offsetProperty];

                this.doc.on('jcf-pointermove', this.onHandleDrag);
                this.doc.on('jcf-pointerup', this.onHandleRelease);
            }
        },
        onHandleDrag: function (e) {
            e.preventDefault();
            this.calcOffset = e[this.offsetEventProperty] - this.sliderOffset - this.innerHandleOffset;
            this.setValue(this.calcOffset / (this.currentSliderSize - this.handleSize) * this.maxValue);
            this.triggerScrollEvent(this.value);
        },
        onHandleRelease: function () {
            this.doc.off('jcf-pointermove', this.onHandleDrag);
            this.doc.off('jcf-pointerup', this.onHandleRelease);
        },
        onButtonPress: function (e) {
            var direction;
            if (e.pointerType === 'mouse' && e.button > 1) {
                return;
            } else {
                e.preventDefault();
                direction = this.btnDec.is(e.currentTarget) ? -1 : 1;
                this.startButtonScrolling(direction);
                this.doc.on('jcf-pointerup', this.onButtonRelease);
            }
        },
        onButtonRelease: function () {
            this.stopButtonScrolling();
            this.doc.off('jcf-pointerup', this.onButtonRelease);
        },
        startButtonScrolling: function (direction) {
            var self = this;
            this.stopButtonScrolling();
            this.scrollTimer = setInterval(function () {
                if (direction > 0) {
                    self.value += self.options.scrollStep;
                } else {
                    self.value -= self.options.scrollStep;
                }
                self.setValue(self.value);
                self.triggerScrollEvent(self.value);
            }, this.options.scrollInterval);
        },
        stopButtonScrolling: function () {
            clearInterval(this.scrollTimer);
        },
        triggerScrollEvent: function (scrollValue) {
            if (this.options.onScroll) {
                this.options.onScroll(scrollValue);
            }
        },
        getThickness: function () {
            return this.scrollbar[this.thicknessMeasureMethod]();
        },
        setSize: function (size) {
            // resize scrollbar
            var btnDecSize = this.btnDec[this.fullSizeProperty](),
                btnIncSize = this.btnInc[this.fullSizeProperty]();

            // resize slider
            this.currentSize = size;
            this.currentSliderSize = size - btnDecSize - btnIncSize;
            this.scrollbar.css(this.sizeProperty, size);
            this.slider.css(this.sizeProperty, this.currentSliderSize);
            this.currentSliderSize = this.slider[this.sizeProperty]();

            // resize handle
            this.handleSize = Math.round(this.currentSliderSize * this.ratio);
            this.handle.css(this.sizeProperty, this.handleSize);
            this.handleSize = this.handle[this.fullSizeProperty]();

            return this;
        },
        setRatio: function (ratio) {
            this.ratio = ratio;
            return this;
        },
        setMaxValue: function (maxValue) {
            this.maxValue = maxValue;
            this.setValue(Math.min(this.value, this.maxValue));
            return this;
        },
        setValue: function (value) {
            this.value = value;
            if (this.value < 0) {
                this.value = 0;
            } else if (this.value > this.maxValue) {
                this.value = this.maxValue;
            }
            this.refresh();
        },
        setPosition: function (styles) {
            this.scrollbar.css(styles);
            return this;
        },
        hide: function () {
            this.scrollbar.detach();
            return this;
        },
        show: function () {
            this.scrollbar.appendTo(this.holder);
            return this;
        },
        refresh: function () {
            // recalculate handle position
            if (this.value === 0 || this.maxValue === 0) {
                this.calcOffset = 0;
            } else {
                this.calcOffset = (this.value / this.maxValue) * (this.currentSliderSize - this.handleSize);
            }
            this.handle.css(this.offsetProperty, this.calcOffset);

            // toggle inactive classes
            this.btnDec.toggleClass(this.options.inactiveClass, this.value === 0);
            this.btnInc.toggleClass(this.options.inactiveClass, this.value === this.maxValue);
            this.scrollbar.toggleClass(this.options.inactiveClass, this.maxValue === 0);

            if (this.scrollbar.hasClass(this.options.verticalClass)) {
                if (this.handle.outerHeight() > this.slider.outerHeight() - 2) {
                    this.scrollbar.addClass('hide-scroll');
                } else {
                    this.scrollbar.removeClass('hide-scroll');
                }
            }
        },
        destroy: function () {
            //remove event handlers and scrollbar block itself
            this.btnDec.add(this.btnInc).off('jcf-pointerdown', this.onButtonPress);
            this.handle.off('jcf-pointerdown', this.onHandlePress);
            this.doc.off('jcf-pointermove', this.onHandleDrag);
            this.doc.off('jcf-pointerup', this.onHandleRelease);
            this.doc.off('jcf-pointerup', this.onButtonRelease);
            clearInterval(this.scrollTimer);
            this.scrollbar.remove();
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : File Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'File',
        selector: 'input[type="file"]',
        options: {
            fakeStructure: '<span class="jcf-file"><span class="jcf-fake-input"></span><span class="jcf-upload-button"><span class="jcf-button-content"></span></span></span>',
            buttonText: 'Choose file',
            placeholderText: 'No file chosen',
            realElementClass: 'jcf-real-element',
            extensionPrefixClass: 'jcf-extension-',
            selectedFileBlock: '.jcf-fake-input',
            buttonTextBlock: '.jcf-button-content'
        },
        matchElement: function (element) {
            return element.is('input[type="file"]');
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            this.doc = $(document);
            this.realElement = $(this.options.element).addClass(this.options.realElementClass);
            this.fakeElement = $(this.options.fakeStructure).insertBefore(this.realElement);
            this.fileNameBlock = this.fakeElement.find(this.options.selectedFileBlock);
            this.buttonTextBlock = this.fakeElement.find(this.options.buttonTextBlock).text(this.options.buttonText);

            this.realElement.appendTo(this.fakeElement).css({
                position: 'absolute',
                opacity: 0
            });
        },
        attachEvents: function () {
            this.realElement.on({
                'jcf-pointerdown': this.onPress,
                'change': this.onChange,
                'focus': this.onFocus
            });
        },
        onChange: function () {
            this.refresh();
        },
        onFocus: function () {
            this.fakeElement.addClass(this.options.focusClass);
            this.realElement.on('blur', this.onBlur);
        },
        onBlur: function () {
            this.fakeElement.removeClass(this.options.focusClass);
            this.realElement.off('blur', this.onBlur);
        },
        onPress: function () {
            this.fakeElement.addClass(this.options.pressedClass);
            this.doc.on('jcf-pointerup', this.onRelease);
        },
        onRelease: function () {
            this.fakeElement.removeClass(this.options.pressedClass);
            this.doc.off('jcf-pointerup', this.onRelease);
        },
        getFileName: function () {
            return this.realElement.val().replace(/^[\s\S]*(?:\\|\/)([\s\S^\\\/]*)$/g, '$1');
        },
        getFileExtension: function () {
            var fileName = this.realElement.val();
            return fileName.lastIndexOf('.') < 0 ? '' : fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        },
        updateExtensionClass: function () {
            var currentExtension = this.getFileExtension(),
                currentClassList = this.fakeElement.prop('className'),
                cleanedClassList = currentClassList.replace(new RegExp('(\\s|^)' + this.options.extensionPrefixClass + '[^ ]+', 'gi'), '');

            this.fakeElement.prop('className', cleanedClassList);
            if (currentExtension) {
                this.fakeElement.addClass(this.options.extensionPrefixClass + currentExtension);
            }
        },
        refresh: function () {
            var selectedFileName = this.getFileName() || this.options.placeholderText;
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
            this.fileNameBlock.text(selectedFileName);
            this.updateExtensionClass();
        },
        destroy: function () {
            // reset styles and restore element position
            this.realElement.insertBefore(this.fakeElement).removeClass(this.options.realElementClass).css({
                position: '',
                opacity: ''
            });
            this.fakeElement.remove();

            // remove event handlers
            this.realElement.off({
                'jcf-pointerdown': this.onPress,
                'change': this.onChange,
                'focus': this.onFocus,
                'blur': this.onBlur
            });
            this.doc.off('jcf-pointerup', this.onRelease);
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Range Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Range',
        selector: 'input[type="range"]',
        options: {
            realElementClass: 'jcf-real-element',
            fakeStructure: '<span class="jcf-range"><span class="jcf-range-wrapper"><span class="jcf-range-track"><span class="jcf-range-handle"></span></span></span></span>',
            dataListMark: '<span class="jcf-range-mark"></span>',
            dragValueDisplay: '<span class="jcf-drag-value"></span>',
            handleSelector: '.jcf-range-handle',
            trackSelector: '.jcf-range-track',
            verticalClass: 'jcf-vertical',
            orientation: 'horizontal',
            dragHandleCenter: true,
            snapToMarks: true,
            snapRadius: 5
        },
        matchElement: function (element) {
            return element.is(this.selector);
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            this.page = $('html');
            this.realElement = $(this.options.element).addClass(this.options.hiddenClass);
            this.fakeElement = $(this.options.fakeStructure).insertBefore(this.realElement).prepend(this.realElement);
            this.track = this.fakeElement.find(this.options.trackSelector);
            this.handle = this.fakeElement.find(this.options.handleSelector);

            // handle orientation
            this.isVertical = (this.options.orientation === 'vertical');
            this.directionProperty = this.isVertical ? 'top' : 'left';
            this.offsetProperty = this.isVertical ? 'bottom' : 'left';
            this.eventProperty = this.isVertical ? 'pageY' : 'pageX';
            this.sizeMethod = this.isVertical ? 'innerHeight' : 'innerWidth';
            if (this.isVertical) {
                this.fakeElement.addClass(this.options.verticalClass);
            }

            // set initial values
            this.minValue = parseFloat(this.realElement.attr('min'));
            this.maxValue = parseFloat(this.realElement.attr('max'));
            this.stepValue = parseFloat(this.realElement.attr('step')) || 1;

            // check attribute values
            this.minValue = isNaN(this.minValue) ? 0 : this.minValue;
            this.maxValue = isNaN(this.maxValue) ? 100 : this.maxValue;

            // handle range
            if (this.stepValue !== 1) {
                this.maxValue -= (this.maxValue - this.minValue) % this.stepValue;
            }
            this.stepsCount = (this.maxValue - this.minValue) / this.stepValue + 1;
            this.createDataList();
        },
        attachEvents: function () {
            this.realElement.on({
                'focus': this.onFocus
            });
            this.handle.on('jcf-pointerdown', this.onPress);
        },
        createDataList: function () {
            var self = this,
                dataValues = [],
                dataListId = this.realElement.attr('list');

            if (dataListId) {
                $('#' + dataListId).find('option').each(function () {
                    var itemValue = parseFloat(this.value || this.innerHTML),
                        mark, markOffset;

                    if (!isNaN(itemValue)) {
                        markOffset = self.valueToOffset(itemValue);
                        dataValues.push({
                            value: itemValue,
                            offset: markOffset
                        });
                        mark = $(self.options.dataListMark).text(itemValue).attr({
                            'data-mark-value': itemValue
                        }).css(self.offsetProperty, markOffset + '%').appendTo(self.track);
                    }
                });
                if (dataValues.length) {
                    self.dataValues = dataValues;
                }
            }
        },
        onPress: function (e) {
            var trackSize, trackOffset, innerOffset;

            e.preventDefault();
            if (!this.realElement.is(':disabled')) {
                trackSize = this.track[this.sizeMethod]();
                trackOffset = this.track.offset()[this.directionProperty];
                innerOffset = this.options.dragHandleCenter ? this.handle[this.sizeMethod]() / 2 : e[this.eventProperty] - this.handle.offset()[this.directionProperty];

                this.dragData = {
                    trackSize: trackSize,
                    innerOffset: innerOffset,
                    trackOffset: trackOffset,
                    min: trackOffset,
                    max: trackOffset + trackSize
                };
                this.page.on({
                    'jcf-pointermove': this.onMove,
                    'jcf-pointerup': this.onRelease
                });

                if (e.pointerType === 'mouse') {
                    this.realElement.focus();
                }
            }
        },
        onMove: function (e) {
            var self = this,
                newOffset, dragPercent, stepIndex, valuePercent;

            // calculate offset
            if (this.isVertical) {
                newOffset = this.dragData.max + (this.dragData.min - e[this.eventProperty]) - this.dragData.innerOffset;
            } else {
                newOffset = e[this.eventProperty] - this.dragData.innerOffset;
            }

            // fit in range
            if (newOffset < this.dragData.min) {
                newOffset = this.dragData.min;
            } else if (newOffset > this.dragData.max) {
                newOffset = this.dragData.max;
            }

            e.preventDefault();
            if (this.options.snapToMarks && this.dataValues) {
                // snap handle to marks
                var dragOffset = newOffset - this.dragData.trackOffset;
                dragPercent = (newOffset - this.dragData.trackOffset) / this.dragData.trackSize * 100;

                $.each(this.dataValues, function (index, item) {
                    var markOffset = item.offset / 100 * self.dragData.trackSize,
                        markMin = markOffset - self.options.snapRadius,
                        markMax = markOffset + self.options.snapRadius;

                    if (dragOffset >= markMin && dragOffset <= markMax) {
                        dragPercent = item.offset;
                        return false;
                    }
                });
            } else {
                // snap handle to steps
                dragPercent = (newOffset - this.dragData.trackOffset) / this.dragData.trackSize * 100;
            }
            stepIndex = Math.round(dragPercent * this.stepsCount / 100);
            valuePercent = stepIndex * (100 / this.stepsCount);

            if (this.dragData.stepIndex !== stepIndex) {
                this.dragData.stepIndex = stepIndex;
                this.dragData.offset = valuePercent;
                this.handle.css(this.offsetProperty, this.dragData.offset + '%');
            }
        },
        onRelease: function () {
            var newValue;
            if (typeof this.dragData.offset === 'number') {
                newValue = this.stepIndexToValue(this.dragData.stepIndex);
                this.realElement.val(newValue).trigger('change');
            }

            this.page.off({
                'jcf-pointermove': this.onMove,
                'jcf-pointerup': this.onRelease
            });
            delete this.dragData;
        },
        onFocus: function () {
            this.fakeElement.addClass(this.options.focusClass);
            this.realElement.on({
                'blur': this.onBlur,
                'keydown': this.onKeyPress
            });
        },
        onBlur: function () {
            this.fakeElement.removeClass(this.options.focusClass);
            this.realElement.off({
                'blur': this.onBlur,
                'keydown': this.onKeyPress
            });
        },
        onKeyPress: function (e) {
            var incValue = (e.which === 38 || e.which === 39),
                decValue = (e.which === 37 || e.which === 40);

            if (decValue || incValue) {
                e.preventDefault();
                this.step(incValue ? this.stepValue : -this.stepValue);
            }
        },
        step: function (changeValue) {
            var originalValue = parseFloat(this.realElement.val()),
                newValue = originalValue;

            if (isNaN(originalValue)) {
                newValue = 0;
            }

            newValue += changeValue;

            if (newValue > this.maxValue) {
                newValue = this.maxValue;
            } else if (newValue < this.minValue) {
                newValue = this.minValue;
            }

            if (newValue !== originalValue) {
                this.realElement.val(newValue).trigger('change');
                this.setSliderValue(newValue);
            }
        },
        stepIndexToValue: function (stepIndex) {
            return this.minValue + this.stepValue * stepIndex;
        },
        valueToOffset: function (value) {
            var range = this.maxValue - this.minValue,
                percent = (value - this.minValue) / range;

            return percent * 100;
        },
        setSliderValue: function (value) {
            // set handle position accordion according to value
            this.handle.css(this.offsetProperty, this.valueToOffset(value) + '%');
        },
        refresh: function () {
            // handle disabled state
            var isDisabled = this.realElement.is(':disabled');
            this.fakeElement.toggleClass(this.options.disabledClass, isDisabled);

            // refresh handle position according to current value
            var realValue = parseFloat(this.realElement.val()) || 0;
            this.setSliderValue(realValue);
        },
        destroy: function () {
            this.realElement.removeClass(this.options.hiddenClass).insertBefore(this.fakeElement);
            this.fakeElement.remove();

            this.realElement.off({
                'keydown': this.onKeyPress,
                'focus': this.onFocus,
                'blur': this.onBlur
            });
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Number Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Number',
        selector: 'input[type="number"]',
        options: {
            realElementClass: 'jcf-real-element',
            fakeStructure: '<span class="jcf-number"><span class="jcf-btn-inc"></span><span class="jcf-btn-dec"></span></span>',
            btnIncSelector: '.jcf-btn-inc',
            btnDecSelector: '.jcf-btn-dec',
            pressInterval: 150
        },
        matchElement: function (element) {
            return element.is(this.selector);
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            this.page = $('html');
            this.realElement = $(this.options.element).addClass(this.options.realElementClass);
            this.fakeElement = $(this.options.fakeStructure).insertBefore(this.realElement).prepend(this.realElement);
            this.btnDec = this.fakeElement.find(this.options.btnDecSelector);
            this.btnInc = this.fakeElement.find(this.options.btnIncSelector);

            this.ending = this.realElement.data('ending');

            if (this.ending) {
                jQuery('<span class="ending"/>').text(this.ending).insertAfter(this.realElement).parent().addClass('jcf-holder');
            }

            // set initial values
            this.initialValue = parseFloat(this.realElement.val()) || 0;
            this.minValue = parseFloat(this.realElement.attr('min'));
            this.maxValue = parseFloat(this.realElement.attr('max'));
            this.stepValue = parseFloat(this.realElement.attr('step')) || 1;

            // check attribute values
            this.minValue = isNaN(this.minValue) ? -Infinity : this.minValue;
            this.maxValue = isNaN(this.maxValue) ? Infinity : this.maxValue;

            // handle range
            if (isFinite(this.maxValue)) {
                this.maxValue -= (this.maxValue - this.minValue) % this.stepValue;
            }
        },
        attachEvents: function () {
            this.realElement.on({
                'focus': this.onFocus
            });
            this.btnDec.add(this.btnInc).on('jcf-pointerdown', this.onBtnPress);
        },
        onBtnPress: function (e) {
            var self = this,
                increment;

            if (!this.realElement.is(':disabled')) {
                increment = this.btnInc.is(e.currentTarget);

                self.step(increment);
                clearInterval(this.stepTimer);
                this.stepTimer = setInterval(function () {
                    self.step(increment);
                }, this.options.pressInterval);

                this.page.on('jcf-pointerup', this.onBtnRelease);
            }
        },
        onBtnRelease: function () {
            clearInterval(this.stepTimer);
            this.page.off('jcf-pointerup', this.onBtnRelease);
        },
        onFocus: function () {
            this.fakeElement.addClass(this.options.focusClass);
            this.realElement.on({
                'blur': this.onBlur,
                'keydown': this.onKeyPress
            });
        },
        onBlur: function () {
            this.fakeElement.removeClass(this.options.focusClass);
            this.realElement.off({
                'blur': this.onBlur,
                'keydown': this.onKeyPress
            });
        },
        onKeyPress: function (e) {
            if (e.which === 38 || e.which === 40) {
                e.preventDefault();
                this.step(e.which === 38);
            }
        },
        step: function (increment) {
            var originalValue = parseFloat(this.realElement.val()),
                newValue = originalValue || 0,
                addValue = this.stepValue * (increment ? 1 : -1),
                edgeNumber = isFinite(this.minValue) ? this.minValue : this.initialValue - Math.abs(newValue * this.stepValue),
                diff = Math.abs(edgeNumber - newValue) % this.stepValue;

            // handle step diff
            if (diff) {
                if (increment) {
                    newValue += addValue - diff;
                } else {
                    newValue -= diff;
                }
            } else {
                newValue += addValue;
            }

            // handle min/max limits
            if (newValue < this.minValue) {
                newValue = this.minValue;
            } else if (newValue > this.maxValue) {
                newValue = this.maxValue;
            }

            // update value in real input if its changed
            if (newValue !== originalValue) {
                this.realElement.val(newValue).trigger('change');
                this.refresh();
            }
        },
        refresh: function () {
            // handle disabled state
            var isDisabled = this.realElement.is(':disabled');
            this.fakeElement.toggleClass(this.options.disabledClass, isDisabled);

            // refresh button classes
            this.btnDec.toggleClass(this.options.disabledClass, this.realElement.val() == this.minValue);
            this.btnInc.toggleClass(this.options.disabledClass, this.realElement.val() == this.maxValue);
        },
        destroy: function () {
            // restore original structure
            this.realElement.removeClass(this.options.realElementClass).insertBefore(this.fakeElement);
            this.fakeElement.remove();
            clearInterval(this.stepTimer);

            // remove event handlers
            this.page.off('jcf-pointerup', this.onBtnRelease);
            this.realElement.off({
                'keydown': this.onKeyPress,
                'focus': this.onFocus,
                'blur': this.onBlur
            });
        }
    });

}(jQuery, this));

/*!
 * JavaScript Custom Forms : Textarea Module
 *
 * Copyright 2014 PSD2HTML (http://psd2html.com)
 * Released under the MIT license (LICENSE.txt)
 * 
 * Version: 1.0.3
 */
;
(function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Textarea',
        selector: 'textarea',
        options: {
            resize: true,
            resizerStructure: '<span class="jcf-resize"></span>',
            fakeStructure: '<span class="jcf-textarea"></span>'
        },
        matchElement: function (element) {
            return element.is('textarea');
        },
        init: function (options) {
            this.initStructure();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            // prepare structure
            this.doc = $(document);
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
            this.resizer = $(this.options.resizerStructure).appendTo(this.fakeElement);

            // add custom scrollbar
            if (jcf.modules.Scrollable) {
                this.realElement.prependTo(this.fakeElement).addClass().css({
                    overflow: 'hidden',
                    resize: 'none'
                });

                this.scrollable = new jcf.modules.Scrollable({
                    element: this.realElement,
                    alwaysShowScrollbars: true
                });
                this.scrollable.setScrollBarEdge(this.resizer.outerHeight());
            }
        },
        attachEvents: function () {
            // add event handlers
            this.realElement.on({
                focus: this.onFocus,
                keyup: this.onChange,
                change: this.onChange
            });

            this.resizer.on('jcf-pointerdown', this.onResizePress);
        },
        onResizePress: function (e) {
            var resizerOffset = this.resizer.offset(),
                areaOffset = this.fakeElement.offset();

            this.dragData = {
                areaOffset: areaOffset,
                innerOffsetLeft: e.pageX - resizerOffset.left,
                innerOffsetTop: e.pageY - resizerOffset.top
            };
            this.doc.on({
                'jcf-pointermove': this.onResizeMove,
                'jcf-pointerup': this.onResizeRelease
            });
        },
        onResizeMove: function (e) {
            var newWidth = e.pageX + this.dragData.innerOffsetLeft - this.dragData.areaOffset.left,
                newHeight = e.pageY + this.dragData.innerOffsetTop - this.dragData.areaOffset.top,
                widthDiff = this.fakeElement.innerWidth() - this.realElement.innerWidth();

            // prevent text selection or page scroll on touch devices
            e.preventDefault();

            // resize textarea and refresh scrollbars
            this.realElement.innerWidth(newWidth - widthDiff).innerHeight(newHeight);
            this.refreshCustomScrollbars();
        },
        onResizeRelease: function (e) {
            this.doc.off({
                'jcf-pointermove': this.onResizeMove,
                'jcf-pointerup': this.onResizeRelease
            });
        },
        onFocus: function () {
            this.isFocused = true;
            this.fakeElement.addClass(this.options.focusClass);
            this.realElement.on('blur', this.onBlur);
        },
        onBlur: function () {
            this.isFocused = false;
            this.fakeElement.removeClass(this.options.focusClass);
            this.realElement.off('blur', this.onBlur);
        },
        onChange: function () {
            this.refreshCustomScrollbars();
        },
        refreshCustomScrollbars: function () {
            // refresh custom scrollbars
            if (this.isFocused) {
                this.scrollable.redrawScrollbars();
            } else {
                this.scrollable.refresh();
            }
        },
        refresh: function () {
            // refresh custom scroll position
            var isDisabled = this.realElement.is(':disabled');
            this.fakeElement.toggleClass(this.options.disabledClass, isDisabled);
        },
        destroy: function () {
            // destroy custom scrollbar
            this.scrollable.destroy();

            // restore styles and remove event listeners
            this.realElement.css({
                overflow: '',
                resize: ''
            }).insertBefore(this.fakeElement).off({
                focus: this.onFocus,
                blur: this.onBlur
            });

            // remove scrollbar and fake wrapper
            this.fakeElement.remove();
        }
    });

}(jQuery, this));

/*
 * Responsive Layout helper
 */
ResponsiveHelper = (function ($) {
    // init variables
    var handlers = [],
        prevWinWidth,
        win = $(window),
        nativeMatchMedia = false;

    // detect match media support
    if (window.matchMedia) {
        if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
            nativeMatchMedia = true;
        } else if (window.matchMedia.toString().indexOf('native') > -1) {
            nativeMatchMedia = true;
        }
    }

    // prepare resize handler
    function resizeHandler() {
        var winWidth = win.width();
        if (winWidth !== prevWinWidth) {
            prevWinWidth = winWidth;

            // loop through range groups
            $.each(handlers, function (index, rangeObject) {
                // disable current active area if needed
                $.each(rangeObject.data, function (property, item) {
                    if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
                        item.currentActive = false;
                        if (typeof item.disableCallback === 'function') {
                            item.disableCallback();
                        }
                    }
                });

                // enable areas that match current width
                $.each(rangeObject.data, function (property, item) {
                    if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
                        // make callback
                        item.currentActive = true;
                        if (typeof item.enableCallback === 'function') {
                            item.enableCallback();
                        }
                    }
                });
            });
        }
    }

    win.bind('load resize orientationchange', resizeHandler);

    // test range
    function matchRange(r1, r2) {
        var mediaQueryString = '';
        if (r1 > 0) {
            mediaQueryString += '(min-width: ' + r1 + 'px)';
        }
        if (r2 < Infinity) {
            mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
        }
        return matchQuery(mediaQueryString, r1, r2);
    }

    // media query function
    function matchQuery(query, r1, r2) {
        if (window.matchMedia && nativeMatchMedia) {
            return matchMedia(query).matches;
        } else if (window.styleMedia) {
            return styleMedia.matchMedium(query);
        } else if (window.media) {
            return media.matchMedium(query);
        } else {
            return prevWinWidth >= r1 && prevWinWidth <= r2;
        }
    }

    // range parser
    function parseRange(rangeStr) {
        var rangeData = rangeStr.split('..');
        var x1 = parseInt(rangeData[0], 10) || -Infinity;
        var x2 = parseInt(rangeData[1], 10) || Infinity;
        return [x1, x2].sort(function (a, b) {
            return a - b;
        });
    }

    // export public functions
    return {
        addRange: function (ranges) {
            // parse data and add items to collection
            var result = {data: {}};
            $.each(ranges, function (property, data) {
                result.data[property] = {
                    range: parseRange(property),
                    enableCallback: data.on,
                    disableCallback: data.off
                };
            });
            handlers.push(result);

            // call resizeHandler to recalculate all events
            prevWinWidth = null;
            resizeHandler();
        }
    };
}(jQuery));

/*
 * Simple star rating module
 */
function StarRating() {
    this.options = {
        activeClass: 'active',
        settedClass: 'setted',
        element: null,
        items: null,
        onselect: null
    };
    this.init.apply(this, arguments);
}
StarRating.prototype = {
    init: function (opt) {
        this.setOptions(opt);
        if (this.element) {
            this.getElements();
            this.addEvents();
        }
    },
    setOptions: function (opt) {
        for (var p in opt) {
            if (opt.hasOwnProperty(p)) {
                this.options[p] = opt[p];
            }
        }
        if (this.options.element) {
            this.element = this.options.element;
        }
    },
    getElements: function () {
        // get switch objects
        if (this.options.items === null) {
            this.items = this.element.children;
        } else {
            if (typeof this.options.items === 'string') {
                this.items = this.element.getElementsByTagName(this.options.items);
            } else if (typeof this.options.items === 'object') {
                this.items = this.options.items;
            }
        }

        // find default active index
        for (var i = 0; i < this.items.length; i++) {
            if (lib.hasClass(this.items[i], this.options.activeClass)) {
                this.activeIndex = i;
            }
            if (lib.hasClass(this.items[i], this.options.settedClass)) {
                this.settedIndex = i;
            }
        }
    },
    addEvents: function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].onmouseover = lib.bind(this.overHandler, this, i);
            this.items[i].onmouseout = lib.bind(this.outHandler, this, i);
            this.items[i].onclick = lib.bind(this.clickHandler, this, i);
        }
    },
    overHandler: function (ind) {
        this.hovering = true;
        this.hoverIndex = ind;
        this.refreshClasses();
    },
    outHandler: function (ind) {
        this.hovering = false;
        this.refreshClasses();
    },
    clickHandler: function (ind) {
        this.hovering = false;
        this.settedIndex = ind;
        if (typeof this.options.onselect === 'function') {
            this.options.onselect(ind);
        }
        this.refreshClasses();
        return false;
    },
    refreshClasses: function () {
        for (var i = 0; i < this.items.length; i++) {
            lib.removeClass(this.items[i], this.options.activeClass);
            lib.removeClass(this.items[i], this.options.settedClass);
        }
        if (this.hovering) {
            lib.addClass(this.items[this.hoverIndex], this.options.activeClass);
        } else {
            if (typeof this.settedIndex === 'number') {
                lib.addClass(this.items[this.settedIndex], this.options.settedClass);
            } else {
                if (typeof this.activeIndex === 'number') {
                    lib.addClass(this.items[this.activeIndex], this.options.activeClass);
                }
            }
        }
    }
};

/*
 * Utility module
 */
lib = {
    hasClass: function (el, cls) {
        return el && el.className ? el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
    },
    addClass: function (el, cls) {
        if (el && !this.hasClass(el, cls)) el.className += " " + cls;
    },
    removeClass: function (el, cls) {
        if (el && this.hasClass(el, cls)) {
            el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
        }
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    each: function (obj, callback) {
        var property, len;
        if (typeof obj.length === 'number') {
            for (property = 0, len = obj.length; property < len; property++) {
                if (callback.call(obj[property], property, obj[property]) === false) {
                    break;
                }
            }
        } else {
            for (property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (callback.call(obj[property], property, obj[property]) === false) {
                        break;
                    }
                }
            }
        }
    },
    event: (function () {
        var fixEvent = function (e) {
            e = e || window.event;
            if (e.isFixed) return e; else e.isFixed = true;
            if (!e.target) e.target = e.srcElement;
            e.preventDefault = e.preventDefault || function () {
                this.returnValue = false;
            };
            e.stopPropagation = e.stopPropagation || function () {
                this.cancelBubble = true;
            };
            return e;
        };
        return {
            add: function (elem, event, handler) {
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (e) {
                        var ret, handlers = elem.events[e.type];
                        e = fixEvent(e);
                        for (var i = 0, len = handlers.length; i < len; i++) {
                            if (handlers[i]) {
                                ret = handlers[i].call(elem, e);
                                if (ret === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }
                    };
                }
                if (!elem.events[event]) {
                    elem.events[event] = [];
                    if (elem.addEventListener) elem.addEventListener(event, elem.handle, false);
                    else if (elem.attachEvent) elem.attachEvent('on' + event, elem.handle);
                }
                elem.events[event].push(handler);
            },
            remove: function (elem, event, handler) {
                var handlers = elem.events[event];
                for (var i = handlers.length - 1; i >= 0; i--) {
                    if (handlers[i] === handler) {
                        handlers.splice(i, 1);
                    }
                }
                if (!handlers.length) {
                    delete elem.events[event];
                    if (elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
                    else if (elem.detachEvent) elem.detachEvent('on' + event, elem.handle);
                }
            }
        };
    }()),
    queryElementsBySelector: function (selector, scope) {
        scope = scope || document;
        if (!selector) return [];
        if (selector === '>*') return scope.children;
        if (typeof document.querySelectorAll === 'function') {
            return scope.querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (element && tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = element ? [element] : [];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName) == attrValue)
                            };
                            break;
                        case '~':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)')))
                            };
                            break;
                        case '|':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')))
                            };
                            break;
                        case '^':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) == 0)
                            };
                            break;
                        case '$':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length)
                            };
                            break;
                        case '*':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) > -1)
                            };
                            break;
                        default :
                            checkFunction = function (e) {
                                return e.getAttribute(attrName)
                            };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    trim: function (str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    bind: function (f, scope, forceArgs) {
        return function () {
            return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);
        };
    }
};

/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
if (Object.create) {
    !function (a, b, c, d) {
        "use strict";
        function e(a, b, c) {
            return setTimeout(k(a, c), b)
        }

        function f(a, b, c) {
            return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
        }

        function g(a, b, c) {
            var e;
            if (a)if (a.forEach)a.forEach(b, c); else if (a.length !== d)for (e = 0; e < a.length;)b.call(c, a[e], e, a), e++; else for (e in a)a.hasOwnProperty(e) && b.call(c, a[e], e, a)
        }

        function h(a, b, c) {
            for (var e = Object.keys(b), f = 0; f < e.length;)(!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
            return a
        }

        function i(a, b) {
            return h(a, b, !0)
        }

        function j(a, b, c) {
            var d, e = b.prototype;
            d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && h(d, c)
        }

        function k(a, b) {
            return function () {
                return a.apply(b, arguments)
            }
        }

        function l(a, b) {
            return typeof a == kb ? a.apply(b ? b[0] || d : d, b) : a
        }

        function m(a, b) {
            return a === d ? b : a
        }

        function n(a, b, c) {
            g(r(b), function (b) {
                a.addEventListener(b, c, !1)
            })
        }

        function o(a, b, c) {
            g(r(b), function (b) {
                a.removeEventListener(b, c, !1)
            })
        }

        function p(a, b) {
            for (; a;) {
                if (a == b)return !0;
                a = a.parentNode
            }
            return !1
        }

        function q(a, b) {
            return a.indexOf(b) > -1
        }

        function r(a) {
            return a.trim().split(/\s+/g)
        }

        function s(a, b, c) {
            if (a.indexOf && !c)return a.indexOf(b);
            for (var d = 0; d < a.length;) {
                if (c && a[d][c] == b || !c && a[d] === b)return d;
                d++
            }
            return -1
        }

        function t(a) {
            return Array.prototype.slice.call(a, 0)
        }

        function u(a, b, c) {
            for (var d = [], e = [], f = 0; f < a.length;) {
                var g = b ? a[f][b] : a[f];
                s(e, g) < 0 && d.push(a[f]), e[f] = g, f++
            }
            return c && (d = b ? d.sort(function (a, c) {
                return a[b] > c[b]
            }) : d.sort()), d
        }

        function v(a, b) {
            for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ib.length;) {
                if (c = ib[g], e = c ? c + f : b, e in a)return e;
                g++
            }
            return d
        }

        function w() {
            return ob++
        }

        function x(a) {
            var b = a.ownerDocument;
            return b.defaultView || b.parentWindow
        }

        function y(a, b) {
            var c = this;
            this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
                l(a.options.enable, [a]) && c.handler(b)
            }, this.init()
        }

        function z(a) {
            var b, c = a.options.inputClass;
            return new (b = c ? c : rb ? N : sb ? Q : qb ? S : M)(a, A)
        }

        function A(a, b, c) {
            var d = c.pointers.length, e = c.changedPointers.length, f = b & yb && d - e === 0, g = b & (Ab | Bb) && d - e === 0;
            c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, B(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c
        }

        function B(a, b) {
            var c = a.session, d = b.pointers, e = d.length;
            c.firstInput || (c.firstInput = E(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
            var f = c.firstInput, g = c.firstMultiple, h = g ? g.center : f.center, i = b.center = F(d);
            b.timeStamp = nb(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = J(h, i), b.distance = I(h, i), C(c, b), b.offsetDirection = H(b.deltaX, b.deltaY), b.scale = g ? L(g.pointers, d) : 1, b.rotation = g ? K(g.pointers, d) : 0, D(c, b);
            var j = a.element;
            p(b.srcEvent.target, j) && (j = b.srcEvent.target), b.target = j
        }

        function C(a, b) {
            var c = b.center, d = a.offsetDelta || {}, e = a.prevDelta || {}, f = a.prevInput || {};
            (b.eventType === yb || f.eventType === Ab) && (e = a.prevDelta = {
                x: f.deltaX || 0,
                y: f.deltaY || 0
            }, d = a.offsetDelta = {x: c.x, y: c.y}), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y)
        }

        function D(a, b) {
            var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp;
            if (b.eventType != Bb && (i > xb || h.velocity === d)) {
                var j = h.deltaX - b.deltaX, k = h.deltaY - b.deltaY, l = G(i, j, k);
                e = l.x, f = l.y, c = mb(l.x) > mb(l.y) ? l.x : l.y, g = H(j, k), a.lastInterval = b
            } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
            b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g
        }

        function E(a) {
            for (var b = [], c = 0; c < a.pointers.length;)b[c] = {
                clientX: lb(a.pointers[c].clientX),
                clientY: lb(a.pointers[c].clientY)
            }, c++;
            return {timeStamp: nb(), pointers: b, center: F(b), deltaX: a.deltaX, deltaY: a.deltaY}
        }

        function F(a) {
            var b = a.length;
            if (1 === b)return {x: lb(a[0].clientX), y: lb(a[0].clientY)};
            for (var c = 0, d = 0, e = 0; b > e;)c += a[e].clientX, d += a[e].clientY, e++;
            return {x: lb(c / b), y: lb(d / b)}
        }

        function G(a, b, c) {
            return {x: b / a || 0, y: c / a || 0}
        }

        function H(a, b) {
            return a === b ? Cb : mb(a) >= mb(b) ? a > 0 ? Db : Eb : b > 0 ? Fb : Gb
        }

        function I(a, b, c) {
            c || (c = Kb);
            var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
            return Math.sqrt(d * d + e * e)
        }

        function J(a, b, c) {
            c || (c = Kb);
            var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
            return 180 * Math.atan2(e, d) / Math.PI
        }

        function K(a, b) {
            return J(b[1], b[0], Lb) - J(a[1], a[0], Lb)
        }

        function L(a, b) {
            return I(b[0], b[1], Lb) / I(a[0], a[1], Lb)
        }

        function M() {
            this.evEl = Nb, this.evWin = Ob, this.allow = !0, this.pressed = !1, y.apply(this, arguments)
        }

        function N() {
            this.evEl = Rb, this.evWin = Sb, y.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function O() {
            this.evTarget = Ub, this.evWin = Vb, this.started = !1, y.apply(this, arguments)
        }

        function P(a, b) {
            var c = t(a.touches), d = t(a.changedTouches);
            return b & (Ab | Bb) && (c = u(c.concat(d), "identifier", !0)), [c, d]
        }

        function Q() {
            this.evTarget = Xb, this.targetIds = {}, y.apply(this, arguments)
        }

        function R(a, b) {
            var c = t(a.touches), d = this.targetIds;
            if (b & (yb | zb) && 1 === c.length)return d[c[0].identifier] = !0, [c, c];
            var e, f, g = t(a.changedTouches), h = [], i = this.target;
            if (f = c.filter(function (a) {
                    return p(a.target, i)
                }), b === yb)for (e = 0; e < f.length;)d[f[e].identifier] = !0, e++;
            for (e = 0; e < g.length;)d[g[e].identifier] && h.push(g[e]), b & (Ab | Bb) && delete d[g[e].identifier], e++;
            return h.length ? [u(f.concat(h), "identifier", !0), h] : void 0
        }

        function S() {
            y.apply(this, arguments);
            var a = k(this.handler, this);
            this.touch = new Q(this.manager, a), this.mouse = new M(this.manager, a)
        }

        function T(a, b) {
            this.manager = a, this.set(b)
        }

        function U(a) {
            if (q(a, bc))return bc;
            var b = q(a, cc), c = q(a, dc);
            return b && c ? cc + " " + dc : b || c ? b ? cc : dc : q(a, ac) ? ac : _b
        }

        function V(a) {
            this.id = w(), this.manager = null, this.options = i(a || {}, this.defaults), this.options.enable = m(this.options.enable, !0), this.state = ec, this.simultaneous = {}, this.requireFail = []
        }

        function W(a) {
            return a & jc ? "cancel" : a & hc ? "end" : a & gc ? "move" : a & fc ? "start" : ""
        }

        function X(a) {
            return a == Gb ? "down" : a == Fb ? "up" : a == Db ? "left" : a == Eb ? "right" : ""
        }

        function Y(a, b) {
            var c = b.manager;
            return c ? c.get(a) : a
        }

        function Z() {
            V.apply(this, arguments)
        }

        function $() {
            Z.apply(this, arguments), this.pX = null, this.pY = null
        }

        function _() {
            Z.apply(this, arguments)
        }

        function ab() {
            V.apply(this, arguments), this._timer = null, this._input = null
        }

        function bb() {
            Z.apply(this, arguments)
        }

        function cb() {
            Z.apply(this, arguments)
        }

        function db() {
            V.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function eb(a, b) {
            return b = b || {}, b.recognizers = m(b.recognizers, eb.defaults.preset), new fb(a, b)
        }

        function fb(a, b) {
            b = b || {}, this.options = i(b, eb.defaults), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, this.input = z(this), this.touchAction = new T(this, this.options.touchAction), gb(this, !0), g(b.recognizers, function (a) {
                var b = this.add(new a[0](a[1]));
                a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3])
            }, this)
        }

        function gb(a, b) {
            var c = a.element;
            g(a.options.cssProps, function (a, d) {
                c.style[v(c.style, d)] = b ? a : ""
            })
        }

        function hb(a, c) {
            var d = b.createEvent("Event");
            d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d)
        }

        var ib = ["", "webkit", "moz", "MS", "ms", "o"], jb = b.createElement("div"), kb = "function", lb = Math.round, mb = Math.abs, nb = Date.now, ob = 1, pb = /mobile|tablet|ip(ad|hone|od)|android/i, qb = "ontouchstart"in a, rb = v(a, "PointerEvent") !== d, sb = qb && pb.test(navigator.userAgent), tb = "touch", ub = "pen", vb = "mouse", wb = "kinect", xb = 25, yb = 1, zb = 2, Ab = 4, Bb = 8, Cb = 1, Db = 2, Eb = 4, Fb = 8, Gb = 16, Hb = Db | Eb, Ib = Fb | Gb, Jb = Hb | Ib, Kb = ["x", "y"], Lb = ["clientX", "clientY"];
        y.prototype = {
            handler: function () {
            }, init: function () {
                this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(x(this.element), this.evWin, this.domHandler)
            }, destroy: function () {
                this.evEl && o(this.element, this.evEl, this.domHandler), this.evTarget && o(this.target, this.evTarget, this.domHandler), this.evWin && o(x(this.element), this.evWin, this.domHandler)
            }
        };
        var Mb = {mousedown: yb, mousemove: zb, mouseup: Ab}, Nb = "mousedown", Ob = "mousemove mouseup";
        j(M, y, {
            handler: function (a) {
                var b = Mb[a.type];
                b & yb && 0 === a.button && (this.pressed = !0), b & zb && 1 !== a.which && (b = Ab), this.pressed && this.allow && (b & Ab && (this.pressed = !1), this.callback(this.manager, b, {
                    pointers: [a],
                    changedPointers: [a],
                    pointerType: vb,
                    srcEvent: a
                }))
            }
        });
        var Pb = {pointerdown: yb, pointermove: zb, pointerup: Ab, pointercancel: Bb, pointerout: Bb}, Qb = {
            2: tb,
            3: ub,
            4: vb,
            5: wb
        }, Rb = "pointerdown", Sb = "pointermove pointerup pointercancel";
        a.MSPointerEvent && (Rb = "MSPointerDown", Sb = "MSPointerMove MSPointerUp MSPointerCancel"), j(N, y, {
            handler: function (a) {
                var b = this.store, c = !1, d = a.type.toLowerCase().replace("ms", ""), e = Pb[d], f = Qb[a.pointerType] || a.pointerType, g = f == tb, h = s(b, a.pointerId, "pointerId");
                e & yb && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ab | Bb) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {
                    pointers: b,
                    changedPointers: [a],
                    pointerType: f,
                    srcEvent: a
                }), c && b.splice(h, 1))
            }
        });
        var Tb = {
            touchstart: yb,
            touchmove: zb,
            touchend: Ab,
            touchcancel: Bb
        }, Ub = "touchstart", Vb = "touchstart touchmove touchend touchcancel";
        j(O, y, {
            handler: function (a) {
                var b = Tb[a.type];
                if (b === yb && (this.started = !0), this.started) {
                    var c = P.call(this, a, b);
                    b & (Ab | Bb) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, {
                        pointers: c[0],
                        changedPointers: c[1],
                        pointerType: tb,
                        srcEvent: a
                    })
                }
            }
        });
        var Wb = {
            touchstart: yb,
            touchmove: zb,
            touchend: Ab,
            touchcancel: Bb
        }, Xb = "touchstart touchmove touchend touchcancel";
        j(Q, y, {
            handler: function (a) {
                var b = Wb[a.type], c = R.call(this, a, b);
                c && this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: tb,
                    srcEvent: a
                })
            }
        }), j(S, y, {
            handler: function (a, b, c) {
                var d = c.pointerType == tb, e = c.pointerType == vb;
                if (d)this.mouse.allow = !1; else if (e && !this.mouse.allow)return;
                b & (Ab | Bb) && (this.mouse.allow = !0), this.callback(a, b, c)
            }, destroy: function () {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var Yb = v(jb.style, "touchAction"), Zb = Yb !== d, $b = "compute", _b = "auto", ac = "manipulation", bc = "none", cc = "pan-x", dc = "pan-y";
        T.prototype = {
            set: function (a) {
                a == $b && (a = this.compute()), Zb && (this.manager.element.style[Yb] = a), this.actions = a.toLowerCase().trim()
            }, update: function () {
                this.set(this.manager.options.touchAction)
            }, compute: function () {
                var a = [];
                return g(this.manager.recognizers, function (b) {
                    l(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
                }), U(a.join(" "))
            }, preventDefaults: function (a) {
                if (!Zb) {
                    var b = a.srcEvent, c = a.offsetDirection;
                    if (this.manager.session.prevented)return void b.preventDefault();
                    var d = this.actions, e = q(d, bc), f = q(d, dc), g = q(d, cc);
                    return e || f && c & Hb || g && c & Ib ? this.preventSrc(b) : void 0
                }
            }, preventSrc: function (a) {
                this.manager.session.prevented = !0, a.preventDefault()
            }
        };
        var ec = 1, fc = 2, gc = 4, hc = 8, ic = hc, jc = 16, kc = 32;
        V.prototype = {
            defaults: {}, set: function (a) {
                return h(this.options, a), this.manager && this.manager.touchAction.update(), this
            }, recognizeWith: function (a) {
                if (f(a, "recognizeWith", this))return this;
                var b = this.simultaneous;
                return a = Y(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
            }, dropRecognizeWith: function (a) {
                return f(a, "dropRecognizeWith", this) ? this : (a = Y(a, this), delete this.simultaneous[a.id], this)
            }, requireFailure: function (a) {
                if (f(a, "requireFailure", this))return this;
                var b = this.requireFail;
                return a = Y(a, this), -1 === s(b, a) && (b.push(a), a.requireFailure(this)), this
            }, dropRequireFailure: function (a) {
                if (f(a, "dropRequireFailure", this))return this;
                a = Y(a, this);
                var b = s(this.requireFail, a);
                return b > -1 && this.requireFail.splice(b, 1), this
            }, hasRequireFailures: function () {
                return this.requireFail.length > 0
            }, canRecognizeWith: function (a) {
                return !!this.simultaneous[a.id]
            }, emit: function (a) {
                function b(b) {
                    c.manager.emit(c.options.event + (b ? W(d) : ""), a)
                }

                var c = this, d = this.state;
                hc > d && b(!0), b(), d >= hc && b(!0)
            }, tryEmit: function (a) {
                return this.canEmit() ? this.emit(a) : void(this.state = kc)
            }, canEmit: function () {
                for (var a = 0; a < this.requireFail.length;) {
                    if (!(this.requireFail[a].state & (kc | ec)))return !1;
                    a++
                }
                return !0
            }, recognize: function (a) {
                var b = h({}, a);
                return l(this.options.enable, [this, b]) ? (this.state & (ic | jc | kc) && (this.state = ec), this.state = this.process(b), void(this.state & (fc | gc | hc | jc) && this.tryEmit(b))) : (this.reset(), void(this.state = kc))
            }, process: function () {
            }, getTouchAction: function () {
            }, reset: function () {
            }
        }, j(Z, V, {
            defaults: {pointers: 1}, attrTest: function (a) {
                var b = this.options.pointers;
                return 0 === b || a.pointers.length === b
            }, process: function (a) {
                var b = this.state, c = a.eventType, d = b & (fc | gc), e = this.attrTest(a);
                return d && (c & Bb || !e) ? b | jc : d || e ? c & Ab ? b | hc : b & fc ? b | gc : fc : kc
            }
        }), j($, Z, {
            defaults: {event: "pan", threshold: 10, pointers: 1, direction: Jb}, getTouchAction: function () {
                var a = this.options.direction, b = [];
                return a & Hb && b.push(dc), a & Ib && b.push(cc), b
            }, directionTest: function (a) {
                var b = this.options, c = !0, d = a.distance, e = a.direction, f = a.deltaX, g = a.deltaY;
                return e & b.direction || (b.direction & Hb ? (e = 0 === f ? Cb : 0 > f ? Db : Eb, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Cb : 0 > g ? Fb : Gb, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction
            }, attrTest: function (a) {
                return Z.prototype.attrTest.call(this, a) && (this.state & fc || !(this.state & fc) && this.directionTest(a))
            }, emit: function (a) {
                this.pX = a.deltaX, this.pY = a.deltaY;
                var b = X(a.direction);
                b && this.manager.emit(this.options.event + b, a), this._super.emit.call(this, a)
            }
        }), j(_, Z, {
            defaults: {event: "pinch", threshold: 0, pointers: 2}, getTouchAction: function () {
                return [bc]
            }, attrTest: function (a) {
                return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fc)
            }, emit: function (a) {
                if (this._super.emit.call(this, a), 1 !== a.scale) {
                    var b = a.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + b, a)
                }
            }
        }), j(ab, V, {
            defaults: {event: "press", pointers: 1, time: 500, threshold: 5}, getTouchAction: function () {
                return [_b]
            }, process: function (a) {
                var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime > b.time;
                if (this._input = a, !d || !c || a.eventType & (Ab | Bb) && !f)this.reset(); else if (a.eventType & yb)this.reset(), this._timer = e(function () {
                    this.state = ic, this.tryEmit()
                }, b.time, this); else if (a.eventType & Ab)return ic;
                return kc
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function (a) {
                this.state === ic && (a && a.eventType & Ab ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb(), this.manager.emit(this.options.event, this._input)))
            }
        }), j(bb, Z, {
            defaults: {event: "rotate", threshold: 0, pointers: 2}, getTouchAction: function () {
                return [bc]
            }, attrTest: function (a) {
                return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fc)
            }
        }), j(cb, Z, {
            defaults: {event: "swipe", threshold: 10, velocity: .65, direction: Hb | Ib, pointers: 1},
            getTouchAction: function () {
                return $.prototype.getTouchAction.call(this)
            },
            attrTest: function (a) {
                var b, c = this.options.direction;
                return c & (Hb | Ib) ? b = a.velocity : c & Hb ? b = a.velocityX : c & Ib && (b = a.velocityY), this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && mb(b) > this.options.velocity && a.eventType & Ab
            },
            emit: function (a) {
                var b = X(a.direction);
                b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a)
            }
        }), j(db, V, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 2,
                posThreshold: 10
            }, getTouchAction: function () {
                return [ac]
            }, process: function (a) {
                var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime < b.time;
                if (this.reset(), a.eventType & yb && 0 === this.count)return this.failTimeout();
                if (d && f && c) {
                    if (a.eventType != Ab)return this.failTimeout();
                    var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0, h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                    this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
                    var i = this.count % b.taps;
                    if (0 === i)return this.hasRequireFailures() ? (this._timer = e(function () {
                        this.state = ic, this.tryEmit()
                    }, b.interval, this), fc) : ic
                }
                return kc
            }, failTimeout: function () {
                return this._timer = e(function () {
                    this.state = kc
                }, this.options.interval, this), kc
            }, reset: function () {
                clearTimeout(this._timer)
            }, emit: function () {
                this.state == ic && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), eb.VERSION = "2.0.4", eb.defaults = {
            domEvents: !1,
            touchAction: $b,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [[bb, {enable: !1}], [_, {enable: !1}, ["rotate"]], [cb, {direction: Hb}], [$, {direction: Hb}, ["swipe"]], [db], [db, {
                event: "doubletap",
                taps: 2
            }, ["tap"]], [ab]],
            cssProps: {
                userSelect: "none",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        var lc = 1, mc = 2;
        fb.prototype = {
            set: function (a) {
                return h(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
            }, stop: function (a) {
                this.session.stopped = a ? mc : lc
            }, recognize: function (a) {
                var b = this.session;
                if (!b.stopped) {
                    this.touchAction.preventDefaults(a);
                    var c, d = this.recognizers, e = b.curRecognizer;
                    (!e || e && e.state & ic) && (e = b.curRecognizer = null);
                    for (var f = 0; f < d.length;)c = d[f], b.stopped === mc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (fc | gc | hc) && (e = b.curRecognizer = c), f++
                }
            }, get: function (a) {
                if (a instanceof V)return a;
                for (var b = this.recognizers, c = 0; c < b.length; c++)if (b[c].options.event == a)return b[c];
                return null
            }, add: function (a) {
                if (f(a, "add", this))return this;
                var b = this.get(a.options.event);
                return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
            }, remove: function (a) {
                if (f(a, "remove", this))return this;
                var b = this.recognizers;
                return a = this.get(a), b.splice(s(b, a), 1), this.touchAction.update(), this
            }, on: function (a, b) {
                var c = this.handlers;
                return g(r(a), function (a) {
                    c[a] = c[a] || [], c[a].push(b)
                }), this
            }, off: function (a, b) {
                var c = this.handlers;
                return g(r(a), function (a) {
                    b ? c[a].splice(s(c[a], b), 1) : delete c[a]
                }), this
            }, emit: function (a, b) {
                this.options.domEvents && hb(a, b);
                var c = this.handlers[a] && this.handlers[a].slice();
                if (c && c.length) {
                    b.type = a, b.preventDefault = function () {
                        b.srcEvent.preventDefault()
                    };
                    for (var d = 0; d < c.length;)c[d](b), d++
                }
            }, destroy: function () {
                this.element && gb(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, h(eb, {
            INPUT_START: yb,
            INPUT_MOVE: zb,
            INPUT_END: Ab,
            INPUT_CANCEL: Bb,
            STATE_POSSIBLE: ec,
            STATE_BEGAN: fc,
            STATE_CHANGED: gc,
            STATE_ENDED: hc,
            STATE_RECOGNIZED: ic,
            STATE_CANCELLED: jc,
            STATE_FAILED: kc,
            DIRECTION_NONE: Cb,
            DIRECTION_LEFT: Db,
            DIRECTION_RIGHT: Eb,
            DIRECTION_UP: Fb,
            DIRECTION_DOWN: Gb,
            DIRECTION_HORIZONTAL: Hb,
            DIRECTION_VERTICAL: Ib,
            DIRECTION_ALL: Jb,
            Manager: fb,
            Input: y,
            TouchAction: T,
            TouchInput: Q,
            MouseInput: M,
            PointerEventInput: N,
            TouchMouseInput: S,
            SingleTouchInput: O,
            Recognizer: V,
            AttrRecognizer: Z,
            Tap: db,
            Pan: $,
            Swipe: cb,
            Pinch: _,
            Rotate: bb,
            Press: ab,
            on: n,
            off: o,
            each: g,
            merge: i,
            extend: h,
            inherit: j,
            bindFn: k,
            prefixed: v
        }), typeof define == kb && define.amd ? define(function () {
            return eb
        }) : "undefined" != typeof module && module.exports ? module.exports = eb : a[c] = eb
    }(window, document, "Hammer");
}

/*! jQuery UI - v1.11.3 - 2015-03-09
 * http://jqueryui.com
 * Includes: core.js, widget.js, mouse.js, draggable.js, droppable.js, sortable.js, datepicker.js, slider.js
 * Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
})(function (e) {
    function t(t, s) {
        var n, a, o, r = t.nodeName.toLowerCase();
        return "area" === r ? (n = t.parentNode, a = n.name, t.href && a && "map" === n.nodeName.toLowerCase() ? (o = e("img[usemap='#" + a + "']")[0], !!o && i(o)) : !1) : (/^(input|select|textarea|button|object)$/.test(r) ? !t.disabled : "a" === r ? t.href || s : s) && i(t)
    }

    function i(t) {
        return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
                return "hidden" === e.css(this, "visibility")
            }).length
    }

    function s(e) {
        for (var t, i; e.length && e[0] !== document;) {
            if (t = e.css("position"), ("absolute" === t || "relative" === t || "fixed" === t) && (i = parseInt(e.css("zIndex"), 10), !isNaN(i) && 0 !== i))return i;
            e = e.parent()
        }
        return 0
    }

    function n() {
        this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        }, this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        }, e.extend(this._defaults, this.regional[""]), this.regional.en = e.extend(!0, {}, this.regional[""]), this.regional["en-US"] = e.extend(!0, {}, this.regional.en), this.dpDiv = a(e("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
    }

    function a(t) {
        var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return t.delegate(i, "mouseout", function () {
            e(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && e(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && e(this).removeClass("ui-datepicker-next-hover")
        }).delegate(i, "mouseover", o)
    }

    function o() {
        e.datepicker._isDisabledDatepicker(d.inline ? d.dpDiv.parent()[0] : d.input[0]) || (e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), e(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && e(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && e(this).addClass("ui-datepicker-next-hover"))
    }

    function r(t, i) {
        e.extend(t, i);
        for (var s in i)null == i[s] && (t[s] = i[s]);
        return t
    }

    e.ui = e.ui || {}, e.extend(e.ui, {
        version: "1.11.3",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), e.fn.extend({
        scrollParent: function (t) {
            var i = this.css("position"), s = "absolute" === i, n = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/, a = this.parents().filter(function () {
                var t = e(this);
                return s && "static" === t.css("position") ? !1 : n.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
            }).eq(0);
            return "fixed" !== i && a.length ? a : e(this[0].ownerDocument || document)
        }, uniqueId: function () {
            var e = 0;
            return function () {
                return this.each(function () {
                    this.id || (this.id = "ui-id-" + ++e)
                })
            }
        }(), removeUniqueId: function () {
            return this.each(function () {
                /^ui-id-\d+$/.test(this.id) && e(this).removeAttr("id")
            })
        }
    }), e.extend(e.expr[":"], {
        data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
            return function (i) {
                return !!e.data(i, t)
            }
        }) : function (t, i, s) {
            return !!e.data(t, s[3])
        }, focusable: function (i) {
            return t(i, !isNaN(e.attr(i, "tabindex")))
        }, tabbable: function (i) {
            var s = e.attr(i, "tabindex"), n = isNaN(s);
            return (n || s >= 0) && t(i, !n)
        }
    }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (t, i) {
        function s(t, i, s, a) {
            return e.each(n, function () {
                i -= parseFloat(e.css(t, "padding" + this)) || 0, s && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), a && (i -= parseFloat(e.css(t, "margin" + this)) || 0)
            }), i
        }

        var n = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"], a = i.toLowerCase(), o = {
            innerWidth: e.fn.innerWidth,
            innerHeight: e.fn.innerHeight,
            outerWidth: e.fn.outerWidth,
            outerHeight: e.fn.outerHeight
        };
        e.fn["inner" + i] = function (t) {
            return void 0 === t ? o["inner" + i].call(this) : this.each(function () {
                e(this).css(a, s(this, t) + "px")
            })
        }, e.fn["outer" + i] = function (t, n) {
            return "number" != typeof t ? o["outer" + i].call(this, t) : this.each(function () {
                e(this).css(a, s(this, t, !0, n) + "px")
            })
        }
    }), e.fn.addBack || (e.fn.addBack = function (e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
        return function (i) {
            return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this)
        }
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.fn.extend({
        focus: function (t) {
            return function (i, s) {
                return "number" == typeof i ? this.each(function () {
                    var t = this;
                    setTimeout(function () {
                        e(t).focus(), s && s.call(t)
                    }, i)
                }) : t.apply(this, arguments)
            }
        }(e.fn.focus), disableSelection: function () {
            var e = "onselectstart"in document.createElement("div") ? "selectstart" : "mousedown";
            return function () {
                return this.bind(e + ".ui-disableSelection", function (e) {
                    e.preventDefault()
                })
            }
        }(), enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }, zIndex: function (t) {
            if (void 0 !== t)return this.css("zIndex", t);
            if (this.length)for (var i, s, n = e(this[0]); n.length && n[0] !== document;) {
                if (i = n.css("position"), ("absolute" === i || "relative" === i || "fixed" === i) && (s = parseInt(n.css("zIndex"), 10), !isNaN(s) && 0 !== s))return s;
                n = n.parent()
            }
            return 0
        }
    }), e.ui.plugin = {
        add: function (t, i, s) {
            var n, a = e.ui[t].prototype;
            for (n in s)a.plugins[n] = a.plugins[n] || [], a.plugins[n].push([i, s[n]])
        }, call: function (e, t, i, s) {
            var n, a = e.plugins[t];
            if (a && (s || e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType))for (n = 0; a.length > n; n++)e.options[a[n][0]] && a[n][1].apply(e.element, i)
        }
    };
    var h = 0, l = Array.prototype.slice;
    e.cleanData = function (t) {
        return function (i) {
            var s, n, a;
            for (a = 0; null != (n = i[a]); a++)try {
                s = e._data(n, "events"), s && s.remove && e(n).triggerHandler("remove")
            } catch (o) {
            }
            t(i)
        }
    }(e.cleanData), e.widget = function (t, i, s) {
        var n, a, o, r, h = {}, l = t.split(".")[0];
        return t = t.split(".")[1], n = l + "-" + t, s || (s = i, i = e.Widget), e.expr[":"][n.toLowerCase()] = function (t) {
            return !!e.data(t, n)
        }, e[l] = e[l] || {}, a = e[l][t], o = e[l][t] = function (e, t) {
            return this._createWidget ? (arguments.length && this._createWidget(e, t), void 0) : new o(e, t)
        }, e.extend(o, a, {
            version: s.version,
            _proto: e.extend({}, s),
            _childConstructors: []
        }), r = new i, r.options = e.widget.extend({}, r.options), e.each(s, function (t, s) {
            return e.isFunction(s) ? (h[t] = function () {
                var e = function () {
                    return i.prototype[t].apply(this, arguments)
                }, n = function (e) {
                    return i.prototype[t].apply(this, e)
                };
                return function () {
                    var t, i = this._super, a = this._superApply;
                    return this._super = e, this._superApply = n, t = s.apply(this, arguments), this._super = i, this._superApply = a, t
                }
            }(), void 0) : (h[t] = s, void 0)
        }), o.prototype = e.widget.extend(r, {widgetEventPrefix: a ? r.widgetEventPrefix || t : t}, h, {
            constructor: o,
            namespace: l,
            widgetName: t,
            widgetFullName: n
        }), a ? (e.each(a._childConstructors, function (t, i) {
            var s = i.prototype;
            e.widget(s.namespace + "." + s.widgetName, o, i._proto)
        }), delete a._childConstructors) : i._childConstructors.push(o), e.widget.bridge(t, o), o
    }, e.widget.extend = function (t) {
        for (var i, s, n = l.call(arguments, 1), a = 0, o = n.length; o > a; a++)for (i in n[a])s = n[a][i], n[a].hasOwnProperty(i) && void 0 !== s && (t[i] = e.isPlainObject(s) ? e.isPlainObject(t[i]) ? e.widget.extend({}, t[i], s) : e.widget.extend({}, s) : s);
        return t
    }, e.widget.bridge = function (t, i) {
        var s = i.prototype.widgetFullName || t;
        e.fn[t] = function (n) {
            var a = "string" == typeof n, o = l.call(arguments, 1), r = this;
            return a ? this.each(function () {
                var i, a = e.data(this, s);
                return "instance" === n ? (r = a, !1) : a ? e.isFunction(a[n]) && "_" !== n.charAt(0) ? (i = a[n].apply(a, o), i !== a && void 0 !== i ? (r = i && i.jquery ? r.pushStack(i.get()) : i, !1) : void 0) : e.error("no such method '" + n + "' for " + t + " widget instance") : e.error("cannot call methods on " + t + " prior to initialization; " + "attempted to call method '" + n + "'")
            }) : (o.length && (n = e.widget.extend.apply(null, [n].concat(o))), this.each(function () {
                var t = e.data(this, s);
                t ? (t.option(n || {}), t._init && t._init()) : e.data(this, s, new i(n, this))
            })), r
        }
    }, e.Widget = function () {
    }, e.Widget._childConstructors = [], e.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: !1, create: null},
        _createWidget: function (t, i) {
            i = e(i || this.defaultElement || this)[0], this.element = e(i), this.uuid = h++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = e(), this.hoverable = e(), this.focusable = e(), i !== this && (e.data(i, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function (e) {
                    e.target === i && this.destroy()
                }
            }), this.document = e(i.style ? i.ownerDocument : i.document || i), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function () {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: e.noop,
        widget: function () {
            return this.element
        },
        option: function (t, i) {
            var s, n, a, o = t;
            if (0 === arguments.length)return e.widget.extend({}, this.options);
            if ("string" == typeof t)if (o = {}, s = t.split("."), t = s.shift(), s.length) {
                for (n = o[t] = e.widget.extend({}, this.options[t]), a = 0; s.length - 1 > a; a++)n[s[a]] = n[s[a]] || {}, n = n[s[a]];
                if (t = s.pop(), 1 === arguments.length)return void 0 === n[t] ? null : n[t];
                n[t] = i
            } else {
                if (1 === arguments.length)return void 0 === this.options[t] ? null : this.options[t];
                o[t] = i
            }
            return this._setOptions(o), this
        },
        _setOptions: function (e) {
            var t;
            for (t in e)this._setOption(t, e[t]);
            return this
        },
        _setOption: function (e, t) {
            return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!t), t && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
        },
        enable: function () {
            return this._setOptions({disabled: !1})
        },
        disable: function () {
            return this._setOptions({disabled: !0})
        },
        _on: function (t, i, s) {
            var n, a = this;
            "boolean" != typeof t && (s = i, i = t, t = !1), s ? (i = n = e(i), this.bindings = this.bindings.add(i)) : (s = i, i = this.element, n = this.widget()), e.each(s, function (s, o) {
                function r() {
                    return t || a.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? a[o] : o).apply(a, arguments) : void 0
                }

                "string" != typeof o && (r.guid = o.guid = o.guid || r.guid || e.guid++);
                var h = s.match(/^([\w:-]*)\s*(.*)$/), l = h[1] + a.eventNamespace, u = h[2];
                u ? n.delegate(u, l, r) : i.bind(l, r)
            })
        },
        _off: function (t, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(i).undelegate(i), this.bindings = e(this.bindings.not(t).get()), this.focusable = e(this.focusable.not(t).get()), this.hoverable = e(this.hoverable.not(t).get())
        },
        _delay: function (e, t) {
            function i() {
                return ("string" == typeof e ? s[e] : e).apply(s, arguments)
            }

            var s = this;
            return setTimeout(i, t || 0)
        },
        _hoverable: function (t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function (t) {
                    e(t.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (t) {
                    e(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function (t) {
                    e(t.currentTarget).addClass("ui-state-focus")
                }, focusout: function (t) {
                    e(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (t, i, s) {
            var n, a, o = this.options[t];
            if (s = s || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], a = i.originalEvent)for (n in a)n in i || (i[n] = a[n]);
            return this.element.trigger(i, s), !(e.isFunction(o) && o.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
        }
    }, e.each({show: "fadeIn", hide: "fadeOut"}, function (t, i) {
        e.Widget.prototype["_" + t] = function (s, n, a) {
            "string" == typeof n && (n = {effect: n});
            var o, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : t;
            n = n || {}, "number" == typeof n && (n = {duration: n}), o = !e.isEmptyObject(n), n.complete = a, n.delay && s.delay(n.delay), o && e.effects && e.effects.effect[r] ? s[t](n) : r !== t && s[r] ? s[r](n.duration, n.easing, a) : s.queue(function (i) {
                e(this)[t](), a && a.call(s[0]), i()
            })
        }
    }), e.widget;
    var u = !1;
    e(document).mouseup(function () {
        u = !1
    }), e.widget("ui.mouse", {
        version: "1.11.3",
        options: {cancel: "input,textarea,button,select,option", distance: 1, delay: 0},
        _mouseInit: function () {
            var t = this;
            this.element.bind("mousedown." + this.widgetName, function (e) {
                return t._mouseDown(e)
            }).bind("click." + this.widgetName, function (i) {
                return !0 === e.data(i.target, t.widgetName + ".preventClickEvent") ? (e.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
            }), this.started = !1
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function (t) {
            if (!u) {
                this._mouseMoved = !1, this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t;
                var i = this, s = 1 === t.which, n = "string" == typeof this.options.cancel && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
                return s && !n && this._mouseCapture(t) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                    i.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(t) !== !1, !this._mouseStarted) ? (t.preventDefault(), !0) : (!0 === e.data(t.target, this.widgetName + ".preventClickEvent") && e.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
                    return i._mouseMove(e)
                }, this._mouseUpDelegate = function (e) {
                    return i._mouseUp(e)
                }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), u = !0, !0)) : !0
            }
        },
        _mouseMove: function (t) {
            if (this._mouseMoved) {
                if (e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button)return this._mouseUp(t);
                if (!t.which)return this._mouseUp(t)
            }
            return (t.which || t.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
        },
        _mouseUp: function (t) {
            return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), u = !1, !1
        },
        _mouseDistanceMet: function (e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet
        },
        _mouseStart: function () {
        },
        _mouseDrag: function () {
        },
        _mouseStop: function () {
        },
        _mouseCapture: function () {
            return !0
        }
    }), e.widget("ui.draggable", e.ui.mouse, {
        version: "1.11.3",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function () {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._setHandleClassName(), this._mouseInit()
        },
        _setOption: function (e, t) {
            this._super(e, t), "handle" === e && (this._removeHandleClassName(), this._setHandleClassName())
        },
        _destroy: function () {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? (this.destroyOnClear = !0, void 0) : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._removeHandleClassName(), this._mouseDestroy(), void 0)
        },
        _mouseCapture: function (t) {
            var i = this.options;
            return this._blurActiveElement(t), this.helper || i.disabled || e(t.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(t), this.handle ? (this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1)
        },
        _blockFrames: function (t) {
            this.iframeBlocks = this.document.find(t).map(function () {
                var t = e(this);
                return e("<div>").css("position", "absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]
            })
        },
        _unblockFrames: function () {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _blurActiveElement: function (t) {
            var i = this.document[0];
            if (this.handleElement.is(t.target))try {
                i.activeElement && "body" !== i.activeElement.nodeName.toLowerCase() && e(i.activeElement).blur()
            } catch (s) {
            }
        },
        _mouseStart: function (t) {
            var i = this.options;
            return this.helper = this._createHelper(t), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), e.ui.ddmanager && (e.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
                return "fixed" === e(this).css("position")
            }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(t), this.originalPosition = this.position = this._generatePosition(t, !1), this.originalPageX = t.pageX, this.originalPageY = t.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this._setContainment(), this._trigger("start", t) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this._normalizeRightBottom(), this._mouseDrag(t, !0), e.ui.ddmanager && e.ui.ddmanager.dragStart(this, t), !0)
        },
        _refreshOffsets: function (e) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }, this.offset.click = {left: e.pageX - this.offset.left, top: e.pageY - this.offset.top}
        },
        _mouseDrag: function (t, i) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(t, !0), this.positionAbs = this._convertPositionTo("absolute"), !i) {
                var s = this._uiHash();
                if (this._trigger("drag", t, s) === !1)return this._mouseUp({}), !1;
                this.position = s.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", e.ui.ddmanager && e.ui.ddmanager.drag(this, t), !1
        },
        _mouseStop: function (t) {
            var i = this, s = !1;
            return e.ui.ddmanager && !this.options.dropBehaviour && (s = e.ui.ddmanager.drop(this, t)), this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || e.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? e(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                i._trigger("stop", t) !== !1 && i._clear()
            }) : this._trigger("stop", t) !== !1 && this._clear(), !1
        },
        _mouseUp: function (t) {
            return this._unblockFrames(), e.ui.ddmanager && e.ui.ddmanager.dragStop(this, t), this.handleElement.is(t.target) && this.element.focus(), e.ui.mouse.prototype._mouseUp.call(this, t)
        },
        cancel: function () {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
        },
        _getHandle: function (t) {
            return this.options.handle ? !!e(t.target).closest(this.element.find(this.options.handle)).length : !0
        },
        _setHandleClassName: function () {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this.handleElement.addClass("ui-draggable-handle")
        },
        _removeHandleClassName: function () {
            this.handleElement.removeClass("ui-draggable-handle")
        },
        _createHelper: function (t) {
            var i = this.options, s = e.isFunction(i.helper), n = s ? e(i.helper.apply(this.element[0], [t])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
            return n.parents("body").length || n.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), s && n[0] === this.element[0] && this._setPositionRelative(), n[0] === this.element[0] || /(fixed|absolute)/.test(n.css("position")) || n.css("position", "absolute"), n
        },
        _setPositionRelative: function () {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function (t) {
            "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _isRootNode: function (e) {
            return /(html|body)/i.test(e.tagName) || e === this.document[0]
        },
        _getParentOffset: function () {
            var t = this.offsetParent.offset(), i = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== i && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (t = {
                top: 0,
                left: 0
            }), {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if ("relative" !== this.cssPosition)return {top: 0, left: 0};
            var e = this.element.position(), t = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + (t ? 0 : this.scrollParent.scrollTop()),
                left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + (t ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var t, i, s, n = this.options, a = this.document[0];
            return this.relativeContainer = null, n.containment ? "window" === n.containment ? (this.containment = [e(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, e(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, e(window).scrollLeft() + e(window).width() - this.helperProportions.width - this.margins.left, e(window).scrollTop() + (e(window).height() || a.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === n.containment ? (this.containment = [0, 0, e(a).width() - this.helperProportions.width - this.margins.left, (e(a).height() || a.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : n.containment.constructor === Array ? (this.containment = n.containment, void 0) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), i = e(n.containment), s = i[0], s && (t = /(scroll|auto)/.test(i.css("overflow")), this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (t ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (t ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = i), void 0) : (this.containment = null, void 0)
        },
        _convertPositionTo: function (e, t) {
            t || (t = this.position);
            var i = "absolute" === e ? 1 : -1, s = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : s ? 0 : this.offset.scroll.top) * i,
                left: t.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : s ? 0 : this.offset.scroll.left) * i
            }
        },
        _generatePosition: function (e, t) {
            var i, s, n, a, o = this.options, r = this._isRootNode(this.scrollParent[0]), h = e.pageX, l = e.pageY;
            return r && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), t && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, e.pageX - this.offset.click.left < i[0] && (h = i[0] + this.offset.click.left), e.pageY - this.offset.click.top < i[1] && (l = i[1] + this.offset.click.top), e.pageX - this.offset.click.left > i[2] && (h = i[2] + this.offset.click.left), e.pageY - this.offset.click.top > i[3] && (l = i[3] + this.offset.click.top)), o.grid && (n = o.grid[1] ? this.originalPageY + Math.round((l - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY, l = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - o.grid[1] : n + o.grid[1] : n, a = o.grid[0] ? this.originalPageX + Math.round((h - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX, h = i ? a - this.offset.click.left >= i[0] || a - this.offset.click.left > i[2] ? a : a - this.offset.click.left >= i[0] ? a - o.grid[0] : a + o.grid[0] : a), "y" === o.axis && (h = this.originalPageX), "x" === o.axis && (l = this.originalPageY)), {
                top: l - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : r ? 0 : this.offset.scroll.top),
                left: h - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : r ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
        },
        _normalizeRightBottom: function () {
            "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), this.helper.css("right", "auto")), "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()), this.helper.css("bottom", "auto"))
        },
        _trigger: function (t, i, s) {
            return s = s || this._uiHash(), e.ui.plugin.call(this, t, [i, s, this], !0), /^(drag|start|stop)/.test(t) && (this.positionAbs = this._convertPositionTo("absolute"), s.offset = this.positionAbs), e.Widget.prototype._trigger.call(this, t, i, s)
        },
        plugins: {},
        _uiHash: function () {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), e.ui.plugin.add("draggable", "connectToSortable", {
        start: function (t, i, s) {
            var n = e.extend({}, i, {item: s.element});
            s.sortables = [], e(s.options.connectToSortable).each(function () {
                var i = e(this).sortable("instance");
                i && !i.options.disabled && (s.sortables.push(i), i.refreshPositions(), i._trigger("activate", t, n))
            })
        }, stop: function (t, i, s) {
            var n = e.extend({}, i, {item: s.element});
            s.cancelHelperRemoval = !1, e.each(s.sortables, function () {
                var e = this;
                e.isOver ? (e.isOver = 0, s.cancelHelperRemoval = !0, e.cancelHelperRemoval = !1, e._storedCSS = {
                    position: e.placeholder.css("position"),
                    top: e.placeholder.css("top"),
                    left: e.placeholder.css("left")
                }, e._mouseStop(t), e.options.helper = e.options._helper) : (e.cancelHelperRemoval = !0, e._trigger("deactivate", t, n))
            })
        }, drag: function (t, i, s) {
            e.each(s.sortables, function () {
                var n = !1, a = this;
                a.positionAbs = s.positionAbs, a.helperProportions = s.helperProportions, a.offset.click = s.offset.click, a._intersectsWith(a.containerCache) && (n = !0, e.each(s.sortables, function () {
                    return this.positionAbs = s.positionAbs, this.helperProportions = s.helperProportions, this.offset.click = s.offset.click, this !== a && this._intersectsWith(this.containerCache) && e.contains(a.element[0], this.element[0]) && (n = !1), n
                })), n ? (a.isOver || (a.isOver = 1, a.currentItem = i.helper.appendTo(a.element).data("ui-sortable-item", !0), a.options._helper = a.options.helper, a.options.helper = function () {
                    return i.helper[0]
                }, t.target = a.currentItem[0], a._mouseCapture(t, !0), a._mouseStart(t, !0, !0), a.offset.click.top = s.offset.click.top, a.offset.click.left = s.offset.click.left, a.offset.parent.left -= s.offset.parent.left - a.offset.parent.left, a.offset.parent.top -= s.offset.parent.top - a.offset.parent.top, s._trigger("toSortable", t), s.dropped = a.element, e.each(s.sortables, function () {
                    this.refreshPositions()
                }), s.currentItem = s.element, a.fromOutside = s), a.currentItem && (a._mouseDrag(t), i.position = a.position)) : a.isOver && (a.isOver = 0, a.cancelHelperRemoval = !0, a.options._revert = a.options.revert, a.options.revert = !1, a._trigger("out", t, a._uiHash(a)), a._mouseStop(t, !0), a.options.revert = a.options._revert, a.options.helper = a.options._helper, a.placeholder && a.placeholder.remove(), s._refreshOffsets(t), i.position = s._generatePosition(t, !0), s._trigger("fromSortable", t), s.dropped = !1, e.each(s.sortables, function () {
                    this.refreshPositions()
                }))
            })
        }
    }), e.ui.plugin.add("draggable", "cursor", {
        start: function (t, i, s) {
            var n = e("body"), a = s.options;
            n.css("cursor") && (a._cursor = n.css("cursor")), n.css("cursor", a.cursor)
        }, stop: function (t, i, s) {
            var n = s.options;
            n._cursor && e("body").css("cursor", n._cursor)
        }
    }), e.ui.plugin.add("draggable", "opacity", {
        start: function (t, i, s) {
            var n = e(i.helper), a = s.options;
            n.css("opacity") && (a._opacity = n.css("opacity")), n.css("opacity", a.opacity)
        }, stop: function (t, i, s) {
            var n = s.options;
            n._opacity && e(i.helper).css("opacity", n._opacity)
        }
    }), e.ui.plugin.add("draggable", "scroll", {
        start: function (e, t, i) {
            i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)), i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
        }, drag: function (t, i, s) {
            var n = s.options, a = !1, o = s.scrollParentNotHidden[0], r = s.document[0];
            o !== r && "HTML" !== o.tagName ? (n.axis && "x" === n.axis || (s.overflowOffset.top + o.offsetHeight - t.pageY < n.scrollSensitivity ? o.scrollTop = a = o.scrollTop + n.scrollSpeed : t.pageY - s.overflowOffset.top < n.scrollSensitivity && (o.scrollTop = a = o.scrollTop - n.scrollSpeed)), n.axis && "y" === n.axis || (s.overflowOffset.left + o.offsetWidth - t.pageX < n.scrollSensitivity ? o.scrollLeft = a = o.scrollLeft + n.scrollSpeed : t.pageX - s.overflowOffset.left < n.scrollSensitivity && (o.scrollLeft = a = o.scrollLeft - n.scrollSpeed))) : (n.axis && "x" === n.axis || (t.pageY - e(r).scrollTop() < n.scrollSensitivity ? a = e(r).scrollTop(e(r).scrollTop() - n.scrollSpeed) : e(window).height() - (t.pageY - e(r).scrollTop()) < n.scrollSensitivity && (a = e(r).scrollTop(e(r).scrollTop() + n.scrollSpeed))), n.axis && "y" === n.axis || (t.pageX - e(r).scrollLeft() < n.scrollSensitivity ? a = e(r).scrollLeft(e(r).scrollLeft() - n.scrollSpeed) : e(window).width() - (t.pageX - e(r).scrollLeft()) < n.scrollSensitivity && (a = e(r).scrollLeft(e(r).scrollLeft() + n.scrollSpeed)))), a !== !1 && e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(s, t)
        }
    }), e.ui.plugin.add("draggable", "snap", {
        start: function (t, i, s) {
            var n = s.options;
            s.snapElements = [], e(n.snap.constructor !== String ? n.snap.items || ":data(ui-draggable)" : n.snap).each(function () {
                var t = e(this), i = t.offset();
                this !== s.element[0] && s.snapElements.push({
                    item: this,
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    top: i.top,
                    left: i.left
                })
            })
        }, drag: function (t, i, s) {
            var n, a, o, r, h, l, u, d, c, p, f = s.options, m = f.snapTolerance, g = i.offset.left, v = g + s.helperProportions.width, y = i.offset.top, b = y + s.helperProportions.height;
            for (c = s.snapElements.length - 1; c >= 0; c--)h = s.snapElements[c].left - s.margins.left, l = h + s.snapElements[c].width, u = s.snapElements[c].top - s.margins.top, d = u + s.snapElements[c].height, h - m > v || g > l + m || u - m > b || y > d + m || !e.contains(s.snapElements[c].item.ownerDocument, s.snapElements[c].item) ? (s.snapElements[c].snapping && s.options.snap.release && s.options.snap.release.call(s.element, t, e.extend(s._uiHash(), {snapItem: s.snapElements[c].item})), s.snapElements[c].snapping = !1) : ("inner" !== f.snapMode && (n = m >= Math.abs(u - b), a = m >= Math.abs(d - y), o = m >= Math.abs(h - v), r = m >= Math.abs(l - g), n && (i.position.top = s._convertPositionTo("relative", {
                top: u - s.helperProportions.height,
                left: 0
            }).top), a && (i.position.top = s._convertPositionTo("relative", {
                top: d,
                left: 0
            }).top), o && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h - s.helperProportions.width
            }).left), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l
            }).left)), p = n || a || o || r, "outer" !== f.snapMode && (n = m >= Math.abs(u - y), a = m >= Math.abs(d - b), o = m >= Math.abs(h - g), r = m >= Math.abs(l - v), n && (i.position.top = s._convertPositionTo("relative", {
                top: u,
                left: 0
            }).top), a && (i.position.top = s._convertPositionTo("relative", {
                top: d - s.helperProportions.height,
                left: 0
            }).top), o && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h
            }).left), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l - s.helperProportions.width
            }).left)), !s.snapElements[c].snapping && (n || a || o || r || p) && s.options.snap.snap && s.options.snap.snap.call(s.element, t, e.extend(s._uiHash(), {snapItem: s.snapElements[c].item})), s.snapElements[c].snapping = n || a || o || r || p)
        }
    }), e.ui.plugin.add("draggable", "stack", {
        start: function (t, i, s) {
            var n, a = s.options, o = e.makeArray(e(a.stack)).sort(function (t, i) {
                return (parseInt(e(t).css("zIndex"), 10) || 0) - (parseInt(e(i).css("zIndex"), 10) || 0)
            });
            o.length && (n = parseInt(e(o[0]).css("zIndex"), 10) || 0, e(o).each(function (t) {
                e(this).css("zIndex", n + t)
            }), this.css("zIndex", n + o.length))
        }
    }), e.ui.plugin.add("draggable", "zIndex", {
        start: function (t, i, s) {
            var n = e(i.helper), a = s.options;
            n.css("zIndex") && (a._zIndex = n.css("zIndex")), n.css("zIndex", a.zIndex)
        }, stop: function (t, i, s) {
            var n = s.options;
            n._zIndex && e(i.helper).css("zIndex", n._zIndex)
        }
    }), e.ui.draggable, e.widget("ui.droppable", {
        version: "1.11.3",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect",
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function () {
            var t, i = this.options, s = i.accept;
            this.isover = !1, this.isout = !0, this.accept = e.isFunction(s) ? s : function (e) {
                return e.is(s)
            }, this.proportions = function () {
                return arguments.length ? (t = arguments[0], void 0) : t ? t : t = {
                    width: this.element[0].offsetWidth,
                    height: this.element[0].offsetHeight
                }
            }, this._addToManager(i.scope), i.addClasses && this.element.addClass("ui-droppable")
        },
        _addToManager: function (t) {
            e.ui.ddmanager.droppables[t] = e.ui.ddmanager.droppables[t] || [], e.ui.ddmanager.droppables[t].push(this)
        },
        _splice: function (e) {
            for (var t = 0; e.length > t; t++)e[t] === this && e.splice(t, 1)
        },
        _destroy: function () {
            var t = e.ui.ddmanager.droppables[this.options.scope];
            this._splice(t), this.element.removeClass("ui-droppable ui-droppable-disabled")
        },
        _setOption: function (t, i) {
            if ("accept" === t)this.accept = e.isFunction(i) ? i : function (e) {
                return e.is(i)
            }; else if ("scope" === t) {
                var s = e.ui.ddmanager.droppables[this.options.scope];
                this._splice(s), this._addToManager(i)
            }
            this._super(t, i)
        },
        _activate: function (t) {
            var i = e.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass), i && this._trigger("activate", t, this.ui(i))
        },
        _deactivate: function (t) {
            var i = e.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass), i && this._trigger("deactivate", t, this.ui(i))
        },
        _over: function (t) {
            var i = e.ui.ddmanager.current;
            i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", t, this.ui(i)))
        },
        _out: function (t) {
            var i = e.ui.ddmanager.current;
            i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", t, this.ui(i)))
        },
        _drop: function (t, i) {
            var s = i || e.ui.ddmanager.current, n = !1;
            return s && (s.currentItem || s.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
                var i = e(this).droppable("instance");
                return i.options.greedy && !i.options.disabled && i.options.scope === s.options.scope && i.accept.call(i.element[0], s.currentItem || s.element) && e.ui.intersect(s, e.extend(i, {offset: i.element.offset()}), i.options.tolerance, t) ? (n = !0, !1) : void 0
            }), n ? !1 : this.accept.call(this.element[0], s.currentItem || s.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", t, this.ui(s)), this.element) : !1) : !1
        },
        ui: function (e) {
            return {
                draggable: e.currentItem || e.element,
                helper: e.helper,
                position: e.position,
                offset: e.positionAbs
            }
        }
    }), e.ui.intersect = function () {
        function e(e, t, i) {
            return e >= t && t + i > e
        }

        return function (t, i, s, n) {
            if (!i.offset)return !1;
            var a = (t.positionAbs || t.position.absolute).left + t.margins.left, o = (t.positionAbs || t.position.absolute).top + t.margins.top, r = a + t.helperProportions.width, h = o + t.helperProportions.height, l = i.offset.left, u = i.offset.top, d = l + i.proportions().width, c = u + i.proportions().height;
            switch (s) {
                case"fit":
                    return a >= l && d >= r && o >= u && c >= h;
                case"intersect":
                    return a + t.helperProportions.width / 2 > l && d > r - t.helperProportions.width / 2 && o + t.helperProportions.height / 2 > u && c > h - t.helperProportions.height / 2;
                case"pointer":
                    return e(n.pageY, u, i.proportions().height) && e(n.pageX, l, i.proportions().width);
                case"touch":
                    return (o >= u && c >= o || h >= u && c >= h || u > o && h > c) && (a >= l && d >= a || r >= l && d >= r || l > a && r > d);
                default:
                    return !1
            }
        }
    }(), e.ui.ddmanager = {
        current: null, droppables: {"default": []}, prepareOffsets: function (t, i) {
            var s, n, a = e.ui.ddmanager.droppables[t.options.scope] || [], o = i ? i.type : null, r = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
            e:for (s = 0; a.length > s; s++)if (!(a[s].options.disabled || t && !a[s].accept.call(a[s].element[0], t.currentItem || t.element))) {
                for (n = 0; r.length > n; n++)if (r[n] === a[s].element[0]) {
                    a[s].proportions().height = 0;
                    continue e
                }
                a[s].visible = "none" !== a[s].element.css("display"), a[s].visible && ("mousedown" === o && a[s]._activate.call(a[s], i), a[s].offset = a[s].element.offset(), a[s].proportions({
                    width: a[s].element[0].offsetWidth,
                    height: a[s].element[0].offsetHeight
                }))
            }
        }, drop: function (t, i) {
            var s = !1;
            return e.each((e.ui.ddmanager.droppables[t.options.scope] || []).slice(), function () {
                this.options && (!this.options.disabled && this.visible && e.ui.intersect(t, this, this.options.tolerance, i) && (s = this._drop.call(this, i) || s), !this.options.disabled && this.visible && this.accept.call(this.element[0], t.currentItem || t.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i)))
            }), s
        }, dragStart: function (t, i) {
            t.element.parentsUntil("body").bind("scroll.droppable", function () {
                t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, i)
            })
        }, drag: function (t, i) {
            t.options.refreshPositions && e.ui.ddmanager.prepareOffsets(t, i), e.each(e.ui.ddmanager.droppables[t.options.scope] || [], function () {
                if (!this.options.disabled && !this.greedyChild && this.visible) {
                    var s, n, a, o = e.ui.intersect(t, this, this.options.tolerance, i), r = !o && this.isover ? "isout" : o && !this.isover ? "isover" : null;
                    r && (this.options.greedy && (n = this.options.scope, a = this.element.parents(":data(ui-droppable)").filter(function () {
                        return e(this).droppable("instance").options.scope === n
                    }), a.length && (s = e(a[0]).droppable("instance"), s.greedyChild = "isover" === r)), s && "isover" === r && (s.isover = !1, s.isout = !0, s._out.call(s, i)), this[r] = !0, this["isout" === r ? "isover" : "isout"] = !1, this["isover" === r ? "_over" : "_out"].call(this, i), s && "isout" === r && (s.isout = !1, s.isover = !0, s._over.call(s, i)))
                }
            })
        }, dragStop: function (t, i) {
            t.element.parentsUntil("body").unbind("scroll.droppable"), t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, i)
        }
    }, e.ui.droppable, e.widget("ui.sortable", e.ui.mouse, {
        version: "1.11.3",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _isOverAxis: function (e, t, i) {
            return e >= t && t + i > e
        },
        _isFloating: function (e) {
            return /left|right/.test(e.css("float")) || /inline|table-cell/.test(e.css("display"))
        },
        _create: function () {
            var e = this.options;
            this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? "x" === e.axis || this._isFloating(this.items[0].item) : !1, this.offset = this.element.offset(), this._mouseInit(), this._setHandleClassName(), this.ready = !0
        },
        _setOption: function (e, t) {
            this._super(e, t), "handle" === e && this._setHandleClassName()
        },
        _setHandleClassName: function () {
            this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle"), e.each(this.items, function () {
                (this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item).addClass("ui-sortable-handle")
            })
        },
        _destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle"), this._mouseDestroy();
            for (var e = this.items.length - 1; e >= 0; e--)this.items[e].item.removeData(this.widgetName + "-item");
            return this
        },
        _mouseCapture: function (t, i) {
            var s = null, n = !1, a = this;
            return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(t), e(t.target).parents().each(function () {
                return e.data(this, a.widgetName + "-item") === a ? (s = e(this), !1) : void 0
            }), e.data(t.target, a.widgetName + "-item") === a && (s = e(t.target)), s ? !this.options.handle || i || (e(this.options.handle, s).find("*").addBack().each(function () {
                this === t.target && (n = !0)
            }), n) ? (this.currentItem = s, this._removeCurrentsFromItems(), !0) : !1 : !1)
        },
        _mouseStart: function (t, i, s) {
            var n, a, o = this.options;
            if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                    top: this.offset.top - this.margins.top,
                    left: this.offset.left - this.margins.left
                }, e.extend(this.offset, {
                    click: {left: t.pageX - this.offset.left, top: t.pageY - this.offset.top},
                    parent: this._getParentOffset(),
                    relative: this._getRelativeOffset()
                }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt), this.domPosition = {
                    prev: this.currentItem.prev()[0],
                    parent: this.currentItem.parent()[0]
                }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), o.containment && this._setContainment(), o.cursor && "auto" !== o.cursor && (a = this.document.find("body"), this.storedCursor = a.css("cursor"), a.css("cursor", o.cursor), this.storedStylesheet = e("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(a)), o.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", o.opacity)), o.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", o.zIndex)), this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !s)for (n = this.containers.length - 1; n >= 0; n--)this.containers[n]._trigger("activate", t, this._uiHash(this));
            return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(t), !0
        },
        _mouseDrag: function (t) {
            var i, s, n, a, o = this.options, r = !1;
            for (this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < o.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + o.scrollSpeed : t.pageY - this.overflowOffset.top < o.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - o.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < o.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + o.scrollSpeed : t.pageX - this.overflowOffset.left < o.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - o.scrollSpeed)) : (t.pageY - this.document.scrollTop() < o.scrollSensitivity ? r = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed) : this.window.height() - (t.pageY - this.document.scrollTop()) < o.scrollSensitivity && (r = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed)), t.pageX - this.document.scrollLeft() < o.scrollSensitivity ? r = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed) : this.window.width() - (t.pageX - this.document.scrollLeft()) < o.scrollSensitivity && (r = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed))), r !== !1 && e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), i = this.items.length - 1; i >= 0; i--)if (s = this.items[i], n = s.item[0], a = this._intersectsWithPointer(s), a && s.instance === this.currentContainer && n !== this.currentItem[0] && this.placeholder[1 === a ? "next" : "prev"]()[0] !== n && !e.contains(this.placeholder[0], n) && ("semi-dynamic" === this.options.type ? !e.contains(this.element[0], n) : !0)) {
                if (this.direction = 1 === a ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(s))break;
                this._rearrange(t, s), this._trigger("change", t, this._uiHash());
                break
            }
            return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
        },
        _mouseStop: function (t, i) {
            if (t) {
                if (e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t), this.options.revert) {
                    var s = this, n = this.placeholder.offset(), a = this.options.axis, o = {};
                    a && "x" !== a || (o.left = n.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft)), a && "y" !== a || (o.top = n.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop)), this.reverting = !0, e(this.helper).animate(o, parseInt(this.options.revert, 10) || 500, function () {
                        s._clear(t)
                    })
                } else this._clear(t, i);
                return !1
            }
        },
        cancel: function () {
            if (this.dragging) {
                this._mouseUp({target: null}), "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var t = this.containers.length - 1; t >= 0; t--)this.containers[t]._trigger("deactivate", null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this
        },
        serialize: function (t) {
            var i = this._getItemsAsjQuery(t && t.connected), s = [];
            return t = t || {}, e(i).each(function () {
                var i = (e(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[\-=_](.+)/);
                i && s.push((t.key || i[1] + "[]") + "=" + (t.key && t.expression ? i[1] : i[2]))
            }), !s.length && t.key && s.push(t.key + "="), s.join("&")
        },
        toArray: function (t) {
            var i = this._getItemsAsjQuery(t && t.connected), s = [];
            return t = t || {}, i.each(function () {
                s.push(e(t.item || this).attr(t.attribute || "id") || "")
            }), s
        },
        _intersectsWith: function (e) {
            var t = this.positionAbs.left, i = t + this.helperProportions.width, s = this.positionAbs.top, n = s + this.helperProportions.height, a = e.left, o = a + e.width, r = e.top, h = r + e.height, l = this.offset.click.top, u = this.offset.click.left, d = "x" === this.options.axis || s + l > r && h > s + l, c = "y" === this.options.axis || t + u > a && o > t + u, p = d && c;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > e[this.floating ? "width" : "height"] ? p : t + this.helperProportions.width / 2 > a && o > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > r && h > n - this.helperProportions.height / 2
        },
        _intersectsWithPointer: function (e) {
            var t = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top, e.height), i = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left, e.width), s = t && i, n = this._getDragVerticalDirection(), a = this._getDragHorizontalDirection();
            return s ? this.floating ? a && "right" === a || "down" === n ? 2 : 1 : n && ("down" === n ? 2 : 1) : !1
        },
        _intersectsWithSides: function (e) {
            var t = this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height), i = this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width), s = this._getDragVerticalDirection(), n = this._getDragHorizontalDirection();
            return this.floating && n ? "right" === n && i || "left" === n && !i : s && ("down" === s && t || "up" === s && !t)
        },
        _getDragVerticalDirection: function () {
            var e = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== e && (e > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var e = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== e && (e > 0 ? "right" : "left")
        },
        refresh: function (e) {
            return this._refreshItems(e), this._setHandleClassName(), this.refreshPositions(), this
        },
        _connectWith: function () {
            var e = this.options;
            return e.connectWith.constructor === String ? [e.connectWith] : e.connectWith
        },
        _getItemsAsjQuery: function (t) {
            function i() {
                r.push(this)
            }

            var s, n, a, o, r = [], h = [], l = this._connectWith();
            if (l && t)for (s = l.length - 1; s >= 0; s--)for (a = e(l[s], this.document[0]), n = a.length - 1; n >= 0; n--)o = e.data(a[n], this.widgetFullName), o && o !== this && !o.options.disabled && h.push([e.isFunction(o.options.items) ? o.options.items.call(o.element) : e(o.options.items, o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), o]);
            for (h.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : e(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), s = h.length - 1; s >= 0; s--)h[s][0].each(i);
            return e(r)
        },
        _removeCurrentsFromItems: function () {
            var t = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = e.grep(this.items, function (e) {
                for (var i = 0; t.length > i; i++)if (t[i] === e.item[0])return !1;
                return !0
            })
        },
        _refreshItems: function (t) {
            this.items = [], this.containers = [this];
            var i, s, n, a, o, r, h, l, u = this.items, d = [[e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {item: this.currentItem}) : e(this.options.items, this.element), this]], c = this._connectWith();
            if (c && this.ready)for (i = c.length - 1; i >= 0; i--)for (n = e(c[i], this.document[0]), s = n.length - 1; s >= 0; s--)a = e.data(n[s], this.widgetFullName), a && a !== this && !a.options.disabled && (d.push([e.isFunction(a.options.items) ? a.options.items.call(a.element[0], t, {item: this.currentItem}) : e(a.options.items, a.element), a]), this.containers.push(a));
            for (i = d.length - 1; i >= 0; i--)for (o = d[i][1], r = d[i][0], s = 0, l = r.length; l > s; s++)h = e(r[s]), h.data(this.widgetName + "-item", o), u.push({
                item: h,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0
            })
        },
        refreshPositions: function (t) {
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            var i, s, n, a;
            for (i = this.items.length - 1; i >= 0; i--)s = this.items[i], s.instance !== this.currentContainer && this.currentContainer && s.item[0] !== this.currentItem[0] || (n = this.options.toleranceElement ? e(this.options.toleranceElement, s.item) : s.item, t || (s.width = n.outerWidth(), s.height = n.outerHeight()), a = n.offset(), s.left = a.left, s.top = a.top);
            if (this.options.custom && this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this); else for (i = this.containers.length - 1; i >= 0; i--)a = this.containers[i].element.offset(), this.containers[i].containerCache.left = a.left, this.containers[i].containerCache.top = a.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
            return this
        },
        _createPlaceholder: function (t) {
            t = t || this;
            var i, s = t.options;
            s.placeholder && s.placeholder.constructor !== String || (i = s.placeholder, s.placeholder = {
                element: function () {
                    var s = t.currentItem[0].nodeName.toLowerCase(), n = e("<" + s + ">", t.document[0]).addClass(i || t.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                    return "tr" === s ? t.currentItem.children().each(function () {
                        e("<td>&#160;</td>", t.document[0]).attr("colspan", e(this).attr("colspan") || 1).appendTo(n)
                    }) : "img" === s && n.attr("src", t.currentItem.attr("src")), i || n.css("visibility", "hidden"), n
                }, update: function (e, n) {
                    (!i || s.forcePlaceholderSize) && (n.height() || n.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css("paddingTop") || 0, 10) - parseInt(t.currentItem.css("paddingBottom") || 0, 10)), n.width() || n.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css("paddingLeft") || 0, 10) - parseInt(t.currentItem.css("paddingRight") || 0, 10)))
                }
            }), t.placeholder = e(s.placeholder.element.call(t.element, t.currentItem)), t.currentItem.after(t.placeholder), s.placeholder.update(t, t.placeholder)
        },
        _contactContainers: function (t) {
            var i, s, n, a, o, r, h, l, u, d, c = null, p = null;
            for (i = this.containers.length - 1; i >= 0; i--)if (!e.contains(this.currentItem[0], this.containers[i].element[0]))if (this._intersectsWith(this.containers[i].containerCache)) {
                if (c && e.contains(this.containers[i].element[0], c.element[0]))continue;
                c = this.containers[i], p = i
            } else this.containers[i].containerCache.over && (this.containers[i]._trigger("out", t, this._uiHash(this)), this.containers[i].containerCache.over = 0);
            if (c)if (1 === this.containers.length)this.containers[p].containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash(this)), this.containers[p].containerCache.over = 1); else {
                for (n = 1e4, a = null, u = c.floating || this._isFloating(this.currentItem), o = u ? "left" : "top", r = u ? "width" : "height", d = u ? "clientX" : "clientY", s = this.items.length - 1; s >= 0; s--)e.contains(this.containers[p].element[0], this.items[s].item[0]) && this.items[s].item[0] !== this.currentItem[0] && (h = this.items[s].item.offset()[o], l = !1, t[d] - h > this.items[s][r] / 2 && (l = !0), n > Math.abs(t[d] - h) && (n = Math.abs(t[d] - h), a = this.items[s], this.direction = l ? "up" : "down"));
                if (!a && !this.options.dropOnEmpty)return;
                if (this.currentContainer === this.containers[p])return this.currentContainer.containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash()), this.currentContainer.containerCache.over = 1), void 0;
                a ? this._rearrange(t, a, null, !0) : this._rearrange(t, null, this.containers[p].element, !0), this._trigger("change", t, this._uiHash()), this.containers[p]._trigger("change", t, this._uiHash(this)), this.currentContainer = this.containers[p], this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[p]._trigger("over", t, this._uiHash(this)), this.containers[p].containerCache.over = 1
            }
        },
        _createHelper: function (t) {
            var i = this.options, s = e.isFunction(i.helper) ? e(i.helper.apply(this.element[0], [t, this.currentItem])) : "clone" === i.helper ? this.currentItem.clone() : this.currentItem;
            return s.parents("body").length || e("parent" !== i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(s[0]), s[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }), (!s[0].style.width || i.forceHelperSize) && s.width(this.currentItem.width()), (!s[0].style.height || i.forceHelperSize) && s.height(this.currentItem.height()), s
        },
        _adjustOffsetFromHelper: function (t) {
            "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && e.ui.ie) && (t = {
                top: 0,
                left: 0
            }), {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if ("relative" === this.cssPosition) {
                var e = this.currentItem.position();
                return {
                    top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {top: 0, left: 0}
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
        },
        _setContainment: function () {
            var t, i, s, n = this.options;
            "parent" === n.containment && (n.containment = this.helper[0].parentNode), ("document" === n.containment || "window" === n.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, "document" === n.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, ("document" === n.containment ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(n.containment) || (t = e(n.containment)[0], i = e(n.containment).offset(), s = "hidden" !== e(t).css("overflow"), this.containment = [i.left + (parseInt(e(t).css("borderLeftWidth"), 10) || 0) + (parseInt(e(t).css("paddingLeft"), 10) || 0) - this.margins.left, i.top + (parseInt(e(t).css("borderTopWidth"), 10) || 0) + (parseInt(e(t).css("paddingTop"), 10) || 0) - this.margins.top, i.left + (s ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(e(t).css("borderLeftWidth"), 10) || 0) - (parseInt(e(t).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, i.top + (s ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(e(t).css("borderTopWidth"), 10) || 0) - (parseInt(e(t).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
        },
        _convertPositionTo: function (t, i) {
            i || (i = this.position);
            var s = "absolute" === t ? 1 : -1, n = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, a = /(html|body)/i.test(n[0].tagName);
            return {
                top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : a ? 0 : n.scrollTop()) * s,
                left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : a ? 0 : n.scrollLeft()) * s
            }
        },
        _generatePosition: function (t) {
            var i, s, n = this.options, a = t.pageX, o = t.pageY, r = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, h = /(html|body)/i.test(r[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (a = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (a = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top)), n.grid && (i = this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1], o = this.containment ? i - this.offset.click.top >= this.containment[1] && i - this.offset.click.top <= this.containment[3] ? i : i - this.offset.click.top >= this.containment[1] ? i - n.grid[1] : i + n.grid[1] : i, s = this.originalPageX + Math.round((a - this.originalPageX) / n.grid[0]) * n.grid[0], a = this.containment ? s - this.offset.click.left >= this.containment[0] && s - this.offset.click.left <= this.containment[2] ? s : s - this.offset.click.left >= this.containment[0] ? s - n.grid[0] : s + n.grid[0] : s)), {
                top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : h ? 0 : r.scrollTop()),
                left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : h ? 0 : r.scrollLeft())
            }
        },
        _rearrange: function (e, t, i, s) {
            i ? i[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
            var n = this.counter;
            this._delay(function () {
                n === this.counter && this.refreshPositions(!s)
            })
        },
        _clear: function (e, t) {
            function i(e, t, i) {
                return function (s) {
                    i._trigger(e, s, t._uiHash(t))
                }
            }

            this.reverting = !1;
            var s, n = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
                for (s in this._storedCSS)("auto" === this._storedCSS[s] || "static" === this._storedCSS[s]) && (this._storedCSS[s] = "");
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            for (this.fromOutside && !t && n.push(function (e) {
                this._trigger("receive", e, this._uiHash(this.fromOutside))
            }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || t || n.push(function (e) {
                this._trigger("update", e, this._uiHash())
            }), this !== this.currentContainer && (t || (n.push(function (e) {
                this._trigger("remove", e, this._uiHash())
            }), n.push(function (e) {
                return function (t) {
                    e._trigger("receive", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer)), n.push(function (e) {
                return function (t) {
                    e._trigger("update", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer)))), s = this.containers.length - 1; s >= 0; s--)t || n.push(i("deactivate", this, this.containers[s])), this.containers[s].containerCache.over && (n.push(i("out", this, this.containers[s])), this.containers[s].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, t || this._trigger("beforeStop", e, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null), !t) {
                for (s = 0; n.length > s; s++)n[s].call(this, e);
                this._trigger("stop", e, this._uiHash())
            }
            return this.fromOutside = !1, !this.cancelHelperRemoval
        },
        _trigger: function () {
            e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
        },
        _uiHash: function (t) {
            var i = t || this;
            return {
                helper: i.helper,
                placeholder: i.placeholder || e([]),
                position: i.position,
                originalPosition: i.originalPosition,
                offset: i.positionAbs,
                item: i.currentItem,
                sender: t ? t.element : null
            }
        }
    }), e.extend(e.ui, {datepicker: {version: "1.11.3"}});
    var d;
    e.extend(n.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        _widgetDatepicker: function () {
            return this.dpDiv
        },
        setDefaults: function (e) {
            return r(this._defaults, e || {}), this
        },
        _attachDatepicker: function (t, i) {
            var s, n, a;
            s = t.nodeName.toLowerCase(), n = "div" === s || "span" === s, t.id || (this.uuid += 1, t.id = "dp" + this.uuid), a = this._newInst(e(t), n), a.settings = e.extend({}, i || {}), "input" === s ? this._connectDatepicker(t, a) : n && this._inlineDatepicker(t, a)
        },
        _newInst: function (t, i) {
            var s = t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
            return {
                id: s,
                input: t,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: i,
                dpDiv: i ? a(e("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
            }
        },
        _connectDatepicker: function (t, i) {
            var s = e(t);
            i.append = e([]), i.trigger = e([]), s.hasClass(this.markerClassName) || (this._attachments(s, i), s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(i), e.data(t, "datepicker", i), i.settings.disabled && this._disableDatepicker(t))
        },
        _attachments: function (t, i) {
            var s, n, a, o = this._get(i, "appendText"), r = this._get(i, "isRTL");
            i.append && i.append.remove(), o && (i.append = e("<span class='" + this._appendClass + "'>" + o + "</span>"), t[r ? "before" : "after"](i.append)), t.unbind("focus", this._showDatepicker), i.trigger && i.trigger.remove(), s = this._get(i, "showOn"), ("focus" === s || "both" === s) && t.focus(this._showDatepicker), ("button" === s || "both" === s) && (n = this._get(i, "buttonText"), a = this._get(i, "buttonImage"), i.trigger = e(this._get(i, "buttonImageOnly") ? e("<img/>").addClass(this._triggerClass).attr({
                src: a,
                alt: n,
                title: n
            }) : e("<button type='button'></button>").addClass(this._triggerClass).html(a ? e("<img/>").attr({
                src: a,
                alt: n,
                title: n
            }) : n)), t[r ? "before" : "after"](i.trigger), i.trigger.click(function () {
                return e.datepicker._datepickerShowing && e.datepicker._lastInput === t[0] ? e.datepicker._hideDatepicker() : e.datepicker._datepickerShowing && e.datepicker._lastInput !== t[0] ? (e.datepicker._hideDatepicker(), e.datepicker._showDatepicker(t[0])) : e.datepicker._showDatepicker(t[0]), !1
            }))
        },
        _autoSize: function (e) {
            if (this._get(e, "autoSize") && !e.inline) {
                var t, i, s, n, a = new Date(2009, 11, 20), o = this._get(e, "dateFormat");
                o.match(/[DM]/) && (t = function (e) {
                    for (i = 0, s = 0, n = 0; e.length > n; n++)e[n].length > i && (i = e[n].length, s = n);
                    return s
                }, a.setMonth(t(this._get(e, o.match(/MM/) ? "monthNames" : "monthNamesShort"))), a.setDate(t(this._get(e, o.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - a.getDay())), e.input.attr("size", this._formatDate(e, a).length)
            }
        },
        _inlineDatepicker: function (t, i) {
            var s = e(t);
            s.hasClass(this.markerClassName) || (s.addClass(this.markerClassName).append(i.dpDiv), e.data(t, "datepicker", i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(t), i.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function (t, i, s, n, a) {
            var o, h, l, u, d, c = this._dialogInst;
            return c || (this.uuid += 1, o = "dp" + this.uuid, this._dialogInput = e("<input type='text' id='" + o + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), e("body").append(this._dialogInput), c = this._dialogInst = this._newInst(this._dialogInput, !1), c.settings = {}, e.data(this._dialogInput[0], "datepicker", c)), r(c.settings, n || {}), i = i && i.constructor === Date ? this._formatDate(c, i) : i, this._dialogInput.val(i), this._pos = a ? a.length ? a : [a.pageX, a.pageY] : null, this._pos || (h = document.documentElement.clientWidth, l = document.documentElement.clientHeight, u = document.documentElement.scrollLeft || document.body.scrollLeft, d = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [h / 2 - 100 + u, l / 2 - 150 + d]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), c.settings.onSelect = s, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), e.blockUI && e.blockUI(this.dpDiv), e.data(this._dialogInput[0], "datepicker", c), this
        },
        _destroyDatepicker: function (t) {
            var i, s = e(t), n = e.data(t, "datepicker");
            s.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), e.removeData(t, "datepicker"), "input" === i ? (n.append.remove(), n.trigger.remove(), s.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === i || "span" === i) && s.removeClass(this.markerClassName).empty(), d === n && (d = null))
        },
        _enableDatepicker: function (t) {
            var i, s, n = e(t), a = e.data(t, "datepicker");
            n.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !1, a.trigger.filter("button").each(function () {
                this.disabled = !1
            }).end().filter("img").css({
                opacity: "1.0",
                cursor: ""
            })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().removeClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = e.map(this._disabledInputs, function (e) {
                return e === t ? null : e
            }))
        },
        _disableDatepicker: function (t) {
            var i, s, n = e(t), a = e.data(t, "datepicker");
            n.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !0, a.trigger.filter("button").each(function () {
                this.disabled = !0
            }).end().filter("img").css({
                opacity: "0.5",
                cursor: "default"
            })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().addClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = e.map(this._disabledInputs, function (e) {
                return e === t ? null : e
            }), this._disabledInputs[this._disabledInputs.length] = t)
        },
        _isDisabledDatepicker: function (e) {
            if (!e)return !1;
            for (var t = 0; this._disabledInputs.length > t; t++)if (this._disabledInputs[t] === e)return !0;
            return !1
        },
        _getInst: function (t) {
            try {
                return e.data(t, "datepicker")
            } catch (i) {
                throw"Missing instance data for this datepicker"
            }
        },
        _optionDatepicker: function (t, i, s) {
            var n, a, o, h, l = this._getInst(t);
            return 2 === arguments.length && "string" == typeof i ? "defaults" === i ? e.extend({}, e.datepicker._defaults) : l ? "all" === i ? e.extend({}, l.settings) : this._get(l, i) : null : (n = i || {}, "string" == typeof i && (n = {}, n[i] = s), l && (this._curInst === l && this._hideDatepicker(), a = this._getDateDatepicker(t, !0), o = this._getMinMaxDate(l, "min"), h = this._getMinMaxDate(l, "max"), r(l.settings, n), null !== o && void 0 !== n.dateFormat && void 0 === n.minDate && (l.settings.minDate = this._formatDate(l, o)), null !== h && void 0 !== n.dateFormat && void 0 === n.maxDate && (l.settings.maxDate = this._formatDate(l, h)), "disabled"in n && (n.disabled ? this._disableDatepicker(t) : this._enableDatepicker(t)), this._attachments(e(t), l), this._autoSize(l), this._setDate(l, a), this._updateAlternate(l), this._updateDatepicker(l)), void 0)
        },
        _changeDatepicker: function (e, t, i) {
            this._optionDatepicker(e, t, i)
        },
        _refreshDatepicker: function (e) {
            var t = this._getInst(e);
            t && this._updateDatepicker(t)
        },
        _setDateDatepicker: function (e, t) {
            var i = this._getInst(e);
            i && (this._setDate(i, t), this._updateDatepicker(i), this._updateAlternate(i))
        },
        _getDateDatepicker: function (e, t) {
            var i = this._getInst(e);
            return i && !i.inline && this._setDateFromField(i, t), i ? this._getDate(i) : null
        },
        _doKeyDown: function (t) {
            var i, s, n, a = e.datepicker._getInst(t.target), o = !0, r = a.dpDiv.is(".ui-datepicker-rtl");
            if (a._keyEvent = !0, e.datepicker._datepickerShowing)switch (t.keyCode) {
                case 9:
                    e.datepicker._hideDatepicker(), o = !1;
                    break;
                case 13:
                    return n = e("td." + e.datepicker._dayOverClass + ":not(." + e.datepicker._currentClass + ")", a.dpDiv), n[0] && e.datepicker._selectDay(t.target, a.selectedMonth, a.selectedYear, n[0]), i = e.datepicker._get(a, "onSelect"), i ? (s = e.datepicker._formatDate(a), i.apply(a.input ? a.input[0] : null, [s, a])) : e.datepicker._hideDatepicker(), !1;
                case 27:
                    e.datepicker._hideDatepicker();
                    break;
                case 33:
                    e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(a, "stepBigMonths") : -e.datepicker._get(a, "stepMonths"), "M");
                    break;
                case 34:
                    e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(a, "stepBigMonths") : +e.datepicker._get(a, "stepMonths"), "M");
                    break;
                case 35:
                    (t.ctrlKey || t.metaKey) && e.datepicker._clearDate(t.target), o = t.ctrlKey || t.metaKey;
                    break;
                case 36:
                    (t.ctrlKey || t.metaKey) && e.datepicker._gotoToday(t.target), o = t.ctrlKey || t.metaKey;
                    break;
                case 37:
                    (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, r ? 1 : -1, "D"), o = t.ctrlKey || t.metaKey, t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? -e.datepicker._get(a, "stepBigMonths") : -e.datepicker._get(a, "stepMonths"), "M");
                    break;
                case 38:
                    (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, -7, "D"), o = t.ctrlKey || t.metaKey;
                    break;
                case 39:
                    (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, r ? -1 : 1, "D"), o = t.ctrlKey || t.metaKey, t.originalEvent.altKey && e.datepicker._adjustDate(t.target, t.ctrlKey ? +e.datepicker._get(a, "stepBigMonths") : +e.datepicker._get(a, "stepMonths"), "M");
                    break;
                case 40:
                    (t.ctrlKey || t.metaKey) && e.datepicker._adjustDate(t.target, 7, "D"), o = t.ctrlKey || t.metaKey;
                    break;
                default:
                    o = !1
            } else 36 === t.keyCode && t.ctrlKey ? e.datepicker._showDatepicker(this) : o = !1;
            o && (t.preventDefault(), t.stopPropagation())
        },
        _doKeyPress: function (t) {
            var i, s, n = e.datepicker._getInst(t.target);
            return e.datepicker._get(n, "constrainInput") ? (i = e.datepicker._possibleChars(e.datepicker._get(n, "dateFormat")), s = String.fromCharCode(null == t.charCode ? t.keyCode : t.charCode), t.ctrlKey || t.metaKey || " " > s || !i || i.indexOf(s) > -1) : void 0
        },
        _doKeyUp: function (t) {
            var i, s = e.datepicker._getInst(t.target);
            if (s.input.val() !== s.lastVal)try {
                i = e.datepicker.parseDate(e.datepicker._get(s, "dateFormat"), s.input ? s.input.val() : null, e.datepicker._getFormatConfig(s)), i && (e.datepicker._setDateFromField(s), e.datepicker._updateAlternate(s), e.datepicker._updateDatepicker(s))
            } catch (n) {
            }
            return !0
        },
        _showDatepicker: function (t) {
            if (t = t.target || t, "input" !== t.nodeName.toLowerCase() && (t = e("input", t.parentNode)[0]), !e.datepicker._isDisabledDatepicker(t) && e.datepicker._lastInput !== t) {
                var i, n, a, o, h, l, u;
                i = e.datepicker._getInst(t), e.datepicker._curInst && e.datepicker._curInst !== i && (e.datepicker._curInst.dpDiv.stop(!0, !0), i && e.datepicker._datepickerShowing && e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])), n = e.datepicker._get(i, "beforeShow"), a = n ? n.apply(t, [t, i]) : {}, a !== !1 && (r(i.settings, a), i.lastVal = null, e.datepicker._lastInput = t, e.datepicker._setDateFromField(i), e.datepicker._inDialog && (t.value = ""), e.datepicker._pos || (e.datepicker._pos = e.datepicker._findPos(t), e.datepicker._pos[1] += t.offsetHeight), o = !1, e(t).parents().each(function () {
                    return o |= "fixed" === e(this).css("position"), !o
                }), h = {
                    left: e.datepicker._pos[0],
                    top: e.datepicker._pos[1]
                }, e.datepicker._pos = null, i.dpDiv.empty(), i.dpDiv.css({
                    position: "absolute",
                    display: "block",
                    top: "-1000px"
                }), e.datepicker._updateDatepicker(i), h = e.datepicker._checkOffset(i, h, o), i.dpDiv.css({
                    position: e.datepicker._inDialog && e.blockUI ? "static" : o ? "fixed" : "absolute",
                    display: "none",
                    left: h.left + "px",
                    top: h.top + "px"
                }), i.inline || (l = e.datepicker._get(i, "showAnim"), u = e.datepicker._get(i, "duration"), i.dpDiv.css("z-index", s(e(t)) + 1), e.datepicker._datepickerShowing = !0, e.effects && e.effects.effect[l] ? i.dpDiv.show(l, e.datepicker._get(i, "showOptions"), u) : i.dpDiv[l || "show"](l ? u : null), e.datepicker._shouldFocusInput(i) && i.input.focus(), e.datepicker._curInst = i))
            }
        },
        _updateDatepicker: function (t) {
            this.maxRows = 4, d = t, t.dpDiv.empty().append(this._generateHTML(t)), this._attachHandlers(t);
            var i, s = this._getNumberOfMonths(t), n = s[1], a = 17, r = t.dpDiv.find("." + this._dayOverClass + " a");
            r.length > 0 && o.apply(r.get(0)), t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), n > 1 && t.dpDiv.addClass("ui-datepicker-multi-" + n).css("width", a * n + "em"), t.dpDiv[(1 !== s[0] || 1 !== s[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), t === e.datepicker._curInst && e.datepicker._datepickerShowing && e.datepicker._shouldFocusInput(t) && t.input.focus(), t.yearshtml && (i = t.yearshtml, setTimeout(function () {
                i === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml), i = t.yearshtml = null
            }, 0))
        },
        _shouldFocusInput: function (e) {
            return e.input && e.input.is(":visible") && !e.input.is(":disabled") && !e.input.is(":focus")
        },
        _checkOffset: function (t, i, s) {
            var n = t.dpDiv.outerWidth(), a = t.dpDiv.outerHeight(), o = t.input ? t.input.outerWidth() : 0, r = t.input ? t.input.outerHeight() : 0, h = document.documentElement.clientWidth + (s ? 0 : e(document).scrollLeft()), l = document.documentElement.clientHeight + (s ? 0 : e(document).scrollTop());
            return i.left -= this._get(t, "isRTL") ? n - o : 0, i.left -= s && i.left === t.input.offset().left ? e(document).scrollLeft() : 0, i.top -= s && i.top === t.input.offset().top + r ? e(document).scrollTop() : 0, i.left -= Math.min(i.left, i.left + n > h && h > n ? Math.abs(i.left + n - h) : 0), i.top -= Math.min(i.top, i.top + a > l && l > a ? Math.abs(a + r) : 0), i
        },
        _findPos: function (t) {
            for (var i, s = this._getInst(t), n = this._get(s, "isRTL"); t && ("hidden" === t.type || 1 !== t.nodeType || e.expr.filters.hidden(t));)t = t[n ? "previousSibling" : "nextSibling"];
            return i = e(t).offset(), [i.left, i.top]
        },
        _hideDatepicker: function (t) {
            var i, s, n, a, o = this._curInst;
            !o || t && o !== e.data(t, "datepicker") || this._datepickerShowing && (i = this._get(o, "showAnim"), s = this._get(o, "duration"), n = function () {
                e.datepicker._tidyDialog(o)
            }, e.effects && (e.effects.effect[i] || e.effects[i]) ? o.dpDiv.hide(i, e.datepicker._get(o, "showOptions"), s, n) : o.dpDiv["slideDown" === i ? "slideUp" : "fadeIn" === i ? "fadeOut" : "hide"](i ? s : null, n), i || n(), this._datepickerShowing = !1, a = this._get(o, "onClose"), a && a.apply(o.input ? o.input[0] : null, [o.input ? o.input.val() : "", o]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                position: "absolute",
                left: "0",
                top: "-100px"
            }), e.blockUI && (e.unblockUI(), e("body").append(this.dpDiv))), this._inDialog = !1)
        },
        _tidyDialog: function (e) {
            e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function (t) {
            if (e.datepicker._curInst) {
                var i = e(t.target), s = e.datepicker._getInst(i[0]);
                (i[0].id !== e.datepicker._mainDivId && 0 === i.parents("#" + e.datepicker._mainDivId).length && !i.hasClass(e.datepicker.markerClassName) && !i.closest("." + e.datepicker._triggerClass).length && e.datepicker._datepickerShowing && (!e.datepicker._inDialog || !e.blockUI) || i.hasClass(e.datepicker.markerClassName) && e.datepicker._curInst !== s) && e.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function (t, i, s) {
            var n = e(t), a = this._getInst(n[0]);
            this._isDisabledDatepicker(n[0]) || (this._adjustInstDate(a, i + ("M" === s ? this._get(a, "showCurrentAtPos") : 0), s), this._updateDatepicker(a))
        },
        _gotoToday: function (t) {
            var i, s = e(t), n = this._getInst(s[0]);
            this._get(n, "gotoCurrent") && n.currentDay ? (n.selectedDay = n.currentDay, n.drawMonth = n.selectedMonth = n.currentMonth, n.drawYear = n.selectedYear = n.currentYear) : (i = new Date, n.selectedDay = i.getDate(), n.drawMonth = n.selectedMonth = i.getMonth(), n.drawYear = n.selectedYear = i.getFullYear()), this._notifyChange(n), this._adjustDate(s)
        },
        _selectMonthYear: function (t, i, s) {
            var n = e(t), a = this._getInst(n[0]);
            a["selected" + ("M" === s ? "Month" : "Year")] = a["draw" + ("M" === s ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10), this._notifyChange(a), this._adjustDate(n)
        },
        _selectDay: function (t, i, s, n) {
            var a, o = e(t);
            e(n).hasClass(this._unselectableClass) || this._isDisabledDatepicker(o[0]) || (a = this._getInst(o[0]), a.selectedDay = a.currentDay = e("a", n).html(), a.selectedMonth = a.currentMonth = i, a.selectedYear = a.currentYear = s, this._selectDate(t, this._formatDate(a, a.currentDay, a.currentMonth, a.currentYear)))
        },
        _clearDate: function (t) {
            var i = e(t);
            this._selectDate(i, "")
        },
        _selectDate: function (t, i) {
            var s, n = e(t), a = this._getInst(n[0]);
            i = null != i ? i : this._formatDate(a), a.input && a.input.val(i), this._updateAlternate(a), s = this._get(a, "onSelect"), s ? s.apply(a.input ? a.input[0] : null, [i, a]) : a.input && a.input.trigger("change"), a.inline ? this._updateDatepicker(a) : (this._hideDatepicker(), this._lastInput = a.input[0], "object" != typeof a.input[0] && a.input.focus(), this._lastInput = null)
        },
        _updateAlternate: function (t) {
            var i, s, n, a = this._get(t, "altField");
            a && (i = this._get(t, "altFormat") || this._get(t, "dateFormat"), s = this._getDate(t), n = this.formatDate(i, s, this._getFormatConfig(t)), e(a).each(function () {
                e(this).val(n)
            }))
        },
        noWeekends: function (e) {
            var t = e.getDay();
            return [t > 0 && 6 > t, ""]
        },
        iso8601Week: function (e) {
            var t, i = new Date(e.getTime());
            return i.setDate(i.getDate() + 4 - (i.getDay() || 7)), t = i.getTime(), i.setMonth(0), i.setDate(1), Math.floor(Math.round((t - i) / 864e5) / 7) + 1
        },
        parseDate: function (t, i, s) {
            if (null == t || null == i)throw"Invalid arguments";
            if (i = "object" == typeof i ? "" + i : i + "", "" === i)return null;
            var n, a, o, r, h = 0, l = (s ? s.shortYearCutoff : null) || this._defaults.shortYearCutoff, u = "string" != typeof l ? l : (new Date).getFullYear() % 100 + parseInt(l, 10), d = (s ? s.dayNamesShort : null) || this._defaults.dayNamesShort, c = (s ? s.dayNames : null) || this._defaults.dayNames, p = (s ? s.monthNamesShort : null) || this._defaults.monthNamesShort, f = (s ? s.monthNames : null) || this._defaults.monthNames, m = -1, g = -1, v = -1, y = -1, b = !1, _ = function (e) {
                var i = t.length > n + 1 && t.charAt(n + 1) === e;
                return i && n++, i
            }, x = function (e) {
                var t = _(e), s = "@" === e ? 14 : "!" === e ? 20 : "y" === e && t ? 4 : "o" === e ? 3 : 2, n = "y" === e ? s : 1, a = RegExp("^\\d{" + n + "," + s + "}"), o = i.substring(h).match(a);
                if (!o)throw"Missing number at position " + h;
                return h += o[0].length, parseInt(o[0], 10)
            }, w = function (t, s, n) {
                var a = -1, o = e.map(_(t) ? n : s, function (e, t) {
                    return [[t, e]]
                }).sort(function (e, t) {
                    return -(e[1].length - t[1].length)
                });
                if (e.each(o, function (e, t) {
                        var s = t[1];
                        return i.substr(h, s.length).toLowerCase() === s.toLowerCase() ? (a = t[0], h += s.length, !1) : void 0
                    }), -1 !== a)return a + 1;
                throw"Unknown name at position " + h
            }, k = function () {
                if (i.charAt(h) !== t.charAt(n))throw"Unexpected literal at position " + h;
                h++
            };
            for (n = 0; t.length > n; n++)if (b)"'" !== t.charAt(n) || _("'") ? k() : b = !1; else switch (t.charAt(n)) {
                case"d":
                    v = x("d");
                    break;
                case"D":
                    w("D", d, c);
                    break;
                case"o":
                    y = x("o");
                    break;
                case"m":
                    g = x("m");
                    break;
                case"M":
                    g = w("M", p, f);
                    break;
                case"y":
                    m = x("y");
                    break;
                case"@":
                    r = new Date(x("@")), m = r.getFullYear(), g = r.getMonth() + 1, v = r.getDate();
                    break;
                case"!":
                    r = new Date((x("!") - this._ticksTo1970) / 1e4), m = r.getFullYear(), g = r.getMonth() + 1, v = r.getDate();
                    break;
                case"'":
                    _("'") ? k() : b = !0;
                    break;
                default:
                    k()
            }
            if (i.length > h && (o = i.substr(h), !/^\s+/.test(o)))throw"Extra/unparsed characters found in date: " + o;
            if (-1 === m ? m = (new Date).getFullYear() : 100 > m && (m += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (u >= m ? 0 : -100)), y > -1)for (g = 1, v = y; ;) {
                if (a = this._getDaysInMonth(m, g - 1), a >= v)break;
                g++, v -= a
            }
            if (r = this._daylightSavingAdjust(new Date(m, g - 1, v)), r.getFullYear() !== m || r.getMonth() + 1 !== g || r.getDate() !== v)throw"Invalid date";
            return r
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: 1e7 * 60 * 60 * 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
        formatDate: function (e, t, i) {
            if (!t)return "";
            var s, n = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort, a = (i ? i.dayNames : null) || this._defaults.dayNames, o = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort, r = (i ? i.monthNames : null) || this._defaults.monthNames, h = function (t) {
                var i = e.length > s + 1 && e.charAt(s + 1) === t;
                return i && s++, i
            }, l = function (e, t, i) {
                var s = "" + t;
                if (h(e))for (; i > s.length;)s = "0" + s;
                return s
            }, u = function (e, t, i, s) {
                return h(e) ? s[t] : i[t]
            }, d = "", c = !1;
            if (t)for (s = 0; e.length > s; s++)if (c)"'" !== e.charAt(s) || h("'") ? d += e.charAt(s) : c = !1; else switch (e.charAt(s)) {
                case"d":
                    d += l("d", t.getDate(), 2);
                    break;
                case"D":
                    d += u("D", t.getDay(), n, a);
                    break;
                case"o":
                    d += l("o", Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                    break;
                case"m":
                    d += l("m", t.getMonth() + 1, 2);
                    break;
                case"M":
                    d += u("M", t.getMonth(), o, r);
                    break;
                case"y":
                    d += h("y") ? t.getFullYear() : (10 > t.getYear() % 100 ? "0" : "") + t.getYear() % 100;
                    break;
                case"@":
                    d += t.getTime();
                    break;
                case"!":
                    d += 1e4 * t.getTime() + this._ticksTo1970;
                    break;
                case"'":
                    h("'") ? d += "'" : c = !0;
                    break;
                default:
                    d += e.charAt(s)
            }
            return d
        },
        _possibleChars: function (e) {
            var t, i = "", s = !1, n = function (i) {
                var s = e.length > t + 1 && e.charAt(t + 1) === i;
                return s && t++, s
            };
            for (t = 0; e.length > t; t++)if (s)"'" !== e.charAt(t) || n("'") ? i += e.charAt(t) : s = !1; else switch (e.charAt(t)) {
                case"d":
                case"m":
                case"y":
                case"@":
                    i += "0123456789";
                    break;
                case"D":
                case"M":
                    return null;
                case"'":
                    n("'") ? i += "'" : s = !0;
                    break;
                default:
                    i += e.charAt(t)
            }
            return i
        },
        _get: function (e, t) {
            return void 0 !== e.settings[t] ? e.settings[t] : this._defaults[t]
        },
        _setDateFromField: function (e, t) {
            if (e.input.val() !== e.lastVal) {
                var i = this._get(e, "dateFormat"), s = e.lastVal = e.input ? e.input.val() : null, n = this._getDefaultDate(e), a = n, o = this._getFormatConfig(e);
                try {
                    a = this.parseDate(i, s, o) || n
                } catch (r) {
                    s = t ? "" : s
                }
                e.selectedDay = a.getDate(), e.drawMonth = e.selectedMonth = a.getMonth(), e.drawYear = e.selectedYear = a.getFullYear(), e.currentDay = s ? a.getDate() : 0, e.currentMonth = s ? a.getMonth() : 0, e.currentYear = s ? a.getFullYear() : 0, this._adjustInstDate(e)
            }
        },
        _getDefaultDate: function (e) {
            return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
        },
        _determineDate: function (t, i, s) {
            var n = function (e) {
                var t = new Date;
                return t.setDate(t.getDate() + e), t
            }, a = function (i) {
                try {
                    return e.datepicker.parseDate(e.datepicker._get(t, "dateFormat"), i, e.datepicker._getFormatConfig(t))
                } catch (s) {
                }
                for (var n = (i.toLowerCase().match(/^c/) ? e.datepicker._getDate(t) : null) || new Date, a = n.getFullYear(), o = n.getMonth(), r = n.getDate(), h = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, l = h.exec(i); l;) {
                    switch (l[2] || "d") {
                        case"d":
                        case"D":
                            r += parseInt(l[1], 10);
                            break;
                        case"w":
                        case"W":
                            r += 7 * parseInt(l[1], 10);
                            break;
                        case"m":
                        case"M":
                            o += parseInt(l[1], 10), r = Math.min(r, e.datepicker._getDaysInMonth(a, o));
                            break;
                        case"y":
                        case"Y":
                            a += parseInt(l[1], 10), r = Math.min(r, e.datepicker._getDaysInMonth(a, o))
                    }
                    l = h.exec(i)
                }
                return new Date(a, o, r)
            }, o = null == i || "" === i ? s : "string" == typeof i ? a(i) : "number" == typeof i ? isNaN(i) ? s : n(i) : new Date(i.getTime());
            return o = o && "Invalid Date" == "" + o ? s : o, o && (o.setHours(0), o.setMinutes(0), o.setSeconds(0), o.setMilliseconds(0)), this._daylightSavingAdjust(o)
        },
        _daylightSavingAdjust: function (e) {
            return e ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e) : null
        },
        _setDate: function (e, t, i) {
            var s = !t, n = e.selectedMonth, a = e.selectedYear, o = this._restrictMinMax(e, this._determineDate(e, t, new Date));
            e.selectedDay = e.currentDay = o.getDate(), e.drawMonth = e.selectedMonth = e.currentMonth = o.getMonth(), e.drawYear = e.selectedYear = e.currentYear = o.getFullYear(), n === e.selectedMonth && a === e.selectedYear || i || this._notifyChange(e), this._adjustInstDate(e), e.input && e.input.val(s ? "" : this._formatDate(e))
        },
        _getDate: function (e) {
            var t = !e.currentYear || e.input && "" === e.input.val() ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
            return t
        },
        _attachHandlers: function (t) {
            var i = this._get(t, "stepMonths"), s = "#" + t.id.replace(/\\\\/g, "\\");
            t.dpDiv.find("[data-handler]").map(function () {
                var t = {
                    prev: function () {
                        e.datepicker._adjustDate(s, -i, "M")
                    }, next: function () {
                        e.datepicker._adjustDate(s, +i, "M")
                    }, hide: function () {
                        e.datepicker._hideDatepicker()
                    }, today: function () {
                        e.datepicker._gotoToday(s)
                    }, selectDay: function () {
                        return e.datepicker._selectDay(s, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                    }, selectMonth: function () {
                        return e.datepicker._selectMonthYear(s, this, "M"), !1
                    }, selectYear: function () {
                        return e.datepicker._selectMonthYear(s, this, "Y"), !1
                    }
                };
                e(this).bind(this.getAttribute("data-event"), t[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function (e) {
            var t, i, s, n, a, o, r, h, l, u, d, c, p, f, m, g, v, y, b, _, x, w, k, T, D, S, N, M, C, A, P, I, H, z, F, E, W, O, L, j = new Date, R = this._daylightSavingAdjust(new Date(j.getFullYear(), j.getMonth(), j.getDate())), Y = this._get(e, "isRTL"), J = this._get(e, "showButtonPanel"), B = this._get(e, "hideIfNoPrevNext"), K = this._get(e, "navigationAsDateFormat"), V = this._getNumberOfMonths(e), U = this._get(e, "showCurrentAtPos"), q = this._get(e, "stepMonths"), G = 1 !== V[0] || 1 !== V[1], X = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)), Q = this._getMinMaxDate(e, "min"), $ = this._getMinMaxDate(e, "max"), Z = e.drawMonth - U, et = e.drawYear;
            if (0 > Z && (Z += 12, et--), $)for (t = this._daylightSavingAdjust(new Date($.getFullYear(), $.getMonth() - V[0] * V[1] + 1, $.getDate())), t = Q && Q > t ? Q : t; this._daylightSavingAdjust(new Date(et, Z, 1)) > t;)Z--, 0 > Z && (Z = 11, et--);
            for (e.drawMonth = Z, e.drawYear = et, i = this._get(e, "prevText"), i = K ? this.formatDate(i, this._daylightSavingAdjust(new Date(et, Z - q, 1)), this._getFormatConfig(e)) : i, s = this._canAdjustMonth(e, -1, et, Z) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>" : B ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "e" : "w") + "'>" + i + "</span></a>", n = this._get(e, "nextText"), n = K ? this.formatDate(n, this._daylightSavingAdjust(new Date(et, Z + q, 1)), this._getFormatConfig(e)) : n, a = this._canAdjustMonth(e, 1, et, Z) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + n + "</span></a>" : B ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (Y ? "w" : "e") + "'>" + n + "</span></a>", o = this._get(e, "currentText"), r = this._get(e, "gotoCurrent") && e.currentDay ? X : R, o = K ? this.formatDate(o, r, this._getFormatConfig(e)) : o, h = e.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(e, "closeText") + "</button>", l = J ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (Y ? h : "") + (this._isInRange(e, r) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + o + "</button>" : "") + (Y ? "" : h) + "</div>" : "", u = parseInt(this._get(e, "firstDay"), 10), u = isNaN(u) ? 0 : u, d = this._get(e, "showWeek"), c = this._get(e, "dayNames"), p = this._get(e, "dayNamesMin"), f = this._get(e, "monthNames"), m = this._get(e, "monthNamesShort"), g = this._get(e, "beforeShowDay"), v = this._get(e, "showOtherMonths"), y = this._get(e, "selectOtherMonths"), b = this._getDefaultDate(e), _ = "", w = 0; V[0] > w; w++) {
                for (k = "", this.maxRows = 4, T = 0; V[1] > T; T++) {
                    if (D = this._daylightSavingAdjust(new Date(et, Z, e.selectedDay)), S = " ui-corner-all", N = "", G) {
                        if (N += "<div class='ui-datepicker-group", V[1] > 1)switch (T) {
                            case 0:
                                N += " ui-datepicker-group-first", S = " ui-corner-" + (Y ? "right" : "left");
                                break;
                            case V[1] - 1:
                                N += " ui-datepicker-group-last", S = " ui-corner-" + (Y ? "left" : "right");
                                break;
                            default:
                                N += " ui-datepicker-group-middle", S = ""
                        }
                        N += "'>"
                    }
                    for (N += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + S + "'>" + (/all|left/.test(S) && 0 === w ? Y ? a : s : "") + (/all|right/.test(S) && 0 === w ? Y ? s : a : "") + this._generateMonthYearHeader(e, Z, et, Q, $, w > 0 || T > 0, f, m) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>", M = d ? "<th class='ui-datepicker-week-col'>" + this._get(e, "weekHeader") + "</th>" : "", x = 0; 7 > x; x++)C = (x + u) % 7, M += "<th scope='col'" + ((x + u + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + c[C] + "'>" + p[C] + "</span></th>";
                    for (N += M + "</tr></thead><tbody>", A = this._getDaysInMonth(et, Z), et === e.selectedYear && Z === e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, A)), P = (this._getFirstDayOfMonth(et, Z) - u + 7) % 7, I = Math.ceil((P + A) / 7), H = G ? this.maxRows > I ? this.maxRows : I : I, this.maxRows = H, z = this._daylightSavingAdjust(new Date(et, Z, 1 - P)), F = 0; H > F; F++) {
                        for (N += "<tr>", E = d ? "<td class='ui-datepicker-week-col'>" + this._get(e, "calculateWeek")(z) + "</td>" : "", x = 0; 7 > x; x++)W = g ? g.apply(e.input ? e.input[0] : null, [z]) : [!0, ""], O = z.getMonth() !== Z, L = O && !y || !W[0] || Q && Q > z || $ && z > $, E += "<td class='" + ((x + u + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (O ? " ui-datepicker-other-month" : "") + (z.getTime() === D.getTime() && Z === e.selectedMonth && e._keyEvent || b.getTime() === z.getTime() && b.getTime() === D.getTime() ? " " + this._dayOverClass : "") + (L ? " " + this._unselectableClass + " ui-state-disabled" : "") + (O && !v ? "" : " " + W[1] + (z.getTime() === X.getTime() ? " " + this._currentClass : "") + (z.getTime() === R.getTime() ? " ui-datepicker-today" : "")) + "'" + (O && !v || !W[2] ? "" : " title='" + W[2].replace(/'/g, "&#39;") + "'") + (L ? "" : " data-handler='selectDay' data-event='click' data-month='" + z.getMonth() + "' data-year='" + z.getFullYear() + "'") + ">" + (O && !v ? "&#xa0;" : L ? "<span class='ui-state-default'>" + z.getDate() + "</span>" : "<a class='ui-state-default" + (z.getTime() === R.getTime() ? " ui-state-highlight" : "") + (z.getTime() === X.getTime() ? " ui-state-active" : "") + (O ? " ui-priority-secondary" : "") + "' href='#'>" + z.getDate() + "</a>") + "</td>", z.setDate(z.getDate() + 1), z = this._daylightSavingAdjust(z);
                        N += E + "</tr>"
                    }
                    Z++, Z > 11 && (Z = 0, et++), N += "</tbody></table>" + (G ? "</div>" + (V[0] > 0 && T === V[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""), k += N
                }
                _ += k
            }
            return _ += l, e._keyEvent = !1, _
        },
        _generateMonthYearHeader: function (e, t, i, s, n, a, o, r) {
            var h, l, u, d, c, p, f, m, g = this._get(e, "changeMonth"), v = this._get(e, "changeYear"), y = this._get(e, "showMonthAfterYear"), b = "<div class='ui-datepicker-title'>", _ = "";
            if (a || !g)_ += "<span class='ui-datepicker-month'>" + o[t] + "</span>"; else {
                for (h = s && s.getFullYear() === i, l = n && n.getFullYear() === i, _ += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", u = 0; 12 > u; u++)(!h || u >= s.getMonth()) && (!l || n.getMonth() >= u) && (_ += "<option value='" + u + "'" + (u === t ? " selected='selected'" : "") + ">" + r[u] + "</option>");
                _ += "</select>"
            }
            if (y || (b += _ + (!a && g && v ? "" : "&#xa0;")), !e.yearshtml)if (e.yearshtml = "", a || !v)b += "<span class='ui-datepicker-year'>" + i + "</span>"; else {
                for (d = this._get(e, "yearRange").split(":"), c = (new Date).getFullYear(), p = function (e) {
                    var t = e.match(/c[+\-].*/) ? i + parseInt(e.substring(1), 10) : e.match(/[+\-].*/) ? c + parseInt(e, 10) : parseInt(e, 10);
                    return isNaN(t) ? c : t
                }, f = p(d[0]), m = Math.max(f, p(d[1] || "")), f = s ? Math.max(f, s.getFullYear()) : f, m = n ? Math.min(m, n.getFullYear()) : m, e.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; m >= f; f++)e.yearshtml += "<option value='" + f + "'" + (f === i ? " selected='selected'" : "") + ">" + f + "</option>";
                e.yearshtml += "</select>", b += e.yearshtml, e.yearshtml = null
            }
            return b += this._get(e, "yearSuffix"), y && (b += (!a && g && v ? "" : "&#xa0;") + _), b += "</div>"
        },
        _adjustInstDate: function (e, t, i) {
            var s = e.drawYear + ("Y" === i ? t : 0), n = e.drawMonth + ("M" === i ? t : 0), a = Math.min(e.selectedDay, this._getDaysInMonth(s, n)) + ("D" === i ? t : 0), o = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(s, n, a)));
            e.selectedDay = o.getDate(), e.drawMonth = e.selectedMonth = o.getMonth(), e.drawYear = e.selectedYear = o.getFullYear(), ("M" === i || "Y" === i) && this._notifyChange(e)
        },
        _restrictMinMax: function (e, t) {
            var i = this._getMinMaxDate(e, "min"), s = this._getMinMaxDate(e, "max"), n = i && i > t ? i : t;
            return s && n > s ? s : n
        },
        _notifyChange: function (e) {
            var t = this._get(e, "onChangeMonthYear");
            t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
        },
        _getNumberOfMonths: function (e) {
            var t = this._get(e, "numberOfMonths");
            return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t
        },
        _getMinMaxDate: function (e, t) {
            return this._determineDate(e, this._get(e, t + "Date"), null)
        },
        _getDaysInMonth: function (e, t) {
            return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
        },
        _getFirstDayOfMonth: function (e, t) {
            return new Date(e, t, 1).getDay()
        },
        _canAdjustMonth: function (e, t, i, s) {
            var n = this._getNumberOfMonths(e), a = this._daylightSavingAdjust(new Date(i, s + (0 > t ? t : n[0] * n[1]), 1));
            return 0 > t && a.setDate(this._getDaysInMonth(a.getFullYear(), a.getMonth())), this._isInRange(e, a)
        },
        _isInRange: function (e, t) {
            var i, s, n = this._getMinMaxDate(e, "min"), a = this._getMinMaxDate(e, "max"), o = null, r = null, h = this._get(e, "yearRange");
            return h && (i = h.split(":"), s = (new Date).getFullYear(), o = parseInt(i[0], 10), r = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (o += s), i[1].match(/[+\-].*/) && (r += s)), (!n || t.getTime() >= n.getTime()) && (!a || t.getTime() <= a.getTime()) && (!o || t.getFullYear() >= o) && (!r || r >= t.getFullYear())
        },
        _getFormatConfig: function (e) {
            var t = this._get(e, "shortYearCutoff");
            return t = "string" != typeof t ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {
                shortYearCutoff: t,
                dayNamesShort: this._get(e, "dayNamesShort"),
                dayNames: this._get(e, "dayNames"),
                monthNamesShort: this._get(e, "monthNamesShort"),
                monthNames: this._get(e, "monthNames")
            }
        },
        _formatDate: function (e, t, i, s) {
            t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
            var n = t ? "object" == typeof t ? t : this._daylightSavingAdjust(new Date(s, i, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
            return this.formatDate(this._get(e, "dateFormat"), n, this._getFormatConfig(e))
        }
    }), e.fn.datepicker = function (t) {
        if (!this.length)return this;
        e.datepicker.initialized || (e(document).mousedown(e.datepicker._checkExternalClick), e.datepicker.initialized = !0), 0 === e("#" + e.datepicker._mainDivId).length && e("body").append(e.datepicker.dpDiv);
        var i = Array.prototype.slice.call(arguments, 1);
        return "string" != typeof t || "isDisabled" !== t && "getDate" !== t && "widget" !== t ? "option" === t && 2 === arguments.length && "string" == typeof arguments[1] ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i)) : this.each(function () {
            "string" == typeof t ? e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this].concat(i)) : e.datepicker._attachDatepicker(this, t)
        }) : e.datepicker["_" + t + "Datepicker"].apply(e.datepicker, [this[0]].concat(i))
    }, e.datepicker = new n, e.datepicker.initialized = !1, e.datepicker.uuid = (new Date).getTime(), e.datepicker.version = "1.11.3", e.datepicker, e.widget("ui.slider", e.ui.mouse, {
        version: "1.11.3",
        widgetEventPrefix: "slide",
        options: {
            animate: !1,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: !1,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        numPages: 5,
        _create: function () {
            this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1
        },
        _refresh: function () {
            this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
        },
        _createHandles: function () {
            var t, i, s = this.options, n = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), a = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>", o = [];
            for (i = s.values && s.values.length || 1, n.length > i && (n.slice(i).remove(), n = n.slice(0, i)), t = n.length; i > t; t++)o.push(a);
            this.handles = n.add(e(o.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function (t) {
                e(this).data("ui-slider-handle-index", t)
            })
        },
        _createRange: function () {
            var t = this.options, i = "";
            t.range ? (t.range === !0 && (t.values ? t.values.length && 2 !== t.values.length ? t.values = [t.values[0], t.values[0]] : e.isArray(t.values) && (t.values = t.values.slice(0)) : t.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                left: "",
                bottom: ""
            }) : (this.range = e("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === t.range || "max" === t.range ? " ui-slider-range-" + t.range : ""))) : (this.range && this.range.remove(), this.range = null)
        },
        _setupEvents: function () {
            this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
        },
        _destroy: function () {
            this.handles.remove(), this.range && this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
        },
        _mouseCapture: function (t) {
            var i, s, n, a, o, r, h, l, u = this, d = this.options;
            return d.disabled ? !1 : (this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            }, this.elementOffset = this.element.offset(), i = {
                x: t.pageX,
                y: t.pageY
            }, s = this._normValueFromMouse(i), n = this._valueMax() - this._valueMin() + 1, this.handles.each(function (t) {
                var i = Math.abs(s - u.values(t));
                (n > i || n === i && (t === u._lastChangedValue || u.values(t) === d.min)) && (n = i, a = e(this), o = t)
            }), r = this._start(t, o), r === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = o, a.addClass("ui-state-active").focus(), h = a.offset(), l = !e(t.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = l ? {
                left: 0,
                top: 0
            } : {
                left: t.pageX - h.left - a.width() / 2,
                top: t.pageY - h.top - a.height() / 2 - (parseInt(a.css("borderTopWidth"), 10) || 0) - (parseInt(a.css("borderBottomWidth"), 10) || 0) + (parseInt(a.css("marginTop"), 10) || 0)
            }, this.handles.hasClass("ui-state-hover") || this._slide(t, o, s), this._animateOff = !0, !0))
        },
        _mouseStart: function () {
            return !0
        },
        _mouseDrag: function (e) {
            var t = {x: e.pageX, y: e.pageY}, i = this._normValueFromMouse(t);
            return this._slide(e, this._handleIndex, i), !1
        },
        _mouseStop: function (e) {
            return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(e, this._handleIndex), this._change(e, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
        },
        _detectOrientation: function () {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (e) {
            var t, i, s, n, a;
            return "horizontal" === this.orientation ? (t = this.elementSize.width, i = e.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (t = this.elementSize.height, i = e.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), s = i / t, s > 1 && (s = 1), 0 > s && (s = 0), "vertical" === this.orientation && (s = 1 - s), n = this._valueMax() - this._valueMin(), a = this._valueMin() + s * n, this._trimAlignValue(a)
        },
        _start: function (e, t) {
            var i = {handle: this.handles[t], value: this.value()};
            return this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._trigger("start", e, i)
        },
        _slide: function (e, t, i) {
            var s, n, a;
            this.options.values && this.options.values.length ? (s = this.values(t ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === t && i > s || 1 === t && s > i) && (i = s), i !== this.values(t) && (n = this.values(), n[t] = i, a = this._trigger("slide", e, {
                handle: this.handles[t],
                value: i,
                values: n
            }), s = this.values(t ? 0 : 1), a !== !1 && this.values(t, i))) : i !== this.value() && (a = this._trigger("slide", e, {
                handle: this.handles[t],
                value: i
            }), a !== !1 && this.value(i))
        },
        _stop: function (e, t) {
            var i = {handle: this.handles[t], value: this.value()};
            this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._trigger("stop", e, i)
        },
        _change: function (e, t) {
            if (!this._keySliding && !this._mouseSliding) {
                var i = {handle: this.handles[t], value: this.value()};
                this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._lastChangedValue = t, this._trigger("change", e, i)
            }
        },
        value: function (e) {
            return arguments.length ? (this.options.value = this._trimAlignValue(e), this._refreshValue(), this._change(null, 0), void 0) : this._value()
        },
        values: function (t, i) {
            var s, n, a;
            if (arguments.length > 1)return this.options.values[t] = this._trimAlignValue(i), this._refreshValue(), this._change(null, t), void 0;
            if (!arguments.length)return this._values();
            if (!e.isArray(arguments[0]))return this.options.values && this.options.values.length ? this._values(t) : this.value();
            for (s = this.options.values, n = arguments[0], a = 0; s.length > a; a += 1)s[a] = this._trimAlignValue(n[a]), this._change(null, a);
            this._refreshValue()
        },
        _setOption: function (t, i) {
            var s, n = 0;
            switch ("range" === t && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), e.isArray(this.options.values) && (n = this.options.values.length), "disabled" === t && this.element.toggleClass("ui-state-disabled", !!i), this._super(t, i), t) {
                case"orientation":
                    this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(), this.handles.css("horizontal" === i ? "bottom" : "left", "");
                    break;
                case"value":
                    this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                    break;
                case"values":
                    for (this._animateOff = !0, this._refreshValue(), s = 0; n > s; s += 1)this._change(null, s);
                    this._animateOff = !1;
                    break;
                case"step":
                case"min":
                case"max":
                    this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
                    break;
                case"range":
                    this._animateOff = !0, this._refresh(), this._animateOff = !1
            }
        },
        _value: function () {
            var e = this.options.value;
            return e = this._trimAlignValue(e)
        },
        _values: function (e) {
            var t, i, s;
            if (arguments.length)return t = this.options.values[e], t = this._trimAlignValue(t);
            if (this.options.values && this.options.values.length) {
                for (i = this.options.values.slice(), s = 0; i.length > s; s += 1)i[s] = this._trimAlignValue(i[s]);
                return i
            }
            return []
        },
        _trimAlignValue: function (e) {
            if (this._valueMin() >= e)return this._valueMin();
            if (e >= this._valueMax())return this._valueMax();
            var t = this.options.step > 0 ? this.options.step : 1, i = (e - this._valueMin()) % t, s = e - i;
            return 2 * Math.abs(i) >= t && (s += i > 0 ? t : -t), parseFloat(s.toFixed(5))
        },
        _calculateNewMax: function () {
            var e = this.options.max, t = this._valueMin(), i = this.options.step, s = Math.floor((e - t) / i) * i;
            e = s + t, this.max = parseFloat(e.toFixed(this._precision()))
        },
        _precision: function () {
            var e = this._precisionOf(this.options.step);
            return null !== this.options.min && (e = Math.max(e, this._precisionOf(this.options.min))), e
        },
        _precisionOf: function (e) {
            var t = "" + e, i = t.indexOf(".");
            return -1 === i ? 0 : t.length - i - 1
        },
        _valueMin: function () {
            return this.options.min
        },
        _valueMax: function () {
            return this.max
        },
        _refreshValue: function () {
            var t, i, s, n, a, o = this.options.range, r = this.options, h = this, l = this._animateOff ? !1 : r.animate, u = {};
            this.options.values && this.options.values.length ? this.handles.each(function (s) {
                i = 100 * ((h.values(s) - h._valueMin()) / (h._valueMax() - h._valueMin())), u["horizontal" === h.orientation ? "left" : "bottom"] = i + "%", e(this).stop(1, 1)[l ? "animate" : "css"](u, r.animate), h.options.range === !0 && ("horizontal" === h.orientation ? (0 === s && h.range.stop(1, 1)[l ? "animate" : "css"]({left: i + "%"}, r.animate), 1 === s && h.range[l ? "animate" : "css"]({width: i - t + "%"}, {
                    queue: !1,
                    duration: r.animate
                })) : (0 === s && h.range.stop(1, 1)[l ? "animate" : "css"]({bottom: i + "%"}, r.animate), 1 === s && h.range[l ? "animate" : "css"]({height: i - t + "%"}, {
                    queue: !1,
                    duration: r.animate
                }))), t = i
            }) : (s = this.value(), n = this._valueMin(), a = this._valueMax(), i = a !== n ? 100 * ((s - n) / (a - n)) : 0, u["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[l ? "animate" : "css"](u, r.animate), "min" === o && "horizontal" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({width: i + "%"}, r.animate), "max" === o && "horizontal" === this.orientation && this.range[l ? "animate" : "css"]({width: 100 - i + "%"}, {
                queue: !1,
                duration: r.animate
            }), "min" === o && "vertical" === this.orientation && this.range.stop(1, 1)[l ? "animate" : "css"]({height: i + "%"}, r.animate), "max" === o && "vertical" === this.orientation && this.range[l ? "animate" : "css"]({height: 100 - i + "%"}, {
                queue: !1,
                duration: r.animate
            }))
        },
        _handleEvents: {
            keydown: function (t) {
                var i, s, n, a, o = e(t.target).data("ui-slider-handle-index");
                switch (t.keyCode) {
                    case e.ui.keyCode.HOME:
                    case e.ui.keyCode.END:
                    case e.ui.keyCode.PAGE_UP:
                    case e.ui.keyCode.PAGE_DOWN:
                    case e.ui.keyCode.UP:
                    case e.ui.keyCode.RIGHT:
                    case e.ui.keyCode.DOWN:
                    case e.ui.keyCode.LEFT:
                        if (t.preventDefault(), !this._keySliding && (this._keySliding = !0, e(t.target).addClass("ui-state-active"), i = this._start(t, o), i === !1))return
                }
                switch (a = this.options.step, s = n = this.options.values && this.options.values.length ? this.values(o) : this.value(), t.keyCode) {
                    case e.ui.keyCode.HOME:
                        n = this._valueMin();
                        break;
                    case e.ui.keyCode.END:
                        n = this._valueMax();
                        break;
                    case e.ui.keyCode.PAGE_UP:
                        n = this._trimAlignValue(s + (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case e.ui.keyCode.PAGE_DOWN:
                        n = this._trimAlignValue(s - (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case e.ui.keyCode.UP:
                    case e.ui.keyCode.RIGHT:
                        if (s === this._valueMax())return;
                        n = this._trimAlignValue(s + a);
                        break;
                    case e.ui.keyCode.DOWN:
                    case e.ui.keyCode.LEFT:
                        if (s === this._valueMin())return;
                        n = this._trimAlignValue(s - a)
                }
                this._slide(t, o, n)
            }, keyup: function (t) {
                var i = e(t.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1, this._stop(t, i), this._change(t, i), e(t.target).removeClass("ui-state-active"))
            }
        }
    })
});

//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function (a) {
    function b(a, b, c) {
        switch (arguments.length) {
            case 2:
                return null != a ? a : b;
            case 3:
                return null != a ? a : null != b ? b : c;
            default:
                throw new Error("Implement me")
        }
    }

    function c(a, b) {
        return Bb.call(a, b)
    }

    function d() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function e(a) {
        vb.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + a)
    }

    function f(a, b) {
        var c = !0;
        return o(function () {
            return c && (e(a), c = !1), b.apply(this, arguments)
        }, b)
    }

    function g(a, b) {
        sc[a] || (e(b), sc[a] = !0)
    }

    function h(a, b) {
        return function (c) {
            return r(a.call(this, c), b)
        }
    }

    function i(a, b) {
        return function (c) {
            return this.localeData().ordinal(a.call(this, c), b)
        }
    }

    function j(a, b) {
        var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()), f = a.clone().add(e, "months");
        return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
    }

    function k(a, b, c) {
        var d;
        return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
    }

    function l() {
    }

    function m(a, b) {
        b !== !1 && H(a), p(this, a), this._d = new Date(+a._d), uc === !1 && (uc = !0, vb.updateOffset(this), uc = !1)
    }

    function n(a) {
        var b = A(a), c = b.year || 0, d = b.quarter || 0, e = b.month || 0, f = b.week || 0, g = b.day || 0, h = b.hour || 0, i = b.minute || 0, j = b.second || 0, k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = vb.localeData(), this._bubble()
    }

    function o(a, b) {
        for (var d in b)c(b, d) && (a[d] = b[d]);
        return c(b, "toString") && (a.toString = b.toString), c(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function p(a, b) {
        var c, d, e;
        if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = b._pf), "undefined" != typeof b._locale && (a._locale = b._locale), Kb.length > 0)for (c in Kb)d = Kb[c], e = b[d], "undefined" != typeof e && (a[d] = e);
        return a
    }

    function q(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function r(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b;)d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }

    function s(a, b) {
        var c = {milliseconds: 0, months: 0};
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function t(a, b) {
        var c;
        return b = M(b, a), a.isBefore(b) ? c = s(a, b) : (c = s(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c
    }

    function u(a, b) {
        return function (c, d) {
            var e, f;
            return null === d || isNaN(+d) || (g(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = vb.duration(c, d), v(this, e, a), this
        }
    }

    function v(a, b, c, d) {
        var e = b._milliseconds, f = b._days, g = b._months;
        d = null == d ? !0 : d, e && a._d.setTime(+a._d + e * c), f && pb(a, "Date", ob(a, "Date") + f * c), g && nb(a, ob(a, "Month") + g * c), d && vb.updateOffset(a, f || g)
    }

    function w(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function x(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }

    function y(a, b, c) {
        var d, e = Math.min(a.length, b.length), f = Math.abs(a.length - b.length), g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && C(a[d]) !== C(b[d])) && g++;
        return g + f
    }

    function z(a) {
        if (a) {
            var b = a.toLowerCase().replace(/(.)s$/, "$1");
            a = lc[a] || mc[b] || b
        }
        return a
    }

    function A(a) {
        var b, d, e = {};
        for (d in a)c(a, d) && (b = z(d), b && (e[b] = a[d]));
        return e
    }

    function B(b) {
        var c, d;
        if (0 === b.indexOf("week"))c = 7, d = "day"; else {
            if (0 !== b.indexOf("month"))return;
            c = 12, d = "month"
        }
        vb[b] = function (e, f) {
            var g, h, i = vb._locale[b], j = [];
            if ("number" == typeof e && (f = e, e = a), h = function (a) {
                    var b = vb().utc().set(d, a);
                    return i.call(vb._locale, b, e || "")
                }, null != f)return h(f);
            for (g = 0; c > g; g++)j.push(h(g));
            return j
        }
    }

    function C(a) {
        var b = +a, c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function D(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function E(a, b, c) {
        return jb(vb([a, 11, 31 + b - c]), b, c).week
    }

    function F(a) {
        return G(a) ? 366 : 365
    }

    function G(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function H(a) {
        var b;
        a._a && -2 === a._pf.overflow && (b = a._a[Db] < 0 || a._a[Db] > 11 ? Db : a._a[Eb] < 1 || a._a[Eb] > D(a._a[Cb], a._a[Db]) ? Eb : a._a[Fb] < 0 || a._a[Fb] > 24 || 24 === a._a[Fb] && (0 !== a._a[Gb] || 0 !== a._a[Hb] || 0 !== a._a[Ib]) ? Fb : a._a[Gb] < 0 || a._a[Gb] > 59 ? Gb : a._a[Hb] < 0 || a._a[Hb] > 59 ? Hb : a._a[Ib] < 0 || a._a[Ib] > 999 ? Ib : -1, a._pf._overflowDayOfYear && (Cb > b || b > Eb) && (b = Eb), a._pf.overflow = b)
    }

    function I(b) {
        return null == b._isValid && (b._isValid = !isNaN(b._d.getTime()) && b._pf.overflow < 0 && !b._pf.empty && !b._pf.invalidMonth && !b._pf.nullInput && !b._pf.invalidFormat && !b._pf.userInvalidated, b._strict && (b._isValid = b._isValid && 0 === b._pf.charsLeftOver && 0 === b._pf.unusedTokens.length && b._pf.bigHour === a)), b._isValid
    }

    function J(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function K(a) {
        for (var b, c, d, e, f = 0; f < a.length;) {
            for (e = J(a[f]).split("-"), b = e.length, c = J(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                if (d = L(e.slice(0, b).join("-")))return d;
                if (c && c.length >= b && y(e, c, !0) >= b - 1)break;
                b--
            }
            f++
        }
        return null
    }

    function L(a) {
        var b = null;
        if (!Jb[a] && Lb)try {
            b = vb.locale(), require("./locale/" + a), vb.locale(b)
        } catch (c) {
        }
        return Jb[a]
    }

    function M(a, b) {
        var c, d;
        return b._isUTC ? (c = b.clone(), d = (vb.isMoment(a) || x(a) ? +a : +vb(a)) - +c, c._d.setTime(+c._d + d), vb.updateOffset(c, !1), c) : vb(a).local()
    }

    function N(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function O(a) {
        var b, c, d = a.match(Pb);
        for (b = 0, c = d.length; c > b; b++)d[b] = rc[d[b]] ? rc[d[b]] : N(d[b]);
        return function (e) {
            var f = "";
            for (b = 0; c > b; b++)f += d[b]instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function P(a, b) {
        return a.isValid() ? (b = Q(b, a.localeData()), nc[b] || (nc[b] = O(b)), nc[b](a)) : a.localeData().invalidDate()
    }

    function Q(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }

        var d = 5;
        for (Qb.lastIndex = 0; d >= 0 && Qb.test(a);)a = a.replace(Qb, c), Qb.lastIndex = 0, d -= 1;
        return a
    }

    function R(a, b) {
        var c, d = b._strict;
        switch (a) {
            case"Q":
                return _b;
            case"DDDD":
                return bc;
            case"YYYY":
            case"GGGG":
            case"gggg":
                return d ? cc : Tb;
            case"Y":
            case"G":
            case"g":
                return ec;
            case"YYYYYY":
            case"YYYYY":
            case"GGGGG":
            case"ggggg":
                return d ? dc : Ub;
            case"S":
                if (d)return _b;
            case"SS":
                if (d)return ac;
            case"SSS":
                if (d)return bc;
            case"DDD":
                return Sb;
            case"MMM":
            case"MMMM":
            case"dd":
            case"ddd":
            case"dddd":
                return Wb;
            case"a":
            case"A":
                return b._locale._meridiemParse;
            case"x":
                return Zb;
            case"X":
                return $b;
            case"Z":
            case"ZZ":
                return Xb;
            case"T":
                return Yb;
            case"SSSS":
                return Vb;
            case"MM":
            case"DD":
            case"YY":
            case"GG":
            case"gg":
            case"HH":
            case"hh":
            case"mm":
            case"ss":
            case"ww":
            case"WW":
                return d ? ac : Rb;
            case"M":
            case"D":
            case"d":
            case"H":
            case"h":
            case"m":
            case"s":
            case"w":
            case"W":
            case"e":
            case"E":
                return Rb;
            case"Do":
                return d ? b._locale._ordinalParse : b._locale._ordinalParseLenient;
            default:
                return c = new RegExp($(Z(a.replace("\\", "")), "i"))
        }
    }

    function S(a) {
        a = a || "";
        var b = a.match(Xb) || [], c = b[b.length - 1] || [], d = (c + "").match(jc) || ["-", 0, 0], e = +(60 * d[1]) + C(d[2]);
        return "+" === d[0] ? e : -e
    }

    function T(a, b, c) {
        var d, e = c._a;
        switch (a) {
            case"Q":
                null != b && (e[Db] = 3 * (C(b) - 1));
                break;
            case"M":
            case"MM":
                null != b && (e[Db] = C(b) - 1);
                break;
            case"MMM":
            case"MMMM":
                d = c._locale.monthsParse(b, a, c._strict), null != d ? e[Db] = d : c._pf.invalidMonth = b;
                break;
            case"D":
            case"DD":
                null != b && (e[Eb] = C(b));
                break;
            case"Do":
                null != b && (e[Eb] = C(parseInt(b.match(/\d{1,2}/)[0], 10)));
                break;
            case"DDD":
            case"DDDD":
                null != b && (c._dayOfYear = C(b));
                break;
            case"YY":
                e[Cb] = vb.parseTwoDigitYear(b);
                break;
            case"YYYY":
            case"YYYYY":
            case"YYYYYY":
                e[Cb] = C(b);
                break;
            case"a":
            case"A":
                c._meridiem = b;
                break;
            case"h":
            case"hh":
                c._pf.bigHour = !0;
            case"H":
            case"HH":
                e[Fb] = C(b);
                break;
            case"m":
            case"mm":
                e[Gb] = C(b);
                break;
            case"s":
            case"ss":
                e[Hb] = C(b);
                break;
            case"S":
            case"SS":
            case"SSS":
            case"SSSS":
                e[Ib] = C(1e3 * ("0." + b));
                break;
            case"x":
                c._d = new Date(C(b));
                break;
            case"X":
                c._d = new Date(1e3 * parseFloat(b));
                break;
            case"Z":
            case"ZZ":
                c._useUTC = !0, c._tzm = S(b);
                break;
            case"dd":
            case"ddd":
            case"dddd":
                d = c._locale.weekdaysParse(b), null != d ? (c._w = c._w || {}, c._w.d = d) : c._pf.invalidWeekday = b;
                break;
            case"w":
            case"ww":
            case"W":
            case"WW":
            case"d":
            case"e":
            case"E":
                a = a.substr(0, 1);
            case"gggg":
            case"GGGG":
            case"GGGGG":
                a = a.substr(0, 2), b && (c._w = c._w || {}, c._w[a] = C(b));
                break;
            case"gg":
            case"GG":
                c._w = c._w || {}, c._w[a] = vb.parseTwoDigitYear(b)
        }
    }

    function U(a) {
        var c, d, e, f, g, h, i;
        c = a._w, null != c.GG || null != c.W || null != c.E ? (g = 1, h = 4, d = b(c.GG, a._a[Cb], jb(vb(), 1, 4).year), e = b(c.W, 1), f = b(c.E, 1)) : (g = a._locale._week.dow, h = a._locale._week.doy, d = b(c.gg, a._a[Cb], jb(vb(), g, h).year), e = b(c.w, 1), null != c.d ? (f = c.d, g > f && ++e) : f = null != c.e ? c.e + g : g), i = kb(d, e, f, h, g), a._a[Cb] = i.year, a._dayOfYear = i.dayOfYear
    }

    function V(a) {
        var c, d, e, f, g = [];
        if (!a._d) {
            for (e = X(a), a._w && null == a._a[Eb] && null == a._a[Db] && U(a), a._dayOfYear && (f = b(a._a[Cb], e[Cb]), a._dayOfYear > F(f) && (a._pf._overflowDayOfYear = !0), d = fb(f, 0, a._dayOfYear), a._a[Db] = d.getUTCMonth(), a._a[Eb] = d.getUTCDate()), c = 0; 3 > c && null == a._a[c]; ++c)a._a[c] = g[c] = e[c];
            for (; 7 > c; c++)a._a[c] = g[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
            24 === a._a[Fb] && 0 === a._a[Gb] && 0 === a._a[Hb] && 0 === a._a[Ib] && (a._nextDay = !0, a._a[Fb] = 0), a._d = (a._useUTC ? fb : eb).apply(null, g), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[Fb] = 24)
        }
    }

    function W(a) {
        var b;
        a._d || (b = A(a._i), a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], V(a))
    }

    function X(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function Y(b) {
        if (b._f === vb.ISO_8601)return void ab(b);
        b._a = [], b._pf.empty = !0;
        var c, d, e, f, g, h = "" + b._i, i = h.length, j = 0;
        for (e = Q(b._f, b._locale).match(Pb) || [], c = 0; c < e.length; c++)f = e[c], d = (h.match(R(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && b._pf.unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), j += d.length), rc[f] ? (d ? b._pf.empty = !1 : b._pf.unusedTokens.push(f), T(f, d, b)) : b._strict && !d && b._pf.unusedTokens.push(f);
        b._pf.charsLeftOver = i - j, h.length > 0 && b._pf.unusedInput.push(h), b._pf.bigHour === !0 && b._a[Fb] <= 12 && (b._pf.bigHour = a), b._a[Fb] = k(b._locale, b._a[Fb], b._meridiem), V(b), H(b)
    }

    function Z(a) {
        return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
            return b || c || d || e
        })
    }

    function $(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function _(a) {
        var b, c, e, f, g;
        if (0 === a._f.length)return a._pf.invalidFormat = !0, void(a._d = new Date(0 / 0));
        for (f = 0; f < a._f.length; f++)g = 0, b = p({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._pf = d(), b._f = a._f[f], Y(b), I(b) && (g += b._pf.charsLeftOver, g += 10 * b._pf.unusedTokens.length, b._pf.score = g, (null == e || e > g) && (e = g, c = b));
        o(a, c || b)
    }

    function ab(a) {
        var b, c, d = a._i, e = fc.exec(d);
        if (e) {
            for (a._pf.iso = !0, b = 0, c = hc.length; c > b; b++)if (hc[b][1].exec(d)) {
                a._f = hc[b][0] + (e[6] || " ");
                break
            }
            for (b = 0, c = ic.length; c > b; b++)if (ic[b][1].exec(d)) {
                a._f += ic[b][0];
                break
            }
            d.match(Xb) && (a._f += "Z"), Y(a)
        } else a._isValid = !1
    }

    function bb(a) {
        ab(a), a._isValid === !1 && (delete a._isValid, vb.createFromInputFallback(a))
    }

    function cb(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c)d.push(b(a[c], c));
        return d
    }

    function db(b) {
        var c, d = b._i;
        d === a ? b._d = new Date : x(d) ? b._d = new Date(+d) : null !== (c = Mb.exec(d)) ? b._d = new Date(+c[1]) : "string" == typeof d ? bb(b) : w(d) ? (b._a = cb(d.slice(0), function (a) {
            return parseInt(a, 10)
        }), V(b)) : "object" == typeof d ? W(b) : "number" == typeof d ? b._d = new Date(d) : vb.createFromInputFallback(b)
    }

    function eb(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 1970 > a && h.setFullYear(a), h
    }

    function fb(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 1970 > a && b.setUTCFullYear(a), b
    }

    function gb(a, b) {
        if ("string" == typeof a)if (isNaN(a)) {
            if (a = b.weekdaysParse(a), "number" != typeof a)return null
        } else a = parseInt(a, 10);
        return a
    }

    function hb(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function ib(a, b, c) {
        var d = vb.duration(a).abs(), e = Ab(d.as("s")), f = Ab(d.as("m")), g = Ab(d.as("h")), h = Ab(d.as("d")), i = Ab(d.as("M")), j = Ab(d.as("y")), k = e < oc.s && ["s", e] || 1 === f && ["m"] || f < oc.m && ["mm", f] || 1 === g && ["h"] || g < oc.h && ["hh", g] || 1 === h && ["d"] || h < oc.d && ["dd", h] || 1 === i && ["M"] || i < oc.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, hb.apply({}, k)
    }

    function jb(a, b, c) {
        var d, e = c - b, f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = vb(a).add(f, "d"), {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }

    function kb(a, b, c, d, e) {
        var f, g, h = fb(a, 0, 1).getUTCDay();
        return h = 0 === h ? 7 : h, c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : F(a - 1) + g
        }
    }

    function lb(b) {
        var c, d = b._i, e = b._f;
        return b._locale = b._locale || vb.localeData(b._l), null === d || e === a && "" === d ? vb.invalid({nullInput: !0}) : ("string" == typeof d && (b._i = d = b._locale.preparse(d)), vb.isMoment(d) ? new m(d, !0) : (e ? w(e) ? _(b) : Y(b) : db(b), c = new m(b), c._nextDay && (c.add(1, "d"), c._nextDay = a), c))
    }

    function mb(a, b) {
        var c, d;
        if (1 === b.length && w(b[0]) && (b = b[0]), !b.length)return vb();
        for (c = b[0], d = 1; d < b.length; ++d)b[d][a](c) && (c = b[d]);
        return c
    }

    function nb(a, b) {
        var c;
        return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), D(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a)
    }

    function ob(a, b) {
        return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
    }

    function pb(a, b, c) {
        return "Month" === b ? nb(a, c) : a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function qb(a, b) {
        return function (c) {
            return null != c ? (pb(this, a, c), vb.updateOffset(this, b), this) : ob(this, a)
        }
    }

    function rb(a) {
        return 400 * a / 146097
    }

    function sb(a) {
        return 146097 * a / 400
    }

    function tb(a) {
        vb.duration.fn[a] = function () {
            return this._data[a]
        }
    }

    function ub(a) {
        "undefined" == typeof ender && (wb = zb.moment, zb.moment = a ? f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", vb) : vb)
    }

    for (var vb, wb, xb, yb = "2.9.0", zb = "undefined" == typeof global || "undefined" != typeof window && window !== global.window ? this : global, Ab = Math.round, Bb = Object.prototype.hasOwnProperty, Cb = 0, Db = 1, Eb = 2, Fb = 3, Gb = 4, Hb = 5, Ib = 6, Jb = {}, Kb = [], Lb = "undefined" != typeof module && module && module.exports, Mb = /^\/?Date\((\-?\d+)/i, Nb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Ob = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Pb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, Qb = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Rb = /\d\d?/, Sb = /\d{1,3}/, Tb = /\d{1,4}/, Ub = /[+\-]?\d{1,6}/, Vb = /\d+/, Wb = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Xb = /Z|[\+\-]\d\d:?\d\d/gi, Yb = /T/i, Zb = /[\+\-]?\d+/, $b = /[\+\-]?\d+(\.\d{1,3})?/, _b = /\d/, ac = /\d\d/, bc = /\d{3}/, cc = /\d{4}/, dc = /[+-]?\d{6}/, ec = /[+-]?\d+/, fc = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, gc = "YYYY-MM-DDTHH:mm:ssZ", hc = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]], ic = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], jc = /([\+\-]|\d\d)/gi, kc = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }), lc = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        D: "date",
        w: "week",
        W: "isoWeek",
        M: "month",
        Q: "quarter",
        y: "year",
        DDD: "dayOfYear",
        e: "weekday",
        E: "isoWeekday",
        gg: "weekYear",
        GG: "isoWeekYear"
    }, mc = {
        dayofyear: "dayOfYear",
        isoweekday: "isoWeekday",
        isoweek: "isoWeek",
        weekyear: "weekYear",
        isoweekyear: "isoWeekYear"
    }, nc = {}, oc = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    }, pc = "DDD w W M D d".split(" "), qc = "M D H h m s w W".split(" "), rc = {
        M: function () {
            return this.month() + 1
        }, MMM: function (a) {
            return this.localeData().monthsShort(this, a)
        }, MMMM: function (a) {
            return this.localeData().months(this, a)
        }, D: function () {
            return this.date()
        }, DDD: function () {
            return this.dayOfYear()
        }, d: function () {
            return this.day()
        }, dd: function (a) {
            return this.localeData().weekdaysMin(this, a)
        }, ddd: function (a) {
            return this.localeData().weekdaysShort(this, a)
        }, dddd: function (a) {
            return this.localeData().weekdays(this, a)
        }, w: function () {
            return this.week()
        }, W: function () {
            return this.isoWeek()
        }, YY: function () {
            return r(this.year() % 100, 2)
        }, YYYY: function () {
            return r(this.year(), 4)
        }, YYYYY: function () {
            return r(this.year(), 5)
        }, YYYYYY: function () {
            var a = this.year(), b = a >= 0 ? "+" : "-";
            return b + r(Math.abs(a), 6)
        }, gg: function () {
            return r(this.weekYear() % 100, 2)
        }, gggg: function () {
            return r(this.weekYear(), 4)
        }, ggggg: function () {
            return r(this.weekYear(), 5)
        }, GG: function () {
            return r(this.isoWeekYear() % 100, 2)
        }, GGGG: function () {
            return r(this.isoWeekYear(), 4)
        }, GGGGG: function () {
            return r(this.isoWeekYear(), 5)
        }, e: function () {
            return this.weekday()
        }, E: function () {
            return this.isoWeekday()
        }, a: function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), !0)
        }, A: function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), !1)
        }, H: function () {
            return this.hours()
        }, h: function () {
            return this.hours() % 12 || 12
        }, m: function () {
            return this.minutes()
        }, s: function () {
            return this.seconds()
        }, S: function () {
            return C(this.milliseconds() / 100)
        }, SS: function () {
            return r(C(this.milliseconds() / 10), 2)
        }, SSS: function () {
            return r(this.milliseconds(), 3)
        }, SSSS: function () {
            return r(this.milliseconds(), 3)
        }, Z: function () {
            var a = this.utcOffset(), b = "+";
            return 0 > a && (a = -a, b = "-"), b + r(C(a / 60), 2) + ":" + r(C(a) % 60, 2)
        }, ZZ: function () {
            var a = this.utcOffset(), b = "+";
            return 0 > a && (a = -a, b = "-"), b + r(C(a / 60), 2) + r(C(a) % 60, 2)
        }, z: function () {
            return this.zoneAbbr()
        }, zz: function () {
            return this.zoneName()
        }, x: function () {
            return this.valueOf()
        }, X: function () {
            return this.unix()
        }, Q: function () {
            return this.quarter()
        }
    }, sc = {}, tc = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"], uc = !1; pc.length;)xb = pc.pop(), rc[xb + "o"] = i(rc[xb], xb);
    for (; qc.length;)xb = qc.pop(), rc[xb + xb] = h(rc[xb], 2);
    rc.DDDD = h(rc.DDD, 3), o(l.prototype, {
        set: function (a) {
            var b, c;
            for (c in a)b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b;
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function (a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function (a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function (a, b, c) {
            var d, e, f;
            for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
                if (e = vb.utc([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a))return d;
                if (c && "MMM" === b && this._shortMonthsParse[d].test(a))return d;
                if (!c && this._monthsParse[d].test(a))return d
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function (a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function (a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function (a) {
            return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function (a) {
            var b, c, d;
            for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)if (this._weekdaysParse[b] || (c = vb([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a))return b
        },
        _longDateFormat: {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        longDateFormat: function (a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (a) {
                return a.slice(1)
            }), this._longDateFormat[a] = b), b
        },
        isPM: function (a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function (a, b, c) {
            var d = this._calendar[a];
            return "function" == typeof d ? d.apply(b, [c]) : d
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function (a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function (a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function (a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        _ordinalParse: /\d{1,2}/,
        preparse: function (a) {
            return a
        },
        postformat: function (a) {
            return a
        },
        week: function (a) {
            return jb(a, this._week.dow, this._week.doy).week
        },
        _week: {dow: 0, doy: 6},
        firstDayOfWeek: function () {
            return this._week.dow
        },
        firstDayOfYear: function () {
            return this._week.doy
        },
        _invalidDate: "Invalid date",
        invalidDate: function () {
            return this._invalidDate
        }
    }), vb = function (b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._i = b, g._f = c, g._l = e, g._strict = f, g._isUTC = !1, g._pf = d(), lb(g)
    }, vb.suppressDeprecationWarnings = !1, vb.createFromInputFallback = f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
    }), vb.min = function () {
        var a = [].slice.call(arguments, 0);
        return mb("isBefore", a)
    }, vb.max = function () {
        var a = [].slice.call(arguments, 0);
        return mb("isAfter", a)
    }, vb.utc = function (b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._useUTC = !0, g._isUTC = !0, g._l = e, g._i = b, g._f = c, g._strict = f, g._pf = d(), lb(g).utc()
    }, vb.unix = function (a) {
        return vb(1e3 * a)
    }, vb.duration = function (a, b) {
        var d, e, f, g, h = a, i = null;
        return vb.isDuration(a) ? h = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (h = {}, b ? h[b] = a : h.milliseconds = a) : (i = Nb.exec(a)) ? (d = "-" === i[1] ? -1 : 1, h = {
            y: 0,
            d: C(i[Eb]) * d,
            h: C(i[Fb]) * d,
            m: C(i[Gb]) * d,
            s: C(i[Hb]) * d,
            ms: C(i[Ib]) * d
        }) : (i = Ob.exec(a)) ? (d = "-" === i[1] ? -1 : 1, f = function (a) {
            var b = a && parseFloat(a.replace(",", "."));
            return (isNaN(b) ? 0 : b) * d
        }, h = {
            y: f(i[2]),
            M: f(i[3]),
            d: f(i[4]),
            h: f(i[5]),
            m: f(i[6]),
            s: f(i[7]),
            w: f(i[8])
        }) : null == h ? h = {} : "object" == typeof h && ("from"in h || "to"in h) && (g = t(vb(h.from), vb(h.to)), h = {}, h.ms = g.milliseconds, h.M = g.months), e = new n(h), vb.isDuration(a) && c(a, "_locale") && (e._locale = a._locale), e
    }, vb.version = yb, vb.defaultFormat = gc, vb.ISO_8601 = function () {
    }, vb.momentProperties = Kb, vb.updateOffset = function () {
    }, vb.relativeTimeThreshold = function (b, c) {
        return oc[b] === a ? !1 : c === a ? oc[b] : (oc[b] = c, !0)
    }, vb.lang = f("moment.lang is deprecated. Use moment.locale instead.", function (a, b) {
        return vb.locale(a, b)
    }), vb.locale = function (a, b) {
        var c;
        return a && (c = "undefined" != typeof b ? vb.defineLocale(a, b) : vb.localeData(a), c && (vb.duration._locale = vb._locale = c)), vb._locale._abbr
    }, vb.defineLocale = function (a, b) {
        return null !== b ? (b.abbr = a, Jb[a] || (Jb[a] = new l), Jb[a].set(b), vb.locale(a), Jb[a]) : (delete Jb[a], null)
    }, vb.langData = f("moment.langData is deprecated. Use moment.localeData instead.", function (a) {
        return vb.localeData(a)
    }), vb.localeData = function (a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a)return vb._locale;
        if (!w(a)) {
            if (b = L(a))return b;
            a = [a]
        }
        return K(a)
    }, vb.isMoment = function (a) {
        return a instanceof m || null != a && c(a, "_isAMomentObject")
    }, vb.isDuration = function (a) {
        return a instanceof n
    };
    for (xb = tc.length - 1; xb >= 0; --xb)B(tc[xb]);
    vb.normalizeUnits = function (a) {
        return z(a)
    }, vb.invalid = function (a) {
        var b = vb.utc(0 / 0);
        return null != a ? o(b._pf, a) : b._pf.userInvalidated = !0, b
    }, vb.parseZone = function () {
        return vb.apply(null, arguments).parseZone()
    }, vb.parseTwoDigitYear = function (a) {
        return C(a) + (C(a) > 68 ? 1900 : 2e3)
    }, vb.isDate = x, o(vb.fn = m.prototype, {
        clone: function () {
            return vb(this)
        },
        valueOf: function () {
            return +this._d - 6e4 * (this._offset || 0)
        },
        unix: function () {
            return Math.floor(+this / 1e3)
        },
        toString: function () {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function () {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function () {
            var a = vb(this).utc();
            return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : P(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : P(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function () {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function () {
            return I(this)
        },
        isDSTShifted: function () {
            return this._a ? this.isValid() && y(this._a, (this._isUTC ? vb.utc(this._a) : vb(this._a)).toArray()) > 0 : !1
        },
        parsingFlags: function () {
            return o({}, this._pf)
        },
        invalidAt: function () {
            return this._pf.overflow
        },
        utc: function (a) {
            return this.utcOffset(0, a)
        },
        local: function (a) {
            return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(this._dateUtcOffset(), "m")), this
        },
        format: function (a) {
            var b = P(this, a || vb.defaultFormat);
            return this.localeData().postformat(b)
        },
        add: u(1, "add"),
        subtract: u(-1, "subtract"),
        diff: function (a, b, c) {
            var d, e, f = M(a, this), g = 6e4 * (f.utcOffset() - this.utcOffset());
            return b = z(b), "year" === b || "month" === b || "quarter" === b ? (e = j(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : q(e)
        },
        from: function (a, b) {
            return vb.duration({to: this, from: a}).locale(this.locale()).humanize(!b)
        },
        fromNow: function (a) {
            return this.from(vb(), a)
        },
        calendar: function (a) {
            var b = a || vb(), c = M(b, this).startOf("day"), d = this.diff(c, "days", !0), e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse";
            return this.format(this.localeData().calendar(e, this, vb(b)))
        },
        isLeapYear: function () {
            return G(this.year())
        },
        isDST: function () {
            return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
        },
        day: function (a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = gb(a, this.localeData()), this.add(a - b, "d")) : b
        },
        month: qb("Month", !0),
        startOf: function (a) {
            switch (a = z(a)) {
                case"year":
                    this.month(0);
                case"quarter":
                case"month":
                    this.date(1);
                case"week":
                case"isoWeek":
                case"day":
                    this.hours(0);
                case"hour":
                    this.minutes(0);
                case"minute":
                    this.seconds(0);
                case"second":
                    this.milliseconds(0)
            }
            return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
        },
        endOf: function (b) {
            return b = z(b), b === a || "millisecond" === b ? this : this.startOf(b).add(1, "isoWeek" === b ? "week" : b).subtract(1, "ms")
        },
        isAfter: function (a, b) {
            var c;
            return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +this > +a) : (c = vb.isMoment(a) ? +a : +vb(a), c < +this.clone().startOf(b))
        },
        isBefore: function (a, b) {
            var c;
            return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +a > +this) : (c = vb.isMoment(a) ? +a : +vb(a), +this.clone().endOf(b) < c)
        },
        isBetween: function (a, b, c) {
            return this.isAfter(a, c) && this.isBefore(b, c)
        },
        isSame: function (a, b) {
            var c;
            return b = z(b || "millisecond"), "millisecond" === b ? (a = vb.isMoment(a) ? a : vb(a), +this === +a) : (c = +vb(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))
        },
        min: f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function (a) {
            return a = vb.apply(null, arguments), this > a ? this : a
        }),
        max: f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function (a) {
            return a = vb.apply(null, arguments), a > this ? this : a
        }),
        zone: f("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", function (a, b) {
            return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
        }),
        utcOffset: function (a, b) {
            var c, d = this._offset || 0;
            return null != a ? ("string" == typeof a && (a = S(a)), Math.abs(a) < 16 && (a = 60 * a), !this._isUTC && b && (c = this._dateUtcOffset()), this._offset = a, this._isUTC = !0, null != c && this.add(c, "m"), d !== a && (!b || this._changeInProgress ? v(this, vb.duration(a - d, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, vb.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? d : this._dateUtcOffset()
        },
        isLocal: function () {
            return !this._isUTC
        },
        isUtcOffset: function () {
            return this._isUTC
        },
        isUtc: function () {
            return this._isUTC && 0 === this._offset
        },
        zoneAbbr: function () {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function () {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function () {
            return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(S(this._i)), this
        },
        hasAlignedHourOffset: function (a) {
            return a = a ? vb(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0
        },
        daysInMonth: function () {
            return D(this.year(), this.month())
        },
        dayOfYear: function (a) {
            var b = Ab((vb(this).startOf("day") - vb(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add(a - b, "d")
        },
        quarter: function (a) {
            return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
        },
        weekYear: function (a) {
            var b = jb(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == a ? b : this.add(a - b, "y")
        },
        isoWeekYear: function (a) {
            var b = jb(this, 1, 4).year;
            return null == a ? b : this.add(a - b, "y")
        },
        week: function (a) {
            var b = this.localeData().week(this);
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        isoWeek: function (a) {
            var b = jb(this, 1, 4).week;
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        weekday: function (a) {
            var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == a ? b : this.add(a - b, "d")
        },
        isoWeekday: function (a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        isoWeeksInYear: function () {
            return E(this.year(), 1, 4)
        },
        weeksInYear: function () {
            var a = this.localeData()._week;
            return E(this.year(), a.dow, a.doy)
        },
        get: function (a) {
            return a = z(a), this[a]()
        },
        set: function (a, b) {
            var c;
            if ("object" == typeof a)for (c in a)this.set(c, a[c]); else a = z(a), "function" == typeof this[a] && this[a](b);
            return this
        },
        locale: function (b) {
            var c;
            return b === a ? this._locale._abbr : (c = vb.localeData(b), null != c && (this._locale = c), this)
        },
        lang: f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (b) {
            return b === a ? this.localeData() : this.locale(b)
        }),
        localeData: function () {
            return this._locale
        },
        _dateUtcOffset: function () {
            return 15 * -Math.round(this._d.getTimezoneOffset() / 15)
        }
    }), vb.fn.millisecond = vb.fn.milliseconds = qb("Milliseconds", !1), vb.fn.second = vb.fn.seconds = qb("Seconds", !1), vb.fn.minute = vb.fn.minutes = qb("Minutes", !1), vb.fn.hour = vb.fn.hours = qb("Hours", !0), vb.fn.date = qb("Date", !0), vb.fn.dates = f("dates accessor is deprecated. Use date instead.", qb("Date", !0)), vb.fn.year = qb("FullYear", !0), vb.fn.years = f("years accessor is deprecated. Use year instead.", qb("FullYear", !0)), vb.fn.days = vb.fn.day, vb.fn.months = vb.fn.month, vb.fn.weeks = vb.fn.week, vb.fn.isoWeeks = vb.fn.isoWeek, vb.fn.quarters = vb.fn.quarter, vb.fn.toJSON = vb.fn.toISOString, vb.fn.isUTC = vb.fn.isUtc, o(vb.duration.fn = n.prototype, {
        _bubble: function () {
            var a, b, c, d = this._milliseconds, e = this._days, f = this._months, g = this._data, h = 0;
            g.milliseconds = d % 1e3, a = q(d / 1e3), g.seconds = a % 60, b = q(a / 60), g.minutes = b % 60, c = q(b / 60), g.hours = c % 24, e += q(c / 24), h = q(rb(e)), e -= q(sb(h)), f += q(e / 30), e %= 30, h += q(f / 12), f %= 12, g.days = e, g.months = f, g.years = h
        },
        abs: function () {
            return this._milliseconds = Math.abs(this._milliseconds), this._days = Math.abs(this._days), this._months = Math.abs(this._months), this._data.milliseconds = Math.abs(this._data.milliseconds), this._data.seconds = Math.abs(this._data.seconds), this._data.minutes = Math.abs(this._data.minutes), this._data.hours = Math.abs(this._data.hours), this._data.months = Math.abs(this._data.months), this._data.years = Math.abs(this._data.years), this
        },
        weeks: function () {
            return q(this.days() / 7)
        },
        valueOf: function () {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * C(this._months / 12)
        },
        humanize: function (a) {
            var b = ib(this, !a, this.localeData());
            return a && (b = this.localeData().pastFuture(+this, b)), this.localeData().postformat(b)
        },
        add: function (a, b) {
            var c = vb.duration(a, b);
            return this._milliseconds += c._milliseconds, this._days += c._days, this._months += c._months, this._bubble(), this
        },
        subtract: function (a, b) {
            var c = vb.duration(a, b);
            return this._milliseconds -= c._milliseconds, this._days -= c._days, this._months -= c._months, this._bubble(), this
        },
        get: function (a) {
            return a = z(a), this[a.toLowerCase() + "s"]()
        },
        as: function (a) {
            var b, c;
            if (a = z(a), "month" === a || "year" === a)return b = this._days + this._milliseconds / 864e5, c = this._months + 12 * rb(b), "month" === a ? c : c / 12;
            switch (b = this._days + Math.round(sb(this._months / 12)), a) {
                case"week":
                    return b / 7 + this._milliseconds / 6048e5;
                case"day":
                    return b + this._milliseconds / 864e5;
                case"hour":
                    return 24 * b + this._milliseconds / 36e5;
                case"minute":
                    return 24 * b * 60 + this._milliseconds / 6e4;
                case"second":
                    return 24 * b * 60 * 60 + this._milliseconds / 1e3;
                case"millisecond":
                    return Math.floor(24 * b * 60 * 60 * 1e3) + this._milliseconds;
                default:
                    throw new Error("Unknown unit " + a)
            }
        },
        lang: vb.fn.lang,
        locale: vb.fn.locale,
        toIsoString: f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function () {
            return this.toISOString()
        }),
        toISOString: function () {
            var a = Math.abs(this.years()), b = Math.abs(this.months()), c = Math.abs(this.days()), d = Math.abs(this.hours()), e = Math.abs(this.minutes()), f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
        },
        localeData: function () {
            return this._locale
        },
        toJSON: function () {
            return this.toISOString()
        }
    }), vb.duration.fn.toString = vb.duration.fn.toISOString;
    for (xb in kc)c(kc, xb) && tb(xb.toLowerCase());
    vb.duration.fn.asMilliseconds = function () {
        return this.as("ms")
    }, vb.duration.fn.asSeconds = function () {
        return this.as("s")
    }, vb.duration.fn.asMinutes = function () {
        return this.as("m")
    }, vb.duration.fn.asHours = function () {
        return this.as("h")
    }, vb.duration.fn.asDays = function () {
        return this.as("d")
    }, vb.duration.fn.asWeeks = function () {
        return this.as("weeks")
    }, vb.duration.fn.asMonths = function () {
        return this.as("M")
    }, vb.duration.fn.asYears = function () {
        return this.as("y")
    }, vb.locale("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/, ordinal: function (a) {
            var b = a % 10, c = 1 === C(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), Lb ? module.exports = vb : "function" == typeof define && define.amd ? (define(function (a, b, c) {
        return c.config && c.config() && c.config().noGlobal === !0 && (zb.moment = wb), vb
    }), ub(!0)) : ub()
}).call(this);

/*!
 * FullCalendar v2.3.0
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */
(function (t) {
    "function" == typeof define && define.amd ? define(["jquery", "moment"], t) : t(jQuery, moment)
})(function (t, e) {
    function n() {
        var e, n, i, r, s, o = Array.prototype.slice.call(arguments), l = {};
        for (e = 0; Pe.length > e; e++) {
            for (n = Pe[e], i = null, r = 0; o.length > r; r++)s = o[r][n], t.isPlainObject(s) ? i = t.extend(i || {}, s) : null != s && (i = null);
            null !== i && (l[n] = i)
        }
        return o.unshift({}), o.push(l), t.extend.apply(t, o)
    }

    function i(e) {
        var n, i = {views: e.views || {}};
        return t.each(e, function (e, r) {
            "views" != e && (t.isPlainObject(r) && !/(time|duration|interval)$/i.test(e) && -1 == t.inArray(e, Pe) ? (n = null, t.each(r, function (t, r) {
                /^(month|week|day|default|basic(Week|Day)?|agenda(Week|Day)?)$/.test(t) ? (i.views[t] || (i.views[t] = {}), i.views[t][e] = r) : (n || (n = {}), n[t] = r)
            }), n && (i[e] = n)) : i[e] = r)
        }), i
    }

    function r(t, e) {
        e.left && t.css({"border-left-width": 1, "margin-left": e.left - 1}), e.right && t.css({
            "border-right-width": 1,
            "margin-right": e.right - 1
        })
    }

    function s(t) {
        t.css({"margin-left": "", "margin-right": "", "border-left-width": "", "border-right-width": ""})
    }

    function o() {
        t("body").addClass("fc-not-allowed")
    }

    function l() {
        t("body").removeClass("fc-not-allowed")
    }

    function a(e, n, i) {
        var r = Math.floor(n / e.length), s = Math.floor(n - r * (e.length - 1)), o = [], l = [], a = [], c = 0;
        u(e), e.each(function (n, i) {
            var u = n === e.length - 1 ? s : r, d = t(i).outerHeight(!0);
            u > d ? (o.push(i), l.push(d), a.push(t(i).height())) : c += d
        }), i && (n -= c, r = Math.floor(n / o.length), s = Math.floor(n - r * (o.length - 1))), t(o).each(function (e, n) {
            var i = e === o.length - 1 ? s : r, u = l[e], c = a[e], d = i - (u - c);
            i > u && t(n).height(d)
        })
    }

    function u(t) {
        t.height("")
    }

    function c(e) {
        var n = 0;
        return e.find("> *").each(function (e, i) {
            var r = t(i).outerWidth();
            r > n && (n = r)
        }), n++, e.width(n), n
    }

    function d(t, e) {
        return t.height(e).addClass("fc-scroller"), t[0].scrollHeight - 1 > t[0].clientHeight ? !0 : (h(t), !1)
    }

    function h(t) {
        t.height("").removeClass("fc-scroller")
    }

    function f(e) {
        var n = e.css("position"), i = e.parents().filter(function () {
            var e = t(this);
            return /(auto|scroll)/.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
        }).eq(0);
        return "fixed" !== n && i.length ? i : t(e[0].ownerDocument || document)
    }

    function g(t) {
        var e = t.offset();
        return {left: e.left, right: e.left + t.outerWidth(), top: e.top, bottom: e.top + t.outerHeight()}
    }

    function p(t) {
        var e = t.offset(), n = v(t), i = e.left + E(t, "border-left-width") + n.left, r = e.top + E(t, "border-top-width") + n.top;
        return {left: i, right: i + t[0].clientWidth, top: r, bottom: r + t[0].clientHeight}
    }

    function m(t) {
        var e = t.offset(), n = e.left + E(t, "border-left-width") + E(t, "padding-left"), i = e.top + E(t, "border-top-width") + E(t, "padding-top");
        return {left: n, right: n + t.width(), top: i, bottom: i + t.height()}
    }

    function v(t) {
        var e = t.innerWidth() - t[0].clientWidth, n = {
            left: 0,
            right: 0,
            top: 0,
            bottom: t.innerHeight() - t[0].clientHeight
        };
        return y() && "rtl" == t.css("direction") ? n.left = e : n.right = e, n
    }

    function y() {
        return null === Ve && (Ve = w()), Ve
    }

    function w() {
        var e = t("<div><div/></div>").css({
            position: "absolute",
            top: -1e3,
            left: 0,
            border: 0,
            padding: 0,
            overflow: "scroll",
            direction: "rtl"
        }).appendTo("body"), n = e.children(), i = n.offset().left > e.offset().left;
        return e.remove(), i
    }

    function E(t, e) {
        return parseFloat(t.css(e)) || 0
    }

    function S(t) {
        return 1 == t.which && !t.ctrlKey
    }

    function b(t, e) {
        var n = {
            left: Math.max(t.left, e.left),
            right: Math.min(t.right, e.right),
            top: Math.max(t.top, e.top),
            bottom: Math.min(t.bottom, e.bottom)
        };
        return n.left < n.right && n.top < n.bottom ? n : !1
    }

    function D(t, e) {
        return {left: Math.min(Math.max(t.left, e.left), e.right), top: Math.min(Math.max(t.top, e.top), e.bottom)}
    }

    function C(t) {
        return {left: (t.left + t.right) / 2, top: (t.top + t.bottom) / 2}
    }

    function T(t, e) {
        return {left: t.left - e.left, top: t.top - e.top}
    }

    function H(t, e) {
        var n, i, r, s, o = t.start, l = t.end, a = e.start, u = e.end;
        return l > a && u > o ? (o >= a ? (n = o.clone(), r = !0) : (n = a.clone(), r = !1), u >= l ? (i = l.clone(), s = !0) : (i = u.clone(), s = !1), {
            start: n,
            end: i,
            isStart: r,
            isEnd: s
        }) : void 0
    }

    function x(t, n) {
        return e.duration({days: t.clone().stripTime().diff(n.clone().stripTime(), "days"), ms: t.time() - n.time()})
    }

    function R(t, n) {
        return e.duration({days: t.clone().stripTime().diff(n.clone().stripTime(), "days")})
    }

    function k(t, n, i) {
        return e.duration(Math.round(t.diff(n, i, !0)), i)
    }

    function M(t, e) {
        var n, i, r;
        for (n = 0; Ye.length > n && (i = Ye[n], r = F(i, t, e), !(r >= 1 && U(r))); n++);
        return i
    }

    function F(t, n, i) {
        return null != i ? i.diff(n, t, !0) : e.isDuration(n) ? n.as(t) : n.end.diff(n.start, t, !0)
    }

    function z(t) {
        return Boolean(t.hours() || t.minutes() || t.seconds() || t.milliseconds())
    }

    function G(t) {
        return "[object Date]" === Object.prototype.toString.call(t) || t instanceof Date
    }

    function L(t) {
        return /^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(t)
    }

    function _(t) {
        var e = function () {
        };
        return e.prototype = t, new e
    }

    function P(t, e) {
        for (var n in t)A(t, n) && (e[n] = t[n])
    }

    function V(t, e) {
        var n, i, r = ["constructor", "toString", "valueOf"];
        for (n = 0; r.length > n; n++)i = r[n], t[i] !== Object.prototype[i] && (e[i] = t[i])
    }

    function A(t, e) {
        return Ie.call(t, e)
    }

    function O(e) {
        return /undefined|null|boolean|number|string/.test(t.type(e))
    }

    function N(e, n, i) {
        if (t.isFunction(e) && (e = [e]), e) {
            var r, s;
            for (r = 0; e.length > r; r++)s = e[r].apply(n, i) || s;
            return s
        }
    }

    function B() {
        for (var t = 0; arguments.length > t; t++)if (void 0 !== arguments[t])return arguments[t]
    }

    function Y(t) {
        return (t + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />")
    }

    function I(t) {
        return t.replace(/&.*?;/g, "")
    }

    function W(e) {
        var n = [];
        return t.each(e, function (t, e) {
            null != e && n.push(t + ":" + e)
        }), n.join(";")
    }

    function Z(t) {
        return t.charAt(0).toUpperCase() + t.slice(1)
    }

    function j(t, e) {
        return t - e
    }

    function U(t) {
        return 0 === t % 1
    }

    function $(t, e) {
        var n = t[e];
        return function () {
            return n.apply(t, arguments)
        }
    }

    function q(t, e) {
        var n, i, r, s, o = function () {
            var l = +new Date - s;
            e > l && l > 0 ? n = setTimeout(o, e - l) : (n = null, t.apply(r, i), n || (r = i = null))
        };
        return function () {
            r = this, i = arguments, s = +new Date, n || (n = setTimeout(o, e))
        }
    }

    function X(n, i, r) {
        var s, o, l, a, u = n[0], c = 1 == n.length && "string" == typeof u;
        return e.isMoment(u) ? (a = e.apply(null, n), Q(u, a)) : G(u) || void 0 === u ? a = e.apply(null, n) : (s = !1, o = !1, c ? We.test(u) ? (u += "-01", n = [u], s = !0, o = !0) : (l = Ze.exec(u)) && (s = !l[5], o = !0) : t.isArray(u) && (o = !0), a = i || s ? e.utc.apply(e, n) : e.apply(null, n), s ? (a._ambigTime = !0, a._ambigZone = !0) : r && (o ? a._ambigZone = !0 : c && (a.utcOffset ? a.utcOffset(u) : a.zone(u)))), a._fullCalendar = !0, a
    }

    function K(t, n) {
        var i, r, s = !1, o = !1, l = t.length, a = [];
        for (i = 0; l > i; i++)r = t[i], e.isMoment(r) || (r = Le.moment.parseZone(r)), s = s || r._ambigTime, o = o || r._ambigZone, a.push(r);
        for (i = 0; l > i; i++)r = a[i], n || !s || r._ambigTime ? o && !r._ambigZone && (a[i] = r.clone().stripZone()) : a[i] = r.clone().stripTime();
        return a
    }

    function Q(t, e) {
        t._ambigTime ? e._ambigTime = !0 : e._ambigTime && (e._ambigTime = !1), t._ambigZone ? e._ambigZone = !0 : e._ambigZone && (e._ambigZone = !1)
    }

    function J(t, e) {
        t.year(e[0] || 0).month(e[1] || 0).date(e[2] || 0).hours(e[3] || 0).minutes(e[4] || 0).seconds(e[5] || 0).milliseconds(e[6] || 0)
    }

    function te(t, e) {
        return Ue.format.call(t, e)
    }

    function ee(t, e) {
        return ne(t, le(e))
    }

    function ne(t, e) {
        var n, i = "";
        for (n = 0; e.length > n; n++)i += ie(t, e[n]);
        return i
    }

    function ie(t, e) {
        var n, i;
        return "string" == typeof e ? e : (n = e.token) ? $e[n] ? $e[n](t) : te(t, n) : e.maybe && (i = ne(t, e.maybe), i.match(/[1-9]/)) ? i : ""
    }

    function re(t, e, n, i, r) {
        var s;
        return t = Le.moment.parseZone(t), e = Le.moment.parseZone(e), s = (t.localeData || t.lang).call(t), n = s.longDateFormat(n) || n, i = i || " - ", se(t, e, le(n), i, r)
    }

    function se(t, e, n, i, r) {
        var s, o, l, a, u = "", c = "", d = "", h = "", f = "";
        for (o = 0; n.length > o && (s = oe(t, e, n[o]), s !== !1); o++)u += s;
        for (l = n.length - 1; l > o && (s = oe(t, e, n[l]), s !== !1); l--)c = s + c;
        for (a = o; l >= a; a++)d += ie(t, n[a]), h += ie(e, n[a]);
        return (d || h) && (f = r ? h + i + d : d + i + h), u + f + c
    }

    function oe(t, e, n) {
        var i, r;
        return "string" == typeof n ? n : (i = n.token) && (r = qe[i.charAt(0)], r && t.isSame(e, r)) ? te(t, i) : !1
    }

    function le(t) {
        return t in Xe ? Xe[t] : Xe[t] = ae(t)
    }

    function ae(t) {
        for (var e, n = [], i = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g; e = i.exec(t);)e[1] ? n.push(e[1]) : e[2] ? n.push({maybe: ae(e[2])}) : e[3] ? n.push({token: e[3]}) : e[5] && n.push(e[5]);
        return n
    }

    function ue() {
    }

    function ce(t, e) {
        return t || e ? t && e ? t.grid === e.grid && t.row === e.row && t.col === e.col : !1 : !0
    }

    function de(t) {
        var e = fe(t);
        return "background" === e || "inverse-background" === e
    }

    function he(t) {
        return "inverse-background" === fe(t)
    }

    function fe(t) {
        return B((t.source || {}).rendering, t.rendering)
    }

    function ge(t) {
        var e, n, i = {};
        for (e = 0; t.length > e; e++)n = t[e], (i[n._id] || (i[n._id] = [])).push(n);
        return i
    }

    function pe(t, e) {
        return t.eventStartMS - e.eventStartMS
    }

    function me(t, e) {
        return t.eventStartMS - e.eventStartMS || e.eventDurationMS - t.eventDurationMS || e.event.allDay - t.event.allDay || (t.event.title || "").localeCompare(e.event.title)
    }

    function ve(n) {
        var i, r, s, o, l = Le.dataAttrPrefix;
        return l && (l += "-"), i = n.data(l + "event") || null, i && (i = "object" == typeof i ? t.extend({}, i) : {}, r = i.start, null == r && (r = i.time), s = i.duration, o = i.stick, delete i.start, delete i.time, delete i.duration, delete i.stick), null == r && (r = n.data(l + "start")), null == r && (r = n.data(l + "time")), null == s && (s = n.data(l + "duration")), null == o && (o = n.data(l + "stick")), r = null != r ? e.duration(r) : null, s = null != s ? e.duration(s) : null, o = Boolean(o), {
            eventProps: i,
            startTime: r,
            duration: s,
            stick: o
        }
    }

    function ye(t, e) {
        var n, i;
        for (n = 0; e.length > n; n++)if (i = e[n], i.leftCol <= t.rightCol && i.rightCol >= t.leftCol)return !0;
        return !1
    }

    function we(t, e) {
        return t.leftCol - e.leftCol
    }

    function Ee(t) {
        var e, n, i;
        if (t.sort(me), e = Se(t), be(e), n = e[0]) {
            for (i = 0; n.length > i; i++)De(n[i]);
            for (i = 0; n.length > i; i++)Ce(n[i], 0, 0)
        }
    }

    function Se(t) {
        var e, n, i, r = [];
        for (e = 0; t.length > e; e++) {
            for (n = t[e], i = 0; r.length > i && Te(n, r[i]).length; i++);
            n.level = i, (r[i] || (r[i] = [])).push(n)
        }
        return r
    }

    function be(t) {
        var e, n, i, r, s;
        for (e = 0; t.length > e; e++)for (n = t[e], i = 0; n.length > i; i++)for (r = n[i], r.forwardSegs = [], s = e + 1; t.length > s; s++)Te(r, t[s], r.forwardSegs)
    }

    function De(t) {
        var e, n, i = t.forwardSegs, r = 0;
        if (void 0 === t.forwardPressure) {
            for (e = 0; i.length > e; e++)n = i[e], De(n), r = Math.max(r, 1 + n.forwardPressure);
            t.forwardPressure = r
        }
    }

    function Ce(t, e, n) {
        var i, r = t.forwardSegs;
        if (void 0 === t.forwardCoord)for (r.length ? (r.sort(xe), Ce(r[0], e + 1, n), t.forwardCoord = r[0].backwardCoord) : t.forwardCoord = 1, t.backwardCoord = t.forwardCoord - (t.forwardCoord - n) / (e + 1), i = 0; r.length > i; i++)Ce(r[i], 0, t.forwardCoord)
    }

    function Te(t, e, n) {
        n = n || [];
        for (var i = 0; e.length > i; i++)He(t, e[i]) && n.push(e[i]);
        return n
    }

    function He(t, e) {
        return t.bottom > e.top && t.top < e.bottom
    }

    function xe(t, e) {
        return e.forwardPressure - t.forwardPressure || (t.backwardCoord || 0) - (e.backwardCoord || 0) || me(t, e)
    }

    function Re(n, i) {
        function r() {
            j ? l() && (c(), a()) : s()
        }

        function s() {
            U = B.theme ? "ui" : "fc", n.addClass("fc"), B.isRTL ? n.addClass("fc-rtl") : n.addClass("fc-ltr"), B.theme ? n.addClass("ui-widget") : n.addClass("fc-unthemed"), j = t("<div class='fc-view-container'/>").prependTo(n), W = N.header = new Fe(N, B), Z = W.render(), Z && n.prepend(Z), a(B.defaultView), B.handleWindowResize && (K = q(h, B.windowResizeDelay), t(window).resize(K))
        }

        function o() {
            $ && $.removeElement(), W.destroy(), j.remove(), n.removeClass("fc fc-ltr fc-rtl fc-unthemed ui-widget"), K && t(window).unbind("resize", K)
        }

        function l() {
            return n.is(":visible")
        }

        function a(e) {
            ie++, $ && e && $.type !== e && (W.deactivateButton($.type), G(), $.removeElement(), $ = N.view = null), !$ && e && ($ = N.view = ne[e] || (ne[e] = N.instantiateView(e)), $.setElement(t("<div class='fc-view fc-" + e + "-view' />").appendTo(j)), W.activateButton(e)), $ && (Q = $.massageCurrentDate(Q), $.isDisplayed && Q.isWithin($.intervalStart, $.intervalEnd) || l() && (G(), $.display(Q), L(), E(), S(), m())), L(), ie--
        }

        function u(t) {
            return l() ? (t && d(), ie++, $.updateSize(!0), ie--, !0) : void 0
        }

        function c() {
            l() && d()
        }

        function d() {
            X = "number" == typeof B.contentHeight ? B.contentHeight : "number" == typeof B.height ? B.height - (Z ? Z.outerHeight(!0) : 0) : Math.round(j.width() / Math.max(B.aspectRatio, .5))
        }

        function h(t) {
            !ie && t.target === window && $.start && u(!0) && $.trigger("windowResize", ee)
        }

        function f() {
            p(), v()
        }

        function g() {
            l() && (G(), $.displayEvents(re), L())
        }

        function p() {
            G(), $.clearEvents(), L()
        }

        function m() {
            !B.lazyFetching || J($.start, $.end) ? v() : g()
        }

        function v() {
            te($.start, $.end)
        }

        function y(t) {
            re = t, g()
        }

        function w() {
            g()
        }

        function E() {
            W.updateTitle($.title)
        }

        function S() {
            var t = N.getNow();
            t.isWithin($.intervalStart, $.intervalEnd) ? W.disableButton("today") : W.enableButton("today")
        }

        function b(t, e) {
            t = N.moment(t), e = e ? N.moment(e) : t.hasTime() ? t.clone().add(N.defaultTimedEventDuration) : t.clone().add(N.defaultAllDayEventDuration), $.select({
                start: t,
                end: e
            })
        }

        function D() {
            $ && $.unselect()
        }

        function C() {
            Q = $.computePrevDate(Q), a()
        }

        function T() {
            Q = $.computeNextDate(Q), a()
        }

        function H() {
            Q.add(-1, "years"), a()
        }

        function x() {
            Q.add(1, "years"), a()
        }

        function R() {
            Q = N.getNow(), a()
        }

        function k(t) {
            Q = N.moment(t), a()
        }

        function M(t) {
            Q.add(e.duration(t)), a()
        }

        function F(t, e) {
            var n;
            e = e || "day", n = N.getViewSpec(e) || N.getUnitViewSpec(e), Q = t, a(n ? n.type : null)
        }

        function z() {
            return Q.clone()
        }

        function G() {
            j.css({width: "100%", height: j.height(), overflow: "hidden"})
        }

        function L() {
            j.css({width: "", height: "", overflow: ""})
        }

        function P() {
            return N
        }

        function V() {
            return $
        }

        function A(t, e) {
            return void 0 === e ? B[t] : (("height" == t || "contentHeight" == t || "aspectRatio" == t) && (B[t] = e, u(!0)), void 0)
        }

        function O(t, e) {
            return B[t] ? B[t].apply(e || ee, Array.prototype.slice.call(arguments, 2)) : void 0
        }

        var N = this;
        N.initOptions(i || {});
        var B = this.options;
        N.render = r, N.destroy = o, N.refetchEvents = f, N.reportEvents = y, N.reportEventChange = w, N.rerenderEvents = g, N.changeView = a, N.select = b, N.unselect = D, N.prev = C, N.next = T, N.prevYear = H, N.nextYear = x, N.today = R, N.gotoDate = k, N.incrementDate = M, N.zoomTo = F, N.getDate = z, N.getCalendar = P, N.getView = V, N.option = A, N.trigger = O;
        var Y = _(Me(B.lang));
        if (B.monthNames && (Y._months = B.monthNames), B.monthNamesShort && (Y._monthsShort = B.monthNamesShort), B.dayNames && (Y._weekdays = B.dayNames), B.dayNamesShort && (Y._weekdaysShort = B.dayNamesShort), null != B.firstDay) {
            var I = _(Y._week);
            I.dow = B.firstDay, Y._week = I
        }
        Y._fullCalendar_weekCalc = function (t) {
            return "function" == typeof t ? t : "local" === t ? t : "iso" === t || "ISO" === t ? "ISO" : void 0
        }(B.weekNumberCalculation), N.defaultAllDayEventDuration = e.duration(B.defaultAllDayEventDuration), N.defaultTimedEventDuration = e.duration(B.defaultTimedEventDuration), N.moment = function () {
            var t;
            return "local" === B.timezone ? (t = Le.moment.apply(null, arguments), t.hasTime() && t.local()) : t = "UTC" === B.timezone ? Le.moment.utc.apply(null, arguments) : Le.moment.parseZone.apply(null, arguments), "_locale"in t ? t._locale = Y : t._lang = Y, t
        }, N.getIsAmbigTimezone = function () {
            return "local" !== B.timezone && "UTC" !== B.timezone
        }, N.rezoneDate = function (t) {
            return N.moment(t.toArray())
        }, N.getNow = function () {
            var t = B.now;
            return "function" == typeof t && (t = t()), N.moment(t)
        }, N.getEventEnd = function (t) {
            return t.end ? t.end.clone() : N.getDefaultEventEnd(t.allDay, t.start)
        }, N.getDefaultEventEnd = function (t, e) {
            var n = e.clone();
            return t ? n.stripTime().add(N.defaultAllDayEventDuration) : n.add(N.defaultTimedEventDuration), N.getIsAmbigTimezone() && n.stripZone(), n
        }, N.humanizeDuration = function (t) {
            return (t.locale || t.lang).call(t, B.lang).humanize()
        }, ze.call(N, B);
        var W, Z, j, U, $, X, K, Q, J = N.isFetchNeeded, te = N.fetchEvents, ee = n[0], ne = {}, ie = 0, re = [];
        Q = null != B.defaultDate ? N.moment(B.defaultDate) : N.getNow(), N.getSuggestedViewHeight = function () {
            return void 0 === X && c(), X
        }, N.isHeightAuto = function () {
            return "auto" === B.contentHeight || "auto" === B.height
        }
    }

    function ke(e) {
        t.each(fn, function (t, n) {
            null == e[t] && (e[t] = n(e))
        })
    }

    function Me(t) {
        var n = e.localeData || e.langData;
        return n.call(e, t) || n.call(e, "en")
    }

    function Fe(e, n) {
        function i() {
            var e = n.header;
            return f = n.theme ? "ui" : "fc", e ? g = t("<div class='fc-toolbar'/>").append(s("left")).append(s("right")).append(s("center")).append('<div class="fc-clear"/>') : void 0
        }

        function r() {
            g.remove()
        }

        function s(i) {
            var r = t('<div class="fc-' + i + '"/>'), s = n.header[i];
            return s && t.each(s.split(" "), function () {
                var i, s = t(), o = !0;
                t.each(this.split(","), function (i, r) {
                    var l, a, u, c, d, h, g, m, v;
                    "title" == r ? (s = s.add(t("<h2>&nbsp;</h2>")), o = !1) : (l = e.getViewSpec(r), l ? (a = function () {
                        e.changeView(r)
                    }, p.push(r), u = l.buttonTextOverride, c = l.buttonTextDefault) : e[r] && (a = function () {
                        e[r]()
                    }, u = (e.overrides.buttonText || {})[r], c = n.buttonText[r]), a && (d = n.themeButtonIcons[r], h = n.buttonIcons[r], g = u ? Y(u) : d && n.theme ? "<span class='ui-icon ui-icon-" + d + "'></span>" : h && !n.theme ? "<span class='fc-icon fc-icon-" + h + "'></span>" : Y(c), m = ["fc-" + r + "-button", f + "-button", f + "-state-default"], v = t('<button type="button" class="' + m.join(" ") + '">' + g + "</button>").click(function () {
                        v.hasClass(f + "-state-disabled") || (a(), (v.hasClass(f + "-state-active") || v.hasClass(f + "-state-disabled")) && v.removeClass(f + "-state-hover"))
                    }).mousedown(function () {
                        v.not("." + f + "-state-active").not("." + f + "-state-disabled").addClass(f + "-state-down")
                    }).mouseup(function () {
                        v.removeClass(f + "-state-down")
                    }).hover(function () {
                        v.not("." + f + "-state-active").not("." + f + "-state-disabled").addClass(f + "-state-hover")
                    }, function () {
                        v.removeClass(f + "-state-hover").removeClass(f + "-state-down")
                    }), s = s.add(v)))
                }), o && s.first().addClass(f + "-corner-left").end().last().addClass(f + "-corner-right").end(), s.length > 1 ? (i = t("<div/>"), o && i.addClass("fc-button-group"), i.append(s), r.append(i)) : r.append(s)
            }), r
        }

        function o(t) {
            g.find("h2").text(t)
        }

        function l(t) {
            g.find(".fc-" + t + "-button").addClass(f + "-state-active")
        }

        function a(t) {
            g.find(".fc-" + t + "-button").removeClass(f + "-state-active")
        }

        function u(t) {
            g.find(".fc-" + t + "-button").attr("disabled", "disabled").addClass(f + "-state-disabled")
        }

        function c(t) {
            g.find(".fc-" + t + "-button").removeAttr("disabled").removeClass(f + "-state-disabled")
        }

        function d() {
            return p
        }

        var h = this;
        h.render = i, h.destroy = r, h.updateTitle = o, h.activateButton = l, h.deactivateButton = a, h.disableButton = u, h.enableButton = c, h.getViewsWithButtons = d;
        var f, g = t(), p = []
    }

    function ze(n) {
        function i(t, e) {
            return !W || t.clone().stripZone() < W.clone().stripZone() || e.clone().stripZone() > Z.clone().stripZone()
        }

        function r(t, e) {
            W = t, Z = e, te = [];
            var n = ++K, i = X.length;
            Q = i;
            for (var r = 0; i > r; r++)s(X[r], n)
        }

        function s(e, n) {
            o(e, function (i) {
                var r, s, o, l = t.isArray(e.events);
                if (n == K) {
                    if (i)for (r = 0; i.length > r; r++)s = i[r], o = l ? s : E(s, e), o && te.push.apply(te, T(o));
                    Q--, Q || $(te)
                }
            })
        }

        function o(e, i) {
            var r, s, l = Le.sourceFetchers;
            for (r = 0; l.length > r; r++) {
                if (s = l[r].call(I, e, W.clone(), Z.clone(), n.timezone, i), s === !0)return;
                if ("object" == typeof s)return o(s, i), void 0
            }
            var a = e.events;
            if (a)t.isFunction(a) ? (y(), a.call(I, W.clone(), Z.clone(), n.timezone, function (t) {
                i(t), w()
            })) : t.isArray(a) ? i(a) : i(); else {
                var u = e.url;
                if (u) {
                    var c, d = e.success, h = e.error, f = e.complete;
                    c = t.isFunction(e.data) ? e.data() : e.data;
                    var g = t.extend({}, c || {}), p = B(e.startParam, n.startParam), m = B(e.endParam, n.endParam), v = B(e.timezoneParam, n.timezoneParam);
                    p && (g[p] = W.format()), m && (g[m] = Z.format()), n.timezone && "local" != n.timezone && (g[v] = n.timezone), y(), t.ajax(t.extend({}, gn, e, {
                        data: g,
                        success: function (e) {
                            e = e || [];
                            var n = N(d, this, arguments);
                            t.isArray(n) && (e = n), i(e)
                        },
                        error: function () {
                            N(h, this, arguments), i()
                        },
                        complete: function () {
                            N(f, this, arguments), w()
                        }
                    }))
                } else i()
            }
        }

        function l(t) {
            var e = a(t);
            e && (X.push(e), Q++, s(e, K))
        }

        function a(e) {
            var n, i, r = Le.sourceNormalizers;
            if (t.isFunction(e) || t.isArray(e) ? n = {events: e} : "string" == typeof e ? n = {url: e} : "object" == typeof e && (n = t.extend({}, e)), n) {
                for (n.className ? "string" == typeof n.className && (n.className = n.className.split(/\s+/)) : n.className = [], t.isArray(n.events) && (n.origArray = n.events, n.events = t.map(n.events, function (t) {
                    return E(t, n)
                })), i = 0; r.length > i; i++)r[i].call(I, n);
                return n
            }
        }

        function u(e) {
            X = t.grep(X, function (t) {
                return !c(t, e)
            }), te = t.grep(te, function (t) {
                return !c(t.source, e)
            }), $(te)
        }

        function c(t, e) {
            return t && e && d(t) == d(e)
        }

        function d(t) {
            return ("object" == typeof t ? t.origArray || t.googleCalendarId || t.url || t.events : null) || t
        }

        function h(t) {
            t.start = I.moment(t.start), t.end = t.end ? I.moment(t.end) : null, H(t, f(t)), $(te)
        }

        function f(e) {
            var n = {};
            return t.each(e, function (t, e) {
                g(t) && void 0 !== e && O(e) && (n[t] = e)
            }), n
        }

        function g(t) {
            return !/^_|^(id|allDay|start|end)$/.test(t)
        }

        function p(t, e) {
            var n, i, r, s = E(t);
            if (s) {
                for (n = T(s), i = 0; n.length > i; i++)r = n[i], r.source || (e && (q.events.push(r), r.source = q), te.push(r));
                return $(te), n
            }
            return []
        }

        function m(e) {
            var n, i;
            for (null == e ? e = function () {
                return !0
            } : t.isFunction(e) || (n = e + "", e = function (t) {
                return t._id == n
            }), te = t.grep(te, e, !0), i = 0; X.length > i; i++)t.isArray(X[i].events) && (X[i].events = t.grep(X[i].events, e, !0));
            $(te)
        }

        function v(e) {
            return t.isFunction(e) ? t.grep(te, e) : null != e ? (e += "", t.grep(te, function (t) {
                return t._id == e
            })) : te
        }

        function y() {
            J++ || j("loading", null, !0, U())
        }

        function w() {
            --J || j("loading", null, !1, U())
        }

        function E(i, r) {
            var s, o, l, a = {};
            if (n.eventDataTransform && (i = n.eventDataTransform(i)), r && r.eventDataTransform && (i = r.eventDataTransform(i)), t.extend(a, i), r && (a.source = r), a._id = i._id || (void 0 === i.id ? "_fc" + pn++ : i.id + ""), a.className = i.className ? "string" == typeof i.className ? i.className.split(/\s+/) : i.className : [], s = i.start || i.date, o = i.end, L(s) && (s = e.duration(s)), L(o) && (o = e.duration(o)), i.dow || e.isDuration(s) || e.isDuration(o))a.start = s ? e.duration(s) : null, a.end = o ? e.duration(o) : null, a._recurring = !0; else {
                if (s && (s = I.moment(s), !s.isValid()))return !1;
                o && (o = I.moment(o), o.isValid() || (o = null)), l = i.allDay, void 0 === l && (l = B(r ? r.allDayDefault : void 0, n.allDayDefault)), S(s, o, l, a)
            }
            return a
        }

        function S(t, e, n, i) {
            i.start = t, i.end = e, i.allDay = n, b(i), Ge(i)
        }

        function b(t) {
            D(t), t.end && !t.end.isAfter(t.start) && (t.end = null), t.end || (t.end = n.forceEventDuration ? I.getDefaultEventEnd(t.allDay, t.start) : null)
        }

        function D(t) {
            null == t.allDay && (t.allDay = !(t.start.hasTime() || t.end && t.end.hasTime())), t.allDay ? (t.start.stripTime(), t.end && t.end.stripTime()) : (t.start.hasTime() || (t.start = I.rezoneDate(t.start)), t.end && !t.end.hasTime() && (t.end = I.rezoneDate(t.end)))
        }

        function C(e) {
            var n;
            return e.end || (n = e.allDay, null == n && (n = !e.start.hasTime()), e = t.extend({}, e), e.end = I.getDefaultEventEnd(n, e.start)), e
        }

        function T(e, n, i) {
            var r, s, o, l, a, u, c, d, h, f = [];
            if (n = n || W, i = i || Z, e)if (e._recurring) {
                if (s = e.dow)for (r = {}, o = 0; s.length > o; o++)r[s[o]] = !0;
                for (l = n.clone().stripTime(); l.isBefore(i);)(!r || r[l.day()]) && (a = e.start, u = e.end, c = l.clone(), d = null, a && (c = c.time(a)), u && (d = l.clone().time(u)), h = t.extend({}, e), S(c, d, !a && !u, h), f.push(h)), l.add(1, "days")
            } else f.push(e);
            return f
        }

        function H(e, n, i) {
            function r(t, e) {
                return i ? k(t, e, i) : n.allDay ? R(t, e) : x(t, e)
            }

            var s, o, l, a, u, c, d = {};
            return n = n || {}, n.start || (n.start = e.start.clone()), void 0 === n.end && (n.end = e.end ? e.end.clone() : null), null == n.allDay && (n.allDay = e.allDay), b(n), s = {
                start: e._start.clone(),
                end: e._end ? e._end.clone() : I.getDefaultEventEnd(e._allDay, e._start),
                allDay: n.allDay
            }, b(s), o = null !== e._end && null === n.end, l = r(n.start, s.start), n.end ? (a = r(n.end, s.end), u = a.subtract(l)) : u = null, t.each(n, function (t, e) {
                g(t) && void 0 !== e && (d[t] = e)
            }), c = M(v(e._id), o, n.allDay, l, u, d), {dateDelta: l, durationDelta: u, undo: c}
        }

        function M(e, n, i, r, s, o) {
            var l = I.getIsAmbigTimezone(), a = [];
            return r && !r.valueOf() && (r = null), s && !s.valueOf() && (s = null), t.each(e, function (e, u) {
                var c, d;
                c = {
                    start: u.start.clone(),
                    end: u.end ? u.end.clone() : null,
                    allDay: u.allDay
                }, t.each(o, function (t) {
                    c[t] = u[t]
                }), d = {
                    start: u._start,
                    end: u._end,
                    allDay: i
                }, b(d), n ? d.end = null : s && !d.end && (d.end = I.getDefaultEventEnd(d.allDay, d.start)), r && (d.start.add(r), d.end && d.end.add(r)), s && d.end.add(s), l && !d.allDay && (r || s) && (d.start.stripZone(), d.end && d.end.stripZone()), t.extend(u, o, d), Ge(u), a.push(function () {
                    t.extend(u, c), Ge(u)
                })
            }), function () {
                for (var t = 0; a.length > t; t++)a[t]()
            }
        }

        function F(e) {
            var i, r = n.businessHours, s = {
                className: "fc-nonbusiness",
                start: "09:00",
                end: "17:00",
                dow: [1, 2, 3, 4, 5],
                rendering: "inverse-background"
            }, o = I.getView();
            return r && (i = t.extend({}, s, "object" == typeof r ? r : {})), i ? (e && (i.start = null, i.end = null), T(E(i), o.start, o.end)) : []
        }

        function z(t, e) {
            var i = e.source || {}, r = B(e.constraint, i.constraint, n.eventConstraint), s = B(e.overlap, i.overlap, n.eventOverlap);
            return t = C(t), P(t, r, s, e)
        }

        function G(t) {
            return P(t, n.selectConstraint, n.selectOverlap)
        }

        function _(e, n) {
            var i, r;
            return n && (i = t.extend({}, n, e), r = T(E(i))[0]), r ? z(e, r) : (e = C(e), G(e))
        }

        function P(e, n, i, r) {
            var s, o, l, a, u, c;
            if (e = t.extend({}, e), e.start = e.start.clone().stripZone(), e.end = e.end.clone().stripZone(), null != n) {
                for (s = V(n), o = !1, a = 0; s.length > a; a++)if (A(s[a], e)) {
                    o = !0;
                    break
                }
                if (!o)return !1
            }
            for (l = I.getPeerEvents(r, e), a = 0; l.length > a; a++)if (u = l[a], Y(u, e)) {
                if (i === !1)return !1;
                if ("function" == typeof i && !i(u, r))return !1;
                if (r) {
                    if (c = B(u.overlap, (u.source || {}).overlap), c === !1)return !1;
                    if ("function" == typeof c && !c(r, u))return !1
                }
            }
            return !0
        }

        function V(t) {
            return "businessHours" === t ? F() : "object" == typeof t ? T(E(t)) : v(t)
        }

        function A(t, e) {
            var n = t.start.clone().stripZone(), i = I.getEventEnd(t).stripZone();
            return e.start >= n && i >= e.end
        }

        function Y(t, e) {
            var n = t.start.clone().stripZone(), i = I.getEventEnd(t).stripZone();
            return i > e.start && e.end > n
        }

        var I = this;
        I.isFetchNeeded = i, I.fetchEvents = r, I.addEventSource = l, I.removeEventSource = u, I.updateEvent = h, I.renderEvent = p, I.removeEvents = m, I.clientEvents = v, I.mutateEvent = H, I.normalizeEventRange = b, I.normalizeEventRangeTimes = D, I.ensureVisibleEventRange = C;
        var W, Z, j = I.trigger, U = I.getView, $ = I.reportEvents, q = {events: []}, X = [q], K = 0, Q = 0, J = 0, te = [];
        t.each((n.events ? [n.events] : []).concat(n.eventSources || []), function (t, e) {
            var n = a(e);
            n && X.push(n)
        }), I.getBusinessHoursEvents = F, I.isEventRangeAllowed = z, I.isSelectionRangeAllowed = G, I.isExternalDropRangeAllowed = _, I.getEventCache = function () {
            return te
        }
    }

    function Ge(t) {
        t._allDay = t.allDay, t._start = t.start.clone(), t._end = t.end ? t.end.clone() : null
    }

    var Le = t.fullCalendar = {version: "2.3.0"}, _e = Le.views = {};
    t.fn.fullCalendar = function (e) {
        var n = Array.prototype.slice.call(arguments, 1), i = this;
        return this.each(function (r, s) {
            var o, l = t(s), a = l.data("fullCalendar");
            "string" == typeof e ? a && t.isFunction(a[e]) && (o = a[e].apply(a, n), r || (i = o), "destroy" === e && l.removeData("fullCalendar")) : a || (a = new Le.CalendarBase(l, e), l.data("fullCalendar", a), a.render())
        }), i
    };
    var Pe = ["header", "buttonText", "buttonIcons", "themeButtonIcons"];
    Le.intersectionToSeg = H, Le.applyAll = N, Le.debounce = q, Le.isInt = U, Le.htmlEscape = Y, Le.cssToStr = W, Le.proxy = $, Le.getClientRect = p, Le.getContentRect = m, Le.getScrollbarWidths = v;
    var Ve = null;
    Le.computeIntervalUnit = M, Le.durationHasTime = z;
    var Ae, Oe, Ne, Be = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], Ye = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"], Ie = {}.hasOwnProperty, We = /^\s*\d{4}-\d\d$/, Ze = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/, je = e.fn, Ue = t.extend({}, je);
    Le.moment = function () {
        return X(arguments)
    }, Le.moment.utc = function () {
        var t = X(arguments, !0);
        return t.hasTime() && t.utc(), t
    }, Le.moment.parseZone = function () {
        return X(arguments, !0, !0)
    }, je.clone = function () {
        var t = Ue.clone.apply(this, arguments);
        return Q(this, t), this._fullCalendar && (t._fullCalendar = !0), t
    }, je.week = je.weeks = function (t) {
        var e = (this._locale || this._lang)._fullCalendar_weekCalc;
        return null == t && "function" == typeof e ? e(this) : "ISO" === e ? Ue.isoWeek.apply(this, arguments) : Ue.week.apply(this, arguments)
    }, je.time = function (t) {
        if (!this._fullCalendar)return Ue.time.apply(this, arguments);
        if (null == t)return e.duration({
            hours: this.hours(),
            minutes: this.minutes(),
            seconds: this.seconds(),
            milliseconds: this.milliseconds()
        });
        this._ambigTime = !1, e.isDuration(t) || e.isMoment(t) || (t = e.duration(t));
        var n = 0;
        return e.isDuration(t) && (n = 24 * Math.floor(t.asDays())), this.hours(n + t.hours()).minutes(t.minutes()).seconds(t.seconds()).milliseconds(t.milliseconds())
    }, je.stripTime = function () {
        var t;
        return this._ambigTime || (t = this.toArray(), this.utc(), Oe(this, t.slice(0, 3)), this._ambigTime = !0, this._ambigZone = !0), this
    }, je.hasTime = function () {
        return !this._ambigTime
    }, je.stripZone = function () {
        var t, e;
        return this._ambigZone || (t = this.toArray(), e = this._ambigTime, this.utc(), Oe(this, t), this._ambigTime = e || !1, this._ambigZone = !0), this
    }, je.hasZone = function () {
        return !this._ambigZone
    }, je.local = function () {
        var t = this.toArray(), e = this._ambigZone;
        return Ue.local.apply(this, arguments), this._ambigTime = !1, this._ambigZone = !1, e && Ne(this, t), this
    }, je.utc = function () {
        return Ue.utc.apply(this, arguments), this._ambigTime = !1, this._ambigZone = !1, this
    }, t.each(["zone", "utcOffset"], function (t, e) {
        Ue[e] && (je[e] = function (t) {
            return null != t && (this._ambigTime = !1, this._ambigZone = !1), Ue[e].apply(this, arguments)
        })
    }), je.format = function () {
        return this._fullCalendar && arguments[0] ? ee(this, arguments[0]) : this._ambigTime ? te(this, "YYYY-MM-DD") : this._ambigZone ? te(this, "YYYY-MM-DD[T]HH:mm:ss") : Ue.format.apply(this, arguments)
    }, je.toISOString = function () {
        return this._ambigTime ? te(this, "YYYY-MM-DD") : this._ambigZone ? te(this, "YYYY-MM-DD[T]HH:mm:ss") : Ue.toISOString.apply(this, arguments)
    }, je.isWithin = function (t, e) {
        var n = K([this, t, e]);
        return n[0] >= n[1] && n[0] < n[2]
    }, je.isSame = function (t, e) {
        var n;
        return this._fullCalendar ? e ? (n = K([this, t], !0), Ue.isSame.call(n[0], n[1], e)) : (t = Le.moment.parseZone(t), Ue.isSame.call(this, t) && Boolean(this._ambigTime) === Boolean(t._ambigTime) && Boolean(this._ambigZone) === Boolean(t._ambigZone)) : Ue.isSame.apply(this, arguments)
    }, t.each(["isBefore", "isAfter"], function (t, e) {
        je[e] = function (t, n) {
            var i;
            return this._fullCalendar ? (i = K([this, t]), Ue[e].call(i[0], i[1], n)) : Ue[e].apply(this, arguments)
        }
    }), Ae = "_d"in e() && "updateOffset"in e, Oe = Ae ? function (t, n) {
        t._d.setTime(Date.UTC.apply(Date, n)), e.updateOffset(t, !1)
    } : J, Ne = Ae ? function (t, n) {
        t._d.setTime(+new Date(n[0] || 0, n[1] || 0, n[2] || 0, n[3] || 0, n[4] || 0, n[5] || 0, n[6] || 0)), e.updateOffset(t, !1)
    } : J;
    var $e = {
        t: function (t) {
            return te(t, "a").charAt(0)
        }, T: function (t) {
            return te(t, "A").charAt(0)
        }
    };
    Le.formatRange = re;
    var qe = {
        Y: "year",
        M: "month",
        D: "day",
        d: "day",
        A: "second",
        a: "second",
        T: "second",
        t: "second",
        H: "second",
        h: "second",
        m: "second",
        s: "second"
    }, Xe = {};
    Le.Class = ue, ue.extend = function (t) {
        var e, n = this;
        return t = t || {}, A(t, "constructor") && (e = t.constructor), "function" != typeof e && (e = t.constructor = function () {
            n.apply(this, arguments)
        }), e.prototype = _(n.prototype), P(t, e.prototype), V(t, e.prototype), P(n, e), e
    }, ue.mixin = function (t) {
        P(t.prototype || t, this.prototype)
    };
    var Ke = ue.extend({
        isHidden: !0,
        options: null,
        el: null,
        documentMousedownProxy: null,
        margin: 10,
        constructor: function (t) {
            this.options = t || {}
        },
        show: function () {
            this.isHidden && (this.el || this.render(), this.el.show(), this.position(), this.isHidden = !1, this.trigger("show"))
        },
        hide: function () {
            this.isHidden || (this.el.hide(), this.isHidden = !0, this.trigger("hide"))
        },
        render: function () {
            var e = this, n = this.options;
            this.el = t('<div class="fc-popover"/>').addClass(n.className || "").css({
                top: 0,
                left: 0
            }).append(n.content).appendTo(n.parentEl), this.el.on("click", ".fc-close", function () {
                e.hide()
            }), n.autoHide && t(document).on("mousedown", this.documentMousedownProxy = $(this, "documentMousedown"))
        },
        documentMousedown: function (e) {
            this.el && !t(e.target).closest(this.el).length && this.hide()
        },
        destroy: function () {
            this.hide(), this.el && (this.el.remove(), this.el = null), t(document).off("mousedown", this.documentMousedownProxy)
        },
        position: function () {
            var e, n, i, r, s, o = this.options, l = this.el.offsetParent().offset(), a = this.el.outerWidth(), u = this.el.outerHeight(), c = t(window), d = f(this.el);
            r = o.top || 0, s = void 0 !== o.left ? o.left : void 0 !== o.right ? o.right - a : 0, d.is(window) || d.is(document) ? (d = c, e = 0, n = 0) : (i = d.offset(), e = i.top, n = i.left), e += c.scrollTop(), n += c.scrollLeft(), o.viewportConstrain !== !1 && (r = Math.min(r, e + d.outerHeight() - u - this.margin), r = Math.max(r, e + this.margin), s = Math.min(s, n + d.outerWidth() - a - this.margin), s = Math.max(s, n + this.margin)), this.el.css({
                top: r - l.top,
                left: s - l.left
            })
        },
        trigger: function (t) {
            this.options[t] && this.options[t].apply(this, Array.prototype.slice.call(arguments, 1))
        }
    }), Qe = ue.extend({
        grid: null,
        rowCoords: null,
        colCoords: null,
        containerEl: null,
        bounds: null,
        constructor: function (t) {
            this.grid = t
        },
        build: function () {
            this.rowCoords = this.grid.computeRowCoords(), this.colCoords = this.grid.computeColCoords(), this.computeBounds()
        },
        clear: function () {
            this.rowCoords = null, this.colCoords = null
        },
        getCell: function (e, n) {
            var i, r, s, o = this.rowCoords, l = o.length, a = this.colCoords, u = a.length, c = null, d = null;
            if (this.inBounds(e, n)) {
                for (i = 0; l > i; i++)if (r = o[i], n >= r.top && r.bottom > n) {
                    c = i;
                    break
                }
                for (i = 0; u > i; i++)if (r = a[i], e >= r.left && r.right > e) {
                    d = i;
                    break
                }
                if (null !== c && null !== d)return s = this.grid.getCell(c, d), s.grid = this.grid, t.extend(s, o[c], a[d]), s
            }
            return null
        },
        computeBounds: function () {
            this.bounds = this.containerEl ? p(this.containerEl) : null
        },
        inBounds: function (t, e) {
            var n = this.bounds;
            return n ? t >= n.left && n.right > t && e >= n.top && n.bottom > e : !0
        }
    }), Je = ue.extend({
        coordMaps: null, constructor: function (t) {
            this.coordMaps = t
        }, build: function () {
            var t, e = this.coordMaps;
            for (t = 0; e.length > t; t++)e[t].build()
        }, getCell: function (t, e) {
            var n, i = this.coordMaps, r = null;
            for (n = 0; i.length > n && !r; n++)r = i[n].getCell(t, e);
            return r
        }, clear: function () {
            var t, e = this.coordMaps;
            for (t = 0; e.length > t; t++)e[t].clear()
        }
    }), tn = Le.DragListener = ue.extend({
        options: null,
        isListening: !1,
        isDragging: !1,
        originX: null,
        originY: null,
        mousemoveProxy: null,
        mouseupProxy: null,
        subjectEl: null,
        subjectHref: null,
        scrollEl: null,
        scrollBounds: null,
        scrollTopVel: null,
        scrollLeftVel: null,
        scrollIntervalId: null,
        scrollHandlerProxy: null,
        scrollSensitivity: 30,
        scrollSpeed: 200,
        scrollIntervalMs: 50,
        constructor: function (t) {
            t = t || {}, this.options = t, this.subjectEl = t.subjectEl
        },
        mousedown: function (t) {
            S(t) && (t.preventDefault(), this.startListening(t), this.options.distance || this.startDrag(t))
        },
        startListening: function (e) {
            var n;
            this.isListening || (e && this.options.scroll && (n = f(t(e.target)), n.is(window) || n.is(document) || (this.scrollEl = n, this.scrollHandlerProxy = q($(this, "scrollHandler"), 100), this.scrollEl.on("scroll", this.scrollHandlerProxy))), t(document).on("mousemove", this.mousemoveProxy = $(this, "mousemove")).on("mouseup", this.mouseupProxy = $(this, "mouseup")).on("selectstart", this.preventDefault), e ? (this.originX = e.pageX, this.originY = e.pageY) : (this.originX = 0, this.originY = 0), this.isListening = !0, this.listenStart(e))
        },
        listenStart: function (t) {
            this.trigger("listenStart", t)
        },
        mousemove: function (t) {
            var e, n, i = t.pageX - this.originX, r = t.pageY - this.originY;
            this.isDragging || (e = this.options.distance || 1, n = i * i + r * r, n >= e * e && this.startDrag(t)), this.isDragging && this.drag(i, r, t)
        },
        startDrag: function (t) {
            this.isListening || this.startListening(), this.isDragging || (this.isDragging = !0, this.dragStart(t))
        },
        dragStart: function (t) {
            var e = this.subjectEl;
            this.trigger("dragStart", t), (this.subjectHref = e ? e.attr("href") : null) && e.removeAttr("href")
        },
        drag: function (t, e, n) {
            this.trigger("drag", t, e, n), this.updateScroll(n)
        },
        mouseup: function (t) {
            this.stopListening(t)
        },
        stopDrag: function (t) {
            this.isDragging && (this.stopScrolling(), this.dragStop(t), this.isDragging = !1)
        },
        dragStop: function (t) {
            var e = this;
            this.trigger("dragStop", t), setTimeout(function () {
                e.subjectHref && e.subjectEl.attr("href", e.subjectHref)
            }, 0)
        },
        stopListening: function (e) {
            this.stopDrag(e), this.isListening && (this.scrollEl && (this.scrollEl.off("scroll", this.scrollHandlerProxy), this.scrollHandlerProxy = null), t(document).off("mousemove", this.mousemoveProxy).off("mouseup", this.mouseupProxy).off("selectstart", this.preventDefault), this.mousemoveProxy = null, this.mouseupProxy = null, this.isListening = !1, this.listenStop(e))
        },
        listenStop: function (t) {
            this.trigger("listenStop", t)
        },
        trigger: function (t) {
            this.options[t] && this.options[t].apply(this, Array.prototype.slice.call(arguments, 1))
        },
        preventDefault: function (t) {
            t.preventDefault()
        },
        computeScrollBounds: function () {
            var t = this.scrollEl;
            this.scrollBounds = t ? g(t) : null
        },
        updateScroll: function (t) {
            var e, n, i, r, s = this.scrollSensitivity, o = this.scrollBounds, l = 0, a = 0;
            o && (e = (s - (t.pageY - o.top)) / s, n = (s - (o.bottom - t.pageY)) / s, i = (s - (t.pageX - o.left)) / s, r = (s - (o.right - t.pageX)) / s, e >= 0 && 1 >= e ? l = -1 * e * this.scrollSpeed : n >= 0 && 1 >= n && (l = n * this.scrollSpeed), i >= 0 && 1 >= i ? a = -1 * i * this.scrollSpeed : r >= 0 && 1 >= r && (a = r * this.scrollSpeed)), this.setScrollVel(l, a)
        },
        setScrollVel: function (t, e) {
            this.scrollTopVel = t, this.scrollLeftVel = e, this.constrainScrollVel(), !this.scrollTopVel && !this.scrollLeftVel || this.scrollIntervalId || (this.scrollIntervalId = setInterval($(this, "scrollIntervalFunc"), this.scrollIntervalMs))
        },
        constrainScrollVel: function () {
            var t = this.scrollEl;
            0 > this.scrollTopVel ? 0 >= t.scrollTop() && (this.scrollTopVel = 0) : this.scrollTopVel > 0 && t.scrollTop() + t[0].clientHeight >= t[0].scrollHeight && (this.scrollTopVel = 0), 0 > this.scrollLeftVel ? 0 >= t.scrollLeft() && (this.scrollLeftVel = 0) : this.scrollLeftVel > 0 && t.scrollLeft() + t[0].clientWidth >= t[0].scrollWidth && (this.scrollLeftVel = 0)
        },
        scrollIntervalFunc: function () {
            var t = this.scrollEl, e = this.scrollIntervalMs / 1e3;
            this.scrollTopVel && t.scrollTop(t.scrollTop() + this.scrollTopVel * e), this.scrollLeftVel && t.scrollLeft(t.scrollLeft() + this.scrollLeftVel * e), this.constrainScrollVel(), this.scrollTopVel || this.scrollLeftVel || this.stopScrolling()
        },
        stopScrolling: function () {
            this.scrollIntervalId && (clearInterval(this.scrollIntervalId), this.scrollIntervalId = null, this.scrollStop())
        },
        scrollHandler: function () {
            this.scrollIntervalId || this.scrollStop()
        },
        scrollStop: function () {
        }
    }), en = tn.extend({
        coordMap: null, origCell: null, cell: null, coordAdjust: null, constructor: function (t, e) {
            tn.prototype.constructor.call(this, e), this.coordMap = t
        }, listenStart: function (t) {
            var e, n, i, r = this.subjectEl;
            tn.prototype.listenStart.apply(this, arguments), this.computeCoords(), t ? (n = {
                left: t.pageX,
                top: t.pageY
            }, i = n, r && (e = g(r), i = D(i, e)), this.origCell = this.getCell(i.left, i.top), r && this.options.subjectCenter && (this.origCell && (e = b(this.origCell, e) || e), i = C(e)), this.coordAdjust = T(i, n)) : (this.origCell = null, this.coordAdjust = null)
        }, computeCoords: function () {
            this.coordMap.build(), this.computeScrollBounds()
        }, dragStart: function (t) {
            var e;
            tn.prototype.dragStart.apply(this, arguments), e = this.getCell(t.pageX, t.pageY), e && this.cellOver(e)
        }, drag: function (t, e, n) {
            var i;
            tn.prototype.drag.apply(this, arguments), i = this.getCell(n.pageX, n.pageY), ce(i, this.cell) || (this.cell && this.cellOut(), i && this.cellOver(i))
        }, dragStop: function () {
            this.cellDone(), tn.prototype.dragStop.apply(this, arguments)
        }, cellOver: function (t) {
            this.cell = t, this.trigger("cellOver", t, ce(t, this.origCell), this.origCell)
        }, cellOut: function () {
            this.cell && (this.trigger("cellOut", this.cell), this.cellDone(), this.cell = null)
        }, cellDone: function () {
            this.cell && this.trigger("cellDone", this.cell)
        }, listenStop: function () {
            tn.prototype.listenStop.apply(this, arguments), this.origCell = this.cell = null, this.coordMap.clear()
        }, scrollStop: function () {
            tn.prototype.scrollStop.apply(this, arguments), this.computeCoords()
        }, getCell: function (t, e) {
            return this.coordAdjust && (t += this.coordAdjust.left, e += this.coordAdjust.top), this.coordMap.getCell(t, e)
        }
    }), nn = ue.extend({
        options: null,
        sourceEl: null,
        el: null,
        parentEl: null,
        top0: null,
        left0: null,
        mouseY0: null,
        mouseX0: null,
        topDelta: null,
        leftDelta: null,
        mousemoveProxy: null,
        isFollowing: !1,
        isHidden: !1,
        isAnimating: !1,
        constructor: function (e, n) {
            this.options = n = n || {}, this.sourceEl = e, this.parentEl = n.parentEl ? t(n.parentEl) : e.parent()
        },
        start: function (e) {
            this.isFollowing || (this.isFollowing = !0, this.mouseY0 = e.pageY, this.mouseX0 = e.pageX, this.topDelta = 0, this.leftDelta = 0, this.isHidden || this.updatePosition(), t(document).on("mousemove", this.mousemoveProxy = $(this, "mousemove")))
        },
        stop: function (e, n) {
            function i() {
                this.isAnimating = !1, r.destroyEl(), this.top0 = this.left0 = null, n && n()
            }

            var r = this, s = this.options.revertDuration;
            this.isFollowing && !this.isAnimating && (this.isFollowing = !1, t(document).off("mousemove", this.mousemoveProxy), e && s && !this.isHidden ? (this.isAnimating = !0, this.el.animate({
                top: this.top0,
                left: this.left0
            }, {duration: s, complete: i})) : i())
        },
        getEl: function () {
            var t = this.el;
            return t || (this.sourceEl.width(), t = this.el = this.sourceEl.clone().css({
                position: "absolute",
                visibility: "",
                display: this.isHidden ? "none" : "",
                margin: 0,
                right: "auto",
                bottom: "auto",
                width: this.sourceEl.width(),
                height: this.sourceEl.height(),
                opacity: this.options.opacity || "",
                zIndex: this.options.zIndex
            }).appendTo(this.parentEl)), t
        },
        destroyEl: function () {
            this.el && (this.el.remove(), this.el = null)
        },
        updatePosition: function () {
            var t, e;
            this.getEl(), null === this.top0 && (this.sourceEl.width(), t = this.sourceEl.offset(), e = this.el.offsetParent().offset(), this.top0 = t.top - e.top, this.left0 = t.left - e.left), this.el.css({
                top: this.top0 + this.topDelta,
                left: this.left0 + this.leftDelta
            })
        },
        mousemove: function (t) {
            this.topDelta = t.pageY - this.mouseY0, this.leftDelta = t.pageX - this.mouseX0, this.isHidden || this.updatePosition()
        },
        hide: function () {
            this.isHidden || (this.isHidden = !0, this.el && this.el.hide())
        },
        show: function () {
            this.isHidden && (this.isHidden = !1, this.updatePosition(), this.getEl().show())
        }
    }), rn = ue.extend({
        view: null, isRTL: null, cellHtml: "<td/>", constructor: function (t) {
            this.view = t, this.isRTL = t.opt("isRTL")
        }, rowHtml: function (t, e) {
            var n, i, r = this.getHtmlRenderer("cell", t), s = "";
            for (e = e || 0, n = 0; this.colCnt > n; n++)i = this.getCell(e, n), s += r(i);
            return s = this.bookendCells(s, t, e), "<tr>" + s + "</tr>"
        }, bookendCells: function (t, e, n) {
            var i = this.getHtmlRenderer("intro", e)(n || 0), r = this.getHtmlRenderer("outro", e)(n || 0), s = this.isRTL ? r : i, o = this.isRTL ? i : r;
            return "string" == typeof t ? s + t + o : t.prepend(s).append(o)
        }, getHtmlRenderer: function (t, e) {
            var n, i, r, s, o = this.view;
            return n = t + "Html", e && (i = e + Z(t) + "Html"), i && (s = o[i]) ? r = o : i && (s = this[i]) ? r = this : (s = o[n]) ? r = o : (s = this[n]) && (r = this), "function" == typeof s ? function () {
                return s.apply(r, arguments) || ""
            } : function () {
                return s || ""
            }
        }
    }), sn = Le.Grid = rn.extend({
        start: null,
        end: null,
        rowCnt: 0,
        colCnt: 0,
        rowData: null,
        colData: null,
        el: null,
        coordMap: null,
        elsByFill: null,
        externalDragStartProxy: null,
        colHeadFormat: null,
        eventTimeFormat: null,
        displayEventTime: null,
        displayEventEnd: null,
        cellDuration: null,
        largeUnit: null,
        constructor: function () {
            rn.apply(this, arguments), this.coordMap = new Qe(this), this.elsByFill = {}, this.externalDragStartProxy = $(this, "externalDragStart")
        },
        computeColHeadFormat: function () {
        },
        computeEventTimeFormat: function () {
            return this.view.opt("smallTimeFormat")
        },
        computeDisplayEventTime: function () {
            return !0
        },
        computeDisplayEventEnd: function () {
            return !0
        },
        setRange: function (t) {
            var e, n, i = this.view;
            this.start = t.start.clone(), this.end = t.end.clone(), this.rowData = [], this.colData = [], this.updateCells(), this.colHeadFormat = i.opt("columnFormat") || this.computeColHeadFormat(), this.eventTimeFormat = i.opt("eventTimeFormat") || i.opt("timeFormat") || this.computeEventTimeFormat(), e = i.opt("displayEventTime"), null == e && (e = this.computeDisplayEventTime()), n = i.opt("displayEventEnd"), null == n && (n = this.computeDisplayEventEnd()), this.displayEventTime = e, this.displayEventEnd = n
        },
        updateCells: function () {
        },
        rangeToSegs: function () {
        },
        diffDates: function (t, e) {
            return this.largeUnit ? k(t, e, this.largeUnit) : x(t, e)
        },
        getCell: function (e, n) {
            var i;
            return null == n && ("number" == typeof e ? (n = e % this.colCnt, e = Math.floor(e / this.colCnt)) : (n = e.col, e = e.row)), i = {
                row: e,
                col: n
            }, t.extend(i, this.getRowData(e), this.getColData(n)), t.extend(i, this.computeCellRange(i)), i
        },
        computeCellRange: function (t) {
            var e = this.computeCellDate(t);
            return {start: e, end: e.clone().add(this.cellDuration)}
        },
        computeCellDate: function () {
        },
        getRowData: function (t) {
            return this.rowData[t] || {}
        },
        getColData: function (t) {
            return this.colData[t] || {}
        },
        getRowEl: function () {
        },
        getColEl: function () {
        },
        getCellDayEl: function (t) {
            return this.getColEl(t.col) || this.getRowEl(t.row)
        },
        computeRowCoords: function () {
            var t, e, n, i = [];
            for (t = 0; this.rowCnt > t; t++)e = this.getRowEl(t), n = e.offset().top, i.push({
                top: n,
                bottom: n + e.outerHeight()
            });
            return i
        },
        computeColCoords: function () {
            var t, e, n, i = [];
            for (t = 0; this.colCnt > t; t++)e = this.getColEl(t), n = e.offset().left, i.push({
                left: n,
                right: n + e.outerWidth()
            });
            return i
        },
        setElement: function (e) {
            var n = this;
            this.el = e, e.on("mousedown", function (e) {
                t(e.target).is(".fc-event-container *, .fc-more") || t(e.target).closest(".fc-popover").length || n.dayMousedown(e)
            }), this.bindSegHandlers(), this.bindGlobalHandlers()
        },
        removeElement: function () {
            this.unbindGlobalHandlers(), this.el.remove()
        },
        renderSkeleton: function () {
        },
        renderDates: function () {
        },
        destroyDates: function () {
        },
        bindGlobalHandlers: function () {
            t(document).on("dragstart sortstart", this.externalDragStartProxy)
        },
        unbindGlobalHandlers: function () {
            t(document).off("dragstart sortstart", this.externalDragStartProxy)
        },
        dayMousedown: function (t) {
            var e, n, i = this, r = this.view, s = r.opt("selectable"), a = new en(this.coordMap, {
                scroll: r.opt("dragScroll"),
                dragStart: function () {
                    r.unselect()
                },
                cellOver: function (t, r, l) {
                    l && (e = r ? t : null, s && (n = i.computeSelection(l, t), n ? i.renderSelection(n) : o()))
                },
                cellOut: function () {
                    e = null, n = null, i.destroySelection(), l()
                },
                listenStop: function (t) {
                    e && r.trigger("dayClick", i.getCellDayEl(e), e.start, t), n && r.reportSelection(n, t), l()
                }
            });
            a.mousedown(t)
        },
        renderRangeHelper: function (t, e) {
            var n = this.fabricateHelperEvent(t, e);
            this.renderHelper(n, e)
        },
        fabricateHelperEvent: function (t, e) {
            var n = e ? _(e.event) : {};
            return n.start = t.start.clone(), n.end = t.end ? t.end.clone() : null, n.allDay = null, this.view.calendar.normalizeEventRange(n), n.className = (n.className || []).concat("fc-helper"), e || (n.editable = !1), n
        },
        renderHelper: function () {
        },
        destroyHelper: function () {
        },
        renderSelection: function (t) {
            this.renderHighlight(t)
        },
        destroySelection: function () {
            this.destroyHighlight()
        },
        computeSelection: function (t, e) {
            var n, i = [t.start, t.end, e.start, e.end];
            return i.sort(j), n = {
                start: i[0].clone(),
                end: i[3].clone()
            }, this.view.calendar.isSelectionRangeAllowed(n) ? n : null
        },
        renderHighlight: function (t) {
            this.renderFill("highlight", this.rangeToSegs(t))
        },
        destroyHighlight: function () {
            this.destroyFill("highlight")
        },
        highlightSegClasses: function () {
            return ["fc-highlight"]
        },
        renderFill: function () {
        },
        destroyFill: function (t) {
            var e = this.elsByFill[t];
            e && (e.remove(), delete this.elsByFill[t])
        },
        renderFillSegEls: function (e, n) {
            var i, r = this, s = this[e + "SegEl"], o = "", l = [];
            if (n.length) {
                for (i = 0; n.length > i; i++)o += this.fillSegHtml(e, n[i]);
                t(o).each(function (e, i) {
                    var o = n[e], a = t(i);
                    s && (a = s.call(r, o, a)), a && (a = t(a), a.is(r.fillSegTag) && (o.el = a, l.push(o)))
                })
            }
            return l
        },
        fillSegTag: "div",
        fillSegHtml: function (t, e) {
            var n = this[t + "SegClasses"], i = this[t + "SegCss"], r = n ? n.call(this, e) : [], s = W(i ? i.call(this, e) : {});
            return "<" + this.fillSegTag + (r.length ? ' class="' + r.join(" ") + '"' : "") + (s ? ' style="' + s + '"' : "") + " />"
        },
        headHtml: function () {
            return '<div class="fc-row ' + this.view.widgetHeaderClass + '">' + "<table>" + "<thead>" + this.rowHtml("head") + "</thead>" + "</table>" + "</div>"
        },
        headCellHtml: function (t) {
            var e = this.view, n = t.start;
            return '<th class="fc-day-header ' + e.widgetHeaderClass + " fc-" + Be[n.day()] + '">' + Y(n.format(this.colHeadFormat)) + "</th>"
        },
        bgCellHtml: function (t) {
            var e = this.view, n = t.start, i = this.getDayClasses(n);
            return i.unshift("fc-day", e.widgetContentClass), '<td class="' + i.join(" ") + '"' + ' data-date="' + n.format("YYYY-MM-DD") + '"' + "></td>"
        },
        getDayClasses: function (t) {
            var e = this.view, n = e.calendar.getNow().stripTime(), i = ["fc-" + Be[t.day()]];
            return 1 == e.intervalDuration.as("months") && t.month() != e.intervalStart.month() && i.push("fc-other-month"), t.isSame(n, "day") ? i.push("fc-today", e.highlightStateClass) : n > t ? i.push("fc-past") : i.push("fc-future"), i
        }
    });
    sn.mixin({
        mousedOverSeg: null,
        isDraggingSeg: !1,
        isResizingSeg: !1,
        isDraggingExternal: !1,
        segs: null,
        renderEvents: function (t) {
            var e, n, i = this.eventsToSegs(t), r = [], s = [];
            for (e = 0; i.length > e; e++)n = i[e], de(n.event) ? r.push(n) : s.push(n);
            r = this.renderBgSegs(r) || r, s = this.renderFgSegs(s) || s, this.segs = r.concat(s)
        },
        destroyEvents: function () {
            this.triggerSegMouseout(), this.destroyFgSegs(), this.destroyBgSegs(), this.segs = null
        },
        getEventSegs: function () {
            return this.segs || []
        },
        renderFgSegs: function () {
        },
        destroyFgSegs: function () {
        },
        renderFgSegEls: function (e, n) {
            var i, r = this.view, s = "", o = [];
            if (e.length) {
                for (i = 0; e.length > i; i++)s += this.fgSegHtml(e[i], n);
                t(s).each(function (n, i) {
                    var s = e[n], l = r.resolveEventEl(s.event, t(i));
                    l && (l.data("fc-seg", s), s.el = l, o.push(s))
                })
            }
            return o
        },
        fgSegHtml: function () {
        },
        renderBgSegs: function (t) {
            return this.renderFill("bgEvent", t)
        },
        destroyBgSegs: function () {
            this.destroyFill("bgEvent")
        },
        bgEventSegEl: function (t, e) {
            return this.view.resolveEventEl(t.event, e)
        },
        bgEventSegClasses: function (t) {
            var e = t.event, n = e.source || {};
            return ["fc-bgevent"].concat(e.className, n.className || [])
        },
        bgEventSegCss: function (t) {
            var e = this.view, n = t.event, i = n.source || {};
            return {"background-color": n.backgroundColor || n.color || i.backgroundColor || i.color || e.opt("eventBackgroundColor") || e.opt("eventColor")}
        },
        businessHoursSegClasses: function () {
            return ["fc-nonbusiness", "fc-bgevent"]
        },
        bindSegHandlers: function () {
            var e = this, n = this.view;
            t.each({
                mouseenter: function (t, n) {
                    e.triggerSegMouseover(t, n)
                }, mouseleave: function (t, n) {
                    e.triggerSegMouseout(t, n)
                }, click: function (t, e) {
                    return n.trigger("eventClick", this, t.event, e)
                }, mousedown: function (i, r) {
                    t(r.target).is(".fc-resizer") && n.isEventResizable(i.event) ? e.segResizeMousedown(i, r, t(r.target).is(".fc-start-resizer")) : n.isEventDraggable(i.event) && e.segDragMousedown(i, r)
                }
            }, function (n, i) {
                e.el.on(n, ".fc-event-container > *", function (n) {
                    var r = t(this).data("fc-seg");
                    return !r || e.isDraggingSeg || e.isResizingSeg ? void 0 : i.call(this, r, n)
                })
            })
        },
        triggerSegMouseover: function (t, e) {
            this.mousedOverSeg || (this.mousedOverSeg = t, this.view.trigger("eventMouseover", t.el[0], t.event, e))
        },
        triggerSegMouseout: function (t, e) {
            e = e || {}, this.mousedOverSeg && (t = t || this.mousedOverSeg, this.mousedOverSeg = null, this.view.trigger("eventMouseout", t.el[0], t.event, e))
        },
        segDragMousedown: function (t, e) {
            var n, i = this, r = this.view, s = r.calendar, a = t.el, u = t.event, c = new nn(t.el, {
                parentEl: r.el,
                opacity: r.opt("dragOpacity"),
                revertDuration: r.opt("dragRevertDuration"),
                zIndex: 2
            }), d = new en(r.coordMap, {
                distance: 5,
                scroll: r.opt("dragScroll"),
                subjectEl: a,
                subjectCenter: !0,
                listenStart: function (t) {
                    c.hide(), c.start(t)
                },
                dragStart: function (e) {
                    i.triggerSegMouseout(t, e), i.segDragStart(t, e), r.hideEvent(u)
                },
                cellOver: function (e, l, a) {
                    t.cell && (a = t.cell), n = i.computeEventDrop(a, e, u), n && !s.isEventRangeAllowed(n, u) && (o(), n = null), n && r.renderDrag(n, t) ? c.hide() : c.show(), l && (n = null)
                },
                cellOut: function () {
                    r.destroyDrag(), c.show(), n = null
                },
                cellDone: function () {
                    l()
                },
                dragStop: function (e) {
                    c.stop(!n, function () {
                        r.destroyDrag(), r.showEvent(u), i.segDragStop(t, e), n && r.reportEventDrop(u, n, this.largeUnit, a, e)
                    })
                },
                listenStop: function () {
                    c.stop()
                }
            });
            d.mousedown(e)
        },
        segDragStart: function (t, e) {
            this.isDraggingSeg = !0, this.view.trigger("eventDragStart", t.el[0], t.event, e, {})
        },
        segDragStop: function (t, e) {
            this.isDraggingSeg = !1, this.view.trigger("eventDragStop", t.el[0], t.event, e, {})
        },
        computeEventDrop: function (t, e, n) {
            var i, r, s = this.view.calendar, o = t.start, l = e.start;
            return o.hasTime() === l.hasTime() ? (i = this.diffDates(l, o), n.allDay && z(i) ? (r = {
                start: n.start.clone(),
                end: s.getEventEnd(n),
                allDay: !1
            }, s.normalizeEventRangeTimes(r)) : r = {
                start: n.start.clone(),
                end: n.end ? n.end.clone() : null,
                allDay: n.allDay
            }, r.start.add(i), r.end && r.end.add(i)) : r = {start: l.clone(), end: null, allDay: !l.hasTime()}, r
        },
        applyDragOpacity: function (t) {
            var e = this.view.opt("dragOpacity");
            null != e && t.each(function (t, n) {
                n.style.opacity = e
            })
        },
        externalDragStart: function (e, n) {
            var i, r, s = this.view;
            s.opt("droppable") && (i = t((n ? n.item : null) || e.target), r = s.opt("dropAccept"), (t.isFunction(r) ? r.call(i[0], i) : i.is(r)) && (this.isDraggingExternal || this.listenToExternalDrag(i, e, n)))
        },
        listenToExternalDrag: function (t, e, n) {
            var i, r, s = this, a = ve(t);
            i = new en(this.coordMap, {
                listenStart: function () {
                    s.isDraggingExternal = !0
                }, cellOver: function (t) {
                    r = s.computeExternalDrop(t, a), r ? s.renderDrag(r) : o()
                }, cellOut: function () {
                    r = null, s.destroyDrag(), l()
                }, dragStop: function () {
                    s.destroyDrag(), l(), r && s.view.reportExternalDrop(a, r, t, e, n)
                }, listenStop: function () {
                    s.isDraggingExternal = !1
                }
            }), i.startDrag(e)
        },
        computeExternalDrop: function (t, e) {
            var n = {start: t.start.clone(), end: null};
            return e.startTime && !n.start.hasTime() && n.start.time(e.startTime), e.duration && (n.end = n.start.clone().add(e.duration)), this.view.calendar.isExternalDropRangeAllowed(n, e.eventProps) ? n : null
        },
        renderDrag: function () {
        },
        destroyDrag: function () {
        },
        segResizeMousedown: function (t, e, n) {
            var i, r, s = this, a = this.view, u = a.calendar, c = t.el, d = t.event, h = u.getEventEnd(d);
            i = new en(this.coordMap, {
                distance: 5, scroll: a.opt("dragScroll"), subjectEl: c, dragStart: function (e) {
                    s.triggerSegMouseout(t, e), s.segResizeStart(t, e)
                }, cellOver: function (e, i, l) {
                    r = n ? s.computeEventStartResize(l, e, d) : s.computeEventEndResize(l, e, d), r && (u.isEventRangeAllowed(r, d) ? r.start.isSame(d.start) && r.end.isSame(h) && (r = null) : (o(), r = null)), r && (a.hideEvent(d), s.renderEventResize(r, t))
                }, cellOut: function () {
                    r = null
                }, cellDone: function () {
                    s.destroyEventResize(), a.showEvent(d), l()
                }, dragStop: function (e) {
                    s.segResizeStop(t, e), r && a.reportEventResize(d, r, this.largeUnit, c, e)
                }
            }), i.mousedown(e)
        },
        segResizeStart: function (t, e) {
            this.isResizingSeg = !0, this.view.trigger("eventResizeStart", t.el[0], t.event, e, {})
        },
        segResizeStop: function (t, e) {
            this.isResizingSeg = !1, this.view.trigger("eventResizeStop", t.el[0], t.event, e, {})
        },
        computeEventStartResize: function (t, e, n) {
            return this.computeEventResize("start", t, e, n)
        },
        computeEventEndResize: function (t, e, n) {
            return this.computeEventResize("end", t, e, n)
        },
        computeEventResize: function (t, e, n, i) {
            var r, s, o = this.view.calendar, l = this.diffDates(n[t], e[t]);
            return r = {
                start: i.start.clone(),
                end: o.getEventEnd(i),
                allDay: i.allDay
            }, r.allDay && z(l) && (r.allDay = !1, o.normalizeEventRangeTimes(r)), r[t].add(l), r.start.isBefore(r.end) || (s = i.allDay ? o.defaultAllDayEventDuration : o.defaultTimedEventDuration, this.cellDuration && s > this.cellDuration && (s = this.cellDuration), "start" == t ? r.start = r.end.clone().subtract(s) : r.end = r.start.clone().add(s)), r
        },
        renderEventResize: function () {
        },
        destroyEventResize: function () {
        },
        getEventTimeText: function (t, e, n) {
            return null == e && (e = this.eventTimeFormat), null == n && (n = this.displayEventEnd), this.displayEventTime && t.start.hasTime() ? n && t.end ? this.view.formatRange(t, e) : t.start.format(e) : ""
        },
        getSegClasses: function (t, e, n) {
            var i = t.event, r = ["fc-event", t.isStart ? "fc-start" : "fc-not-start", t.isEnd ? "fc-end" : "fc-not-end"].concat(i.className, i.source ? i.source.className : []);
            return e && r.push("fc-draggable"), n && r.push("fc-resizable"), r
        },
        getEventSkinCss: function (t) {
            var e = this.view, n = t.source || {}, i = t.color, r = n.color, s = e.opt("eventColor");
            return {
                "background-color": t.backgroundColor || i || n.backgroundColor || r || e.opt("eventBackgroundColor") || s,
                "border-color": t.borderColor || i || n.borderColor || r || e.opt("eventBorderColor") || s,
                color: t.textColor || n.textColor || e.opt("eventTextColor")
            }
        },
        eventsToSegs: function (t, e) {
            var n, i = this.eventsToRanges(t), r = [];
            for (n = 0; i.length > n; n++)r.push.apply(r, this.eventRangeToSegs(i[n], e));
            return r
        },
        eventsToRanges: function (e) {
            var n = this, i = ge(e), r = [];
            return t.each(i, function (t, e) {
                e.length && r.push.apply(r, he(e[0]) ? n.eventsToInverseRanges(e) : n.eventsToNormalRanges(e))
            }), r
        },
        eventsToNormalRanges: function (t) {
            var e, n, i, r, s = this.view.calendar, o = [];
            for (e = 0; t.length > e; e++)n = t[e], i = n.start.clone().stripZone(), r = s.getEventEnd(n).stripZone(), o.push({
                event: n,
                start: i,
                end: r,
                eventStartMS: +i,
                eventDurationMS: r - i
            });
            return o
        },
        eventsToInverseRanges: function (t) {
            var e, n, i = this.view, r = i.start.clone().stripZone(), s = i.end.clone().stripZone(), o = this.eventsToNormalRanges(t), l = [], a = t[0], u = r;
            for (o.sort(pe), e = 0; o.length > e; e++)n = o[e], n.start > u && l.push({
                event: a,
                start: u,
                end: n.start
            }), u = n.end;
            return s > u && l.push({event: a, start: u, end: s}), l
        },
        eventRangeToSegs: function (t, e) {
            var n, i, r;
            for (n = e ? e(t) : this.rangeToSegs(t), i = 0; n.length > i; i++)r = n[i], r.event = t.event, r.eventStartMS = t.eventStartMS, r.eventDurationMS = t.eventDurationMS;
            return n
        }
    }), Le.compareSegs = me, Le.dataAttrPrefix = "";
    var on = sn.extend({
        numbersVisible: !1,
        bottomCoordPadding: 0,
        breakOnWeeks: null,
        cellDates: null,
        dayToCellOffsets: null,
        rowEls: null,
        dayEls: null,
        helperEls: null,
        constructor: function () {
            sn.apply(this, arguments), this.cellDuration = e.duration(1, "day")
        },
        renderDates: function (t) {
            var e, n, i, r = this.view, s = this.rowCnt, o = this.colCnt, l = s * o, a = "";
            for (e = 0; s > e; e++)a += this.dayRowHtml(e, t);
            for (this.el.html(a), this.rowEls = this.el.find(".fc-row"), this.dayEls = this.el.find(".fc-day"), n = 0; l > n; n++)i = this.getCell(n), r.trigger("dayRender", null, i.start, this.dayEls.eq(n))
        },
        destroyDates: function () {
            this.destroySegPopover()
        },
        renderBusinessHours: function () {
            var t = this.view.calendar.getBusinessHoursEvents(!0), e = this.eventsToSegs(t);
            this.renderFill("businessHours", e, "bgevent")
        },
        dayRowHtml: function (t, e) {
            var n = this.view, i = ["fc-row", "fc-week", n.widgetContentClass];
            return e && i.push("fc-rigid"), '<div class="' + i.join(" ") + '">' + '<div class="fc-bg">' + "<table>" + this.rowHtml("day", t) + "</table>" + "</div>" + '<div class="fc-content-skeleton">' + "<table>" + (this.numbersVisible ? "<thead>" + this.rowHtml("number", t) + "</thead>" : "") + "</table>" + "</div>" + "</div>"
        },
        dayCellHtml: function (t) {
            return this.bgCellHtml(t)
        },
        computeColHeadFormat: function () {
            return this.rowCnt > 1 ? "ddd" : this.colCnt > 1 ? this.view.opt("dayOfMonthFormat") : "dddd"
        },
        computeEventTimeFormat: function () {
            return this.view.opt("extraSmallTimeFormat")
        },
        computeDisplayEventEnd: function () {
            return 1 == this.colCnt
        },
        updateCells: function () {
            var t, e, n, i;
            if (this.updateCellDates(), t = this.cellDates, this.breakOnWeeks) {
                for (e = t[0].day(), i = 1; t.length > i && t[i].day() != e; i++);
                n = Math.ceil(t.length / i)
            } else n = 1, i = t.length;
            this.rowCnt = n, this.colCnt = i
        },
        updateCellDates: function () {
            for (var t = this.view, e = this.start.clone(), n = [], i = -1, r = []; e.isBefore(this.end);)t.isHiddenDay(e) ? r.push(i + .5) : (i++, r.push(i), n.push(e.clone())), e.add(1, "days");
            this.cellDates = n, this.dayToCellOffsets = r
        },
        computeCellDate: function (t) {
            var e = this.colCnt, n = t.row * e + (this.isRTL ? e - t.col - 1 : t.col);
            return this.cellDates[n].clone()
        },
        getRowEl: function (t) {
            return this.rowEls.eq(t)
        },
        getColEl: function (t) {
            return this.dayEls.eq(t)
        },
        getCellDayEl: function (t) {
            return this.dayEls.eq(t.row * this.colCnt + t.col)
        },
        computeRowCoords: function () {
            var t = sn.prototype.computeRowCoords.call(this);
            return t[t.length - 1].bottom += this.bottomCoordPadding, t
        },
        rangeToSegs: function (t) {
            var e, n, i, r, s, o, l, a, u, c, d = this.isRTL, h = this.rowCnt, f = this.colCnt, g = [];
            for (t = this.view.computeDayRange(t), e = this.dateToCellOffset(t.start), n = this.dateToCellOffset(t.end.subtract(1, "days")), i = 0; h > i; i++)r = i * f, s = r + f - 1, a = Math.max(r, e), u = Math.min(s, n), a = Math.ceil(a), u = Math.floor(u), u >= a && (o = a === e, l = u === n, a -= r, u -= r, c = {
                row: i,
                isStart: o,
                isEnd: l
            }, d ? (c.leftCol = f - u - 1, c.rightCol = f - a - 1) : (c.leftCol = a, c.rightCol = u), g.push(c));
            return g
        },
        dateToCellOffset: function (t) {
            var e = this.dayToCellOffsets, n = t.diff(this.start, "days");
            return 0 > n ? e[0] - 1 : n >= e.length ? e[e.length - 1] + 1 : e[n]
        },
        renderDrag: function (t, e) {
            return this.renderHighlight(this.view.calendar.ensureVisibleEventRange(t)), e && !e.el.closest(this.el).length ? (this.renderRangeHelper(t, e), this.applyDragOpacity(this.helperEls), !0) : void 0
        },
        destroyDrag: function () {
            this.destroyHighlight(), this.destroyHelper()
        },
        renderEventResize: function (t, e) {
            this.renderHighlight(t), this.renderRangeHelper(t, e)
        },
        destroyEventResize: function () {
            this.destroyHighlight(), this.destroyHelper()
        },
        renderHelper: function (e, n) {
            var i, r = [], s = this.eventsToSegs([e]);
            s = this.renderFgSegEls(s), i = this.renderSegRows(s), this.rowEls.each(function (e, s) {
                var o, l = t(s), a = t('<div class="fc-helper-skeleton"><table/></div>');
                o = n && n.row === e ? n.el.position().top : l.find(".fc-content-skeleton tbody").position().top, a.css("top", o).find("table").append(i[e].tbodyEl), l.append(a), r.push(a[0])
            }), this.helperEls = t(r)
        },
        destroyHelper: function () {
            this.helperEls && (this.helperEls.remove(), this.helperEls = null)
        },
        fillSegTag: "td",
        renderFill: function (e, n, i) {
            var r, s, o, l = [];
            for (n = this.renderFillSegEls(e, n), r = 0; n.length > r; r++)s = n[r], o = this.renderFillRow(e, s, i), this.rowEls.eq(s.row).append(o), l.push(o[0]);
            return this.elsByFill[e] = t(l), n
        },
        renderFillRow: function (e, n, i) {
            var r, s, o = this.colCnt, l = n.leftCol, a = n.rightCol + 1;
            return i = i || e.toLowerCase(), r = t('<div class="fc-' + i + '-skeleton">' + "<table><tr/></table>" + "</div>"), s = r.find("tr"), l > 0 && s.append('<td colspan="' + l + '"/>'), s.append(n.el.attr("colspan", a - l)), o > a && s.append('<td colspan="' + (o - a) + '"/>'), this.bookendCells(s, e), r
        }
    });
    on.mixin({
        rowStructs: null, destroyEvents: function () {
            this.destroySegPopover(), sn.prototype.destroyEvents.apply(this, arguments)
        }, getEventSegs: function () {
            return sn.prototype.getEventSegs.call(this).concat(this.popoverSegs || [])
        }, renderBgSegs: function (e) {
            var n = t.grep(e, function (t) {
                return t.event.allDay
            });
            return sn.prototype.renderBgSegs.call(this, n)
        }, renderFgSegs: function (e) {
            var n;
            return e = this.renderFgSegEls(e), n = this.rowStructs = this.renderSegRows(e), this.rowEls.each(function (e, i) {
                t(i).find(".fc-content-skeleton > table").append(n[e].tbodyEl)
            }), e
        }, destroyFgSegs: function () {
            for (var t, e = this.rowStructs || []; t = e.pop();)t.tbodyEl.remove();
            this.rowStructs = null
        }, renderSegRows: function (t) {
            var e, n, i = [];
            for (e = this.groupSegRows(t), n = 0; e.length > n; n++)i.push(this.renderSegRow(n, e[n]));
            return i
        }, fgSegHtml: function (t, e) {
            var n, i, r = this.view, s = t.event, o = r.isEventDraggable(s), l = !e && s.allDay && t.isStart && r.isEventResizableFromStart(s), a = !e && s.allDay && t.isEnd && r.isEventResizableFromEnd(s), u = this.getSegClasses(t, o, l || a), c = W(this.getEventSkinCss(s)), d = "";
            return u.unshift("fc-day-grid-event", "fc-h-event"), t.isStart && (n = this.getEventTimeText(s), n && (d = '<span class="fc-time">' + Y(n) + "</span>")), i = '<span class="fc-title">' + (Y(s.title || "") || "&nbsp;") + "</span>", '<a class="' + u.join(" ") + '"' + (s.url ? ' href="' + Y(s.url) + '"' : "") + (c ? ' style="' + c + '"' : "") + ">" + '<div class="fc-content">' + (this.isRTL ? i + " " + d : d + " " + i) + "</div>" + (l ? '<div class="fc-resizer fc-start-resizer" />' : "") + (a ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        }, renderSegRow: function (e, n) {
            function i(e) {
                for (; e > o;)c = (v[r - 1] || [])[o], c ? c.attr("rowspan", parseInt(c.attr("rowspan") || 1, 10) + 1) : (c = t("<td/>"), l.append(c)), m[r][o] = c, v[r][o] = c, o++
            }

            var r, s, o, l, a, u, c, d = this.colCnt, h = this.buildSegLevels(n), f = Math.max(1, h.length), g = t("<tbody/>"), p = [], m = [], v = [];
            for (r = 0; f > r; r++) {
                if (s = h[r], o = 0, l = t("<tr/>"), p.push([]), m.push([]), v.push([]), s)for (a = 0; s.length > a; a++) {
                    for (u = s[a], i(u.leftCol), c = t('<td class="fc-event-container"/>').append(u.el), u.leftCol != u.rightCol ? c.attr("colspan", u.rightCol - u.leftCol + 1) : v[r][o] = c; u.rightCol >= o;)m[r][o] = c, p[r][o] = u, o++;
                    l.append(c)
                }
                i(d), this.bookendCells(l, "eventSkeleton"), g.append(l)
            }
            return {row: e, tbodyEl: g, cellMatrix: m, segMatrix: p, segLevels: h, segs: n}
        }, buildSegLevels: function (t) {
            var e, n, i, r = [];
            for (t.sort(me), e = 0; t.length > e; e++) {
                for (n = t[e], i = 0; r.length > i && ye(n, r[i]); i++);
                n.level = i, (r[i] || (r[i] = [])).push(n)
            }
            for (i = 0; r.length > i; i++)r[i].sort(we);
            return r
        }, groupSegRows: function (t) {
            var e, n = [];
            for (e = 0; this.rowCnt > e; e++)n.push([]);
            for (e = 0; t.length > e; e++)n[t[e].row].push(t[e]);
            return n
        }
    }), on.mixin({
        segPopover: null, popoverSegs: null, destroySegPopover: function () {
            this.segPopover && this.segPopover.hide()
        }, limitRows: function (t) {
            var e, n, i = this.rowStructs || [];
            for (e = 0; i.length > e; e++)this.unlimitRow(e), n = t ? "number" == typeof t ? t : this.computeRowLevelLimit(e) : !1, n !== !1 && this.limitRow(e, n)
        }, computeRowLevelLimit: function (e) {
            function n(e, n) {
                s = Math.max(s, t(n).outerHeight())
            }

            var i, r, s, o = this.rowEls.eq(e), l = o.height(), a = this.rowStructs[e].tbodyEl.children();
            for (i = 0; a.length > i; i++)if (r = a.eq(i).removeClass("fc-limited"), s = 0, r.find("> td > :first-child").each(n), r.position().top + s > l)return i;
            return !1
        }, limitRow: function (e, n) {
            function i(i) {
                for (; i > D;)r = E.getCell(e, D), c = E.getCellSegs(r, n), c.length && (f = o[n - 1][D], w = E.renderMoreLink(r, c), y = t("<div/>").append(w), f.append(y), b.push(y[0])), D++
            }

            var r, s, o, l, a, u, c, d, h, f, g, p, m, v, y, w, E = this, S = this.rowStructs[e], b = [], D = 0;
            if (n && S.segLevels.length > n) {
                for (s = S.segLevels[n - 1], o = S.cellMatrix, l = S.tbodyEl.children().slice(n).addClass("fc-limited").get(), a = 0; s.length > a; a++) {
                    for (u = s[a], i(u.leftCol), h = [], d = 0; u.rightCol >= D;)r = this.getCell(e, D), c = this.getCellSegs(r, n), h.push(c), d += c.length, D++;
                    if (d) {
                        for (f = o[n - 1][u.leftCol], g = f.attr("rowspan") || 1, p = [], m = 0; h.length > m; m++)v = t('<td class="fc-more-cell"/>').attr("rowspan", g), c = h[m], r = this.getCell(e, u.leftCol + m), w = this.renderMoreLink(r, [u].concat(c)), y = t("<div/>").append(w), v.append(y), p.push(v[0]), b.push(v[0]);
                        f.addClass("fc-limited").after(t(p)), l.push(f[0])
                    }
                }
                i(this.colCnt), S.moreEls = t(b), S.limitedEls = t(l)
            }
        }, unlimitRow: function (t) {
            var e = this.rowStructs[t];
            e.moreEls && (e.moreEls.remove(), e.moreEls = null), e.limitedEls && (e.limitedEls.removeClass("fc-limited"), e.limitedEls = null)
        }, renderMoreLink: function (e, n) {
            var i = this, r = this.view;
            return t('<a class="fc-more"/>').text(this.getMoreLinkText(n.length)).on("click", function (s) {
                var o = r.opt("eventLimitClick"), l = e.start, a = t(this), u = i.getCellDayEl(e), c = i.getCellSegs(e), d = i.resliceDaySegs(c, l), h = i.resliceDaySegs(n, l);
                "function" == typeof o && (o = r.trigger("eventLimitClick", null, {
                    date: l,
                    dayEl: u,
                    moreEl: a,
                    segs: d,
                    hiddenSegs: h
                }, s)), "popover" === o ? i.showSegPopover(e, a, d) : "string" == typeof o && r.calendar.zoomTo(l, o)
            })
        }, showSegPopover: function (t, e, n) {
            var i, r, s = this, o = this.view, l = e.parent();
            i = 1 == this.rowCnt ? o.el : this.rowEls.eq(t.row), r = {
                className: "fc-more-popover",
                content: this.renderSegPopoverContent(t, n),
                parentEl: this.el,
                top: i.offset().top,
                autoHide: !0,
                viewportConstrain: o.opt("popoverViewportConstrain"),
                hide: function () {
                    s.segPopover.destroy(), s.segPopover = null, s.popoverSegs = null
                }
            }, this.isRTL ? r.right = l.offset().left + l.outerWidth() + 1 : r.left = l.offset().left - 1, this.segPopover = new Ke(r), this.segPopover.show()
        }, renderSegPopoverContent: function (e, n) {
            var i, r = this.view, s = r.opt("theme"), o = e.start.format(r.opt("dayPopoverFormat")), l = t('<div class="fc-header ' + r.widgetHeaderClass + '">' + '<span class="fc-close ' + (s ? "ui-icon ui-icon-closethick" : "fc-icon fc-icon-x") + '"></span>' + '<span class="fc-title">' + Y(o) + "</span>" + '<div class="fc-clear"/>' + "</div>" + '<div class="fc-body ' + r.widgetContentClass + '">' + '<div class="fc-event-container"></div>' + "</div>"), a = l.find(".fc-event-container");
            for (n = this.renderFgSegEls(n, !0), this.popoverSegs = n, i = 0; n.length > i; i++)n[i].cell = e, a.append(n[i].el);
            return l
        }, resliceDaySegs: function (e, n) {
            var i = t.map(e, function (t) {
                return t.event
            }), r = n.clone().stripTime(), s = r.clone().add(1, "days"), o = {start: r, end: s};
            return e = this.eventsToSegs(i, function (t) {
                var e = H(t, o);
                return e ? [e] : []
            }), e.sort(me), e
        }, getMoreLinkText: function (t) {
            var e = this.view.opt("eventLimitText");
            return "function" == typeof e ? e(t) : "+" + t + " " + e
        }, getCellSegs: function (t, e) {
            for (var n, i = this.rowStructs[t.row].segMatrix, r = e || 0, s = []; i.length > r;)n = i[r][t.col], n && s.push(n), r++;
            return s
        }
    });
    var ln = sn.extend({
        slotDuration: null,
        snapDuration: null,
        minTime: null,
        maxTime: null,
        axisFormat: null,
        dayEls: null,
        slatEls: null,
        slatTops: null,
        helperEl: null,
        businessHourSegs: null,
        constructor: function () {
            sn.apply(this, arguments), this.processOptions()
        },
        renderDates: function () {
            this.el.html(this.renderHtml()), this.dayEls = this.el.find(".fc-day"), this.slatEls = this.el.find(".fc-slats tr")
        },
        renderBusinessHours: function () {
            var t = this.view.calendar.getBusinessHoursEvents();
            this.businessHourSegs = this.renderFill("businessHours", this.eventsToSegs(t), "bgevent")
        },
        renderHtml: function () {
            return '<div class="fc-bg"><table>' + this.rowHtml("slotBg") + "</table>" + "</div>" + '<div class="fc-slats">' + "<table>" + this.slatRowHtml() + "</table>" + "</div>"
        },
        slotBgCellHtml: function (t) {
            return this.bgCellHtml(t)
        },
        slatRowHtml: function () {
            for (var t, n, i, r = this.view, s = this.isRTL, o = "", l = 0 === this.slotDuration.asMinutes() % 15, a = e.duration(+this.minTime); this.maxTime > a;)t = this.start.clone().time(a), n = t.minutes(), i = '<td class="fc-axis fc-time ' + r.widgetContentClass + '" ' + r.axisStyleAttr() + ">" + (l && n ? "" : "<span>" + Y(t.format(this.axisFormat)) + "</span>") + "</td>", o += "<tr " + (n ? 'class="fc-minor"' : "") + ">" + (s ? "" : i) + '<td class="' + r.widgetContentClass + '"/>' + (s ? i : "") + "</tr>", a.add(this.slotDuration);
            return o
        },
        processOptions: function () {
            var t = this.view, n = t.opt("slotDuration"), i = t.opt("snapDuration");
            n = e.duration(n), i = i ? e.duration(i) : n, this.slotDuration = n, this.snapDuration = i, this.cellDuration = i, this.minTime = e.duration(t.opt("minTime")), this.maxTime = e.duration(t.opt("maxTime")), this.axisFormat = t.opt("axisFormat") || t.opt("smallTimeFormat")
        },
        computeColHeadFormat: function () {
            return this.colCnt > 1 ? this.view.opt("dayOfMonthFormat") : "dddd"
        },
        computeEventTimeFormat: function () {
            return this.view.opt("noMeridiemTimeFormat")
        },
        computeDisplayEventEnd: function () {
            return !0
        },
        updateCells: function () {
            var t, e = this.view, n = [];
            for (t = this.start.clone(); t.isBefore(this.end);)n.push({day: t.clone()}), t.add(1, "day"), t = e.skipHiddenDays(t);
            this.isRTL && n.reverse(), this.colData = n, this.colCnt = n.length, this.rowCnt = Math.ceil((this.maxTime - this.minTime) / this.snapDuration)
        },
        computeCellDate: function (t) {
            var e = this.computeSnapTime(t.row);
            return this.view.calendar.rezoneDate(t.day).time(e)
        },
        getColEl: function (t) {
            return this.dayEls.eq(t)
        },
        computeSnapTime: function (t) {
            return e.duration(this.minTime + this.snapDuration * t)
        },
        rangeToSegs: function (t) {
            var e, n, i, r, s = this.colCnt, o = [];
            for (t = {
                start: t.start.clone().stripZone(),
                end: t.end.clone().stripZone()
            }, n = 0; s > n; n++)i = this.colData[n].day, r = {
                start: i.clone().time(this.minTime),
                end: i.clone().time(this.maxTime)
            }, e = H(t, r), e && (e.col = n, o.push(e));
            return o
        },
        updateSize: function (t) {
            this.computeSlatTops(), t && this.updateSegVerticals()
        },
        computeRowCoords: function () {
            var t, e, n = this.el.offset().top, i = [];
            for (t = 0; this.rowCnt > t; t++)e = {top: n + this.computeTimeTop(this.computeSnapTime(t))}, t > 0 && (i[t - 1].bottom = e.top), i.push(e);
            return e.bottom = e.top + this.computeTimeTop(this.computeSnapTime(t)), i
        },
        computeDateTop: function (t, n) {
            return this.computeTimeTop(e.duration(t.clone().stripZone() - n.clone().stripTime()))
        },
        computeTimeTop: function (t) {
            var e, n, i, r, s = (t - this.minTime) / this.slotDuration;
            return s = Math.max(0, s), s = Math.min(this.slatEls.length, s), e = Math.floor(s), n = s - e, i = this.slatTops[e], n ? (r = this.slatTops[e + 1], i + (r - i) * n) : i
        },
        computeSlatTops: function () {
            var e, n = [];
            this.slatEls.each(function (i, r) {
                e = t(r).position().top, n.push(e)
            }), n.push(e + this.slatEls.last().outerHeight()), this.slatTops = n
        },
        renderDrag: function (t, e) {
            return e ? (this.renderRangeHelper(t, e), this.applyDragOpacity(this.helperEl), !0) : (this.renderHighlight(this.view.calendar.ensureVisibleEventRange(t)), void 0)
        },
        destroyDrag: function () {
            this.destroyHelper(), this.destroyHighlight()
        },
        renderEventResize: function (t, e) {
            this.renderRangeHelper(t, e)
        },
        destroyEventResize: function () {
            this.destroyHelper()
        },
        renderHelper: function (e, n) {
            var i, r, s, o, l = this.eventsToSegs([e]);
            for (l = this.renderFgSegEls(l), i = this.renderSegTable(l), r = 0; l.length > r; r++)s = l[r], n && n.col === s.col && (o = n.el, s.el.css({
                left: o.css("left"),
                right: o.css("right"),
                "margin-left": o.css("margin-left"),
                "margin-right": o.css("margin-right")
            }));
            this.helperEl = t('<div class="fc-helper-skeleton"/>').append(i).appendTo(this.el)
        },
        destroyHelper: function () {
            this.helperEl && (this.helperEl.remove(), this.helperEl = null)
        },
        renderSelection: function (t) {
            this.view.opt("selectHelper") ? this.renderRangeHelper(t) : this.renderHighlight(t)
        },
        destroySelection: function () {
            this.destroyHelper(), this.destroyHighlight()
        },
        renderFill: function (e, n, i) {
            var r, s, o, l, a, u, c, d, h, f;
            if (n.length) {
                for (n = this.renderFillSegEls(e, n), r = this.groupSegCols(n), i = i || e.toLowerCase(), s = t('<div class="fc-' + i + '-skeleton">' + "<table><tr/></table>" + "</div>"), o = s.find("tr"), l = 0; r.length > l; l++)if (a = r[l], u = t("<td/>").appendTo(o), a.length)for (c = t('<div class="fc-' + i + '-container"/>').appendTo(u), d = this.colData[l].day, h = 0; a.length > h; h++)f = a[h], c.append(f.el.css({
                    top: this.computeDateTop(f.start, d),
                    bottom: -this.computeDateTop(f.end, d)
                }));
                this.bookendCells(o, e), this.el.append(s), this.elsByFill[e] = s
            }
            return n
        }
    });
    ln.mixin({
        eventSkeletonEl: null, renderFgSegs: function (e) {
            return e = this.renderFgSegEls(e), this.el.append(this.eventSkeletonEl = t('<div class="fc-content-skeleton"/>').append(this.renderSegTable(e))), e
        }, destroyFgSegs: function () {
            this.eventSkeletonEl && (this.eventSkeletonEl.remove(), this.eventSkeletonEl = null)
        }, renderSegTable: function (e) {
            var n, i, r, s, o, l, a = t("<table><tr/></table>"), u = a.find("tr");
            for (n = this.groupSegCols(e), this.computeSegVerticals(e), s = 0; n.length > s; s++) {
                for (o = n[s], Ee(o), l = t('<div class="fc-event-container"/>'), i = 0; o.length > i; i++)r = o[i], r.el.css(this.generateSegPositionCss(r)), 30 > r.bottom - r.top && r.el.addClass("fc-short"), l.append(r.el);
                u.append(t("<td/>").append(l))
            }
            return this.bookendCells(u, "eventSkeleton"), a
        }, updateSegVerticals: function () {
            var t, e = (this.segs || []).concat(this.businessHourSegs || []);
            for (this.computeSegVerticals(e), t = 0; e.length > t; t++)e[t].el.css(this.generateSegVerticalCss(e[t]))
        }, computeSegVerticals: function (t) {
            var e, n;
            for (e = 0; t.length > e; e++)n = t[e], n.top = this.computeDateTop(n.start, n.start), n.bottom = this.computeDateTop(n.end, n.start)
        }, fgSegHtml: function (t, e) {
            var n, i, r, s = this.view, o = t.event, l = s.isEventDraggable(o), a = !e && t.isStart && s.isEventResizableFromStart(o), u = !e && t.isEnd && s.isEventResizableFromEnd(o), c = this.getSegClasses(t, l, a || u), d = W(this.getEventSkinCss(o));
            return c.unshift("fc-time-grid-event", "fc-v-event"), s.isMultiDayEvent(o) ? (t.isStart || t.isEnd) && (n = this.getEventTimeText(t), i = this.getEventTimeText(t, "LT"), r = this.getEventTimeText(t, null, !1)) : (n = this.getEventTimeText(o), i = this.getEventTimeText(o, "LT"), r = this.getEventTimeText(o, null, !1)), '<a class="' + c.join(" ") + '"' + (o.url ? ' href="' + Y(o.url) + '"' : "") + (d ? ' style="' + d + '"' : "") + ">" + '<div class="fc-content">' + (n ? '<div class="fc-time" data-start="' + Y(r) + '"' + ' data-full="' + Y(i) + '"' + ">" + "<span>" + Y(n) + "</span>" + "</div>" : "") + (o.title ? '<div class="fc-title">' + Y(o.title) + "</div>" : "") + "</div>" + '<div class="fc-bg"/>' + (u ? '<div class="fc-resizer fc-end-resizer" />' : "") + "</a>"
        }, generateSegPositionCss: function (t) {
            var e, n, i = this.view.opt("slotEventOverlap"), r = t.backwardCoord, s = t.forwardCoord, o = this.generateSegVerticalCss(t);
            return i && (s = Math.min(1, r + 2 * (s - r))), this.isRTL ? (e = 1 - s, n = r) : (e = r, n = 1 - s), o.zIndex = t.level + 1, o.left = 100 * e + "%", o.right = 100 * n + "%", i && t.forwardPressure && (o[this.isRTL ? "marginLeft" : "marginRight"] = 20), o
        }, generateSegVerticalCss: function (t) {
            return {top: t.top, bottom: -t.bottom}
        }, groupSegCols: function (t) {
            var e, n = [];
            for (e = 0; this.colCnt > e; e++)n.push([]);
            for (e = 0; t.length > e; e++)n[t[e].col].push(t[e]);
            return n
        }
    });
    var an = Le.View = ue.extend({
        type: null,
        name: null,
        title: null,
        calendar: null,
        options: null,
        coordMap: null,
        el: null,
        isDisplayed: !1,
        isSkeletonRendered: !1,
        isEventsRendered: !1,
        start: null,
        end: null,
        intervalStart: null,
        intervalEnd: null,
        intervalDuration: null,
        intervalUnit: null,
        isSelected: !1,
        scrollerEl: null,
        scrollTop: null,
        widgetHeaderClass: null,
        widgetContentClass: null,
        highlightStateClass: null,
        nextDayThreshold: null,
        isHiddenDayHash: null,
        documentMousedownProxy: null,
        constructor: function (t, n, i, r) {
            this.calendar = t, this.type = this.name = n, this.options = i, this.intervalDuration = r || e.duration(1, "day"), this.nextDayThreshold = e.duration(this.opt("nextDayThreshold")), this.initThemingProps(), this.initHiddenDays(), this.documentMousedownProxy = $(this, "documentMousedown"), this.initialize()
        },
        initialize: function () {
        },
        opt: function (t) {
            return this.options[t]
        },
        trigger: function (t, e) {
            var n = this.calendar;
            return n.trigger.apply(n, [t, e || this].concat(Array.prototype.slice.call(arguments, 2), [this]))
        },
        setDate: function (t) {
            this.setRange(this.computeRange(t))
        },
        setRange: function (e) {
            t.extend(this, e), this.updateTitle()
        },
        computeRange: function (t) {
            var e, n, i = M(this.intervalDuration), r = t.clone().startOf(i), s = r.clone().add(this.intervalDuration);
            return /year|month|week|day/.test(i) ? (r.stripTime(), s.stripTime()) : (r.hasTime() || (r = this.calendar.rezoneDate(r)), s.hasTime() || (s = this.calendar.rezoneDate(s))), e = r.clone(), e = this.skipHiddenDays(e), n = s.clone(), n = this.skipHiddenDays(n, -1, !0), {
                intervalUnit: i,
                intervalStart: r,
                intervalEnd: s,
                start: e,
                end: n
            }
        },
        computePrevDate: function (t) {
            return this.massageCurrentDate(t.clone().startOf(this.intervalUnit).subtract(this.intervalDuration), -1)
        },
        computeNextDate: function (t) {
            return this.massageCurrentDate(t.clone().startOf(this.intervalUnit).add(this.intervalDuration))
        },
        massageCurrentDate: function (t, e) {
            return 1 >= this.intervalDuration.as("days") && this.isHiddenDay(t) && (t = this.skipHiddenDays(t, e), t.startOf("day")), t
        },
        updateTitle: function () {
            this.title = this.computeTitle()
        },
        computeTitle: function () {
            return this.formatRange({
                start: this.intervalStart,
                end: this.intervalEnd
            }, this.opt("titleFormat") || this.computeTitleFormat(), this.opt("titleRangeSeparator"))
        },
        computeTitleFormat: function () {
            return "year" == this.intervalUnit ? "YYYY" : "month" == this.intervalUnit ? this.opt("monthYearFormat") : this.intervalDuration.as("days") > 1 ? "ll" : "LL"
        },
        formatRange: function (t, e, n) {
            var i = t.end;
            return i.hasTime() || (i = i.clone().subtract(1)), re(t.start, i, e, n, this.opt("isRTL"))
        },
        setElement: function (t) {
            this.el = t, this.bindGlobalHandlers()
        },
        removeElement: function () {
            this.clear(), this.isSkeletonRendered && (this.destroySkeleton(), this.isSkeletonRendered = !1), this.unbindGlobalHandlers(), this.el.remove()
        },
        display: function (t) {
            var e = null;
            this.isDisplayed && (e = this.queryScroll()), this.clear(), this.setDate(t), this.render(), this.updateSize(), this.renderBusinessHours(), this.isDisplayed = !0, e = this.computeInitialScroll(e), this.forceScroll(e), this.triggerRender()
        },
        clear: function () {
            this.isDisplayed && (this.unselect(), this.clearEvents(), this.triggerDestroy(), this.destroyBusinessHours(), this.destroy(), this.isDisplayed = !1)
        },
        render: function () {
            this.isSkeletonRendered || (this.renderSkeleton(), this.isSkeletonRendered = !0), this.renderDates()
        },
        destroy: function () {
            this.destroyDates()
        },
        renderSkeleton: function () {
        },
        destroySkeleton: function () {
        },
        renderDates: function () {
        },
        destroyDates: function () {
        },
        renderBusinessHours: function () {
        },
        destroyBusinessHours: function () {
        },
        triggerRender: function () {
            this.trigger("viewRender", this, this, this.el)
        },
        triggerDestroy: function () {
            this.trigger("viewDestroy", this, this, this.el)
        },
        bindGlobalHandlers: function () {
            t(document).on("mousedown", this.documentMousedownProxy)
        },
        unbindGlobalHandlers: function () {
            t(document).off("mousedown", this.documentMousedownProxy)
        },
        initThemingProps: function () {
            var t = this.opt("theme") ? "ui" : "fc";
            this.widgetHeaderClass = t + "-widget-header", this.widgetContentClass = t + "-widget-content", this.highlightStateClass = t + "-state-highlight"
        },
        updateSize: function (t) {
            var e;
            t && (e = this.queryScroll()), this.updateHeight(), this.updateWidth(), t && this.setScroll(e)
        },
        updateWidth: function () {
        },
        updateHeight: function () {
            var t = this.calendar;
            this.setHeight(t.getSuggestedViewHeight(), t.isHeightAuto())
        },
        setHeight: function () {
        },
        computeScrollerHeight: function (t) {
            var e, n, i = this.scrollerEl;
            return e = this.el.add(i), e.css({
                position: "relative",
                left: -1
            }), n = this.el.outerHeight() - i.height(), e.css({position: "", left: ""}), t - n
        },
        computeInitialScroll: function () {
            return 0
        },
        queryScroll: function () {
            return this.scrollerEl ? this.scrollerEl.scrollTop() : void 0
        },
        setScroll: function (t) {
            return this.scrollerEl ? this.scrollerEl.scrollTop(t) : void 0
        },
        forceScroll: function (t) {
            var e = this;
            this.setScroll(t), setTimeout(function () {
                e.setScroll(t)
            }, 0)
        },
        displayEvents: function (t) {
            var e = this.queryScroll();
            this.clearEvents(), this.renderEvents(t), this.isEventsRendered = !0, this.setScroll(e), this.triggerEventRender()
        },
        clearEvents: function () {
            this.isEventsRendered && (this.triggerEventDestroy(), this.destroyEvents(), this.isEventsRendered = !1)
        },
        renderEvents: function () {
        },
        destroyEvents: function () {
        },
        triggerEventRender: function () {
            this.renderedEventSegEach(function (t) {
                this.trigger("eventAfterRender", t.event, t.event, t.el)
            }), this.trigger("eventAfterAllRender")
        },
        triggerEventDestroy: function () {
            this.renderedEventSegEach(function (t) {
                this.trigger("eventDestroy", t.event, t.event, t.el)
            })
        },
        resolveEventEl: function (e, n) {
            var i = this.trigger("eventRender", e, e, n);
            return i === !1 ? n = null : i && i !== !0 && (n = t(i)), n
        },
        showEvent: function (t) {
            this.renderedEventSegEach(function (t) {
                t.el.css("visibility", "")
            }, t)
        },
        hideEvent: function (t) {
            this.renderedEventSegEach(function (t) {
                t.el.css("visibility", "hidden")
            }, t)
        },
        renderedEventSegEach: function (t, e) {
            var n, i = this.getEventSegs();
            for (n = 0; i.length > n; n++)e && i[n].event._id !== e._id || i[n].el && t.call(this, i[n])
        },
        getEventSegs: function () {
            return []
        },
        isEventDraggable: function (t) {
            var e = t.source || {};
            return B(t.startEditable, e.startEditable, this.opt("eventStartEditable"), t.editable, e.editable, this.opt("editable"))
        },
        reportEventDrop: function (t, e, n, i, r) {
            var s = this.calendar, o = s.mutateEvent(t, e, n), l = function () {
                o.undo(), s.reportEventChange()
            };
            this.triggerEventDrop(t, o.dateDelta, l, i, r), s.reportEventChange()
        },
        triggerEventDrop: function (t, e, n, i, r) {
            this.trigger("eventDrop", i[0], t, e, n, r, {})
        },
        reportExternalDrop: function (e, n, i, r, s) {
            var o, l, a = e.eventProps;
            a && (o = t.extend({}, a, n), l = this.calendar.renderEvent(o, e.stick)[0]), this.triggerExternalDrop(l, n, i, r, s)
        },
        triggerExternalDrop: function (t, e, n, i, r) {
            this.trigger("drop", n[0], e.start, i, r), t && this.trigger("eventReceive", null, t)
        },
        renderDrag: function () {
        },
        destroyDrag: function () {
        },
        isEventResizableFromStart: function (t) {
            return this.opt("eventResizableFromStart") && this.isEventResizable(t)
        },
        isEventResizableFromEnd: function (t) {
            return this.isEventResizable(t)
        },
        isEventResizable: function (t) {
            var e = t.source || {};
            return B(t.durationEditable, e.durationEditable, this.opt("eventDurationEditable"), t.editable, e.editable, this.opt("editable"))
        },
        reportEventResize: function (t, e, n, i, r) {
            var s = this.calendar, o = s.mutateEvent(t, e, n), l = function () {
                o.undo(), s.reportEventChange()
            };
            this.triggerEventResize(t, o.durationDelta, l, i, r), s.reportEventChange()
        },
        triggerEventResize: function (t, e, n, i, r) {
            this.trigger("eventResize", i[0], t, e, n, r, {})
        },
        select: function (t, e) {
            this.unselect(e), this.renderSelection(t), this.reportSelection(t, e)
        },
        renderSelection: function () {
        },
        reportSelection: function (t, e) {
            this.isSelected = !0, this.trigger("select", null, t.start, t.end, e)
        },
        unselect: function (t) {
            this.isSelected && (this.isSelected = !1, this.destroySelection(), this.trigger("unselect", null, t))
        },
        destroySelection: function () {
        },
        documentMousedown: function (e) {
            var n;
            this.isSelected && this.opt("unselectAuto") && S(e) && (n = this.opt("unselectCancel"), n && t(e.target).closest(n).length || this.unselect(e))
        },
        initHiddenDays: function () {
            var e, n = this.opt("hiddenDays") || [], i = [], r = 0;
            for (this.opt("weekends") === !1 && n.push(0, 6), e = 0; 7 > e; e++)(i[e] = -1 !== t.inArray(e, n)) || r++;
            if (!r)throw"invalid hiddenDays";
            this.isHiddenDayHash = i
        },
        isHiddenDay: function (t) {
            return e.isMoment(t) && (t = t.day()), this.isHiddenDayHash[t]
        },
        skipHiddenDays: function (t, e, n) {
            var i = t.clone();
            for (e = e || 1; this.isHiddenDayHash[(i.day() + (n ? e : 0) + 7) % 7];)i.add(e, "days");
            return i
        },
        computeDayRange: function (t) {
            var e, n = t.start.clone().stripTime(), i = t.end, r = null;
            return i && (r = i.clone().stripTime(), e = +i.time(), e && e >= this.nextDayThreshold && r.add(1, "days")), (!i || n >= r) && (r = n.clone().add(1, "days")), {
                start: n,
                end: r
            }
        },
        isMultiDayEvent: function (t) {
            var e = this.computeDayRange(t);
            return e.end.diff(e.start, "days") > 1
        }
    }), un = Le.Calendar = Le.CalendarBase = ue.extend({
        dirDefaults: null,
        langDefaults: null,
        overrides: null,
        options: null,
        viewSpecCache: null,
        view: null,
        header: null,
        constructor: Re,
        initOptions: function (t) {
            var e, r, s, o;
            t = i(t), e = t.lang, r = cn[e], r || (e = un.defaults.lang, r = cn[e] || {}), s = B(t.isRTL, r.isRTL, un.defaults.isRTL), o = s ? un.rtlDefaults : {}, this.dirDefaults = o, this.langDefaults = r, this.overrides = t, this.options = n(un.defaults, o, r, t), ke(this.options), this.viewSpecCache = {}
        },
        getViewSpec: function (t) {
            var e = this.viewSpecCache;
            return e[t] || (e[t] = this.buildViewSpec(t))
        },
        getUnitViewSpec: function (e) {
            var n, i, r;
            if (-1 != t.inArray(e, Ye))for (n = this.header.getViewsWithButtons(), t.each(Le.views, function (t) {
                n.push(t)
            }), i = 0; n.length > i; i++)if (r = this.getViewSpec(n[i]), r && r.singleUnit == e)return r
        },
        buildViewSpec: function (t) {
            for (var i, r, s, o, l, a, u = this.overrides.views || {}, c = [], d = [], h = t; h && !i;)r = _e[h] || {}, s = u[h] || {}, o = o || s.duration || r.duration, h = s.type || r.type, "function" == typeof r ? (i = r, c.unshift(i.defaults || {})) : c.unshift(r), d.unshift(s);
            return i ? (a = {
                "class": i,
                type: t
            }, o && (o = e.duration(o), o.valueOf() || (o = null)), o && (a.duration = o, l = M(o), 1 === o.as(l) && (a.singleUnit = l, d.unshift(u[l] || {}))), a.defaults = n.apply(null, c), a.overrides = n.apply(null, d), this.buildViewSpecOptions(a), this.buildViewSpecButtonText(a, t), a) : void 0
        },
        buildViewSpecOptions: function (t) {
            t.options = n(un.defaults, t.defaults, this.dirDefaults, this.langDefaults, this.overrides, t.overrides), ke(t.options)
        },
        buildViewSpecButtonText: function (t, e) {
            function n(n) {
                var i = n.buttonText || {};
                return i[e] || (t.singleUnit ? i[t.singleUnit] : null)
            }

            t.buttonTextOverride = n(this.overrides) || t.overrides.buttonText, t.buttonTextDefault = n(this.langDefaults) || n(this.dirDefaults) || t.defaults.buttonText || n(un.defaults) || (t.duration ? this.humanizeDuration(t.duration) : null) || e
        },
        instantiateView: function (t) {
            var e = this.getViewSpec(t);
            return new e["class"](this, t, e.options, e.duration)
        },
        isValidViewType: function (t) {
            return Boolean(this.getViewSpec(t))
        }
    });
    un.defaults = {
        titleRangeSeparator: " — ",
        monthYearFormat: "MMMM YYYY",
        defaultTimedEventDuration: "02:00:00",
        defaultAllDayEventDuration: {days: 1},
        forceEventDuration: !1,
        nextDayThreshold: "09:00:00",
        defaultView: "month",
        aspectRatio: 1.35,
        header: {left: "title", center: "", right: "today prev,next"},
        weekends: !0,
        weekNumbers: !1,
        weekNumberTitle: "W",
        weekNumberCalculation: "local",
        lazyFetching: !0,
        startParam: "start",
        endParam: "end",
        timezoneParam: "timezone",
        timezone: !1,
        isRTL: !1,
        buttonText: {
            prev: "prev",
            next: "next",
            prevYear: "prev year",
            nextYear: "next year",
            year: "year",
            today: "today",
            month: "month",
            week: "week",
            day: "day"
        },
        buttonIcons: {
            prev: "left-single-arrow",
            next: "right-single-arrow",
            prevYear: "left-double-arrow",
            nextYear: "right-double-arrow"
        },
        theme: !1,
        themeButtonIcons: {
            prev: "circle-triangle-w",
            next: "circle-triangle-e",
            prevYear: "seek-prev",
            nextYear: "seek-next"
        },
        dragOpacity: .75,
        dragRevertDuration: 500,
        dragScroll: !0,
        unselectAuto: !0,
        dropAccept: "*",
        eventLimit: !1,
        eventLimitText: "more",
        eventLimitClick: "popover",
        dayPopoverFormat: "LL",
        handleWindowResize: !0,
        windowResizeDelay: 200
    }, un.englishDefaults = {dayPopoverFormat: "dddd, MMMM D"}, un.rtlDefaults = {
        header: {
            left: "next,prev today",
            center: "",
            right: "title"
        },
        buttonIcons: {
            prev: "right-single-arrow",
            next: "left-single-arrow",
            prevYear: "right-double-arrow",
            nextYear: "left-double-arrow"
        },
        themeButtonIcons: {
            prev: "circle-triangle-e",
            next: "circle-triangle-w",
            nextYear: "seek-prev",
            prevYear: "seek-next"
        }
    };
    var cn = Le.langs = {};
    Le.datepickerLang = function (e, n, i) {
        var r = cn[e] || (cn[e] = {});
        r.isRTL = i.isRTL, r.weekNumberTitle = i.weekHeader, t.each(dn, function (t, e) {
            r[t] = e(i)
        }), t.datepicker && (t.datepicker.regional[n] = t.datepicker.regional[e] = i, t.datepicker.regional.en = t.datepicker.regional[""], t.datepicker.setDefaults(i))
    }, Le.lang = function (e, i) {
        var r, s;
        r = cn[e] || (cn[e] = {}), i && (r = cn[e] = n(r, i)), s = Me(e), t.each(hn, function (t, e) {
            null == r[t] && (r[t] = e(s, r))
        }), un.defaults.lang = e
    };
    var dn = {
        buttonText: function (t) {
            return {prev: I(t.prevText), next: I(t.nextText), today: I(t.currentText)}
        }, monthYearFormat: function (t) {
            return t.showMonthAfterYear ? "YYYY[" + t.yearSuffix + "] MMMM" : "MMMM YYYY[" + t.yearSuffix + "]"
        }
    }, hn = {
        dayOfMonthFormat: function (t, e) {
            var n = t.longDateFormat("l");
            return n = n.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ""), e.isRTL ? n += " ddd" : n = "ddd " + n, n
        }, mediumTimeFormat: function (t) {
            return t.longDateFormat("LT").replace(/\s*a$/i, "a")
        }, smallTimeFormat: function (t) {
            return t.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "a")
        }, extraSmallTimeFormat: function (t) {
            return t.longDateFormat("LT").replace(":mm", "(:mm)").replace(/(\Wmm)$/, "($1)").replace(/\s*a$/i, "t")
        }, hourFormat: function (t) {
            return t.longDateFormat("LT").replace(":mm", "").replace(/(\Wmm)$/, "").replace(/\s*a$/i, "a")
        }, noMeridiemTimeFormat: function (t) {
            return t.longDateFormat("LT").replace(/\s*a$/i, "")
        }
    }, fn = {
        smallDayDateFormat: function (t) {
            return t.isRTL ? "D dd" : "dd D"
        }, weekFormat: function (t) {
            return t.isRTL ? "w[ " + t.weekNumberTitle + "]" : "[" + t.weekNumberTitle + " ]w"
        }, smallWeekFormat: function (t) {
            return t.isRTL ? "w[" + t.weekNumberTitle + "]" : "[" + t.weekNumberTitle + "]w"
        }
    };
    Le.lang("en", un.englishDefaults), Le.sourceNormalizers = [], Le.sourceFetchers = [];
    var gn = {dataType: "json", cache: !1}, pn = 1;
    un.prototype.getPeerEvents = function (t) {
        var e, n, i = this.getEventCache(), r = [];
        for (e = 0; i.length > e; e++)n = i[e], t && t._id === n._id || r.push(n);
        return r
    };
    var mn = _e.basic = an.extend({
        dayGrid: null,
        dayNumbersVisible: !1,
        weekNumbersVisible: !1,
        weekNumberWidth: null,
        headRowEl: null,
        initialize: function () {
            this.dayGrid = new on(this), this.coordMap = this.dayGrid.coordMap
        },
        setRange: function (t) {
            an.prototype.setRange.call(this, t), this.dayGrid.breakOnWeeks = /year|month|week/.test(this.intervalUnit), this.dayGrid.setRange(t)
        },
        computeRange: function (t) {
            var e = an.prototype.computeRange.call(this, t);
            return /year|month/.test(e.intervalUnit) && (e.start.startOf("week"), e.start = this.skipHiddenDays(e.start), e.end.weekday() && (e.end.add(1, "week").startOf("week"), e.end = this.skipHiddenDays(e.end, -1, !0))), e
        },
        render: function () {
            this.dayNumbersVisible = this.dayGrid.rowCnt > 1, this.weekNumbersVisible = this.opt("weekNumbers"), this.dayGrid.numbersVisible = this.dayNumbersVisible || this.weekNumbersVisible, this.el.addClass("fc-basic-view").html(this.renderHtml()), this.headRowEl = this.el.find("thead .fc-row"), this.scrollerEl = this.el.find(".fc-day-grid-container"), this.dayGrid.coordMap.containerEl = this.scrollerEl, this.dayGrid.setElement(this.el.find(".fc-day-grid")), this.dayGrid.renderDates(this.hasRigidRows())
        },
        destroy: function () {
            this.dayGrid.destroyDates(), this.dayGrid.removeElement()
        },
        renderBusinessHours: function () {
            this.dayGrid.renderBusinessHours()
        },
        renderHtml: function () {
            return '<table><thead class="fc-head"><tr><td class="' + this.widgetHeaderClass + '">' + this.dayGrid.headHtml() + "</td>" + "</tr>" + "</thead>" + '<tbody class="fc-body">' + "<tr>" + '<td class="' + this.widgetContentClass + '">' + '<div class="fc-day-grid-container">' + '<div class="fc-day-grid"/>' + "</div>" + "</td>" + "</tr>" + "</tbody>" + "</table>"
        },
        headIntroHtml: function () {
            return this.weekNumbersVisible ? '<th class="fc-week-number ' + this.widgetHeaderClass + '" ' + this.weekNumberStyleAttr() + ">" + "<span>" + Y(this.opt("weekNumberTitle")) + "</span>" + "</th>" : void 0
        },
        numberIntroHtml: function (t) {
            return this.weekNumbersVisible ? '<td class="fc-week-number" ' + this.weekNumberStyleAttr() + ">" + "<span>" + this.dayGrid.getCell(t, 0).start.format("w") + "</span>" + "</td>" : void 0
        },
        dayIntroHtml: function () {
            return this.weekNumbersVisible ? '<td class="fc-week-number ' + this.widgetContentClass + '" ' + this.weekNumberStyleAttr() + "></td>" : void 0
        },
        introHtml: function () {
            return this.weekNumbersVisible ? '<td class="fc-week-number" ' + this.weekNumberStyleAttr() + "></td>" : void 0
        },
        numberCellHtml: function (t) {
            var e, n = t.start;
            return this.dayNumbersVisible ? (e = this.dayGrid.getDayClasses(n), e.unshift("fc-day-number"), '<td class="' + e.join(" ") + '" data-date="' + n.format() + '">' + n.date() + "</td>") : "<td/>"
        },
        weekNumberStyleAttr: function () {
            return null !== this.weekNumberWidth ? 'style="width:' + this.weekNumberWidth + 'px"' : ""
        },
        hasRigidRows: function () {
            var t = this.opt("eventLimit");
            return t && "number" != typeof t
        },
        updateWidth: function () {
            this.weekNumbersVisible && (this.weekNumberWidth = c(this.el.find(".fc-week-number")))
        },
        setHeight: function (t, e) {
            var n, i = this.opt("eventLimit");
            h(this.scrollerEl), s(this.headRowEl), this.dayGrid.destroySegPopover(), i && "number" == typeof i && this.dayGrid.limitRows(i), n = this.computeScrollerHeight(t), this.setGridHeight(n, e), i && "number" != typeof i && this.dayGrid.limitRows(i), !e && d(this.scrollerEl, n) && (r(this.headRowEl, v(this.scrollerEl)), n = this.computeScrollerHeight(t), this.scrollerEl.height(n))
        },
        setGridHeight: function (t, e) {
            e ? u(this.dayGrid.rowEls) : a(this.dayGrid.rowEls, t, !0)
        },
        renderEvents: function (t) {
            this.dayGrid.renderEvents(t), this.updateHeight()
        },
        getEventSegs: function () {
            return this.dayGrid.getEventSegs()
        },
        destroyEvents: function () {
            this.dayGrid.destroyEvents()
        },
        renderDrag: function (t, e) {
            return this.dayGrid.renderDrag(t, e)
        },
        destroyDrag: function () {
            this.dayGrid.destroyDrag()
        },
        renderSelection: function (t) {
            this.dayGrid.renderSelection(t)
        },
        destroySelection: function () {
            this.dayGrid.destroySelection()
        }
    }), vn = _e.month = mn.extend({
        computeRange: function (t) {
            var e, n = mn.prototype.computeRange.call(this, t);
            return this.isFixedWeeks() && (e = Math.ceil(n.end.diff(n.start, "weeks", !0)), n.end.add(6 - e, "weeks")), n
        }, setGridHeight: function (t, e) {
            e = e || "variable" === this.opt("weekMode"), e && (t *= this.rowCnt / 6), a(this.dayGrid.rowEls, t, !e)
        }, isFixedWeeks: function () {
            var t = this.opt("weekMode");
            return t ? "fixed" === t : this.opt("fixedWeekCount")
        }
    });
    vn.duration = {months: 1}, vn.defaults = {fixedWeekCount: !0}, _e.basicWeek = {
        type: "basic",
        duration: {weeks: 1}
    }, _e.basicDay = {type: "basic", duration: {days: 1}};
    var yn = {
        allDaySlot: !0,
        allDayText: "all-day",
        scrollTime: "06:00:00",
        slotDuration: "00:30:00",
        minTime: "00:00:00",
        maxTime: "24:00:00",
        slotEventOverlap: !0
    }, wn = 5, En = _e.agenda = an.extend({
        timeGrid: null,
        dayGrid: null,
        axisWidth: null,
        noScrollRowEls: null,
        bottomRuleEl: null,
        bottomRuleHeight: null,
        initialize: function () {
            this.timeGrid = new ln(this), this.opt("allDaySlot") ? (this.dayGrid = new on(this), this.coordMap = new Je([this.dayGrid.coordMap, this.timeGrid.coordMap])) : this.coordMap = this.timeGrid.coordMap
        },
        setRange: function (t) {
            an.prototype.setRange.call(this, t), this.timeGrid.setRange(t), this.dayGrid && this.dayGrid.setRange(t)
        },
        render: function () {
            this.el.addClass("fc-agenda-view").html(this.renderHtml()), this.scrollerEl = this.el.find(".fc-time-grid-container"), this.timeGrid.coordMap.containerEl = this.scrollerEl, this.timeGrid.setElement(this.el.find(".fc-time-grid")), this.timeGrid.renderDates(), this.bottomRuleEl = t('<hr class="fc-divider ' + this.widgetHeaderClass + '"/>').appendTo(this.timeGrid.el), this.dayGrid && (this.dayGrid.setElement(this.el.find(".fc-day-grid")), this.dayGrid.renderDates(), this.dayGrid.bottomCoordPadding = this.dayGrid.el.next("hr").outerHeight()), this.noScrollRowEls = this.el.find(".fc-row:not(.fc-scroller *)")
        },
        destroy: function () {
            this.timeGrid.destroyDates(), this.timeGrid.removeElement(), this.dayGrid && (this.dayGrid.destroyDates(), this.dayGrid.removeElement())
        },
        renderBusinessHours: function () {
            this.timeGrid.renderBusinessHours(), this.dayGrid && this.dayGrid.renderBusinessHours()
        },
        renderHtml: function () {
            return '<table><thead class="fc-head"><tr><td class="' + this.widgetHeaderClass + '">' + this.timeGrid.headHtml() + "</td>" + "</tr>" + "</thead>" + '<tbody class="fc-body">' + "<tr>" + '<td class="' + this.widgetContentClass + '">' + (this.dayGrid ? '<div class="fc-day-grid"/><hr class="fc-divider ' + this.widgetHeaderClass + '"/>' : "") + '<div class="fc-time-grid-container">' + '<div class="fc-time-grid"/>' + "</div>" + "</td>" + "</tr>" + "</tbody>" + "</table>"
        },
        headIntroHtml: function () {
            var t, e;
            return this.opt("weekNumbers") ? (t = this.timeGrid.getCell(0).start, e = t.format(this.opt("smallWeekFormat")), '<th class="fc-axis fc-week-number ' + this.widgetHeaderClass + '" ' + this.axisStyleAttr() + ">" + "<span>" + Y(e) + "</span>" + "</th>") : '<th class="fc-axis ' + this.widgetHeaderClass + '" ' + this.axisStyleAttr() + "></th>"
        },
        dayIntroHtml: function () {
            return '<td class="fc-axis ' + this.widgetContentClass + '" ' + this.axisStyleAttr() + ">" + "<span>" + (this.opt("allDayHtml") || Y(this.opt("allDayText"))) + "</span>" + "</td>"
        },
        slotBgIntroHtml: function () {
            return '<td class="fc-axis ' + this.widgetContentClass + '" ' + this.axisStyleAttr() + "></td>"
        },
        introHtml: function () {
            return '<td class="fc-axis" ' + this.axisStyleAttr() + "></td>"
        },
        axisStyleAttr: function () {
            return null !== this.axisWidth ? 'style="width:' + this.axisWidth + 'px"' : ""
        },
        updateSize: function (t) {
            this.timeGrid.updateSize(t), an.prototype.updateSize.call(this, t)
        },
        updateWidth: function () {
            this.axisWidth = c(this.el.find(".fc-axis"))
        },
        setHeight: function (t, e) {
            var n, i;
            null === this.bottomRuleHeight && (this.bottomRuleHeight = this.bottomRuleEl.outerHeight()), this.bottomRuleEl.hide(), this.scrollerEl.css("overflow", ""), h(this.scrollerEl), s(this.noScrollRowEls), this.dayGrid && (this.dayGrid.destroySegPopover(), n = this.opt("eventLimit"), n && "number" != typeof n && (n = wn), n && this.dayGrid.limitRows(n)), e || (i = this.computeScrollerHeight(t), d(this.scrollerEl, i) ? (r(this.noScrollRowEls, v(this.scrollerEl)), i = this.computeScrollerHeight(t), this.scrollerEl.height(i)) : (this.scrollerEl.height(i).css("overflow", "hidden"), this.bottomRuleEl.show()))
        },
        computeInitialScroll: function () {
            var t = e.duration(this.opt("scrollTime")), n = this.timeGrid.computeTimeTop(t);
            return n = Math.ceil(n), n && n++, n
        },
        renderEvents: function (t) {
            var e, n, i = [], r = [], s = [];
            for (n = 0; t.length > n; n++)t[n].allDay ? i.push(t[n]) : r.push(t[n]);
            e = this.timeGrid.renderEvents(r), this.dayGrid && (s = this.dayGrid.renderEvents(i)), this.updateHeight()
        },
        getEventSegs: function () {
            return this.timeGrid.getEventSegs().concat(this.dayGrid ? this.dayGrid.getEventSegs() : [])
        },
        destroyEvents: function () {
            this.timeGrid.destroyEvents(), this.dayGrid && this.dayGrid.destroyEvents()
        },
        renderDrag: function (t, e) {
            return t.start.hasTime() ? this.timeGrid.renderDrag(t, e) : this.dayGrid ? this.dayGrid.renderDrag(t, e) : void 0
        },
        destroyDrag: function () {
            this.timeGrid.destroyDrag(), this.dayGrid && this.dayGrid.destroyDrag()
        },
        renderSelection: function (t) {
            t.start.hasTime() || t.end.hasTime() ? this.timeGrid.renderSelection(t) : this.dayGrid && this.dayGrid.renderSelection(t)
        },
        destroySelection: function () {
            this.timeGrid.destroySelection(), this.dayGrid && this.dayGrid.destroySelection()
        }
    });
    En.defaults = yn, _e.agendaWeek = {type: "agenda", duration: {weeks: 1}}, _e.agendaDay = {
        type: "agenda",
        duration: {days: 1}
    }
});

/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function (b) {
    b.support.touch = "ontouchend" in document;
    if (!b.support.touch) {
        return;
    }
    var c = b.ui.mouse.prototype, e = c._mouseInit, a;

    function d(g, h) {
        if (g.originalEvent.touches.length > 1) {
            return;
        }
        g.preventDefault();
        var i = g.originalEvent.changedTouches[0], f = document.createEvent("MouseEvents");
        f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null);
        g.target.dispatchEvent(f);
    }

    c._touchStart = function (g) {
        var f = this;
        if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) {
            return;
        }
        a = true;
        f._touchMoved = false;
        d(g, "mouseover");
        d(g, "mousemove");
        d(g, "mousedown");
    };
    c._touchMove = function (f) {
        if (!a) {
            return;
        }
        this._touchMoved = true;
        d(f, "mousemove");
    };
    c._touchEnd = function (f) {
        if (!a) {
            return;
        }
        d(f, "mouseup");
        d(f, "mouseout");
        if (!this._touchMoved) {
            d(f, "click");
        }
        a = false;
    };
    c._mouseInit = function () {
        var f = this;
        f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd"));
        e.call(f);
    };
})(jQuery);
