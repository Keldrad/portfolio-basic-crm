export {Client};

import {
  dateLength,
  removeFocus,
} from "./help.js";

import {
  ModifyClientModal,
  DeleteClientModal,
  ErrorModal,
} from "./modal.js";

let _fieldWithError = false;

class Client {
  constructor(Obj) {
    this.id = Obj.id;
    this.surname = Obj.surname;
    this.name = Obj.name;
    this.lastName = Obj.lastName;
    this.createdAt = new Date(Obj.createdAt);
    this.updatedAt = new Date(Obj.updatedAt);
    this.contacts = Obj.contacts;

  }

  get fullName() {
    return [this.surname, this.name, this.lastName].join(' ');
  }

  get createDate() {
    return `${dateLength(this.createdAt.getDate())}.${dateLength(this.createdAt.getMonth()+1)}.${this.createdAt.getFullYear()}`;
  }
  get createTime() {
    return `${dateLength(this.createdAt.getHours())}:${dateLength(this.createdAt.getMinutes())}`;
  }
  get updateDate() {
    return `${dateLength(this.updatedAt.getDate())}.${dateLength(this.updatedAt.getMonth()+1)}.${this.updatedAt.getFullYear()}`;
  }
  get updateTime() {
    return `${dateLength(this.updatedAt.getHours())}:${dateLength(this.updatedAt.getMinutes())}`;
  }

  createContactsIcons(parentCell, contactsArray) {
    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('table-cell__grid');

    contactsArray.forEach(contact => {
      const contactIcon = document.createElement('div');
      contactIcon.classList.add('btn-reset', 'tooltip', 'contacts-icon');
      const contactIconTooltip = document.createElement('span');
      contactIconTooltip.classList.add('tooltiptext');
      contactIconTooltip.textContent = contact.value;
      contactIcon.append(contactIconTooltip);
      switch (contact.type) {
        case 'Vk':
          contactIcon.classList.add('contacts-icon_vk');
          break;
        case 'Facebook':
          contactIcon.classList.add('contacts-icon_facebook');
          break;
        case 'Телефон':
          contactIcon.classList.add('contacts-icon_phone');
          break;
        case 'Email':
          contactIcon.classList.add('contacts-icon_email');
          break;
        default:
          contactIcon.classList.add('contacts-icon_another');
          break;
        }
        iconsContainer.append(contactIcon);
      });

    if (iconsContainer.children.length > 5) {
      const iconPlug = document.createElement('div');
      iconPlug.classList.add('btn-reset', 'contacts-icon', 'contacts-icon_button');
      iconPlug.textContent = `+${iconsContainer.children.length-4}`;

      for (let i = 4; i < iconsContainer.children.length; i++) {
        iconsContainer.children[i].classList.add('display-none');
      }
      
      iconPlug.addEventListener('click', () => {
        for (let i = 4; i < iconsContainer.children.length; i++) {
          iconsContainer.children[i].classList.remove('display-none');
        }
        iconPlug.classList.add('display-none');
      })
      iconsContainer.append(iconPlug);
    }
  
    parentCell.append(iconsContainer);
    return '';
  }

  createButtons() {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('buttons-wrapper');
    
    const modifyButtonWrapper = document.createElement('div');
    modifyButtonWrapper.classList.add('button-wrapper');

    const modifyButtonLoader = document.createElement('span');
    modifyButtonLoader.classList.add('button-loader', 'button-loader_modify');

    const modifyClientButton = document.createElement('button');
    modifyClientButton.classList.add('btn-reset', 'client-button', 'client-button_modify');
    modifyClientButton.textContent = 'Изменить';
    modifyClientButton.addEventListener('click', (event) => {
      removeFocus(event);
      new ModifyClientModal(this.id, {type: 'edit'}, event.target);
    });

    const deleteButtonWrapper = document.createElement('div');
    deleteButtonWrapper.classList.add('button-wrapper');

    const deleteButtonLoader = document.createElement('span');
    deleteButtonLoader.classList.add('button-loader', 'button-loader_delete');

    const deleteClientButton = document.createElement('button');
    deleteClientButton.classList.add('btn-reset', 'client-button', 'client-button_delete');
    deleteClientButton.setAttribute('id', 'del'+this.id);
    deleteClientButton.textContent = 'Удалить';
    deleteClientButton.addEventListener('click', (event) => {
      removeFocus(event);
      new DeleteClientModal(this.id, event.target);
    });
    
    modifyButtonWrapper.append(modifyButtonLoader);
    modifyButtonWrapper.append(modifyClientButton);
    buttonsWrapper.append(modifyButtonWrapper);
    deleteButtonWrapper.append(deleteButtonLoader);
    deleteButtonWrapper.append(deleteClientButton);
    buttonsWrapper.append(deleteButtonWrapper);
    return {buttonsWrapper};
  }

  createRow(parent, headers) {
    const clientRow = document.createElement('tr');
    clientRow.classList.add('table-row');
    headers.forEach(header => {
      const clientCell = document.createElement('td');

      const dateWrapper = document.createElement('span');
      const dateSpan = document.createElement('span');
      const timeSpan = document.createElement('span');
      switch (header) {
        case 'id':
          clientCell.classList.add('txt-grey');
          clientCell.textContent = this.id;

          const copyButton = document.createElement('button');
          copyButton.classList.add('copy-button');
          
          copyButton.textContent = `${window.location.origin}/#${this.id}`;
          copyButton.addEventListener('click' || 'keydown', (event) => {
            window.getSelection().removeAllRanges();
            const elemCoord = event.target.getBoundingClientRect();

            const range = document.createRange();
            range.selectNode(event.target);
            console.log( window.getSelection().addRange(range));
            
            try {
              const hrefCopy = document.execCommand('copy');

              const copyTooltip = document.createElement('span');
              copyTooltip.classList.add('tooltip-copy');
              copyTooltip.textContent = 'ссылка скопирована';
              if (window.innerWidth > 1200) {
                copyTooltip.setAttribute('style', `left: ${elemCoord.left + window.pageXOffset}px; top: ${elemCoord.top + window.pageYOffset -35}px`);
              } else {
                copyTooltip.setAttribute('style', `left: ${elemCoord.left + window.pageXOffset + 65}px; top: ${elemCoord.top + window.pageYOffset -25}px`);
              }

              document.body.append(copyTooltip);
              setTimeout(() => {
                copyTooltip.classList.add('tooltip-copy_active');
              }, 0);
              setTimeout(() => {
                copyTooltip.classList.remove('tooltip-copy_active');
              }, 800);
              setTimeout(() => {
                copyTooltip.remove();
              }, 1000);
            } catch(err) {
              new ErrorModal('Ссылка не скопирована. Попробуйте еще раз.');
            }
            window.getSelection().removeAllRanges();
            removeFocus(event);
          })

          clientCell.append(copyButton);
          break;
        case 'fullName':
          clientCell.textContent = this.fullName;
          break;
        case 'createdAt':
          dateWrapper.classList.add('table-cell__dateWrapper');
          dateSpan.classList.add('table-cell__date');
          timeSpan.classList.add('table-cell__time');
          dateSpan.textContent = this.createDate;
          timeSpan.textContent = this.createTime;
          dateWrapper.append(dateSpan);
          dateWrapper.append(timeSpan);
          clientCell.append(dateWrapper);
          break;
        case 'updatedAt':
          dateWrapper.classList.add('table-cell__dateWrapper');
          dateSpan.classList.add('table-cell__date');
          timeSpan.classList.add('table-cell__time');
          dateSpan.textContent = this.updateDate;
          timeSpan.textContent = this.updateTime;
          dateWrapper.append(dateSpan);
          dateWrapper.append(timeSpan);
          clientCell.append(dateWrapper);
          break;
        case 'contacts':
          const contactsIcons = this.createContactsIcons(clientCell, this.contacts);
          clientCell.append(contactsIcons);
          break;
        case 'actions':
          let buttons = this.createButtons(this.id);
          clientCell.append(buttons.buttonsWrapper);
          break;
        default:
          if (_fieldWithError === false) {
            new ErrorModal(`Для столбца "${header}" отсутствуют данные! Проверьте передаваемые сервером данные.`);
          }
          _fieldWithError = true;
          break;
      }
      clientCell.classList.add('table-cell');
      clientRow.append(clientCell);
    });
    parent.append(clientRow);
  }
}