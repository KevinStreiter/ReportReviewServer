function drawColorScale() {
    var svg = d3.select("#colorScale"),
        margin = {top: 15, right: 50, bottom: 30, left: 110},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),

        data = d3.range(10),

        colors = d3.scaleQuantize()
            .domain([0, 10])
            .range(["#F9FBFF", "#BBC8FF", "#6C7FFF", "#0500AE", "#0E0077"]),
        scale = d3.scaleLinear()
            .range([0, margin.left - margin.top]).domain([0, 1]);

    g.append("g")
        .attr("class", "colorScale")
        .attr("transform", "translate(" + ((margin.right - margin.bottom) / 2) + "," + (height * 3) + ")")
        .call(d3.axisBottom(scale)
            .ticks(3));

    g.selectAll(".rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", margin.top)
        .attr("height", margin.top)
        .attr("x", (d, i) => 10 + i * 10)
        .attr("width", 6)
        .attr("fill", d => colors(d))
        .attr("stroke", "lightgray");
}