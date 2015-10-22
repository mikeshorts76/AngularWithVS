'use strict';

consentApp.controller('ConsentController', function ConsentController($scope, ConsentModel, ConsentService, ConsentSubmitService, DataDrop, Toastr, BrowserDetect, $location) {
    $scope.model = {};
    $scope.meta = {
        browser: BrowserDetect.browser,
        version: BrowserDetect.version
    };

    $scope.routeIs = function(routeName) {
        return $location.path() == routeName;
    };

    $scope.$on('submit', function(){
        ConsentSubmitService.save({}, ConsentModel.getData(), function(res) {
            //ConsentModel.init(); //resets data
        });
    });

    $scope.$on('save', function(){
        $scope.save(function(res) {
            if (res.status != 'success') {
                return window.location = "./home";
            }
        });
    });

    $scope.$on('saveLater', function(){
        $scope.save(function(res) {
            if (res.status == 'success') {
                Toastr.success('Consent form successfully saved!');
            }
            else {
                Toastr.error('Consent form save failed. Please try again.');
            }
        }, function(res) {
            if (res.status == 'success') {
                Toastr.success('Consent form successfully saved!');
            }
            else {
                Toastr.error('Consent form save failed. Please try again.');
            }
        });
    });

    $scope.save = function(callback) {
        var data = { meta: $scope.meta, data: ConsentModel.getData() };
        ConsentService.save({}, data, function(res) {
            callback(res);
        });
    }

});

consentApp.controller('IdentificationController', function IdentificationController($scope, Utilities, ConsentModel, DataDrop, MVR, BrowserDetect, $location) {
    if (ConsentModel.Confirm.data.submittedTimeStamp)
        return window.location = "./home";

    $scope.model = ConsentModel.Applicant.data;
    $scope.Utilities = Utilities;

    $scope.data = {};
    $scope.data.dob = '';
    $scope.data.gender = '';
    $scope.MVR = MVR;
    $scope.data.validateDriverLicense = '';
    $scope.data.showProgressiveEnhancement = BrowserDetect.browser == 'Explorer' && BrowserDetect.version < 8;


//    var currentYear = new Date().getFullYear();
//    $scope.data.states = DataDrop.data.states;
//    $scope.data.years = Utilities.getNumberList(currentYear, 1950, -1);
//    $scope.data.months = Utilities.getNumberList(1, 12, 1);

    $scope.$watch('model.dobMonth + model.dobDay + model.dobYear', function() {
        $scope.data.dob = $scope.model.dobMonth + '/' + $scope.model.dobDay + '/' + $scope.model.dobYear;
        if ($scope.form.dob) {
            $scope.form.dob.$dirty = $scope.model.dobMonth !== '' || $scope.model.dobDay !== '' || $scope.model.dobYear !== '';
        }
    });

    $scope.$watch('model.gender', function() {
        $scope.data.gender = $scope.model.gender;
        if ($scope.form.gender) {
            $scope.form.gender.$dirty = $scope.model.gender;
        }
    });

    $scope.$watch('model.driverLicense + model.driverLicenseState + model.noLicense', function() {
        if ($scope.form.validateDriverLicense) {
            $scope.data.validateDriverLicense = $scope.model.driverLicenseState + ' ' + $scope.model.driverLicense + $scope.model.noLicense;
            $scope.form.validateDriverLicense.$dirty = true;
        }
    });

    $scope.addAlias = function() {
        $scope.model.aliases.push({
            firstName: $scope.aliasFirstName,
            lastName: $scope.aliasLastName,
            lastUsedMonth: $scope.aliasLastMonth,
            lastUsedYear: $scope.aliasLastYear
        });
    }

    $scope.deleteAlias = function(index) {
        $scope.model.aliases.splice(index, 1);
    }

    $scope.noLicenseClick = function() {
        $scope.model.driverLicenseState = '';
        $scope.model.driverLicense = '';
    }

    $scope.addAddress = function() {
        $scope.model.addresses.push({
            street: '',
            city: '',
            state: '',
            zip: ''
        });
    }

    $scope.deleteAddress = function(index) {
        $scope.model.addresses.splice(index, 1);
        $scope.address = $scope.model.addresses.length > 0 ? $scope.address = $scope.model.addresses.length : null;

        $scope.$apply();
    }

    $scope.validateState = function(value) {
        return value != '';
    }

    $scope.validateAddress = function() {
        var addressIsValid = function (address) {
            for (var key in address) {
                if (address.hasOwnProperty(key)) {
                    var y = address[key];
                    if (y==="null" || y===null || y==="" || typeof y === "undefined") {
                        return false;
                    }
                }
            }

            return true;
        };

        $scope.model.addresses.forEach(function(address) {
            var isValid = addressIsValid(address);

            if (isValid)
                return true;
        });

        return false;
    };

    $scope.validateDriverLicense = function(value) {
        if ($scope.model.noLicense)
            return true;

        if (($scope.model.driverLicense || '') == '' || ($scope.model.driverLicenseState || '') == '')
            return false;

        return $scope.MVR.validate($scope.model.driverLicense, $scope.model.driverLicenseState);
    };

    $scope.validateGender= function(value) {
        return value != '';
    };

    $scope.validateDOB = function(value) {
        var month = +$scope.form.dobMonth.$viewValue;
        var day = +$scope.form.dobDay.$viewValue;
        var year = +$scope.form.dobYear.$viewValue;

        var isValid = $scope.Utilities.isDate(value, year, month,  day);

//        if (!isValid) {
//            if (month > 12)
//                $scope.form.dobMonth.$setValidity(false);
//            else {
//                if (month == 2) {
//                    if (day == 29) {
//                        if (year % 4 != 0 || year % 100 == 0 && year % 400 != 0) {
//                            $scope.form.dobDay.$setValidity(false);
//                        }
//                    }
//                    else if (day > 28) {
//                        $scope.form.dobDay.$setValidity(false);
//                    }
//                }
//                else if (month == 4 || month == 6 || month  == 9 || month == 11) {
//                    if (day > 30) {
//                        $scope.form.dobDay.$setValidity(false);
//                    }
//                }
//                else {
//                    if (day > 31) {
//                        $scope.form.dobDay.$setValidity(false);
//                    }
//                }
//            }
//        }
//        else {
//            $scope.form.dobMonth.$setValidity('ng-valid', true);
//            $scope.form.dobDay.$setValidity('ng-valid', true);
//        }

        return isValid;
    }

    $scope.next = function() {
        $location.path( "/enter/2" );
        $scope.$emit('save');
    }

    $scope.save = function() {
        $scope.$emit('saveLater');
    }
});

consentApp.controller('HistoryController', function HistoryController($scope, Utilities, ConsentModel, DataDrop, EducationData, $location) {
    if (ConsentModel.Confirm.data.submittedTimeStamp)
        return window.location = "./home";

    if (!ConsentModel.Applicant.isValid())
        return $location.path( "/enter/1" );

    var currentYear = new Date().getFullYear();
    $scope.model = ConsentModel.History.data;
    $scope.data = {};
    $scope.data.states = DataDrop.data.states;
    $scope.years = Utilities.getNumberList(currentYear, 1950, -1);
    $scope.months = Utilities.getNumberList(1, 12, 1);
    $scope.types = EducationData;
    $scope.selectedSchoolType = null;



    $scope.addEducation = function() {
        $scope.model.educations.push({
            studentName: '',
            school: '',
            location: '',
            schoolType: '',
            degree: '',
            major: '',
            currentStatus: '',
            degreeDate: {
                month: '',
                year: ''
            }
        });
    }

    $scope.deleteEducation = function(index) {
        $scope.model.educations.splice(index, 1);
    }

    $scope.schoolTypeChange = function(education) {
        angular.forEach($scope.types, function(type) {
            if (type.schoolType == education.schoolType ) {
                $scope.selectedSchoolType = type;
                //education.degree = type.degrees.length == 1 ? type.degrees[0] : '';
                education.major = type.major;
                return true;
            }
        });
    }

    $scope.addEmployment = function() {
        $scope.model.employments.push({
            company: '',
            position: '',
            city: '',
            state: '',
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            fromPeriod: {
                month: '',
                year: ''
            },
            toPeriod: {
                month: '',
                year: '',
                current: false
            }
        });
    }

    $scope.deleteEmployment = function(index) {
        $scope.model.employments.splice(index, 1);
    }

    $scope.currentClick = function(index) {
        var employment = $scope.model.employments[index];
        employment.toPeriod.month = '';
        employment.toPeriod.year = '';
    }

    $scope.addLicense = function() {
        $scope.model.licenses.push({
            licenseType : '',
            state: '',
            licenseNumber: ''
        });
    }

    $scope.deleteLicense = function(index) {
        $scope.model.licenses.splice(index, 1);
    }

    $scope.back = function() {
        $location.path( "/enter/1" );
    }

    $scope.next = function() {
        $location.path( "/enter/3" );
        $scope.$emit('save');
    }

    $scope.save = function() {
        $scope.$emit('saveLater');
    }

});

consentApp.controller('VerifyController', function VerifyController($scope, Utilities, ConsentModel, DataDrop, $location) {
    if (ConsentModel.Confirm.data.submittedTimeStamp)
        return window.location = "./home";

    if (!ConsentModel.History.isValid())
        return $location.path( "/enter/2" );

    $scope.model = ConsentModel.Review.data;

    $scope.next = function() {
        $location.path( "/enter/4" );
        $scope.$emit('save');
    }

    $scope.back = function() {
        $location.path( "/enter/2" );
    }

    $scope.save = function() {
        $scope.$emit('saveLater');
    }

});

consentApp.controller('ReviewController', function ReviewController($scope, $route, Utilities, ConsentModel, DataDrop, PrintService, $location) {
    if (ConsentModel.Confirm.data.submittedTimeStamp)
        return window.location = "./home";

    if (!ConsentModel.Review.isValid())
        return $location.path( "/enter/3" );

    $scope.model = ConsentModel;
    $scope.data = {};
    $scope.data.ssn = '';
    $scope.data.ssn1 = '';
    $scope.data.ssn2 = '';
    $scope.datassn3 = '';

    $scope.$watch('data.ssn1 + data.ssn2 + data.ssn3', function() {
        $scope.data.ssn = $scope.data.ssn1 + $scope.data.ssn2  + $scope.data.ssn3;
        if ($scope.form.ssn) {

            $scope.form.ssn.$dirty = $scope.data.ssn1 !== '' || $scope.data.ssn2 !== '' || $scope.data.ssn3 !== '';
        }
    });

    $scope.validateSSN = function(value) {
        return $scope.model.Applicant.data.ssn1 == $scope.data.ssn1 && $scope.model.Applicant.data.ssn2 == $scope.data.ssn2 && $scope.model.Applicant.data.ssn3 == $scope.data.ssn3;
    }

    $scope.validateFirstName = function(value) {
        if (!value)
            return false;

        return $scope.model.Applicant.data.firstName.toLowerCase() == value.toLowerCase();
    }

    $scope.validateLastName = function(value) {
        if (!value)
            return false;

        return $scope.model.Applicant.data.lastName.toLowerCase() == value.toLowerCase();
    }

    $scope.submit = function() {
        $scope.model.Confirm.data.submittedTimeStamp = new Date();
        $scope.model.Confirm.data.electronicallySigned = true;

        $location.path( "/success" );
        $scope.$emit('submit');
    }

    $scope.printCopy = function() {
        PrintService.print($('#ReportContainer'));

        $route.reload();
    }

    $scope.back = function() {
        $location.path( "/enter/3" );
    }
});

consentApp.controller('SuccessController', function SuccessController($scope, ConsentModel, PrintService, Utilities) {
    $scope.model = ConsentModel;
    $scope.data = {};
    $scope.data.displayFirstName = Utilities.capitaliseFirstLetter(ConsentModel.Applicant.data.firstName.toLowerCase());
    $scope.data.displayLastName = Utilities.capitaliseFirstLetter(ConsentModel.Applicant.data.lastName.toLowerCase());

    $scope.printCopy = function() {
        PrintService.print($('#ReportContainer'));
    }

});
