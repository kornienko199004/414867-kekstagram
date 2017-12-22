'use strict';

(function () {
  var CODE_ESC = 27;
  var MAX_COMMENT_LENGTH = 140;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_QUANTITY_OF_HASHTAGS = 5;
  var OVERLAY_HIDDEN_CLASS = 'hidden';
  var DEFAULT_FILTER_EFFECT = 'none';

  var resetValues = function () {
    effectImagePreview.className = defaultEffectClassName;
    effectElement.checked = defaultEffect;
    uploadFormHashtagsElement.value = '';
    uploadFormDescriptionElement.value = '';
    resetSliderPosition();
    setFilterEffect(DEFAULT_FILTER_EFFECT);
  };

  var resetSliderPosition = function () {
    uploadEffectLevelPinElement.style.left = defaultPositionOfSlider;
    uploadEffectLevelValElement.style.width = defaultWidth;
    uploadEffectLevelValue.value = defaultLeft;
  };

  var hideSlider = function () {
    if (!uploadEffectLevelElement.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      uploadEffectLevelElement.classList.add(OVERLAY_HIDDEN_CLASS);
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
    hideSlider();
    window.errorPopup.hide();
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
    var possibleTags = tagsString.split(' ').map(function (item) {
      return item.toLowerCase();
    });
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

  var onDocumentKeydown = function (evt) {
    if (!uploadOverlay.classList.contains(OVERLAY_HIDDEN_CLASS) && evt.keyCode === CODE_ESC && isCommentInputOnFocus !== 1) {
      uploadOverlay.classList.add(OVERLAY_HIDDEN_CLASS);
      uploadFileElement.value = '';
      hideSlider();
      window.errorPopup.hide();
    }
  };

  var onLoad = function () {
    window.errorPopup.hide();
    uploadOverlay.classList.add(OVERLAY_HIDDEN_CLASS);
    uploadFileElement.value = '';
    resetValues();
  };

  var onFormSubmit = function (evt) {
    var isCommentElementValid = validateCommentElement();
    var isTagsElementValid = validateTagsElement();
    if (!isCommentElementValid || !isTagsElementValid) {
      evt.preventDefault();
      if (!isTagsElementValid) {
        highlightElement(uploadFormHashtagsElement, 'red');
      }
      if (!isCommentElementValid) {
        highlightElement(uploadFormDescriptionElement, 'red');
      }
    } else {
      evt.preventDefault();
      var formData = new FormData(formElement);
      if (dropFile) {
        formData.set('filename', dropFile);
        dropFile = null;
      }
      window.backend.save(formData, onLoad, window.errorPopup.show);
      if (!uploadFileElement.required) {
        uploadFileElement.required = true;
      }
    }
  };

  var onSliderPinMouseDown = function (evt) {
    evt.preventDefault();
    var maxWidthOfSlider = uploadEffectLevelLineElement.offsetWidth;
    var startCoords = evt.clientX;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var left = (uploadEffectLevelPinElement.offsetLeft - (startCoords - moveEvt.clientX));
      if (left <= 0) {
        left = 0;
      } else if (left >= maxWidthOfSlider) {
        left = maxWidthOfSlider;
      }
      startCoords = moveEvt.clientX;
      uploadEffectLevelPinElement.style.left = left + 'px';
      uploadEffectLevelValElement.style.width = left + 'px';
      uploadEffectLevelValue.value = Math.round((left / maxWidthOfSlider) * 100);
      setFilterEffect(window.initializeFilters.createFilterEffect(uploadEffectLevelValue.value));
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var setScale = function (scale) {
    effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  };
  var setFilterEffect = function (filter) {
    effectImagePreview.style.filter = filter;
  };
  var setFilter = function (lastEffectName, filter, effectName) {
    if (lastEffectName && effectImagePreview.classList.contains(lastEffectName) && effectName) {
      effectImagePreview.classList.remove(lastEffectName);
    }
    if (effectName) {
      effectImagePreview.classList.add(effectName);
    }
    setFilterEffect(filter);
    resetSliderPosition();
    if (effectName !== 'effect-none') {
      if (uploadEffectLevelElement.classList.contains(OVERLAY_HIDDEN_CLASS)) {
        uploadEffectLevelElement.classList.remove(OVERLAY_HIDDEN_CLASS);
      }
    } else {
      uploadEffectLevelElement.classList.add(OVERLAY_HIDDEN_CLASS);
      setFilterEffect('none');
    }
    setFilterEffect(filter);
  };


  var formElement = document.querySelector('.upload-form');
  var uploadFileElement = formElement.querySelector('#upload-file');
  var uploadOverlay = formElement.querySelector('.upload-overlay');
  var uploadFormCancelElement = formElement.querySelector('.upload-form-cancel');
  var uploadFormDescriptionElement = formElement.querySelector('.upload-form-description');

  var uploadEffectControlElement = formElement.querySelector('.upload-effect-controls');
  var effectImagePreview = formElement.querySelector('.effect-image-preview');
  var uploadFormHashtagsElement = formElement.querySelector('.upload-form-hashtags');
  var scaleElement = document.querySelector('.upload-resize-controls');

  var effectElement = formElement.querySelector('[name=effect]');
  var defaultEffect = effectElement.checked;
  var defaultEffectClassName = effectImagePreview.className;

  var isCommentInputOnFocus;

  var uploadEffectLevelPinElement = formElement.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelLineElement = formElement.querySelector('.upload-effect-level-line');
  var uploadEffectLevelValElement = formElement.querySelector('.upload-effect-level-val');
  var uploadEffectLevelElement = formElement.querySelector('.upload-effect-level');
  var uploadEffectLevelValue = formElement.querySelector('.upload-effect-level-value');
  var defaultPositionOfSlider = uploadEffectLevelPinElement.style.left;
  var defaultWidth = uploadEffectLevelValElement.style.width;
  var defaultLeft = uploadEffectLevelValue.value;
  var uploadFileElementLabel = formElement.querySelector('.upload-file');
  var dropFile;
  window.initializeScale(uploadFileElement, uploadFileElementLabel, scaleElement, setScale);
  window.preview.dragPicture(uploadFileElement, uploadFileElementLabel, function (pictureSrc, dropTarget) {
    dropFile = dropTarget;
    effectImagePreview.src = pictureSrc;
    if (uploadOverlay.classList.contains(OVERLAY_HIDDEN_CLASS)) {
      uploadOverlay.classList.remove(OVERLAY_HIDDEN_CLASS);
      resetValues();
    }
  });

  effectImagePreview.style.backgroundColor = 'white';
  window.initializeFilters.effect(uploadEffectControlElement, setFilter, 100);

  uploadEffectLevelElement.classList.add(OVERLAY_HIDDEN_CLASS);

  formElement.action = 'https://js.dump.academy/kekstagram';
  uploadFormCancelElement.addEventListener('click', onCancelButtonClick);
  uploadFormDescriptionElement.maxLength = MAX_COMMENT_LENGTH;
  uploadFormDescriptionElement.addEventListener('focus', onCommentInputOnFocus);
  uploadFormDescriptionElement.addEventListener('blur', onCommentInputBlur);

  uploadFormDescriptionElement.addEventListener('change', onChangeCommentElement);
  uploadFormHashtagsElement.addEventListener('change', onChangeTagsElement);
  document.addEventListener('keydown', onDocumentKeydown);
  formElement.addEventListener('submit', onFormSubmit);
  uploadEffectLevelPinElement.addEventListener('mousedown', onSliderPinMouseDown);
})();
