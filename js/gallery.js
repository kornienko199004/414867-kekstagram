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
  };
  var onLoad = function (data) {
    pictures = data.map(function (item) {
      return Object.assign(item, {
        commentsCount: item.comments.length
      });
    });
    renderPictures(pictures);
  };

  var pictureList;

  var pictures;
  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplateElement = document.querySelector('#picture-template').content;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
  var lastPictureFocused;

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

})();
