
// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// 1. showInputError — отображает сообщение об ошибке
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// 2. hideInputError — скрывает сообщение об ошибке
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

// 3. checkInputValidity — проверяет валидность конкретного поля
const checkInputValidity = (formElement, inputElement, settings) => {
  if (!inputElement.validity.valid) {
    if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
      showInputError(formElement, inputElement, inputElement.dataset.errorMessage, settings);
    } else {
      showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    }
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

// 4. hasInvalidInput — возвращает true, если хотя бы одно поле невалидно
const hasInvalidInput = (inputList) => {
  // Проходим по каждому элементу массива
  for (let i = 0; i < inputList.length; i++) {
    // Если текущее поле невалидно
    if (inputList[i].validity.valid === false) {
      return true; // Нашли невалидное поле - сразу возвращаем true
    }
  }
  return false; // Если дошли до конца - все поля валидны
};