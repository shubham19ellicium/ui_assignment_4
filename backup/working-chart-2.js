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
    const parentCompanyName = formateStringAuth(item.Parent)
    const companyName = formateStringAuth(item.Company_Name)
    if (companyNodes[companyName]) {
        if (item.Parent === "") {
            transformedData.children.push(companyNodes[companyName]);
        } else {
            if (companyNodes[parentCompanyName]) {
                companyNodes[parentCompanyName].children.push(companyNodes[companyName]);
                companyNodes[parentCompanyName].value += 1;
            } else {
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
    
    if (target.dataItem.dataContext.level === 'T1') {
      return am5.color(0x1a4eff);
    } else if (target.dataItem.dataContext.level === 'T2') {
      return am5.color(0x333333);
    } {
      return am5.color(0xff581a)
    }
    
  });

  series.links.template.adapters.add("stroke", function(fill, target) {
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
  
  series.data.setAll(data);
  
  
}

function createAlternateChart(series,data,nodeName){
  series.circles.template.adapters.add("fill", function(fill, target) {
    
    if (target.dataItem.dataContext.level === 'T1') {
      return am5.color(0x1a4eff);
    } else if (target.dataItem.dataContext.level === 'T2') {
      return am5.color(0x333333);
    } {
      return am5.color(0xff581a)
    }
    
  });

  series.links.template.adapters.add("stroke", function(fill, target) {
    if (target.dataItem.dataContext.level === 'T1') {
      return am5.color(0x5d95ff);
    } else if (target.dataItem.dataContext.level === 'T2') {
      return am5.color(0x5d95ff);
    } {
      return am5.color(0x5d95ff)
    }
  });

  series.outerCircles.template.adapters.add("stroke", function(stroke, target) {
      if (target.dataItem.dataContext.name === nodeName) {
        return am5.color(0x000000);
      }
      
    });

    series.outerCircles.template.adapters.add("radius", function(redius, target) {
      if (target.dataItem.dataContext.name === nodeName) {
        return 25;
      }
      
    });
    series.links.template.setAll({
      strokeWidth: 1,
      strokeOpacity: 0.5,
    });
    series.data.setAll(data);
}

function clearArray(array){
  if (array) {
    while(array.length>0){
      array.pop(1)
    }
  }
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
  
  if (selection.value === "none") {
    getData()
  }else if (selection.value === "T0") {
    createChart(data[0].children)
  }else if (selection.value === "T1") {
    
  }else {

  }

  var loadT1List = document.getElementById("load-t1-selection");

  var selection = document.getElementById("select-level-id");

  var t0Array = transformedArray[0]["children"];
  var t1Array = transformedArray[0]["children"][0]["children"];
  if (selection.value === "T0") {
    
  } else if(selection.value === "T1"){
    if (loadT1List.options.length>1) {
      
    }else{
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
    if (second) {
      data[0].children[0].children.push({
        name:second.name,
        level:second.level
      })
      clearArray(data[0])
      createChart(data[0].children)
    }else{
      t1Array.forEach((element) => {
        data[0].children[0].children.push({ name: element.name,level:element.level });
        data[0].children[0].value += 1;
      });
      createChart(data[0].children)
    }

  } else  {
    
    if (loadT1List.options.length>1) {
      
    }else{
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

function searchNode(){
  var searchInputId = document.getElementById("node-search-id")
  var nodeName = searchInputId.value
  var data = transformedArray
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
  )
    createAlternateChart(series,data[0].children,nodeName)
  
}


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
  var baseArray = transformedArray[0]["children"][0].children;
  var t0Array = transformedArray[0]["children"][0].children;
  if (text === "Select option") {
    baseArray.forEach((element) => {
      data[0].children.push({ name: element.name,level:element.level });
      data[0].children[0].value += 1;
    });
    createChart(data[0].children)
  }
  t0Array.forEach((element) => {
    if (element.name === `${text}`) {
      data[0].children.push({ name: element.name,level: element.level });
      data[0].children[0].value += 1;
      
    }
  });
  createChart(data)

    var load3 = document.getElementById("load-t2-selection")
    if (loadT1List.value != "none") {
      load3.style.display = "inline-block"
      var third = transformedArray[0]["children"][0].children[`${loadT1List.value}`]['children'];
      clearSelectOptions(load3)
      third.forEach((element,index) => {
        var newOption = document.createElement("option");
          newOption.text = element.name;
          newOption.value = index;
          load3.add(newOption);
      });
      
    }else if (loadT1List.value == "none") {
      load3.style.display = "none"
    }
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

  var third = transformedArray[0]["children"][0].children[`${loadT1List.value}`].children[`${loadT2List.value}`];

  data[0].children.push({
    name:second.name,
    level:second.level,
    children:[
      third
    ]
  })
  createChart(data)

}
