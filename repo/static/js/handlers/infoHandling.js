$(".infoReview").hover(
    function () {
        $(this).append($("<span>: The List below shows the reports of the specified day.<br>" +
            "Click on <b>&#39Show changes&#39</b> at the end of each row to see the particular report. <br>" +
            "Click on the abbreviation in the column <b>Writer/Reviewer</b> to redirect to the corresponding dashboard.</span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoDashboard").hover(
    function () {
        $(this).append($("<span>: The Dashboard visualizes the similarity calculation between three different states of each report: <br>" +
            "<b>&#39schreiben&#39, &#39gegengelesen&#39 and &#39final&#39</b> <br>" +
            "The similarities between <b>&#39schreiben -> final&#39 and &#39gegengelesen -> final&#39</b> have been calculated <br>" +
            "and can be compared using the dashboard. The calculation have been measured by means of the <b>Jaccard-Index</b>.</span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoReportsList").hover(
    function () {
        $(this).append($("<span>: The List below shows the specified reports which have been concluded by status final <br>" +
            "Click on <b>&#39Show changes&#39</b> at the end of each row to see the particular report. <br>" +
            "<b>s->f: &#39schreiben -> final&#39 / g->f: &#39gegengelesen -> final&#39</b> </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoSimilarity").hover(
    function () {
        $(this).append($("<span>: The following graph shows the <b>Similarity-Value</b> of each concluded report over time. Click on a specific circle to see the report<br>" + "" +
            "Click on the button at the top right corner to switch between <b>&#39schreiben -> final&#39 and &#39gegengelesen -> final&#39</b> <br>" +
            "Click on a specific histogram interval to see a detailed view, by clicking the third time the graph will be reset.  </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoWordsAdded").hover(
    function () {
        $(this).append($("<span>: The following graph shows the <b>relative amount of all added words of each concluded report over time</b>.<br>" +
            "Click on a specific circle to see the report. Click on the button at the top right corner to switch between <b>&#39schreiben -> final&#39 and<br>" +
            "&#39gegengelesen -> final&#39</b> Click on a specific histogram interval to see a detailed view, clicking the third time will reset the graph.  </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoWordsDeleted").hover(
    function () {
        $(this).append($("<span>: The following graph shows the <b>relative amount of all deleted words of each concluded report over time</b>. Click<br>"+
            "on a specific circle to see the report. Click on the button at the top right corner to switch between <b>&#39schreiben -> final&#39 and<br>" +
            "&#39gegengelesen -> final&#39</b> Click on a specific histogram interval to see a detailed view, clicking the third time will reset the graph.  </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoMedianSimilarity").hover(
    function () {
        $(this).append($("<span>: The following graph shows your <b>personal calculated Median over the specified reports</b> and the <b>calculated Median over all<br>" +
            "reports</b>. By clicking on the button at the top right corner of the specific graph you can switch between <br>" +
            "<b>&#39schreiben -> final&#39 and &#39gegengelesen -> final&#39</b> values. </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoMedianDocumentChanges").hover(
    function () {
        $(this).append($("<span>: The following chart shows the <b>Median of personal and overall document changes</b> in comparison to the whole corresponding report<br>" +
            "in percent. By clicking on the button at the top right corner of the specific graph you can switch between <br>" +
            "<b>&#39schreiben -> final&#39 and &#39gegengelesen -> final&#39</b> values. </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoDocumentChanges").hover(
    function () {
        $(this).append($("<span>: The following graphs show the <b>personal calculated Median of all added / deleted words over <br>" +
            "the specified reports</b> and the <b>calculated Median over all reports</b> in comparison to the whole corresponding report <br>" +
            "in percent. The calculation is based upon the following comparison: <b>&#39gegengelesen -> final&#39</b></span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoWriterList").hover(
    function () {
        $(this).append($("<span>: The following List shows the <b>graphs of all supervised assistants</b> over the specified time period. <br>" +
            "Click on <b>&#39Show&#39</b> to view all corresponding graphs</span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoReviewerList").hover(
    function () {
        $(this).append($("<span>: The following List shows the <b>graphs of all supervisor</b> over the specified time period. <br>" +
            "Click on <b>&#39Show&#39</b> to view all corresponding graphs</span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoTreeMap").hover(
    function () {
        $(this).append($("<span>: The following graph shows all reports over the specified time period. Each colored rectangle represents a specific report.<br>" +
            "Choose a option by the category <b>Group by:</b> to change the hierarchical structure of the TreeMap. <br>"+
    "Choose a option by the category <b>Change Metric:</b> to change the value which the color coding is based on.<br>"+
    "The shown color scale represents the value range implemented by the corresponding color.<br>"+
    "<b>Right click</b> on a rectangle to redirect to the corresponding report / <b>Double-left-click</b> to zoom< or zoom-out the hierarchical structure </span>"));
    }, function () {
        $(this).find("span:last").remove();
    });

$(".infoDiffView").hover(
    function () {
        $(this).append($("<span>: The left column shows the choosen report by the states: <b>&#39schreiben&#39</b>  or <b>&#39gegengelesen&#39.</b> " +
            "Choose on the top of the this column which of the two states should be diplayed. <br>"+
    "The middle column shows the choosen report by the state <b>&#39final&#39</b>. The right column shows the difference between the other columns: Added Words are green and deleted Words are red.<br>"+
    "<b>Cave!</b> Since the Jaccard-Index-Calculation has been optimized, only changes in the Sections <b>&#39Befund&#39</b> and <b>&#39Beurteilung&#39</b> " +
            "are going to be considered, regardless of the coloring in other sections.</span>"));
    }, function () {
        $(this).find("span:last").remove();
    });