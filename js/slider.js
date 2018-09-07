jQuery(function () {
    initUiSlider();
});

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
        //abe++
        var valueMin = valueFieldMin.val();
        var valueMax = valueFieldMax.val();

        slider.slider({
            range: true,
            values: [valueMin, valueMax],
            min: sliderMin,
            max: sliderMax,
            step: sliderStep,
            slide: function (event, ui) {//abe++
                //abe++
                valueMin = ui.values[0];
                valueMax = ui.values[1];
                //abe--
                //sliderMin = ui.values[0];
                //sliderValue = ui.values[1];
                refreshText();
            },
            change: function (event, ui) {//abe++
                valueMin = ui.values[0];
                valueMax = ui.values[1];
                refreshText();
            }
        });

        function refreshText() {
            //abe++
            valueFieldMin.val(valueMin);
            valueFieldMax.val(valueMax);
            valueLeft.text(valueMin);
            valueRight.text(valueMax);
        }

        refreshText();
    });
}