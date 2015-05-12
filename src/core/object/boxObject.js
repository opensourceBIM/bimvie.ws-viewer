/**
 An **BoxObject** is a box-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/object_BoxObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
     eye: [20, 20, -20]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a BoxObject
 new BIMSURFER.BoxObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.scaleMat4v([1.5, 1.5, 1.5])
 });

 ````

 @class BoxObject
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:BoxObject} Optional map of user-defined metadata to attach to this BoxObject.
 @param [cfg.type] {String} The IFC type of this BoxObject.
 @param [cfg.color] {Array of Number} The color of this BoxObject, defaults to the color of the specified IFC type.
 @param [cfg.geometries] {Array of Geometry} The {{#crossLink "Geometry"}}{{/crossLink}} to render for this BoxObject.
 @param [cfg.clipping=true] {Boolean} Whether this BoxObject is clipped by {{#crossLink "Clips"}}{{/crossLink}}.
 @param [cfg.transparent=false] {Boolean} Whether this BoxObject is transparent or not.
 @param [cfg.opacity=1] {Number} Scalar in range 0-1 that controls opacity, where 0 is completely transparent and 1 is completely opaque.
 Only applies while this BoxObject's {{#crossLink "BoxObject/transparent:property"}}transparent{{/crossLink}} equals ````true````.
 @param [cfg.highlight=false] {Boolean} Whether this BoxObject is highlighted or not.
 @param [cfg.xray=false] {Boolean} Whether this BoxObject is highlighted or not.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.BoxObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.BoxObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.BoxGeometry(this.viewer)
                ]
            }, cfg));
        },

        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();