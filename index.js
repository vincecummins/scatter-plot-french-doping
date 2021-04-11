console.log('yy')

const getData = (data, target, dataLen) => {
    const arr = [];
    for (let i = 0; i < dataLen; i++) {
        arr.push(data[i][target])
    }
    return arr
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        const dataLen = data.length
        const years = getData(data, "Year", dataLen)
        const time = getData(data, "Time", dataLen)
        makeGraph(data, dataLen, years, time)
    })

const makeGraph = (data, dataLen, years, time) => {

    //defining the svg boundaries
    const w = 800
    const h = 600
    const marg = 40

    // defining the scales
    const formatTime = (num) => {
        return parseFloat(num.split(':')[0] + "." + parseInt(num.split(':')[1] / 60 * 100))
    }
    const maxYear = d3.max(years)
    const minYear = d3.min(years)
    const maxTime = formatTime(d3.max(time))
    const minTime = formatTime(d3.min(time))
    console.log(minYear)

    const xScale = d3.scaleLinear()
        .domain([minYear - 1, maxYear])
        .range([marg, w + marg])

    const yScale = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([h + marg, marg])

    // defining the axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"))
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
            if (d - Math.floor(d) === 0) {
                return d + ":00"
            } else {
                return Math.floor(d) + ":" + parseInt((d - Math.floor(d)) * 60)
            }
        })

    // defining the tooltip
    const tooltip = d3.select('#d3-container')
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // initializing the svg

    const svg = d3.select('#d3-container')
        .append('svg')
        .attr('width', w + 2 * marg)
        .attr('height', h + 2 * marg)

    //defining the legend
    const legendContainer = d3.select('svg').append('rect')
        .attr('class', 'legend')
        .attr('x', w - 190)
        .attr('y', 480)
        .attr('width', 250)
        .attr('height', "50px")
        .style("border-radius", "1em")

    const legend = svg.append('g')

    const colors = ["#006ce8", "#ff2424"];

    legend
        .selectAll('text')
        .data(colors)
        .enter()
        .append('text')
        .attr('class', 'legendLabel')
        .attr('x', w - 160)
        .attr('y', (d, i) => 500 + i * 20)
        .text((d, i) => i === 0 ? "Clean riders" : "Riders with Doping Allegations")

    legend
        .selectAll('circle')
        .data(colors)
        .enter()
        .append('rect')
        .attr('class', 'legendLabel')
        .attr('x', w - 175)
        .attr('y', (d, i) => 490 + i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d, i) => i === 0 ? colors[0] : colors[1])


    // adding circles
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(d.Year))
        .attr('cy', (d) => yScale(formatTime(d["Time"])))
        .attr('r', 6)
        .attr('fill', (d) => d.Doping === "" ? colors[0] : colors[1])
        .on("mouseover", (e, i) => {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0.9);
            tooltip.html("<div><span class='strongText'>" + i.Name + "</span>: " + i.Nationality +
                "</div><div>Year: " + i.Year + " Time: " + i.Time + "</div><p>" + i.Doping + "</p>"
            )
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY) + "px")
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);
        })

    svg.append('g')
        .call(xAxis)
        .attr("transform", "translate(0," + (h + marg) + ")")

    svg.append('g')
        .call(yAxis.ticks(5))
        .attr("transform", "translate(" + marg + ", 0)")



}