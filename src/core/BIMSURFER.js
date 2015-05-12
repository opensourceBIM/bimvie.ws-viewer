/**
 The BIMSURFER namespace.


 @class BIMSURFER
 @main BIMSURFER
 @static
 @author xeolabs / http://xeolabs.com/
 */
var BIMSURFER = {

    CLASS: "BIMSURFER",

    VERSION_NUMBER: "2.0 Dev",

    /**
     * Tests if the given object is an array
     * @private
     */
    _isArray: function (testGameObject) {
        return testGameObject && !(testGameObject.propertyIsEnumerable('length')) && typeof testGameObject === 'object' && typeof testGameObject.length === 'number';
    },

    /**
     * Tests if the given value is a string
     * @param value
     * @returns {boolean}
     * @private
     */
    _isString: function (value) {
        return (typeof value === 'string' || value instanceof String);
    },

    /** Returns a shallow copy
     */
    _copy: function (o) {
        return this._apply(o, {});
    },

    /** Add properties of o to o2, overwriting them on o2 if already there
     */
    _apply: function (o, o2) {
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                o2[name] = o[name];
            }
        }
        return o2;
    },

    /**
     * Add properties of o to o2 where undefined or null on o2
     * @private
     */
    _applyIf: function (o, o2) {
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                if (o2[name] === undefined || o2[name] === null) {
                    o2[name] = o[name];
                }
            }
        }
        return o2;
    },

    /**
     * Constructor: BIMSURFER.Class
     * Base class used to construct all other classes. Includes support for multiple inheritance.
     */
    Class: function (baseClass, subClass) {
        var constructor = null;
        var classObject = subClass || baseClass;

        if (typeof classObject.__construct == 'function') {
            constructor = classObject.__construct;
        } else if (typeof baseClass.prototype.__construct == 'function') {
            constructor = function () {
                baseClass.prototype.__construct.apply(this, arguments);
            }
        } else {
            constructor = function () {
            };
        }

        var Class = constructor;

        if (typeof subClass == 'undefined') {
            Class.prototype = classObject
        } else {
            var newClass = function () {
            };
            newClass.prototype = jQuery.extend({}, baseClass.prototype);
            jQuery.extend(newClass.prototype, subClass);
            Class.prototype = new newClass;
        }

        return Class;
    }

};




