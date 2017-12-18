'use strict';

(function () {
  var ERROR_ELEMENT_CLASSNAME = 'error-popup';
  window.errorPopup = {
    showPopup: function (str) {
      var errorDiv = document.createElement('div');
      errorDiv.textContent = str;
      errorDiv.className = ERROR_ELEMENT_CLASSNAME;
      document.body.appendChild(errorDiv);
    },
    hidePopup: function () {
      var errorDiv = document.querySelector('.' + ERROR_ELEMENT_CLASSNAME);
      if (errorDiv) {
        document.body.removeChild(errorDiv);
      }
    }
  };
})();
