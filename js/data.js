'use strict';

(function () {
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

  var generateRandomNumber = function (startNumber, endNumber) {
    return Math.round(Math.random() * (endNumber - startNumber)) + startNumber;
  };

  window.data = {
    generatePicture: function (photoIndex) {
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
    }
  };
})();
