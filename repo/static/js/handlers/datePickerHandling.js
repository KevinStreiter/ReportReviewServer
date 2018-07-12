$(function () {
    var start_date = $('#start_date'),
        end_date = $('#end_date'),
        last_exams = $('#last_exams');

    new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'DD.MM.YYYY'
    });

    start_date.pikaday({
        format: 'DD.MM.YYYY',
        firstDay: 1,
        minDate: new Date(2017, 1, 8),
        maxDate: new Date(),
        yearRange: [2017, 2018]
    });

    end_date.pikaday({
        format: 'DD.MM.YYYY',
        firstDay: 1,
        minDate: new Date(2017, 1, 8),
        maxDate: new Date(),
        yearRange: [2017, 2018]
    });

    last_exams.click(function () {
        start_date.val("");
        end_date.val("");
    });

    $('.dateTextField').click(function () {
        last_exams.val("")
    });
});