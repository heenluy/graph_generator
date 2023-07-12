let storage = [];

/**
 * PROBLEMAS
 * 1. Ao inserir novas linhas antes de importar um arquivo,
 *    quando o arquivo for importado, depois, o tamanho da @constant storage
 *    ficará diferente do tamanho das linhas da tabela (tr).
 * (CORRIGIDO)
 * 
 * 2. É semelhante ao primeiro: se um arquivo for importado de forma alternada
 *    com a inserção de novas linhas na tabela, isso causará uma inconsistência
 *    no tamanha da @constant storage em relação às linhas renderizadas na tabela.
 * (CORRIGIDO) 
 * 
 * 3. Ao importar um arquivo, usar um filtro e depois inserir um item na tabela,
 *    a tabela atualiza mas não dispara o filtro automaticamente.
 * (CORRIGIDO)
 * 
 * 4. Ao iserir um novo item a partir do formulário, os campos que possuem
 *    datas ficam no formato yyyy-MM-dd.
 *    A @function formatDate corrigiu isso.
 * (CORRIGIDO)
 * 
*/

const ctTable = document.getElementById('ct_table');
const ctGraph = document.getElementById('ct_graph');

function processFile() {
  ctTable.classList.remove('d-none');
  const fileInput = document.getElementById('formFile');
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    fileToStringArray(content)
  };

  reader.readAsText(file);
}

let indexEl = 0;
function renderTable(row) {
  const tbody = document.getElementById('table_body');
  
  const tr = document.createElement('tr');
  tr.classList.add("text-center");

  const actionCell = document.createElement('td');
  const button1 = document.createElement('button');
  const button2 = document.createElement('button');
  
  row.unshift(indexEl);
  indexEl++;

  row.forEach((element) => {
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

  storage.push(row);
  button1.addEventListener('click', (e) => { updateItem(row[0]); e.preventDefault(); });
  button2.addEventListener('click', (e) => { deleteItem(row[0]); e.preventDefault(); });
}

function fileToStringArray(fileAsText) {
  const lines = fileAsText.split('\n');

  lines.forEach(disorganizedLines => {
    const organizedLines = disorganizedLines.split('\r');
    
    organizedLines.forEach((cellsNotSeparated) => {
      const row = cellsNotSeparated.split(';');
      // VALIDAR CNPJ_IF
      // Para testes, é melhor sem a validação
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
        renderTable(row);
      }
    });
  });
  exportButton.disabled = false; 
  graphButton.disabled = false;
  console.debug(storage);
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
    row.push(inputList[i].value);
  }

  renderTable(formatDate(row));
  exportButton.disabled = false;
  graphButton.disabled = false;
}

function formatDate(row) {
  const formattedRow = [];

  row.forEach(element => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if(regex.test(element)) {
      let dateArray = element.split('-');
      let newD = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
      element = newD;
    }
    formattedRow.push(element);
  });

  return formattedRow;
}

// UPDATE ITEM AND DELETE ITEM
/**
 * TODO: Implementar essas funções.
 */
function updateItem(index) {
  console.log('UPDATE: ' + index);
}

function deleteItem(index) {
  console.log('DELETE: ' + index);
}

let option = 0;
const select = document.getElementById('filter_option');
select.addEventListener('change', (e) => {
  e.preventDefault();
  if(Number.parseInt(e.target.value) !== 0) {
    filterInput.disabled = false;
  } else {
    filterInput.disabled = true;
    filterInput.value = "";
  }
  doFilter();
});

const filterInput = document.getElementById('filter_text_input');
filterInput.addEventListener('change', (e) => {
  e.preventDefault();
  doFilter();
});


function doFilter() {
  let backup = [...storage].sort();
  let formFilterValue = String(filterInput.value);
  let option = Number.parseInt(select.value);

  const table = document.getElementById('active_table');
  const tbody = table.querySelector('tbody');

  if(storage.length > 0) {
    switch(true) {
      case option === 0:
        indexEl = 0;
        tbody.innerHTML = '';
        storage.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(storage);
        storage = backup;
      break

      // ROW[3] === CNPJ
      case option === 1:
        indexEl = 0;
        tbody.innerHTML = '';
        const f1 = storage.filter((row) => {
          return formFilterValue !== null ? row[3] === formFilterValue : true;
        }).sort();

        f1.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(f1);
        storage = backup;
      break
      
      // ROW[12] === CD_TIPO_SEGURO
      case option === 2:
        indexEl = 0;
        tbody.innerHTML = '';
        const f2 = storage.filter((row) => {
          return formFilterValue !== null ? row[12] === formFilterValue : true;
        }).sort();

        f2.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(f2);
        storage = backup;
      break

      // ROW[6] === CD_INST_CRED
      case option === 3:
        indexEl = 0;
        tbody.innerHTML = '';
        const f3 = storage.filter((row) => {
          return formFilterValue !== null ? row[6] === formFilterValue : true;
        }).sort();
        
        f3.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(f3);
        storage = backup;
      break

      // ROW[8] === CD_CATEG_RECURSO
      case option === 4:
        indexEl = 0;
        tbody.innerHTML = '';
        const f4 = storage.filter((row) => {
          return formFilterValue !== null ? row[8] === formFilterValue : true;
        }).sort();

        f4.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(f4);
        storage = backup;
      break

      // ROW[13] === CD_EMPREENDIMENTO
      case option === 5:
        indexEl = 0;
        tbody.innerHTML = '';
        const f5 = storage.filter((row) => {
          return formFilterValue !== null ? row[13] === formFilterValue : true;
        }).sort();

        f5.forEach(i => { i.shift(); renderTable(i); });
        updateGraph(f5);
        storage = backup;
      break
    }
  }

}

const exportButton = document.getElementById('export_file_btn');
exportButton.addEventListener('click', (e) => {
  e.preventDefault();
  exportFileAsXML();
});

// EXPORT
function exportFileAsXML() {
  const xmlDocument = document.implementation.createDocument(null, 'BANESTES');
  
  storage.forEach(row => {
    row.shift();
    const docEl = xmlDocument.createElement('OPERACAO_BASICA');
    
    const REF_BACEN = xmlDocument.createElement('REF_BACEN');
    REF_BACEN.textContent = String(row[0]);
    docEl.appendChild(REF_BACEN);

    const NU_ORDEM = xmlDocument.createElement('NU_ORDEM');
    NU_ORDEM.textContent = String(row[1]);
    docEl.appendChild(NU_ORDEM);

    const CNPJ_IF = xmlDocument.createElement('CNPJ_IF');
    CNPJ_IF.textContent = String(row[2]);
    docEl.appendChild(CNPJ_IF);

    const DT_EMISSÃO = xmlDocument.createElement('DT_EMISSÃO');
    DT_EMISSÃO.textContent = String(row[3]);
    docEl.appendChild(DT_EMISSÃO);

    const DT_VENCIMENTO = xmlDocument.createElement('DT_VENCIMENTO');
    DT_VENCIMENTO.textContent = String(row[4]);
    docEl.appendChild(DT_VENCIMENTO);

    const CD_INST_CREDITO = xmlDocument.createElement('CD_INST_CREDITO');
    CD_INST_CREDITO.textContent = String(row[5]);
    docEl.appendChild(CD_INST_CREDITO);

    const CD_CATEG_EMITENTE = xmlDocument.createElement('CD_CATEG_EMITENTE');
    CD_CATEG_EMITENTE.textContent = String(row[6]);
    docEl.appendChild(CD_CATEG_EMITENTE);

    const CD_CATEG_RECURSO = xmlDocument.createElement('CD_CATEG_RECURSO');
    CD_CATEG_RECURSO.textContent = String(row[7]);
    docEl.appendChild(CD_CATEG_RECURSO);

    const CNPJ_AGENTE_INVEST = xmlDocument.createElement('CNPJ_AGENTE_INVEST');
    CNPJ_AGENTE_INVEST.textContent = String(row[8]);
    docEl.appendChild(CNPJ_AGENTE_INVEST);

    const CD_ESTADO = xmlDocument.createElement('CD_ESTADO');
    CD_ESTADO.textContent = String(row[9]);
    docEl.appendChild(CD_ESTADO);

    const CD_REF_BACEN_INVESTIMENTO = xmlDocument.createElement('CD_REF_BACEN_INVESTIMENTO');
    CD_REF_BACEN_INVESTIMENTO.textContent = String(row[10]);
    docEl.appendChild(CD_REF_BACEN_INVESTIMENTO);

    const  CD_TIPO_SEGURO = xmlDocument.createElement('CD_TIPO_SEGURO');
    CD_TIPO_SEGURO.textContent = String(row[11]);
    docEl.appendChild(CD_TIPO_SEGURO);

    const CD_EMPREENDIMENTO = xmlDocument.createElement('CD_EMPREENDIMENTO');
    CNPJ_IF.textContent = String(row[12]);
    docEl.appendChild(CD_EMPREENDIMENTO);

    const CD_PROGRAMA = xmlDocument.createElement('REF_BACEN');
    CD_PROGRAMA.textContent = String(row[13]);
    docEl.appendChild(CD_PROGRAMA);

    const CD_TIPO_ENCARG_FINAC = xmlDocument.createElement('CD_TIPO_ENCARG_FINAC');
    CD_TIPO_ENCARG_FINAC.textContent = String(row[14]);
    docEl.appendChild(CD_TIPO_ENCARG_FINAC);

    const CD_TIPO_IRRIGACAO = xmlDocument.createElement('CD_TIPO_IRRIGACAO');
    CD_TIPO_IRRIGACAO.textContent = String(row[15]);
    docEl.appendChild(CD_TIPO_IRRIGACAO);

    const CD_TIPO_AGRICULTURA = xmlDocument.createElement('CD_TIPO_AGRICULTURA');
    CD_TIPO_AGRICULTURA.textContent = String(row[16]);
    docEl.appendChild(CD_TIPO_AGRICULTURA);

    const  CD_FASE_CICLO_PRODUCAO = xmlDocument.createElement('CD_FASE_CICLO_PRODUCAO');
    CD_FASE_CICLO_PRODUCAO.textContent = String(row[17]);
    docEl.appendChild(CD_FASE_CICLO_PRODUCAO);

    const CD_TIPO_CULTIVO = xmlDocument.createElement('CD_TIPO_CULTIVO');
    CD_TIPO_CULTIVO.textContent = String(row[18]);
    docEl.appendChild(CD_TIPO_CULTIVO);

    const CD_TIPO_INTEGR_CONSOR = xmlDocument.createElement('CD_TIPO_INTEGR_CONSOR');
    CD_TIPO_INTEGR_CONSOR.textContent = String(row[19]);
    docEl.appendChild(CD_TIPO_INTEGR_CONSOR);

    const CD_TIPO_GRÃO_SEMENTE = xmlDocument.createElement('REF_BACEN');
    CD_TIPO_GRÃO_SEMENTE.textContent = String(row[20]);
    docEl.appendChild(CD_TIPO_GRÃO_SEMENTE);

    const VL_ALIQ_PROAGRO = xmlDocument.createElement('VL_ALIQ_PROAGRO');
    VL_ALIQ_PROAGRO.textContent = String(row[21]);
    docEl.appendChild(VL_ALIQ_PROAGRO);

    const VL_JUROS = xmlDocument.createElement('VL_JUROS');
    VL_JUROS.textContent = String(row[22]);
    docEl.appendChild(VL_JUROS);

    const VL_PRESTAÇÃO_INVESTIMENTO = xmlDocument.createElement('VL_PRESTAÇÃO_INVESTIMENTO');
    VL_PRESTAÇÃO_INVESTIMENTO.textContent = String(row[23]);
    docEl.appendChild(VL_PRESTAÇÃO_INVESTIMENTO);

    const VL_PREV_PROD = xmlDocument.createElement('VL_PREV_PROD');
    VL_PREV_PROD.textContent = String(row[24]);
    docEl.appendChild(VL_PREV_PROD);

    const VL_QUANTIDADE = xmlDocument.createElement('VL_QUANTIDADE');
    VL_QUANTIDADE.textContent = String(row[25]);
    docEl.appendChild(VL_QUANTIDADE);

    const VL_RECEITA_BRUTA_ESPERADA = xmlDocument.createElement('VL_RECEITA_BRUTA_ESPERADA');
    VL_RECEITA_BRUTA_ESPERADA.textContent = String(row[26]);
    docEl.appendChild(VL_RECEITA_BRUTA_ESPERADA);

    const VL_PARC_CREDITO = xmlDocument.createElement('VL_PARC_CREDITO');
    VL_PARC_CREDITO.textContent = String(row[27]);
    docEl.appendChild(VL_PARC_CREDITO);

    const VL_REC_PROPRIO = xmlDocument.createElement('VL_REC_PROPRIO');
    VL_REC_PROPRIO.textContent = String(row[28]);
    docEl.appendChild(VL_REC_PROPRIO);

    const VL_PERC_RISCO_STN = xmlDocument.createElement('VL_PERC_RISCO_STN');
    VL_PERC_RISCO_STN.textContent = String(row[29]);
    docEl.appendChild(VL_PERC_RISCO_STN);

    const VL_PERC_RISCO_FUNDO_CONST = xmlDocument.createElement('VL_PERC_RISCO_FUNDO_CONST');
    VL_PERC_RISCO_FUNDO_CONST.textContent = String(row[30]);
    docEl.appendChild(VL_PERC_RISCO_FUNDO_CONST);

    const VL_REC_PROPRIO_SRV = xmlDocument.createElement('VL_REC_PROPRIO_SRV');
    VL_REC_PROPRIO_SRV.textContent = String(row[31]);
    docEl.appendChild(VL_REC_PROPRIO_SRV);

    const VL_AREA_FINANC = xmlDocument.createElement('VL_AREA_FINANC');
    VL_AREA_FINANC.textContent = String(row[32]);
    docEl.appendChild(VL_AREA_FINANC);

    const CD_SUBPROGRAMA = xmlDocument.createElement('CD_SUBPROGRAMA');
    CD_SUBPROGRAMA.textContent = String(row[33]);
    docEl.appendChild(CD_SUBPROGRAMA);

    const VL_PRODUTIV_OBTIDA = xmlDocument.createElement('VL_PRODUTIV_OBTIDA');
    VL_PRODUTIV_OBTIDA.textContent = String(row[34]);
    docEl.appendChild(VL_PRODUTIV_OBTIDA);

    const DT_FIM_COLHEITA = xmlDocument.createElement('DT_FIM_COLHEITA');
    DT_FIM_COLHEITA.textContent = String(row[35]);
    docEl.appendChild(DT_FIM_COLHEITA);

    const DT_FIM_PLANTIO = xmlDocument.createElement('DT_FIM_PLANTIO');
    DT_FIM_PLANTIO.textContent = String(row[36]);
    docEl.appendChild(DT_FIM_PLANTIO);

    const DT_INIC_COLHEITA = xmlDocument.createElement('DT_INIC_COLHEITA');
    DT_INIC_COLHEITA.textContent = String(row[37]);
    docEl.appendChild(DT_INIC_COLHEITA);

    const DT_INIC_PLANTIO = xmlDocument.createElement('DT_INIC_PLANTIO');
    DT_INIC_PLANTIO.textContent = String(row[38]);
    docEl.appendChild(DT_INIC_PLANTIO);

    const VL_JUROS_ENC_FINAN_PROSFIX = xmlDocument.createElement('VL_JUROS_ENC_FINAN_PROSFIX');
    VL_JUROS_ENC_FINAN_PROSFIX.textContent = String(row[39]);
    docEl.appendChild(VL_JUROS_ENC_FINAN_PROSFIX);

    const VL_PERC_CUSTO_EFET_TOTAL = xmlDocument.createElement('VL_PERC_CUSTO_EFET_TOTAL');
    VL_PERC_CUSTO_EFET_TOTAL.textContent = String(row[40]);
    docEl.appendChild(VL_PERC_CUSTO_EFET_TOTAL);

    
    xmlDocument.documentElement.appendChild(docEl);
  });

  const xmlString = new XMLSerializer().serializeToString(xmlDocument);
  const blob = new Blob([xmlString], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.visibility = 'hidden';
  a.href = url;
  a.download = 'dados__test__y.xml';
  a.click();
}

/*
* CHART
*/

let currentChart = null;
const graphCanvas = document.getElementById("chart");
const graphButton = document.getElementById('generate_graph_btn');
graphButton.addEventListener('click', (e) => {
  e.preventDefault();
  generateGraph(storage);
  ctGraph.classList.remove('d-none');
});

function generateGraph(data) {
  currentChart = new Chart(
    graphCanvas,
    {
      type: 'line',
      data: {
        labels: data.map(row => (row[0] + 1) + 'º'),
        datasets: [
          {
            label: 'Parcela Crédito',
            data: data.map(row => row[28]),
            fill: false,
            borderColor: 'rgb(25, 135, 84)',
            tension: 0.1
          },
          {
            label: 'Receita Bruta Esperada',
            data: data.map(row => row[27]),
            fill: false,
            borderColor: 'rgb(13, 110, 253)',
            tension: 0.1
          }
        ]
      }
    }
  );
}

function updateGraph(data) {
  if (currentChart) { currentChart.destroy(); }
  currentChart = new Chart(
    graphCanvas,
    {
      type: 'line',
      data: {
        labels: data.map(row => (row[0] + 1) + 'º'),
        datasets: [
          {
            label: 'Parcela Crédito',
            data: data.map(row => row[28]),
            fill: false,
            borderColor: 'rgb(25, 135, 84)',
            tension: 0.1
          },
          {
            label: 'Receita Bruta Esperada',
            data: data.map(row => row[27]),
            fill: false,
            borderColor: 'rgb(13, 110, 253)',
            tension: 0.1
          }
        ]
      }
    }
  );
}

const labels = [
  "REF_BACEN",
  "NU_ORDEM",
  "CNPJ_IF",
  "DT_EMISSÃO",
  "DT_VENCIMENTO",
  "CD_INST_CREDITO",
  "CD_CATEG_EMITENTE",
  "CD_CATEG_RECURSO",
  "CNPJ_AGENTE_INVEST",
  "CD_ESTADO",
  "CD_REF_BACEN_INVESTIMENTO",
  "CD_TIPO_SEGURO",
  "CD_EMPREENDIMENTO",
  "CD_PROGRAMA",
  "CD_TIPO_ENCARG_FINAC",
  "CD_TIPO_IRRIGAÇÃO",
  "CD_TIPO_AGRICULTURA",
  "CD_FASE_CICLO_PRODUÇÃO",
  "CD_TIPO_CULTIVO",
  "CD_TIPO_INTEGR_CONSOR",
  "CD_TIPO_GRÃO_SEMENTE",
  "VL_ALIQ_PROAGRO",
  "VL_JUROS",
  "VL_PRESTAÇÃO_INVESTIMENTO",
  "VL_PREV_PROD",
  "VL_QUANTIDADE",
  "VL_RECEITA_BRUTA_ESPERADA",
  "VL_PARC_CRÉDITO",
  "VL_REC_PROPRIO",
  "VL_PERC_RISCO_STN",
  "VL_PERC_RISCO_FUNDO_CONST",
  "VL_REC_PROPRIO_SRV",
  "VL_AREA_FINANC",
  "CD_SUBPROGRAMA",
  "VL_PRODUTIV_OBTIDA",
  "DT_FIM_COLHEITA",
  "DT_FIM_PLANTIO",
  "DT_INIC_COLHEITA",
  "DT_INIC_PLANTIO",
  "VL_JUROS_ENC_FINAN_PROSFIX",
  "VL_PERC_CUSTO_EFET_TOTAL"
];