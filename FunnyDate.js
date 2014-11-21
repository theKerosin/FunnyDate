/**
 * User: kondaurov
 * Date: 15.08.13
 * Time: 13:23
 * To change this template use File | Settings | File Templates.
 */

/**
 * todo - реализовать класс FunnyDateInterval и использовать его в sub, add, diff
 */

function FunnyDate() {
    var self = this,
        args = arguments,
        date = {},
        objTypes = {
            number : "[object Number]",
            date : "[object Date]",
            string : "[object String]"
        },
        jsObjDate,
        formats = {
            //day
            'd': function() {
                return concatLeadingZero(date.day);
            }, //"01"
            'D': function() {
                return locales[locale].shortDay[jsObjDate.getDay() - 1];
            }, //"Mon"
            'j': function() {
                return date.day;
            }, //"1"
            //month
            'm': function() {
                return concatLeadingZero(date.month);
            }, //"08"
            'M': function() {
                return locales[locale].shortMonth[jsObjDate.getMonth()];
            }, //"Aug"
            'n': function() {
                return date.month;
            }, //"8"
            'F': function() {
                return locales[locale].month[jsObjDate.getMonth()];
            }, //full name of month
            //year
            'L': function() {
                return ((date.year & 3) == 0 && (date.year % 100 || (date.year % 400 == 0 && month.year))) ? 1 : 0;
            }, //Whether it's a leap year return 1 or 0
            'Y': function() {
                return date.year;
            }, //"1999"
            'y': function() {
                var str = date.year.toString();
                return str.substring((str.length - 2));
            }, //"99"
            //Time
            'H': function() {
                return concatLeadingZero(date.hour);
            }, // 24 hour format with leading zero
            'h': function() {
                var res = date.hour > 12 ? date.hour - 12 : date.hour;
                return concatLeadingZero(res);
            }, // 12 hour format with leading zero
            'i': function() {
                return concatLeadingZero(date.minutes);
            }, // minutes with leading zero
            's': function() {
                return concatLeadingZero(date.seconds);
            }, // seconds with leading zero
            'u': function() {
                return jsObjDate.getTime();
            },  // microseconds*/
            //Timezone
            'P': function() {
                var timeZone = -jsObjDate.getTimezoneOffset()/60;
                return (timeZone >= 0 ? '+' + timeZone : '-' + timeZone);
            }
        },
        locales = {
            ru: {
                month: [
                    'Январь', 'Февраль', 'Март', 'Апрель',
                    'Май', 'Июнь', 'Июль', 'Август',
                    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ],
                day: [
                    'Понедельник', 'Вторник', 'Среда', 'Четверг',
                    'Пятница', 'Суббота', 'Воскресенье'
                ],
                shortDay: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                shortMonth: [
                    'Янв', 'Фев', 'Мар', 'Май',
                    'Июн', 'Июл', 'Авг', 'Сен',
                    'Окт', 'Ноя', 'Дек'
                ]
            },
            en: {
                month: [
                    'January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'
                ],
                day: [
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'
                ],
                shortDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                shortMonth: [
                    'Jan', 'Feb', 'Mar',
                    'Arp', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep',
                    'Oct', 'Nov', 'Dec'
                ]
            }
        },
        locale = 'ru';

    if(!args.length) {
        jsObjDate = new Date();
    } else if(getType(args[0]) == objTypes.date) {
        jsObjDate = args[0];
    } else if(getType(args[0]) == objTypes.string) {
        parseStringDate(args[0]);
    } else {
        if(typeof args[1] != "undefined") {
            args[1]--;
        }

        for(var i = 0; i < 6; i++) {
            if(typeof args[i] == "undefined") {
                args[i] = 0;
            }
        }

        jsObjDate = new Date(args[0], args[1], args[2], args[3], args[4], args[5]);

        if(jsObjDate == "Invalid Date") {
            throw new Error(jsObjDate);
        }

    }

    fillDateProperty();

    function concatLeadingZero(a) {
        return a < 10 ? '0' + a : a;
    }

    //private methods
    function parseStringDate(string) {
        var unixTime = Date.parse(string);
        if(isNaN(unixTime)) {
            throw new Error("Invalid format Date");
        }
        jsObjDate = new Date(unixTime);
    }

    function fillDateProperty() {
        date = {
            year : jsObjDate.getFullYear(),
            month: (jsObjDate.getMonth() + 1),
            day: jsObjDate.getDate(),
            hour: jsObjDate.getHours(),
            minutes: jsObjDate.getMinutes(),
            seconds: jsObjDate.getSeconds()
        }
    }

    function DateFormat(format) {
        var res = '';

        for(var i = 0; i < format.length; i++) {
            var c = format.charAt(i);

            if(typeof formats[c] != 'undefined') {
                res += formats[c]();
            } else if(c == '\\') {
                i++;
                res += format[i];
            } else {
                res += c;
            }
        }

        return res;
    }

    function getType(a) {
        return {}.toString.call(a);
    }

    function merge(a, b) {
        for(var i in a) {
            if(typeof b[i] != 'undefined') {
                a[i] = b[i];
            }
        }

        return a;
    }

    function convertToMicroSeconds(a) {
        var requireProperty = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
        }, result = 0;

        requireProperty = merge(requireProperty, a);

        result += requireProperty.second * FunnyDate.MICROSEC_IN_SECOND;
        result += requireProperty.minute * FunnyDate.MICROSEC_IN_MINUTE;
        result += requireProperty.hour * FunnyDate.MICROSEC_IN_HOUR;
        result += requireProperty.day * FunnyDate.MICROSEC_IN_DAY;
        result += requireProperty.month * FunnyDate.MICROSEC_IN_MONTH;
        result += requireProperty.year * FunnyDate.MICROSEC_IN_YEAR;

        return result;
    }

    //public methods
    self.__proto__ = {

        setMonth: function(a) {
            if(a > 12 || getType(a) != objTypes.number) {
                return false;
            }
            date.month = parseInt(a);
            jsObjDate.setMonth(date.month - 1);
            return true;
        },

        setYear: function(a) {
            if(a < 0 || getType(a) != objTypes.number) {
                return false;
            }
            date.year = parseInt(a);
            jsObjDate.setFullYear(date.year);
            return true;
        },

        setDay: function(a) {
            if(a > 31 || getType(a) != objTypes.number) {
                return false;
            }
            date.day = parseInt(a);
            jsObjDate.setDate(date.day);
            return true;
        },

        getDate: function(format) {
            if(typeof format == 'undefined') {
                return date.year + '.' + date.month + '.' + date.day;
            }

            return DateFormat(format);
        },

        getMicroTime: function() {
            return jsObjDate.getTime();
        },

        /**
         * @param {FunnyDate} date
         * @param {string} format diff result
         * s - in seconds
         * m - in minutes
         * h - in hours
         * d - in days
         * @returns {number}
         */
        diff: function(date, format) {
            if(!date instanceof FunnyDate) {
                throw new Error('Invalid object for diff of date');
            }

            var result = self.getMicroTime() - date.getMicroTime();

            result = (result < 0 ? result * -1 : result);

            if(typeof format == 'undefined') {
                return result;
            }

            switch (format) {
                case 's':
                    result /= FunnyDate.MICROSEC_IN_SECOND;
                    break;
                case 'm':
                    result /= FunnyDate.MICROSEC_IN_MINUTE;
                    break;
                case 'h':
                    result /= FunnyDate.MICROSEC_IN_HOUR;
                    break;
                case 'd':
                    result /= FunnyDate.MICROSEC_IN_DAY;
                    break;
                default :
                    break;
            }

            return Math.floor(result);
        },

        /**
         * @param {String} name of locale
         * @returns {boolean}
         */
        setLocale: function(name) {
            if(typeof locales[name] == 'undefined') {
                throw new Error('Locale not found');
            }

            locale = name;
            return true;
        },

        addLocale: function(localeName, locale) {
            var requireProperty = ['month', 'day', 'shortDay', 'shortMonth'], name;

            for(var i in requireProperty) {
                var name = requireProperty[i];
                if(typeof locale[name] == 'undefined') {
                    throw new Error('Failed add locale, not found required property "' + name + '"');
                }
            }

            locales[localeName] = locale;
            return true;
        },

        /**
         * @returns {Date}
         */
        getStandartObject: function() {
            return jsObjDate;
        },

        add: function(date) {
            var microTime = convertToMicroSeconds(date);

            jsObjDate = new Date((jsObjDate.getTime() + microTime));
            fillDateProperty();

            return self;
        },

        sub: function(date) {
            var microTime = convertToMicroSeconds(date);

            jsObjDate = new Date((jsObjDate.getTime() - microTime));
            fillDateProperty();

            return self;
        }
    }
}

/**
 * constants
 */
FunnyDate.MICROSEC_IN_SECOND = 1000;
FunnyDate.MICROSEC_IN_MINUTE = FunnyDate.MICROSEC_IN_SECOND * 60;
FunnyDate.MICROSEC_IN_HOUR = FunnyDate.MICROSEC_IN_MINUTE * 60;
FunnyDate.MICROSEC_IN_DAY = FunnyDate.MICROSEC_IN_HOUR * 24;
FunnyDate.MICROSEC_IN_MONTH = FunnyDate.MICROSEC_IN_DAY * 30; //if in month 30 days
FunnyDate.MICROSEC_IN_YEAR = FunnyDate.MICROSEC_IN_DAY * 365; //if in month 365 days

FunnyDate.FORMAT_ATOM = "Y-m-d\\TH:i:sP";


/**
 * @param {String} date
 * return {funnyDate}
 */
FunnyDate.parseDate = function(date) {
    return new FunnyDate(date);
};


