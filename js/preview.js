'use strict';

(function () {
  var CODE_ENTER = 13;
  var OVERLAY_HIDDEN_CLASS = 'hidden';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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
          commentsCount: getAttribute(element, '.picture-comments', 'textContent'),
          likes: getAttribute(element, '.picture-likes', 'textContent')
        },
        {
          url: ['.gallery-overlay-image', 'src'],
          commentsCount: ['.comments-count', 'textContent'],
          likes: ['.likes-count', 'textContent']
        }
    );
  };

  var dropFile;


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
    },

    dragPicture: function (fileElement, dropElement, onLoad) {
      var setNewSrcOfImagePreview = function (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();
          window.errorPopup.hide();
          reader.addEventListener('load', function () {
            if (dropFile) {
              onLoad(reader.result, file);
              dropFile = null;
            } else {
              onLoad(reader.result);
            }
          });
          reader.readAsDataURL(file);
        } else {
          window.errorPopup.show('Не правильный формат файла');
        }
      };

      var onInputFileChange = function () {
        var file = fileElement.files[0];
        setNewSrcOfImagePreview(file);
      };

      var onInputFileDrop = function (e) {
        e.preventDefault();
        dropFile = e.dataTransfer.files[0];
        setNewSrcOfImagePreview(dropFile);
      };

      dropElement.addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      dropElement.addEventListener('drop', onInputFileDrop);
      fileElement.addEventListener('change', onInputFileChange);
    }
  };
})();
