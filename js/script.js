let data = [];

/*
* Essa função vai "ouvir" o formulário de arquivos.
* Ainda não possui validação de extenção.
* Após pegar o arquivo, ela chama a função "fillTable".
*/
function processFile() {
  const fileInput = document.getElementById('formFile');
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    fillTable(content)
  };

  reader.readAsText(file);
}

/**
 * 
 * @param {string} content
 * 
 * Essa função é responsável por organizar e exibir o conteúdo do arquivo.
 * Ela popula a tabela com o conteúdo do arquivo, que vem com 'string'.
 */
function fillTable(content) {
  const lines = content.split('\n')

  lines.forEach(line => {
    const tbody = document.getElementById('table_body');
    const row = document.createElement('tr');
    row.className = "text-center"
    const actions = document.createElement('td');
    const cells = line.split('\r');

    cells.forEach(el => {
      let attr = []
      attr = el.split(";");

      if(attr.length === 41) {
        // VALIDAÇÃO -> && attr[2] === ""
        switch(true) {
          case attr[3] !== null:
            attr[3] = splitDate(attr[3])
          case attr[4] !== null:
            attr[4] = splitDate(attr[4])
          case attr[35] !== null:
            attr[35] = splitDate(attr[35])
          case attr[36] !== null:
            attr[36] = splitDate(attr[36])
          case attr[37] !== null:
            attr[37] = splitDate(attr[37])
          case attr[38] !== null:
            attr[38] = splitDate(attr[38])
          break
        }

        attr.forEach(el => {
          el = replaceEmptySpace(el);
          let td = document.createElement('td');
          let content = document.createTextNode(el);
          actions.innerHTML = '<div class="btn-group btn-group-sm" role="group" aria-label="Small button group"><button type="button" class="btn btn-outline-dark">Editar</button><button type="button" class="btn btn-outline-dark">Apagar</button></div>';
          td.appendChild(content);
          row.appendChild(td);
          row.appendChild(actions);
          tbody.appendChild(row);
        });

        data.push(attr)
      }
    });
  });
  console.debug(data)
}

/*
* Recebe a data em forma de 'string'.
* Separa a data a partir do espaçe em branco.
* Pega somente a primeira parte da data e a retorna.
*/
const splitDate = (date => {
  const d = date.split(' ');
  return d[0]
});

/*
* No lugar dos espaços vazios ou nulos vai definir como "N/D".
*/
const replaceEmptySpace = (item => {
  if(item === "" || item === null) {
    return "N/D"
  }
  return item
});

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
