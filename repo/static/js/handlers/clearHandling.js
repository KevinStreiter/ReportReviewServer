function clearListContent(operator) {
    d3.select("#WordsAddedBarChart" + operator).selectAll("g").remove();
    d3.select("#WordsDeletedBarChart" + operator).selectAll("g").remove();
    d3.select("#WordsAddedGraph" + operator).selectAll("g").remove();
    d3.select("#WordsDeletedGraph" + operator).selectAll("g").remove();
    d3.selectAll(".tooltip").remove();
}

function clearDashboardContent() {
    d3.select("#SimilarityGraph").selectAll("*").remove();
    d3.select("#SimilarityPieChartSingle").selectAll("*").remove();
    d3.select("#SimilarityPieChartAll").selectAll("*").remove();
    d3.select("#WordsAddedBarChart").selectAll("*").remove();
    d3.select("#WordsDeletedBarChart").selectAll("*").remove();
    d3.select("#WordsAddedGraph").selectAll("*").remove();
    d3.select("#WordsDeletedGraph" ).selectAll("*").remove();
    d3.selectAll(".tooltip").remove();
}

