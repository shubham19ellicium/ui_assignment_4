let LEVEL_0 = "T0"
let LEVEL_1 = "T1"
let LEVEL_2 = "T2"


const fetchData = async() =>{
    const response = await fetch('http://localhost:3000/data')
    const jsonData = await response.json();
    return jsonData
}

var obj = []
var arr1 = []
function getFirstData(details){
    arr1.push({"name": details.Company_Name})
    return arr1
}

async function getData(){
    let data = await fetchData()
    data.forEach(detail => {
        if (detail.Level == LEVEL_0) {
            obj.push({
                "name":detail.Company_Name,
                "children": []
            })
        }
        if (detail.Level == LEVEL_1 ) {
            obj[0].children.push({
                "name":detail.Company_Name,
                "children": []
            })
        }
    });

    console.log("OBJECT :: ",JSON.stringify(obj, null, 2));
}

getData()



