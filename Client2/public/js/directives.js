consentApp.directive('cnumeric', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            var theEvent = e || window.event;
            var key = theEvent.keyCode || theEvent.which;
            if ((key < 48 || key > 57) && !(key == 8 || key == 9 || key == 13 || key == 37 || key == 39 || key == 46) ){
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        });
    };
});

consentApp.directive('alphanumeric', function() {
    return function(scope, elm, attrs) {
        elm.bind('keypress', function(e) {
            var theEvent = e || window.event;
            var key = theEvent.keyCode || theEvent.which;
            keychar = String.fromCharCode(key);
            charcheck = /[a-zA-Z0-9]/;
            if (!charcheck.test(keychar)) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        });
    };
});

consentApp.directive('autotab', function() {
    return function(scope, elm, attrs) {
        elm.bind('keyup', function(e) {
            if ($(this).val().length == $(this).attr('ng-minlength'))
                $(":input:eq(" + ($(":input").index(this) + 1) + ")").focus();
        });
    };
});

consentApp.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
});

consentApp.directive('uppercase', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            elm.on('blur', function() {
                elm.val(elm.val().toUpperCase());
                return scope.$apply(function(){
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});

consentApp.directive('trim', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            elm.on('blur', function() {
                elm.val(elm.val().trim());
                return scope.$apply(function(){
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});


consentApp.directive('submit', function() {
    return {
        restrict: 'A',
        require: 'form',
        link: function (scope, formElement, attributes, formController) {

            //var fn = $parse(attributes.submit);

            formElement.bind('submit', function (event) {
                // if form is not valid cancel it.
                if (!formController.$valid) return false;

//                scope.$apply(function() {
//                    fn(scope, {$event:event});
//                });

                return scope.$apply(attributes.submit);
            });
        }
    };
});

consentApp.directive('attempt', function() {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {
            this.attempted = false;

            this.setAttempted = function() {
                this.attempted = true;
            };
        }],
        compile: function(cElement, cAttributes, transclude) {
            return {
                pre: function(scope, formElement, attributes, attemptController) {
                    scope.rc = scope.rc || {};
                    scope.rc[attributes.name] = attemptController;
                },
                post: function(scope, formElement, attributes, attemptController) {
                    formElement.bind('submit', function () {
                        attemptController.setAttempted();
                        if (!scope.$$phase) scope.$apply();
                    });
                }
            };
        }
    };
});

consentApp.directive('radioExtend', ['$rootScope', function($rootScope){
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, iElm, iAttrs, controller) {
            iElm.bind('click', function(){
                $rootScope.$phase || $rootScope.$apply()
            });
        }
    };
}]);
