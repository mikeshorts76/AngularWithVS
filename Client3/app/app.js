(function () {

	var app = angular.module("app", ['ngRoute']);

	app.config(function ($routeProvider) {
		$routeProvider.when('/test', { templateUrl: '/test.html' });
	});

}());