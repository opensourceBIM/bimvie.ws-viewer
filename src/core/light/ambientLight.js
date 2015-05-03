/**

 An **AmbientLight** defines an ambient light source of fixed intensity and color that affects all attached {{#crossLink "Object"}}Objects{{/crossLink}}
 equally.

 ## Overview

TODO

 ## Example

 TODO

 ```` javascript

 ````

 @class AmbientLight
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, creates this AmbientLight within the
 default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted
 @param [cfg] {*} AmbientLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this AmbientLight.
 @param [cfg.ambient=[0.7, 0.7, 0.8]] {Array(Number)} The color of this AmbientLight.
 @extends Light
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
            }
        }
    });

})();
