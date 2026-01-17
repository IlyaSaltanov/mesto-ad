const config = {
  baseUrl: "https://nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "d7dfbd44-614a-4dde-b0a1-533fe18f782d",
    "Content-Type": "application/json",
  },
};

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

// При выполнении такого запроса (getUserInfo), если он прошёл успешно, 
// в ответе от сервера вы получите объект данных пользователя:
// {
//   "name": "{{ Имя вашего пользователя }}",
//   "about": "{{ Описание вашего пользователя }}",
//   "avatar": "{{ Ссылка на аватар вашего пользователя }}",
//   "_id": "{{ Ваш идентификатор пользователя }}",
//   "cohort": "{{ Ваш идентификатор группы }}"
// } 

// Получение списка карточек
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};
// При выполнении такого запроса (getCardList), если он прошёл успешно, 
// в ответе от сервера вы получите JSON с массивом карточек, 
// которые загрузили студенты вашей группы:
// [
//   {
//     "likes": [  // Пользователи поставившие лайк карточке
//       {
//         "name": "{{ Имя пользователя поставившего лайк }}",
//         "about": "{{ Описание пользователя поставившего лайк }}",
//         "avatar": "{{ Аватар пользователя поставившего лайк }}",
//         "_id": "{{ Идентификатор пользователя поставившего лайк }}",
//         "cohort": "{{ Идентификатор группы пользователя поставившего лайк }}"
//       }
//     ],
//     "_id": "{{ Идентификатор карточки }}",
//     "name": "{{ Имя карточки }}",
//     "link": "{{ Ссылка на изображение карточки }}",
//     "owner": {  // Информация об авторе карточки
//       "name": "{{ Имя автора карточки }}",
//       "about": "{{ Описание автора карточки }}",
//       "avatar": "{{ Аватар автора карточки }}",
//       "_id": "{{ Идентификатор автора карточки }}",
//       "cohort": "{{ Идентификатор группы автора карточки}}"
//     },
//     "createdAt": "{{ Дата и время создания карточки }}"
//   },
// ]

export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(getResponseData);
};

// При выполнении такого запроса (setUserInfo), 
// если он прошёл успешно, в ответе от сервера 
// вы получите тело c обновлёнными данными пользователя:
// {
//   "name": "{{ Обновлённое имя вашего пользователя }}",
//   "about": "{{ Обновлённое описание вашего пользователя }}",
//   "avatar": "{{ Ссылка на аватар вашего пользователя }}",
//   "_id": "{{ Ваш идентификатор пользователя }}",
//   "cohort": "{{ Ваш идентификатор группы }}"
// }

export const setAvatarInfo = ({ name, about, avatar }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
      avatar,
    }),
  }).then(getResponseData);
};

// При выполнении такого запроса, 
// если он прошёл успешно, в ответе от сервера 
// вы получите тело c обновлёнными данными пользователя:
// {
//   "name": "{{ Имя вашего пользователя }}",
//   "about": "{{ Описание вашего пользователя }}",
//   "avatar": "{{ Обновлённая ссылка на аватар вашего пользователя }}",
//   "_id": "{{ Ваш идентификатор пользователя }}",
//   "cohort": "{{ Ваш идентификатор группы }}"
// }

export const addCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then(getResponseData);
};