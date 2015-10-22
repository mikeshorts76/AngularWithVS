'use strict';

var consentApp = angular.module('consentApp', ['ngResource', 'ui']);
consentApp.value('ui.config', {
    jq: {
        placeholder: {

        }
    }
});

consentApp.config(function($routeProvider, $httpProvider) {
    //$httpProvider.defaults.headers.post['x-authorization'] = choice.dataDrop.data.token;

    $routeProvider.when('/enter/1', {templateUrl: '/partials/step1.html',   controller: ''});
    $routeProvider.when('/enter/2', {templateUrl: '/partials/step2.html',   controller: ''});
    $routeProvider.when('/enter/3', {templateUrl: '/partials/step3.html',   controller: ''});
    $routeProvider.when('/enter/4', {templateUrl: '/partials/step4.html',   controller: ''});
    $routeProvider.when('/success', {templateUrl: '/partials/success.html',   controller: ''});
    $routeProvider.otherwise({redirectTo: '/enter/1'});

    var interceptor = ['$rootScope', '$q', function (scope, $q) {

        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if (status == 403) {
                var deferred = $q.defer();
                var req = {
                    config:response.config,
                    deferred:deferred
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
    $httpProvider.responseInterceptors.push(interceptor);
});