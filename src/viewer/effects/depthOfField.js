/**

 An **DepthOfField** is a {{#crossLink "Light"}}{{/crossLink}} that defines an ambient light source of fixed intensity and color that affects all attached {{#crossLink "Object"}}Objects{{/crossLink}}
 equally.

 ## Overview

 <ul>
 <li>You only need one DepthOfField in your {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Normally you would combine DepthOfFields with {{#crossLink "DirLight"}}DirLights{{/crossLink}} and/or
 {{#crossLink "PointLight"}}PointLights{{/crossLink}}.</li>
 </ul>

 ## Example

 In the example below we're illuminating a {{#crossLink "TeapotObject"}}{{/crossLink}} with a single DepthOfField.

 <iframe style="width: 600px; height: 400px" src="../../examples/light_DepthOfField.html"></iframe>

 ```` javascript
// Create a Viewer
var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

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

// Create an DepthOfField
var DepthOfField = new BIMSURFER.DepthOfField(viewer, {
     color: [0.4, 0.4, 0.4]
});
 ````

 @class DepthOfField
 @module BIMSURFER
 @submodule effects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, creates this DepthOfField within the
 default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted
 @param [cfg] {*} DepthOfField configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DepthOfField.
 @param [cfg.ambient=[0.7, 0.7, 0.8]] {Array(Number)} The color of this DepthOfField.
 @extends Light
 */
(function () {

    "use strict";

    BIMSURFER.DepthOfField = BIMSURFER.Light.extend({

        className: "BIMSURFER.DepthOfField",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "ambient" }, cfg));

            this.color = cfg.color;
        },

        _props: {
            
            /**
             TODO

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
