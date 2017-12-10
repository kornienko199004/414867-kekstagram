'use strict';

(function () {
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

  window.renderer = {
    renderList: function (template, list, mapper) {
      var fragment = document.createDocumentFragment();

      list.forEach(function (item) {
        fragment.appendChild(
            render(template, item, mapper)
        );
      });

      return fragment;
    },

    insertDataIntoNode: insertDataIntoNode
  };
})();
