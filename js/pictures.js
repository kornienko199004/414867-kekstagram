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
var generateCommentNumber = function (lastNumberOfComment) {
  var numberOfComment;
  do {
    numberOfComment = generateRandomNumber(0, (COMMENTS.length - 1));
  } while (numberOfComment === lastNumberOfComment);
  lastNumberOfComment = numberOfComment;
  return numberOfComment;
};

var generatePicture = function (photoIndex) {
  var numbersOfLikes;
  var numbersOfCommentRows;
  var numberOfComment;
  var lastNumberOfComment = 0;
  var someComments = [];
  numbersOfLikes = generateRandomNumber(MIN_QUANTITY_OF_LIKES, MAX_QUANTITY_OF_LIKES);
  numbersOfCommentRows = generateRandomNumber(MIN_QUANTITY_OF_COMMENT_ROWS, MAX_QUANTITY_OF_COMMENT_ROWS);

  generateCommentNumber();
  while (numbersOfCommentRows >= 1) {
    numberOfComment = generateCommentNumber(lastNumberOfComment);
    someComments.push(COMMENTS[numberOfComment]);
    lastNumberOfComment = numberOfComment;
    numbersOfCommentRows--;
  }
  return {
    url: 'photos/' + photoIndex + '.jpg',
    likes: numbersOfLikes,
    comments: someComments
  };
};

var generateRandomNumber = function (startNumber, endNumber) {
  return Math.round(Math.random() * (endNumber - startNumber)) + startNumber;
};

var renderPhoto = function (photosArray, template) {
  var photoElement = template.cloneNode(true);
  photoElement.querySelector('img').src = photosArray.url;
  photoElement.querySelector('.picture-comments').textContent = photosArray.comments;
  photoElement.querySelector('.picture-likes').textContent = photosArray.likes;
  return photoElement;
};

var removeClass = function (objectName, className) {
  objectName.classList.remove(className);
};

var pictures = [];
var picturesList = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture-template').content;
var photoGallery = document.querySelector('.gallery-overlay');
var photoFragment = document.createDocumentFragment();
removeClass(photoGallery, 'hidden');

for (var i = 1; i <= 25; i++) {
  pictures.push(generatePicture(i));
}

for (i = 0; i < pictures.length; i++) {
  photoFragment.appendChild(renderPhoto(pictures[i], photoTemplate));
}

picturesList.appendChild(photoFragment);
document.querySelector('.gallery-overlay-image').src = pictures[0].url;
document.querySelector('.likes-count').textContent = pictures[0].likes;
document.querySelector('.comments-count').textContent = pictures[0].comments.length;
