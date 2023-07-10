let storage = [];
let previusLength = 0;

/**
 * ERROS
 * 1. Ao inserir novas linhas antes de importar um arquivo,
 *    quando o arquivo for importado, depois, o tamanho da @constant storage
 *    ficará diferente do tamanho das linhas da tabela (tr).
 * (CORRIGIDO)
 * 
 * 2. É semelhante ao primeiro: se um arquivo for importado de forma alternada
 *    com a inserção de novas linhas na tabela, isso causará uma inconsistência
 *    no tamanha da @constant storage em relação às linhas renderizadas na tabela.
 * (CORRIGIDO) 
*/

function processFile() {
  const fileInput = document.getElementById('formFile');
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    fileToStringArray(content)
  };

  reader.readAsText(file);
}

function renderTable(row) {
  const tbody = document.getElementById('table_body');
    
  const tr = document.createElement('tr');
  tr.classList.add("text-center");

  const actionCell = document.createElement('td');
  const button1 = document.createElement('button');
  const button2 = document.createElement('button');

  row.forEach(element => {
    element = replaceEmptySpace(element);
    let td = document.createElement('td');
    let content = document.createTextNode(element);
    
    let groupContainer = document.createElement('div');
    groupContainer.classList.add("btn-group", "btn-group-sm");
    groupContainer.role = "group";
    groupContainer.ariaLabel = "Small button group"
    
    button1.innerText = "Editar";
    button1.type = "button";
    button1.classList.add("btn", "btn-warning")

    button2.innerText = "Apagar";
    button2.type = "button";
    button2.classList.add("btn", "btn-danger");
    
    groupContainer.appendChild(button1);
    groupContainer.appendChild(button2);
    actionCell.appendChild(groupContainer);
    td.appendChild(content);
    tr.appendChild(td);
    tr.appendChild(actionCell);
    tbody.appendChild(tr);
  });
}

function fileToStringArray(fileAsText) {
  const lines = fileAsText.split('\n');

  lines.forEach(disorganizedLines => {
    const organizedLines = disorganizedLines.split('\r');

    organizedLines.forEach((cellsNotSeparated) => {
      const row = cellsNotSeparated.split(';');
      if(row.length === 41) {
        switch(true) {
          case row[3] !== null:
            row[3] = splitDate(row[3])
          case row[4] !== null:
            row[4] = splitDate(row[4])
          case row[35] !== null:
            row[35] = splitDate(row[35])
          case row[36] !== null:
            row[36] = splitDate(row[36])
          case row[37] !== null:
            row[37] = splitDate(row[37])
          case row[38] !== null:
            row[38] = splitDate(row[38])
        }
        storage.push(row);
        renderTable(row);
      }
    });
  });
  console.debug(storage);
  previusLength = storage.length;
}

function renderNewItem() {
  const table = document.getElementById('active_table');
  const tbody = table.querySelector('tbody');
  
  for(let i = previusLength; i < storage.length; i++) {
    const newRow = storage[i];
    const tr = document.createElement('tr');
    tr.classList.add("text-center");

    newRow.forEach(element => {
      const td = document.createElement('td');
      const cellContent = document.createTextNode(element);
      td.appendChild(cellContent);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  console.info("Tamanho da tabela => " + tbody.querySelectorAll('tr').length);
  console.info("Tamanho global => " + storage.length);
  previusLength = storage.length;
}

const splitDate = (date => {
  const d = date.split(' ');
  return d[0]
});

const replaceEmptySpace = (item => {
  if(item === "" || item === null) {
    return "N/D"
  }
  return item
});


const formEl = document.getElementById("row_form");
const submit = document.getElementById("form_submit_btn");
submit.addEventListener('click', (e) => { e.preventDefault(); createItem();});

const inputs = formEl.querySelectorAll('input');
const inputList = Array.from(inputs);

function createItem() {
  const row = [];

  for(let i = 0; i < inputList.length; i++) {
    // Consertar o formato das datas
    inputList[i].value = replaceEmptySpace(inputList[i].value);
    row.push(inputList[i].value);
  }
  
  storage.push(row);
  renderNewItem();
}


const select = document.getElementById('filter_option');
select.addEventListener('change', (e) => {
  e.preventDefault();
  doFilter(e);
});

function doFilter(e) {
  const selected = Number.parseInt(e.target.value);
  const table = document.getElementById('active_table');
  const tbody = table.querySelector('tbody');

  if(typeof selected === 'number' && storage.length > 0) {
    switch(true) {
      case selected === 0:
        tbody.innerHTML = '';
        storage.forEach(i => {renderTable(i)});
      break
      case selected === 1:
        let filtered = [];
        filtered = [...storage];
        filtered.sort((a, b) => {
          return a[22] - b[22];
        }).reverse();
        
        tbody.innerHTML = '';
        filtered.forEach(i => {renderTable(i)});
      break
      case selected === 2:
        let filtered1 = [];
        filtered1 = [...storage];
        filtered1.sort((a, b) => {
          return a[27] - b[27];
        }).reverse();
        
        tbody.innerHTML = '';
        filtered1.forEach(i => {renderTable(i)});
      break
      case selected === 3:
        let filtered2 = [];
        filtered2 = [...storage];
        filtered2.sort((a, b) => {
          return a[21] - b[21];
        }).reverse();
        
        tbody.innerHTML = '';
        filtered2.forEach(i => {renderTable(i)});
      break
      case selected === 4:
        let filtered3 = [];
        filtered3 = [...storage];
        filtered3.sort((a, b) => {
          return a[40] - b[40];
        });
        
        tbody.innerHTML = '';
        filtered3.forEach(i => {renderTable(i)});
      break
      case selected === 5:
        let filtered4 = [];
        filtered4 = [...storage];
        filtered4.sort((a, b) => {
          return a[25] - b[25];
        });
        
        tbody.innerHTML = '';
        filtered4.forEach(i => {renderTable(i)});
      break
    }
  }

}
/*
* CHART
*/
const ctx = document.getElementById("chart");

new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
});
