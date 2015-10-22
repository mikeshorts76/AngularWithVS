(function () {

	var module = angular.module("app", ['ngRoute', 'RouteController1']);

	module.config(['$routeProvider',
			function ($routeProvider) {
				$routeProvider.
						when('/route1', {
							templateUrl: 'route1.html',
							controller: 'consent/RouteController1'
						}).
						when('/route2', {
							templateUrl: 'route2.html',
							controller: 'RouteController2'
						}).
						otherwise({
							redirectTo: '/'
						});
			}]);

}());