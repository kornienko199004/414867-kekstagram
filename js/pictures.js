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
  photoElement.querySelector('img').src = photosArray.url;
  photoElement.querySelector('.picture-comments').textContent = photosArray.comments;
  photoElement.querySelector('.picture-likes').textContent = photosArray.likes;
  return photoElement;
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
var picturesList = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture-template').content;
var photoGallery = document.querySelector('.gallery-overlay');
var photoFragment = document.createDocumentFragment();

removeClass(photoGallery, 'hidden');

for (var i = 0; i < photosData.length; i++) {
  photoFragment.appendChild(renderPhoto(photosData[i], photoTemplate));
}

picturesList.appendChild(photoFragment);
document.querySelector('.gallery-overlay-image').src = photosData[0].url;
document.querySelector('.likes-count').textContent = photosData[0].likes;
document.querySelector('.comments-count').textContent = photosData[0].comments.length;
