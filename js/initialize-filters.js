'use strict';

(function () {

  var EFFECT_CLASS_NAME_PREFIX = 'upload-';
  var DEFAULT_FILTER_VALUE = 100;

  var aproximation = function (maxValueOfNewRange, maxValueOfProcess, value) {
    var coefficient = maxValueOfNewRange / maxValueOfProcess;
    var output = value * coefficient;
    return output > maxValueOfNewRange ? maxValueOfNewRange : output;
  };

  var createFilterEffect = function (effectName, value) {
    var maxValueOfProcess = 100;
    switch (effectName) {
      case 'effect-chrome':
        return 'grayscale(' + aproximation(1, maxValueOfProcess, value) + ')';
      case 'effect-sepia':
        return 'sepia(' + aproximation(1, maxValueOfProcess, value) + ')';
      case 'effect-marvin':
        return 'invert(' + aproximation(100, maxValueOfProcess, value) + '%)';
      case 'effect-phobos':
        return 'blur(' + aproximation(3, maxValueOfProcess, value) + 'px)';
      case 'effect-heat':
        return 'brightness(' + aproximation(3, maxValueOfProcess, value) + ')';
      default:
        break;
    }
    return 'none';
  };


  var lastEffectName;
  window.initializeFilters = {
    effect: function (controlElement, applyFilter) {

      var onRadioControlEffectChange = function (evt) {
        var str = EFFECT_CLASS_NAME_PREFIX;
        var effectName = evt.target.id.slice(str.length);
        applyFilter(lastEffectName, createFilterEffect(effectName, DEFAULT_FILTER_VALUE), effectName);

        lastEffectName = effectName;
      };
      controlElement.addEventListener('change', onRadioControlEffectChange);
    },
    createFilterEffect: function (value) {
      return createFilterEffect(lastEffectName, value);
    }
  };

})();
