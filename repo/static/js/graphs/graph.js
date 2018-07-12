function drawGraph(svg, value, maxIntervalValue, minIntervalValue, classNames, color, specificValue,
                   pieSegments, writer, reviewer) {
    var margin = {top: 50, right: 20, bottom: 150, left: 45},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        gap = 170,
        counter = 0,
        g = svg.append("g")
            .attr("class", "graphArea")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        brushArea = svg.append("g")
            .attr("class", "brushArea")
            .attr("transform", "translate(" + margin.left + "," + (height + margin.bottom - margin.top / 10) + ")"),
        formatTime = d3.timeFormat("%x"),
        brush = d3.brushX()
            .extent([[gap + margin.right, -margin.bottom / 3], [width, 1]])
            .on("brush", brushed),

        //Define Axes
        x = d3.scaleTime().range([gap + margin.right, width]),
        x2 = d3.scaleTime().range([gap + margin.right, width]),
        y = d3.scaleLinear().range([height, 0]).domain([minIntervalValue, maxIntervalValue]),
        yx = d3.scaleLinear().range([0, gap]);

    //Draw Gridlines
    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(4)
            .tickSize(-width)
            .tickFormat("")
        );

    //Define the div for the tooltip
    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Filter Data by writer / reviewer
    var unfilteredData = data['rows'],
    filteredData = filterByWriter(data['rows'], writer);
    filteredData = filterByReviewer(filteredData, reviewer);

    //Get Data
    filteredData.forEach(function (data) {
        data[value] = +data[value];
        data.unters_beginn = new Date(data.unters_beginn);
    });

    unfilteredData.forEach(function (data) {
        data[value] = +data[value];
        data.unters_beginn = new Date(data.unters_beginn);
    });

    //Define Time Axis
    x.domain(d3.extent(unfilteredData, function (d) {
        return d.unters_beginn;
    }));

    //Define Brush Axis
    x2.domain(x.domain());

    //Exclude filtered Data
    unfilteredData = unfilteredData.filter(
        function (element) {
            return this.indexOf(element) < 0;
        },
        filteredData
    );

    unfilteredData.forEach(function (data) {
        data[value] = +data[value];
        data.unters_beginn = new Date(data.unters_beginn);
    });

    if (!(value.slice(0, -3) === 'jaccard_')) {

        //Draw ExceedingLine
        g.append("line")
            .attr("class", "exceedingLine")
            .attr("x1", 0)
            .attr("y1", -margin.top / 3)
            .attr("x2", width)
            .attr("y2", -margin.top / 3);

        //Draw ExceedingLineText
        g.append("text")
            .attr("class", "exceedingLineAnnotation")
            .attr("fill", color)
            .attr("x", 7)
            .attr("y", -margin.top / 2)
            .text(">1");
    }

    //Define ScatterPlot-Area
    var scatterPlot = g.append("g")
        .attr("class", "scatterPlot");

    //Define ScatterPlotHidden-Area
    var scatterPlotHidden = g.append("g")
        .attr("class", "scatterPlotHidden");

    //Define ScatterPlot-Background
    scatterPlot.append("rect")
        .attr("class", "backgroundRect")
        .attr("height", height)
        .attr("width", width - gap - 20)
        .attr("transform", "translate(" + (gap + 20) + ",0)");

    //Draw unfilteredData Circles
    var hidden_circles = scatterPlotHidden.append("g");

    if (writer != null || reviewer != null) {

        hidden_circles.selectAll("circle")
            .data(unfilteredData)
            .enter()
            .append("circle")
            .style("fill", "darkgray")
            .attr("cx", function (d) {
                return x(d.unters_beginn);
            })
            .attr("cy", function (d) {
                return checkCircleValue(d[value], margin, y);
            })
            .attr("r", 4)
            .style("opacity", 0.3);
    }

    //Draw filteredData Circles
    var circles = scatterPlot.append("g")
        .attr("class", "circles");

    circles.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .style("fill", color)
        .attr("cx", function (d) {
            return x(d.unters_beginn);
        })
        .attr("cy", function (d) {
            return checkCircleValue(d[value], margin, y);
        })
        .attr("r", 4)
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("r", 7)
                .style("fill", "lightslategray");
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(d.untart_name + "<br/>" + "Date: " +
                formatTime(d.unters_beginn) + "<br/>" +
                classNames[3] + ": " + d[value].toPrecision(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("r", 4)
                .style("fill", color);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (d) {
            console.log("on Diff-Viewer Page: " + d.befund_schluessel);
            window.location = 'diff/' + d.befund_schluessel;
        });

    //Define Histogram
    var histogram = g.append("g")
        .attr("class", "histogram");

    //Define Histogram-Background
    histogram.append("rect")
        .attr("class", "backgroundRect")
        .attr("height", height)
        .attr("width", gap);

    //Histogram
    var yBins = d3.histogram()
        .domain(y.domain())
        .thresholds(d3.range(y.domain()[0], y.domain()[1], (y.domain()[1]) / 5))
        .value(function (d) {
            if (d[value] > maxIntervalValue) {
                return maxIntervalValue;
            } else {
                return d[value];
            }
        })(filteredData);

    //Define Histogram Axis
    yx.domain([0, d3.max(yBins, function (d) {
        return d.length;
    })]);

    //Define Bin-Width
    var bWidth = y(yBins[0].x0) - y(yBins[0].x1) - 1;

    //Draw Bins
    histogram.selectAll(".rect")
        .data(yBins)
        .enter()
        .append("rect")
        .attr("class", classNames[0] + " pointer")
        .attr("transform", function (d) {
            return "translate(" + 0 + "," + y(d.x1) + ")";
        })
        .attr("y", 1)
        .attr("width", function (d) {
            return yx(d.length);
        })
        .attr("height", bWidth)
        .on("mouseover", function (data) {
            scatterPlot.selectAll("circle")
                .filter(function (d) {
                    if (data.x0 > minIntervalValue && data.x1 === maxIntervalValue) {
                        return d[value] > data.x0;
                    }
                    else {
                        return d[value] >= data.x0 && d[value] <= data.x1;
                    }
                })
                .attr("r", 7)
                .style("fill", "#666967");
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(function () {
                if (counter < 2) {
                    return "Click to expand this interval"
                }
                else {
                    return "Click to reset interval"
                }
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function () {
            scatterPlot.selectAll("circle")
                .data(filteredData)
                .attr("r", 4)
                .style("fill", color);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (d) {
            if (counter < 2) {
                counter++;
                minIntervalValue = Math.round(d.x0 * 10) / 10;
                maxIntervalValue = Math.round(d.x1 * 10) / 10;

                filteredData = filterByInterval(filteredData, minIntervalValue, maxIntervalValue, value);
                filteredData = filterByWriter(filteredData, writer);
                filteredData = filterByReviewer(filteredData, reviewer);
                redrawGraph(filteredData, svg, height, width, gap, margin, y, yx, x, value, minIntervalValue,
                    maxIntervalValue, classNames[0], writer, reviewer);
            }
            else {
                if (writer != null) {
                    clearListContent(writer);
                    drawWordsAddedGraphReviewer(writer);
                    drawWordsDeletedGraphReviewer(writer);
                }
                else if (reviewer != null) {
                    clearListContent(reviewer);
                    drawWordsAddedGraphWriter(reviewer);
                    drawWordsDeletedGraphWriter(reviewer);
                }
                else {
                    clearDashboardContent();
                    var body = $('body');

                    if ('reviewer-dashboard' === body.data('page')) {
                        writer = null;
                        drawWordsAddedGraphReviewer(writer);
                        drawWordsDeletedGraphReviewer(writer);

                    }
                    else if ('writer-dashboard' === body.data('page')) {
                        reviewer = null;
                        drawSimilarityGraphWriter(reviewer);
                        drawWordsAddedGraphWriter(reviewer);
                        drawWordsDeletedGraphWriter(reviewer);
                    }
                }
            }
            circles.selectAll("circle")
                .attr("r", 4)
                .style("fill", color);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //Definde Histogram Bin Count
    histogram.selectAll("text")
        .data(yBins)
        .enter()
        .append("text")
        .attr("class", "graphBar")
        .attr("x", function (d) {
            return yx(d.length) - 10;
        })
        .attr("transform", function (d) {
            return "translate(" + 0 + "," + (y(d.x1) + (bWidth / 2) + 5) + ")";
        })
        .text(function (data) {
            return data.length;
        });

    //Draw Median Line single
    var median_single;
    if (writer != null) {
        reviewer = null;
        median_single = data['median_' + writer];
    }
    else if (reviewer != null) {
        writer = null;
        median_single = data['median_' + reviewer];
    }
    else {
        median_single = data['median_single']
    }

    g.append("line")
        .attr("class", "medianLineSingle")
        .style("stroke", color)
        .attr("x1", 0)
        .attr("y1", checkGraphArea(y(median_single[value]), height))
        .attr("x2", width)
        .attr("y2", checkGraphArea(y(median_single[value]), height));

    //Draw Median Line overall
    g.append("line")
        .attr("class", "medianLineAll")
        .attr("x1", 0)
        .attr("y1", checkGraphArea(y(data['median_all'][value]), height))
        .attr("x2", width)
        .attr("y2", checkGraphArea(y(data['median_all'][value]), height));

    //Draw Axes
    g.append("g")
        .attr("class", "x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y")
        .call(d3.axisLeft(y)
            .ticks(6));

    g.append("g")
        .attr("class", "yx")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(yx)
            .ticks(4));

    //Append Brush
    brushArea.append("g")
        .attr("class", "x2")
        .call(d3.axisBottom(x2));

    brushArea.append("g")
        .attr("class", "brushTool")
        .call(brush)
        .call(brush.move, x.range());

    brushArea.selectAll("rect.handle")
        .attr("fill", color);

    brushArea.append("line")
        .attr("class", "brushLineLeft")
        .attr("stroke", color)
        .attr("x1", gap + 20)
        .attr("x2", gap + 20)
        .attr("y1", -margin.left - margin.top)
        .attr("y2", -margin.left - 5);

    brushArea.append("line")
        .attr("class", "brushLineRight")
        .attr("stroke", color)
        .attr("x1", width)
        .attr("x2", width)
        .attr("y1", -margin.left - margin.top)
        .attr("y2", -margin.left - 5);

    //Add Annotation of Axes
    g.append("text")
        .attr("class", "axisAnnotation")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 3)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .text(classNames[3]);

    g.append("text")
        .attr("class", "axisAnnotation")
        .attr("transform",
            "translate(" + (width / 12) + " ," +
            (height + margin.top - 10) + ")")
        .text("#Reports");

    g.append("text")
        .attr("class", "axisAnnotation")
        .attr("transform",
            "translate(" + (width / 1.7) + " ," +
            (height + margin.top - 10) + ")")
        .text("Date");

    //Add legend
    var legend = svg.append("g")
            .attr("class", "legend"),
        legendHeight = 8,
        legendLineLength = 20,
        legendGap = 80;

    legend.append("line")
        .attr("class", "medianLineSingle")
        .style("stroke", color)
        .attr("x1", width / 3)
        .attr("x2", width / 3 + legendLineLength)
        .attr("y1", legendHeight)
        .attr("y2", legendHeight);

    legend.append("line")
        .attr("class", "medianLineAll")
        .attr("x1", width / 2)
        .attr("x2", width / 2 + legendLineLength)
        .attr("y1", legendHeight)
        .attr("y2", legendHeight);

    legend.append("text")
        .attr("x", (width / 3) + legendLineLength + legendGap + 5)
        .attr("y", legendHeight)
        .attr("dy", "0.32em")
        .text("personal Median");

    legend.append("text")
        .attr("x", (width / 2) + legendLineLength + legendGap)
        .attr("y", legendHeight)
        .attr("dy", "0.32em")
        .text("overall Median");

    //Add Report Button
    var reportButton = svg.append("g")
            .attr("class", "reportButton pointer"),
        buttonWidth = 150,
        buttonHeight = 20,
        x0 = width - 100,
        y0 = -0;

    reportButton.append("rect")
        .attr("class", classNames[1])
        .attr("width", buttonWidth)
        .attr("height", buttonHeight)
        .attr("x", function (d, i) {
            return x0 + (buttonWidth) * i;
        })
        .attr("y", y0)
        .attr("rx", 5)
        .attr("ry", 5);

    reportButton.append("text")
        .attr("class", classNames[2])
        .attr("x", function (d, i) {
            return x0 + buttonWidth * i + buttonWidth / 2;
        })
        .attr("y", y0 + buttonHeight / 2)
        .text(function () {
            var checkValue = value.substr(value.length - 3);
            if (checkValue === "s_f") {
                return "schreiben -> final";
            }
            else {
                return "gegengelesen -> final";
            }
        });

    reportButton.on("click", function () {
        if (counter === 0) {
            var tempValue = value.slice(0, -3),
                checkValue = value.substr(value.length - 3);

            if (checkValue === "s_f") {
                value = tempValue + "g_f";
                d3.selectAll("." + classNames[2]).text("gegengelesen -> final");
            }
            else {
                value = tempValue + "s_f";
                d3.selectAll("." + classNames[2]).text("schreiben -> final");
            }

            redrawGraph(filteredData, svg, height, width, gap, margin, y, yx, x, value, minIntervalValue,
                maxIntervalValue, classNames[0], writer, reviewer);

            if (tempValue === "jaccard_") {
                redrawPieChart(d3.select("#SimilarityPieChartSingle"), data['median_single'][value],
                    ".pieChartFontSingle", specificValue, pieSegments);
                redrawPieChart(d3.select("#SimilarityPieChartAll"), data['median_all'][value],
                    ".pieChartFontAll", specificValue, pieSegments)
            }
            else {
                if (writer != null) {
                    reviewer = null;
                    if (tempValue === "words_added_relative_") {
                        redrawBarChart(d3.select("#WordsAddedBarChart" + writer), value, specificValue, writer, null);
                    }
                    else {
                        redrawBarChart(d3.select("#WordsDeletedBarChart" + writer), value, specificValue, writer, null);
                    }
                }
                else if (reviewer != null) {
                    writer = null;
                    if (tempValue === "words_added_relative_") {
                        redrawBarChart(d3.select("#WordsAddedBarChart" + reviewer), value, specificValue, null, reviewer);
                    }
                    else {
                        redrawBarChart(d3.select("#WordsDeletedBarChart" + reviewer), value, specificValue, null, reviewer);
                    }
                }
                else {
                    if (tempValue === "words_added_relative_") {
                        redrawBarChart(d3.select("#WordsAddedBarChart"), value, specificValue, null);
                    }
                    else {
                        redrawBarChart(d3.select("#WordsDeletedBarChart"), value, specificValue, null);
                    }
                }
            }
        }
    });

    //Add Reset Button
    var resetButton = svg.append("g")
        .attr("class", "resetButton pointer");
    x0 = width - margin.right * 13;

    resetButton.append("rect")
        .attr("class", "buttonReset")
        .attr("width", buttonWidth)
        .attr("height", buttonHeight)
        .attr("x", function (d, i) {
            return x0 + (buttonWidth) * i;
        })
        .attr("y", y0)
        .attr("rx", 5)
        .attr("ry", 5);

    resetButton.append("text")
        .attr("class", "buttonAnnotationReset")
        .attr("x", function (d, i) {
            return x0 + buttonWidth * i + buttonWidth / 2;
        })
        .attr("y", y0 + buttonHeight / 2)
        .text("reset");

    resetButton.on("click", function () {
        if (writer != null) {
            clearListContent(writer);
            drawWordsAddedGraphReviewer(writer);
            drawWordsDeletedGraphReviewer(writer);
        }
        else if (reviewer != null) {
            clearListContent(reviewer);
            drawWordsAddedGraphWriter(reviewer);
            drawWordsDeletedGraphWriter(reviewer);
        }
        else {
            clearDashboardContent();
            var body = $('body');

            if ('reviewer-dashboard' === body.data('page')) {
                writer = null;
                drawWordsAddedGraphReviewer(writer);
                drawWordsDeletedGraphReviewer(writer);

            }
            else if ('writer-dashboard' === body.data('page')) {
                reviewer = null;
                drawSimilarityGraphWriter(reviewer);
                drawWordsAddedGraphWriter(reviewer);
                drawWordsDeletedGraphWriter(reviewer);
            }
        }
    });

    //Brushtool Infotext
    brushArea.on("mouseover", function () {
        div.transition()
            .duration(800)
            .style("opacity", 1);
        div.html(function () {
            return "To define time area: <br>" +
                "Click on one of the coloured handles and move it by dragging the mouse to the desired direction"
        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    })

        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

    //Brush function
    function brushed() {
        x.domain(d3.event.selection.map(x2.invert, x2));
        g.selectAll("circle")
            .attr("cx", function (d) {
                if (x(d.unters_beginn) < gap + margin.right) {
                    return -100;
                }
                else {
                    return x(d.unters_beginn);
                }
            });
        g.select(".x").call(d3.axisBottom(x));

        var id = svg.attr("id");

        var rightHandle = $("#" + id + " .handle--e"),
            leftHandle = $("#" + id + " .handle--w");

        brushArea.select(".brushLineLeft").transition()
            .duration(1)
            .attr("x2", parseInt(leftHandle.attr("x")) + 3);
        brushArea.select(".brushLineRight").transition()
            .duration(1)
            .attr("x2", parseInt(rightHandle.attr("x")) + 3);
    }
}

function redrawGraph(filtered_data, svg, height, width, gap, margin, y, yx, x, value, minIntervalValue,
                     maxIntervalValue, className, writer, reviewer) {

    filtered_data = filterByWriter(filtered_data, writer);
    filtered_data = filterByReviewer(filtered_data, reviewer);

    var unfiltered_data = data['rows'];
    unfiltered_data = unfiltered_data.filter(
        function (element) {
            return this.indexOf(element) < 0;
        },
        filtered_data
    );

    if (minIntervalValue !== 0 && maxIntervalValue !== 1) {
        unfiltered_data = filterByInterval(unfiltered_data, minIntervalValue, maxIntervalValue, value);
    }

    filtered_data.forEach(function (data) {
        data[value] = +data[value];
        data.unters_beginn = new Date(data.unters_beginn);
    });

    //Check Amount of Bins
    var intervalDivisor = 5;

    if ((Math.abs(maxIntervalValue - minIntervalValue)) <= 0.3) {
        intervalDivisor = 2;
    }

    //Redefine y-Axis
    y.domain([minIntervalValue, maxIntervalValue]);

    //Redraw y-Axis
    svg.selectAll(".y")
        .transition()
        .call(d3.axisLeft(y)
            .ticks(intervalDivisor));

    //Redraw Gridlines
    svg.selectAll(".grid").transition()
        .call(d3.axisLeft(y)
            .ticks(intervalDivisor)
            .tickSize(-width)
            .tickFormat(""));

    //Redraw Circles
    var circles = svg.select(".scatterPlot").selectAll("circle")
        .data(filtered_data);

    circles.exit().remove();

    circles.enter().append("circle");

    circles.transition()
        .attr("cx", function (d) {
            if (x(d.unters_beginn) < gap + margin.right) {
                return -100;
            }
            else {
                return x(d.unters_beginn);
            }
        })
        .attr("cy", function (d) {
            return checkCircleValue(d[value], margin, y);
        });

    if (writer != null || reviewer != null) {
        //Redraw Hidden Circles
        var circlesHidden = svg.select(".scatterPlotHidden").selectAll("circle")
            .data(unfiltered_data);

        circlesHidden.exit().remove();

        circlesHidden.enter().append("circle");

        circlesHidden.transition()
            .attr("cx", function (d) {
                if (x(d.unters_beginn) < gap + margin.right) {
                    return -100;
                }
                else {
                    return x(d.unters_beginn);
                }
            })
            .attr("cy", function (d) {
                return checkCircleValue(d[value], margin, y);
            });
    }

    //Redraw Histogram
    var yBins = d3.histogram()
        .domain(y.domain())
        .thresholds(d3.range(y.domain()[0], y.domain()[1], (y.domain()[1] - y.domain()[0]) / intervalDivisor))
        .value(function (d) {
            if (d[value] > maxIntervalValue) {
                return maxIntervalValue;
            } else {
                return d[value];
            }
        })(filtered_data);

    //Redefine Bin Count Axis
    yx.domain([0, d3.max(yBins, function (d) {
        return d.length;
    })]);

    svg.selectAll(".yx")
        .transition()
        .call(d3.axisBottom(yx)
            .ticks(4));

    //Redefine Bin Width
    var bWidth = y(yBins[0].x0) - y(yBins[0].x1) - 1,

        //Redraw Bars
        bars = svg.selectAll("rect." + className)
        .data(yBins);

    bars.exit().remove();

    bars.enter().append("rect");

    bars.transition()
        .attr("width", function (d) {
            return yx(d.length);
        })
        .attr("height", bWidth)
        .attr("transform", function (d) {
            return "translate(" + 0 + "," + y(d.x1) + ")";
        });

    //Redraw BarText
    var barText = svg.selectAll("text.graphBar")
        .data(yBins);

    barText.exit().remove();

    barText.enter().append("text");

    barText.transition()
        .attr("x", function (d) {
            return yx(d.length) - 10;
        })
        .attr("transform", function (d) {
            return "translate(" + 0 + "," + (y(d.x1) + (bWidth / 2) + 5) + ")";
        })
        .text(function (data) {
            return data.length;
        });

    //Redraw Median Lines
    var median_single;
    if (writer != null) {
        reviewer = null;
        median_single = data['median_' + writer];
    }
    else if (reviewer != null) {
        writer = null;
        median_single = data['median_' + reviewer];
    }
    else {
        median_single = data['median_single']
    }

    svg.select(".medianLineSingle").transition()
        .attr("y1", checkGraphArea(y(median_single[value]), height))
        .attr("y2", checkGraphArea(y(median_single[value]), height));

    svg.select(".medianLineAll").transition()
        .attr("y1", checkGraphArea(y(data['median_all'][value]), height))
        .attr("y2", checkGraphArea(y(data['median_all'][value]), height));
}

function checkGraphArea(value, height) {
    if (value < 0 || value > height) {
        return -100;
    }
    else {
        return value;
    }
}

function checkCircleValue(value, margin, y) {
    if (value > 1) {
        return -margin.top / 3
    }
    else {
        return y(value);
    }
}

function filterByWriter(data, writer) {
    if (writer != null) {
        data = data.filter(function (d) {
            if (d["schreiber"] === writer) {
                return d;
            }
        });
        return data;
    }
    else {
        return data;
    }
}

function filterByReviewer(data, reviewer) {
    if (reviewer != null) {
        data = data.filter(function (d) {
            if (d["freigeber"] === reviewer) {
                return d;
            }
        });
        return data;
    }
    else {
        return data;
    }
}

function filterByInterval(data, minIntervalValue, maxIntervalValue, value) {
    var filteredData = [];
    data.forEach(function (data) {
        data[value] = +data[value];
        data.unters_beginn = new Date(data.unters_beginn);
        if (minIntervalValue === 0) {
            if (data[value] >= minIntervalValue && data[value] <= maxIntervalValue) {
                filteredData.push(data);
            }
        } else {
            if (data[value] > minIntervalValue && data[value] <= maxIntervalValue) {
                filteredData.push(data)
            }
        }
    });
    return filteredData;
}
