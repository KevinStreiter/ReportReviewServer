$(function () {
    if ('reviewer-dashboard' === $('body').data('page')) {
        console.log('on reviewer-dashboard page');
        buttonHandlerReviewer();
        checkboxHandler();
        floatThead();
        drawWordsAddedGraphReviewer(null);
        drawWordsDeletedGraphReviewer(null);
    }
});

function drawWordsAddedGraphReviewer(writer) {
    var maxIntervalValue = 1,
        minIntervalValue = 0,
        maxBarValue = 1,
        classNames = ["barWordsAdded", "buttonWordsAdded", "buttonAnnotationWordsAdded", "Words Added"],
        color = "#009418";
    if (writer != null) {
        drawGraph(d3.select("#WordsAddedGraph" + writer), "words_added_relative_g_f", maxIntervalValue, minIntervalValue,
            classNames, color, maxBarValue, null, writer, null);
        drawBarChart(d3.select("#WordsAddedBarChart" + writer), "words_added_relative_g_f", color, maxBarValue, writer, null);
    }
    else {
        drawBarChart(d3.select("#WordsAddedBarChart"), "words_added_relative_g_f", color, maxBarValue, null, null);
    }
}

function drawWordsDeletedGraphReviewer(writer) {
    var maxIntervalValue = 1,
        minIntervalValue = 0,
        maxBarValue = 1,
        classNames = ["barWordsDeleted", "buttonWordsDeleted", "buttonAnnotationWordsDeleted", "Words Deleted"],
        color = "#db020f";
    if (writer != null) {
        drawGraph(d3.select("#WordsDeletedGraph" + writer), "words_deleted_relative_g_f", maxIntervalValue, minIntervalValue,
            classNames, color, maxBarValue, null, writer, null);
        drawBarChart(d3.select("#WordsDeletedBarChart" + writer), "words_deleted_relative_g_f", color, maxBarValue, writer, null);
    }
    else {
        drawBarChart(d3.select("#WordsDeletedBarChart"), "words_deleted_relative_g_f", color, maxBarValue, null, null);
    }
}

