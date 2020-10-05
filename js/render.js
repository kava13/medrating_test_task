import { showAlbums, showPhotos } from "./script.js";
import Favorite from "./favorites.js";

// Рендерит какой-либо список в зависимости от данных и properties
export function createList(data, listProperties) {
  let list = document.createElement("ul");
  list.classList.add("list");

  data.forEach((element) => {
    // Отбрасываем все неподходящие объекты
    if (Object.keys(element).length > 1) {
      let listElement = createListElement(element, listProperties);

      list.append(listElement);
    }
  });

  return list;
}

// Создает один элемент списка в зависимости от передаваемого класса
function createListElement(item, properties) {
  const { name, title } = item;

  let liBlock = document.createElement("li");
  liBlock.dataset.state = "collapse";

  // Если делаем фото, то блок выглядит иначе
  if (properties.className === "photo") {
    createPhotoBlock(item, liBlock);
  } else {
    liBlock.innerHTML = `<div class="item-content">
                              <div class="icon-arrow">
                              </div>
                              <span> ${item[properties.mainProperty]}</span>
                            </div>`;
  }

  liBlock.classList.add("item");
  liBlock.classList.add(properties.className);

  // Создает обработчики событий в зависимости от того что создано ранее: пользователи или альбомы
  if (properties.className === "user") {
    liBlock.addEventListener("click", (event) => {
      event.stopPropagation();

      if (liBlock.dataset.loaded === "true") {
        return;
      } else {
        showAlbums(event, item, liBlock);
      }
      liBlock.dataset.loaded = "true";
    });
  } else if (properties.className === "album") {
    liBlock.addEventListener("click", (event) => {
      event.stopPropagation();

      if (liBlock.dataset.loaded === "true") {
        return;
      } else {
        showPhotos(event, item, liBlock);
      }
      liBlock.dataset.loaded = "true";
    });
  }

  liBlock.addEventListener("click", function (event) {
    // Чтобы не всплывали клики от родителя
    event.stopPropagation();

    let isExpand = this.dataset.state === "expand";
    let arrows = this.getElementsByClassName("icon-arrow");
    let list = this.getElementsByClassName("list");
    this.dataset.state = isExpand ? "collapse" : "expand";

    if (arrows && arrows[0]) {
      arrows[0].classList.toggle("icon-collapse");
    }

    if (list && list[0]) {
      list[0].hidden = isExpand;
    }
  });

  return liBlock;
}

function createPhotoBlock(item, container) {
  let starBlock = document.createElement("div");
  starBlock.className = "icon icon-star";

  starBlock.dataset.state =
    new Favorite().getIndex(item) === -1 ? "inactive" : "active";
  if (starBlock.dataset.state === "active") {
    starBlock.classList.toggle("active");
  }

  starBlock.addEventListener("click", function () {
    this.dataset.state =
      this.dataset.state === "active" ? "inactive" : "active";
    switch (this.dataset.state) {
      case "active":
        new Favorite().add(item);
        break;
      case "inactive":
        new Favorite().delete(item);
        break;
    }
    this.classList.toggle("active");
  });

  let photo = createImg(item, "thumbnailUrl");

  photo.addEventListener("click", function () {
    showViewer(item);
  });

  container.append(starBlock);
  container.append(photo);
}

// Создаем картинку в блоке с фото
function createImg(item, imgProperty) {
  let img = document.createElement("img");

  img.setAttribute("src", item[imgProperty]);
  img.setAttribute("alt", item.title);
  img.setAttribute("title", item.title);

  return img;
}

// Функции для отображения полноэкранного фото
function showViewer(item) {
  let viewer = document.querySelector(".viewer");
  let img = createImg(item, "url");
  viewer.innerHTML = "";
  viewer.append(img);
  toggleViewer();
}

export function toggleViewer() {
  let viewer = document.querySelector(".viewer");
  let overlay = document.querySelector(".overlay");
  viewer.style.display = overlay.style.display ? "" : "block";
  overlay.style.display = overlay.style.display ? "" : "block";
}
