'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;
  window.debounce = function (fn) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fn, DEBOUNCE_INTERVAL);
  };
})();
