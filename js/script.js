import { API } from "./api.js";
import Favorite from "./favorites.js";
import { createList, toggleViewer } from "./render.js";

let navbarCatalog = document.querySelector(".navbar__catalog"),
  navbarFavorites = document.querySelector(".navbar__favorites"),
  mainBlock = document.querySelector(".main-block"),
  catalogBlock = document.querySelector(".catalog-block"),
  favoritesBlock = document.querySelector(".favorites-block"),
  overlay = document.querySelector(".overlay");

// Отображает список пользователей. Внутри для рендера используется createList
function showUsers() {
  favoritesBlock.style.display = "none";
  catalogBlock.style.display = "block";

  if (catalogBlock.dataset.loaded !== "true") {
    new API().getUsers().then((data) => {
      let list = createList(data, {
        className: "user",
        mainProperty: "name",
      });
      catalogBlock.append(list);
    });
    catalogBlock.dataset.loaded = "true";
  }
}

export function showAlbums(event, item, container) {
  let userID = item.id;

  new API().getAlbumsByUser(userID).then((data) => {
    let list = createList(data, {
      className: "album",
      mainProperty: "title",
    });

    container.append(list);
  });

  let name = event.target.textContent;
}

export function showPhotos(event, item, container) {
  let albumID = item.id;

  new API().getPhotosByAlbum(albumID).then((data) => {
    let list = createList(data, {
      className: "photo",
      mainProperty: "thumbnailUrl",
    });
    container.append(list);
  });
}

function showFavorites() {
  favoritesBlock.innerHTML = ``;
  catalogBlock.style.display = "none";
  favoritesBlock.style.display = "block";

  let favoriteItems = new Favorite().read();

  if (favoriteItems) {
    let list = createList(favoriteItems, {
      className: "photo",
    });

    favoritesBlock.appendChild(list);
  }
}

navbarCatalog.addEventListener("click", showUsers);
navbarFavorites.addEventListener("click", showFavorites);
overlay.addEventListener("click", toggleViewer);
