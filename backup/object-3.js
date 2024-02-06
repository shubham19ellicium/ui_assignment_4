function transformData(inputData) {
  var transformedData = {
    name: "Root",
    children: []
  };

  var companyNodes = {};
  inputData.forEach(function (item) {
    var node = {
      name: item.Company_Name,
      children: []
    };
    companyNodes[item.Company_Name] = node;
  });
  console.log("COMPANY NODE :: ",companyNodes);
  inputData.forEach(function (item) {
    if (item.Parent === "") {
      transformedData.children.push(companyNodes[item.Company_Name]);
    } else if (companyNodes[item.Parent]) {
      companyNodes[item.Parent].children.push(companyNodes[item.Company_Name]);
    } else {
      console.error("Parent not found for:", item.Company_Name);
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
  console.log(JSON.stringify(chartData, null, 2));
  return chartData
}



getData()

