function floatThead() {

    var $table = $('.tableDashboard');
    $table.floatThead({
        scrollContainer: function ($table) {
            return $table.closest('.tableWrapper');
        }
    });
    $table.floatThead({
        responsiveContainer: function ($table) {
            return $table.closest('.tableWrapper');
        }
    });
}