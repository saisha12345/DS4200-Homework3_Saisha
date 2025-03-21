d3.csv("SocialMediaTime.csv").then(function(data) {

    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;  
    });

    const width = 900, height = 500, margin = { top: 50, right: 50, bottom: 100, left: 80 };
    const svg = d3.select("#lineplot")
                  .attr("width", width)
                  .attr("height", height);

    const xScale = d3.scaleBand()
                     .domain(data.map(d => d.Date))
                     .range([margin.left, width - margin.right])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d.AvgLikes) - 10, d3.max(data, d => d.AvgLikes) + 10]) // Adjust min/max for spacing
                     .range([height - margin.bottom, margin.top]);

    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("transform", "rotate(-25)");  

    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yScale));

    svg.append("text")
       .attr("transform", "rotate(-90)")  
       .attr("x", 0 - height / 2)  
       .attr("y", margin.left / 4) 
       .style("text-anchor", "middle")
       .style("font-size", "16px")
       .text("Average Number of Likes"); 

    // Line generator with curveNatural
    const line = d3.line()
        .x(d => xScale(d.Date) + xScale.bandwidth() / 2)  
        .y(d => yScale(d.AvgLikes))
        .curve(d3.curveNatural);

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("d", line);
});
