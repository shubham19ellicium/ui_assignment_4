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

var transformedArray = []

var root = am5.Root.new("chartdiv");

root.setThemes([
  am5themes_Animated.new(root)
]);

function transformData(inputData) {
  var transformedData = {
    name: "Root",
    children: []
  };

  var companyNodes = {};
  inputData.forEach(function (item) {
    var node = {
      name: item.Company_Name,
      children: [],
      value : 0
    };
    companyNodes[item.Company_Name] = node;
  });
  console.log(JSON.stringify(companyNodes, null, 2));
  inputData.forEach(function (item) {
    if (item.Parent === "") {
      transformedData.children.push(companyNodes[item.Company_Name]);
    } else if (companyNodes[item.Parent]) {
      companyNodes[item.Parent].children.push(companyNodes[item.Company_Name]);
      companyNodes[item.Parent].value += 1;
    }else {
      // console.error("Parent not found for:", item.Company_Name);
    }

    
  });

  return transformedData;
}

const fetchData = async() =>{
  const response = await fetch('http://localhost:3000/data')
  const jsonData = await response.json();
  return jsonData  
}

async function getData(){
  let data = await fetchData()
  var chartData = transformData(data);
  
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
      orientation: "vertical"
    })
  );

  transformedArray.push(chartData)
  
  // console.log(JSON.stringify(chartData, null, 2));
  const finalArray = [chartData]
  series.data.setAll(finalArray);
  series.set("selectedDataItem", series.dataItems[0]);

  
}

getData()

function clearOption(options){
  while (options.options.length > 0) {                
    options.remove(0);
  } 
}

function selectedLevel() {
  var selection = document.getElementById("select-level-id")
  var loadT1List = document.getElementById("load-t1-selection")
  console.log("SELECTION :: ",selection.value)
  // console.log("TRANSFROMED ARRAY :: ",(JSON.stringify(transformedArray, null, 2)))

  var t0Array = transformedArray[0]['children']
  var t1Array = transformedArray[0]['children'][0]['children']
  // console.log(" -> ARRAY :: ",(JSON.stringify(t1Array, null, 2)))

  if (selection.value === "T0") {
    console.log(" IN TO ");
    // clearOption(loadT1List)
    t0Array.forEach((data,index)=>{
      var newOption = document.createElement("option");
      newOption.text = data.name;
      newOption.value = index
      loadT1List.add(newOption);
    })
  }else if (selection.value === "T1") {
    console.log(" IN T1 ");
    // clearOption(loadT1List)
    t1Array.forEach((data,index)=>{
      var newOption = document.createElement("option");
      newOption.text = data.name;
      newOption.value = index
      loadT1List.add(newOption);
    })
  }

  
}

function selectedT1Level(){
  var data = [
    {
      name: "Root",
      children: [
        {
          name: "Alight Solutions LLC",
          value:0,
          children: [
            
          ]
        }
      ]
    }
  ]
  var loadT1List = document.getElementById("load-t1-selection")
  // var loadT2List = document.getElementById("load-t2-selection")
  console.log("LIST :: ",loadT1List.value);
  if (loadT1List.value == 0) {
    var t0Array = transformedArray[0]['children'][0].children
    console.log("T0 DATA :: ",JSON.stringify(t1Array, null, 2))
    t0Array.forEach(element =>{
      data[0].children[0].children.push({"name":element.name})
      data[0].children[0].value += 1
    })

    root.container.children.clear();
  
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
        orientation: "vertical"
      })
    );
    
    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);

  }else if (loadT1List.value == 1) {
    var t1Array = transformedArray[0]['children'][0]['children'][`${loadT1List.value}`]['children']
    t1Array.forEach(element =>{
      data[0].children[0].children.push({"name":element.name})
      data[0].children[0].value += 1
    })
   
    root.container.children.clear();
  
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
        orientation: "vertical"
      })
    );
    
    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);
  }

  

    // -------------------

    // var t2Array = transformedArray[0]['children'][0]['children'][`${loadT1List.value}`]['children']
    // t2Array.forEach((data,index)=>{
    //   var newOption = document.createElement("option");
    //   newOption.text = data.name;
    //   newOption.value = index
    //   loadT2List.add(newOption);
    // })

}

function selectedT2Level() {
  var loadT1List = document.getElementById("load-t1-selection")
  var loadT2List = document.getElementById("load-t2-selection")

  var data = [
    {
      name: "Root",
      children: [
        {
          name: "Alight Solutions LLC",
          children: [
            
          ]
        }
      ]
    }
  ]

  var node = {
    name : loadT1List.options[loadT1List.selectedIndex].text,
    children : []
  }

  var t2Array = transformedArray[0]['children'][0]['children'][`${loadT1List.value}`]['children']
  for (let index = 0; index < t2Array.length; index++) {
    const element = t2Array[index];
    console.log("ELEMENT :: ",element.name);
    node['children'].push({name:element.name})
  }

  data[0].children[0].children.push(node)
  
  root.container.children.clear();

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
      orientation: "vertical"
    })
  );
    console.log("TRANSFORMED DATA :: ",JSON.stringify(transformedArray, null, 2))
    console.log("--------------------------------------------------------------------------");
  console.log("DATA TO PASS ",JSON.stringify(data, null, 2));
  
  series.data.setAll(data);
  series.set("selectedDataItem", series.dataItems[0]);


}