'use strict';

(function () {
  var CODE_ESC = 27;
  var CODE_ENTER = 13;
  var OVERLAY_HIDDEN_CLASS = 'hidden';

  var onDocumentKeydown = function (e) {
    if (!galleryOverlayElement.classList.contains(OVERLAY_HIDDEN_CLASS) && (e.keyCode === CODE_ESC)) {
      galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
    }
  };

  var onCloseButtonClick = function (e) {
    e.preventDefault();
    galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
  };

  var onCloseButtonKeydown = function (e) {
    if (e.keyCode === CODE_ENTER) {
      e.preventDefault();
      galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
      if (lastPictureFocused) {
        lastPictureFocused.focus();
      }
    }
  };
  var renderPictures = function (data) {
    pictureList = window.renderer.renderList(pictureTemplateElement, data, {
      url: ['img', 'src'],
      commentsCount: ['.picture-comments', 'textContent'],
      likes: ['.picture-likes', 'textContent']
    });
    picturesContainerElement.appendChild(pictureList);
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
  var returnMixedArray = function (array) {
    var element;
    var number;
    var mixedArray = [];
    while (array.length > 0) {
      number = generateRandomNumber(0, array.length - 1);
      element = array[number];
      mixedArray.push(element);
      array.splice(number, 1);
    }
    return mixedArray;
  };

  var returnSortingData = function (picturesArray, typeOfSorting) {
    var picturesArrayCopy = pictures.slice(0);
    switch (typeOfSorting) {
      case 'filter-recommend':
        return picturesArray;
      case 'filter-popular':
        return picturesArrayCopy.sort(function (first, second) {
          return second.likes - first.likes;
        });
      case 'filter-discussed':
        return picturesArrayCopy.sort(function (first, second) {
          return second.commentsCount - first.commentsCount;
        });
      case 'filter-random':
        return returnMixedArray(picturesArrayCopy);
      default:
        break;
    }
    return 'none';
  };

  var onSortingMethodChange = function (e) {
    var sortingType = e.target.id;
    var children = picturesContainerElement.querySelectorAll('.picture');
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      picturesContainerElement.removeChild(child);
    }

    window.debounce(function () {
      renderPictures(returnSortingData(pictures, sortingType));
    });

  };

  var pictureList;

  var pictures;
  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplateElement = document.querySelector('#picture-template').content;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
  var lastPictureFocused;
  var filtersElement = document.querySelector('.filters');
  galleryOverlayElementCloseElement.tabIndex = 0;

  window.backend.load(onLoad, window.errorPopup.show);

  picturesContainerElement.addEventListener('click', function (e) {
    window.preview.onPhotoClick(e, picturesContainerElement, galleryOverlayElement);
  });
  picturesContainerElement.addEventListener('keydown', function (e) {
    window.preview.onPhotoKeydown(e, galleryOverlayElement);
  });
  galleryOverlayElementCloseElement.addEventListener('click', onCloseButtonClick);
  galleryOverlayElementCloseElement.addEventListener('keydown', onCloseButtonKeydown);
  document.addEventListener('keydown', onDocumentKeydown);

  filtersElement.addEventListener('change', onSortingMethodChange);
})();
