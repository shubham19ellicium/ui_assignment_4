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

var transformedArray = [];

var root = am5.Root.new("chartdiv");

root.setThemes([am5themes_Animated.new(root)]);

function formatStringBracket(string){
  var regex = / \(.*?\)/g; 
  if (regex.test(string)) {
    // console.log(` Needed :: ${string}`);
    var result = string.replace(regex, "");
    var trimedResult = result.trim()
    return trimedResult
  }
  return string
}

function transformData(inputData) {
  var transformedData = {
    name: "Root",
    children: [],
  };

  var companyNodes = {};
  inputData.forEach(function (item) {
    var node = {
      name: item.Company_Name,
      children: [],
      value: 0,
    };
    if (item.Level === "T1") {
      let node = {
        name: formatStringBracket(item.Company_Name),
        children: [],
        value: 0,
      };
      companyNodes[formatStringBracket(item.Company_Name)] = node;  
    }else{
      companyNodes[item.Company_Name] = node;
    }
  });
  // console.log("DATA :: ",JSON.stringify(companyNodes, null, 2));
  inputData.forEach(function (item) {

    // Check if the company node exists in companyNodes
    if (companyNodes[item.Company_Name]) {
        // If Parent is empty, add the current company node to the root level of transformedData
        if (item.Parent === "") {
            transformedData.children.push(companyNodes[item.Company_Name]);
        } else {
            // If the parent company node exists, add the current company node as its child
            if (companyNodes[item.Parent]) {
                companyNodes[item.Parent].children.push(companyNodes[item.Company_Name]);
            } else {
                // Handle the case where the parent node doesn't exist
                console.log("Parent node does not exist for ", item.Company_Name);
            }
        }
    } else {
        // Handle the case where the company node doesn't exist
        console.log("Company node does not exist for ", item.Company_Name);
    }
});

// -------------------------------------------------
// inputData.forEach(function (item) {
//   const parentCompanyName = item.Parent.split('(')[0].trim();
//   console.log("---------------> ",parentCompanyName);
//   if (item.Parent === "") {
//     transformedData.children.push(companyNodes[item.Company_Name]);
//   } else if (companyNodes[parentCompanyName]) {
//     companyNodes[parentCompanyName].children.push(companyNodes[item.Company_Name]);
//   } 
// });
// --------------------------------------------------------

  transformedData.children.push(companyNodes);

  return transformedData;
}


const fetchData = async () => {
  const response = await fetch("http://localhost:3000/data");
  const jsonData = await response.json();
  return jsonData;
};

async function getData() {
  let data = await fetchData();
  var chartData = transformData(data);
  // console.log("CHART DATA :: ",JSON.stringify(chartData, null, 2));
  
  transformedArray.push(chartData);

  createChart(chartData.children)
}

getData();

function clearSelectOptions(selectElement) {
  while (selectElement.options.length > 0) {
      selectElement.remove(0);

    }
    var defaultOption = document.createElement("option");
    defaultOption.text = "Select option";
    defaultOption.value = "none";
    selectElement.add(defaultOption);
}

function createChart(data) {
  root.container.children.clear();

  var container = root.container.children.push(
    am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout,
    })
  );

  var series = container.children.push(
    am5hierarchy.Tree.new(root, {
      downDepth: 1,
      initialDepth: 5,
      topDepth: 0,
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      orientation: "vertical",
    })
  );

  series.data.setAll(data);
  // series.set("selectedDataItem", series.dataItems[0]);
}

function handleSelectChange() {
  var data = [
    {
      name: "Root",
      children: [
        {
          name: "Alight Solutions LLC",
          value: 0,
          children: [],
        },
      ],
    },
  ];

  var selection = document.getElementById("select-level-id");

  if (selection.value === "T0") {
    createChart(data[0].children)
  }else if (selection.value === "T1") {
    var t1Array = transformedArray[0]["children"][0]["children"];
    t1Array.forEach((element) => {
      data[0].children[0].children.push({ name: element.name });
      data[0].children[0].value += 1;
    });
    createChart(data[0].children)
  }else {
    getData()
  }

  var loadT1List = document.getElementById("load-t1-selection");

  var selection = document.getElementById("select-level-id");

  var t0Array = transformedArray[0]["children"];
  var t1Array = transformedArray[0]["children"][0]["children"];
  if (selection.value === "T0") {
    clearSelectOptions(loadT1List)
    t0Array.forEach((data, index) => {
      var newOption = document.createElement("option");
      newOption.text = data.name;
      newOption.value = index;
      loadT1List.add(newOption);
    });
  } else  {
    clearSelectOptions(loadT1List)
    t1Array.forEach((data, index) => {
      var newOption = document.createElement("option");
      newOption.text = data.name;
      newOption.value = index;
      loadT1List.add(newOption);
    });
  }
  var load3 = document.getElementById("load-t2-selection")
  if (selection.value === "T2") {
    load3.style.display ="inline-block"
  }else{
    load3.style.display ="none"
  }

}

/* ------------------ backup code for review ------------------ */

// function selectedLevel() {
//   var selection = document.getElementById("select-level-id");
//   var loadT1List = document.getElementById("load-t1-selection");

//   var t0Array = transformedArray[0]["children"];
//   var t1Array = transformedArray[0]["children"][0]["children"];

//   if (selection.value === "T0") {
//     // clearOption(loadT1List)
//     t0Array.forEach((data, index) => {
//       var newOption = document.createElement("option");
//       newOption.text = data.name;
//       newOption.value = index;
//       loadT1List.add(newOption);
//     });
//   } else if (selection.value === "T1") {
//     // clearOption(loadT1List)
//     t1Array.forEach((data, index) => {
//       var newOption = document.createElement("option");
//       newOption.text = data.name;
//       newOption.value = index;
//       loadT1List.add(newOption);
//     });
//   }
// }

function selectedT1Level() {
  var data = [
    {
      name: "Alight Solutions LLC",
      value: 0,
      children: [],
    },
  ];
  var loadT1List = document.getElementById("load-t1-selection");
  var text = loadT1List.options[loadT1List.selectedIndex].text;
  
  var t0Array = transformedArray[0]["children"][0].children;
  t0Array.forEach((element) => {
    if (element.name === `${text}`) {
      data[0].children.push({ name: element.name });
      data[0].children[0].value += 1;
    }
  });

    root.container.children.clear();

    var container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
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
        orientation: "vertical",
      })
    );
    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);

    var load3 = document.getElementById("load-t2-selection")
    // clearOption(load3)

    var third = transformedArray[0]["children"][0].children[`${loadT1List.value}`]['children'];
    console.log("LOAD T1 LIST :: ",loadT1List.value);
    console.log("Third :: ",JSON.stringify(third,null,2));
    clearSelectOptions(load3)
    third.forEach((element,index) => {
      var newOption = document.createElement("option");
        newOption.text = element.name;
        newOption.value = index;
        load3.add(newOption);
    });
}

function selectedT2Level(){

  var data = [
    {
      name: "Alight Solutions LLC",
      value: 0,
      children: [],
    },
  ];

  var loadT1List = document.getElementById("load-t1-selection");
  var text1 = loadT1List.options[loadT1List.selectedIndex].text;

  var loadT2List = document.getElementById("load-t2-selection");
  var text2 = loadT2List.options[loadT2List.selectedIndex].text;

  var second =transformedArray[0]["children"][0].children[`${loadT1List.value}`]
  console.log("Second :: ",JSON.stringify(second,null,2));

  var third = transformedArray[0]["children"][0].children[`${loadT1List.value}`].children[`${loadT2List.value}`];
  // console.log("Third :: ",JSON.stringify(third,null,2));

  data[0].children.push({
    name:second.name,
    children:[
      third
    ],
    value:100
  })

  root.container.children.clear();

    var container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
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
        orientation: "vertical",
      })
    );
    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);

}
