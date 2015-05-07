/**
 A **DirLight** is a {{#crossLink "Light"}}{{/crossLink}} that defines a directional light source that originates from a single point and spreads outward in all directions.

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

 <iframe style="width: 600px; height: 400px" src="../../examples/light_DirLight.html"></iframe>

 ```` javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer(null, "myDiv", {}, false);

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
      eye: [5, 5, -5]
 });

 // Create a camera orbit control
 var control = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a TeapotObject
 var teapot = new BIMSURFER.TeapotObject(viewer);

 // Create a DirLight
 var dirLight = new BIMSURFER.DirLight(viewer, {
        color: [0.9, 0.9, 0.9],
        dir: [1.0, 0.0, -.5],
        space: "view"
    });
 ````

 @class DirLight
 @module BIMSURFER
 @constructor
 @extends Light
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
