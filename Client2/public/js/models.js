consentApp.factory("EducationData", function() {

    return [
        {
            schoolType: 'High School',
            major: 'General Studies'
        },
        {
            schoolType: 'GED',
            major: 'General Studies'
        },
        {
            schoolType: 'Vocational',
            major: 'General Studies'
        },
        {
            schoolType: 'College',
            major: ''
        }
    ];

});

consentApp.factory("ConsentModel", function(Utilities, MVR, DataDrop) {

    var consentModel = {
        Header: {},
        Applicant: {},
        History: {},
        Review: {},
        Confirm: {}
    };

    consentModel.init = function() {
        consentModel.Header.data = {
            company: ''
        }

        consentModel.Applicant.data = {
            firstName: '',
            middleName: '',
            lastName: '',
            aliases: [
                {
                    firstName: '',
                    lastName: '',
                    lastUsedMonth: '',
                    lastUsedYear: ''
                }
            ],
            dobMonth: '',
            dobDay: '',
            dobYear: '',
            ssn1: '',
            ssn2: '',
            ssn3: '',
            driverLicenseState: '',
            driverLicense: '',
            noLicense: false,
            gender : '',
            addresses: [
                {
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                }
            ],
            email: '',
            noEmail: false
        };

        consentModel.History.data = {
            noEmployments: false,
            employments: [
                {
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
                }
            ],
            noEducations: false,
            educations: [
                {
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
                }
            ],
            licenses: [
                {
                    licenseType: '',
                    state: '',
                    licenseNumber: ''
                }
            ]
        }

        consentModel.Review.data = {
            confirmed: false
        }

        consentModel.Confirm.data = {
            requestCopyOfReport: false,
            acknowledgedSummaryOfRights: false,
            electronicallySigned: false,
            submittedTimeStamp: null
        }
    };

    consentModel.init();

    consentModel.Applicant.isValid = function() {
        var data = consentModel.Applicant.data;
        if (data.addresses.length < 1)
            return false;

        var requiredFields = [ { name: 'firstName', length: 2}, { name: 'lastName', length: 2}, { name: 'dobMonth', length: 2}, { name: 'dobDay', length: 2}, { name: 'dobYear', length: 4},
            { name: 'ssn1', length: 3}, { name: 'ssn2', length: 2}, { name: 'ssn3', length: 4}, { name: 'gender' }];

        var addressRequiredFields = [ { name: 'street'}, { name: 'city'}, { name: 'state'}, { name: 'zip', length: 2} ];

        if (!data.noLicense)
            requiredFields.push([ { name: 'driverLicenseState' }, { name: 'driverLicense' } ]);

        if (!data.noEmail)
            requiredFields.push([ { name: 'email'} ]);

        var isValid = Utilities.validateModel(requiredFields, data);

        if (!isValid)
            return false;

        isValid = Utilities.validateModel(addressRequiredFields, data.addresses[0]);

        if (!isValid)
            return false;

        isValid = MVR.validate(data.driverLicense, data.driverLicenseState);

        var dob = data.dobMonth + '/' + data.dobDay + '/' + data.dobYear;
        isValid = Utilities.isDate(dob, +data.dobYear, +data.dobMonth, +data.dobDay);

        return isValid;
    };

    consentModel.History.isValid = function() {
        var data = consentModel.History.data;
        var isValid = true;

        if (!data.noEmployments) {
            var employmentsRequiredFields = [ { name: 'company' }, { name: 'position'}, { name: 'fromPeriod.month'}, { name: 'fromPeriod.year' } ];
            if (!data.employments[0].toPeriod.current)
                employmentsRequiredFields.push([ { name: 'toPeriod.month'}, { name: 'toPeriod.year' }  ]);

            isValid = Utilities.validateModel(employmentsRequiredFields, data.employments[0]);
        }

        if (!isValid)
            return false;

        if (!data.noEducations) {
            var educationsRequiredFields = [ { name: 'school' }, { name: 'location'}, { name: 'schoolType'}, { name: 'degree' }, { name: 'major' } ];

            isValid = Utilities.validateModel(educationsRequiredFields, data.educations[0]);
        }

        return isValid;
    }

    consentModel.Review.isValid = function() {
        return consentModel.Review.data.confirmed;
    }

    consentModel.getData = function() {

        var data = {
            Header: {},
            Applicant: {},
            History: {},
            Review: {},
            Confirm: {}
        };

        angular.copy(consentModel.Header.data, data.Header);
        angular.copy(consentModel.Applicant.data, data.Applicant);
        angular.copy(consentModel.History.data, data.History);
        angular.copy(consentModel.Review.data, data.Review);
        angular.copy(consentModel.Confirm.data, data.Confirm);

        var filterOutEmpty = function(items, param) {

            var arrayToReturn = [];
            for (var i=0; i<items.length; i++){
                if (items[i][param] && items[i][param] != '') {
                    arrayToReturn.push(items[i]);
                }
            }

            return arrayToReturn;
        };

        data.History.licenses = filterOutEmpty(data.History.licenses, "licenseNumber");

        return data;
    };

    consentModel.Header.data = { company: DataDrop.data.company };
    if (DataDrop.data.consent) {
        consentModel.Applicant.data = DataDrop.data.consent.Applicant;
        consentModel.History.data = DataDrop.data.consent.History;
        consentModel.Review.data = DataDrop.data.consent.Review;
        consentModel.Confirm.data = DataDrop.data.consent.Confirm;
    }



    return consentModel;
});