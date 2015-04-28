/*
 * BIMViews V2.0.0
 *
 * A WebGL-based IFC Viewer for BIMSurfer
 * http://bimwiews.org/
 *
 * Built on 2015-04-28
 *
 * todo
 * Copyright 2015, todo
 * http://bimvie.ws
 *
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




;/*
  Based on Simple JavaScript Inheritance
  By John Resig http://ejohn.org/
  MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {

    var initializing = false;

    var fnTest = /xyz/.test(function () {xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function () {
    };

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {

        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {

            //
            if (name === "_props") {
                var props = prop[name];
                var descriptor;
                for (var key in props) {
                    descriptor = props[key];
                    Object.defineProperty(prototype, key, descriptor);
                }
                continue;
            }

            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor
        function Class() {

            // All construction is actually done in the init method
            if (!initializing && this.__init)
                this.__init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

;BIMSURFER.utils = BIMSURFER.utils || {};

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
;(function () {

    "use strict";

    BIMSURFER.utils = BIMSURFER.utils || {};

    /**
     * Generic map of IDs to items - can generate own IDs or accept given IDs. IDs should be strings in order to not
     * clash with internally generated IDs, which are numbers.
     */
    BIMSURFER.utils.Map = function (items, baseId) {

        /**
         * @property Items in this map
         */
        this.items = items || [];

        baseId = baseId || 0;
        var lastUniqueId = baseId + 1;

        /**
         * Adds an item to the map and returns the ID of the item in the map. If an ID is given, the item is
         * mapped to that ID. Otherwise, the map automatically generates the ID and maps to that.
         *
         * id = myMap.addItem("foo") // ID internally generated
         *
         * id = myMap.addItem("foo", "bar") // ID is "foo"
         *
         */
        this.addItem = function () {
            var item;
            if (arguments.length === 2) {
                var id = arguments[0];
                item = arguments[1];
                if (this.items[id]) { // Won't happen if given ID is string
                    throw "ID clash: '" + id + "'";
                }
                this.items[id] = item;
                return id;

            } else {
                while (true) {
                    item = arguments[0];
                    var findId = lastUniqueId++;
                    if (!this.items[findId]) {
                        this.items[findId] = item;
                        return findId;
                    }
                }
            }
        };

        /**
         * Removes the item of the given ID from the map and returns it
         */
        this.removeItem = function (id) {
            var item = this.items[id];
            delete this.items[id];
            return item;
        };
    };

})();;(function () {

    "use strict";

    /*
     * Optimizations made based on glMatrix by Brandon Jones
     */

    /*
     * Copyright (c) 2010 Brandon Jones
     *
     * This software is provided 'as-is', without any express or implied
     * warranty. In no event will the authors be held liable for any damages
     * arising from the use of this software.
     *
     * Permission is granted to anyone to use this software for any purpose,
     * including commercial applications, and to alter it and redistribute it
     * freely, subject to the following restrictions:
     *
     *    1. The origin of this software must not be misrepresented; you must not
     *    claim that you wrote the original software. If you use this software
     *    in a product, an acknowledgment in the product documentation would be
     *    appreciated but is not required.
     *
     *    2. Altered source versions must be plainly marked as such, and must not
     *    be misrepresented as being the original software.
     *
     *    3. This notice may not be removed or altered from any source
     *    distribution.
     */


    /**
     * Math functions, used within BIMSURFER, but also available for you to use in your application code.
     * @module BIMSURFER
     * @class math
     * @static
     */
    BIMSURFER.math = {

        /**
         * Returns a new UUID.
         * @method createUUID
         * @static
         * @return string The new UUID
         */
        createUUID: function () {
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = new Array(36);
            var rnd = 0, r;
            return function () {
                for (var i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[ i ] = '-';
                    } else if (i === 14) {
                        uuid[ i ] = '4';
                    } else {
                        if (rnd <= 0x02) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];
                    }
                }
                return uuid.join('');
            };

        }(),

        vec2: function () {
            return new Float64Array(2);
        },

        vec3: function () {
            return new Float64Array(3);
        },

        vec4: function () {
            return new Float64Array(4);
        },

        /**
         *
         */
        mat3: function () {
            return new Float64Array(9);
        },

        /**
         *
         */
        mat4: function () {
            return new Float64Array(16);
        },

        /**
         * Floating-point modulus
         * @param a
         * @param b
         * @returns {*}
         */
        fmod: function (a, b) {
            if (a < b) {
                console.error("BIMSURFER.math.fmod : Attempting to find modulus within negative range - would be infinite loop - ignoring");
                return a;
            }
            while (b <= a) {
                a -= b;
            }
            return a;
        },

        /**
         * Negates a four-element vector.
         * @method negateVec4
         * @param {Array(Number)} v Vector to negate
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        negateVec4: function (v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = -v[0];
            dest[1] = -v[1];
            dest[2] = -v[2];
            dest[3] = -v[3];
            return dest;
        },

        /**
         * Adds one four-element vector to another.
         * @method addVec4
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        addVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] + v[0];
            dest[1] = u[1] + v[1];
            dest[2] = u[2] + v[2];
            dest[3] = u[3] + v[3];
            return dest;
        },

        /**
         * Adds a scalar value to each element of a four-element vector.
         * @method addVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        addVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] + s;
            dest[1] = v[1] + s;
            dest[2] = v[2] + s;
            dest[3] = v[3] + s;
            return dest;
        },

        /**
         * Adds one three-element vector to another.
         * @method addVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        addVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] + v[0];
            dest[1] = u[1] + v[1];
            dest[2] = u[2] + v[2];
            return dest;
        },

        /**
         * Adds a scalar value to each element of a three-element vector.
         * @method addVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        addVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] + s;
            dest[1] = v[1] + s;
            dest[2] = v[2] + s;
            return dest;
        },

        /**
         * Subtracts one four-element vector from another.
         * @method subVec4
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            dest[2] = u[2] - v[2];
            dest[3] = u[3] - v[3];
            return dest;
        },

        /**
         * Subtracts one three-element vector from another.
         * @method subVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            dest[2] = u[2] - v[2];
            return dest;
        },

        /**
         * Subtracts one two-element vector from another.
         * @method subVec2
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec2: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            return dest;
        },

        /**
         * Subtracts a scalar value from each element of a four-element vector.
         * @method subVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        subVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] - s;
            dest[1] = v[1] - s;
            dest[2] = v[2] - s;
            dest[3] = v[3] - s;
            return dest;
        },

        /**
         * Sets each element of a 4-element vector to a scalar value minus the value of that element.
         * @method subScalarVec4
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        subScalarVec4: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s - v[0];
            dest[1] = s - v[1];
            dest[2] = s - v[2];
            dest[3] = s - v[3];
            return dest;
        },

        /**
         * Multiplies one three-element vector by another.
         * @method mulVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        mulVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] * v[0];
            dest[1] = u[1] * v[1];
            dest[2] = u[2] * v[2];
            dest[3] = u[3] * v[3];
            return dest;
        },

        /**
         * Multiplies each element of a four-element vector by a scalar.
         * @method mulVec34calar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            dest[2] = v[2] * s;
            dest[3] = v[3] * s;
            return dest;
        },

        /**
         * Multiplies each element of a three-element vector by a scalar.
         * @method mulVec3Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            dest[2] = v[2] * s;
            return dest;
        },

        /**
         * Multiplies each element of a two-element vector by a scalar.
         * @method mulVec2Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec2Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            return dest;
        },

        /**
         * Divides one three-element vector by another.
         * @method divVec3
         * @static
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        divVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] / v[0];
            dest[1] = u[1] / v[1];
            dest[2] = u[2] / v[2];
            return dest;
        },

        /**
         * Divides one four-element vector by another.
         * @method divVec4
         * @static
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        divVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] / v[0];
            dest[1] = u[1] / v[1];
            dest[2] = u[2] / v[2];
            dest[3] = u[3] / v[3];
            return dest;
        },

        /**
         * @param v vec3
         * @param s scalar
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divScalarVec3: function (s, v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s / v[0];
            dest[1] = s / v[1];
            dest[2] = s / v[2];
            return dest;
        },

        /**
         * @param v vec3
         * @param s scalar
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] / s;
            dest[1] = v[1] / s;
            dest[2] = v[2] / s;
            return dest;
        },

        /**
         * @param v vec4
         * @param s scalar
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] / s;
            dest[1] = v[1] / s;
            dest[2] = v[2] / s;
            dest[3] = v[3] / s;
            return dest;
        },


        /**
         * @param s scalar
         * @param v vec4
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise

         */
        divScalarVec4: function (s, v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s / v[0];
            dest[1] = s / v[1];
            dest[2] = s / v[2];
            dest[3] = s / v[3];
            return dest;
        },


        dotVec4: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3]);
        },


        cross3Vec4: function (u, v) {
            var u0 = u[0], u1 = u[1], u2 = u[2];
            var v0 = v[0], v1 = v[1], v2 = v[2];
            return [
                    u1 * v2 - u2 * v1,
                    u2 * v0 - u0 * v2,
                    u0 * v1 - u1 * v0,
                0.0];
        },

        /**
         * @param u vec3
         * @param v vec3
         * @param dest vec3 - optional destination
         * @return [] dest if specified, u otherwise
         *
         */
        cross3Vec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            var x = u[0], y = u[1], z = u[2];
            var x2 = v[0], y2 = v[1], z2 = v[2];
            dest[0] = y * z2 - z * y2;
            dest[1] = z * x2 - x * z2;
            dest[2] = x * y2 - y * x2;
            return dest;
        },

        /**  */
        sqLenVec4: function (v) {
            return BIMSURFER.math.dotVec4(v, v);
        },

        /**  */
        lenVec4: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec4(v));
        },

        /**  */
        dotVec3: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
        },

        /**  */
        dotVec2: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]);
        },

        /**  */
        sqLenVec3: function (v) {
            return BIMSURFER.math.dotVec3(v, v);
        },

        /**  */
        sqLenVec2: function (v) {
            return BIMSURFER.math.dotVec2(v, v);
        },

        /**  */
        lenVec3: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec3(v));
        },

        /**  */
        lenVec2: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec2(v));
        },

        /**
         * @param v vec3
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        rcpVec3: function (v, dest) {
            return BIMSURFER.math.divScalarVec3(1.0, v, dest);
        },

        /**
         * @param v vec4
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        normalizeVec4: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec4(v);
            return BIMSURFER.math.mulVec4Scalar(v, f, dest);
        },

        /**  */
        normalizeVec3: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec3(v);
            return BIMSURFER.math.mulVec3Scalar(v, f, dest);
        },

// 
        normalizeVec2: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec2(v);
            return BIMSURFER.math.mulVec2Scalar(v, f, dest);
        },

        /**  */

        /**  */
        dupMat4: function (m) {
            return m.slice(0, 16);
        },

        /**  */
        mat4To3: function (m) {
            return [
                m[0], m[1], m[2],
                m[4], m[5], m[6],
                m[8], m[9], m[10]
            ];
        },

        /**  */
        m4s: function (s) {
            return [
                s, s, s, s,
                s, s, s, s,
                s, s, s, s,
                s, s, s, s
            ];
        },

        /**  */
        setMat4ToZeroes: function () {
            return BIMSURFER.math.m4s(0.0);
        },

        /**  */
        setMat4ToOnes: function () {
            return BIMSURFER.math.m4s(1.0);
        },

        /**  */
        diagonalMat4v: function (v) {
            return [
                v[0], 0.0, 0.0, 0.0,
                0.0, v[1], 0.0, 0.0,
                0.0, 0.0, v[2], 0.0,
                0.0, 0.0, 0.0, v[3]
            ];
        },

        /**  */
        diagonalMat4c: function (x, y, z, w) {
            return BIMSURFER.math.diagonalMat4v([x, y, z, w]);
        },

        /**  */
        diagonalMat4s: function (s) {
            return BIMSURFER.math.diagonalMat4c(s, s, s, s);
        },

        /**  */
        identityMat4: function () {
            return BIMSURFER.math.diagonalMat4v([1.0, 1.0, 1.0, 1.0]);
        },

        /**  */
        isIdentityMat4: function (m) {
            if (m[0] !== 1.0 || m[1] !== 0.0 || m[2] !== 0.0 || m[3] !== 0.0 ||
                m[4] !== 0.0 || m[5] !== 1.0 || m[6] !== 0.0 || m[7] !== 0.0 ||
                m[8] !== 0.0 || m[9] !== 0.0 || m[10] !== 1.0 || m[11] !== 0.0 ||
                m[12] !== 0.0 || m[13] !== 0.0 || m[14] !== 0.0 || m[15] !== 1.0) {
                return false;
            }
            return true;
        },

        /**
         * @param m mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        negateMat4: function (m, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = -m[0];
            dest[1] = -m[1];
            dest[2] = -m[2];
            dest[3] = -m[3];
            dest[4] = -m[4];
            dest[5] = -m[5];
            dest[6] = -m[6];
            dest[7] = -m[7];
            dest[8] = -m[8];
            dest[9] = -m[9];
            dest[10] = -m[10];
            dest[11] = -m[11];
            dest[12] = -m[12];
            dest[13] = -m[13];
            dest[14] = -m[14];
            dest[15] = -m[15];
            return dest;
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        addMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }
            dest[0] = a[0] + b[0];
            dest[1] = a[1] + b[1];
            dest[2] = a[2] + b[2];
            dest[3] = a[3] + b[3];
            dest[4] = a[4] + b[4];
            dest[5] = a[5] + b[5];
            dest[6] = a[6] + b[6];
            dest[7] = a[7] + b[7];
            dest[8] = a[8] + b[8];
            dest[9] = a[9] + b[9];
            dest[10] = a[10] + b[10];
            dest[11] = a[11] + b[11];
            dest[12] = a[12] + b[12];
            dest[13] = a[13] + b[13];
            dest[14] = a[14] + b[14];
            dest[15] = a[15] + b[15];
            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        addMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] + s;
            dest[1] = m[1] + s;
            dest[2] = m[2] + s;
            dest[3] = m[3] + s;
            dest[4] = m[4] + s;
            dest[5] = m[5] + s;
            dest[6] = m[6] + s;
            dest[7] = m[7] + s;
            dest[8] = m[8] + s;
            dest[9] = m[9] + s;
            dest[10] = m[10] + s;
            dest[11] = m[11] + s;
            dest[12] = m[12] + s;
            dest[13] = m[13] + s;
            dest[14] = m[14] + s;
            dest[15] = m[15] + s;
            return dest;
        },

        /**  */
        addScalarMat4: function (s, m, dest) {
            return BIMSURFER.math.addMat4Scalar(m, s, dest);
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        subMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }
            dest[0] = a[0] - b[0];
            dest[1] = a[1] - b[1];
            dest[2] = a[2] - b[2];
            dest[3] = a[3] - b[3];
            dest[4] = a[4] - b[4];
            dest[5] = a[5] - b[5];
            dest[6] = a[6] - b[6];
            dest[7] = a[7] - b[7];
            dest[8] = a[8] - b[8];
            dest[9] = a[9] - b[9];
            dest[10] = a[10] - b[10];
            dest[11] = a[11] - b[11];
            dest[12] = a[12] - b[12];
            dest[13] = a[13] - b[13];
            dest[14] = a[14] - b[14];
            dest[15] = a[15] - b[15];
            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        subMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] - s;
            dest[1] = m[1] - s;
            dest[2] = m[2] - s;
            dest[3] = m[3] - s;
            dest[4] = m[4] - s;
            dest[5] = m[5] - s;
            dest[6] = m[6] - s;
            dest[7] = m[7] - s;
            dest[8] = m[8] - s;
            dest[9] = m[9] - s;
            dest[10] = m[10] - s;
            dest[11] = m[11] - s;
            dest[12] = m[12] - s;
            dest[13] = m[13] - s;
            dest[14] = m[14] - s;
            dest[15] = m[15] - s;
            return dest;
        },

        /**
         * @param s scalar
         * @param m mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        subScalarMat4: function (s, m, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = s - m[0];
            dest[1] = s - m[1];
            dest[2] = s - m[2];
            dest[3] = s - m[3];
            dest[4] = s - m[4];
            dest[5] = s - m[5];
            dest[6] = s - m[6];
            dest[7] = s - m[7];
            dest[8] = s - m[8];
            dest[9] = s - m[9];
            dest[10] = s - m[10];
            dest[11] = s - m[11];
            dest[12] = s - m[12];
            dest[13] = s - m[13];
            dest[14] = s - m[14];
            dest[15] = s - m[15];
            return dest;
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        mulMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }

            // Cache the matrix values (makes for huge speed increases!)
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

            var b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
            var b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
            var b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
            var b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

            dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        mulMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] * s;
            dest[1] = m[1] * s;
            dest[2] = m[2] * s;
            dest[3] = m[3] * s;
            dest[4] = m[4] * s;
            dest[5] = m[5] * s;
            dest[6] = m[6] * s;
            dest[7] = m[7] * s;
            dest[8] = m[8] * s;
            dest[9] = m[9] * s;
            dest[10] = m[10] * s;
            dest[11] = m[11] * s;
            dest[12] = m[12] * s;
            dest[13] = m[13] * s;
            dest[14] = m[14] * s;
            dest[15] = m[15] * s;
            return dest;
        },

        /**
         * @param m mat4
         * @param v vec4
         * @return []
         *
         */
        mulMat4v4: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2], v3 = v[3];
            return [
                    m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3,
                    m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3,
                    m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3,
                    m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3
            ];
        },

        /**
         * @param mat mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, mat otherwise
         *
         */
        transposeMat4: function (mat, dest) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            var m4 = mat[4], m14 = mat[14], m8 = mat[8];
            var m13 = mat[13], m12 = mat[12], m9 = mat[9];
            if (!dest || mat === dest) {
                var a01 = mat[1], a02 = mat[2], a03 = mat[3];
                var a12 = mat[6], a13 = mat[7];
                var a23 = mat[11];
                mat[1] = m4;
                mat[2] = m8;
                mat[3] = m12;
                mat[4] = a01;
                mat[6] = m9;
                mat[7] = m13;
                mat[8] = a02;
                mat[9] = a12;
                mat[11] = m14;
                mat[12] = a03;
                mat[13] = a13;
                mat[14] = a23;
                return mat;
            }
            dest[0] = mat[0];
            dest[1] = m4;
            dest[2] = m8;
            dest[3] = m12;
            dest[4] = mat[1];
            dest[5] = mat[5];
            dest[6] = m9;
            dest[7] = m13;
            dest[8] = mat[2];
            dest[9] = mat[6];
            dest[10] = mat[10];
            dest[11] = m14;
            dest[12] = mat[3];
            dest[13] = mat[7];
            dest[14] = mat[11];
            dest[15] = mat[15];
            return dest;
        },

        /**  */
        determinantMat4: function (mat) {
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
            var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
            var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
            return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
                a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
                a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
                a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
                a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
                a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
        },

        /**
         * @param mat mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, mat otherwise
         *
         */
        inverseMat4: function (mat, dest) {
            if (!dest) {
                dest = mat;
            }
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
            var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
            var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
            var b00 = a00 * a11 - a01 * a10;
            var b01 = a00 * a12 - a02 * a10;
            var b02 = a00 * a13 - a03 * a10;
            var b03 = a01 * a12 - a02 * a11;
            var b04 = a01 * a13 - a03 * a11;
            var b05 = a02 * a13 - a03 * a12;
            var b06 = a20 * a31 - a21 * a30;
            var b07 = a20 * a32 - a22 * a30;
            var b08 = a20 * a33 - a23 * a30;
            var b09 = a21 * a32 - a22 * a31;
            var b10 = a21 * a33 - a23 * a31;
            var b11 = a22 * a33 - a23 * a32;

            // Calculate the determinant (inlined to avoid double-caching)
            var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

            dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
            dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
            dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
            dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
            dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
            dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
            dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
            dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
            dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
            dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
            dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
            dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
            dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

            return dest;
        },

        /**  */
        traceMat4: function (m) {
            return (m[0] + m[5] + m[10] + m[15]);
        },

        /**  */
        translationMat4v: function (v) {
            var m = BIMSURFER.math.identityMat4();
            m[12] = v[0];
            m[13] = v[1];
            m[14] = v[2];
            return m;
        },

        /**  */
        translationMat4c: function (x, y, z) {
            return BIMSURFER.math.translationMat4v([x, y, z]);
        },

        /**  */
        translationMat4s: function (s) {
            return BIMSURFER.math.translationMat4c(s, s, s);
        },

        /**  */
        rotationMat4v: function (anglerad, axis) {
            var ax = BIMSURFER.math.normalizeVec4([axis[0], axis[1], axis[2], 0.0], []);
            var s = Math.sin(anglerad);
            var c = Math.cos(anglerad);
            var q = 1.0 - c;

            var x = ax[0];
            var y = ax[1];
            var z = ax[2];

            var xy, yz, zx, xs, ys, zs;

            //xx = x * x; used once
            //yy = y * y; used once
            //zz = z * z; used once
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;

            var m = BIMSURFER.math.mat4();

            m[0] = (q * x * x) + c;
            m[1] = (q * xy) + zs;
            m[2] = (q * zx) - ys;
            m[3] = 0.0;

            m[4] = (q * xy) - zs;
            m[5] = (q * y * y) + c;
            m[6] = (q * yz) + xs;
            m[7] = 0.0;

            m[8] = (q * zx) + ys;
            m[9] = (q * yz) - xs;
            m[10] = (q * z * z) + c;
            m[11] = 0.0;

            m[12] = 0.0;
            m[13] = 0.0;
            m[14] = 0.0;
            m[15] = 1.0;

            return m;
        },

        /**  */
        rotationMat4c: function (anglerad, x, y, z) {
            return BIMSURFER.math.rotationMat4v(anglerad, [x, y, z]);
        },

        /**  */
        scalingMat4v: function (v) {
            var m = BIMSURFER.math.identityMat4();
            m[0] = v[0];
            m[5] = v[1];
            m[10] = v[2];
            return m;
        },

        /**  */
        scalingMat4c: function (x, y, z) {
            return BIMSURFER.math.scalingMat4v([x, y, z]);
        },

        /**  */
        scalingMat4s: function (s) {
            return BIMSURFER.math.scalingMat4c(s, s, s);
        },

        /**
         * @param pos vec3 position of the viewer
         * @param target vec3 point the viewer is looking at
         * @param up vec3 pointing "up"
         * @param dest mat4 Optional, mat4 frustum matrix will be written into
         *
         * @return {mat4} dest if specified, a new mat4 otherwise
         */
        lookAtMat4v: function (pos, target, up, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }

            var posx = pos[0],
                posy = pos[1],
                posz = pos[2],
                upx = up[0],
                upy = up[1],
                upz = up[2],
                targetx = target[0],
                targety = target[1],
                targetz = target[2];

            if (posx === targetx && posy === targety && posz === targetz) {
                return BIMSURFER.math.identityMat4();
            }

            var z0, z1, z2, x0, x1, x2, y0, y1, y2, len;

            //vec3.direction(eye, center, z);
            z0 = posx - targetx;
            z1 = posy - targety;
            z2 = posz - targetz;

            // normalize (no check needed for 0 because of early return)
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;

            //vec3.normalize(vec3.cross(up, z, x));
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }

            //vec3.normalize(vec3.cross(z, x, y));
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;

            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }

            dest[0] = x0;
            dest[1] = y0;
            dest[2] = z0;
            dest[3] = 0;
            dest[4] = x1;
            dest[5] = y1;
            dest[6] = z1;
            dest[7] = 0;
            dest[8] = x2;
            dest[9] = y2;
            dest[10] = z2;
            dest[11] = 0;
            dest[12] = -(x0 * posx + x1 * posy + x2 * posz);
            dest[13] = -(y0 * posx + y1 * posy + y2 * posz);
            dest[14] = -(z0 * posx + z1 * posy + z2 * posz);
            dest[15] = 1;

            return dest;
        },

        /**  */
        lookAtMat4c: function (posx, posy, posz, targetx, targety, targetz, upx, upy, upz) {
            return BIMSURFER.math.lookAtMat4v([posx, posy, posz], [targetx, targety, targetz], [upx, upy, upz], []);
        },

        /**  */
        orthoMat4c: function (left, right, bottom, top, near, far, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }
            var rl = (right - left);
            var tb = (top - bottom);
            var fn = (far - near);

            dest[0] = 2.0 / rl;
            dest[1] = 0.0;
            dest[2] = 0.0;
            dest[3] = 0.0;

            dest[4] = 0.0;
            dest[5] = 2.0 / tb;
            dest[6] = 0.0;
            dest[7] = 0.0;

            dest[8] = 0.0;
            dest[9] = 0.0;
            dest[10] = -2.0 / fn;
            dest[11] = 0.0;

            dest[12] = -(left + right) / rl;
            dest[13] = -(top + bottom) / tb;
            dest[14] = -(far + near) / fn;
            dest[15] = 1.0;

            return dest;
        },

        /**  */
        frustumMat4v: function (fmin, fmax) {
            var fmin4 = [fmin[0], fmin[1], fmin[2], 0.0];
            var fmax4 = [fmax[0], fmax[1], fmax[2], 0.0];
            var vsum = BIMSURFER.math.mat4();
            BIMSURFER.math.addVec4(fmax4, fmin4, vsum);
            var vdif = BIMSURFER.math.mat4();
            BIMSURFER.math.subVec4(fmax4, fmin4, vdif);
            var t = 2.0 * fmin4[2];

            var m = BIMSURFER.math.mat4();
            var vdif0 = vdif[0], vdif1 = vdif[1], vdif2 = vdif[2];

            m[0] = t / vdif0;
            m[1] = 0.0;
            m[2] = 0.0;
            m[3] = 0.0;

            m[4] = 0.0;
            m[5] = t / vdif1;
            m[6] = 0.0;
            m[7] = 0.0;

            m[8] = vsum[0] / vdif0;
            m[9] = vsum[1] / vdif1;
            m[10] = -vsum[2] / vdif2;
            m[11] = -1.0;

            m[12] = 0.0;
            m[13] = 0.0;
            m[14] = -t * fmax4[2] / vdif2;
            m[15] = 0.0;

            return m;
        },

        /**  */
        frustumMatrix4: function (left, right, bottom, top, near, far, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }
            var rl = (right - left);
            var tb = (top - bottom);
            var fn = (far - near);
            dest[0] = (near * 2) / rl;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = (near * 2) / tb;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = (right + left) / rl;
            dest[9] = (top + bottom) / tb;
            dest[10] = -(far + near) / fn;
            dest[11] = -1;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = -(far * near * 2) / fn;
            dest[15] = 0;
            return dest;
        },


        /**  */
        perspectiveMatrix4: function (fovyrad, aspectratio, znear, zfar) {
            var pmin = [];
            var pmax = [];

            pmin[2] = znear;
            pmax[2] = zfar;

            pmax[1] = pmin[2] * Math.tan(fovyrad / 2.0);
            pmin[1] = -pmax[1];

            pmax[0] = pmax[1] * aspectratio;
            pmin[0] = -pmax[0];

            return BIMSURFER.math.frustumMat4v(pmin, pmax);
        },

        /**  */
        transformPoint3: function (m, p) {
            var p0 = p[0], p1 = p[1], p2 = p[2];
            return [
                    (m[0] * p0) + (m[4] * p1) + (m[8] * p2) + m[12],
                    (m[1] * p0) + (m[5] * p1) + (m[9] * p2) + m[13],
                    (m[2] * p0) + (m[6] * p1) + (m[10] * p2) + m[14],
                    (m[3] * p0) + (m[7] * p1) + (m[11] * p2) + m[15]
            ];
        },


        /**  */
        transformPoints3: function (m, points) {
            var result = new Array(points.length);
            var len = points.length;
            var p0, p1, p2;
            var pi;

            // cache values
            var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
            var m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
            var m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
            var m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

            for (var i = 0; i < len; ++i) {
                // cache values
                pi = points[i];
                p0 = pi[0];
                p1 = pi[1];
                p2 = pi[2];

                result[i] = [
                        (m0 * p0) + (m4 * p1) + (m8 * p2) + m12,
                        (m1 * p0) + (m5 * p1) + (m9 * p2) + m13,
                        (m2 * p0) + (m6 * p1) + (m10 * p2) + m14,
                        (m3 * p0) + (m7 * p1) + (m11 * p2) + m15
                ];
            }

            return result;
        },

        /**  */
        transformVec3: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2];
            return [
                    (m[0] * v0) + (m[4] * v1) + (m[8] * v2),
                    (m[1] * v0) + (m[5] * v1) + (m[9] * v2),
                    (m[2] * v0) + (m[6] * v1) + (m[10] * v2)
            ];
        },

        transformVec4: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2], v3 = v[3];
            return [
                    m[ 0] * v0 + m[ 4] * v1 + m[ 8] * v2 + m[12] * v3,
                    m[ 1] * v0 + m[ 5] * v1 + m[ 9] * v2 + m[13] * v3,
                    m[ 2] * v0 + m[ 6] * v1 + m[10] * v2 + m[14] * v3,
                    m[ 3] * v0 + m[ 7] * v1 + m[11] * v2 + m[15] * v3
            ];
        },

        /**  */
        projectVec4: function (v) {
            var f = 1.0 / v[3];
            return [v[0] * f, v[1] * f, v[2] * f, 1.0];
        },

        /**
         *
         */
        vec3ObjToArray: function (v, dest) {
            var result = dest || BIMSURFER.math.vec3();

            result[0] = v.x;
            result[1] = v.y;
            result[2] = v.z;

            return result;
        },

        /**
         *
         */
        vec3ArrayToObj: function (v) {
            return { x: v[0], y: v[1], z: v[2] };
        },

        /**
         *
         * @param min
         * @param max
         */
        AxisBox3: function (min, max) {

            this.verts = [
                [min[0], min[1], min[2]],
                [max[0], min[1], min[2]],
                [max[0], max[1], min[2]],
                [min[0], max[1], min[2]],

                [min[0], min[1], max[2]],
                [max[0], min[1], max[2]],
                [max[0], max[1], max[2]],
                [min[0], max[1], max[2]]
            ];


            this.toBox3 = function () {
                var box = new Human.math.Box3();
                for (var i = 0; i < 8; i++) {
                    var v = this.verts[i];
                    for (var j = 0; j < 3; j++) {
                        if (v[j] < box.min[j]) {
                            box.min[j] = v[j];
                        }
                        if (v[j] > box.max[j]) {
                            box.max[j] = v[j];
                        }
                    }
                }
            };

            this.toBoundary = function () {
                var box = new Human.math.Box3();
                for (var i = 0; i < 8; i++) {
                    var v = this.verts[i];
                    for (var j = 0; j < 3; j++) {
                        if (v[j] < box.min[j]) {
                            box.min[j] = v[j];
                        }
                        if (v[j] > box.max[j]) {
                            box.max[j] = v[j];
                        }
                    }
                }
            };
        },

        lerpVec3: function (t, t1, t2, p1, p2, dest) {
            var result = dest || this.vec3();
            var f = (t - t1) / (t2 - t1);

            result[0] = p1[0] + (f * (p2[0] - p1[0]));
            result[1] = p1[1] + (f * (p2[1] - p1[1]));
            result[2] = p1[2] + (f * (p2[2] - p1[2]));

            return result;
        },

        getBoundaryDiag: function (boundary) {

            var min = this.vec3();
            var max = this.vec3();

            min[0] = boundary.xmin;
            min[1] = boundary.ymin;
            min[2] = boundary.zmin;

            max[0] = boundary.xmax;
            max[1] = boundary.ymax;
            max[2] = boundary.zmax;

            var tempVec = this.vec3();
            this.subVec3(max, min, tempVec);

            return Math.abs(this.lenVec3(tempVec));
        },

        getBoundaryCenter: function (boundary, dest) {
            var r = dest || this.vec3();

            r[0] = (boundary.xmax + boundary.xmin ) * 0.5;
            r[1] = (boundary.ymax + boundary.ymin ) * 0.5;
            r[2] = (boundary.zmax + boundary.zmin ) * 0.5;

            return r;
        }
    };

})();;if (typeof BIMSURFER.constants != 'object') {
    BIMSURFER.constants = {};
}

/**
 * Time in milliseconds before a connect or login action will timeout
 */
BIMSURFER.constants.timeoutTime = 10000; // ms

/**
 * The default IFC Types to load
 */
BIMSURFER.constants.defaultTypes = [
    "IfcColumn",
    "IfcStair",
    "IfcSlab",
    "IfcWindow",
//	"IfcOpeningElement",
    "IfcDoor",
    "IfcBuildingElementProxy",
    "IfcWallStandardCase",
    "IfcWall",
    "IfcBeam",
    "IfcRailing",
    "IfcProxy",
    "IfcRoof"
];

//writeMaterial(jsonWriter, "IfcSpace", new double[] { 0.137255f, 0.403922f, 0.870588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcRoof", new double[] { 0.837255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSlab", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWall", new double[] { 0.537255f, 0.337255f, 0.237255f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWallStandardCase", new double[] { 1.0f, 1.0f, 1.0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDoor", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWindow", new double[] { 0.2f, 0.2f, 0.8f }, 0.2f);
//writeMaterial(jsonWriter, "IfcRailing", new double[] { 0.137255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcColumn", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcBeam", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcFurnishingElement", new double[] { 0.437255f, 0.603922f, 0.370588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcCurtainWall", new double[] { 0.5f, 0.5f, 0.5f }, 0.5f);
//writeMaterial(jsonWriter, "IfcStair", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcBuildingElementProxy", new double[] { 0.5f, 0.5f, 0.5f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowSegment", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowFitting", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowTerminal", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcProxy", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSite", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcLightFixture", new double[] {0.8470588235f, 0.8470588235f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctSegment", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctFitting", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcAirTerminal", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);

BIMSURFER.constants.materials = {
    IfcSpace: [0.137255, 0.403922, 0.870588, 1.0],
    IfcRoof: [ 0.837255, 0.203922, 0.270588, 1.0],
    IfcSlab: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWall: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcWallStandardCase: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcDoor: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWindow: [ 0.137255, 0.403922, 0.870588, 0.5],
    IfcOpeningElement: [ 0.137255, 0.403922, 0.870588, 0],
    IfcRailing: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcColumn: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcBeam: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFurnishingElement: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcCurtainWall: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcStair: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcStairFlight: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcBuildingElementProxy: [ 0.5, 0.5, 0.5, 1.0],
    IfcFlowSegment: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowitting: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowTerminal: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcProxy: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcSite: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcLightFixture: [ 0.8470588235, 0.8470588235, 0.870588, 1.0],
    IfcDuctSegment: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDistributionFlowElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDuctFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcPlate: [ 0.8470588235, 0.427450980392, 0, 0.5],
    IfcAirTerminal: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcMember: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcCovering: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcTransportElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowController: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcRamp: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFurniture: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFooting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSystemFurnitureElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSpace: [ 0.137255, 0.303922, 0.570588, 0.5],
    DEFAULT: [ 0.8470588235, 0.427450980392, 0, 1.0]
};

/*
 * Default camera settings
 */
BIMSURFER.constants.camera = {
    maxOrbitSpeed: Math.PI * 0.1,
    orbitSpeedFactor: 0.05,
    zoomSpeedFactor: 0.1,
    panSpeedFactor: 0.6
};

/*
 * Default markup for highlighted objects
 */
BIMSURFER.constants.highlightSelectedObject = {
    type: 'material',
    wire: true,
    id: 'highlight',
    emit: 0.0,
    baseColor: {r: 0.0, g: 1, b: 0}
};

/*
 * Default markup for highlighted special objects
 */
BIMSURFER.constants.highlightSelectedSpecialObject = {
    type: 'material',
    id: 'specialselectedhighlight',
    emit: 1,
    baseColor: {r: 0.16, g: 0.70, b: 0.88},
    shine: 10.0
};

/*
 * Enumeration for progressbar types
 */
BIMSURFER.constants.ProgressBarStyle = {
    Continuous: 1,
    Marquee: 2
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} s The number to clamp
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
BIMSURFER.constants.clamp = function (s, min, max) {
    return Math.min(Math.max(s, min), max);
};;/**

 **Component** is the base class for all components within a {{#crossLink "Viewer"}}{{/crossLink}}.

 <hr>

 *Contents*

 <Ul>
 <li><a href="#ids">Component IDs</a></li>
 <li><a href="#componentProps">Properties</a></li>
 <li><a href="#metadata">Metadata</a></li>
 <li><a href="#logging">Logging</a></li>
 <li><a href="#destruction">Destruction</a></li>
 </ul>

 <hr>

 ## <a name="ids">Component IDs</a>

 Every Component has an ID that's unique within the parent {{#crossLink "Viewer"}}{{/crossLink}}. BIMViewer generates
 the IDs automatically by default, however you can also specify them yourself. In the example below, we're creating a
 viewer comprised of {{#crossLink "Viewer"}}{{/crossLink}}, {{#crossLink "Material"}}{{/crossLink}}, {{#crossLink "Geometry"}}{{/crossLink}} and
 {{#crossLink "GameObject"}}{{/crossLink}} components, while letting xeoEngine generate its own ID for
 the {{#crossLink "Geometry"}}{{/crossLink}}:

 ````javascript
 // The Viewer is a Component too
 var viewer = new BIMSURFER.Viewer({
    id: "myViewer"
});

 var material = new BIMSURFER.Material(viewer, {
    id: "myMaterial"
});

 var geometry = new BIMSURFER.Geometry(viewer, {
    id: "myGeometry"
});

 // Let xeoEngine automatically generated the ID for our GameObject
 var object = new BIMSURFER.GameObject(viewer, {
    material: material,
    geometry: geometry
});
 ````

 We can then find those components like this:

 ````javascript
 // Find the Viewer
 var theViewer = BIMSURFER.viewers["myViewer"];

 // Find the Material
 var theMaterial = theViewer.components["myMaterial"];
 ````

 ## <a name="componentProps">Properties</a>

 Almost every property on a xeoEngine Component fires a change event when you update it. For example, we can subscribe
 to the {{#crossLink "Material/diffuse:event"}}{{/crossLink}} event that a
 {{#crossLink "Material"}}{{/crossLink}} fires when its {{#crossLink "Material/diffuse:property"}}{{/crossLink}}
 property is updated, like so:

 ````javascript
 // Bind a change callback to a property
 var handle = material.on("diffuse", function(diffuse) {
    console.log("Material diffuse color has changed to: [" + diffuse[0] + ", " + diffuse[1] + "," + diffuse[2] + "]");
});

 // Change the property value, which fires the callback
 material.diffuse = [ 0.0, 0.5, 0.5 ];

 // Unsubscribe from the property change event
 material.off(handle);
 ````

 We can also subscribe to changes in the way components are attached to each other, since components are properties
 of other components. For example, we can subscribe to the '{{#crossLink "GameObject/material:event"}}{{/crossLink}}' event that a
 {{#crossLink "GameObject"}}GameObject{{/crossLink}} fires when its {{#crossLink "GameObject/material:property"}}{{/crossLink}}
 property is set to a different {{#crossLink "Material"}}Material{{/crossLink}}:

 ```` javascript
 // Bind a change callback to the GameObject's Material
 object1.on("material", function(material) {
    console.log("GameObject's Material has changed to: " + material.id);
});

 // Now replace that Material with another
 object1.material = new BIMSURFER.Material({
    id: "myOtherMaterial",
    diffuse: [ 0.3, 0.3, 0.6 ]
    //..
});
 ````

 ## <a name="metadata">Metadata</a>

 You can set optional **metadata** on your Components, which can be anything you like. These are intended
 to help manage your components within your application code or content pipeline. You could use metadata to attach
 authoring or version information, like this:

 ````javascript
 // Viewer with authoring metadata
 var viewer = new BIMSURFER.Viewer({
    id: "myViewer",
    metadata: {
        title: "My awesome 3D viewer",
        author: "@xeolabs",
 date: "February 13 2015"
 }
 });

 // Material with descriptive metadata
 var material = new BIMSURFER.Material(viewer, {
    id: "myMaterial",
    diffuse: [1, 0, 0],
    metadata: {
        description: "Bright red color with no textures",
        version: "0.1",
        foo: "bar"
    }
});
 ````

 As with all properties, you can subscribe and change the metadata like this:

 ````javascript
 // Subscribe to changes to the Material's metadata
 material.on("metadata", function(value) {
    console.log("Metadata changed: " + JSON.stringify(value));
});

 // Change the Material's metadata, firing our change handler
 material.metadata = {
    description: "Bright red color with no textures",
    version: "0.2",
    foo: "baz"
};
 ````

 ## <a name="logging">Logging</a>

 Components have methods to log ID-prefixed messages to the JavaScript console:

 ````javascript
 material.log("Everything is fine, situation normal.");
 material.warn("Wait, whats that red light?");
 material.error("Aw, snap!");
 ````

 The logged messages will look like this in the console:

 ````text
 [LOG]   myMaterial: Everything is fine, situation normal.
 [WARN]  myMaterial: Wait, whats that red light..
 [ERROR] myMaterial: Aw, snap!
 ````

 ## <a name="destruction">Destruction</a>

 Get notification of destruction directly on the Components:

 ````javascript
 material.on("destroyed", function() {
    this.log("Component was destroyed: " + this.id);
});
 ````

 Or get notification of destruction of any Component within its {{#crossLink "Viewer"}}{{/crossLink}}, indiscriminately:

 ````javascript
 viewer.on("componentDestroyed", function(component) {
    this.log("Component was destroyed: " + component.id);
});
 ````

 Then destroy a component like this:

 ````javascript
 material.destroy();
 ````

 Other Components that are linked to it will fall back on a default of some sort. For example, any
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}} that were linked to our {{#crossLink "Material"}}{{/crossLink}}
 will then automatically link to the {{#crossLink "Viewer"}}Viewer's{{/crossLink}} default {{#crossLink "Viewer/material:property"}}{{/crossLink}}.

 @class Component
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}} - creates this Component
 within the default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted.
 @param [cfg] {*} Component configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Component.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.Component = Class.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Component",


        __init: function (viewer, cfg) {

            cfg = cfg || {};

            /**
             The {{#crossLink "Viewer"}}{{/crossLink}} that contains this Component.

             @property viewer
             @type {Viewer}
             @final
             */
            this.viewer = viewer;

            /**
             The IFC type of this Component.

             @property type
             @type {String}
             @final
             */
            this.type = cfg.type;

            /**
             Metadata on this component.

             @property metadata
             @type Object
             */
            this.metadata = cfg.metadata || {};

            /**
             Unique ID for this Component within its parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.

             @property id
             @type String
             @final
             */
            this.id = cfg.id;

            /**
             True as soon as this Component has been destroyed

             @property destroyed
             @type Boolean
             */
            this.destroyed = false;

            // Events
            this._handleMap = new BIMSURFER.utils.Map(); // Subscription handle pool
            this._locSubs = {}; // A [handle -> callback] map for each location name
            this._handleLocs = {}; // Maps handles to loc names
            this.props = {}; // Maps locations to publications

            // Add this component to the Viewer
            // Assigns this component an automatic ID if not yet assigned
            this.viewer._addComponent(this);

            this._onTick = null;

            // Initialize
            this._init(cfg);
        },

        /**
         * Initializes this component
         * @param cfg
         * @private
         */
        _init: function (cfg) {
        },

        /**
         * Fires an event on this component.
         *
         * Notifies existing subscribers to the event, retains the event to give to
         * any subsequent notifications on that location as they are made.
         *
         * @method fire
         * @param {String} event The event type name
         * @param {Object} value The event
         * @param {Boolean} [forget=false] When true, does not retain for subsequent subscribers
         */
        fire: function (event, value, forget) {
            if (forget !== true) {
                this.props[event] = value; // Save notification
            }
            var subsForLoc = this._locSubs[event];
            var sub;
            if (subsForLoc) { // Notify subscriptions
                for (var handle in subsForLoc) {
                    if (subsForLoc.hasOwnProperty(handle)) {
                        sub = subsForLoc[handle];
                        sub.callback.call(sub.scope, value);
                    }
                }
            }
        },

        /**
         * Subscribes to an event on this component.
         *
         * The callback is be called with this component as scope.
         *
         * @method on
         * @param {String} event Publication event
         * @param {Function} callback Called when fresh data is available at the event
         * @param {Object} [scope=this] Scope for the callback
         * @return {String} Handle to the subscription, which may be used to unsubscribe with {@link #off}.
         */
        on: function (event, callback, scope) {
            var subsForLoc = this._locSubs[event];
            if (!subsForLoc) {
                subsForLoc = {};
                this._locSubs[event] = subsForLoc;
            }
            var handle = this._handleMap.addItem(); // Create unique handle
            subsForLoc[handle] = {
                scope: scope || this,
                callback: callback
            };
            this._handleLocs[handle] = event;
            var value = this.props[event];
            if (value) { // A publication exists, notify callback immediately
                callback.call(scope || this, value);
            }
            return handle;
        },

        /**
         * Cancels an event subscription that was previously made with {{#crossLink "Component/on:method"}}{{/crossLink}} or
         * {{#crossLink "Component/once:method"}}{{/crossLink}}.
         *
         * @method off
         * @param {String} handle Publication handle
         */
        off: function (handle) {
            var event = this._handleLocs[handle];
            if (event) {
                delete this._handleLocs[handle];
                var locSubs = this._locSubs[event];
                if (locSubs) {
                    delete locSubs[handle];
                }
                this._handleMap.removeItem(handle); // Release handle
            }
        },

        /**
         * Subscribes to the next occurrence of the given event, then un-subscribes as soon as the event is handled.
         *
         * @method once
         * @param {String} event Data event to listen to
         * @param {Function(data)} callback Called when fresh data is available at the event
         * @param {Object} [scope=this] Scope for the callback
         */
        once: function (event, callback, scope) {
            var self = this;
            var handle = this.on(event,
                function (value) {
                    self.off(handle);
                    callback(value);
                },
                scope);
        },

        /**
         * Logs a console debugging message for this component.
         *
         * The console message will have this format: *````[LOG] <component id>: <message>````*
         *
         * @method log
         * @param {String} message The message to log
         */
        log: function (message) {
            window.console.log("[LOG] " + this.id + ": " + message);
        },

        /**
         * Logs an error for this component to the JavaScript console.
         *
         * The console message will have this format: *````[ERROR] <component id>: <message>````*
         *
         * @method error
         * @param {String} message The message to log
         */
        error: function (message) {
            window.console.error("[ERROR] " + this.id + ": " + message);
        },

        /**
         * Logs a warning for this component to the JavaScript console.
         *
         * The console message will have this format: *````[WARN] <component id>: <message>````*
         *
         * @method warn
         * @param {String} message The message to log
         */
        warn: function (message) {
            window.console.warn("[WARN] " + this.id + ": " + message);
        },

        /**
         * Destroys this component.
         *
         * Removes this Component from its {{#crossLink "Viewer"}}{{/crossLink}}.
         *
         * Fires a {{#crossLink "Component/destroyed:event"}}{{/crossLink}} event on this Component.
         *
         * @method destroy
         */
        destroy: function () {

            // Remove from Viewer
            this.viewer._removeComponent(this);

            if (this._destroy) {
                this._destroy();
            }

            this.destroyed = true;

            /**
             * Fired when this Component is destroyed.
             * @event destroyed
             */
            this.fire("destroyed");
        }
    });

})();
;/**
 Publishes key and mouse events that occur on the parent {{#crossLink "Scene"}}Scene{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.

 ## Overview

 <ul>
 <li>Each {{#crossLink "Scene"}}{{/crossLink}} provides an Input on itself as a read-only property.</li>
 </ul>

 <img src="http://www.gliffy.com/go/publish/image/7123123/L.png"></img>

 ## Example

 In this example, we're subscribing to some mouse and key events that will occur on
 a {{#crossLink "Viewer"}}Viewer's{{/crossLink}} {{#crossLink "Canvas"}}Canvas{{/crossLink}}.

 ````javascript
var viewer = new BIMSURFER.Viewer(...);

 var input = viewer.input;

 // We'll save a handle to this subscription
 // to show how to unsubscribe, further down
 var handle = input.on("mousedown", function(coords) {
       console.log("Mouse down at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("mouseup", function(coords) {
       console.log("Mouse up at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("mouseclicked", function(coords) {
      console.log("Mouse clicked at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("dblclick", function(coords) {
       console.log("Double-click at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("keydown", function(keyCode) {
        switch (keyCode) {

            case this.KEY_A:
               console.log("The 'A' key is down");
               break;

            case this.KEY_B:
               console.log("The 'B' key is down");
               break;

            case this.KEY_C:
               console.log("The 'C' key is down");
               break;

            default:
               console.log("Some other key is down");
       }
     });

 input.on("keyup", function(keyCode) {
        switch (keyCode) {

            case this.KEY_A:
               console.log("The 'A' key is up");
               break;

            case this.KEY_B:
               console.log("The 'B' key is up");
               break;

            case this.KEY_C:
               console.log("The 'C' key is up");
               break;

            default:
               console.log("Some other key is up");
        }
     });

 // TODO: ALT and CTRL keys etc
 ````

 ### Unsubscribing from Events

 In the snippet above, we saved a handle to one of our event subscriptions.

 We can then use that handle to unsubscribe again, like this:

 ````javascript
 input.off(handle);
 ````

 @class Input
 @module BIMSURFER
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Input = BIMSURFER.Component.extend({

        className: "BIMSURFER.Input",

        _init: function (cfg) {

            var self = this;

            // True when ALT down
            this.altDown = false;

            /** True whenever CTRL is down
             *
             * @type {boolean}
             */
            this.ctrlDown = false;

            /** True whenever left mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownLeft = false;

            /** True whenever middle mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownMiddle = false;

            /** True whenever right mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownRight = false;

            /** Flag for each key that's down
             *
             * @type {boolean}
             */
            this.keyDown = [];

            /** True while input enabled
             *
             * @type {boolean}
             */
            this.enabled = true;

            var canvas = this.viewer.canvas[0];

            // Capture input events and publish them on this component

            document.addEventListener("keydown",
                this._keyDownListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                        if (e.ctrlKey) {
                            self.ctrlDown = true;
                        } else if (e.altKey) {
                            self.altDown = true;
                        } else {
                            self.keyDown[e.keyCode] = true;

                            /**
                             * Fired whenever a key is pressed while the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}} has input focus.
                             * @event keydown
                             * @param value {Number} The key code, for example {{#crossLink "Input/KEY_LEFT_ARROW:property"}}{{/crossLink}},
                             */
                            self.fire("keydown", e.keyCode, true);
                        }
                    }
                }, true);


            document.addEventListener("keyup",
                this._keyUpListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                        if (e.ctrlKey) {
                            self.ctrlDown = false;
                        } else if (e.altKey) {
                            self.altDown = false;
                        } else {
                            self.keyDown[e.keyCode] = false;

                            /**
                             * Fired whenever a key is released while the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}} has input focus.
                             * @event keyup
                             * @param value {Number} The key code, for example {{#crossLink "Input/KEY_LEFT_ARROW:property"}}{{/crossLink}},
                             */
                            self.fire("keyup", e.keyCode, true);
                        }
                    }
                });

            canvas.addEventListener("mousedown",
                this._mouseDownListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = true;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = true;
                            break;
                        case 3:// Right button
                            self.mouseDownRight = true;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is pressed over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousedown
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mousedown", coords, true);
                });

            canvas.addEventListener("mouseup",
                this._mouseUpListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = false;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = false;
                            break;
                        case 3:// Right button
                            self.mouseDownRight = false;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is released over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mouseup
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mouseup", coords, true);
                });

            canvas.addEventListener("dblclick",
                this._dblClickListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = false;
                            self.mouseDownRight = false;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = false;
                            break;
                        case 3:// Right button
                            self.mouseDownLeft = false;
                            self.mouseDownRight = false;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is double-clicked over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event dblclick
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("dblclick", coords, true);
                });

            canvas.addEventListener("mousemove",
                this._mouseMoveListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is moved over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousedown
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mousemove", coords, true);
                });

            canvas.addEventListener("mousewheel",
                this._mouseWheelListener = function (event, d) {
                    if (!self.enabled) {
                        return;
                    }

                    var e = window.event || e; // old IE support
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                    /**
                     * Fired whenever the mouse wheel is moved over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousewheel
                     * @param delta {Number} The mouse wheel delta,
                     */
                    self.fire("mousewheel", delta, true);
                });

            // mouseclicked

            (function () {
                var downX;
                var downY;
                self.on("mousedown",
                    function (params) {
                        downX = params.x;
                        downY = params.y;
                    });

                self.on("mouseup",
                    function (params) {
                        if (downX === params.x && downY === params.y) {

                            /**
                             * Fired whenever the mouse is clicked over the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                             * @event mouseclicked
                             * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                             */
                            self.fire("mouseclicked", params, true);
                        }
                    });
            })();
        },

        _getClickCoordsWithinElement: function (event) {
            var coords = [0,0];
            if (!event) {
                event = window.event;
                coords.x = event.x;
                coords.y = event.y;
            }
            else {
                var element = event.target;
                var totalOffsetLeft = 0;
                var totalOffsetTop = 0;

                while (element.offsetParent) {
                    totalOffsetLeft += element.offsetLeft;
                    totalOffsetTop += element.offsetTop;
                    element = element.offsetParent;
                }
                coords[0] = event.pageX - totalOffsetLeft;
                coords[1] = event.pageY - totalOffsetTop;
            }
            return coords;
        },

        /**
         * Enable or disable all input handlers
         *
         * @param enable
         */
        setEnabled: function (enable) {
            if (this.enabled !== enable) {
                this.fire("enabled", this.enabled = enable);
            }
        },

        // Key codes

        /**
         * Code for the BACKSPACE key.
         * @property KEY_BACKSPACE
         * @final
         * @type Number
         */
        KEY_BACKSPACE: 8,

        /**
         * Code for the TAB key.
         * @property KEY_TAB
         * @final
         * @type Number
         */
        KEY_TAB: 9,

        /**
         * Code for the ENTER key.
         * @property KEY_ENTER
         * @final
         * @type Number
         */
        KEY_ENTER: 13,

        /**
         * Code for the SHIFT key.
         * @property KEY_SHIFT
         * @final
         * @type Number
         */
        KEY_SHIFT: 16,

        /**
         * Code for the CTRL key.
         * @property KEY_CTRL
         * @final
         * @type Number
         */
        KEY_CTRL: 17,

        /**
         * Code for the ALT key.
         * @property KEY_ALT
         * @final
         * @type Number
         */
        KEY_ALT: 18,

        /**
         * Code for the PAUSE_BREAK key.
         * @property KEY_PAUSE_BREAK
         * @final
         * @type Number
         */
        KEY_PAUSE_BREAK: 19,

        /**
         * Code for the CAPS_LOCK key.
         * @property KEY_CAPS_LOCK
         * @final
         * @type Number
         */
        KEY_CAPS_LOCK: 20,

        /**
         * Code for the ESCAPE key.
         * @property KEY_ESCAPE
         * @final
         * @type Number
         */
        KEY_ESCAPE: 27,

        /**
         * Code for the PAGE_UP key.
         * @property KEY_PAGE_UP
         * @final
         * @type Number
         */
        KEY_PAGE_UP: 33,

        /**
         * Code for the PAGE_DOWN key.
         * @property KEY_PAGE_DOWN
         * @final
         * @type Number
         */
        KEY_PAGE_DOWN: 34,

        /**
         * Code for the END key.
         * @property KEY_END
         * @final
         * @type Number
         */
        KEY_END: 35,

        /**
         * Code for the HOME key.
         * @property KEY_HOME
         * @final
         * @type Number
         */
        KEY_HOME: 36,

        /**
         * Code for the LEFT_ARROW key.
         * @property KEY_LEFT_ARROW
         * @final
         * @type Number
         */
        KEY_LEFT_ARROW: 37,

        /**
         * Code for the UP_ARROW key.
         * @property KEY_UP_ARROW
         * @final
         * @type Number
         */
        KEY_UP_ARROW: 38,

        /**
         * Code for the RIGHT_ARROW key.
         * @property KEY_RIGHT_ARROW
         * @final
         * @type Number
         */
        KEY_RIGHT_ARROW: 39,

        /**
         * Code for the DOWN_ARROW key.
         * @property KEY_DOWN_ARROW
         * @final
         * @type Number
         */
        KEY_DOWN_ARROW: 40,

        /**
         * Code for the INSERT key.
         * @property KEY_INSERT
         * @final
         * @type Number
         */
        KEY_INSERT: 45,

        /**
         * Code for the DELETE key.
         * @property KEY_DELETE
         * @final
         * @type Number
         */
        KEY_DELETE: 46,

        /**
         * Code for the 0 key.
         * @property KEY_NUM_0
         * @final
         * @type Number
         */
        KEY_NUM_0: 48,

        /**
         * Code for the 1 key.
         * @property KEY_NUM_1
         * @final
         * @type Number
         */
        KEY_NUM_1: 49,

        /**
         * Code for the 2 key.
         * @property KEY_NUM_2
         * @final
         * @type Number
         */
        KEY_NUM_2: 50,

        /**
         * Code for the 3 key.
         * @property KEY_NUM_3
         * @final
         * @type Number
         */
        KEY_NUM_3: 51,

        /**
         * Code for the 4 key.
         * @property KEY_NUM_4
         * @final
         * @type Number
         */
        KEY_NUM_4: 52,

        /**
         * Code for the 5 key.
         * @property KEY_NUM_5
         * @final
         * @type Number
         */
        KEY_NUM_5: 53,

        /**
         * Code for the 6 key.
         * @property KEY_NUM_6
         * @final
         * @type Number
         */
        KEY_NUM_6: 54,

        /**
         * Code for the 7 key.
         * @property KEY_NUM_7
         * @final
         * @type Number
         */
        KEY_NUM_7: 55,

        /**
         * Code for the 8 key.
         * @property KEY_NUM_8
         * @final
         * @type Number
         */
        KEY_NUM_8: 56,

        /**
         * Code for the 9 key.
         * @property KEY_NUM_9
         * @final
         * @type Number
         */
        KEY_NUM_9: 57,

        /**
         * Code for the A key.
         * @property KEY_A
         * @final
         * @type Number
         */
        KEY_A: 65,

        /**
         * Code for the B key.
         * @property KEY_B
         * @final
         * @type Number
         */
        KEY_B: 66,

        /**
         * Code for the C key.
         * @property KEY_C
         * @final
         * @type Number
         */
        KEY_C: 67,

        /**
         * Code for the D key.
         * @property KEY_D
         * @final
         * @type Number
         */
        KEY_D: 68,

        /**
         * Code for the E key.
         * @property KEY_E
         * @final
         * @type Number
         */
        KEY_E: 69,

        /**
         * Code for the F key.
         * @property KEY_F
         * @final
         * @type Number
         */
        KEY_F: 70,

        /**
         * Code for the G key.
         * @property KEY_G
         * @final
         * @type Number
         */
        KEY_G: 71,

        /**
         * Code for the H key.
         * @property KEY_H
         * @final
         * @type Number
         */
        KEY_H: 72,

        /**
         * Code for the I key.
         * @property KEY_I
         * @final
         * @type Number
         */
        KEY_I: 73,

        /**
         * Code for the J key.
         * @property KEY_J
         * @final
         * @type Number
         */
        KEY_J: 74,

        /**
         * Code for the K key.
         * @property KEY_K
         * @final
         * @type Number
         */
        KEY_K: 75,

        /**
         * Code for the L key.
         * @property KEY_L
         * @final
         * @type Number
         */
        KEY_L: 76,

        /**
         * Code for the M key.
         * @property KEY_M
         * @final
         * @type Number
         */
        KEY_M: 77,

        /**
         * Code for the N key.
         * @property KEY_N
         * @final
         * @type Number
         */
        KEY_N: 78,

        /**
         * Code for the O key.
         * @property KEY_O
         * @final
         * @type Number
         */
        KEY_O: 79,

        /**
         * Code for the P key.
         * @property KEY_P
         * @final
         * @type Number
         */
        KEY_P: 80,

        /**
         * Code for the Q key.
         * @property KEY_Q
         * @final
         * @type Number
         */
        KEY_Q: 81,

        /**
         * Code for the R key.
         * @property KEY_R
         * @final
         * @type Number
         */
        KEY_R: 82,

        /**
         * Code for the S key.
         * @property KEY_S
         * @final
         * @type Number
         */
        KEY_S: 83,

        /**
         * Code for the T key.
         * @property KEY_T
         * @final
         * @type Number
         */
        KEY_T: 84,

        /**
         * Code for the U key.
         * @property KEY_U
         * @final
         * @type Number
         */
        KEY_U: 85,

        /**
         * Code for the V key.
         * @property KEY_V
         * @final
         * @type Number
         */
        KEY_V: 86,

        /**
         * Code for the W key.
         * @property KEY_W
         * @final
         * @type Number
         */
        KEY_W: 87,

        /**
         * Code for the X key.
         * @property KEY_X
         * @final
         * @type Number
         */
        KEY_X: 88,

        /**
         * Code for the Y key.
         * @property KEY_Y
         * @final
         * @type Number
         */
        KEY_Y: 89,

        /**
         * Code for the Z key.
         * @property KEY_Z
         * @final
         * @type Number
         */
        KEY_Z: 90,

        /**
         * Code for the LEFT_WINDOW key.
         * @property KEY_LEFT_WINDOW
         * @final
         * @type Number
         */
        KEY_LEFT_WINDOW: 91,

        /**
         * Code for the RIGHT_WINDOW key.
         * @property KEY_RIGHT_WINDOW
         * @final
         * @type Number
         */
        KEY_RIGHT_WINDOW: 92,

        /**
         * Code for the SELECT key.
         * @property KEY_SELECT
         * @final
         * @type Number
         */
        KEY_SELECT_KEY: 93,

        /**
         * Code for the number pad 0 key.
         * @property KEY_NUMPAD_0
         * @final
         * @type Number
         */
        KEY_NUMPAD_0: 96,

        /**
         * Code for the number pad 1 key.
         * @property KEY_NUMPAD_1
         * @final
         * @type Number
         */
        KEY_NUMPAD_1: 97,

        /**
         * Code for the number pad 2 key.
         * @property KEY_NUMPAD 2
         * @final
         * @type Number
         */
        KEY_NUMPAD_2: 98,

        /**
         * Code for the number pad 3 key.
         * @property KEY_NUMPAD_3
         * @final
         * @type Number
         */
        KEY_NUMPAD_3: 99,

        /**
         * Code for the number pad 4 key.
         * @property KEY_NUMPAD_4
         * @final
         * @type Number
         */
        KEY_NUMPAD_4: 100,

        /**
         * Code for the number pad 5 key.
         * @property KEY_NUMPAD_5
         * @final
         * @type Number
         */
        KEY_NUMPAD_5: 101,

        /**
         * Code for the number pad 6 key.
         * @property KEY_NUMPAD_6
         * @final
         * @type Number
         */
        KEY_NUMPAD_6: 102,

        /**
         * Code for the number pad 7 key.
         * @property KEY_NUMPAD_7
         * @final
         * @type Number
         */
        KEY_NUMPAD_7: 103,

        /**
         * Code for the number pad 8 key.
         * @property KEY_NUMPAD_8
         * @final
         * @type Number
         */
        KEY_NUMPAD_8: 104,

        /**
         * Code for the number pad 9 key.
         * @property KEY_NUMPAD_9
         * @final
         * @type Number
         */
        KEY_NUMPAD_9: 105,

        /**
         * Code for the MULTIPLY key.
         * @property KEY_MULTIPLY
         * @final
         * @type Number
         */
        KEY_MULTIPLY: 106,

        /**
         * Code for the ADD key.
         * @property KEY_ADD
         * @final
         * @type Number
         */
        KEY_ADD: 107,

        /**
         * Code for the SUBTRACT key.
         * @property KEY_SUBTRACT
         * @final
         * @type Number
         */
        KEY_SUBTRACT: 109,

        /**
         * Code for the DECIMAL POINT key.
         * @property KEY_DECIMAL_POINT
         * @final
         * @type Number
         */
        KEY_DECIMAL_POINT: 110,

        /**
         * Code for the DIVIDE key.
         * @property KEY_DIVIDE
         * @final
         * @type Number
         */
        KEY_DIVIDE: 111,

        /**
         * Code for the F1 key.
         * @property KEY_F1
         * @final
         * @type Number
         */
        KEY_F1: 112,

        /**
         * Code for the F2 key.
         * @property KEY_F2
         * @final
         * @type Number
         */
        KEY_F2: 113,

        /**
         * Code for the F3 key.
         * @property KEY_F3
         * @final
         * @type Number
         */
        KEY_F3: 114,

        /**
         * Code for the F4 key.
         * @property KEY_F4
         * @final
         * @type Number
         */
        KEY_F4: 115,

        /**
         * Code for the F5 key.
         * @property KEY_F5
         * @final
         * @type Number
         */
        KEY_F5: 116,

        /**
         * Code for the F6 key.
         * @property KEY_F6
         * @final
         * @type Number
         */
        KEY_F6: 117,

        /**
         * Code for the F7 key.
         * @property KEY_F7
         * @final
         * @type Number
         */
        KEY_F7: 118,

        /**
         * Code for the F8 key.
         * @property KEY_F8
         * @final
         * @type Number
         */
        KEY_F8: 119,

        /**
         * Code for the F9 key.
         * @property KEY_F9
         * @final
         * @type Number
         */
        KEY_F9: 120,

        /**
         * Code for the F10 key.
         * @property KEY_F10
         * @final
         * @type Number
         */
        KEY_F10: 121,

        /**
         * Code for the F11 key.
         * @property KEY_F11
         * @final
         * @type Number
         */
        KEY_F11: 122,

        /**
         * Code for the F12 key.
         * @property KEY_F12
         * @final
         * @type Number
         */
        KEY_F12: 123,

        /**
         * Code for the NUM_LOCK key.
         * @property KEY_NUM_LOCK
         * @final
         * @type Number
         */
        KEY_NUM_LOCK: 144,

        /**
         * Code for the SCROLL_LOCK key.
         * @property KEY_SCROLL_LOCK
         * @final
         * @type Number
         */
        KEY_SCROLL_LOCK: 145,

        /**
         * Code for the SEMI_COLON key.
         * @property KEY_SEMI_COLON
         * @final
         * @type Number
         */
        KEY_SEMI_COLON: 186,

        /**
         * Code for the EQUAL_SIGN key.
         * @property KEY_EQUAL_SIGN
         * @final
         * @type Number
         */
        KEY_EQUAL_SIGN: 187,

        /**
         * Code for the COMMA key.
         * @property KEY_COMMA
         * @final
         * @type Number
         */
        KEY_COMMA: 188,

        /**
         * Code for the DASH key.
         * @property KEY_DASH
         * @final
         * @type Number
         */
        KEY_DASH: 189,

        /**
         * Code for the PERIOD key.
         * @property KEY_PERIOD
         * @final
         * @type Number
         */
        KEY_PERIOD: 190,

        /**
         * Code for the FORWARD_SLASH key.
         * @property KEY_FORWARD_SLASH
         * @final
         * @type Number
         */
        KEY_FORWARD_SLASH: 191,

        /**
         * Code for the GRAVE_ACCENT key.
         * @property KEY_GRAVE_ACCENT
         * @final
         * @type Number
         */
        KEY_GRAVE_ACCENT: 192,

        /**
         * Code for the OPEN_BRACKET key.
         * @property KEY_OPEN_BRACKET
         * @final
         * @type Number
         */
        KEY_OPEN_BRACKET: 219,

        /**
         * Code for the BACK_SLASH key.
         * @property KEY_BACK_SLASH
         * @final
         * @type Number
         */
        KEY_BACK_SLASH: 220,

        /**
         * Code for the CLOSE_BRACKET key.
         * @property KEY_CLOSE_BRACKET
         * @final
         * @type Number
         */
        KEY_CLOSE_BRACKET: 221,

        /**
         * Code for the SINGLE_QUOTE key.
         * @property KEY_SINGLE_QUOTE
         * @final
         * @type Number
         */
        KEY_SINGLE_QUOTE: 222,

        /**
         * Code for the SPACE key.
         * @property KEY_SPACE
         * @final
         * @type Number
         */
        KEY_SPACE: 32,


        _destroy: function () {
            document.removeEventListener("keydown", this._keyDownListener);
            document.removeEventListener("keyup", this._keyUpListener);
        }
    });

})();

;(function () {
    "use strict";


    /**
     * @constructor
     * @param {Object} bimServerApi A BIMSurfer API
     * @param {String|DOMelement} div The viewport div within which the canvas will be inserted in the DOM
     * @param {Object} [options] Options
     * @param {Boolean} [autoStart=false] Starts this Viewer automatically when true
     */
    BIMSURFER.Viewer = function (bimServerApi, div, options, autoStart) {

        var self = this;

        this.className = "BIMSURFER.Viewer";

        // Event management

        // Pub/sub
        this._handleMap = new BIMSURFER.utils.Map(); // Subscription handle pool
        this._locSubs = {}; // A [handle -> callback] map for each location name
        this._handleLocs = {}; // Maps handles to loc names
        this.props = {}; // Maps locations to publications


        // Check arguments

        if (typeof div == 'string') {
            div = jQuery('div#' + div)[0];
        }

        if (!jQuery(div).is('div')) {
            console.error("BIMSURFER: Can't find div element");
            return;
        }

        // Clear container div

        jQuery(div).empty();

        this._div = div;


        /**
         * The BIMServer API
         *
         * @property bimServerApi
         * @type {Object}
         */
        this.bimServerApi = bimServerApi;


        this.SYSTEM = this;


        /**
         * Servers connected to this Viewer.
         *
         * @property connectedServers
         * @type {Array of BIMSURFER.Server}
         */
        this.connectedServers = [];


        var canvasId = jQuery(this._div).attr('id') + "-canvas";

        /**
         * The HTML Canvas that this Viewer renders to. This is inserted into the div we configured this Viewer with.
         * @property canvas
         * @type {HTMLCanvasElement}
         * @final
         */
        this.canvas = jQuery('<canvas />')
            .attr('id', canvasId)
            .attr('width', jQuery(this._div).width())
            .attr('height', jQuery(this._div).height())
            .html('<p>This application requires a browser that supports the <a href="http://www.w3.org/html/wg/html5/">HTML5</a> &lt;canvas&gt; feature.</p>')
            .addClass(this.className.replace(/\./g, "-"))
            .appendTo(this._div);


        /**
         * The SceneJS scene graph that renders 3D content for this Viewer.
         * @property scene
         * @type {SceneJS.Scene}
         * @final
         */
        this.scene = SceneJS.createScene({

            canvasId: canvasId,

            nodes: [

                // Node library, where we keep sharable
                // asset nodes, such as geometries
                {
                    type: "library",
                    id: "library"
                },

                // Viewing transform
                {
                    type: "lookAt",
                    id: "theLookat",

                    nodes: [

                        // Projection transform
                        {
                            type: "camera",
                            id: "theCamera",

                            nodes: [

                                // Light sources
                                {
                                    id: "lightsRoot",
                                    lights: [],

                                    nodes: [

                                        // Content is appended below this node
                                        {
                                            id: "contentRoot"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        /**
         * ID of this Viewer
         *
         * @property id
         * @type {String}
         */
        this.id = this.scene.getId();

//        // Set initial tag mask on scene graph
//
//        this.scene.set('tagMask', '^()$');

        // Init events

        var canvas = this.scene.getCanvas();

        canvas.addEventListener('mousedown',
            function (e) {
                self.fire('mouseDown', e);
            }, true);

        canvas.addEventListener('mousemove',
            function (e) {
                self.fire('mouseMove', e);
            }, true);

        canvas.addEventListener('mouseup',
            function (e) {
                self.fire('mouseUp', e);
            }, true);

        canvas.addEventListener('touchstart',
            function (e) {
                self.fire('touchStart', e);
            }, true);

        canvas.addEventListener('touchmove',
            function (e) {
                self.fire('touchMove', e);
            }, true);

        canvas.addEventListener('touchend',
            function (e) {
                self.fire('touchEnd', e);
            }, true);

        canvas.addEventListener('mousewheel',
            function (e) {
                self.fire('mouseWheel', e);
            }, true);

        canvas.addEventListener('DOMMouseScroll',
            function (e) {
                self.fire('mouseWheel', e);
            }, true);

        this.scene.on('pick',
            function (hit) {

                var objectId = hit.name;
                var object = self.components[objectId];

                if (object) {

                    var event = {
                        object: object,
                        canvasPos: hit.canvasPos,
                        worldPos: hit.worldPos
                    };

                    object.fire("picked", event);

                    self.fire("picked", event);
                }
            });

        this.scene.on('nopick',
            function (e) {
                self.fire("nothingPicked", e);
            });

        this.scene.on('tick',
            function (params) {
                self.fire('tick', {
                    time: params.time * 0.001,
                    elapsed: (params.time - params.prevTime) * 0.001
                });
            });

        // Do a ray-pick off each canvas mouse click

        var lastDown = {
            x: null,
            y: null
        };

        this.on('mouseDown',
            function (e) {
                lastDown.x = e.offsetX;
                lastDown.y = e.offsetY;
            });

        this.on('mouseUp',
            function (e) {

                if (((e.offsetX > lastDown.x) ? (e.offsetX - lastDown.x < 5) : (lastDown.x - e.offsetX < 5)) &&
                    ((e.offsetY > lastDown.y) ? (e.offsetY - lastDown.y < 5) : (lastDown.y - e.offsetY < 5))) {

                    self.scene.pick(lastDown.x, lastDown.y, { rayPick: true });
                }
            });


        // Pool where we'll keep all component IDs
        this._componentIDMap = new BIMSURFER.utils.Map();

        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their IDs.
         * @property components
         * @type {{String:Component}}
         */
        this.components = {};


        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their class names.
         * @property classes
         * @type {{String:{String:Component}}}
         */
        this.classes = {};


        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their IFC type names.
         * @property types
         * @type {{String:{String:Component}}}
         */
        this.types = {};


        // Add components

        var components = options.components;

        if (components) {

            var component;
            var className;
            var constructor;

            for (var i = 0, len = components.length; i < len; i++) {

                component = components[i];
                className = component.className;

                if (className) {
                    constructor = window[className];

                    if (constructor) {

                        // Adds component to this Viewer via #_addComponent
                        new constructor(this, component);
                    }
                }
            }
        }

        if (BIMSURFER.utils.isset(options, options.autoStart)) {
            if (!BIMSURFER.Util.isset(options.autoStart.serverUrl, options.autoStart.serverUsername, options.autoStart.serverPassword, options.autoStart.projectOid)) {
                console.error('Some autostart parameters are missing');
                return;
            }
            var _this = this;
            var BIMServer = new BIMSURFER.Server(this, options.autoStart.serverUrl, options.autoStart.serverUsername, options.autoStart.serverPassword, false, true, true, function () {
                if (BIMServer.loginStatus != 'loggedin') {
                    _this._div.innerHTML = 'Something went wrong while connecting';
                    console.error('Something went wrong while connecting');
                    return;
                }
                var project = BIMServer.getProjectByOid(options.autoStart.projectOid);
                project.loadScene((BIMSURFER.Util.isset(options.autoStart.revisionOid) ? options.autoStart.revisionOid : null), true);
            });
        }

        /**
         * Geometry loaders
         * @property geometryLoaders
         * @type {Array of }
         * @final
         */
        this.geometryLoaders = [];

        // Start the loading loop
        // This just runs forever, polling any loaders that exist on this viewer

        this.scene.on("tick",
            function () {
                self.geometryLoaders.forEach(
                    function (geometryLoader) {
                        geometryLoader.process();
                    });
            });

        /**
         * Input handling
         */
        this.input = new BIMSURFER.Input(this);
    };

    /**
     * Adds a {{#crossLink "Component"}}{{/crossLink}} to this viewer.
     *
     * This is called within the constructors of {{#crossLink "Component"}}{{/crossLink}} subclasses.
     *
     * The {{#crossLink "Component"}}{{/crossLink}} is assigned a
     * unique {{#crossLink "Component/id:property"}}{{/crossLink}} if it does not yet have one.
     *
     * @private
     * @param {BIMSURFER.Component} component The Component to add.
     */
    BIMSURFER.Viewer.prototype._addComponent = function (component) {

        var id = component.id;
        var className = component.className;

        // Check for ID clash

        if (id) {
            if (this.components[id]) {
                this.error("A component with this ID already exists in this Viewer: " + id);
                return;
            }
        } else {
            id = component.id = this._componentIDMap.addItem({});
        }

        // Add component to ID map

        this.components[id] = component;

        // Add component to className map

        var classComponents = this.classes[className];
        if (!classComponents) {
            classComponents = this.classes[className] = {};
        }
        classComponents[id] = component;


        // Add component to type map

        if (component.type) {
            var type = component.type;
            var typeComponents = this.types[type];
            if (!typeComponents) {
                typeComponents = this.types[type] = {};
            }
            typeComponents[id] = component;
        }

        /**
         * Fired whenever a Component has been created within this Viewer.
         * @event componentCreated
         * @param {Component} value The component that was created
         */
        this.fire("componentCreated", component, true);
    };

    /**
     * Removes a {{#crossLink "Component"}}{{/crossLink}} from this Viewer.
     *
     * This is called within the destructors of {{#crossLink "Component"}}{{/crossLink}} subclasses.
     *
     * @private
     * @param {BIMSURFER.Component} component The component to remove
     */
    BIMSURFER.Viewer.prototype._removeComponent = function (component) {

        var id = component.id;
        var className = component.className;

        if (!this.components[id]) {
            console.warn("BIMSURFER.Viewer._removeComponent - Component with this ID is not within Viewer: " + id);
            return;
        }

        delete this.components[id];
        delete this.classes[className][id];

        if (component.type) {
            delete this.types[component.type][id];
        }

        this._componentIDMap.removeItem(id);

        /**
         * Fired whenever a component within this Viewer has been destroyed.
         * @event componentDestroyed
         * @param {Component} value The component that was destroyed
         */
        this.fire("componentDestroyed", component, true);
    };

    /**
     *
     */
    BIMSURFER.Viewer.prototype.pick = function (x, y, rayPick) {
        self.scene.pick(x, y, { rayPick: rayPick });
    };

    /**
     * Stores a connection to a server for later use.
     *
     * @param {BIMSURFER.Server} server The server connection to store.
     */
    BIMSURFER.Viewer.prototype.addConnectedServer = function (server) {
        if (this.connectedServers.indexOf(server) == -1) {
            this.connectedServers.push(server);
        }
    };

    /**
     * Resizes the viewport and updates the aspect ratio
     *
     * @param {Number} width The new width in px
     * @param {Number} height The new height in px
     */
    BIMSURFER.Viewer.prototype.resize = function (width, height) {

        if (!this.canvas) {
            // TODO: log
            return;
        }

        jQuery(this.canvas).width(width).height(height);

        if (BIMSURFER.Util.isset(this.canvas[0])) {
            this.canvas[0].width = width;
            this.canvas[0].height = height;
        }

        var cameraNode = this.scene.getNode("theCamera");
        var optics = cameraNode.getOptics();
        optics.aspect = jQuery(this.canvas).width() / jQuery(this.canvas).height();
        cameraNode.setOptics(optics);
    };

    /**
     * Loads and shows the geometry of the revisions that are in the load queue
     */
    BIMSURFER.Viewer.prototype.loadGeometry = function (geometryLoader) {

        var self = this;

        this.geometryLoaders.push(geometryLoader);

        // TODO limit to something useful

        if (this.geometryLoaders.length <= 20) {
            geometryLoader.progressListeners.push(
                function (progress) {
                    if (progress == "done") {
                        removeA(self.geometryLoaders, geometryLoader);
                    }
                });
            geometryLoader.start();
        }
    };

    /**
     * Iterates with a callback over Components of the given classes
     *
     * @param {String} classNames List of class names
     * @param {Function} callback Callback called for each Component of the given classes
     */
    BIMSURFER.Viewer.prototype.withClasses = function (classNames, callback) {
        var className;
        for (var i = 0, len = classNames.length; i < len; i++) {
            className = classNames[i];
            var components = this.classes[className];
            if (components) {
                for (var id in components) {
                    if (components.hasOwnProperty(id)) {
                        callback(components[id]);
                    }
                }
            }
        }
    };

    /**
     * Iterates with a callback over Components of the given IFC types
     *
     * @param {String} typeNames List of type names
     * @param {Function} callback Callback called for each Component of the given types
     */
    BIMSURFER.Viewer.prototype.withTypes = function (typeNames, callback) {
        var typeName;
        for (var i = 0, len = typeNames.length; i < len; i++) {
            typeName = typeNames[i];
            var components = this.types[typeName];
            if (components) {
                for (var id in components) {
                    if (components.hasOwnProperty(id)) {
                        callback(components[id]);
                    }
                }
            }
        }
    };

    /**
     * Shows an IFC type of a revision.
     *
     * @param {Array of String} typeNames Names of types to hide
     * @param {BIMSURFER.ProjectRevision instance} revision The revision
     */
    BIMSURFER.Viewer.prototype.showTypes = function (typeNames, revision) {
        this.withTypes(typeNames,
            function (component) {
                component.active = true;

            });
    };

    /**
     * Hides an IFC type of a revision.
     *
     * @param {Array of String} typeNames Names of types to hide
     * @param {BIMSURFER.ProjectRevision instance} revision The revision
     */
    BIMSURFER.Viewer.prototype.hideTypes = function (typeNames, revision) {
        this.withTypes(typeNames,
            function (component) {
                component.active = false;
            });
    };

    /**
     * Hides all the types of a revision
     *
     * @param {BIMSURFER.ProjectRevision} revision The revision to hide
     */
    BIMSURFER.Viewer.prototype.hideRevision = function (revision) {
//        var visibleTypes = revision.visibleTypes.slice(0);
//        for (var i = 0; i < visibleTypes.length; i++) {
//            this.hideType(visibleTypes[i], revision);
//        }
    };

    /**
     * Shows a revision
     *
     * @param {BIMSURFER.ProjectRevision} revision The revision to show
     * @param {Array} [types] The types to show (default = BIMSURFER.constants.defaultTypes)
     */
    BIMSURFER.Viewer.prototype.showRevision = function (revision, types) {

        if (!types) {

            types = [];

            var defaultTypes = BIMSURFER.constants.defaultTypes;

            if (!defaultTypes) {
                this.warn("Property expected in BIMSURFER.constants: defaultTypes");

            } else {
                for (var i = 0; i < revision.ifcTypes.length; i++) {
                    if (defaultTypes.indexOf(revision.ifcTypes[i]) != -1) {
                        types.push(revision.ifcTypes[i]);
                    }
                }
            }
        }

        this.showType(types, revision);
    };

    /**
     * Fires an event on this Viewer.
     *
     * Notifies existing subscribers to the event, retains the event to give to
     * any subsequent notifications on that location as they are made.
     *
     * @method fire
     * @param {String} event The event type name
     * @param {Object} value The event
     * @param {Boolean} [forget=false] When true, does not retain for subsequent subscribers
     */
    BIMSURFER.Viewer.prototype.fire = function (event, value, forget) {
        if (forget !== true) {
            this.props[event] = value; // Save notification
        }
        var subsForLoc = this._locSubs[event];
        var sub;
        if (subsForLoc) { // Notify subscriptions
            for (var handle in subsForLoc) {
                if (subsForLoc.hasOwnProperty(handle)) {
                    sub = subsForLoc[handle];
                    sub.callback.call(sub.scope, value);
                }
            }
        }
    };

    /**
     * Subscribes to an event on this Viewer.
     *
     * The callback is be called with this Viewer as scope.
     *
     * @method on
     * @param {String} event Publication event
     * @param {Function} callback Called when fresh data is available at the event
     * @param {Object} [scope=this] Scope for the callback
     * @return {String} Handle to the subscription, which may be used to unsubscribe with {@link #off}.
     */
    BIMSURFER.Viewer.prototype.on = function (event, callback, scope) {
        var subsForLoc = this._locSubs[event];
        if (!subsForLoc) {
            subsForLoc = {};
            this._locSubs[event] = subsForLoc;
        }
        var handle = this._handleMap.addItem(); // Create unique handle
        subsForLoc[handle] = {
            scope: scope || this,
            callback: callback
        };
        this._handleLocs[handle] = event;
        var value = this.props[event];
        if (value) { // A publication exists, notify callback immediately
            callback.call(scope || this, value);
        }
        return handle;
    };

    /**
     * Cancels an event subscription that was previously made with {{#crossLink "Viewer/on:method"}}{{/crossLink}} or
     * {{#crossLink "Viewer/once:method"}}{{/crossLink}}.
     *
     * @method off
     * @param {String} handle Publication handle
     */
    BIMSURFER.Viewer.prototype.off = function (handle) {
        var event = this._handleLocs[handle];
        if (event) {
            delete this._handleLocs[handle];
            var locSubs = this._locSubs[event];
            if (locSubs) {
                delete locSubs[handle];
            }
            this._handleMap.removeItem(handle); // Release handle
        }
    };

    /**
     * Subscribes to the next occurrence of the given event on this Viewer, then un-subscribes as soon as the event is handled.
     *
     * @method once
     * @param {String} event Data event to listen to
     * @param {Function(data)} callback Called when fresh data is available at the event
     * @param {Object} [scope=this] Scope for the callback
     */
    BIMSURFER.Viewer.prototype.once = function (event, callback, scope) {
        var self = this;
        var handle = this.on(event,
            function (value) {
                self.off(handle);
                callback(value);
            },
            scope);
    };

    /**
     * Logs a console debugging message for this View.
     *
     * The console message will have this format: *````[LOG] BIMSERVER.Viewer: <message>````*
     *
     * @method log
     * @param {String} message The message to log
     */
    BIMSURFER.Viewer.log = function (message) {
        window.console.log("[LOG] BIMSERVER.Viewer: " + message);
    };

    /**
     * Logs an error for this View to the JavaScript console.
     *
     * The console message will have this format: *````[ERROR] BIMSERVER.Viewer: <message>````*
     *
     * @method error
     * @param {String} message The message to log
     */
    BIMSURFER.Viewer.error = function (message) {
        window.console.error("[ERROR] BIMSERVER.Viewer: " + message);
    };

    /**
     * Logs a warning for this View to the JavaScript console.
     *
     * The console message will have this format: *````[WARN] BIMSERVER.Viewer: <message>````*
     *
     * @method warn
     * @param {String} message The message to log
     */
    BIMSURFER.Viewer.warn = function (message) {
        window.console.warn("[WARN] BIMSERVER.Viewer: " + message);
    };

})();;(function () {

    "use strict";

    /**
     * Defines an object within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.Object = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Object",

        _init: function (cfg) {

            this._color = [1, 1, 1, 1];

            this._opacity = 1.0;

            var contentNode = this.viewer.scene.getNode("contentRoot");

            this._rootNode = contentNode.addNode();

            this._enableNode = this._rootNode.addNode({
                type: "enable"
            });

            this._flagsNode = this._enableNode.addNode({
                type: "flags"
            });

            this._materialNode = this._flagsNode.addNode({
                type: "material",
                specularColor: { r: 0, g: 0, b: 0 }
            });

            this._matrixNode = this._materialNode.addNode({
                type: "matrix"
            });

            this._nameNode = this._matrixNode.addNode({
                type: "name",
                name: this.id
            });

            this._geometryNodes = [];

            if (cfg.geometries) {

                // Use the given Geometry components

                var geometries = cfg.geometries;
                var geometry;

                for (var i = 0, len = geometries.length; i < len; i++) {

                    geometry = geometries[i];

                    if (BIMSURFER._isString(geometry)) {

                        // Geometry is the ID of a BIMSURFER.Geometry within the Viewer

                        geometry = this.viewer.components[geometry];

                        if (!geometry) {
                            this.error("geometry[" + i + "] not found in viewer");
                            continue;
                        }

                        if (geometry.className != "BIMSURFER.Geometry") {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                    } else {

                        // Geometry is an instance of a BIMSURFER.Geometry within the Viewer

                        if (geometry.className != "BIMSURFER.Geometry") {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                        if (geometry.viewer.id != this.viewer.id) {
                            this.error("geometry[" + i + "] is not within the same Viewer");
                            continue;
                        }
                    }

                    this._geometryNodes.push(
                        this._nameNode.addNode({
                            type: "geometry",
                            coreId: geometry.coreId
                        }));
                }

            } else {

                // Use the Viewer's default box-shaped  BIMSURFER.Geometry,
                // creating that first if needed

                var geometry = this.viewer.components["geometry.default"];

                if (!geometry) {
                    geometry = new BIMSURFER.Geometry(this.viewer, {
                        id: "geometry.default"
                    });
                }

                this._geometryNodes.push(
                    this._nameNode.addNode({
                        type: "geometry",
                        coreId: geometry.coreId
                    }));
            }

            this._initBoundary();

            if (cfg.ifcType) {

                var ifcType = cfg.ifcType;

                if (cfg.color) {

                    this.color = cfg.color;

                } else {

                    var color;

                    var materials = BIMSURFER.constants.materials;

                    if (!materials) {

                        this.warn("Property expected in BIMSURFER.constants: materials");

                    } else {

                        color = materials[ifcType];

                        if (!color) {

                            this.log("Material not found for ifcType: ", ifcType);

                            color = materials["DEFAULT"];
                        }

                        if (!color) {

                            this.log("Default material not found for ifcType: ", ifcType);
                        }
                    }

                    this.color = color || [ 0.8470588235, 0.427450980392, 0, 1.0];
                }

            } else {

                this.color = cfg.color;
            }

            this.transparent = cfg.transparent;

            this.opacity = cfg.opacity;

            this.xray = cfg.xray;

            this.highlight = cfg.highlight;

            this.matrix = cfg.matrix;
        },

        _initBoundary: function () {

            var i, len;

            // Initial inside-out boundary, ready to expand to fit geometry or sub-objects
            this._modelBoundary = {
                xmin: 1000000.0,
                ymin: 1000000.0,
                zmin: 1000000.0,
                xmax: -1000000.0,
                ymax: -1000000.0,
                zmax: -1000000.0
            };

            var geometry;
            for (i = 0, len = this._geometryNodes.length; i < len; i++) {
                geometry = this._geometryNodes[i];
                this._expandBoundaryByBoundary(this._modelBoundary, geometry.getBoundary());
            }

            this._modelCenter = [
                    (this._modelBoundary.xmax + this._modelBoundary.xmin) * 0.5,
                    (this._modelBoundary.ymax + this._modelBoundary.ymin) * 0.5,
                    (this._modelBoundary.zmax + this._modelBoundary.zmin) * 0.5
            ];

            this._modelBoundaryVerts = this._boundaryToVerts(this._modelBoundary);

            this._center = [0, 0, 0];
            this._boundary = null;
        },

        _expandBoundaryByBoundary: function (a, b) {
            if (a.xmin > b.xmin) {
                a.xmin = b.xmin;
            }
            if (a.ymin > b.ymin) {
                a.ymin = b.ymin;
            }
            if (a.zmin > b.zmin) {
                a.zmin = b.zmin;
            }
            if (a.xmax < b.xmax) {
                a.xmax = b.xmax;
            }
            if (a.ymax < b.ymax) {
                a.ymax = b.ymax;
            }
            if (a.zmax < b.zmax) {
                a.zmax = b.zmax;
            }
        },

        _boundaryToVerts: function (boundary) {
            return [
                [boundary.xmin, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymax, boundary.zmax],
                [boundary.xmin, boundary.ymax, boundary.zmax]
            ];
        },

        _vertsToBoundary: function (verts) {
            var xmin = 100000;
            var ymin = 100000;
            var zmin = 100000;
            var xmax = -100000;
            var ymax = -100000;
            var zmax = -100000;
            var x, y, z;
            for (var i = 0, len = verts.length; i < len; i++) {
                x = verts[i][0];
                y = verts[i][1];
                z = verts[i][2];
                if (x === undefined || x === null ||
                    y === undefined || y === null ||
                    z === undefined || z === null) {
                    continue;
                }
                if (x < xmin) {
                    xmin = x;
                }
                if (y < ymin) {
                    ymin = y;
                }
                if (z < zmin) {
                    zmin = z;
                }
                if (x > xmax) {
                    xmax = x;
                }
                if (y > ymax) {
                    ymax = y;
                }
                if (z > zmax) {
                    zmax = z;
                }
            }
            return { xmin: xmin, ymin: ymin, zmin: zmin, xmax: xmax, ymax: ymax, zmax: zmax };
        },

        _props: {

            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._enableNode.setEnabled(value);

                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            transparent: {

                set: function (value) {

                    value = !!value;

                    if (this._transparent === value) {
                        return;
                    }

                    this._transparent = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._transparent;
                }
            },

            highlight: {

                set: function (value) {

                    if (this._highlighted === value) {
                        return;
                    }

                    this._highlighted = value;

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._highlighted;
                }
            },

            xray: {

                set: function (value) {

                    value = !!value;

                    if (this._xray === value) {
                        return;
                    }

                    this._xray = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._xray;
                }
            },

            color: {

                set: function (value) {

                    if (!value) {

                        var materials = BIMSURFER.constants.materials;

                        if (materials) {
                            value = materials["DEFAULT"];
                        }
                    }

                    this._color = value || [ 0.8470588235, 0.427450980392, 0, 1.0];

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._color;
                }
            },

            opacity: {

                set: function (value) {

                    this._opacity = value !== null && value !== undefined ? value : 1.0;

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._opacity;
                }
            },

            matrix: {

                set: function (value) {

                    value = value || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

                    this._matrixNode.setElements(value);

                    this._boundary = null;

                    this.fire('matrix', this._matrix = value);
                },

                get: function () {
                    return this._matrix;
                }
            },

            boundary: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._boundary;
                }
            },

            center: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._center;
                }
            }
        },

        _destroy: function () {
            this._rootNode.destroy();
        }
    });

})();;(function () {

    "use strict";

    /**
     * Defines a viewpoint within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.BoxObject = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.BoxObject",

        _init: function (cfg) {

            /**
             * True when this camera is active.
             */
            this.active = false;

            var scene = this.viewer.scene;

            // The SceneJS content root
            this._contentNode = scene.getNode('contentRoot');

            this._boxNode = null;

            this._pos = cfg.pos || [0,0,0];

            if (cfg.active !== false) {
                this.activate();
            }
        },

        /**
         * Activates this camera
         */
        activate: function () {

            var self = this;

            if (this.active) {
                return this;
            }

            // Geometry node which defines our custom object, a simple cube.
            this._boxNode = this._contentNode.addNode({

                type: "material",
                color: {r: 0.4, g: 0.4, b: 0.8 },

                nodes: [
                    {
                        type: "translate",
                        x: this._pos[0],
                        y: this._pos[1],
                        z: this._pos[2],

                        nodes: [
                            {

                                type: "geometry",

                                primitive: "triangles",

                                positions: [
                                    5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, 5, // v0-v1-v2-v3 front
                                    5, 5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, // v0-v3-v4-v5 right
                                    5, 5, 5, 5, 5, -5, -5, 5, -5, -5, 5, 5, // v0-v5-v6-v1 top
                                    -5, 5, 5, -5, 5, -5, -5, -5, -5, -5, -5, 5, // v1-v6-v7-v2 left
                                    -5, -5, -5, 5, -5, -5, 5, -5, 5, -5, -5, 5, // v7-v4-v3-v2 bottom
                                    5, -5, -5, -5, -5, -5, -5, 5, -5, 5, 5, -5 // v4-v7-v6-v5 back
                                ],

                                normals: [
                                    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                                    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                                    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                                    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                                    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                                    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 // v4-v7-v6-v5 back
                                ],

                                uv: [
                                    5, 5, 0, 5, 0, 0, 5, 0, // v0-v1-v2-v3 front
                                    0, 5, 0, 0, 5, 0, 5, 5, // v0-v3-v4-v5 right
                                    5, 0, 5, 5, 0, 5, 0, 0, // v0-v5-v6-v1 top
                                    5, 5, 0, 5, 0, 0, 5, 0, // v1-v6-v7-v2 left
                                    0, 0, 5, 0, 5, 5, 0, 5, // v7-v4-v3-v2 bottom
                                    0, 0, 5, 0, 5, 5, 0, 5 // v4-v7-v6-v5 back
                                ],

                                indices: [
                                    0, 1, 2, 0, 2, 3, // back
                                    4, 5, 6, 4, 6, 7,  // front
                                    8, 9, 10, 8, 10, 11, // right
                                    12, 13, 14, 12, 14, 15, // top
                                    16, 17, 18, 16, 18, 19, // left
                                    20, 21, 22, 20, 22, 23 // bottom

                                ]
                            }
                        ]
                    }
                ]
            });

            this.fire('active', this.active = true);

            return this;
        },

        deactivate: function () {

            if (!this.active) {
                return this;
            }

            this._boxNode.destroy();

            this.fire('active', this.active = false);

            return this;
        },

        _destroy: function () {

            this.deactivate();
        }
    });
})();;(function () {

    "use strict";

    /**
     * Defines a viewpoint within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.Camera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Camera",

        _init: function (cfg) {

            // The SceneJS nodes that this Camera controls
            this._lookatNode = this.viewer.scene.getNode('theLookat');
            this._cameraNode = this.viewer.scene.getNode('theCamera');

            // Schedule update of view and projection transforms for next tick
            this._lookatNodeDirty = true;
            this._cameraNodeDirty = true;

            // Camera not at rest now
            this._rested = false;

            this._tickSub = null;

            this.eye = cfg.eye;
            this.look = cfg.look;
            this.up = cfg.up;
            this.aspect = cfg.aspect;
            this.fovy = cfg.fovy;
            this.near = cfg.near;
            this.far = cfg.far;
            this.screenPan = cfg.screenPan;

            this.active = cfg.active !== false;
        },

        /**
         * Rotate 'eye' about 'look', around the 'up' vector
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateEyeY: function (angle) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Rotate 'eye' vector about 'up' vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, [0,1,0]);
            eye2 = BIMSURFER.math.transformPoint3(mat, eye2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._eye = BIMSURFER.math.addVec3(eye2, this._look, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'eye' about 'look' around the X-axis
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateEyeX: function (angle) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Get orthogonal vector from 'eye' and 'up'
            var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(eye2, []), BIMSURFER.math.normalizeVec3(this._up, []));

            // Rotate 'eye' vector about orthogonal vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, left);
            eye2 = BIMSURFER.math.transformPoint3(mat, eye2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._eye = BIMSURFER.math.addVec3(eye2, this._look, []);

            // Rotate 'up' vector about orthogonal vector
            this._up = BIMSURFER.math.transformPoint3(mat, this._up, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'look' about 'eye', around the 'up' vector
         *
         * <p>Applies constraints added with {@link #addConstraint}.</p>
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateLookY: function (angle) {

            // Get 'look' -> 'eye' vector
            var look2 = BIMSURFER.math.subVec3(this._look, this._eye, []);

            // Rotate 'look' vector about 'up' vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, this._up);
            look2 = BIMSURFER.math.transformPoint3(mat, look2, []);

            // Set look position as 'look' plus 'eye' vector
            this._look = BIMSURFER.math.addVec3(look2, this._eye, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'eye' about 'look' around the X-axis
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateLookX: function (angle) {

            // Get 'look' -> 'eye' vector
            var look2 = BIMSURFER.math.subVec3(this._look, this._eye, []);

            // Get orthogonal vector from 'eye' and 'up'
            var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(look2, []), BIMSURFER.math.normalizeVec3(this._up, []));

            // Rotate 'look' vector about orthogonal vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, left);
            look2 = BIMSURFER.math.transformPoint3(mat, look2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._look = BIMSURFER.math.addVec3(look2, this._eye, []);

            // Rotate 'up' vector about orthogonal vector
            this._up = BIMSURFER.math.transformPoint3(mat, this._up, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Pans the camera along X and Y axis.
         * @param pan The pan vector
         */
        pan: function (pan) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Building this pan vector
            var vec = [0, 0, 0];
            var v;

            if (pan[0] !== 0) {

                // Pan along orthogonal vector to 'look' and 'up'

                var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(eye2, []), BIMSURFER.math.normalizeVec3(this._up, []));

                v = BIMSURFER.math.mulVec3Scalar(left, pan[0]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            if (pan[1] !== 0) {

                // Pan along 'up' vector

                v = BIMSURFER.math.mulVec3Scalar(BIMSURFER.math.normalizeVec3(this._up, []), pan[1]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            if (pan[3] !== 0) {

                // Pan along 'eye'- -> 'look' vector

                v = BIMSURFER.math.mulVec3Scalar(BIMSURFER.math.normalizeVec3(this._eye, []), pan[2]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            this._eye = BIMSURFER.math.addVec3(this._eye, vec, []);
            this._look = BIMSURFER.math.addVec3(this._look, vec, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Increments/decrements zoom factor, ie. distance between eye and look.
         * @param delta
         */
        zoom: function (delta) {

            var vec = BIMSURFER.math.subVec3(this._eye, this._look); // Get vector from eye to look
            var lenLook = Math.abs(BIMSURFER.math.lenVec3(vec));    // Get len of that vector
            var newLenLook = Math.abs(lenLook + delta);         // Get new len after zoom

            var dir = BIMSURFER.math.normalizeVec3(vec);  // Get normalised vector
            this._eye = BIMSURFER.math.addVec3(this._look, BIMSURFER.math.mulVec3Scalar(dir, newLenLook));

            this._lookatNodeDirty = true;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        this._lookatNodeDirty = true;
                        this._cameraNodeDirty = true;

                        var self = this;

                        this._tickSub = this.viewer.on("tick",
                            function () {

                                if (self._lookatNodeDirty) {

                                    // View transform update scheduled for scene graph

                                    self._lookatNode.setEye(BIMSURFER.math.vec3ArrayToObj(self._eye));
                                    self._lookatNode.setLook(BIMSURFER.math.vec3ArrayToObj(self._look));
                                    self._lookatNode.setUp(BIMSURFER.math.vec3ArrayToObj(self._up));

                                    // Camera not at rest now
                                    self._rested = false;

                                    // Scene camera position now up to date
                                    self._lookatNodeDirty = false;

                                } else {

                                    // Else camera position now at rest

                                    if (!self._rested) {
                                        self._rested = true;
                                    }
                                }

                                if (self._cameraNodeDirty) {

                                    // Projection update scheduled for scene graph

                                    // Update the scene graph

                                    self._cameraNode.set({
                                        optics: {
                                            type: "perspective",
                                            fovy: self.fovy,
                                            near: self.near,
                                            far: self.far,
                                            aspect: self.aspect
                                        }
                                    });

                                    // Scene projection now up to date
                                    self._cameraNodeDirty = false;
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._tickSub);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            },

            aspect: {

                set: function (value) {
                    this._aspect = value || 1.0;
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._aspect;
                }
            },

            eye: {

                set: function (value) {
                    this._eye = value || [ 0, 0, -10 ];
                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._eye;
                }
            },

            look: {

                set: function (value) {
                    this._look = value || [ 0, 0, 0 ];
                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._look;
                }
            },

            up: {

                set: function (value) {
                    this._up = value || [0, 1, 0];
                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._up;
                }
            },

            fovy: {

                set: function (value) {
                    this._fovy = value || 60;
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._fovy;
                }
            },

            near: {

                set: function (value) {
                    this._near = value || 0.1;
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._near;
                }
            },

            far: {

                set: function (value) {
                    this._far = value || 10000;
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._far;
                }
            },

            screenPan: {

                set: function (value) {
                    this._screenPan= value || [0,0];
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._screenPan;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }

    });

})();;/**

 **Light** is the base class for all light source classes in BIMViewer.

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Light
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Light configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Light.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Light = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Light",

        _init: function (cfg) {

            this._lightsManager = getLightsManager(this.viewer);

            this._lightsManager.createLight(this.id, cfg);
        },

        _activate: function () {
            this._lightsManager.activateLight(this.id);
        },

        _deactivate: function () {
            this._lightsManager.deactivateLight(this.id);
        },

        _update: function (params) {
            this._lightsManager.updateLight(this.id, params);
        },

        _destroy: function () {

            this._lightsManager.destroyLight(this.id);

            putLightsManager(this._lightsManager);
        }
    });

    function LightsManager(id, viewer) {

        this.id = id;
        this.viewer = viewer;
        this._lightsNode = null;
        this.lights = [];
        this.lightsMap = {};
        this.activeLights = {};
        this.useCount = 0;

        this.lightNodeDirty = true;
        this.lightsUpdate = null;

        var self = this;

        this.tickSub = viewer.on("tick",
            function () {

                if (self.lightNodeDirty) {

                    // Build list of lights params

                    var lights = [];
                    var i;
                    var activeLight;

                    for (var id in self.lightsMap) {
                        if (self.lightsMap.hasOwnProperty(id)) {

                            if (self.activeLights[id] === true) {

                                // Light is active, add to list
                                i = self.lightsMap[id];
                                activeLight = self.lights[i];
                                lights.push(activeLight);
                            }
                        }
                    }

                    // Update lights node

                    self._createLightsNode(lights);
                    self.lightNodeDirty = false;
                }

                if (self.lightsUpdate && self._lightsNode) {
                    self._lightsNode.setLights(self.lightsUpdate);
                    self.lightsUpdate = null;
                }
            });
    }

    LightsManager.prototype._createLightsNode = function (lights) {

        this._destroyLightsNode();

        // Insert lights node above scene graph content root

        var contentRootNode = this.viewer.scene.getNode("contentRoot");

        var parent = contentRootNode.parent;

        var children = parent.disconnectNodes();

        this._lightsNode = parent.addNode({
            type: "lights",
            lights: lights
        });

        this._lightsNode.addNodes(children);
    };

    //
    LightsManager.prototype._destroyLightsNode = function () {

        if (!this._lightsNode) {
            return;
        }

        // Extract lights node from scene graph,
        // moving its children up to its parent

        this._lightsNode.splice();
        this._lightsNode.destroy();
        this._lightsNode = null;
    };

    LightsManager.prototype.createLight = function (lightId, params) {
        this.lights.push(params);
        this.lightsMap[lightId] = this.lights.length - 1;
        this.activeLights[lightId] = params.active !== false;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.activateLight = function (lightId) {
        this.activeLights[lightId] = true;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.deactivateLight = function (lightId) {
        this.activeLights[lightId] = false;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.updateLight = function (lightId, params) {
        if (!this.lightsUpdate) {
            this.lightsUpdate = {};
        }
        var idx = this.lightsMap[lightId];
        var light = this.lightsUpdate[idx] || (this.lightsUpdate[idx] = {});
        BIMSURFER._apply(params, light);
    };

    LightsManager.prototype.destroyLight = function (lightId) {

        var i = this.lightsMap[lightId];

        // Delete light
        this.lights.splice(i, 1);
        delete this.lightsMap[lightId];
        delete this.activeLights[lightId];
        delete this.lightsUpdate[lightId];

        // Adjust indices in lights map
        for (var id in this.lightsMap) {
            if (this.lightsMap.hasOwnProperty(id)) {
                if (this.lightsMap[id] >= i) {
                    this.lightsMap[id]--;
                }
            }
        }

        this.lightNodeDirty = true;
    };

    LightsManager.prototype.destroy = function () {
        this.viewer.off(this.tickSub);
        this._destroyLightsNode();
    };


    // A LightsManager for each Viewer,
    // created on-demand by BIMSURFER.Lights components
    var managers = {};


    // Gets a LightsManager for the given Viewer
    // reuses any instance already created for that Viewer
    function getLightsManager(viewer) {
        var id = viewer.id;
        var manager = managers[id];
        if (!manager) {
            manager = new LightsManager(id, viewer);
            managers[id] = manager;
        }
        manager.useCount++;
        return manager;
    }

    // Releases a LightsManager to the pool, destroying it if
    // there are no more references to it
    function putLightsManager(manager) {
        if (--manager.useCount <= 0) {
            delete managers[manager.id];
            manager.destroy();
        }
    }
})();
;/**
 A **AmbientLight** defines a directional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>AmbientLights have a position, but no direction.</li>

 <li>AmbientLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>Within bIMSurfer's's Phong lighting calculations, AmbientLight {{#crossLink "AmbientLight/diffuse:property"}}{{/crossLink}} and
 {{#crossLink "AmbientLight/specular:property"}}{{/crossLink}}.</li>

 <li>AmbientLights have {{#crossLink "AmbientLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "AmbientLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "AmbientLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>


 </ul>


 ## Example


 ```` javascript
 TODO
 ````

 As with all components, we can <a href="BIMSURFER.Component.html#changeEvents" class="crosslink">observe and change properties</a> on AmbientLights like so:

 ````Javascript
 var handle = ambientLight.on("diffuse", // Attach a change listener to a property
 function(value) {
        // Property value has changed
    });

 ambientLight.diffuse = [0.4, 0.6, 0.4]; // Fires the change listener

 ambientLight.off(handle); // Detach the change listener
 ````

 @class AmbientLight
 @module BIMSURFER
 @constructor
 @extends Component
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The AmbientLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this AmbientLight.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this AmbientLight.
 */
(function () {

    "use strict";

    BIMSURFER.AmbientLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.AmbientLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "ambient" }, cfg));

            this.color = cfg.color;
        },

        _props: {
            
            /**
             The color of this AmbientLight.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {
                    this._color = value;
                    this._update({
                        color: { r: value[0], g: value[1], b: value[2] }
                    });
                },

                get: function () {
                    return this._color;
                }
            },
        }
    });

})();
;/**
 A **PointLight** defines a positional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>PointLights have a position, but no direction.</li>

 <li>PointLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>Within bIMSurfer's's Phong lighting calculations, PointLight {{#crossLink "PointLight/diffuse:property"}}{{/crossLink}} and
 {{#crossLink "PointLight/specular:property"}}{{/crossLink}}.</li>

 <li>PointLights have {{#crossLink "PointLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "PointLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "PointLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>


 </ul>


 ## Example


 ```` javascript
 TODO
 ````

 As with all components, we can <a href="BIMSURFER.Component.html#changeEvents" class="crosslink">observe and change properties</a> on PointLights like so:

 ````Javascript
 var handle = pointLight.on("diffuse", // Attach a change listener to a property
 function(value) {
        // Property value has changed
    });

 pointLight.diffuse = [0.4, 0.6, 0.4]; // Fires the change listener

 pointLight.off(handle); // Detach the change listener
 ````

 @class PointLight
 @module BIMSURFER
 @constructor
 @extends Component
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The PointLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this PointLight.
 @param [cfg.pos=[ 1.0, 1.0, 1.0 ]] {Array(Number)} Position, in either World or View space, depending on the value of the **space** parameter.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this PointLight.
 @param [cfg.constantAttenuation=0] {Number} Constant attenuation factor.
 @param [cfg.linearAttenuation=0] {Number} Linear attenuation factor.
 @param [cfg.quadraticAttenuation=0] {Number} Quadratic attenuation factor.
 @param [cfg.space="view"] {String} The coordinate system this PointLight is defined in - "view" or "space".
 */
(function () {

    "use strict";

    BIMSURFER.PointLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.PointLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "point" }, cfg));

            this.pos = cfg.pos;
            this.color = cfg.color;
            this.constantAttenuation = cfg.constantAttenuation;
            this.linearAttenuation = cfg.linearAttenuation;
            this.quadraticAttenuation = cfg.quadraticAttenuation;
            this.space = cfg.space;
        },

        _props: {

            /**
             The position of this PointLight.

             This will be either World- or View-space, depending on the value of {{#crossLink "PointLight/space:property"}}{{/crossLink}}.

             @property pos
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            pos: {

                set: function (value) {
                    this._pos = value;
                    this._update({
                        pos: { x: value[0], y: value[1], z: value[2] }
                    });
                },

                get: function () {
                    return this._pos;
                }
            },

            /**
             The color of this PointLight.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {
                    this._color = value;
                    this._update({
                        color: { r: value[0], g: value[1], b: value[2] }
                    });
                },

                get: function () {
                    return this._color;
                }
            },

            /**
             The constant attenuation factor for this PointLight.

             @property constantAttenuation
             @default 0
             @type Number
             */
            constantAttenuation: {

                set: function (value) {
                    this._update({
                        constantAttenuation: this._constantAttenuation = value
                    });
                },

                get: function () {
                    return this._constantAttenuation;
                }
            },

            /**
             The linear attenuation factor for this PointLight.

             @property linearAttenuation
             @default 0
             @type Number
             */
            linearAttenuation: {

                set: function (value) {
                    this._update({
                        linearAttenuation: this._linearAttenuation = value
                    });
                },

                get: function () {
                    return this._linearAttenuation;
                }
            },

            /**
             The quadratic attenuation factor for this Pointlight.

             @property quadraticAttenuation
             @default 0
             @type Number
             */
            quadraticAttenuation: {

                set: function (value) {
                    this._update({
                        quadraticAttenuation: this._quadraticAttenuation = value
                    });
                },

                get: function () {
                    return this._quadraticAttenuation;
                }
            },

            /**
             Indicates which coordinate space this PointLight is in.

             Supported values are:

             <ul>
             <li>"view" - View space, aligned within the view volume as if fixed to the viewer's head</li>
             <li>"world" - World space, fixed within the world, moving within the view volume with respect to camera</li>
             </ul>

             @property space
             @default "view"
             @type String
             */
            space: {

                set: function (value) {
                    this._update({
                        space: this._space = value
                    });
                },

                get: function () {
                    return this._space;
                }
            }
        }
    });

})();
;/**
 A **DirLight** defines a directional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>DirLights have a position, but no direction.</li>

 <li>DirLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>Within bIMSurfer's's Phong lighting calculations, DirLight {{#crossLink "DirLight/diffuse:property"}}{{/crossLink}} and
 {{#crossLink "DirLight/specular:property"}}{{/crossLink}}.</li>

 <li>DirLights have {{#crossLink "DirLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "DirLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "DirLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>


 </ul>


 ## Example


 ```` javascript
 TODO
 ````

 As with all components, we can <a href="BIMSURFER.Component.html#changeEvents" class="crosslink">observe and change properties</a> on DirLights like so:

 ````Javascript
 var handle = dirLight.on("diffuse", // Attach a change listener to a property
 function(value) {
        // Property value has changed
    });

 dirLight.diffuse = [0.4, 0.6, 0.4]; // Fires the change listener

 dirLight.off(handle); // Detach the change listener
 ````

 @class DirLight
 @module BIMSURFER
 @constructor
 @extends Component
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The DirLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DirLight.
 @param [cfg.dir=[ 1.0, 1.0, 1.0 ]] {Array(Number)} Direction, in either World or View space, depending on the value of the **space** parameter.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this DirLight.
 @param [cfg.space="view"] {String} The coordinate system this DirLight is defined in - "view" or "space".
 */
(function () {

    "use strict";

    BIMSURFER.DirLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.DirLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "dir" }, cfg));

            this.dir = cfg.dir;
            this.color = cfg.color;
            this.space = cfg.space;
        },

        _props: {

            /**
             The direction of this DirLight.

             This will be either World- or View-space, depending on the value of {{#crossLink "DirLight/space:property"}}{{/crossLink}}.

             @property dir
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            dir: {

                set: function (value) {
                    this._dir = value;
                    this._update({
                        dir: { x: value[0], y: value[1], z: value[2] }
                    });
                },

                get: function () {
                    return this._dir;
                }
            },

            /**
             The color of this DirLight.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {
                    this._color = value;
                    this._update({
                        color: { r: value[0], g: value[1], b: value[2] }
                    });
                },

                get: function () {
                    return this._color;
                }
            },

            /**
             Indicates which coordinate space this DirLight is in.

             Supported values are:

             <ul>
             <li>"view" - View space, aligned within the view volume as if fixed to the viewer's head</li>
             <li>"world" - World space, fixed within the world, moving within the view volume with respect to camera</li>
             </ul>

             @property space
             @default "view"
             @type String
             */
            space: {

                set: function (value) {
                    this._update({
                        space: this._space = value
                    });
                },

                get: function () {
                    return this._space;
                }
            }
        }
    });

})();
;(function () {

    "use strict";

    /**
     * Defines a geometry within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.Geometry = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Geometry",

        _init: function (cfg) {

            var libraryNode = this.viewer.scene.getNode("library");

            if (cfg.positions && cfg.indices) {

                this._geometryNode = libraryNode.addNode({
                    type: "geometry",
                    primitive: cfg.primitive || "triangles",
                    positions: cfg.positions,
                    normals: cfg.normals,
                    uv: cfg.uv,
                    indices: cfg.indices
                });
            } else {

                // Default box geometry

                this._geometryNode = libraryNode.addNode({

                    type: "geometry",

                    primitive: "triangles",

                    positions: [
                        5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, 5, // v0-v1-v2-v3 front
                        5, 5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, // v0-v3-v4-v5 right
                        5, 5, 5, 5, 5, -5, -5, 5, -5, -5, 5, 5, // v0-v5-v6-v1 top
                        -5, 5, 5, -5, 5, -5, -5, -5, -5, -5, -5, 5, // v1-v6-v7-v2 left
                        -5, -5, -5, 5, -5, -5, 5, -5, 5, -5, -5, 5, // v7-v4-v3-v2 bottom
                        5, -5, -5, -5, -5, -5, -5, 5, -5, 5, 5, -5 // v4-v7-v6-v5 back
                    ],

                    normals: [
                        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 // v4-v7-v6-v5 back
                    ],

                    uv: [
                        5, 5, 0, 5, 0, 0, 5, 0, // v0-v1-v2-v3 front
                        0, 5, 0, 0, 5, 0, 5, 5, // v0-v3-v4-v5 right
                        5, 0, 5, 5, 0, 5, 0, 0, // v0-v5-v6-v1 top
                        5, 5, 0, 5, 0, 0, 5, 0, // v1-v6-v7-v2 left
                        0, 0, 5, 0, 5, 5, 0, 5, // v7-v4-v3-v2 bottom
                        0, 0, 5, 0, 5, 5, 0, 5 // v4-v7-v6-v5 back
                    ],

                    indices: [
                        0, 1, 2, 0, 2, 3, // back
                        4, 5, 6, 4, 6, 7,  // front
                        8, 9, 10, 8, 10, 11, // right
                        12, 13, 14, 12, 14, 15, // top
                        16, 17, 18, 16, 18, 19, // left
                        20, 21, 22, 20, 22, 23 // bottom

                    ]
                });
            }

            this.coreId = this._geometryNode.getCoreId();

            this.boundary = this._geometryNode.getBoundary();
        },

        _destroy: function () {
            this._geometryNode.destroy();
        }
    });

})();;(function () {

    "use strict";

    /**
     * A selection of {@link BIMSURFER.Object}s within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.Selection = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Selection",

        _init: function (cfg) {

            var self = this;

            this.objects = {};

            // Subscribe to each Object's transform matrix
            // so we can mark selection boundary dirty
            this._onObjectMatrix = {};

            this.numObjects = 0;

            this._boundary = {xmin: 0.0, ymin: 0.0, zmin: 0.0, xmax: 0.0, ymax: 0.0, zmax: 0.0 };
            this._center = [0, 0, 0];

            this._boundaryDirty = true;

            this._onComponentDestroyed = this.viewer.on("componentDestroyed",
                function (component) {

                    if (self.objects[component.id]) {

                        delete self.objects[component.id];

                        self._boundaryDirty = true;

                        self.fire("updated", {
                            removed: {
                                objectIds: [component.id]
                            }
                        });
                    }
                });

            if (cfg.objects) {
                this.addObjects(cfg.objects);
            }

            if (cfg.objectIds) {
                this.addObjectIds(cfg.objectIds);
            }

            if (cfg.types) {
                this.addTypes(cfg.types);
            }
        },

        clear: function () {
            for (var objectId in this.objects) {
                if (this.objects.hasOwnProperty(objectId)) {
                    this._removeObject(this.objects[objectId]);
                }
            }

            this.fire("updated", {
                cleared: true
            });
        },

        addObjects: function (objects) {

            for (var i = 0, len = objects.length; i < len; i++) {
                this._addObject(objects[i]);
            }

            this.fire("updated", {
                added: {
                    objects: objects
                }
            });
        },

        _addObject: function (object) {

            var objectId = object.id;

            // Ensure Object is in same Viewer as this Selection
            if (object.viewer != this.viewer) {
                this.warn("Attempted to add object that's not in same BIMSURFER.Viewer: '" + objectId + "'");
                return;
            }

            // Subscribe to each Object's transform matrix
            // so we can mark selection boundary dirty
            this._onObjectMatrix[objectId] = object.on("matrix",
                function () {
                    self._boundaryDirty = true;
                });

            this.objects[objectId] = object;
            this.numObjects++;

            this._boundaryDirty = true;
        },

        _removeObject: function (object) {

            var objectId = object.id;

            if (object.viewer != this.viewer) {
                this.warn("Attempted to remove object that's not in same BIMSURFER.Viewer: '" + objectId + "'");
                return;
            }

            object.off(this._onObjectMatrix[objectId]);

            delete this.objects[objectId];
            this.numObjects--;

            this._boundaryDirty = true;
        },

        removeObjects: function (objects) {

            for (var i = 0, len = objects.length; i < len; i++) {
                this._removeObject(objects[i]);
            }

            this.fire("updated", {
                removed: {
                    objects: objects
                }
            });
        },

        addObjectIds: function (objectIds) {

            var objectId;
            var object;

            for (var i = 0, len = objectIds.length; i < len; i++) {

                objectId = objectIds[i];
                object = this.viewer.components[objectId];

                if (!object) {
                    this.warn("addObjectIds - object not found: '" + objectId + "'");
                    continue;
                }

                this._addObject(object);
            }

            this.fire("updated", {
                added: {
                    objectIds: objectIds
                }
            });
        },

        removeObjectIds: function (objectIds) {

            var objectId;
            var object;

            for (var i = 0, len = objectIds.length; i < len; i++) {

                objectId = objectIds[i];
                object = this.viewer.components[objectId];

                if (!object) {
                    this.warn("removeObjectIds - object not found: '" + objectId + "'");
                    continue;
                }

                this._removeObject(object);
            }

            this.fire("updated", {
                removed: {
                    objectIds: objectIds
                }
            });
        },

        addTypes: function (types) {

            var type;
            var t;
            var objectId;
            var object;

            for (var i = 0, len = types.length; i < len; i++) {

                type = types[i];
                t = this.viewer.types[type];

                if (!t) {
                    this.warn("addTypes - type not found: '" + t + "'");
                    continue;
                }

                for (objectId in t) {
                    if (t.hasOwnProperty(objectId)) {
                        this._addObject(t[objectId]);
                    }
                }
            }

            this.fire("updated", {
                added: {
                    types: types
                }
            });
        },

        removeTypes: function (types) {

            var type;
            var t;
            var objectId;

            for (var i = 0, len = types.length; i < len; i++) {

                type = types[i];
                t = this.viewer.types[type];

                if (!t) {
                    this.warn("removeTypes - type not found: '" + type + "'");
                    continue;
                }

                for (objectId in t) {
                    if (t.hasOwnProperty(objectId)) {
                        this._removeObject(this.objects[objectId]);
                    }
                }
            }

            this.fire("updated", {
                removed: {
                    types: types
                }
            });
        },

        /**
         * Iterates with a callback over the objects in this selection
         *
         * @param {String} typeNames List of type names
         * @param {Function} callback Callback called for each Component of the given types
         */
        withObjects: function (callback) {
            for (var objectId in this.objects) {
                if (this.objects.hasOwnProperty(objectId)) {
                    callback(this.objects[objectId]);
                }
            }
        },

        _rebuildBoundary: function () {

            if (!this._boundaryDirty) {
                return;
            }

            // For an empty selection, boundary is zero volume and centered at the origin

            if (this.numObjects === 0) {
                this._boundary.xmin = 0.0;
                this._boundary.ymin = 0.0;
                this._boundary.zmin = 0.0;
                this._boundary.xmax = 0.0;
                this._boundary.ymax = 0.0;
                this._boundary.zmax = 0.0;

            } else {

                // Set boundary inside-out, ready to expand by each selected object

                this._boundary.xmin = 1000000.0;
                this._boundary.ymin = 1000000.0;
                this._boundary.zmin = 1000000.0;
                this._boundary.xmax = -1000000.0;
                this._boundary.ymax = -1000000.0;
                this._boundary.zmax = -1000000.0;

                var object;
                var boundary;

                for (var objectId in this.objects) {
                    if (this.objects.hasOwnProperty(objectId)) {

                        object = this.objects[objectId];

                        boundary = object.boundary;

                        if (boundary.xmin < this._boundary.xmin) {
                            this._boundary.xmin = boundary.xmin;
                        }
                        if (boundary.ymin < this._boundary.ymin) {
                            this._boundary.ymin = boundary.ymin;
                        }
                        if (boundary.zmin < this._boundary.zmin) {
                            this._boundary.zmin = boundary.zmin;
                        }
                        if (boundary.xmax > this._boundary.xmax) {
                            this._boundary.xmax = boundary.xmax;
                        }
                        if (boundary.ymax > this._boundary.ymax) {
                            this._boundary.ymax = boundary.ymax;
                        }
                        if (boundary.zmax > this._boundary.zmax) {
                            this._boundary.zmax = boundary.zmax;
                        }
                    }
                }
            }

            this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
            this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
            this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;

            this._boundaryDirty = false;
        },

        _props: {

            boundary: {

                get: function () {

                    if (this._boundaryDirty) {

                        this._rebuildBoundary();

                        return this._boundary;
                    }
                }
            },

            center: {

                get: function () {

                    if (this._boundaryDirty) {

                        this._rebuildBoundary();

                        return this._center;
                    }
                }
            }
        },

        _destroy: function () {

            this.clear();

            this.viewer.off(this._onComponentDestroyed);

            this.active = false;
        }
    });

})();;(function () {

    "use strict";

    /**
     * Applies an effect to the {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.Effect = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Effect",

        _init: function (cfg) {

            this.selection = cfg.selection || new BIMSURFER.Selection(this.viewer);

            this._dirty = true;

            var self = this;

            this._onSelectionUpdated = this.selection.on("updated",
                function () {
                    self._dirty = true;
                });

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        var self = this;

                        this._tickSub = this.viewer.on("tick",
                            function () {

                                if (self._dirty) {

                                    if (self._apply) {

                                        // Apply effect to Objects in the Viewer
                                        self.viewer.withClasses(["BIMSURFER.Object"],
                                            function (object) {
                                                self._apply.call(self, object);
                                            });
                                    }

                                    self._dirty = false;
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._tickSub);

                        this.fire('active', this._active = false);
                    }

                    this._dirty = true;
                },

                get: function () {
                    return this._active;
                }
            },

            invert: {

                set: function (value) {

                    if (this._invert === value) {
                        return;
                    }

                    self._dirty = false;

                    this.fire('invert', this._invert = true);
                },

                get: function () {
                    return this._invert;
                }
            }
        },

        _destroy: function () {

            this.selection.off(this._onSelectionUpdated);

            this.active = false;
        }

    });

})();;(function () {

    "use strict";

    /**
     * Applies a highlight effect to the {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.HighlightEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.HighlightEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.highlight = this.invert ? !selected : !!selected;
        }
    });

})();;(function () {

    "use strict";

    /**
     * Sets the selected {@link BIMSURFER.Object}s in a  {@link BIMSURFER.Selection} as visible.
     */
    BIMSURFER.IsolateEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.IsolateEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.active = this.invert ? !selected : !!selected;
        }
    });

})();;(function () {

    "use strict";

    /**
     * Applies an X-Ray effect to the {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.XRayEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.XRayEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.xray = this.invert ? !!selected : !selected;
        }
    });

})();;/**

 **Orbit** orbits a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Orbit
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Orbit configuration

 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Orbit.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MouseOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var sensitivity = 0.20;
                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                if (xDelta != 0 || yDelta != 0) {

                                    self._camera.rotateEyeY(-xDelta);
                                    self._camera.rotateEyeX(yDelta);

                                    xDelta = 0;
                                    yDelta = 0;
                                }
                            });

                        this._onMouseDown = input.on("mousedown",
                            function (e) {
                                down = true;
                                lastX = e[0];
                                lastY = e[1];
                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {
                                down = false;
                            });

                        this._onMouseMove = input.on("mousemove",
                            function (e) {
                                if (down) {
                                    xDelta += (e[0] - lastX) * sensitivity;
                                    yDelta += (e[1] - lastY) * sensitivity;
                                    lastX = e[0];
                                    lastY = e[1];
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        input.off(this._onTick);

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                        input.off(this._onMouseMove);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                    this._cameraDirty = true;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**

 **Orbit** orbits a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Orbit
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Orbit configuration

 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Orbit.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                var yawRate = 50;
                                var pitchRate = 50;

                                if (!input.ctrlDown && !input.altDown) {

                                    var left = input.keyDown[input.KEY_LEFT_ARROW];
                                    var right = input.keyDown[input.KEY_RIGHT_ARROW];
                                    var up = input.keyDown[input.KEY_UP_ARROW];
                                    var down = input.keyDown[input.KEY_DOWN_ARROW];

                                    if (left || right || up || down) {

                                        var yaw = 0;
                                        var pitch = 0;

                                        if (right) {
                                            yaw = -elapsed * yawRate;

                                        } else if (left) {
                                            yaw = (elapsed * yawRate);
                                        }

                                        if (down) {
                                            pitch = -(elapsed * pitchRate);

                                        } else if (up) {
                                            pitch = (elapsed * pitchRate);
                                        }

                                        if (Math.abs(yaw) > Math.abs(pitch)) {
                                            pitch = null;
                                        } else {
                                            yaw = null;
                                        }

                                        self._camera.rotateEyeY(yaw);
                                        self._camera.rotateEyeX(pitch);
                                    }
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onTick);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**

 **Zooms** orbits a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Zoom
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Zoom configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Zoom.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraZoomControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraZoomControl",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;
            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var delta = 0;
                        var target = 0;
                        var newTarget = false;
                        var targeting = false;
                        var progress = 0;
                        var sensitivity = 0.2;
                        var eyeVec = BIMSURFER.math.vec3();
                        var lookVec = BIMSURFER.math.vec3();
                        var tempVec3 = BIMSURFER.math.vec3();

                        var self = this;

                        this._onMouseWheel = this.viewer.input.on("mousewheel",
                            function (_delta) {

//                                var d = params.d * 0.01;
//
//                                delta = -d;

                                delta = _delta;

                                if (delta === 0) {
                                    targeting = false;
                                    newTarget = false;
                                } else {
                                    newTarget = true;
                                }
                            });

                        this._onTick = this.viewer.on("tick",
                            function () {

                                if (!self._camera) {
                                    return;
                                }

                                var camera = self._camera;

                                var eye = camera.eye;
                                var look = camera.look;

                                eyeVec[0] = eye[0];
                                eyeVec[1] = eye[1];
                                eyeVec[2] = eye[2];

                                lookVec[0] = look[0];
                                lookVec[1] = look[1];
                                lookVec[2] = look[2];

                                BIMSURFER.math.subVec3(eyeVec, lookVec, tempVec3);

                                var lenLook = Math.abs(BIMSURFER.math.lenVec3(tempVec3));
                                var lenLimits = 1000;
                                var f = sensitivity * (2.0 + (lenLook / lenLimits));

                                if (newTarget) {
                                    target = delta * f;
                                    progress = 0;
                                    newTarget = false;
                                    targeting = true;
                                }

                                if (targeting) {
                                    if (delta > 0) {
                                        progress += 0.2 * f;
                                        if (progress > target) {
                                            targeting = false;
                                        }
                                    } else if (delta < 0) {
                                        progress -= 0.2 * f;
                                        if (progress < target) {
                                            targeting = false;
                                        }
                                    }
                                    if (targeting) {
                                        camera.zoom(progress);
                                    }
                                }
                            });


                        this.fire('active', this._active = true);

                    } else {

                        input.off(this._onTick);
                        input.off(this._onMouseWheel);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                    this._cameraDirty = true;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;(function () {

    "use strict";

    /**
     * Selects {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.PickSelectionControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.PickSelectionControl",

        _init: function (cfg) {

            this.selection = cfg.selection || new BIMSURFER.Selection(this.viewer);

            this._multi = false;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        var self = this;

                        this._onPicked = this.viewer.on("picked",
                            function (params) {

                                //var multiSelect =

                                var object = params.object;

                                if (!self.selection.objects[object.id]) {

                                    // Select

                                    if (!self._multi) {
                                        self.selection.clear();
                                    }

                                    self.selection.addObjects([object]);

                                } else {

                                    // Deselect

                                    self.selection.removeObjects([object]);
                                }
                            });

                        this._onNothingPicked = this.viewer.on("nothingPicked",
                            function () {

                                if (!self._multi) {
                                    self.selection.clear();
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onPicked);
                        this.viewer.off(this._onNothingPicked);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });
})();;/**

 **KeyboardPanCamera** pans a {{#crossLink "Camera"}}{{/crossLink}} with the keyboard.

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Orbit
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Orbit configuration

 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardPanCamera.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardPanCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardPanCamera",

        _init: function (cfg) {

            this.sensitivity = cfg.sensitivity || 10;

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                if (!input.ctrlDown && !input.altDown) {

                                    var w = input.keyDown[input.KEY_W];
                                    var s = input.keyDown[input.KEY_S];
                                    var a = input.keyDown[input.KEY_A];
                                    var d = input.keyDown[input.KEY_D];

                                    if (w || s || a || d) {

                                        var x = 0;
                                        var y = 0;
                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (s) {
                                            y = elapsed * sensitivity;

                                        } else if (w) {
                                            y = -elapsed * sensitivity;
                                        }

                                        if (d) {
                                            x = elapsed * sensitivity;

                                        } else if (a) {
                                            x = -elapsed * sensitivity;
                                        }

                                        self._camera.pan([x, y, z]);
                                    }
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onTick);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
