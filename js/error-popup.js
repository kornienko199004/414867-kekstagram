'use strict';

(function () {
  var ERROR_ELEMENT_CLASSNAME = 'error-popup';
  window.errorPopup = {
    show: function (str) {
      var errorElement = document.createElement('div');
      errorElement.textContent = str;
      errorElement.className = ERROR_ELEMENT_CLASSNAME;
      document.body.appendChild(errorElement);
    },
    hide: function () {
      var errorDiv = document.querySelector('.' + ERROR_ELEMENT_CLASSNAME);
      if (errorDiv) {
        document.body.removeChild(errorDiv);
      }
    }
  };
})();
