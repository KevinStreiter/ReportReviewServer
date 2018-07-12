$(function () {
    if ('writer-dashboard' === $('body').data('page')) {
        console.log('on writer-dashboard page');
        checkboxHandler();
        buttonHandlerWriter();
        floatThead();
        drawSimilarityGraphWriter(null);
        drawWordsAddedGraphWriter(null);
        drawWordsDeletedGraphWriter(null);
    }
});

function drawSimilarityGraphWriter(reviewer) {
    var maxIntervalValue = 1,
        minIntervalValue = 0,
        pieSegments = [
            {name: 'medianValue', value: 0.0, color: "steelblue"},
            {name: 'maxValue', value: 0.0, color: 'lightgrey'},
        ],
        classNames = ["barSimilarity", "buttonSimilarity", "buttonAnnotationSimilarity", "Similarity"],
        color = "steelblue",
        radius = 150;
    if (reviewer == null) {
        drawGraph(d3.select("#SimilarityGraph"), "jaccard_s_f", maxIntervalValue, minIntervalValue, classNames, color,
            radius, pieSegments, null, null);
        drawPieChart(d3.select("#SimilarityPieChartSingle"), data["median_single"]["jaccard_s_f"], "pieChartFontSingle",
            radius, pieSegments);
        pieSegments[0].color = "#666967";
        drawPieChart(d3.select("#SimilarityPieChartAll"), data["median_all"]["jaccard_s_f"], "pieChartFontAll", radius,
            pieSegments);
    }
}

function drawWordsAddedGraphWriter(reviewer) {
    var maxIntervalValue = 1,
        minIntervalValue = 0,
        maxBarValue = 1,
        classNames = ["barWordsAdded", "buttonWordsAdded", "buttonAnnotationWordsAdded", "Words Added"],
        color = "#009418";

    if (reviewer != null) {
        drawGraph(d3.select("#WordsAddedGraph" + reviewer), "words_added_relative_g_f", maxIntervalValue, minIntervalValue,
            classNames, color, maxBarValue, null, null, reviewer);
        drawBarChart(d3.select("#WordsAddedBarChart" + reviewer), "words_added_relative_g_f", color, maxBarValue, null,
            reviewer);
    }
    else {
        drawGraph(d3.select("#WordsAddedGraph"), "words_added_relative_s_f", maxIntervalValue, minIntervalValue,
            classNames, color, maxBarValue, null, null, reviewer);
        drawBarChart(d3.select("#WordsAddedBarChart"), "words_added_relative_s_f", color, maxBarValue, null, reviewer);
    }
}

function drawWordsDeletedGraphWriter(reviewer) {
    var maxIntervalValue = 1,
        minIntervalValue = 0,
        maxBarValue = 1,
        classNames = ["barWordsDeleted", "buttonWordsDeleted", "buttonAnnotationWordsDeleted", "Words Deleted"],
        color = "#f5070d";

    if (reviewer != null) {
        drawGraph(d3.select("#WordsDeletedGraph" + reviewer), "words_deleted_relative_g_f", maxIntervalValue,
            minIntervalValue, classNames, color, maxBarValue, null, null, reviewer);
        drawBarChart(d3.select("#WordsDeletedBarChart" + reviewer), "words_deleted_relative_g_f", color, maxBarValue,
            null, reviewer);
    }
    else {
        drawGraph(d3.select("#WordsDeletedGraph"), "words_deleted_relative_s_f", maxIntervalValue, minIntervalValue,
            classNames, color, maxBarValue, null, null, reviewer);
        drawBarChart(d3.select("#WordsDeletedBarChart"), "words_deleted_relative_s_f", color, maxBarValue, null, reviewer);
    }
}