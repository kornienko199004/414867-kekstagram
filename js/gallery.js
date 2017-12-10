'use strict';

(function () {
  var onDocumentKeydown = function (e) {
    if (!window.utilits.hasClass(galleryOverlayElement, window.utilits.overlayHiddenClass) && (e.keyCode === codeESC)) {
      window.utilits.addClass(galleryOverlayElement, window.utilits.overlayHiddenClass);
    }
  };

  var onCloseButtonClick = function (e) {
    e.preventDefault();
    window.utilits.addClass(galleryOverlayElement, window.utilits.overlayHiddenClass);
  };

  var onCloseButtonKeydown = function (e) {
    if (e.keyCode === codeEnter) {
      e.preventDefault();
      window.utilits.addClass(galleryOverlayElement, window.utilits.overlayHiddenClass);
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
  var pictures = [];
  var codeESC = 27;
  var codeEnter = 13;

  for (var i = 1; i <= 25; i++) {
    pictures.push(window.data.generatePicture(i));
  }

  galleryOverlayElementCloseElement.tabIndex = 0;

  var pictureList = window.picture.renderList(pictureTemplateElement, pictures, {
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
