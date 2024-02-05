/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Create root and chart
var root = am5.Root.new("chartdiv");

root.setThemes([
  am5themes_Animated.new(root)
]);

var data = [{
  name: "Root",
  children: [{
    name: "A0",
    children: [{
      name: "A00",
      value: 88
    }, {
      name: "A01",
      value: 23
    }, {
      name: "A02",
      value: 25
    }]
  }, {
    name: "B0",
    children: [{
      name: "B10",
      value: 62
    }, {
      name: "B11",
      value: 4
    }]
  }, {
    name: "C0",
    children: [{
      name: "C20",
      value: 11
    }, {
      name: "C21",
      value: 92
    }, {
      name: "C22",
      value: 17
    }]
  }, {
    name: "D0",
    children: [{
      name: "D30",
      value: 95
    }, {
      name: "D31",
      value: 84
    }, {
      name: "D32",
      value: 75
    }]
  }]
}];


var container = root.container.children.push(
  am5.Container.new(root, {
    width: am5.percent(100),
    height: am5.percent(100),
    layout: root.verticalLayout
  })
);

var series = container.children.push(
  am5hierarchy.Tree.new(root, {
    singleBranchOnly: false,
    downDepth: 1,
    initialDepth: 5,
    topDepth: 0,
    valueField: "value",
    categoryField: "name",
    childDataField: "children",
    orientation: "horizontal"
  })
);

series.data.setAll(data);
series.set("selectedDataItem", series.dataItems[0]);