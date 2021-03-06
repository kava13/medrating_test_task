# Задание

Есть API для получения альбомов, фотографий, и юзеров:

- https://json.medrating.org/albums?userId=3
- https://json.medrating.org/photos?albumId=2
- https://json.medrating.org/users/

Сделать страницу, на которой выводятся фото, примерный макет:

![alt text](https://github.com/kava13/medrating_test_task/raw/master/img/task.png)

## Требования

Вверху страницы должно быть два кликабельных элемента, выглядящих как ссылки: "КАТАЛОГ" и "ИЗБРАННОЕ". Но не быть настоящими ссылками! Приложение должно работать без перезагрузок страницы!

При нажатии на "КАТАЛОГ" отображается каскадный список.

На первом уровне - имена пользователей.

На втором уровне - названия альбомов для соответствующего пользователя.

На третьем уровне - фотографии из соответствующего альбома.

Возле каждой фотографии - серая звезда. При клике на звезду она становится подсвеченной, этот выбор записывается в local storage.

При клике на фотографию появляется всплывающее окно с полноразмерной версией фотографии.

При наведении курсора на фотографию должно всплывать название этого фото (title).

При клике на имя пользователя раскрывается, либо скрывается список альбомов этого пользователя.

При клике на название альбома раскрывается, либо скрывается список фотографий этого пользователя.

При нажатии на "Избранное" отображается плоский список фотографий с названиями. Это фото, у которых нажали на звезду и записали в local storage.
Рядом с каждым фото разместить подсвеченную звезду, при нажатии на звезду - удалять фото из списка избранных.

Здесь тоже при клике показать полноразмерное фото.

При перезагрузке страницы избранные фотографии должны так же помечаться подсвеченной звёздочкой и отображаться в списке избранных.

Фотографии не нужно подгружать до того, как их покажут при клике по альбому.
