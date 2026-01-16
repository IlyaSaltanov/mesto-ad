/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { initialCards } from "./cards.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation, validationSettings } from "./components/validation.js";

import {
  getUserInfo,
  getCardList,
  setUserInfo,
  deleteCard,
  updateAvatar,
  addCard,
  deleteCard as deleteCardApi
} from "./components/api.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

let currentUserId = null;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      // Код отвечающий за обновление данных на странице
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  
  // Получаем ссылку на аватар из input
  const newAvatarUrl = avatarInput.value;
  
  // Вызываем функцию updateAvatar из api.js
  updateAvatar(newAvatarUrl)
    .then((userData) => {
      // После успешного ответа от сервера обновляем аватар на странице
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
      
      // Закрываем модальное окно
      closeModalWindow(avatarFormModalWindow);
      
      // Очищаем форму
      avatarForm.reset();
    })
    .catch((err) => {
      console.log("Ошибка при обновлении аватара:", err);
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  
  // 1. Получаем данные из формы
  const cardName = cardNameInput.value;
  const cardLink = cardLinkInput.value;
  
  // 2. Вызываем функцию addCard из api.js для отправки на сервер
  addCard({
    name: cardName,
    link: cardLink,
  })
    .then((newCardData) => {
      // 3. После успешного ответа от сервера добавляем карточку на страницу
      
      // 4. Определяем, является ли текущий пользователь владельцем карточки
      const isOwn = newCardData.owner._id === currentUserId;
      
      // 5. Создаем элемент карточки с данными из ответа сервера
      const cardElement = createCardElement(
        newCardData,
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
        },
        isOwn,
        false,  // новая карточка еще не лайкнута
        0       // количество лайков = 0
      );
      
      // 6. Добавляем карточку в начало списка
      placesWrap.prepend(cardElement);
      
      // 7. Закрываем модальное окно
      closeModalWindow(cardFormModalWindow);
      
      // 8. Очищаем форму
      cardForm.reset();
    })
    .catch((err) => {
      console.log("Ошибка при добавлении карточки:", err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

// отображение карточек
initialCards.forEach((data) => {
  placesWrap.append(
    createCardElement(data, {
      onPreviewPicture: handlePreviewPicture,
      onLikeIcon: likeCard,
      onDeleteCard: deleteCard,
    })
  );
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// Включение валидации всех форм
enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    // Заполняем профиль данными с сервера
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;

    // Отображаем карточки с сервера
    cards.forEach((cardData) => {
      const isOwn = cardData.owner._id === currentUserId;
      const isLiked = cardData.likes.some((like) => like._id === currentUserId);

      const cardElement = createCardElement(
        cardData,
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (cardId) => handleLikeCard(cardId, cardElement),
          onDeleteCard: (cardId) => handleDeleteCard(cardId, cardElement),
        },
        isOwn,
        isLiked,
        cardData.likes.length
      );

      // Скрываем иконку удаления, если пользователь не автор
      const deleteButton = cardElement.querySelector('.card__control-button_type_delete');
      if (deleteButton && !isOwn) {
        deleteButton.style.display = 'none';
      }

      placesWrap.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });