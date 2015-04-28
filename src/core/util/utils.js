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

BIMSURFER.utils.removeA  = function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};
