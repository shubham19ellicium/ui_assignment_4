var storeArray = []
var wrapper = document.getElementById("table-wrapper-id")

let pageCount = 10
let pageNumber = 1
let pageEndIndex ='' ;

var background = document.getElementById("container")
var popUpId = document.getElementById("pop-for-upload")
var popUpUpdateId = document.getElementById("pop-up-update-id")
var responseJsonLength ;

window.onload = function() {
    var selectedValue = document.getElementById("select-option-id");
    console.log("RUN AFTER RELOAD");
    if (sessionStorage.getItem("page-number") != null && sessionStorage.getItem("page-count") != null) {
        pageNumber = sessionStorage.getItem("page-number")
        pageCount = sessionStorage.getItem("page-count")
        selectedValue.value = sessionStorage.getItem("page-total-list")
        selectedValue.options[selectedValue.selectedIndex].text = sessionStorage.getItem("page-total-list")
        sessionStorage.clear()
    }
}


const fetchData = async() =>{
    const response = await fetch('http://localhost:3000/data')
    const jsonData = await response.json();
    pageEndIndex = Math.ceil(jsonData.length/pageCount)
    responseJsonLength = jsonData.length
    console.log("WRAPPER :: ",wrapper);
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

function submitSearchValue() {
    var searchInputId = document.getElementById("search-input-id")
    var selectedValue = document.getElementById("select-option-id").value;
    if (selectedValue == 0) {
        console.log("IN HERE");
        pageNumber = 1
        pageCount = 10
        selectedValue = 10
    }
    fetchSearchData(searchInputId.value)

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

    console.log("PAGE NUMBER :: ",Number(pageNumber));
    console.log("PAGE NUMBER :: ",Number(pageEndIndex));
    if(Number(pageNumber) < Number(pageEndIndex)){
        pageNumber += 1
    }
    renderDataFromArray()
    updateIndex()
}

function decrementPage(){
    
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
    popUpId.classList.add("active")  
}

function handleClosePopup() {
    var background = document.getElementById("main-container")
    popUpId.classList.remove("active")
    popUpUpdateId.classList.remove("active")
}

function updateDetails(event){
    // event.preventDefault();
    var idUpdate = document.getElementById("id-update-id").value
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
    
    document.getElementById("id-update-id").value = userResponse.id
    document.getElementById("company-name-update-id").value = userResponse.Company_Name
    document.getElementById("level-update-id").value = userResponse.Level
    document.getElementById("parent-update-id").value = userResponse.Parent
    document.getElementById("partner-type-update-id").value = userResponse.Partner_Type
    document.getElementById("source-update-id").value = userResponse.Source
    document.getElementById("industry-update-id").value = userResponse.Industry
    document.getElementById("naics-code-update-id").value = userResponse.NAICS_code
    document.getElementById("hq-location-update-id").value = userResponse.HQ_Location
    
    
    var updatePopUp = document.getElementById("pop-up-update-id")
    updatePopUp.classList.add("active")
}

function renderAscData(param){
    if (param == 1) {
        fetchSortedData("Company_Name","asc")
    }else if (param == 2) {
        fetchSortedData("Level","asc")
    }else if (param == 3) {
        fetchSortedData("Parent","asc")
    }else if (param == 4) {
        fetchSortedData("Partner_Type","asc")
    }else if (param == 5) {
        fetchSortedData("Source","asc")
    }else if (param == 6) {
        fetchSortedData("Industry","asc")
    }else if (param == 7) {
        fetchSortedData("NAICS_code","asc")
    }else if (param == 8) {
        fetchSortedData("HQ_Location","asc")
    }
}

function renderDescData(param){
    var method = "desc"
    if (param == 1) {
        fetchSortedData("Company_Name",method)
    }else if (param == 2) {
        fetchSortedData("Level",method)
    }else if (param == 3) {
        fetchSortedData("Parent",method)
    }else if (param == 4) {
        fetchSortedData("Partner_Type",method)
    }else if (param == 5) {
        fetchSortedData("Source",method)
    }else if (param == 6) {
        fetchSortedData("Industry",method)
    }else if (param == 7) {
        fetchSortedData("NAICS_code",method)
    }else if (param == 8) {
        fetchSortedData("HQ_Location",method)
    }
}