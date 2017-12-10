'use strict';

(function () {
  window.utilits = {
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
    }
  };
})();
