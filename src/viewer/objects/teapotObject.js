/**
 An **TeapotObject** is a teapot-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/object_TeapotObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a TeapotObject
 new BIMSURFER.TeapotObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.scaleMat4v([ 1.5, 1.5, 1.5 ])
 });

 ````

 @class TeapotObject
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxObject.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.TeapotObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.TeapotObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.TeapotGeometry(this.viewer)
                ]
            }, cfg));
        },

        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();