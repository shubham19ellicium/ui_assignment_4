var storeArray = []
var wrapper = document.getElementById("table-wrapper-id")

let pageCount = 10
let pageNumber = 1
let pageEndIndex ='' ;

let filterCount = 10
let filterNumber = 1
let filteeEndIndex = ''

var background = document.getElementById("container")
var popUpId = document.getElementById("pop-for-upload")
var popUpUpdateId = document.getElementById("pop-up-update-id")
var responseJsonLength ;

var updatedCheckId ;

window.onload = function() {
    var selectedValue = document.getElementById("select-option-id");
    console.log("RUN AFTER RELOAD");
    if (sessionStorage.getItem("page-number") != null && sessionStorage.getItem("page-count") != null) {
        pageNumber = parseInt(sessionStorage.getItem("page-number"), 10)
        pageCount = parseInt(sessionStorage.getItem("page-count"),10)
        selectedValue.value = parseInt(sessionStorage.getItem("page-total-list"),10)
        selectedValue.options[selectedValue.selectedIndex].text = sessionStorage.getItem("page-total-list")
        sessionStorage.clear()
    }
}


const fetchData = async() =>{
    const response = await fetch('http://localhost:3000/data')
    const jsonData = await response.json();
    pageEndIndex = Math.ceil(jsonData.length/pageCount)
    responseJsonLength = jsonData.length
    // console.log("WRAPPER :: ",wrapper);
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }

    while (storeArray.length > 0) {
        storeArray.pop();
    }

    jsonData.map((data)=>{
        storeArray.push(data)
    })
    // storeArray = jsonData;
    // console.log("STORE ARRAY :: ",storeArray);
    renderDataFromArray()
}

const fetchSearchData = async(text) => {
    const response = await fetch(`http://localhost:3000/data?q=${text}`)
    const responseData = await response.json()
    responseJsonLength = responseData.length
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
    
    while (storeArray.length > 0) {
        storeArray.pop();
    }
    
    responseData.map((data)=>{
        storeArray.push(data)
    })
    renderDataFromArray()
}

const fetchFilterSearchData = async(text) => {
    const response = await fetch(`http://localhost:3000/data?q=${text}`)
    const responseData = await response.json()
    responseJsonLength = responseData.length
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
    
    while (storeArray.length > 0) {
        storeArray.pop();
    }
    
    responseData.map((data)=>{
        storeArray.push(data)
    })
    if (text.length === 0) {
        renderDataFromArray()
    }
    renderFilterDataFromArray()
}

const searchFromSinglePage = async(word,limit,page) =>{
    console.log("WORD :: ",word);
    console.log("LIMIT :: ",limit);
    console.log("PAGE :: ",page);
    const response = await fetch(`http://localhost:3000/data?q=${word}&_limit=${limit}&_page=${page}`)
    const responseData = await response.json()
    responseJsonLength = responseData.length
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
    
    while (storeArray.length > 0) {
        storeArray.pop();
    }
    
    responseData.map((data)=>{
        storeArray.push(data)
    })
    renderDataFromArray()
}

const fetchSingleData = async(id) => {
    const response = await fetch('http://localhost:3000/data/'+id)
    const responseData = await response.json();
    
    return responseData
}

const fetchSortedData = async(table,method) =>{
    const response = await fetch(`http://localhost:3000/data?_sort=${table}&_order=${method}`) // data?_sort=Company_Name&_order=asc
    const responseData = await response.json()
    responseJsonLength = responseData.length
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
    
    while (storeArray.length > 0) {
        storeArray.pop();
    }
    
    responseData.map((data)=>{
        storeArray.push(data)
    })
    renderDataFromArray()
}

const getPageData = async(rowCount,pageNumber) => {
    const response = await fetch(`http://localhost:3000/data?_limit=${rowCount}&_page=${pageNumber}`)
    const responseData = await response.json()
    const arr = []
    // responseJsonLength = responseData.length
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
    
    // while (storeArray.length > 0) {
    //     storeArray.pop();
    // }
    
    responseData.map((data)=>{
        arr.push(data)
    })

    return arr
}

function submitSearchValue() {
    var searchInputId = document.getElementById("search-input-id")
    var selectedValue = document.getElementById("select-option-id").value;
    if (selectedValue == 0) {
        console.log("IN HERE");
        pageNumber = 1
        pageCount = 10
        selectedValue = 10
    }
    
    fetchFilterSearchData(searchInputId.value)
    // searchFromSinglePage(searchInputId.value,selectedValue,pageNumber)

}

function renderDataFromArray() {
    
    var errorMessageId = document.getElementById("no-data-text-id")

    console.log("STORE MAP :: ",storeArray);
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }

    if (storeArray.length === 0) {
        errorMessageId.innerHTML = "No data to display"    
    }else{
        errorMessageId.innerHTML = ""
    }

    storeArray.map((data, index) => {
        index += 1;
        var startIndex = (pageNumber * pageCount) - (pageCount - 1);
        var endIndex = (pageNumber * pageCount);

        if (index >= startIndex && index <= endIndex) {
            wrapper.append(createHtml(data));
        }
    });

    updateIndex()
}

function renderFilterDataFromArray() {
    pageNumber = 1
    var errorMessageId = document.getElementById("no-data-text-id")

    console.log("STORE MAP :: ",storeArray);
    while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }

    if (storeArray.length === 0) {
        errorMessageId.innerHTML = "No data to display"    
    }else{
        errorMessageId.innerHTML = ""
    }

    storeArray.map((data, index) => {
        index += 1;
        var startIndex = (pageNumber * pageCount) - (pageCount - 1);
        var endIndex = (pageNumber * pageCount);
        console.log("START INDEX :: ",startIndex);
        if (index >= startIndex && index <= endIndex) {
            wrapper.append(createHtml(data));
        }
    });

    updateIndex()
}

function createHtml(data){
    let td = document.createElement('tr');
    // <td>${data.id}</td>
    td.innerHTML =`

    <tr>
        <td>${data.Company_Name}</td>
        <td>${data.Level}</td>
        <td>${data.Parent}</td>
        <td>${data.Partner_Type}</td>
        <td>${data.Source}</td>
        <td>${data.Industry}</td>
        <td>${data.NAICS_code}</td>
        <td>${data.HQ_Location}</td>
        <td >
            <img id="${data.id}" class="icon-image" onclick="editChecked(this.id)" src="../assets/images/edit.png" alt=""></img>
        </td>
        <td >
            <img id="${data.id}" class="icon-image" onclick="clickedDelete(this.id)" src="../assets/images/bin.png" alt=""></img>
        </td>
    </tr>
    
    `;
    return td;
}

fetchData()

function handleSelectionChange() {
    var selectedValue = document.getElementById("select-option-id").value;
    console.log("Selected value:", selectedValue);
    pageNumber = 1
    pageCount = selectedValue
    renderDataFromArray()
}

function incrementPage(){
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    console.log("PAGE NUMBER :: ",Number(pageNumber));
    console.log("PAGE NUMBER :: ",Number(pageEndIndex));
    if(Number(pageNumber) < Number(pageEndIndex)){
        pageNumber += Number(1)
    }
    renderDataFromArray()
    updateIndex()
}

function decrementPage(){
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if(Number(pageNumber) > Number(1)){
        pageNumber -= 1
    }
    renderDataFromArray()
    updateIndex()
}

function updateIndex(){
    var currentIndexId = document.getElementById("span-current-page-id")
    var endIndexId = document.getElementById("span-end-page-id")
    pageEndIndex = Math.ceil(responseJsonLength/pageCount)
    console.log("PAGE INDEX :: ",pageEndIndex);
    currentIndexId.innerHTML = pageNumber
    endIndexId.innerHTML = pageEndIndex
}

function clickedDelete(id){
    var selectedValue = document.getElementById("select-option-id").value;
    var isConfirm = window.confirm("Are you sure you want to delete")
    if (isConfirm) {
        sessionStorage.setItem("page-number",pageNumber)
        sessionStorage.setItem("page-count",pageCount)
        sessionStorage.setItem("page-total-list",selectedValue)
        fetch("http://localhost:3000/data/"+id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        
    });
    }else if (isConfirm === false) {
        console.log("UNCHECKED");
    }
}

function displayPostForm(){
    var background1 = document.getElementById("upper-element-id")
    var background2 = document.getElementById("table-container-id")
    var background3 = document.getElementById("bottom-block-id")

    background1.classList.add("blur")
    background2.classList.add("blur")
    background3.classList.add("blur")

    document.getElementById('overlay').style.display = 'block';
    popUpId.classList.add("active")  
}

function handleClosePopup() {

    var background1 = document.getElementById("upper-element-id")
    var background2 = document.getElementById("table-container-id")
    var background3 = document.getElementById("bottom-block-id")

    background1.classList.remove("blur")
    background2.classList.remove("blur")
    background3.classList.remove("blur")

    document.getElementById('overlay').style.display = 'none';
    popUpId.classList.remove("active")
    popUpUpdateId.classList.remove("active")
}

function updateDetails(event){
    // event.preventDefault();
    // var idUpdate = document.getElementById("id-update-id").value
    var idUpdate = updatedCheckId
    var nameUpdate = document.getElementById("company-name-update-id").value
    var levelUpdate = document.getElementById("level-update-id").value
    var parentUpdate = document.getElementById("parent-update-id").value
    var partnerUpdate = document.getElementById("partner-type-update-id").value
    var sourceUpdate = document.getElementById("source-update-id").value
    var industryUpdate = document.getElementById("industry-update-id").value
    var naicsUpdate = document.getElementById("naics-code-update-id").value
    var hqLocationUpdate = document.getElementById("hq-location-update-id").value

    var selectedValue = document.getElementById("select-option-id").value;

    sessionStorage.setItem("page-number",pageNumber)
    sessionStorage.setItem("page-count",pageCount)
    sessionStorage.setItem("page-total-list",selectedValue)

    console.log("UPDATE ID :: ",idUpdate);

    fetch("http://localhost:3000/data/"+idUpdate, {
    method: "PUT",
    body: JSON.stringify({
        Company_Name: nameUpdate,
        Level: levelUpdate,
        Parent: parentUpdate,
        Partner_Type: partnerUpdate,
        Source: sourceUpdate,
        Industry: industryUpdate,
        NAICS_code: naicsUpdate,
        HQ_Location: hqLocationUpdate,
        
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });
}

function handleUploadData() {
    event.preventDefault();
    var inputCompanyName = document.getElementById("company-name-id")
    var inputLevel = document.getElementById("level-id")
    var inputParent = document.getElementById("parent-id")
    var inputParnerType = document.getElementById("partner-type-id")
    var inputSource = document.getElementById("source-id")
    var inputIndustry = document.getElementById("industry-id")
    var inputNAICES_code = document.getElementById("naics-code-id")
    var inputHqLocation = document.getElementById("hq-location-id")

    var selectedValue = document.getElementById("select-option-id").value;

    sessionStorage.setItem("page-number",pageNumber)
    sessionStorage.setItem("page-count",pageCount)
    sessionStorage.setItem("page-total-list",selectedValue)

    fetch("http://localhost:3000/data", {
    method: "POST",
    body: JSON.stringify({
        Company_Name: inputCompanyName.value,
        Level: inputLevel.value,
        Parent: inputParent.value,
        Partner_Type: inputParnerType.value,
        Source: inputSource.value,
        Industry: inputIndustry.value,
        NAICS_code: inputNAICES_code.value,
        HQ_Location: inputHqLocation.value,
        
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });
    renderDataFromArray()
}

async function editChecked(id){
    var userResponse = await fetchSingleData(id)
    console.log("User response :: ",userResponse);
    updatedCheckId = userResponse.id
    // document.getElementById("id-update-id").value = userResponse.id
    document.getElementById("company-name-update-id").value = userResponse.Company_Name
    document.getElementById("level-update-id").value = userResponse.Level
    document.getElementById("parent-update-id").value = userResponse.Parent
    document.getElementById("partner-type-update-id").value = userResponse.Partner_Type
    document.getElementById("source-update-id").value = userResponse.Source
    document.getElementById("industry-update-id").value = userResponse.Industry
    document.getElementById("naics-code-update-id").value = userResponse.NAICS_code
    document.getElementById("hq-location-update-id").value = userResponse.HQ_Location
    
    var background1 = document.getElementById("upper-element-id")
    var background2 = document.getElementById("table-container-id")
    var background3 = document.getElementById("bottom-block-id")

    background1.classList.add("blur")
    background2.classList.add("blur")
    background3.classList.add("blur")

    document.getElementById('overlay').style.display = 'block';
    
    var updatePopUp = document.getElementById("pop-up-update-id")
    updatePopUp.classList.add("active")
}

function renderDataFromArrayDay(array) {
    console.log("END INDEX :: ",pageEndIndex);
    var errorMessageId = document.getElementById("no-data-text-id")

    // while (wrapper.lastChild) {
    //     wrapper.removeChild(wrapper.lastChild);
    // }

    if (array.length === 0) {
        errorMessageId.innerHTML = "No data to display"    
    }else{
        errorMessageId.innerHTML = ""
    }

    array.map((data, index) => {
        // var startIndex = (pageNumber * pageCount) - (pageCount - 1);
        // var endIndex = (pageNumber * pageCount);
        // index = startIndex
        // index += 1;
        // console.log("START INDEX :: ",startIndex);
        // console.log("END   INDEX :: ",endIndex);
        // console.log("      INDEX :: ",index);
        // if (index >= startIndex && index <= endIndex) {
        console.log("::::------>>> ",data);
        wrapper.append(createHtml(data));
        // }
    });

    // updateIndex()
}

async function sortArrayData(param,method) {
    
    let gotArray = await getPageData(pageCount,pageNumber)
    if (method === 'asc') {
        
        gotArray = gotArray.sort((a,b)=>{
            if(a[param] < b[param]){
                return -1
            }
        })
    }else if (method === "desc") {
        // let gotArray = await getPageData(pageCount,pageNumber)
        
        gotArray = gotArray.sort((a,b)=>{
            if(a[param] > b[param]){
                return -1
            }
        })
    }

    console.log("NEW ARRAY :: ",gotArray);
    renderDataFromArrayDay(gotArray)
}

function renderAscData(param){
    const asc = "asc"
    if (param == 1) {
        sortArrayData("Company_Name",asc)
        // fetchSortedData("Company_Name","asc")
    }else if (param == 2) {
        // fetchSortedData("Level","asc")
        sortArrayData("Level",asc)
    }else if (param == 3) {
        // fetchSortedData("Parent","asc")
        sortArrayData("Parent",asc)
    }else if (param == 4) {
        // fetchSortedData("Partner_Type","asc")
        sortArrayData("Partner_Type",asc)
    }else if (param == 5) {
        // fetchSortedData("Source","asc")
        sortArrayData("Source",asc)
    }else if (param == 6) {
        // fetchSortedData("Industry","asc")
        sortArrayData("Industry",asc)
    }else if (param == 7) {
        // fetchSortedData("NAICS_code","asc")
        sortArrayData("NAICS_code",asc)
    }else if (param == 8) {
        // fetchSortedData("HQ_Location","asc")
        sortArrayData("HQ_Location",asc)
    }
}

function renderDescData(param){
    var method = "desc"
    if (param == 1) {
        sortArrayData("Company_Name",method)
    }else if (param == 2) {
        sortArrayData("Level",method)
    }else if (param == 3) {
        sortArrayData("Parent",method)
    }else if (param == 4) {
        sortArrayData("Partner_Type",method)
    }else if (param == 5) {
        sortArrayData("Source",method)
    }else if (param == 6) {
        sortArrayData("Industry",method)
    }else if (param == 7) {
        sortArrayData("NAICS_code",method)
    }else if (param == 8) {
        sortArrayData("HQ_Location",method)
    }
}