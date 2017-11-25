'use strict';
var MIN_QUANTITY_OF_LIKES = 15;
var MAX_QUANTITY_OF_LIKES = 200;
var MIN_QUANTITY_OF_COMMENT_ROWS = 1;
var MAX_QUANTITY_OF_COMMENT_ROWS = 2;

var generateDataArray = function (comments) {
  var dataArray = [];
  var numbersOfLikes;
  var numbersOfCommentRows;
  var numberOfComment;
  var lastNumberOfComment;

  for (var i = 1; i <= 25; i++) {
    var someComment = [];
    numbersOfLikes = generateRandomNumber(MIN_QUANTITY_OF_LIKES, MAX_QUANTITY_OF_LIKES);
    numbersOfCommentRows = generateRandomNumber(MIN_QUANTITY_OF_COMMENT_ROWS, MAX_QUANTITY_OF_COMMENT_ROWS);

    while (numbersOfCommentRows >= 1) {
      do {
        numberOfComment = generateRandomNumber(0, (comments.length - 1));
      } while (numberOfComment === lastNumberOfComment);
      someComment.push(comments[numberOfComment]);
      lastNumberOfComment = numberOfComment;
      numbersOfCommentRows--;
    }

    dataArray.push({
      url: 'photos/' + i + '.jpg',
      likes: numbersOfLikes,
      comments: someComment
    });
  }
  return dataArray;
};

var generateRandomNumber = function (startNumber, endNumber) {
  return Math.round(Math.random() * (endNumber - startNumber)) + startNumber;
};

var renderPhoto = function (photosArray, template) {
  var photoElement = template.cloneNode(true);
  returnTag('img', photoElement).src = photosArray.url;
  returnTag('.picture-comments', photoElement).textContent = photosArray.comments;
  returnTag('.picture-likes', photoElement).textContent = photosArray.likes;
  return photoElement;
};

var returnTag = function (selector, objectName) {
  return !objectName ? document.querySelector(selector) : objectName.querySelector(selector);

};

var createFragment = function () {
  return document.createDocumentFragment();
};

var removeClass = function (objectName, className) {
  objectName.classList.remove(className);
};

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var photosData = generateDataArray(comments);
var picturesList = returnTag('.pictures');
var photoTemplate = returnTag('#picture-template').content;
var photoGallery = returnTag('.gallery-overlay');
var photoFragment = createFragment();

removeClass(photoGallery, 'hidden');

for (var i = 0; i < photosData.length; i++) {
  photoFragment.appendChild(renderPhoto(photosData[i], photoTemplate));
}

picturesList.appendChild(photoFragment);
returnTag('.gallery-overlay-image').src = photosData[0].url;
returnTag('.likes-count').textContent = photosData[0].likes;
returnTag('.comments-count').textContent = photosData[0].comments.length;
