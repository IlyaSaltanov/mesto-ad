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
  return fetch(`${config.baseUrl}/users/me/avatar`, {
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

// При выполнении такого запроса (addCard), 
// если он прошёл успешно, в ответе 
// от сервера вы получите тело с объектом 
// новой карточки:
//   {
//     "likes": [],
//     "_id": "{{ Идентификатор новой карточки }}",
//     "name": "{{ Имя новой карточки }}",
//     "link": "{{ Ссылка на изображение новой карточки }}",
//     "owner": {
//       "name": "{{ Имя автора карточки }}",
//       "about": "{{ Описание автора карточки }}",
//       "avatar": "{{ Аватар автора карточки }}",
//       "_id": "{{ Идентификатор автора карточки }}",
//       "cohort": "{{ Идентификатор группы автора карточки}}"
//     },
//     "createdAt": "{{ Дата и время создания карточки }}"
//   }, 

export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
};

// При выполнении такого запроса, 
// если он прошёл успешно, сервер вернёт ответ:
// {
//   "message": "Пост удалён"
// }

export const changeLikeCardStatus = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then((res) => getResponseData(res));
};
// Ответ от сервера при выполнении запроса changeLikeCardStatus
// {
//     "likes": [
//         {
//             "name": "Vladislav",
//             "about": "daddad",
//             "avatar": "https://img.geliophoto.com/surgut2020/01_surgut2020.jpg",
//             "_id": "7702abb3ead4f0dc74d4715e",
//             "cohort": "apf-cohort-202"
//         },
//         {
//             "name": "МишаМаша",
//             "about": "ктото",
//             "avatar": "https://sun59-2.userapi.com/s/v1/ig2/Ny0MzBmid--im076Y3FDuvSShQ4HhMmp4qgB8LZ1IA1LIaW73utN15T2sWhqVXGpnKZHPGsAlSw7Q2boZuMThlQB.jpg?quality=95&as=32x31,48x46,72x69,108x104,160x154,240x231,360x346,480x462,540x520,640x616,720x693,952x916&from=bu&cs=952x0",
//             "_id": "ab89961cdb52d9543ebf0e19",
//             "cohort": "apf-cohort-202"
//         },
//         {
//             "name": "ввава",
//             "about": "Исследователь океана",
//             "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
//             "_id": "bc16ef937c37f7f766687e9c",
//             "cohort": "apf-cohort-202"
//         },
//         {
//             "name": "Dmitriy",
//             "about": "programmer",
//             "avatar": "https://i.pinimg.com/736x/86/91/d5/8691d5bbd2af2aa09d4130bc52fa6d79.jpg",
//             "_id": "2ac3969df4d02c02f05f68e8",
//             "cohort": "apf-cohort-202"
//         }
//     ],
//     "_id": "696d2f5a80608c1c5b06074a",
//     "name": "вцввфцвф",
//     "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8_hQCsPvmqVorb3nozSyV3bbxCVEVuxDwg&s",
//     "owner": {
//         "name": "Vladislav",
//         "about": "daddad",
//         "avatar": "https://img.geliophoto.com/surgut2020/01_surgut2020.jpg",
//         "_id": "7702abb3ead4f0dc74d4715e",
//         "cohort": "apf-cohort-202"
//     },
//     "createdAt": "2026-01-18T19:07:06.301Z"
// }