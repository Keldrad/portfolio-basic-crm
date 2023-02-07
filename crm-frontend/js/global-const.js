export {
  basicUrl,
  imgSources,
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
}

const basicUrl = 'http://localhost:3000/api/clients/';

const imgSources = [
  '/img/table/loader.svg',
  '/img/table/loader-white.svg',
  '/img/table/loader-min.svg',
  '/img/table/loader-red.svg',
  '/img/modal/save_client_loader.svg',
  '/img/table/sorting_arrow.svg',
  '/img/contacts-type/phone.svg',
  '/img/contacts-type/fb.svg',
  '/img/contacts-type/vk.svg',
  '/img/contacts-type/mail.svg',
  '/img/contacts-type/another.svg',
  '/img/table/edit-client.svg',
  '/img/table/delete-client.svg',
  '/img/table/add_client_button.svg',
  '/img/table/add_client_button_hover.svg',
  '/img/modal/close_modal.svg',
  '/img/modal/add_contact.svg',
  '/img/modal/add_contact_hover.svg',
];

const nameTitle = 'Допустимы: символы кирилицы, дефис, пробел, апостроф.';
const namePattern = '^[ёЁа-яА-Я- \']+$';

const telPattern = '^[0-9- ()+]+$';
const telTitle = 'Допустимы: цифры, плюс, дефис, пробел, открывающая и закрывающая скобки.';

const emailPattern = '^[a-zA-Z0-9@.]+$';
const emailTitle = `Допустимы: цифры, латинские буквы, @ и точка.
Шаблон: po.st@ex.ample.com`;

const fbPattern = '^[0-9a-zA-Z.]+$';
const fbTitle = 'Допустимы: цифры, латинские буквы и точка.';

const vkPattern = '^[0-9a-zA-Z_]+$';
const vkTitle = 'Допустимы: цифры, латинские буквы и подчеркивание.';

const allTitle = 'Введите контактную информацию в удобной для Вас форме.';

