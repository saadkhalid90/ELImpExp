var margin = {top: 5, right: 10, bottom: 20, left: 10},
    width = (1400) - margin.left - margin.right,
    height = (300) - margin.top - margin.bottom;

let questionList = {
  Q1: 'I enjoy participating in my class',
  Q2: 'I feel that there is something very good and special in me',
  Q3: 'When I do not like something that someone does or says, I let them know',
  Q4: 'When I want somebody as my friend, I am able to go and start a conversation/talk',
  Q5: 'I ask questions when I do not understand something',
  Q6: 'I ask for help when I am unable to do something',
  Q7: 'I leave things mid-way if I get bored/tired',
  Q8: 'I like to try doing things which are hard/difficult to start with',
  Q9: 'I like to do things/tasks/activities which I haven’t done before',
  Q10: 'When I learn something I keep asking lot of questions to know more',
  Q11: "When solving a problem, my ideas/solutions are different from other's ideas/solutions",
  Q12: 'If I have a problem, I think of different ways to solve it',
  Q13: 'I think before doing something',
  Q14: 'I worry about my health',
  Q15: 'I feel burdened with my studies',
  Q16: 'I am able to express difficult feelings',
  Q17: 'I am able to control my anger'
};

let questionType = {
  Q1: 'Self confidence',
  Q2: 'Self confidence',
  Q3: 'Self confidence',
  Q4: 'Self confidence',
  Q5: 'Growth mindset',
  Q6: 'Growth mindset',
  Q7: 'Ability to achieve',
  Q8: 'Ability to achieve',
  Q9: 'Risk taking',
  Q10: 'Open mindedness and curiosity',
  Q11: "Out of the box thinking",
  Q12: 'Out of the box thinking',
  Q13: 'Self reflection',
  Q14: 'Health and wellbeing',
  Q15: 'Health and wellbeing',
  Q16: 'Emotional intelligence',
  Q17: 'Emotional intelligence'
}

var svg = d3.select('body').select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let ELData;
async function read(){
  ELData = await d3.csv('baseEndLab.csv')
  ELData = ELData.filter(d => d.Q1B != "NA");

  ELData.forEach(function(entry){
    entry.filt = 'true';
  })

  ELData = Rearr(ELData, {})

  draw(ELData, 'Q1');
  //Rearr(ELData, {City: "Mumbai", Program: "JFK", YOI: 1})
}

read();

let rectWidth = 4;
let curvRect = 1.5;
let barGrpGap = 20;
let widthGroupDiff = barGrpGap - rectWidth
let vertBarDist = 4
let question = 'Q9'

let scaleBand = d3.scaleBand()
                  .domain(d3.range(1,6).reverse())
                  .range([0, height])
                  .padding(2);

let fillRect = 'grey'


function draw(ELData, question){
    // remove all elements
    svg.selectAll('*').remove();

    // draw start
    svg.append('g')
    .attr('class', d => 'dotGroup ' + d)
    .attr('transform', `translate(${width/2 + widthGroupDiff/2}, 0)`)
    .selectAll('rect.dots')
    .data(ELData)
    .enter()
    .append('rect')
    .attr('x', (d,i) => {
      let datbefore = ELData.slice(0, i).map(entry => entry[`${question}E`]);
      let lenDatBefore = datbefore.filter(entry => entry == d[`${question}E`]).length;
      return lenDatBefore * rectWidth;
    })
    .attr('y', d => scaleBand(d[`${question}E`]))
    .attr('width', rectWidth)
    .attr('height', scaleBand.step() - vertBarDist)
    .attr('rx', curvRect)
    .attr('ry', curvRect)
    .attr('class', d => d.UID + " studentRect")
    .style('fill', fillRect)
    .style('stroke', 'white')
    .style('stroke-width', '0.5px')
    .style('fill-opacity', 0)
    .transition()
    .duration(50)
    .delay((d, i) => {
      return i * 2;
    })
    .style('fill-opacity', d => d.filt ? 1 : .3) ;

    svg.append('g')
    .attr('class', 'dotGroup')
    .attr('transform', `translate(${width/2 - widthGroupDiff/2 - rectWidth}, 0)`)
    .selectAll('rect.dots')
    .data(ELData)
    .enter()
    .append('rect')
    .attr('x', (d,i) => {
      let datbefore = ELData.slice(0, i).map(entry => entry[`${question}B`]);
      let lenDatBefore = datbefore.filter(entry => entry == d[`${question}B`]).length;
      return -(lenDatBefore * rectWidth);
    })
    .attr('y', d => scaleBand(d[`${question}B`]))
    .attr('width', rectWidth)
    .attr('height', scaleBand.step() - vertBarDist)
    .attr('rx', curvRect)
    .attr('ry', curvRect)
    .attr('class', d => d.UID + " studentRect")
    .style('fill', fillRect)
    .style('stroke', 'white')
    .style('stroke-width', '0.5px')
    .style('fill-opacity', 0)
    .transition()
    .duration(50)
    .delay((d, i) => {
      return i * 2;
    })
    .style('fill-opacity', d => d.filt ? 1 : .3) ;

    svg.append('g')
      .attr('class', 'labels')
      .attr('transform', `translate(${width/2}, 0)`)
      .selectAll('text')
      .data([1, 2, 3, 4, 5])
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', 0)
      .attr('y', d => scaleBand(d) + scaleBand.step()/2 + 4)
      .style('text-anchor', 'middle')

    svg.append('g')
      .attr('class', 'baseEndLabels')
      .attr('transform', `translate(${width/2}, 10)`)
      .selectAll('text')
      .data(['Baseline', 'Endline'])
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', d => d == 'Baseline' ? -25 : 25)
      .attr('y', 0)
      .style('text-anchor', d =>  d == 'Baseline' ? 'end' : 'start')
      .style('font-size', '16px')

    let filtData = ELData.filter(d => d.filt == true)
    let baselineDat = filtData.map(d => d[`${question}B`]);
    let endlineDat = filtData.map(d => d[`${question}E`]);

    let baseMean = roundToDigits(d3.mean(baselineDat), 2);
    let endMean = roundToDigits(d3.mean(endlineDat), 2);

    svg.append('g')
      .attr('class', 'baseEndAvgs')
      .attr('transform', `translate(${width/2}, 30)`)
      .selectAll('text')
      .data([`Avg: ${baseMean}`, `Avg: ${endMean}`])
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (d,i) => i == 0 ? -25 : 25)
      .attr('y', 0)
      .style('text-anchor', (d,i) =>  i == 0 ? 'end' : 'start')
      .style('font-size', '15px')
      .style('fill', function(d,i){
        if (['Q7', 'Q14', 'Q15'].includes(question)){
          return baseMean >= endMean ? 'blue' : 'red';
        }
        else {
          return baseMean < endMean ? 'blue' : 'red';
        }
      })

    // update question and question type based on input

    d3.select('p.questionP')
        .html(questionList[question] + ` <span class='questionTypeSpan'>(${questionType[question]})</span>`);


    d3.selectAll('rect.studentRect')
      .on('mouseover', mouseO(true, question))
      .on('mouseout', mouseO(false, question))

    function mouseO(over, question){
      return function(d, i){
        let hoveredClass = d3.select(this).attr('class').replace(" studentRect", "");
        d3.selectAll(`.${hoveredClass}`)
          .style('fill', (d, i) => {
            return over ? d3.rgb(fillRect).darker().darker()
             : fillRect
          })


        let tooltipDat = [
          {label: "ID", value: "UID"},
          {label: "Name", value: "Name"},
          {label: "Age", value: "Age"},
          {label: "City", value: "City"},
          {label: "Program", value: "Program"},
          {label: "Baseline", value: `${question}B`},
          {label: "Endline", value: `${question}E`},
        ];

        if (over){
          let hoverBox = d3.select('body').append('div')
            .classed('tool', true)
            .attr('id', 'hoverBox')

          hoverBox.style('left', function(){
                    if (d3.event.pageX > (window.width/2 + 10)){
                      if (d3.event.pageX + 325 > window.width){
                        return `${d3.event.pageX - 325}px`;
                      }
                      else{
                        return `${d3.event.pageX + 10}px`;
                      }

                    } else {
                      if (d3.event.pageX - 325 < 0){
                        return `${d3.event.pageX + 10}px`;
                      }
                      else {
                        return `${d3.event.pageX - 325}px`;
                      }
                    }
                  })
                  .style('top', `${d3.event.pageY - 30}px` );

          hoverBox.selectAll('div')
                  .data(tooltipDat)
                  .enter()
                  .append('div')
                  .attr('class', 'toolRow')
                  .html(entry => `<span class = "Label">${entry.label}</span><span class = "Value">${d[entry.value]}</span>`);

          console.log(document.getElementById('hoverBox').getBoundingClientRect());
        }
        else {
          d3.select('#hoverBox').remove();
        }
      }
    }
}

function Rearr(data, filtObj){
  // filter function
  function filtFunc(d, type){
    // individual logicals
    let cityLog =  filtObj.City == null ? true : d.City == filtObj.City ;
    let sexLog = filtObj.Sex == null ? true : d.Gender == filtObj.Sex;
    let progLog = filtObj.Program == null ? true : d.Program == filtObj.Program;
    let yoiLog = filtObj.YOI == null ? true : d["Year of Intervention"] == filtObj.YOI;


    // combined logical
    let logical =  cityLog & sexLog & progLog & yoiLog;
    if (type == "filt"){
      d.filt = logical ? true : false;
      return logical
    }
    else {
      return !logical
    }
  }

  let filtDat = data.filter(d => filtFunc(d, "filt"));
  let nonFiltDat = data.filter(d => filtFunc(d, "nonFilt"));


  return filtDat.concat(nonFiltDat);
}

d3.selectAll('.selector').on('input', function(d, i){
  let question = getValSel('.selector.questSelect');
  let city = getValSel('.selector.citySelect')
  city = city == "null" ? null : city;
  let sex = getValSel('.selector.sexSelect')
  sex = sex == "null" ? null : sex;
  let program = getValSel('.selector.programSelect');
  program = program == "null" ? null : program;
  let yoi = getValSel('.selector.yoiSelect');
  yoi = yoi == "null" ? null : yoi;

  function getValSel(selection){
    return d3.select(selection).node().value
  }

  let RearrData = Rearr(ELData, {
    City: city,
    Sex: sex,
    Program: program,
    YOI: yoi
  })


  draw(RearrData, question)
})

function roundToDigits(number, digit){
  return Math.round(number * (10 ** digit))/(10 ** digit)
}
