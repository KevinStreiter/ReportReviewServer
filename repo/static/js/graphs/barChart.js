function drawBarChart(svg, value, color, maxValue, writer, reviewer) {
    var margin = {top: 30, right: 250, bottom: 10, left: 150},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        median_single;

    if (writer != null) {
        median_single = data['median_' + writer];
    }
    else if (reviewer != null) {
        median_single = data['median_' + reviewer];
    }
    else {
        median_single = data['median_single']
    }

    var medianData = [{"name": "personal Median", "value": median_single[value].toPrecision(2), "color": color},
        {"name": "overall Median", "value": data['median_all'][value].toPrecision(2), "color": "#666967"}];

    var x = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width]);

    var y = d3.scaleBand()
        .domain(medianData.map(function (d) {
            return d.name;
        }))
        .range([0, height])
        .paddingInner(0.1);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(0);

    g.append("g")
        .attr("class", "barAnnotation")
        .call(yAxis);

    //Define Histogram
    var gLeft = g.append("g")
        .attr("class", "histogram");

    var yBar = gLeft.selectAll(".bar")
        .data(medianData)
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return d.color
        });

    yBar.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("width", function (d) {
            if (d.value > maxValue) {
                return x(maxValue);
            } else {
                return x(d.value);
            }
        })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) {
            return d.color
        });

    yBar.append("text")
        .attr("class", "barText")
        .attr("y", function (d) {
            return y(d.name) + y.bandwidth() / 2 + 4;
        })
        .attr("x", function (d) {
            if (d.value > maxValue) {
                return x(maxValue) + 20;
            } else {
                return x(d.value) + 20;
            }
        })
        .text(function (d) {
            return (Math.round(d.value*1000) / 10) + "%";
        });
}

function redrawBarChart(svg, value, maxValue, writer, reviewer) {
    var margin = {top: 30, right: 250, bottom: 10, left: 150},
        width = +svg.attr("width") - margin.left - margin.right,
        median_single;

    if (writer != null) {
        median_single = data['median_' + writer];
    }
    else if (reviewer != null) {
        median_single = data['median_' + reviewer];
    }
    else {
        median_single = data['median_single']
    }

    var medianData = [median_single[value].toPrecision(2), data['median_all'][value].toPrecision(2)];

    var x = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width]);

    svg.selectAll("rect.bar")
        .data(medianData)
        .transition()
        .attr("width", function (d) {
            if (d > maxValue) {
                return x(maxValue)
            } else {
                return x(d)
            }
        });

    svg.selectAll("text.barText")
        .data(medianData)
        .transition()
        .attr("x", function (d) {
            if (d > maxValue) {
                return x(maxValue) + 20;
            } else {
                return x(d) + 20;
            }
        })
        .text(function (d) {
            return (Math.round(d*1000) / 10) + "%";
        });
}
