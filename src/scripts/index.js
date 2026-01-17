/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation, validationSettings } from "./components/validation.js";
import { getUserInfo, getCardList, setUserInfo, setAvatarInfo, addCard, deleteCard, changeLikeCardStatus } from "./components/api.js";

// Тест API функций
console.log("🧪 Тестирование API...");
getUserInfo()
  .then(user => console.log("✓ getUserInfo успешна:", user))
  .catch(error => console.error("✗ Ошибка getUserInfo:", error));

getCardList()
  .then(cards => console.log("✓ getCardList успешна:", cards))
  .catch(error => console.error("✗ Ошибка getCardList:", error));

setUserInfo({ name: "Test Name", about: "Test About" })
  .then(userData => console.log("✓ setUserInfo успешна:", userData))
  .catch(error => console.error("✗ Ошибка setUserInfo:", error));

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

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalUserListTitle = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalUserList = cardInfoModalWindow.querySelector(".popup__list");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

let userId;

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const infoTemplate = document.getElementById("popup-info-definition-template");
  const infoElement = infoTemplate.content.cloneNode(true);
  infoElement.querySelector(".popup__info-term").textContent = term;
  infoElement.querySelector(".popup__info-description").textContent = description;
  return infoElement;
};

const createUserPreviewElement = (userName) => {
  const userTemplate = document.getElementById("popup-info-user-preview-template");
  const userElement = userTemplate.content.cloneNode(true);
  userElement.querySelector(".popup__list-item").textContent = userName;
  return userElement;
};

const handleInfoClick = (cardId) => {
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      
      cardInfoModalTitle.textContent = cardData.name;
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalUserList.innerHTML = "";
      
      cardInfoModalInfoList.append(
        createInfoString(
          "Описание:",
          cardData.name
        )
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardData.createdAt))
        )
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Автор:",
          cardData.owner.name
        )
      );

      cardInfoModalUserListTitle.textContent = "Лайкнули:";
      
      if (cardData.likes.length > 0) {
        cardData.likes.forEach((like) => {
          cardInfoModalUserList.append(
            createUserPreviewElement(like.name)
          );
        });
      } else {
        cardInfoModalUserListTitle.textContent = "Лайков нет";
      }

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleDeleteCard = (cardId, cardElement, deleteButton) => {
  const buttonText = deleteButton.textContent;
  deleteButton.textContent = "Удаление...";
  
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
      deleteButton.textContent = buttonText;
    });
};

const handleLikeCard = (cardId, likeButton, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((cardData) => {
      likeButton.classList.toggle("card__like-button_is-active");
      const likeCount = likeButton.closest(".card").querySelector(".card__like-count");
      likeCount.textContent = cardData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector("button[type='submit']");
  const buttonText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = buttonText;
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector("button[type='submit']");
  const buttonText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  
  setAvatarInfo({
    name: profileTitle.textContent,
    about: profileDescription.textContent,
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = buttonText;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector("button[type='submit']");
  const buttonText = submitButton.textContent;
  submitButton.textContent = "Создание...";
  
  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          onInfoClick: handleInfoClick,
          userId,
        })
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = buttonText;
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

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationSettings);


Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    userId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((data) => {
      placesWrap.append(
        createCardElement(data, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          onInfoClick: handleInfoClick,
          userId,
        })
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });