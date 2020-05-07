a = {
  axis: {
    0: {
      title: 'hits'
    },
    1: {
      title: 'seconds'
    },
    2: {
      title: 'clicks'
    }
  },
  type: 'bar',
  height: 400,
  title: "Cool Chart",
  data: [{
    title: "Run Time (s)",
    axis: 0,
    type: "bar",
    units: "(s)",
    data: [{
      title: "Stack 1",
      data: 12
    }, {
      title: "Stack 2",
      data: 30
    }, {
      title: "Stack 3",
      data: 9
    }, {
      title: "Stack 4",
      data: 17
    }, {
      title: "Stack 5",
      data: 21
    }, {
      title: "Stack 6",
      data: 28
    }, {
      title: "Stack 7",
      data: 7
    }, {
      title: "Stack 8",
      data: 0
    }, {
      title: "Stack 9",
      data: 3
    }]
  }, {
    title: "Runs",
    type: "bar",
    axis: 1,
    data: [{
      title: "Stack 1",
      data: 641
    }, {
      title: "Stack 2",
      data: 249
    }, {
      title: "Stack 3",
      data: 194
    }, {
      title: "Stack 4",
      data: 165
    }, {
      title: "Stack 5",
      data: 84
    }, {
      title: "Stack 6",
      data: 71
    }, {
      title: "Stack 7",
      data: 36
    }, {
      title: "Stack 8",
      data: 30
    }, {
      title: "Stack 9",
      data: 26
    }],
  }, {
    title: "Clicks",
    type: "line",
    axis: 2,
    data: [{
      title: "Stack 1",
      data: 61
    }, {
      title: "Stack 2",
      data: 29
    }, {
      title: "Stack 3",
      data: 14
    }, {
      title: "Stack 4",
      data: 15
    }, {
      title: "Stack 5",
      data: 8
    }, {
      title: "Stack 6",
      data: 1
    }, {
      title: "Stack 7",
      data: 6
    }, {
      title: "Stack 8",
      data: 0
    }, {
      title: "Stack 9",
      data: 6
    }],
  }],
  options: {
    legend: false
  }
};

var d = document;

var dest = document.getElementsByClassName('chart')[0];
var chart = JSON.parse(JSON.stringify(a));
var height = chart.height || 400;
var options = chart.options;
var charts = chart.data;
var axis = chart.axis;
var html = '';
var table = d.createElement('table');

table.style.height = height + 'px';
table.classList.add('chart')

table.innerHTML = '<caption class="chart-caption">' + chart.title


if (options.legend !== 'false') {
  html = '<thead class="chart-head">'
  for (var c in charts) html += '<th><span class="chart-headClr"></span>' + charts[c].title
}
table.innerHTML += html;
// max columns in chart
var cols = 0;
for (var c in charts) {
  cols = Math.max(cols, charts[c].data.length);
}

var axii = []
for (var c in charts) {
  if (axii.indexOf(charts[c].axis) == -1) axii.push(charts[c].axis)
}
var width = dest.clientWidth - (50 * axii.length);
// table padding left = axii/2
table.style.marginLeft = (Math.floor(axii.length / 2) + axii.length % 2) * 50 + 'px';
if (axii.length > 1) table.style.marginRight = Math.floor(axii.length / 2) * 50 + 'px';

// create range for axis
var range = {};
for (var a in axii) {
  var maxValue = 0;
  var minValue = 0;

  for (var c in charts) {
    if (charts[c].axis !== axii[a]) continue;

    var chart = charts[c]

    for (var d in chart.data) {
      maxValue = Math.max(maxValue, parseFloat(chart.data[d].data))
      minValue = Math.min(minValue, parseFloat(chart.data[d].data))
    }
  }

  // update charts w/ numbers
  for (var c in charts) {
    if (charts[c].axis == axii[a]) {
      charts[c].range = maxValue - minValue;
      charts[c].max = maxValue;
      charts[c].min = minValue;
    }
  }
  range[a] = maxValue - minValue;
}




// # of bar charts
var bars = 0;
for (var c in charts) {
  chart.lastlinePointY = null;
  chart.lastlinePointX = null;
  bars += charts[c].type == 'bar' ? 1 : 0
}
var colWidth = width / width / cols * 100; // as %

// build chart bars
html = '<tbody>'
for (var d = 0; d < cols; d++) {

  // create point element
  html += '<tr class="chart-col" style="left:' + (colWidth * d) + '%;width:calc(' + colWidth + '% - 10px);">'
  var barnum = 0;
  for (var c in charts) {
    var chart = charts[c]

    var lheight = parseFloat(chart.data[d].data) == 0 ? 0 : parseFloat(chart.data[d].data) / chart.range * 100
    var lwidth = "calc(" + 100 / bars + '% - 5px)';
    if (c == 0) html += '<th class="chart-xAxisTitle" scope="row">' + chart.data[d].title;

    var p = lheight / 100 * height < 30 ? 'style="margin-top:-22px"' : ""
    if (chart.type == 'bar') html += '<td class="chart-' + chart.type + '" style="height:' + lheight + '%;width:' + lwidth + ';left:' + barnum / bars * 100 + '%"><p ' + p + '>' + chart.data[d].data
    if (chart.type == 'line') {



      html += '<td class="chart-' + chart.type + '" style="height:' + lheight + '%">'
      html += '<p ' + p + '>' + chart.data[d].data + '</p>';
      console.log(chart.lastlinePointY)
      if (!!chart.lastlinePointY || chart.lastlinePointY == 0) {
        var w = ((colWidth) / 100 * width + 16);
        var angle = Math.atan2(lheight / 100 * height - chart.lastlinePointY, -w) * 180 / Math.PI;
        var distance = Math.sqrt(Math.pow((w), 2) + Math.pow((lheight / 100 * height - chart.lastlinePointY), 2));
        html += '<div style="width:' + (distance) + 'px;transform: rotate(' + angle + 'deg);"></div>'
      }
      chart.lastlinePointY = lheight / 100 * height;
    }
    if (chart.type == 'bar') barnum++;
  }

}
table.innerHTML += html;

// build grid
html = '<div class="chart-ticks">';
console.log(axii)
for (var a in axii) {
  var style = (Math.floor(a / 2) + 1) * 50;
  var side = a % 2 == 1 ? 'right' : 'left';
  if (typeof axis[a] != 'undefined') {
    html += '<div class="chart-yAxisTitle" style="' + side + ':-' + style + 'px"><p>' + axis[a].title + '</p></div>'
  }
}

// scale. make every 50px
var ticks = parseInt(height / 50);
for (var x = 1; x <= ticks; x++) {
  html += '<div class="chart-ticksTick">'
  for (var a in range) {
    var style = (Math.floor(a / 2) + 1) * (a % 2 == 1 ? 25 : 25) + (Math.floor(a / 2) > 0 ? 30 : 0);
    var side = a % 2 == 1 ? 'right' : 'left';
    html += '<p style="' + side + ':-' + style + 'px">' + Math.round((range[a] / x)) + '</p>'
  }
  html += '</div>'
}


table.innerHTML += html;
dest.appendChild(table)
