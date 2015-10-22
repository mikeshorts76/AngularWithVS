var crypto = require('crypto');
var nconf = require('nconf');

var self = module.exports;
var secret = nconf.get('SECRET');


self.encrypt = function (data, fields) {
    var encryptData = function(field) {
        if (field != '') {
            var cipher = crypto.createCipher('aes-256-cbc', secret);
            cipher.update(field,'utf8','hex');
            return cipher.final('hex');
        }

        return '';
    };

    this._traverseJSON(data, fields, encryptData);
};

self.decrypt = function (data, fields) {
    var decryptData = function(field) {
        if (field != '') {
            var decipher = crypto.createDecipher('aes-256-cbc', secret);
            decipher.update(field,'hex','utf8')
            return decipher.final('utf8');
        }

        return '';
    };

    this._traverseJSON(data, fields, decryptData);
};

self._traverseJSON = function(data, fields, getValue) {
    for (var x in fields) {
        var object = data[fields[x].objectName];
        var param = fields[x].param;
        if ( Object.prototype.hasOwnProperty.call(object,param)) {
            object[param] = getValue(object[param]);
        }
    }
};