'use strict';

(function () {
  var ERROR_ELEMENT_CLASSNAME = '.xhr-error';
  window.xhrError = {
    onError: function (str) {
      var errorDiv = document.createElement('div');
      errorDiv.textContent = str;
      errorDiv.className = ERROR_ELEMENT_CLASSNAME;
      errorDiv.style.cssText = 'width: 100%; padding: 10px; text-transform: uppercase; font-size: 16px; position: fixed; top: 0; z-index: 1000; left: 0; text-align: center; background-color: rgba(205,10,50,0.5); color: white;';
      document.body.appendChild(errorDiv);
    },
    deleteXhrErrorElement: function () {
      var errorDiv = document.querySelector(ERROR_ELEMENT_CLASSNAME);
      if (errorDiv) {
        document.body.removeChild(errorDiv);
      }
    }
  };
})();
