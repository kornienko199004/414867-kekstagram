'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var dropFile;

  window.showLoadPhoto = {
    showPhoto: function (previewElement, fileElement, dropElement, showOverlay) {
      var setNewSrcOfImagePreview = function (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            previewElement.src = reader.result;
            showOverlay();
          });
          reader.readAsDataURL(file);
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
    },

    returnDropFile: function () {
      return dropFile;
    },
    resetDropFile: function () {
      dropFile = null;
    }
  };
}());
