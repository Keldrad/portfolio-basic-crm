export {
  dateLength,
  createLoaderCircle,
  imagePreload,
  checkForValue,
  checkingValidity,
  valueCorrection,
  removeFocus,
  showClientCard,
};

import {
  Modal,
  ModifyClientModal,
  ErrorModal,
} from "./modal.js";

import {imgSources} from "./global-const.js";

function dateLength(date) {
  if (String(date).length < 2) {
    date = '0'+date;
  }
  return date;
}

function createLoaderCircle(target, color) {
  target.innerHTML = '';
  const loaderCircle = document.createElement('div');
  loaderCircle.classList.add('loading-circle');
  
  switch (color) {
    case 'min':
      loaderCircle.classList.add('loading-circle_min');
      break ;
    case 'white':
      loaderCircle.classList.add('loading-circle_white');
      break;
    case 'white-big':
      loaderCircle.classList.add('loading-circle_white-big');
      break;
    case 'red':
      loaderCircle.classList.add('loading-circle_red');
      break;
    default:
      break;
  } 
  
  target.append(loaderCircle);
  return loaderCircle;
}

function imagePreload(appStarterFunction) {
  let errorArray = [];

  const modal = new Modal({type: 'view'});
  modal.showModal;
  const text = document.querySelector('.modal-window');
  text.setAttribute('style', 'padding: 20px');
  text.textContent = 'ожидаем предзагрузку файлов';
  
  let counter = 0;
  imgSources.forEach(imgSource => {
    const img = document.createElement('img');
    img.src = imgSource;
    
    img.onload = () => {
      counter++;
      text.textContent = `обработано файлов: ${counter} из ${imgSources.length}`;
      if (counter === imgSources.length) {
        modal.removeModal();
        appStarterFunction();
      }
    };
    
    img.onerror = () => {
      counter++;
      errorArray.push(`\n не загружен файл ${imgSource}`);
      const errorModal = new ErrorModal({type: 'error'});
      errorModal.errorMessage.textContent = '';
      errorModal.errorMessage.textContent += `\n не загружен файл ${imgSource}`;
      
      if (counter === imgSources.length) {
        modal.removeModal();
        appStarterFunction();
      }
    }
  });
};



function showClientCard() {
  const id = window.location.hash.substring(1);
  const newModal = new ModifyClientModal(id, {type: 'view'});
  newModal.fixContactsView();
}

function checkForValue() {
  this._prevVal = this.value;
}

function checkingValidity() {
  if (this.checkValidity()) {
    this._prevVal = this.value;
  } else {
    this.value = this._prevVal;
  }
}

function valueCorrection() {
  this._prevVal = '';
  let value = this.value;
  if (value === '' ) {
    return;
  }
  
  const regExpForBorders = RegExp(/[ёЁа-яА-Я]/g);
  let indexes = value.matchAll(regExpForBorders);

  const subArr = Array.from(indexes);
  if (subArr.length) {
    const newStringStart = subArr[0].index;
    const newStringEnd = subArr[subArr.length-1].index+1;
    let newvalue = value.slice(newStringStart, newStringEnd);

    newvalue = newvalue.replace(/[^ёЁа-яА-Я- \']/g, '')
                        .replace(/-{2,}/g, '-')
                        .replace(/ {2,}/g, ' ')
                        .replace(/\'{2,}/g, '\'')
                        .toLowerCase();
    newvalue = newvalue[0].toUpperCase() + newvalue.slice(1);
    this.value = newvalue;
  } else {
    this.value = '';
  }
}

function removeFocus(event) {
  event.target.blur();
}