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

var lastNumberOfComment = 0;
var generateCommentNumber = function (lastNumber) {
  var numberOfComment;
  do {
    numberOfComment = generateRandomNumber(0, (COMMENTS.length - 1));
  } while (numberOfComment === lastNumber);
  return numberOfComment;
};

var generatePicture = function (photoIndex) {
  var numbersOfLikes;
  var numbersOfCommentRows;
  var numberOfComment;
  var comments = [];
  numbersOfLikes = generateRandomNumber(MIN_QUANTITY_OF_LIKES, MAX_QUANTITY_OF_LIKES);
  numbersOfCommentRows = generateRandomNumber(MIN_QUANTITY_OF_COMMENT_ROWS, MAX_QUANTITY_OF_COMMENT_ROWS);


  while (numbersOfCommentRows >= 1) {
    numberOfComment = generateCommentNumber(lastNumberOfComment);
    comments.push(COMMENTS[numberOfComment]);
    lastNumberOfComment = numberOfComment;
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

var render = function (template, pictureData, mapper) {
  Object.keys(pictureData).forEach(function (key) {
    if (mapper[key]) {
      var selector = mapper[key][0];
      var attribute = mapper[key][1];
      var value = pictureData[key];
      var node = template.querySelector(selector);

      if (node) {
        node[attribute] = value;
      }
    }
  });
};


var removeClass = function (objectName, className) {
  objectName.classList.remove(className);
};

var pictures = [];
var picturesList = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture-template').content;
var galleryOverlayTemplate = document.querySelector('.gallery-overlay');
var photoGallery = document.querySelector('.gallery-overlay');
var photoFragment = document.createDocumentFragment();

removeClass(photoGallery, 'hidden');

for (var i = 1; i <= 25; i++) {
  pictures.push(generatePicture(i));
}

pictures.forEach(function (picture) {
  var photoElement = photoTemplate.cloneNode(true);
  render(photoElement, picture, {
    url: ['img', 'src'],
    comments: ['.picture-comments', 'textContent'],
    likes: ['.picture-likes', 'textContent']
  });
  photoFragment.appendChild(photoElement);
});

picturesList.appendChild(photoFragment);

render(galleryOverlayTemplate, {
  url: pictures[0].url,
  comments: pictures[0].comments.length,
  likes: pictures[0].likes
},
{
  url: ['.gallery-overlay-image', 'src'],
  comments: ['.comments-count', 'textContent'],
  likes: ['.likes-count', 'textContent']
});
