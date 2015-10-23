(function () {

    angular.module('services-factory', []);

    angular.module('services-factory').factory('State', function ($resource) {
        //ToDo
        //return $resource('/states', {}, {
        //    'find': { method: 'GET', isArray: true }
        //});

        return [];
    });

    angular.module('services-factory').factory('ConsentService', function ($resource, DataDrop) {
        //ToDo
        //return $resource('consent/:_code', { _code: DataDrop.data.code }, {
        //});

        return [];
    });

    angular.module('services-factory').factory('ConsentSubmitService', function ($resource, DataDrop) {
        return 'stuff';
        //ToDo
        //return $resource('consent/:_code/submit', { _code: DataDrop.data.code }, {
            //    });
    })
    
    angular.module('services-factory').factory('Toastr', function () {
        //ToDo
        //toastr.options = { positionClass: 'toast-top-full-width' };
        //return toastr;        

        return 'toastr';
    });

    angular.module('services-factory').factory('PrintServices', function ($timeout) {
        return {
            print: function (container) {
                var html = container.html();
                var win = window.open();
                self.focus();
                win.document.open();
                win.document.write('<' + 'html' + '><' + 'head' + '>');
                win.document.write('<link rel="stylesheet" type="text/css" href="/css/bootstrap/css/bootstrap.css">');
                win.document.write('<link rel="stylesheet" type="text/css" href="/css/report.css">');
                win.document.write('<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Meddon">');
                win.document.write('<' + '/' + 'head' + '><' + 'body' + '><div class="print-container">');
                win.document.write(html);
                win.document.write('</div><' + '/' + 'body' + '><' + '/' + 'html' + '>');
                win.document.close();
                $timeout(function () {
                    win.print();
                }, 500);
            }
        };
    });

    angular.module('services-factory').factory('DataDrop', function () {
        //return choice.dataDrop;
        var choice = {};

        choice.dataDrop = {
            config: {
            }
        };
        
        choice.dataDrop.data = { "code": "4h9awd02", "consent": null, "token": "9d60b5bb359ab78e487eec149a2d11b55a087cf7786fdf1bb4a523ef6d37836e", "company": "Choice Screening" };

        return choice.dataDrop;        
    });

    angular.module('services-factory').factory('BrowserDetect', function () {

        var BrowserDetect = {
            init: function () {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent)
                    || this.searchVersion(navigator.appVersion)
                    || "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
            },
            searchString: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString) {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },
            dataBrowser: [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                },
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                },
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                },
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                },
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                },
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                },
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                },
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                },
                {		// for newer Netscapes (6+)
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                },
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                },
                { 		// for older Netscapes (4-)
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ],
            dataOS: [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                },
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                },
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                },
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ]

        };
        BrowserDetect.init();

        return BrowserDetect;

    });

    angular.module('services-factory').factory('MVR', function () {
        return {
            validate: function (license, state) {
                license = license.replace('-', '').replace(' ', '');
                var regexValidation;

                switch (state.toUpperCase()) {
                    case "AL": regexValidation = /^\d{7}$/i; break;
                    case "AK": regexValidation = /^\d{1,7}$/i; break;
                    case "AZ": regexValidation = /^([a-zA-Z]\d{8}|[a-zA-Z]{2}\d{3,6}|\d{9})$/i; break;
                    case "AR": regexValidation = /^\d{8,9}$/i; break;
                    case "CA": regexValidation = /^[a-zA-Z]\d{7}$/i; break;
                    case "CO": regexValidation = /^\d{9}$/i; break;
                    case "CT": regexValidation = /^\d{9}$/i; break;
                    case "DE": regexValidation = /^\d{1,7}$/i; break;
                    case "DC": regexValidation = /^(\d{7}|\d{9})$/i; break;
                    case "FL": regexValidation = /^[a-zA-Z]\d{12}$/i; break;
                    case "GA": regexValidation = /^\d{7,9}$/i; break;
                    case "HI": regexValidation = /^(\d{9}|[hH]\d{8}|[aAgG]\d{7})$/i; break;
                    case "ID": regexValidation = /^([a-zA-Z]{2}\d{6}[a-zA-Z]|\d{9})$/i; break;
                    case "IL": regexValidation = /^[A-Z0-9]\d{11}|\d{11}[A-Z0-9]|\d{12}$/i; break;
                    case "IN": regexValidation = /^\d{9,10}$/i; break;
                    case "IA": regexValidation = /^(\d{3}[a-zA-Z]{2}\d{4}|\d{9})$/i; break;
                    case "KS": regexValidation = /^(\d{9}|[a-zA-Z]\d{8})$/i; break;
                    case "KY": regexValidation = /^(\d{9}|[a-zA-Z]\d{8})$/i; break;
                    case "LA": regexValidation = /^00|01\d{7}$/i; break;
                    case "ME": regexValidation = /^\d{7}[xX]?$/i; break;
                    case "MD": regexValidation = /^[a-zA-Z]\d{12}$/i; break;
                    case "MA": regexValidation = /^([a-zA-Z]\d{8}|\d{9})$/i; break;
                    case "MI": regexValidation = /^[a-zA-Z]\d{12}$/i; break;
                    case "MN": regexValidation = /^[a-zA-Z]\d{12}$/i; break;
                    case "MS": regexValidation = /^\d{9}$/i; break;
                    case "MO": regexValidation = /^(\d{9}|[a-zA-Z]\d{5,9})$/i; break;
                    case "MT": regexValidation = /^(\d{9}|[a-zA-Z]\d[\da-zA-Z]\d{2}[a-zA-Z]{3}\d|\d{13})$/i; break;
                    case "NE": regexValidation = /^[aA|bB|cC|eE|gG|hH|vV]\d{3,8}$/i; break;
                    case "NV": regexValidation = /^(d{9}|\d{10}|\d{12})$/i; break;
                    case "NH": regexValidation = /^\d{2}[a-zA-Z]{3}\d{5}$/i; break;
                    case "NJ": regexValidation = /^[a-zA-Z]\d{14}$/i; break;
                    case "NM": regexValidation = /^\d{9}$/i; break;
                    case "NY": regexValidation = /^(\d{9}|[a-zA-Z]\d{18})$/i; break;
                    case "NC": regexValidation = /^\d{1,8}$/i; break;
                    case "ND": regexValidation = /^(\d{9}|[a-zA-Z]{3}\d{6})$/i; break;
                    case "OH": regexValidation = /^(\d{9}|[a-zA-Z]{2}\d{6})$/i; break;
                    case "OK": regexValidation = /^((\d{9})|(\d|[a-zA-Z]{1})\d{9})$/i; break;
                    case "OR": regexValidation = /^\d{9}|\d{7}|[a-zA-Z]{1}\d{6}|[a-zA-Z]{2}\d{5}$/i; break;
                    case "PA": regexValidation = /^\d{8}$/i; break;
                    case "RI": regexValidation = /^(\d{7}|[v|V]\d{6})$/i; break;
                    case "SC": regexValidation = /^\d{6,9}$/i; break;
                    case "SD": regexValidation = /^\d{8,9}$/i; break;
                    case "TN": regexValidation = /^\d{7,9}$/i; break;
                    case "TX": regexValidation = /^\d{8}$/i; break;
                    case "UT": regexValidation = /^\d{4,10}$/i; break;
                    case "VT": regexValidation = /^\d{7}[\daA]$/i; break;
                    case "VA": regexValidation = /^(\d{9}|[a-zA-Z]\d{8})$/i; break;
                    case "WA": regexValidation = /^[a-zA-Z0-9*]{12}$/i; break;
                    case "WV": regexValidation = /^([0|aA|bB|cC|dD|eE|fF|iI|sS]\d{6}|([1|xX][xX]\d{5}))$/i; break;
                    case "WI": regexValidation = /^[a-zA-Z]\d{13}$/i; break;
                    case "WY": regexValidation = /^\d{9,10}$/i; break;
                }

                return license.match(regexValidation);
            }
        };
    })

}());