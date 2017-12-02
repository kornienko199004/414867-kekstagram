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

var pictures = [];
var picturesContainerElement = document.querySelector('.pictures');
var pictureTemplateElement = document.querySelector('#picture-template').content;
var galleryOverlayElement = document.querySelector('.gallery-overlay');
var galleryOverlayElementCloseElement = document.querySelector('.gallery-overlay-close');
var pictureElement = document.querySelector('.picture');
var clickElement;
var lastPictureFocused;

for (var i = 1; i <= 25; i++) {
  pictures.push(generatePicture(i));
}

var pictureList = renderList(pictureTemplateElement, pictures, {
  url: ['img', 'src'],
  comments: ['.picture-comments', 'textContent'],
  likes: ['.picture-likes', 'textContent']
});

picturesContainerElement.appendChild(pictureList);


var showCurrentPhotoOverlay = function (data, mapping) {
  removeClass(galleryOverlayElement, OVERLAY_HIDDEN_CLASS);
  insertDataIntoNode(galleryOverlayElement, data, mapping);
};

var returnDomElementData = function (node, mapper) {
  var dataElements = { };
  Object.keys(mapper).forEach(function (key) {
    var selector = mapper[key][0];
    var attribute = mapper[key][1];
    var value = node.querySelector(selector)[attribute];

    if (value) {
      dataElements[key] = value;
    }
  });
  return dataElements;
};

galleryOverlayElementCloseElement.tabIndex = 0;

var onPhotoClick = function (evt) {
  clickElement = evt.target;
  evt.preventDefault();

  while (clickElement !== picturesContainerElement) {
    clickElement = clickElement.parentNode;
    if (pictureElement.className === clickElement.className) {

      showCurrentPhotoOverlay(
          returnDomElementData(clickElement, {
            url: ['img', 'src'],
            comments: ['.picture-comments', 'textContent.length'],
            likes: ['.picture-likes', 'textContent']
          }),
          {
            url: ['.gallery-overlay-image', 'src'],
            comments: ['.comments-count', 'textContent'],
            likes: ['.likes-count', 'textContent']
          }
      );
    }
  }
};

var onPhotoKeydown = function (evt) {
  if (evt.keyCode === CODE_ENTER) {
    lastPictureFocused = evt.target;

    showCurrentPhotoOverlay(
        returnDomElementData(evt.target, {
          url: ['img', 'src'],
          comments: ['.picture-comments', 'textContent.length'],
          likes: ['.picture-likes', 'textContent']
        }),
        {
          url: ['.gallery-overlay-image', 'src'],
          comments: ['.comments-count', 'textContent'],
          likes: ['.likes-count', 'textContent']
        }
    );

    galleryOverlayElementCloseElement.focus();
  }
};

var onCloseButtonClick = function (evt) {
  evt.preventDefault();
  galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
};

var onCloseButtonKeydown = function (evt) {
  if (evt.keyCode === CODE_ENTER) {
    evt.preventDefault();
    galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
    if (lastPictureFocused) {
      lastPictureFocused.focus();
    }
  }
};

var onDocumentKeydown = function (evt) {
  if (!galleryOverlayElement.classList.contains(OVERLAY_HIDDEN_CLASS) && (evt.keyCode === CODE_ESC)) {
    galleryOverlayElement.classList.add(OVERLAY_HIDDEN_CLASS);
  }
};

picturesContainerElement.addEventListener('click', onPhotoClick);
picturesContainerElement.addEventListener('keydown', onPhotoKeydown);

galleryOverlayElementCloseElement.addEventListener('click', onCloseButtonClick);

galleryOverlayElementCloseElement.addEventListener('keydown', onCloseButtonKeydown);

document.addEventListener('keydown', onDocumentKeydown);
