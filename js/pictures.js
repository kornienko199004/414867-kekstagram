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
var picturesContainer = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture-template').content;
var galleryOverlay = document.querySelector('.gallery-overlay');

for (var i = 1; i <= 25; i++) {
  pictures.push(generatePicture(i));
}

var pictureList = renderList(pictureTemplate, pictures, {
  url: ['img', 'src'],
  comments: ['.picture-comments', 'textContent'],
  likes: ['.picture-likes', 'textContent']
});

picturesContainer.appendChild(pictureList);

removeClass(galleryOverlay, 'hidden');

insertDataIntoNode(galleryOverlay, {
  url: pictures[0].url,
  comments: pictures[0].comments.length,
  likes: pictures[0].likes
},
{
  url: ['.gallery-overlay-image', 'src'],
  comments: ['.comments-count', 'textContent'],
  likes: ['.likes-count', 'textContent']
});
