'use strict';

var MIN_QUANTITY_OF_LIKES = 15;
var MAX_QUANTITY_OF_LIKES = 200;
var MIN_QUANTITY_OF_COMMENT_ROWS = 1;
var MAX_QUANTITY_OF_COMMENT_ROWS = 2;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var CODE_ESC = 27;
var CODE_ENTER = 13;
var OVERLAY_HIDDEN_CLASS = 'hidden';
var SCALE_STEP = 25;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var MAX_COMMENT_LENGTH = 140;
var MAX_HASHTAG_LENGTH = 20;

var generateRandomCommentIndex = (function () {
  var lastNumberOfComment = 0;
  var generateCommentNumber = function () {
    var numberOfComment;
    do {
      numberOfComment = generateRandomNumber(0, (COMMENTS.length - 1));
    } while (numberOfComment === lastNumberOfComment);

    lastNumberOfComment = numberOfComment;

    return numberOfComment;
  };

  return generateCommentNumber;
}());

var generatePicture = function (photoIndex) {
  var numbersOfLikes = generateRandomNumber(MIN_QUANTITY_OF_LIKES, MAX_QUANTITY_OF_LIKES);
  var numbersOfCommentRows = generateRandomNumber(MIN_QUANTITY_OF_COMMENT_ROWS, MAX_QUANTITY_OF_COMMENT_ROWS);
  var comments = [];

  while (numbersOfCommentRows >= 1) {
    comments.push(COMMENTS[generateRandomCommentIndex()]);
    numbersOfCommentRows--;
  }

  return {
    url: 'photos/' + photoIndex + '.jpg',
    likes: numbersOfLikes,
    comments: comments
  };
};

var generateRandomNumber = function (startNumber, endNumber) {
  return Math.round(Math.random() * (endNumber - startNumber)) + startNumber;
};

var insertDataIntoNode = function (node, data, mapper) {
  Object.keys(data).forEach(function (key) {
    if (mapper[key]) {
      var selector = mapper[key][0];
      var attribute = mapper[key][1];
      var value = data[key];
      var element = node.querySelector(selector);

      if (element) {
        element[attribute] = value;
      }
    }
  });
};

var render = function (template, data, mapper) {
  var node = template.cloneNode(true);

  insertDataIntoNode(node, data, mapper);

  return node;
};

var renderList = function (template, list, mapper) {
  var fragment = document.createDocumentFragment();

  list.forEach(function (item) {
    fragment.appendChild(
        render(template, item, mapper)
    );
  });

  return fragment;
};

var removeClass = function (objectName, className) {
  objectName.classList.remove(className);
};

var getAttribute = function (element, selector, attribute) {
  if (element) {
    var value = element.querySelector(selector)[attribute];
  }
  return value;
};

var hasClass = function (element, className) {
  return element.classList.contains(className);
};

var addClass = function (element, className) {
  element.classList.add(className);
};

var showCurrentPhotoOverlay = function (element) {
  if (hasClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS)) {
    removeClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS);
  }
  insertDataIntoNode(galleryOverlayElement,
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

var onPhotoClick = function (e) {
  var clickElement = e.target;
  var pictureElement = document.querySelector('.picture');
  e.preventDefault();
  while (clickElement !== picturesContainerElement) {
    clickElement = clickElement.parentNode;
    if (pictureElement.className === clickElement.className) {
      showCurrentPhotoOverlay(clickElement);
    }
  }
};

var onPhotoKeydown = function (e) {
  if (e.keyCode === CODE_ENTER) {
    lastPictureFocused = e.target;
    showCurrentPhotoOverlay(e.target);
    galleryOverlayElementCloseElement.focus();
  }
};

var onCloseButtonClick = function (e) {
  e.preventDefault();
  addClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS);
};

var onCloseButtonKeydown = function (e) {
  if (e.keyCode === CODE_ENTER) {
    e.preventDefault();
    addClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS);
    if (lastPictureFocused) {
      lastPictureFocused.focus();
    }
  }
};

var onDocumentKeydown = function (e) {
  if (!hasClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS) && (e.keyCode === CODE_ESC)) {
    addClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS);
  }

  if (!hasClass(uploadOverlay, OVERLAY_HIDDEN_CLASS) && e.keyCode === CODE_ESC) {
    addClass(uploadOverlay, OVERLAY_HIDDEN_CLASS);
    uploadFile.value = '';
  }
};

var resetValues = function () {
  scale = defaultScale;
  effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  uploadResizeControlsValue.value = scale + '%';
  effectImagePreview.className = defaultEffectClassName;
  effect.checked = defaultEffect;
  uploadFormHashtags.value = '';
  uploadFormDescription.value = '';
};

var onInputFileChange = function () {
  if (hasClass(uploadOverlay, OVERLAY_HIDDEN_CLASS)) {
    removeClass(uploadOverlay, OVERLAY_HIDDEN_CLASS);
    resetValues();
  }
};

var onCancelButtonClick = function () {
  if (!hasClass(uploadOverlay, OVERLAY_HIDDEN_CLASS)) {
    addClass(uploadOverlay, OVERLAY_HIDDEN_CLASS);
    uploadFile.value = '';
  }
};

var onRadioControlEffectChange = function (e) {
  var str = 'upload-';
  var effectName = e.target.id.slice(str.length);
  if (lastEffectName && hasClass(effectImagePreview, lastEffectName)) {
    removeClass(effectImagePreview, lastEffectName);
  }
  effectImagePreview.classList.add(effectName);
  lastEffectName = effectName;
};

var onResizeControlsButtonDecClick = function () {
  scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) - SCALE_STEP;
  if (scale < MIN_SCALE) {
    scale = MIN_SCALE;
  }
  effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  uploadResizeControlsValue.value = scale + '%';
};

var onResizeControlsButtonInkClick = function () {
  scale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1) + SCALE_STEP;
  if (scale > MAX_SCALE) {
    scale = MAX_SCALE;
  }
  effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  uploadResizeControlsValue.value = scale + '%';
};

var highlightElement = function (element, color) {
  element.style.borderColor = color;
};

var resetHighlightElement = function (element) {
  element.style.borderColor = 'initial';
};

var validateTag = function (tag) {
  return tag.length < MAX_HASHTAG_LENGTH && tag[0] === '#';
};

var watchForSimillarTags = function (tagsString) {
  var position;
  var duplicate = false;
  var dublicatePosition;
  tagsString.forEach(function (tag) {
    position = tagsString.indexOf(tag);
    dublicatePosition = tagsString.indexOf(tag, position + 1);
    if (~dublicatePosition) {
      duplicate = true;
    }
  });
  return duplicate;
};

var validateTagsString = function (tagsString) {
  var possibleTags = tagsString.split(' ');

  var invalidTags = possibleTags
      .map(validateTag)
      .filter(function (validationResult) {
        return !validationResult;
      });

  return invalidTags.length === 0 && possibleTags.length < 6 && !watchForSimillarTags(possibleTags);
};

var validateTagsElement = function () {
  return validateTagsString(uploadFormHashtags.value);
};

var validateCommentElement = function () {
  return uploadFormDescription.value.length <= MAX_COMMENT_LENGTH;
};

var onChangeTagsElement = function () {
  if (validateTagsElement()) {
    resetHighlightElement(uploadFormHashtags);
  } else {
    highlightElement(uploadFormHashtags, 'red');
  }
};

var onChangeCommentElement = function () {
  if (validateCommentElement()) {
    resetHighlightElement(uploadFormDescription);
  } else {
    highlightElement(uploadFormDescription, 'red');
  }
};

var onFormSubmit = function (e) {
  if (!validateCommentElement() || !validateTagsElement()) {
    e.preventDefault();
  }
};

var pictures = [];
var picturesContainerElement = document.querySelector('.pictures');
var pictureTemplateElement = document.querySelector('#picture-template').content;
var galleryOverlayElement = document.querySelector('.gallery-overlay');
var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
var lastPictureFocused;

var form = document.querySelector('.upload-form');
var uploadFile = form.querySelector('#upload-file');
var uploadOverlay = form.querySelector('.upload-overlay');
var uploadFormCansel = form.querySelector('.upload-form-cancel');
var uploadFormDescription = form.querySelector('.upload-form-description');
var uploadResizeControlsValue = form.querySelector('.upload-resize-controls-value');
var uploadEffectControl = form.querySelector('.upload-effect-controls');
var effectImagePreview = form.querySelector('.effect-image-preview');
var uploadFormHashtags = form.querySelector('.upload-form-hashtags');
var uploadResizeControlsButtonDec = form.querySelector('.upload-resize-controls-button-dec');
var uploadResizeControlsButtonInc = form.querySelector('.upload-resize-controls-button-inc');
var scale;
var effect = form.querySelector('[name=effect]');
var defaultEffect = effect.checked;
var defaultScale = +uploadResizeControlsValue.value.slice(0, uploadResizeControlsValue.value.length - 1);
var defaultEffectClassName = effectImagePreview.className;
var lastEffectName;

galleryOverlayElementCloseElement.tabIndex = 0;

for (var i = 1; i <= 25; i++) {
  pictures.push(generatePicture(i));
}

var pictureList = renderList(pictureTemplateElement, pictures, {
  url: ['img', 'src'],
  comments: ['.picture-comments', 'textContent'],
  likes: ['.picture-likes', 'textContent']
});

picturesContainerElement.appendChild(pictureList);
picturesContainerElement.addEventListener('click', onPhotoClick);
picturesContainerElement.addEventListener('keydown', onPhotoKeydown);
galleryOverlayElementCloseElement.addEventListener('click', onCloseButtonClick);
galleryOverlayElementCloseElement.addEventListener('keydown', onCloseButtonKeydown);
document.addEventListener('keydown', onDocumentKeydown);

form.action = 'https://js.dump.academy/kekstagram';
uploadResizeControlsValue.step = SCALE_STEP;

uploadFile.addEventListener('change', onInputFileChange);
uploadFormCansel.addEventListener('click', onCancelButtonClick);
uploadFormDescription.maxLength = MAX_COMMENT_LENGTH;
uploadEffectControl.addEventListener('change', onRadioControlEffectChange);
uploadResizeControlsButtonDec.addEventListener('click', onResizeControlsButtonDecClick);
uploadResizeControlsButtonInc.addEventListener('click', onResizeControlsButtonInkClick);
uploadFormDescription.addEventListener('change', onChangeCommentElement);
uploadFormHashtags.addEventListener('change', onChangeTagsElement);
form.addEventListener('submit', onFormSubmit);
