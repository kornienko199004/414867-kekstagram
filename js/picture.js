'use strict';

(function () {
  var render = function (template, data, mapper) {
    var node = template.cloneNode(true);

    window.utilits.insertDataIntoNode(node, data, mapper);

    return node;
  };

  window.picture = {
    renderList: function (template, list, mapper) {
      var fragment = document.createDocumentFragment();

      list.forEach(function (item) {
        fragment.appendChild(
            render(template, item, mapper)
        );
      });

      return fragment;
    }
  };
})();
