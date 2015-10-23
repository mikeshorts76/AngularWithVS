(function () {

    var app = angular.module("app",
                                ['ngRoute',
                                 'ngResource',
                                 'consent-controllers'
                                 ]
                             );

    app.config(['$routeProvider',function ($routeProvider, $httpProvider) {
			    $routeProvider.when('/consent/enter/1', {templateUrl: 'app/consent/partials/step1.html', controller: ''})
						      .when('/consent/enter/2', { templateUrl: 'app/consent/partials/step2.html', controller: '' })
                              .when('/consent/enter/3', { templateUrl: 'app/consent/partials/step3.html', controller: '' })
                              .when('/consent/enter/4', { templateUrl: 'app/consent/partials/step4.html', controller: '' })
                              .when('/consent/success', { templateUrl: 'app/consent/partials/success.html', controller: '' })
						      .otherwise({ redirectTo: '/' });

			var interceptor = ['$rootScope', '$q', function (scope, $q) {
			    function success(response) {
			        return response;
			    }

			    function error(response) {
			        var status = response.status;

			        if (status == 403) {
			            var deferred = $q.defer();
			            var req = {
			                config: response.config,
			                deferred: deferred
			            }
			            window.location = "./home";
			        }
			        // otherwise
			        return $q.reject(response);

			    }

			    return function (promise) {
			        return promise.then(success, error);
			    }

			}];
    }]);

}());