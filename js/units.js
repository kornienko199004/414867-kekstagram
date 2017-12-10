'use strict';

(function () {
  window.units = {
    removeClass: function (objectName, className) {
      objectName.classList.remove(className);
    },

    hasClass: function (element, className) {
      return element.classList.contains(className);
    },

    addClass: function (element, className) {
      element.classList.add(className);
    },

    insertDataIntoNode: function (node, data, mapper) {
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
    },

    overlayHiddenClass: 'hidden',
    codeESC: 27,
    codeEnter: 13
  };
})();
