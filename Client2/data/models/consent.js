var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var secure = require('../../lib/secure');
var date = require('date-utils');
var nconf = require('nconf');

var ecryptedFields = [
    { objectName: 'Applicant', param: 'firstName'},
    { objectName: 'Applicant', param: 'middleName'},
    { objectName: 'Applicant', param: 'lastName'},
    { objectName: 'Applicant', param: 'dobMonth'},
    { objectName: 'Applicant', param: 'dobDay'},
    { objectName: 'Applicant', param: 'dobYear'},
    { objectName: 'Applicant', param: 'ssn1'},
    { objectName: 'Applicant', param: 'ssn2'},
    { objectName: 'Applicant', param: 'ssn3'},
    { objectName: 'Applicant', param: 'driverLicense'},
    { objectName: 'Applicant', param: 'driverLicenseState'}
];

var newEcryptedFields = [
    { objectName: 'Applicant', param: 'dobMonth'},
    { objectName: 'Applicant', param: 'dobDay'},
    { objectName: 'Applicant', param: 'dobYear'},
    { objectName: 'Applicant', param: 'ssn1'},
    { objectName: 'Applicant', param: 'ssn2'},
    { objectName: 'Applicant', param: 'ssn3'},
    { objectName: 'Applicant', param: 'driverLicense'},
    { objectName: 'Applicant', param: 'driverLicenseState'}
];

var consentSchema = mongoose.Schema({
    activationCode: String,
    updated: { type: Date, default: Date.now },
    data: {
        Header: {
            company: String
        },
        Applicant: {
            firstName: String,
            middleName: String,
            lastName: String,
            aliases: [
                {
                    firstName: String,
                    lastName: String,
                    lastUsedMonth: String,
                    lastUsedYear: String
                }
            ],
            dobMonth: String,
            dobDay: String,
            dobYear: String,
            ssn1: String,
            ssn2: String,
            ssn3: String,
            driverLicenseState: String,
            driverLicense: String,
            noLicense: Boolean,
            gender : String,
            addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    zip: String
                }
            ],
            email: String,
            noEmail: Boolean
        },
        History: {
            noEmployments: Boolean,
            employments: [
                {
                    company: String,
                    position: String,
                    city: String,
                    state: String,
                    contactName: String,
                    contactPhone: String,
                    contactEmail: String,
                    fromPeriod: {
                        month: String,
                        year: String
                    },
                    toPeriod: {
                        month: String,
                        year: String,
                        current: Boolean
                    }
                }
            ],
            noEducations: Boolean,
            educations: [
                {
                    studentName: String,
                    school: String,
                    location: String,
                    schoolType: String,
                    degree: String,
                    major: String,
                    currentStatus: String,
                    degreeDate: {
                        month: String,
                        year: String
                    }
                }
            ],
            licenses: [
                {
                    licenseType: String,
                    state: String,
                    licenseNumber: String
                }
            ]
        },
        Review: {
            confirmed: Boolean
        },
        Confirm: {
            requestCopyOfReport: Boolean,
            acknowledgedSummaryOfRights: Boolean,
            electronicallySigned: Boolean,
            submittedTimeStamp: Date
        }
    },
    meta: { type: Schema.Types.Mixed }
});



consentSchema.pre('save', function (next) {
    var fields = new Date(nconf.get('ENCRYPTION_DATE')) > this._doc.updated ?  ecryptedFields : newEcryptedFields;

    secure.encrypt(this._doc.data, fields);

    next();
});

consentSchema.post('init', function () {
    var fields = new Date(nconf.get('ENCRYPTION_DATE')) > this._doc.updated ?  ecryptedFields : newEcryptedFields;

    secure.decrypt(this._doc.data, fields);

});

module.exports = mongoose.model('Consent', consentSchema);