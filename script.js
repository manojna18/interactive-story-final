"use strict";
let button1clicked = false;
let button2clicked = false;
let marriedboxChecked = false;
let singleboxChecked = false;

const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 600 650")

const data = d3.csv("data.csv", d => {
  const fullData = {
    Education: d.Education,
    MarriageStatus: d.RelationStat,
    Percentage: Math.round(d.obs_value),
    Sex: d.sex,
    Year: d.time
  }
  return fullData;
}).then(data => {

  const intermediateEdData = data.filter((d) => {
    return d.Education === ' Intermediate';
  })
  const advancedEducationData = data.filter((d) => {
    return d.Education === 'Advanced';
  })

  console.log(intermediateEdData);
  console.log(advancedEducationData);

  const advancedMarried = advancedEducationData.filter((d) => {
    return d.MarriageStatus === "Married/ Union/ Cohabiting";
  })

  const intermediateMarried = intermediateEdData.filter((d) => {
    return d.MarriageStatus === "Married/ Union/ Cohabiting";
  })

  const intermediateSingle = intermediateEdData.filter((d) => {
    return d.MarriageStatus === "Single/ Divorced/ Widowed";
  })

  const advancedSingle = advancedEducationData.filter((d) => {
    return d.MarriageStatus === "Single/ Divorced/ Widowed";
  })

  populateFilters(advancedMarried, intermediateMarried, intermediateSingle, advancedSingle);
});

const barHeight = 18;

const margin = {
  top: 50,
  right: 20,
  bottom: 20,
  left: 30
}

const innerWidth = 600 - margin.left - margin.right;
const innerHeight = 500 - (margin.top + margin.bottom);



const createViz = (data) => {
  d3.selectAll("svg > *").remove();

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("id", "fullChart")

  svg.append("text")
    .attr("x", (600 / 2))
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Labour participation of Indian Women vs Men");

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerHeight]);

  const barAndLabel = g
    .selectAll("g")
    .data(data)
    .join("g")


  barAndLabel
    .append("rect")
    .attr("fill", d => d.Sex === "F" ? "#E25822" : "#6CB4EE")
    .attr("class", d => d.Year)
    .attr("width", barHeight)
    .attr("x", (d, i) => (barHeight + 5) * i)
    .attr("y", 550)
    .attr("height", 0)
    .transition()
    .attr("y", d => 550 - yScale(updateBarHeight(d)))
    .duration(700)
    .ease(d3.easeQuadOut)
    .attr("height", d => yScale(updateBarHeight(d)))



  let yLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  yLabels.forEach((label) => {
    barAndLabel
      .append("text")
      .text(label)
      .attr("x", -10)
      .attr("y", 550 - yScale(label))
      .attr("text-anchor", "end")
      .style("font-family", "sans-serif")
      .style("font-size", "11px");
  })

  svg
    .append("line")
    .attr("x1", 28)
    .attr("y1", 120)
    .attr("x2", 28)
    .attr("y2", 600)
    .attr("stroke", "black");

  for (let i = 46; i < 513; i += 46) {
    svg
      .append("line")
      .attr("x1", (28 + i))
      .attr("y1", 120)
      .attr("x2", (28 + i))
      .attr("y2", 600)
      .attr("stroke", "lightgray");

  }

  const xScale0 = d3.scaleBand()
    .range([-2, 555 - margin.left - margin.right]).padding(0)

  const xScale1 = d3.scaleBand()

  const xAxis = d3.axisBottom(xScale0)

  xScale0.domain(data.map(d => d.Year))
  xScale1.domain(['1994', '2023']).range([0, xScale0.bandwidth()])

  barAndLabel.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${620 - margin.top - margin.bottom})`)
    .call(xAxis);

}


const populateFilters = (data1, data2, data3, data4) => {
  const filters = [
    { id: "advanced-married", label: "Married with advanced education", isActive: false },
    { id: "intermediate-married", label: "Married with intermediate education", isActive: false },
    { id: "advanced-single", label: "Single with advanced education", isActive: false },
    { id: "intermediate-single", label: "Single with intermediate education", isActive: false }
  ];

  d3.select("#filters")
    .selectAll(".filter")
    .data(filters)
    .join("button")
    .attr("id", d => `${d.id}`)
    .attr("class", " ")
    .text(d => d.label)

  d3.select("#filters")
    .join("div")
    .attr("id", "checkboxes")

  const button1 = d3.select("#advanced-married");
  const button2 = d3.select("#intermediate-married");
  const button3 = d3.select("#advanced-single");
  const button4 = d3.select("#intermediate-single");

  createViz(data1.reverse())

  button1.on("click", (e) => {
    e.target.classList.toggle('true');
    button2.classed('true', false);
    button3.classed('true', false);
    button4.classed('true', false);
    createViz(data1.reverse());
  })

  button2.on("click", (e) => {
    e.target.classList.toggle('true');
    button1.classed('true', false);
    button3.classed('true', false);
    button4.classed('true', false);
    createViz(data2.reverse());
  })

  button3.on("click", (e) => {
    e.target.classList.toggle('true');
    button1.classed('true', false);
    button2.classed('true', false);
    button4.classed('true', false);
    createViz(data4.reverse());
  })

  button4.on("click", (e) => {
    e.target.classList.toggle('true');
    button1.classed('true', false);
    button3.classed('true', false);
    button2.classed('true', false);
    createViz(data3.reverse());
  })

}

function updateBarHeight(data) {
  let barHeight = data.Percentage;
  return barHeight;
}





