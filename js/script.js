const storage = [];
let previusLength = 0;
let fileArrayLength = 0;

/**
 * ERROS
 * 1. Ao inserir novas linhas antes de importar um arquivo,
 *    quando o arquivo for importado, depois, o tamanho da @constant storage
 *    ficará diferente do tamanho das linhas da tabela (tr).
 * 
 * 2. É semelhante ao primeiro: se um arquivo for importado de forma alternada
 *    com a inserção de novas linhas na tabela, isso causará uma inconsistência
 *    no tamanha da @constant storage em relação às linhas renderizadas na tabela. 
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

function renderTable(finishedCells) {
  finishedCells.forEach(elements => {
    const tbody = document.getElementById('table_body');
    
    const tr = document.createElement('tr');
    tr.classList.add("text-center");

    const actionCell = document.createElement('td');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    elements.forEach(element => {
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
  });
  console.debug(storage);
}

function fileToStringArray(fileAsText) {
  const lines = fileAsText.split('\n');

  lines.forEach(disorganizedLines => {
    const organizedLines = disorganizedLines.split('\r');

    organizedLines.forEach((cellsNotSeparated) => {
      const separatedCellArray = cellsNotSeparated.split(';');
      transformRow(separatedCellArray);
    });
  });

  renderTable(storage);
  console.debug(fileArrayLength);
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

function transformRow(row) {
  // TODO: Fazer a validação do CNPJ
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
      break
    }
    storage.push(row);
    fileArrayLength++;
    previusLength = storage.length;

  }

  return null;
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
const inputs = formEl.querySelectorAll('input');
const inputsArray = Array.from(inputs);

function createItem() {
  const row = [];

  inputsArray.forEach(v => {
    row.push(v.value);
  });

  storage.push(row);
  renderNewItem();
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
