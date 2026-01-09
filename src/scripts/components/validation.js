
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

// 5. disableSubmitButton — делает кнопку неактивной
const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

// 6. enableSubmitButton — включает кнопку
const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
};

// 7. toggleButtonState — включает или отключает кнопку
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// 8. setEventListeners — добавляет обработчики события input
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, settings);
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// 9. clearValidation — очищает ошибки валидации и делает кнопку неактивной
const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
  
  disableSubmitButton(buttonElement, settings);
};

// 10. enableValidation — отвечает за включение валидации всех форм
const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    
    setEventListeners(formElement, settings);
  });
};
