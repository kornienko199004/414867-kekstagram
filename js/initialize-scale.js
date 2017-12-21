'use strict';

(function () {
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var SCALE_STEP = 25;
  var DEFAULT_SCALE = 55;

  window.initializeScale = function (fileElement, dropElement, scaleElement, adjustScale) {
    var onResizeControlsButtonDecClick = function () {
      scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) - SCALE_STEP;
      if (scale < MIN_SCALE) {
        scale = MIN_SCALE;
      }
      uploadResizeControlsValue.value = scale + '%';
      adjustScale(scale);
    };

    var onResizeControlsButtonInkClick = function () {
      scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) + SCALE_STEP;
      if (scale > MAX_SCALE) {
        scale = MAX_SCALE;
      }
      uploadResizeControlsValue.value = scale + '%';
      adjustScale(scale);
    };

    var setDefaultScale = function () {
      adjustScale(DEFAULT_SCALE);
      uploadResizeControlsValue.value = DEFAULT_SCALE + '%';
    };

    var uploadResizeControlsButtonDec = scaleElement.querySelector('.upload-resize-controls-button-dec');
    var uploadResizeControlsButtonInc = scaleElement.querySelector('.upload-resize-controls-button-inc');
    var uploadResizeControlsValue = scaleElement.querySelector('.upload-resize-controls-value');
    var scale;

    uploadResizeControlsButtonInc.addEventListener('click', onResizeControlsButtonInkClick);
    uploadResizeControlsButtonDec.addEventListener('click', onResizeControlsButtonDecClick);
    fileElement.addEventListener('change', setDefaultScale);
    dropElement.addEventListener('drop', setDefaultScale);
  };
})();
