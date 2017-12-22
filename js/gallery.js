'use strict';

(function () {
  var CODE_ESC = 27;
  var CODE_ENTER = 13;
  var OVERLAY_HIDDEN_CLASS = 'hidden';

  var onDocumentKeydown = function (evt) {
    if (!galleryOverlayElement.classList.contains(OVERLAY_HIDDEN_CLASS) && (evt.keyCode === CODE_ESC)) {
      galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
    }
  };

  var onCloseButtonClick = function (evt) {
    evt.preventDefault();
    galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
  };

  var onCloseButtonKeydown = function (evt) {
    if (evt.keyCode === CODE_ENTER) {
      evt.preventDefault();
      galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
      if (lastPictureFocusedElement) {
        lastPictureFocusedElement.focus();
      }
    }
  };
  var renderPictures = function (data) {
    pictureListElement = window.renderer.renderList(pictureTemplateElement, data, {
      url: ['img', 'src'],
      commentsCount: ['.picture-comments', 'textContent'],
      likes: ['.picture-likes', 'textContent']
    });
    picturesContainerElement.appendChild(pictureListElement);
    if (filtersElement.classList.contains('filters-inactive')) {
      filtersElement.classList.remove('filters-inactive');
    }
  };
  var onLoad = function (data) {
    pictures = data.map(function (item) {
      return Object.assign(item, {
        commentsCount: item.comments.length
      });
    });
    renderPictures(pictures);
  };

  var generateRandomNumber = function (startNumber, endNumber) {
    return Math.round(Math.random() * (endNumber - startNumber)) + startNumber;
  };
  var createMixedArray = function (array) {
    var arrayCopy = array.slice(0);
    var element;
    var number;
    var mixedArray = [];
    while (arrayCopy.length > 0) {
      number = generateRandomNumber(0, arrayCopy.length - 1);
      element = arrayCopy[number];
      mixedArray.push(element);
      arrayCopy.splice(number, 1);
    }
    return mixedArray;
  };

  var returnSortingData = function (pictures, typeOfSorting) {
    var picturesCopy = pictures.slice(0);
    switch (typeOfSorting) {
      case 'filter-recommend':
        return pictures;
      case 'filter-popular':
        return picturesCopy.sort(function (first, second) {
          return second.likes - first.likes;
        });
      case 'filter-discussed':
        return picturesCopy.sort(function (first, second) {
          return second.commentsCount - first.commentsCount;
        });
      case 'filter-random':
        return createMixedArray(picturesCopy);
      default:
        break;
    }
    return 'none';
  };

  var onSortingMethodChange = function (evt) {
    var child;
    var sortingType = evt.target.id;
    var children = picturesContainerElement.querySelectorAll('.picture');
    for (var i = children.length - 1; i >= 0; i--) {
      child = children[i];
      picturesContainerElement.removeChild(child);
    }

    window.debounce(function () {
      renderPictures(returnSortingData(pictures, sortingType));
    });

  };

  var pictureListElement;

  var pictures;
  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplateElement = document.querySelector('#picture-template').content;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
  var lastPictureFocusedElement;
  var filtersElement = document.querySelector('.filters');
  galleryOverlayElementCloseElement.tabIndex = 0;

  window.backend.load(onLoad, window.errorPopup.show);

  picturesContainerElement.addEventListener('click', function (evt) {
    window.preview.onPhotoClick(evt, picturesContainerElement, galleryOverlayElement);
  });
  picturesContainerElement.addEventListener('keydown', function (evt) {
    window.preview.onPhotoKeydown(evt, galleryOverlayElement);
  });
  galleryOverlayElementCloseElement.addEventListener('click', onCloseButtonClick);
  galleryOverlayElementCloseElement.addEventListener('keydown', onCloseButtonKeydown);
  document.addEventListener('keydown', onDocumentKeydown);

  filtersElement.addEventListener('change', onSortingMethodChange);
})();
