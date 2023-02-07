export {
  renderTableData,
  tableBody,
  tableHeaders,
  createApp,
};

import {
    imagePreload,
    createLoaderCircle,
    removeFocus,
    showClientCard,
  } from "./help.js";

import {AddClientModal, ErrorModal} from "./modal.js";

import {getClientsListData, deleteClientRequest} from "./api.js";

import {Client} from "./Client.js";

import {basicUrl} from "./global-const.js";

let tableBody;
let tableHeaders;
let filterValue = '';
let sortingID = 'id';
let sortingDirectOrder = true;

function startApp() {
  if (window.location.hash) {
    showClientCard();
  } else {
    imagePreload(createApp);
  } 
}

startApp();

window.addEventListener('hashchange', () => {
  document.body.innerHTML = '';
  startApp();
});

function createClientsTable() {
  const tableCaption = document.createElement('caption');
  tableCaption.classList.add('table-container', 'table-caption');
  tableCaption.textContent = 'Клиенты';
  document.body.append(tableCaption);

  // clientsTable.append(tableCaption);


  const tableContainer = document.createElement('div');
  tableContainer.classList.add('table-container');
  const clientsTable = document.createElement('table');
  clientsTable.classList.add('table');

  const clientsTableHeaderRow = document.createElement('tr');
  const tableHeadersOrder = {
                              id: 'ID',
                              fullName: 'Фамилия Имя Отчество',
                              createdAt: 'Дата и время создания',
                              updatedAt: 'Последние изменения',
                              contacts: 'Контакты',
                              actions: 'Действия',
                              // wrongactions: 'werwrw',
                            };
                            
  const tableHeadersEntries = Object.entries(tableHeadersOrder);

  tableHeadersEntries.forEach(element => {
    const clientsTableHeader = document.createElement('th');
    clientsTableHeader.classList.add('table-header');
    clientsTableHeader.setAttribute('id', element[0]);
    
    const clientsTableHeaderText = document.createElement('span');
    clientsTableHeaderText.classList.add('table-header-element', 'table-header-text');
    clientsTableHeaderText.textContent = element[1];
    clientsTableHeader.append(clientsTableHeaderText);
    
    if (element[0] !== 'contacts' && element[0] !== 'actions') {
      const clientsTableHeaderArrow = document.createElement('span');
      clientsTableHeader.classList.add('js-table-sorting');
      clientsTableHeaderArrow.classList.add('table-header-element', 'table-header-arrow');
      clientsTableHeader.append(clientsTableHeaderArrow);
      clientsTableHeader.addEventListener('click', getSortingID);
    }

    clientsTableHeaderRow.append(clientsTableHeader);
    
    if (element[0] === 'id') {
      clientsTableHeader.classList.add('table-header-active');
    }
  
    if (element[0] === 'fullName') {
      clientsTableHeader.classList.add('table-header_fullname');
    }
  });

  const tableBody = document.createElement('tbody');
  tableBody.classList.add('table-body');
  
  const headers = Object.keys(tableHeadersOrder);
  clientsTable.append(clientsTableHeaderRow);
  clientsTable.append(tableBody);
  tableContainer.append(clientsTable);
  document.body.append(tableContainer);

  return {tableBody, headers};
}

async function renderTableData(tableBody, headers) {
  tableBody.innerHTML = '';
  const clientsList = [];
 
  function createEmptyRow() {
    const clientsEmptyRow = document.createElement('td');
    clientsEmptyRow.classList.add('table-row', 'empty-row');
    clientsEmptyRow.setAttribute('colspan', '6');
    return clientsEmptyRow;
  }
  const emptyRow = createEmptyRow();
  const loaderWrapper = document.createElement('div');
  loaderWrapper.classList.add('empty-row__loader-wrapper');
  emptyRow.append(loaderWrapper);
  tableBody.append(emptyRow);

  const loader = createLoaderCircle(loaderWrapper, 'purp');
  let clientsListData = await getClientsListData();
  loader.remove();
  
  if (clientsListData.length === 0) {
    emptyRow.textContent = 'Лист клиентов пуст!';
  } else {
    emptyRow.remove();
    clientsListData.forEach(client => {
      clientsList.push(new Client(client));
    })
    
    const filteredClientsList = clientsList.filter( client => {
      return (client.id.includes(filterValue) || client.fullName.toLowerCase().includes(filterValue.toLowerCase()));
    });

    const SortedClientsList = sorting(filteredClientsList, sortingID, sortingDirectOrder);

    SortedClientsList.forEach(client => {
      client.createRow(tableBody, headers);
    });
  }
}

function getSortingID() {
  if (sortingID === this.id) {
    sortingDirectOrder = !sortingDirectOrder;
    this.classList.toggle('table-header-active_reverse');
  } else {
    const sortingIcons = document.querySelectorAll('.js-table-sorting');
    sortingIcons.forEach(el => {
      el.classList.remove('table-header-active', 'table-header-active_reverse');
    });
    this.classList.add('table-header-active');
    sortingDirectOrder = true;
    sortingID = this.id;
  }
  renderTableData(tableBody, tableHeaders);
}

function sorting(clientsList, sortingID, sortingDirectOrder) {
  if (sortingDirectOrder) {
    clientsList.sort((prev, next) => {
      if ( prev[sortingID] < next[sortingID] ) return -1;
    });
  } else {
    clientsList.sort((prev, next) => {
      if ( prev[sortingID] > next[sortingID] ) return -1;
    });
  }
  return clientsList;
}

function createApp() {
  function createHeader() {
    let searchInputTimeout;
  
    const header = document.createElement('header');
    header.classList.add('header');
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('container', 'header-container');
  
    const headerLogo = document.createElement('div');
    headerLogo.classList.add('header__logo');
    headerLogo.textContent = 'skb.';
  
    const headerInput = document.createElement('input');
    headerInput.classList.add('header__input');
    headerInput.setAttribute('placeholder', 'Введите запрос');
    headerInput.addEventListener('input', () => {
      clearTimeout(searchInputTimeout);
      searchInputTimeout = setTimeout(() => {
        if (headerInput.value !== '') {
          headerInput.setAttribute('style', 'opacity: 1');
        } else {
          headerInput.removeAttribute('style');
        }
        filterValue = headerInput.value;
        renderTableData(tableBody, tableHeaders);
      }, 300);
    });

    headerContainer.append(headerLogo);
    headerContainer.append(headerInput);
    header.append(headerContainer);
    document.body.append(header);
  }

  function createAddClientButton() {
    const addClientButton = document.createElement('button');
    addClientButton.classList.add('btn-reset', 'add-client-button');
    const addClientButtonContent = document.createElement('div');
    addClientButtonContent.classList.add('add-client-button__content');
    
    addClientButtonContent.textContent = 'Добавить клиента';
    addClientButtonContent.addEventListener('click', () => {
      addClientButton.blur();
    });

    addClientButton.addEventListener('click', (event) => {
      removeFocus(event);
      new AddClientModal;
    });

    addClientButton.append(addClientButtonContent);
    document.body.append(addClientButton);
  }

  createHeader();
  const clientsTable = createClientsTable();
  tableBody = clientsTable.tableBody;
  tableHeaders = clientsTable.headers;

  createAddClientButton();
  renderTableData(tableBody, tableHeaders);
};


// удаление всех клиентов в базе
async function clearClientsList() {
  try {
    const response = await fetch(basicUrl);
    const clientsList = await response.json();
    console.log('clientsList: ', clientsList);
    clientsList.forEach(client => {
      deleteClientRequest(client.id);
    });
  } catch (error) {
    new ErrorModal(error);
  }
};
// clearClientsList();