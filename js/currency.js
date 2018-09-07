/**
 * Currencies
 */
var currencies;
$.getJSON("/json/currencies.json", function (data, status) {
    currencies = data;
});

/**
 * Jquery currencies conversion management
 *
 * @param amount_one_elt First amount
 * @param amount_two_elt Second amount
 * @param currency_two_elt Currency of the second amount
 */
function currencyConversionHandler(amount_one_elt, amount_two_elt, currency_two_elt) {
    $(amount_two_elt).attr("data-currency", $(currency_two_elt).val());
    $(currency_two_elt).change(function () {
        $(amount_two_elt).attr("data-currency", $(this).val());

        $(amount_one_elt).val(
            convertCurrency(
                $(amount_two_elt).val(),
                $(amount_two_elt).attr("data-currency"),
                $(amount_one_elt).attr("data-currency")
            )
        );
    });

    $(amount_one_elt + "," + amount_two_elt).keyup(function (e) {
        var other = amount_one_elt;

        if ("#" + $(this).attr("id") == amount_one_elt) {
            other = amount_two_elt;
        }

        $(other).val(
            convertCurrency(
                $(this).val(),
                $(this).attr("data-currency"),
                $(other).attr("data-currency")
            )
        );
    });
}

/**
 * Convert currency
 *
 * @param  amount
 * @param  from
 * @param   to
 *
 * @returns number|string
 */
function convertCurrency(amount, from, to) {
    //console.log(amount, from, to);
    if (!to || !from || !amount) {
        return '';
    }

    var fromRate = currencies[from];
    var toRate = currencies[to];

    amount = amount.replace(/[^\d.,]/g, '');
    amount = parseInt(amount, 10);

    if (amount && fromRate && toRate) {
        //console_log(Math.round((amount / fromRate) * toRate));
        return Math.round((amount / fromRate) * toRate);// + toCurrencySymbol;
    }

    return '';
}