export {
  getClientsListData,
  saveClientRequest,
  getClientData,
  deleteClientRequest,
}

import {ErrorModal} from "./modal.js";
import {basicUrl} from "./global-const.js";
import {
  renderTableData,
  tableBody,
  tableHeaders
} from "./main.js";


async function getClientsListData() {
  try {
    const response = await fetch(basicUrl);
    const clientsListData = await response.json();
    return clientsListData;
  } catch (error) {
    new ErrorModal(error);
  }
};


async function saveClientRequest(clientData, method, id='') {
  try {
    let response = null;
    response = await fetch (basicUrl + String(id), {
      method: method,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(clientData),
    })
    if (response.status === 422 || response.status === 404 || response.status >= 500 ) {
      switch (response.status) {
        case 422:
          return [{message: 'Объект, переданный в теле запроса, не прошёл валидацию.'}];

        case 404:
          return [{message: 'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных.'}];
        
        case 500:
          return [{message: 'Сервер сломался.'}];
      
        default:
          return [{message: 'Что-то пошло не так...'}];
      }
    } else {
      const modal = document.querySelector('.modal-wrapper');
      modal.remove();
      renderTableData(tableBody, tableHeaders);
      return;
    }
  } catch (error) {
    new ErrorModal(error);
  }
};


async function getClientData(id){
  try {
    const response = await fetch (basicUrl + String(id));
    const data = await response.json();
    return data;
  } catch (error) {
    new ErrorModal(error);
  }
};


async function deleteClientRequest(id){
  try {
    await fetch (basicUrl + String(id), {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' }
    })
    renderTableData(tableBody, tableHeaders);
  } catch (error) {
    new ErrorModal(error);
  }
};