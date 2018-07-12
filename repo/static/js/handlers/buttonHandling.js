function buttonHandlerWriter() {
    $(".reviewerButton").click(function () {
        var reviewer = $(this).closest("tr")
            .find(".reviewerName")
            .text();
        reviewer = reviewer.slice(0, reviewer.indexOf(" ")).trim();
        var graphId = "#graphs" + reviewer;
        $(graphId).toggle();

        if ($(this).text().trim() === "Show") {

            $(this).text("Hide");
            drawWordsAddedGraphWriter(reviewer);
            drawWordsDeletedGraphWriter(reviewer);
        } else if ($(this).text().trim() === "Hide") {
            $(this).text("Show");
            clearListContent(reviewer);
        }
    });
}

function buttonHandlerReviewer() {
    $(".writerButton").click(function () {
        var writer = $(this).closest("tr")
            .find(".writerName")
            .text();
        writer = writer.slice(0, writer.indexOf(" ")).trim();
        var graphId = "#graphs" + writer;
        $(graphId).toggle();

        if ($(this).text().trim() === "Show") {
            $(this).text("Hide");
            drawWordsAddedGraphReviewer(writer);
            drawWordsDeletedGraphReviewer(writer);
        } else if ($(this).text().trim() === "Hide") {
            $(this).text("Show");
            clearListContent(writer);
        }
    });
}