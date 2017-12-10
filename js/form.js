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
  };

  var onRadioControlEffectChange = function (e) {
    var str = EFFECT_CLASS_NAME_PREFIX;
    var effectName = e.target.id.slice(str.length);
    if (lastEffectName && effectImagePreview.classList.contains(lastEffectName)) {
      effectImagePreview.classList.remove(lastEffectName);
    }
    effectImagePreview.classList.add(effectName);
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
})();
