function drawPieChart(svg, medianValue, className, radius, pieSegments) {
    var margin = {top: 20, right: 55, bottom: 50, left: 45},
        width = +svg.attr("width"),
        height = +svg.attr("height");

    pieSegments[0].value = medianValue;
    pieSegments[1].value = 1.0 - medianValue;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var g = svg.selectAll(".arc")
        .data(pie(pieSegments))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + width / 2 +
            "," + height / 2 + ")");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return d.data.color;
        });

    g.append("text")
        .attr("class", className)
        .attr("text-anchor", "middle")
        .attr('y', 20)
        .text(medianValue.toPrecision(2));

    g.append("text")
        .attr("class", "axisAnnotation")
        .attr("transform",
            "translate(" + (width / 10 - margin.right) + " ," +
            (height / 3 + margin.bottom) + ")")
        .text(function () {
            if (className === "pieChartFontSingle") {
                return "personal Median"
            }
            else {
                return "overall Median"
            }
        });
}

function redrawPieChart(svg, medinaValue, className, radius, pieSegments) {
    pieSegments[0].medinaValue = medinaValue;
    pieSegments[1].medinaValue = 1 - medinaValue;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    svg.selectAll(".arc").select("path")
        .data(pie(pieSegments))
        .attr("d", arc);

    svg.selectAll(className).transition()
        .text(pieSegments[0].value.toPrecision(2));
}
