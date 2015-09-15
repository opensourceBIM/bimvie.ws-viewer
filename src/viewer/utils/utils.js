BIMSURFER.utils = BIMSURFER.utils || {};

BIMSURFER.utils.isset = function (variable) {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'undefined' || arguments[i] == null) {
            return false;
        }
    }
    return true;
};

BIMSURFER.utils.isArray = function (variable) {
    return Object.prototype.toString.call(variable) === '[object Array]'
};

BIMSURFER.utils.removeA = function (arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};

/*\
 |*|
 |*|  :: Number.isInteger() polyfill ::
 |*|
 |*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 |*|
 \*/
BIMSURFER.utils.isInteger = function isInteger(nVal) {
    return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};
