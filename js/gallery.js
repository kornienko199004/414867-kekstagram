'use strict';

(function () {
  var onDocumentKeydown = function (e) {
    if (!window.units.hasClass(galleryOverlayElement, window.units.overlayHiddenClass) && (e.keyCode === window.units.codeESC)) {
      window.units.addClass(galleryOverlayElement, window.units.overlayHiddenClass);
    }
  };

  var onCloseButtonClick = function (e) {
    e.preventDefault();
    window.units.addClass(galleryOverlayElement, window.units.overlayHiddenClass);
  };

  var onCloseButtonKeydown = function (e) {
    if (e.keyCode === window.units.codeEnter) {
      e.preventDefault();
      window.units.addClass(galleryOverlayElement, window.units.overlayHiddenClass);
      if (lastPictureFocused) {
        lastPictureFocused.focus();
      }
    }
  };
  var picturesContainerElement = document.querySelector('.pictures');
  var pictureTemplateElement = document.querySelector('#picture-template').content;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
  var lastPictureFocused;
  galleryOverlayElementCloseElement.tabIndex = 0;

  var pictureList = window.picture.renderList(pictureTemplateElement, window.data.pictures, {
    url: ['img', 'src'],
    comments: ['.picture-comments', 'textContent'],
    likes: ['.picture-likes', 'textContent']
  });

  picturesContainerElement.appendChild(pictureList);

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
