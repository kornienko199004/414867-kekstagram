'use strict';

(function () {
  var CODE_ENTER = 13;
  var OVERLAY_HIDDEN_CLASS = 'hidden';

  var getAttribute = function (element, selector, attribute) {
    if (element) {
      var value = element.querySelector(selector)[attribute];
    }
    return value;
  };

  var showCurrentPhotoOverlay = function (element, galleryOverlayElement) {
    if (galleryOverlayElement.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      galleryOverlayElement.classList.remove(OVERLAY_HIDDEN_CLASS);
    }
    window.renderer.insertDataIntoNode(galleryOverlayElement,
        {
          url: getAttribute(element, 'img', 'src'),
          comments: getAttribute(element, '.picture-comments', 'textContent'),
          likes: getAttribute(element, '.picture-likes', 'textContent')
        },
        {
          url: ['.gallery-overlay-image', 'src'],
          comments: ['.comments-count', 'textContent.length'],
          likes: ['.likes-count', 'textContent']
        }
    );
  };


  window.preview = {
    onPhotoClick: function (e, picturesContainerElement, galleryOverlayElement) {
      var clickElement = e.target;
      var pictureElement = document.querySelector('.picture');
      e.preventDefault();
      while (clickElement !== picturesContainerElement) {
        clickElement = clickElement.parentNode;
        if (pictureElement.className === clickElement.className) {
          showCurrentPhotoOverlay(clickElement, galleryOverlayElement);
        }
      }
    },

    onPhotoKeydown: function (e, galleryOverlayElement) {
      if (e.keyCode === CODE_ENTER) {
        showCurrentPhotoOverlay(e.target, galleryOverlayElement);
      }
    }
  };
})();
