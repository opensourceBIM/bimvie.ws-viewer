/**
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
