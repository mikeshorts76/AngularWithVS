(function () {

    var app = angular.module("app", ['ngRoute']);

    app.config(['$routeProvider',function ($routeProvider) {
			    $routeProvider.when('/enter/1', {templateUrl: 'app/consent/partials/step1.html', controller: ''})
						      .when('/enter/2', { templateUrl: 'app/consent/partials/step2.html', controller: '' })
                              .when('/enter/3', { templateUrl: 'app/consent/partials/step3.html', controller: '' })
                              .when('/enter/4', { templateUrl: 'app/consent/partials/step4.html', controller: '' })
                              .when('/success', { templateUrl: 'app/consent/partials/success.html', controller: '' })
						      .otherwise({redirectTo: '/'});
			}]);    

}());