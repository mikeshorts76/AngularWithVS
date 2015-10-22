consentApp.factory("Utilities", function() {
    var utilities = {};

    utilities.getNumberList = function (start, end, increment){
        var array = []; // Create empty array
        var inc = increment || -1;

        // Loop ending condition depends on relative sizes of start and end
        for (var i = start; (start < end ? i <= end : i >= end) ; i += inc)
            array.push(i);

        return array;
    };

    utilities.isDate = function (value, y,m,d)
    {
        var regex  = /^\d{2}[.\/-]\d{2}[.\/-]\d{4}$/;
        var value = regex.exec(value);
        if (value == null)
            return false;

        var currentYear = new Date().getFullYear();

        var date = new Date(y,m-1,d);
        if (isNaN(date))
            return false;

        var convertedDate =
            ""+date.getFullYear() + (date.getMonth()+1) + date.getDate();
        var givenDate = "" + y + m + d;
        return ( givenDate == convertedDate && (currentYear - y >= 13));
    }

    utilities.validateModel = function(requiredFields, data) {
        for (var x in requiredFields) {
            var field = requiredFields[x].name;
            var length = requiredFields[x].length || 0;
            if ( Object.prototype.hasOwnProperty.call(data,field)) {
                var y = data[field];
                if (y==="null" || y===null || y==="" || typeof y === "undefined") {
                    return false;
                }
                else if (y.length < length) {
                    return false;
                }

            }
        }

        return true;
    }

    utilities.capitaliseFirstLetter = function(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return utilities;
});