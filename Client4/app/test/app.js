(function () {

	var module = angular.module("app", ['ngRoute', 'routeControllers']);

	module.config(['$routeProvider',
			function ($routeProvider) {
				$routeProvider.
						when('/route1', {
							templateUrl: 'route1.html',
							controller: 'RouteController1'
						}).
						when('/route2', {
							templateUrl: 'route2.html',
							controller: 'RouteController1'
						}).
						otherwise({
							redirectTo: '/'
						});
			}]);

}());