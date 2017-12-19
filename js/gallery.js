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

  (function () {
    var DEBOUNCE_INTERVAL = 500;

    var lastTimeout;
    window.debounce = function (fun) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    };
  })();

  var returnSortingData = function (picturesArray, picturesArrayCopy, typeOfSorting) {
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
        return (function () {
          var element;
          var number;
          var newPicturesArray = [];
          while (picturesArrayCopy.length > 0) {
            number = generateRandomNumber(0, picturesArrayCopy.length - 1);
            element = picturesArrayCopy[number];
            newPicturesArray.push(element);
            picturesArrayCopy.splice(number, 1);
          }
          return newPicturesArray;
        })();
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
      renderPictures(returnSortingData(pictures, pictures.slice(0), sortingType));
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
