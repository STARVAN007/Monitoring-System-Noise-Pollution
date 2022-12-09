(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.directive('spinner', spinner);

	function spinner () {
		return {
			templateUrl:'views/directives/spinner.html',
			restrict: 'AE',
			replace: 'true'
		};
	}
})();