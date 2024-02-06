
let tree = {};

function addNode(node, level, parent) {
  if (node.Level === level) {
    parent[node.id] = node;
  }
  else if (node.Level > level) {
    for (let key in parent) {
      if (parent[key].id === node.Parent) {
        addNode(node, level + 1, parent[key]);
      }
    }
  }
}

const fetchData = async() =>{
    const response = await fetch('http://localhost:3000/data')
    const jsonData = await response.json();
    return jsonData
}

async function getData(){
    let data = await fetchData()
    for (let i = 0; i < data.length; i++) {
        let node = data[i];
        if (node.Level === "T0") {
        tree[node.id] = node;
        }
        else {
        addNode(node, "T0", tree);
        }
    }
    
    console.log(tree);
}

getData()

