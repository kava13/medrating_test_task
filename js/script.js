import {
    API
} from './api.js';
import Favorite from './favorites.js'

let navbarCatalog = document.querySelector('.navbar__catalog'),
    navbarFavorites = document.querySelector('.navbar__favorites'),
    mainBlock = document.querySelector('.main-block'),
    catalogBlock = document.querySelector('.catalog-block'),
    favoritesBlock = document.querySelector('.favorites-block'),
    overlay = document.querySelector('.overlay');



function createPhotoBlock(item, container) {

    let starBlock = document.createElement('div');
    starBlock.className = 'icon icon-star';

    starBlock.dataset.state = new Favorite().getIndex(item) === -1 ? 'inactive' : 'active';
    if (starBlock.dataset.state === 'active') {
        starBlock.classList.toggle('active');
    }

    starBlock.addEventListener('click', function () {
        this.dataset.state = this.dataset.state === 'active' ? 'inactive' : 'active';
        switch (this.dataset.state) {
            case 'active':
                new Favorite().add(item);
                break;
            case 'inactive':
                new Favorite().delete(item);
                break;
        }
        this.classList.toggle('active');
    });

    let photo = createImg(item, 'thumbnailUrl');

    photo.addEventListener('click', function () {
        showViewer(item);
    });

    container.append(starBlock);
    container.append(photo);
}

// Создаем картинку в блоке с фото
function createImg(item, imgProperty) {

    let img = document.createElement('img');

    console.log(item[imgProperty]);
    console.log(item.title);

    img.setAttribute('src', item[imgProperty]);
    img.setAttribute('alt', item.title);
    img.setAttribute('title', item.title);

    return img;

}


function createList(data, listProperties) {

    let list = document.createElement('ul');
    list.classList.add('list');

    data.forEach(element => {

        // Отбрасываем все неподходящие объекты
        if (Object.keys(element).length > 1) {

            let listElement = createListElement(element, listProperties);

            list.append(listElement);
        };

    });

    return list;
}

// Создает один элемент списка в зависимости от передаваемого класса
function createListElement(item, properties) {

    const {
        name,
        title
    } = item;

    let liBlock = document.createElement('li');
    liBlock.dataset.state = 'collapse';

    // Если делаем фото, то блок выглядит иначе
    if (properties.className === 'photo') {
        createPhotoBlock(item, liBlock);
    } else {
        liBlock.innerHTML = `<div class="item-content"><div class="icon-arrow"></div><span>  ${item[properties.mainProperty]}</span></div>`
    }

    liBlock.classList.add('item');
    liBlock.classList.add(properties.className);

    liBlock.addEventListener('click', function (event) {
        // Чтобы не всплывали клики от родителя
        event.stopPropagation();

        let isExpand = this.dataset.state === 'expand';
        let arrows = this.getElementsByClassName('icon-arrow');
        let list = this.getElementsByClassName('list');
        this.dataset.state = isExpand ? 'collapse' : 'expand';

        if (arrows && arrows[0]) {
            arrows[0].classList.toggle('icon-collapse');
        }

        console.log(list);
        console.log(list[0]);

        if (list && list[0]) {
            list[0].hidden = isExpand;
        }

    });

    // Создает пользователей или альбомы в зависимости от условия
    if (properties.className === 'user') {
        liBlock.addEventListener('click', (event) => {

            event.stopPropagation();

            if (liBlock.dataset.loaded === 'true') {
                return
            } else {
                showAlbums(event, item, liBlock);

            }
            liBlock.dataset.loaded = 'true';

        })
    } else if (properties.className === 'album') {

        liBlock.addEventListener('click', (event) => {

            event.stopPropagation();

            if (liBlock.dataset.loaded === 'true') {
                return
            } else {
                showPhotos(event, item, liBlock);
            }
            liBlock.dataset.loaded = 'true';
        })

    }

    return liBlock

}

function showUsers() {

    favoritesBlock.style.display = 'none';
    catalogBlock.style.display = 'block';

    if (catalogBlock.dataset.loaded !== 'true') {
        new API().getUsers().then(data => {

            let list = createList(data, {
                className: 'user',
                mainProperty: 'name'
            })
            catalogBlock.append(list);

        });
        catalogBlock.dataset.loaded = 'true'
    }

}

function showAlbums(event, item, container) {

    let userID = item.id;

    new API().getAlbumsByUser(userID).then(data => {
        let list = createList(data, {
            className: 'album',
            mainProperty: 'title'
        })
        container.append(list);

    });

    let name = event.target.textContent;

}

function showPhotos(event, item, container) {

    let albumID = item.id;

    new API().getPhotosByAlbum(albumID).then(data => {

        let list = createList(data, {
            className: 'photo',
            mainProperty: 'thumbnailUrl'
        })
        container.append(list);
    })
}

function showFavorites() {

    favoritesBlock.innerHTML = ``;
    catalogBlock.style.display = 'none';
    favoritesBlock.style.display = 'block';

    let favoriteItems = new Favorite().read();

    if (favoriteItems) {
        let list = createList(favoriteItems, {
            className: 'photo'
        });

        favoritesBlock.appendChild(list);
    }
}

// Функции для отображения полноэкранного фото
function showViewer(item) {
    let viewer = document.querySelector('.viewer');
    let img = createImg(item, 'url');
    viewer.innerHTML = '';
    viewer.append(img);
    toggleViewer();
}

function toggleViewer() {
    let viewer = document.querySelector('.viewer');
    let overlay = document.querySelector('.overlay');
    viewer.style.display = overlay.style.display ? '' : 'block';
    overlay.style.display = overlay.style.display ? '' : 'block';
}


navbarCatalog.addEventListener('click', showUsers);
navbarFavorites.addEventListener('click', showFavorites);
overlay.addEventListener('click', toggleViewer);