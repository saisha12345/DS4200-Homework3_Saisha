d3.csv("Social_Media_Average_Likes_Data.csv").then(function(data) {
    
    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;  
    });

    const width = 800, height = 500, margin = { top: 50, right: 150, bottom: 50, left: 60 };
    const svg = d3.select("#barplot")
                  .attr("width", width)
                  .attr("height", height);

    // Extract unique platforms and post types
    const platforms = Array.from(new Set(data.map(d => d.Platform)));
    const postTypes = Array.from(new Set(data.map(d => d.PostType)));

    // Set up scales
    const x0 = d3.scaleBand()
                 .domain(platforms)
                 .range([margin.left, width - margin.right])
                 .padding(0.2);

    const x1 = d3.scaleBand()
                 .domain(postTypes)
                 .range([0, x0.bandwidth()])
                 .padding(0.05);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.AvgLikes)])
                .nice()
                .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal()
                         .domain(postTypes)
                         .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // Improved color scheme

    // Add X-axis
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(x0))
       .append("text")
       .attr("x", width / 2)
       .attr("y", 40)
       .attr("fill", "black")
       .attr("text-anchor", "middle")
       .style("font-size", "14px")
       .text("Social Media Platform");

    // Add Y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(y))
       .append("text")
       .attr("x", -height / 2)
       .attr("y", -40)
       .attr("fill", "black")
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .style("font-size", "14px")
       .text("Average Number of Likes");

    // Group the data for each platform
    const groupedData = d3.group(data, d => d.Platform);

    // Add bars
    svg.selectAll(".platform-group")
       .data(groupedData)
       .enter()
       .append("g")
       .attr("transform", d => `translate(${x0(d[0])},0)`)
       .selectAll("rect")
       .data(d => d[1])
       .enter()
       .append("rect")
       .attr("x", d => x1(d.PostType))
       .attr("y", d => y(d.AvgLikes))
       .attr("width", x1.bandwidth())
       .attr("height", d => height - margin.bottom - y(d.AvgLikes))
       .attr("fill", d => colorScale(d.PostType));

    // Add Legend
    const legend = svg.append("g")
                      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    postTypes.forEach((postType, i) => {
        legend.append("rect")
              .attr("x", 0)
              .attr("y", i * 25)
              .attr("width", 18)
              .attr("height", 18)
              .attr("fill", colorScale(postType));

        legend.append("text")
              .attr("x", 25)
              .attr("y", i * 25 + 13)
              .attr("fill", "black")
              .style("font-size", "14px")
              .text(postType);
    });

});
