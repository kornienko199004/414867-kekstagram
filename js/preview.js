'use strict';

(function () {
  var CODE_ENTER = 13;
  var OVERLAY_HIDDEN_CLASS = 'hidden';
  var FILE_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png'];

  var getAttribute = function (element, selector, attribute) {
    return element.querySelector(selector)[attribute];
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
    onPhotoClick: function (evt, picturesContainerElement, galleryOverlayElement) {
      var clickElement = evt.target;
      var pictureElement = document.querySelector('.picture');
      evt.preventDefault();
      while (clickElement !== picturesContainerElement) {
        clickElement = clickElement.parentNode;
        if (pictureElement.className === clickElement.className) {
          showCurrentPhotoOverlay(clickElement, galleryOverlayElement);
        }
      }
    },

    onPhotoKeydown: function (evt, galleryOverlayElement) {
      if (evt.keyCode === CODE_ENTER) {
        showCurrentPhotoOverlay(evt.target, galleryOverlayElement);
      }
    },

    dragPicture: function (fileElement, dropElement, onLoad) {
      var loadPreview = function (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_EXTENSIONS.some(function (extension) {
          return fileName.endsWith(extension);
        });

        window.errorPopup.hide();

        if (matches) {
          var reader = new FileReader();
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

      var onInputFileChange = function (evt) {
        var file = evt.target.files[0];
        loadPreview(file);
      };

      var onInputFileDrop = function (evt) {
        evt.preventDefault();
        dropFile = evt.dataTransfer.files[0];
        loadPreview(dropFile);
        if (fileElement.required) {
          fileElement.required = false;
        }
      };

      dropElement.addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      dropElement.addEventListener('drop', onInputFileDrop);
      fileElement.addEventListener('change', onInputFileChange);
    }
  };
})();
