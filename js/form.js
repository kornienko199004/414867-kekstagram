'use strict';

(function () {
  var CODE_ESC = 27;
  var SCALE_STEP = 25;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var MAX_COMMENT_LENGTH = 140;
  var MAX_HASHTAG_LENGTH = 20;
  var EFFECT_CLASS_NAME_PREFIX = 'upload-';
  var MAX_QUANTITY_OF_HASHTAGS = 5;
  var OVERLAY_HIDDEN_CLASS = 'hidden';
  var DEFAULT_FILTER_VALUE = 100;

  var setScale = function (scale) {
    effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
    uploadResizeControlsValue.value = scale + '%';
  };

  var resetValues = function () {
    scale = defaultScale;
    setScale(scale);
    effectImagePreview.className = defaultEffectClassName;
    effect.checked = defaultEffect;
    uploadFormHashtagsElement.value = '';
    uploadFormDescriptionElement.value = '';
    resetFilter();
    setFilter('none');
  };

  var resetFilter = function () {
    uploadEffectLevelPinElement.style.left = defaultPositionOfSlider;
    uploadEffectLevelValElement.style.width = defaultWidth;
    uploadEffectLevelValue.value = defaultLeft;
  };

  var onInputFileChange = function () {
    if (uploadOverlay.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      uploadOverlay.classList.remove(OVERLAY_HIDDEN_CLASS);
      resetValues();
    }
  };

  var onCommentInputOnFocus = function () {
    isCommentInputOnFocus = 1;
  };

  var onCommentInputBlur = function () {
    isCommentInputOnFocus = 0;
  };

  var onCancelButtonClick = function () {
    if (!uploadOverlay.classList.contains(OVERLAY_HIDDEN_CLASS) && isCommentInputOnFocus !== 1) {
      uploadOverlay.classList.add(OVERLAY_HIDDEN_CLASS);
      uploadFileElement.value = '';
    }
    if (!uploadEffectLevel.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      uploadEffectLevel.classList.add(OVERLAY_HIDDEN_CLASS);
    }
  };

  var aproximation = function (maxValueOfNewRange, maxValueOfProcess, value, unit) {
    var coefficient = maxValueOfNewRange / maxValueOfProcess;
    var output = value * coefficient;
    if (unit) {
      output = output + unit;
    }
    return output > maxValueOfNewRange ? maxValueOfNewRange : output;
  };

  var createFilterEffect = function (effectName, value) {
    var maxValueOfProcess = 100;
    switch (effectName) {
      case 'effect-chrome':
        return 'grayscale(' + aproximation(1, maxValueOfProcess, value) + ')';
      case 'effect-sepia':
        return 'sepia(' + aproximation(1, maxValueOfProcess, value) + ')';
      case 'effect-marvin':
        return 'invert(' + aproximation(100, maxValueOfProcess, value, '%') + ')';
      case 'effect-phobos':
        return 'blur(' + aproximation(3, maxValueOfProcess, value, 'px') + ')';
      case 'effect-heat':
        return 'brightness(' + aproximation(3, maxValueOfProcess, value) + ')';
      default:
        break;
    }
    return 'none';
  };

  var setFilter = function (filter) {
    effectImagePreview.style.filter = filter;
  };

  var onRadioControlEffectChange = function (e) {
    var str = EFFECT_CLASS_NAME_PREFIX;
    var effectName = e.target.id.slice(str.length);

    if (lastEffectName && effectImagePreview.classList.contains(lastEffectName)) {
      effectImagePreview.classList.remove(lastEffectName);
    }

    effectImagePreview.classList.add(effectName);

    if (effectName !== 'effect-none') {
      if (uploadEffectLevel.classList.contains(OVERLAY_HIDDEN_CLASS)) {
        uploadEffectLevel.classList.remove(OVERLAY_HIDDEN_CLASS);
      }
      setFilter(createFilterEffect(effectName, DEFAULT_FILTER_VALUE));
      resetFilter();
    } else {
      if (!uploadEffectLevel.classList.contains(OVERLAY_HIDDEN_CLASS)) {
        uploadEffectLevel.classList.add(OVERLAY_HIDDEN_CLASS);
      }
      setFilter('none');
    }

    lastEffectName = effectName;
  };

  var onResizeControlsButtonDecClick = function () {
    scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) - SCALE_STEP;
    if (scale < MIN_SCALE) {
      scale = MIN_SCALE;
    }
    setScale(scale);
  };

  var onResizeControlsButtonInkClick = function () {
    scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) + SCALE_STEP;
    if (scale > MAX_SCALE) {
      scale = MAX_SCALE;
    }
    setScale(scale);
  };

  var highlightElement = function (element, color) {
    element.style.borderColor = color;
  };

  var resetHighlightElement = function (element) {
    element.style.borderColor = 'initial';
  };

  var validateTagsString = function (tagsString) {
    if (!tagsString) {
      return true;
    }
    var possibleTags = tagsString.split(' ');
    var uniqueTags = possibleTags.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
    var invalidTags = possibleTags
        .map(function (tag) {
          return tag.length < MAX_HASHTAG_LENGTH && tag[0] === '#';
        })
        .filter(function (validationResult) {
          return !validationResult;
        });
    return invalidTags.length === 0 && possibleTags.length <= MAX_QUANTITY_OF_HASHTAGS && possibleTags.length === uniqueTags.length;
  };

  var validateTagsElement = function () {
    return validateTagsString(uploadFormHashtagsElement.value);
  };

  var validateCommentElement = function () {
    return uploadFormDescriptionElement.value.length <= MAX_COMMENT_LENGTH;
  };

  var onChangeTagsElement = function () {
    if (validateTagsElement()) {
      resetHighlightElement(uploadFormHashtagsElement);
    } else {
      highlightElement(uploadFormHashtagsElement, 'red');
    }
  };

  var onChangeCommentElement = function () {
    if (validateCommentElement()) {
      resetHighlightElement(uploadFormDescriptionElement);
    } else {
      highlightElement(uploadFormDescriptionElement, 'red');
    }
  };

  var onDocumentKeydown = function (e) {
    if (!uploadOverlay.classList.contains(OVERLAY_HIDDEN_CLASS) && e.keyCode === CODE_ESC && isCommentInputOnFocus !== 1) {
      uploadOverlay.classList.add(OVERLAY_HIDDEN_CLASS);
      uploadFileElement.value = '';
    }
    if (!uploadEffectLevel.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      uploadEffectLevel.classList.add(OVERLAY_HIDDEN_CLASS);
    }
  };

  var onFormSubmit = function (e) {
    var isCommentElementValid = validateCommentElement();
    var isTagsElementValid = validateTagsElement();
    if (!isCommentElementValid || !isTagsElementValid) {
      e.preventDefault();
      if (!isTagsElementValid) {
        highlightElement(uploadFormHashtagsElement, 'red');
      }
      if (!isCommentElementValid) {
        highlightElement(uploadFormDescriptionElement, 'red');
      }
    }
  };

  var onSliderPinMouseDown = function (e) {
    e.preventDefault();
    var maxWidthOfSlider = uploadEffectLevelLineElement.offsetWidth;
    var startCoords = {
      x: e.clientX
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };
      var left;
      left = (uploadEffectLevelPinElement.offsetLeft - shift.x);
      if (left <= 0) {
        left = 0;
      } else if (left >= maxWidthOfSlider) {
        left = maxWidthOfSlider;
      }
      uploadEffectLevelPinElement.style.left = left + 'px';
      uploadEffectLevelValElement.style.width = left + 'px';
      uploadEffectLevelValue.value = Math.round((left / maxWidthOfSlider) * 100);

      setFilter(createFilterEffect(lastEffectName, uploadEffectLevelValue.value));

    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var formElement = document.querySelector('.upload-form');
  var uploadFileElement = formElement.querySelector('#upload-file');
  var uploadOverlay = formElement.querySelector('.upload-overlay');
  var uploadFormCancelElement = formElement.querySelector('.upload-form-cancel');
  var uploadFormDescriptionElement = formElement.querySelector('.upload-form-description');
  var uploadResizeControlsValue = formElement.querySelector('.upload-resize-controls-value');
  var uploadEffectControlElement = formElement.querySelector('.upload-effect-controls');
  var effectImagePreview = formElement.querySelector('.effect-image-preview');
  var uploadFormHashtagsElement = formElement.querySelector('.upload-form-hashtags');
  var uploadResizeControlsButtonDec = formElement.querySelector('.upload-resize-controls-button-dec');
  var uploadResizeControlsButtonInc = formElement.querySelector('.upload-resize-controls-button-inc');
  var scale;
  var effect = formElement.querySelector('[name=effect]');
  var defaultEffect = effect.checked;
  var defaultScale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1);
  var defaultEffectClassName = effectImagePreview.className;
  var lastEffectName;
  var isCommentInputOnFocus;

  var uploadEffectLevelPinElement = formElement.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelLineElement = formElement.querySelector('.upload-effect-level-line');
  var uploadEffectLevelValElement = formElement.querySelector('.upload-effect-level-val');
  var uploadEffectLevel = formElement.querySelector('.upload-effect-level');
  var uploadEffectLevelValue = formElement.querySelector('.upload-effect-level-value');
  var defaultPositionOfSlider = uploadEffectLevelPinElement.style.left;
  var defaultWidth = uploadEffectLevelValElement.style.width;
  var defaultLeft = uploadEffectLevelValue.value;

  uploadEffectLevel.classList.add(OVERLAY_HIDDEN_CLASS);

  formElement.action = 'https://js.dump.academy/kekstagram';
  uploadResizeControlsValue.step = SCALE_STEP;

  uploadFileElement.addEventListener('change', onInputFileChange);
  uploadFormCancelElement.addEventListener('click', onCancelButtonClick);
  uploadFormDescriptionElement.maxLength = MAX_COMMENT_LENGTH;
  uploadFormDescriptionElement.addEventListener('focus', onCommentInputOnFocus);
  uploadFormDescriptionElement.addEventListener('blur', onCommentInputBlur);
  uploadEffectControlElement.addEventListener('change', onRadioControlEffectChange);
  uploadResizeControlsButtonDec.addEventListener('click', onResizeControlsButtonDecClick);
  uploadResizeControlsButtonInc.addEventListener('click', onResizeControlsButtonInkClick);
  uploadFormDescriptionElement.addEventListener('change', onChangeCommentElement);
  uploadFormHashtagsElement.addEventListener('change', onChangeTagsElement);
  document.addEventListener('keydown', onDocumentKeydown);
  formElement.addEventListener('submit', onFormSubmit);

  uploadEffectLevelPinElement.addEventListener('mousedown', onSliderPinMouseDown);
})();
