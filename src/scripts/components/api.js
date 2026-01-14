const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-77",
  headers: {
    authorization: "958ea59d-f6e7-4313-a863-fff5b1308ec7",
    "Content-Type": "application/json",
  },
};

// Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};