/**
 An **XRayEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that creates an X-ray view of the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 X-ray objects that match given IFC types, using an {{#crossLink "ObjectSet"}}{{/crossLink}} and an XRayEffect:

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer(null, "myDiv", {}, false);

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create some BoxObjects

 new BIMSURFER.BoxObject(viewer, {
    objectId: "foo",
    ifcType: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, -4])
 });

 new BIMSURFER.BoxObject(viewer, {
    objectId: "bar",
    ifcType: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([4, 0, -4])
 });

 new BIMSURFER.Object(viewer, {
    objectId: "baz",
    ifcType: "IfcBeam",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, 4])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply an X-Ray effect to the ObjectSet
 var xrayEffect = new BIMSURFER.XRayEffect(viewer, {
    objectSet: objectSet
 });

 // Add Objects to the ObjectSet by IFC type
 // These Objects become opaque
 objectSet.addObjectTypes(["IfcWall", "IfcBeam"]);

 // Remove an Object from the ObjectSet by IFC type
 // That Object becomes transparent
 objectSet.removeObjectTypes(["IfcWall"]);

 ````

 @class XRayEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this XRayEffect.
 @param [selection] {Selection} The {{#crossLink "Selection"}}{{/crossLink}} to update.
 @extends Effect
 */
(function () {

    "use strict";

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

})();