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

function formateStringAuth(string){
  var regex = /\((?=.*:)([A-Z0-9:]+)\)/;
  if (regex.test(string)) {
    var result = string.replace(regex, '').trim();
    return result
  }
  return string
}

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
      name: formateStringAuth(item.Company_Name),
      children: [],
      value: 0,
      level:item.Level
    };
    if (item.Level === "T1") {
      let node = {
        name: formateStringAuth(item.Company_Name),
        children: [],
        value: 0,
        level:item.Level
      };
      companyNodes[formateStringAuth(item.Company_Name)] = node;  
      
    }else{
      companyNodes[formateStringAuth(item.Company_Name)] = node;
    }
  });
  inputData.forEach(function (item) {
    // const parentCompanyName = item.Parent.split('(')[0].trim();
    // const companyName = item.Company_Name.split('(')[0].trim();
    const parentCompanyName = formateStringAuth(item.Parent)
    const companyName = formateStringAuth(item.Company_Name)
    if (companyNodes[companyName]) {
      // console.log(" :--------> ",companyName);
        if (item.Parent === "") {
            transformedData.children.push(companyNodes[companyName]);
        } else {
            if (companyNodes[parentCompanyName]) {
                companyNodes[parentCompanyName].children.push(companyNodes[companyName]);
                companyNodes[parentCompanyName].value += 1;
                // companyNodes[parentCompanyName].level = item.Level
            } else {
                // console.log("Parent node does not exist for ", item.Company_Name);
            }
        }
    }
});
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
  // console.log(chartData);
  // console.log(chartData.children);
  
  console.log("CHART --> ",chartData.children[0]);  
  
  transformedArray.push(chartData);

  createChart([chartData.children[0]])
  
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
  // series.get("colors").set("colors", [
  //   am5.color(0x095256),
  //   am5.color(0x087f8c),
  //   am5.color(0x5aaa95),
  //   am5.color(0x86a873),
  //   am5.color(0xbb9f06)
  // ]);
  
  // if(element.value == 10){
  //   series.circles.template.setAll({
      // radius: 20,
      // fill: am5.color(0x150000),
  //   });
  // }
  
  series.circles.template.adapters.add("fill", function(fill, target) {
    // console.log(target.dataItem.dataContext.level)
    if (target.dataItem.dataContext.level === 'T1') {
      return am5.color(0x1a4eff);
    } else if (target.dataItem.dataContext.level === 'T2') {
      return am5.color(0x333333);
    } {
      return am5.color(0xff581a)
    }
    
  });

  series.links.template.adapters.add("stroke", function(fill, target) {
    // console.log(target.dataItem.dataContext.level)
    if (target.dataItem.dataContext.level === 'T1') {
      return am5.color(0x5d95ff);
    } else if (target.dataItem.dataContext.level === 'T2') {
      return am5.color(0x5d95ff);
    } {
      return am5.color(0x5d95ff)
    }
  });

  series.links.template.setAll({
    strokeWidth: 1,
    strokeOpacity: 0.5,
  });

  
  // series.on('visible', function (visible, target) {
  //   if (visible) {
  //     console.log("TARGET :: --> ",target);
  //     target.links.each(function (link) {
  //       link.set('color', am5.Color.fromString('#da2b2b'));
  //       link.set('stroke', am5.Color.fromString('#da2b2b'));
  //     });
  //   }
  // });

  series.data.setAll(data);
  // console.log("IDENTIFY : ",data[0].children);
  // const found = data[0].children.find((element) => {
  //   if(element.level == "T0"){

  //   }

  // })


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

  var dataBoiler = [
    {
      name: "Alight Solutions LLC",
      value: 0,
      children: [],
    }
  ]

  var selection = document.getElementById("select-level-id");
  
  if (selection.value === "T0") {
    createChart(data[0].children)
  }else if (selection.value === "T1") {
    var t1Array = transformedArray[0]["children"][0]["children"];
    t1Array.forEach((element) => {
      dataBoiler[0].children.push({ name: element.name });
      dataBoiler[0].value += 1;
    });
    createChart(dataBoiler[0])
  }else {
    // getData()
  }

  var loadT1List = document.getElementById("load-t1-selection");

  var selection = document.getElementById("select-level-id");

  var t0Array = transformedArray[0]["children"];
  var t1Array = transformedArray[0]["children"][0]["children"];
  if (selection.value === "T0") {
    // clearSelectOptions(loadT1List)
    // t0Array.forEach((data, index) => {
    //   var newOption = document.createElement("option");
    //   newOption.text = data.name;
    //   newOption.value = index;
    //   loadT1List.add(newOption);
    // });
  } else if(selection.value === "T1"){
    // console.log("loadT1List ---> ",loadT1List.options.length);
    if (loadT1List.options.length>1) {
      
    }else{
      // console.log("CHANGING LIST 1");
      clearSelectOptions(loadT1List)
      t1Array.forEach((data, index) => {
        var newOption = document.createElement("option");
        newOption.text = data.name;
        newOption.value = index;
        loadT1List.add(newOption);
      });    
    }

    var loadT1List = document.getElementById("load-t1-selection");
    var second =transformedArray[0]["children"][0].children[`${loadT1List.value}`]
    // console.log("SECOND :: ",JSON.stringify(transformedArray[0]["children"][0].children[`${loadT1List.value}`],null,2));
    if (second) {
      data[0].children[0].children.push({
        name:second.name,
      })
      createChart(data)
    }

  } else  {
    // clearSelectOptions(loadT1List)
    // t1Array.forEach((data, index) => {
    //   var newOption = document.createElement("option");
    //   newOption.text = data.name;
    //   newOption.value = index;
    //   loadT1List.add(newOption);
    // });

    if (loadT1List.options.length>1) {
      
    }else{
      // console.log("CHANGING LIST 11");
      clearSelectOptions(loadT1List)
      t1Array.forEach((data, index) => {
        var newOption = document.createElement("option");
        newOption.text = data.name;
        newOption.value = index;
        loadT1List.add(newOption);
      });
    }

    
  }
  var load3 = document.getElementById("load-t2-selection")
  if (selection.value === "none") {
    loadT1List.style.display = "none"
  }else if (selection.value === "T0") {
    loadT1List.style.display ="none"
  }else{
    loadT1List.style.display ="inline-block"
  }

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
        // valueField: "value",
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
    // console.log("LOAD T1 LIST :: ",loadT1List.value);
    // console.log("Third :: ",JSON.stringify(third,null,2));
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
  // console.log("Second :: ",JSON.stringify(second,null,2));

  var third = transformedArray[0]["children"][0].children[`${loadT1List.value}`].children[`${loadT2List.value}`];
  // console.log("Third :: ",JSON.stringify(third,null,2));

  data[0].children.push({
    name:second.name,
    children:[
      third
    ]
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
        // valueField: "value",
        categoryField: "name",
        childDataField: "children",
        orientation: "vertical",
      })
    );
    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);

}
