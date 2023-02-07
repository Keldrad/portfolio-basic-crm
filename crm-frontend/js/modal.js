export {
  Modal,
  AddClientModal,
  ModifyClientModal,
  DeleteClientModal,
  ErrorModal,
}

import {
  nameTitle,
  namePattern,
  telPattern,
  telTitle,
  emailPattern,
  emailTitle,
  fbPattern,
  fbTitle,
  vkPattern,
  vkTitle,
  allTitle,
} from "./global-const.js";

import {
  checkForValue,
  checkingValidity,
  valueCorrection,
  createLoaderCircle,
  removeFocus,
  } from "./help.js";

import {
  saveClientRequest,
  deleteClientRequest,
  getClientData,
} from "./api.js";


class Modal {
  constructor(show = {type: 'edit'}) {
    this.showType = show.type;
    this.modal = document.createElement('div');
    this.modal.classList.add('modal-wrapper');

    this.modalContent = document.createElement('div');
    this.modalContent.classList.add('modal-window');

    if (this.showType !== 'view' && this.showType !== 'error') {
      this.modalBackground = document.createElement('div');
      this.modalBackground.classList = 'modal-background';
      this.modalBackground.addEventListener('click', () => {
        this.removeModal();
      })

      window.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
          this.removeModal();
        }
      })

      this.closeModalButton = document.createElement('button');
      this.closeModalButton.classList.add('btn-reset', 'close-modal-button');
      this.closeModalButton.addEventListener('click', () => {
        this.removeModal();
      });
      this.modalContent.append(this.closeModalButton);
      this.modal.append(this.modalBackground);
    } 
  
    this.modal.append(this.modalContent);
    this.showModal();
  }

  showModal() {
    document.body.classList.add('body-noscroll');
    document.body.append(this.modal);
    setTimeout(() => {
      this.modal.classList.add('modal_visible');
      if (this instanceof AddClientModal) {
        this.modalContent.querySelector('input').focus();
      }
    }, 0);
  }

  removeModal() {
    document.body.classList.remove('body-noscroll');
    this.modal.classList.remove('modal_visible');
    setTimeout(() => {
      this.modal.remove();
    }, 250);
  };
}


class AddClientModal extends Modal {
  constructor(show) {
    super(show);
    this.modalContent.classList.add('modal-client');

    const clientModalForm = document.createElement('div');
    clientModalForm.classList.add('modal-client__form');

    this.clientModalHeader = document.createElement('h2');
    this.clientModalHeader.classList.add('modal-client__header');
    this.clientModalHeader.textContent = 'Новый клиент';

    this.clientModalHeaderID = document.createElement('p');
    this.clientModalHeaderID.classList.add('modal-client__id');
    this.clientModalHeaderID.textContent = 'айдишечка';

    const clientModalContactsWrapper = document.createElement('div');
    clientModalContactsWrapper.classList.add('modal-client__contacts-wrapper');
    clientModalContactsWrapper.setAttribute('id', 'contacts');

    const clientContacts = document.createElement('div');
    clientContacts.classList.add('modal-client__contacts');

    this.clientModalErrorField = document.createElement('div');
    this.clientModalErrorField.classList.add('modal-client__error-field');

    clientModalForm.append(this.clientModalHeader);
    clientModalForm.append(this.clientModalHeaderID);
    this.createNameField(clientModalForm);
    this.modalContent.append(clientModalForm);
    clientModalContactsWrapper.append(clientContacts)
    this.modalContent.append(clientModalContactsWrapper);
    this.createContactsField(show);
    this.modalContent.append(this.clientModalErrorField);
    this.contactsCounter = 0;

    if (this.showType !== 'view') {
      this.clientModalConfirmButton = document.createElement('button');
      this.clientModalConfirmButton.classList.add('btn-reset', 'modal-client__confirm-button');
      this.clientModalConfirmButton.textContent = 'Сохранить';
      this.confirmButtonEvent();
      
      this.clientModalBottomButton = document.createElement('button');
      this.clientModalBottomButton.classList.add('btn-reset', 'modal-client__cancel-button');
      this.clientModalBottomButton.textContent = 'Отмена';
      this.clientModalBottomButton.addEventListener('click', () => {
        this.removeModal();
      });
      
      this.modalContent.append(this.clientModalConfirmButton);
      this.modalContent.append(this.clientModalBottomButton);
    }
  }

  confirmButtonEvent() {
    this.clientModalConfirmButton.addEventListener('click', () => {
      this.saveClient('POST');
    });
  }

  modalblock() {
    this.blocker = document.createElement('div');
    this.blocker.classList.add('modal-window-blocker');
    
    const loaderWrapper = document.createElement('div'); 
    loaderWrapper.classList.add('blocker-loader-wrapper');
    
    this.blocker.append(loaderWrapper);
    this.modalContent.append(this.blocker);
    setTimeout(() => {
      this.blocker.setAttribute('style', 'opacity: 1');
    }, 0);
    return loaderWrapper;
  }

  createInput(inputCssClass, pattern, title) {
    const newInputFiled = document.createElement('input');
    newInputFiled.classList.add(inputCssClass);
    newInputFiled.pattern = pattern;
    newInputFiled.title = title;
    newInputFiled.addEventListener('focus', checkForValue);
    newInputFiled.addEventListener('input', checkingValidity);
    return newInputFiled;
  }

  createNameField(clientModalForm) {
    let labelArray = ['surname Фамилия', 'name Имя', 'lastName Отчество'];

    labelArray.forEach(element => {
      let [label, text] = element.split(' ');
      const wrapper = document.createElement('div');
      wrapper.classList.add('modal-client__label-wrapper');

      const newInput = this.createInput('modal-client__input', namePattern, nameTitle);
      newInput.setAttribute('id', label);
      newInput.setAttribute('type', 'text');
      newInput.setAttribute('autocomplete', 'off');
      newInput.addEventListener('blur', valueCorrection);
      newInput.addEventListener('input', function() {
        if (this.value) {
          this.classList.add('modal-client__input_active');
          this.classList.remove('modal-client__input_error');
        } else {
          this.classList.remove('modal-client__input_active');  
        }
      })

      if (this.showType === 'view') {
        newInput.addEventListener('keypress', function(event) {
          event.preventDefault();
        })
      }

      const newLabel = document.createElement('label');
      newLabel.classList.add('modal-client__label');
      newLabel.setAttribute('for', label);
      newLabel.textContent = text;

      if (label !== 'lastName') {
        const newDot = document.createElement('span');
        newDot.classList.add('modal-client-dot');
        newDot.textContent = '*';
        newLabel.append(newDot);
      }    
  
      wrapper.append(newInput);
      wrapper.append(newLabel);
      clientModalForm.append(wrapper);
    });
  }

  createContactsField() {
    this.contactsWrapper = document.querySelector('.modal-client__contacts-wrapper');
    this.contacts = document.querySelector('.modal-client__contacts');

    if (this.showType !== 'view') {
      this.addContactButton = document.createElement('button');
      this.addContactButton.classList.add('btn-reset', 'modal-client__add-contact-button');
      this.addContactButton.textContent = 'Добавить контакт';
      
      this.addContactButton.addEventListener('click', (event) => {
        removeFocus(event)
        this.createContact();
      })
      this.contactsWrapper.append(this.addContactButton);
    }
  }
  
  createContact() {
    this.contactsCounter++;
    this.contactsWrapper.classList.add('modal-client__contacts-wrapper_active');
    if (this.contactsCounter === 10 && this.showType !== 'view') {
      this.addContactButton.remove();
    }
    const optionsArr = [
                        'Телефон',
                        'Email',
                        'Facebook',
                        'Vk',
                        'Другое',
                      ];

    this.contactWrapper = document.createElement('div');
    this.contactWrapper.classList.add('contact-wrapper');
    
    this.contactSelect = document.createElement('select');
    this.contactSelect.classList.add('contact-select');

    optionsArr.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.classList.add('contact-wrapper__option');
      optionElement.textContent = option;
      this.contactSelect.append(optionElement);
    });

    this.contactInput = this.createInput('contact-wrapper__input', telPattern, telTitle);
    this.contactInput.placeholder = 'Введите данные контакта';
    this.contactInput.addEventListener('input', function() {
      if (this.value) {
        this.classList.add('contact-wrapper__input_active');
        this.classList.remove('contact-wrapper__input_error');

      } else {
        this.classList.remove('contact-wrapper__input_active');
      }
    });
    
    this.contactWrapper.append(this.contactSelect);
    this.contactWrapper.append(this.contactInput);
    
    if (this.showType !== 'view') {
      const contactDeleteButton = document.createElement('button');
      contactDeleteButton.classList.add('contact-wrapper__delete-button', 'tooltip');
      const contactDeleteButtonTooltip = document.createElement('p');
      contactDeleteButtonTooltip.textContent = 'Удалить контакт';
      contactDeleteButtonTooltip.classList.add('tooltiptext', 'tooltip-delete');
      contactDeleteButton.append(contactDeleteButtonTooltip);
      contactDeleteButton.addEventListener('click', () => {
        this.contactsCounter--;
        contactDeleteButton.parentNode.remove();
        if (this.contactsCounter < 1) {
          this.contactsWrapper.classList.remove('modal-client__contacts-wrapper_active');
        }
        this.contactsWrapper.append(this.addContactButton);
      })
      this.contactWrapper.append(contactDeleteButton);
    }
    
    this.contacts.append(this.contactWrapper);
    this.choices = this.activateSelect(this.contactSelect);
    this.contactInput.focus();
  }
  
  activateSelect(node) {
    const choices = new Choices(node, {
      searchEnabled: false,
      shouldSort: false,  
      itemSelectText: '',
      position: 'below',
      allowHTML: true,
    });
    
    // событие при выборе нового значения из выпадающего списка варантов типа контакта
    node.addEventListener('change', function(event) {
        const inputField = this.parentElement.parentElement.parentElement.querySelector('.contact-wrapper__input');
        inputField.value = '';
        inputField.classList.remove('contact-wrapper__input_active');
        switch (this.value) {
          case 'Телефон':
            inputField.pattern = telPattern;
            inputField.title = telTitle;
            break;
          case 'Email':
            inputField.pattern = emailPattern;
            inputField.title = emailTitle;
            break;
          case 'Facebook':
            inputField.pattern = fbPattern;
            inputField.title = fbTitle;
            break;
          case 'Vk':
            inputField.pattern = vkPattern;
            inputField.title = vkTitle;
            break;
        
          default:
            inputField.removeAttribute('pattern');
            inputField.title = allTitle;
            break;
        }
      },
      false,
    )
      
    if (this.showType === 'view') {
      choices.disable();
    }
    return choices;
  }


  async saveClient(method) {
    const clientData = {};
    const modalBlocker = this.modalblock();
    
    function validate() {
      let validateErrors = [];
      let contactError = false;
      const contacts = [];
      const contactWrappers = document.querySelectorAll('.contact-wrapper');
      contactWrappers.forEach(contactWrapper => {
        const contactType = contactWrapper.querySelector('option');
        const contactValue = contactWrapper.querySelector('input');
        if (!contactValue.value) {
          if (contactError) {
            validateErrors.push({'field': contactValue});
          } else {
            validateErrors.push({'field': contactValue, 'message': 'Не заполнены все поля контактов!'});
          }
          contactError = true;
        } else {
          contacts.push({'type': contactType.value, 'value': contactValue.value});
        }
      });

      const surnameInput = document.getElementById('surname');
      if (surnameInput.value) {
        clientData.surname = surnameInput.value;
      } else {
        validateErrors.push({'field': surnameInput, 'message': 'Не введена фамилия!'})
      }

      const nameInput = document.getElementById('name');
      if (nameInput.value) {
        clientData.name = nameInput.value;
      } else {
        validateErrors.push({'field': nameInput, 'message': 'Не введено имя!'})
      }

      const lastNameInput = document.getElementById('lastName');
      clientData.lastName = lastNameInput.value,
      clientData.contacts = contacts;

       if (validateErrors.length) {
        return validateErrors;
       } else {
        return false;
       };
    }
    const validateHasErrors = validate();

    if (validateHasErrors) {
      let errors = [];
      validateHasErrors.forEach(error => {
        error.field.classList.add(error.field.classList[0]+'_error');
        errors.push({message: error.message})
      });
      this.showErrors = errors;
      this.blocker.remove();
      return;
    } else {
      // отправка на сервер после валидации
      const loaderWrapper = document.createElement('div');
      loaderWrapper.classList.add('confirm-button__loader-wrapper');
      this.clientModalConfirmButton.prepend(loaderWrapper);
      createLoaderCircle(modalBlocker, 'white-big');
      createLoaderCircle(loaderWrapper, 'white');
      const response = await saveClientRequest(clientData, method, this.id);
      if (response) {
        this.showErrors = response;
      }
    }
  }
  
  set showErrors(errors) {
    this.clientModalErrorField.innerHTML = '';
    errors.forEach(error => {
      const errorText = document.createElement('p');
      errorText.textContent = error.message;
      this.clientModalErrorField.append(errorText);
    });
    this.blocker.remove();
  };
}


class ModifyClientModal extends AddClientModal {
  constructor(id, show, targetButton) {
    super(show);
    if (targetButton) {
      this.loaderWrapper = targetButton.parentNode.querySelector('.button-loader'); 
      this.loaderWrapper.classList.remove('button-loader_modify');
      this.loader =  createLoaderCircle(this.loaderWrapper, 'min');
    }

    const blocker = this.modalblock();
    createLoaderCircle(blocker, 'purp');
    const clientData = getClientData(id);

    if (this.showType === 'view') {
      this.clientModalHeader.textContent = 'Данные клиента';
    } else {
      this.clientModalHeader.textContent = 'Изменить данные';
    }

    this.clientModalHeaderID.textContent = `ID: ${id}`;
    this.clientModalHeaderID.setAttribute('style', 'visibility: visible');
    this.id = id;
    const fields = this.identyfyFields();
    clientData.then( data => {
      if (data.message === 'Client Not Found') {
        blocker.parentNode.remove();
        document.querySelectorAll('.modal-client__label-wrapper').forEach(label => label.remove());
        document.querySelector('.modal-client__contacts-wrapper').textContent = 'Клиент не найден.';
      }

      fields.surnameInputField.value = data.surname;
      fields.surnameInputField.classList.add('modal-client__input_active');
      fields.nameInputField.value = data.name;
      fields.nameInputField.classList.add('modal-client__input_active');
      fields.lastNameInputField.value = data.lastName;
      fields.lastNameInputField.classList.add('modal-client__input_active');

      if (data.contacts.length === 0 && this.showType === 'view') {
        this.contacts.style = "padding-top: 0px; text-align: center;";
        this.contacts.textContent = 'Контактные данные отсутствуют.';
      } else {
        data.contacts.forEach(contact => {
          this.createContact(contact.type, contact.value);
          this.contactInput.classList.add('contact-wrapper__input_active');
          if (this.showType === 'view') {
            this.contactInput.addEventListener('keypress', function(event) {
              event.preventDefault();
            })
          }
        });
      }

      if (targetButton) {
        this.loader.remove();
        this.loaderWrapper.classList.add('button-loader_modify');
      }
      this.blocker.remove();
    });

    if (this.showType !== 'view') {
      this.clientModalBottomButton.textContent = 'Удалить';
      this.clientModalBottomButton.addEventListener('click', () => {
        const deleteButton = document.getElementById('del'+this.id);
        setTimeout(() => {
          new DeleteClientModal(this.id, deleteButton);
        }, 350);
      })
    }
  }
  
  confirmButtonEvent() {
    this.clientModalConfirmButton.addEventListener('click', () => {
      this.saveClient('PATCH');
    })
  }

 createContact(type = 'Телефон', value = '') {
    super.createContact();
    this.contactInput.value = value;
    this.choices.setChoiceByValue(type);
  }

  identyfyFields() {
    const surnameInputField = document.querySelector('#surname');
    const nameInputField = document.querySelector('#name');
    const lastNameInputField = document.querySelector('#lastName');
    return ({surnameInputField, nameInputField, lastNameInputField})
  }

  fixContactsView() {
    const contacts = document.querySelector('.modal-client__contacts');
    contacts.setAttribute('style', 'padding-top: 25px');
    contacts.parentNode.classList.remove('modal-client__contacts-wrapper_active');
    contacts.parentNode.setAttribute('style', 'padding: 0 25px');;
  }
}


class DeleteClientModal extends Modal {
  constructor(id, targetButton) {
    super();
    this.id = id;

    this.modalContent.classList.add('modal-client', 'modal-client_delete');
    const deleteClientHeader = document.createElement('h2');
    deleteClientHeader.classList.add('modal-client__header', 'modal-client__header_delete');
    deleteClientHeader.textContent = 'Удалить клиента';
    
    const deleteClientText = document.createElement('p');
    deleteClientText.classList.add('modal-delete-client__text');
    deleteClientText.textContent = 'Вы действительно хотите удалить данного клиента?';
    
    const deleteClientConfirmButton = document.createElement('button');
    deleteClientConfirmButton.classList.add('btn-reset', 'modal-client__confirm-button');
    deleteClientConfirmButton.textContent = 'Удалить';
    deleteClientConfirmButton.addEventListener('click', () => {
      const loaderWrapper = targetButton.parentNode.querySelector('.button-loader'); 
      loaderWrapper.classList.remove('button-loader_delete');
      createLoaderCircle(loaderWrapper, 'red');
      deleteClientRequest(this.id);
      this.removeModal();
    })

    const deleteClientCancel = document.createElement('button');
    deleteClientCancel.classList.add('btn-reset', 'modal-client__cancel-button');
    deleteClientCancel.textContent = 'Отмена';
    deleteClientCancel.addEventListener('click', () => {
      this.removeModal();
    })

    this.modalContent.append(deleteClientHeader)
    this.modalContent.append(deleteClientText)
    this.modalContent.append(deleteClientConfirmButton)
    this.modalContent.append(deleteClientCancel)
  }
}


class ErrorModal extends Modal {
  constructor(errors, show) {
    super(show);
    this.modal.classList.add('modal-error');
    this.modal.classList.remove('modal-wrapper');
    this.modal.textContent = 'Ошибка обращения к серверу.';
    this.errorMessage = document.createElement('p');
    this.errorMessage.textContent = errors;
    this.modal.append(this.errorMessage);

    const closeModalButton = document.createElement('button');
      closeModalButton.classList.add('btn-reset', 'close-modal-button');
      this.modal.append(closeModalButton);   

      closeModalButton.addEventListener('click', () => {
      this.removeModal();
    })
  }

  removeModal() {
    const blocker = document.querySelector('.modal-window-blocker');
    this.modal.classList.remove('modal_visible');
    setTimeout(() => {
      if (blocker) {
        blocker.removeAttribute('style');
        blocker.remove();
      }
      this.modal.remove();
    }, 200);
  };
}