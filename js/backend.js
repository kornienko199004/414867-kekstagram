'use strict';

(function () {
  var URL_DOWNLOAD = 'https://1510.dump.academy/kekstagram/data';
  var URL_UPLOAD = 'https://1510.dump.academy/kekstagram';
  var XHR_TIMEOUT = 10000;

  var xhrRequest = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(method, url);
    if (data && method === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    load: function (onLoad, onError) {
      xhrRequest(URL_DOWNLOAD, 'GET', onLoad, onError);
    },
    save: function (data, onLoad, onError) {
      xhrRequest(URL_UPLOAD, 'POST', onLoad, onError, data);
    }
  };
})();
