const data = [
    { company: 'aaa', level: 'T0', Parent: '' },
    { company: 'bbb', level: 'T1', Parent: 'aaa' },
    { company: 'ccc', level: 'T1', Parent: 'aaa' },
    { company: 'ddd', level: 'T2', Parent: 'bbb' },
    { company: 'eee', level: 'T2', Parent: 'bbb' },
    { company: 'fff', level: 'T2', Parent: 'bbb' }
  ];
  
  function buildTree(data, parent) {
    const tree = [];
    data.filter(item => item.Parent === parent).forEach(item => {
      const node = { name: item.company, company: buildTree(data, item.company) };
      tree.push(node);
    });
    return tree;
  }
  
  const result = buildTree(data, '');
  console.log(JSON.stringify(result, null, 2));
  