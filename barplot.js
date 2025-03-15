d3.csv("Social_Media_Average_Likes_Data.csv").then(function(data) {

    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;
    });

    const width = 800, height = 500, margin = { top: 50, right: 30, bottom: 50, left: 50 };
    const svg = d3.select("#barplot")
                  .attr("width", width)
                  .attr("height", height);

    const platforms = Array.from(new Set(data.map(d => d.Platform)));
    const postTypes = Array.from(new Set(data.map(d => d.PostType)));

    const x0 = d3.scaleBand()
                 .domain(platforms)
                 .range([margin.left, width - margin.right])
                 .padding(0.4);

    const x1 = d3.scaleBand()
                 .domain(postTypes)
                 .range([0, x0.bandwidth()])
                 .padding(0.05);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.AvgLikes)])
                .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
                    .domain(postTypes)
                    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(x0));

    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(y));

    // Group the data by Platform
    const groupedData = d3.group(data, d => d.Platform);

    // Add bars
    svg.append("g")
       .selectAll("g")
       .data(groupedData)
       .join("g")
       .attr("transform", d => `translate(${x0(d[0])},0)`)
       .selectAll("rect")
       .data(d => d[1])
       .join("rect")
       .attr("x", d => x1(d.PostType))
       .attr("y", d => y(d.AvgLikes))
       .attr("width", x1.bandwidth())
       .attr("height", d => height - margin.bottom - y(d.AvgLikes))
       .attr("fill", d => color(d.PostType));

    const legend = svg.append("g")
                      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    postTypes.forEach((postType, i) => {
        legend.append("rect")
              .attr("x", 0)
              .attr("y", i * 20)
              .attr("width", 15)
              .attr("height", 15)
              .attr("fill", color(postType));

        legend.append("text")
              .attr("x", 20)
              .attr("y", i * 20 + 12)
              .text(postType)
              .style("font-size", "14px")
              .attr("alignment-baseline", "middle");
    });
});
