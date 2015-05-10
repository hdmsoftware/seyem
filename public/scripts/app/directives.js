(function() {

	'use strict'

	/* Directives */
	var seyemDirectives = angular.module('seyemDirectives', []);

	seyemDirectives.directive('showSlide', function() {
		return {
			//restrict it's use to attribute only.
			restrict: 'A',

			//set up the directive.
			link: function(scope, elem, attr) {

				//get the field to watch from the directive attribute.
				var watchField = attr.showSlide;

				console.log(watchField);

				//set up the watch to toggle the element.
				scope.$watch(attr.showSlide, function(v) {
					if (v && !elem.is(':visible')) {
						elem.slideDown();
					} else {
						elem.slideUp();
					}
				});
			}
		}
	});


})();