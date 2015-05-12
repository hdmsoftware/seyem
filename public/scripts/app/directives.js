(function() {

	'use strict'

	/* Directives */
	var seyemDirectives = angular.module('seyemDirectives', []);

	var INTEGER_REGEXP = /^\-?\d+$/;

	seyemDirectives.directive('integer', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.integer = function(modelValue, viewValue) {
					if (ctrl.$isEmpty(modelValue)) return true;
					if (INTEGER_REGEXP.test(viewValue)) return true;
					return false;
				};
			}
		};
	});

	seyemDirectives.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

})();