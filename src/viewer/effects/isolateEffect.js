/**
 A **IsolateEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that exclusively shows the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Isolating an ObjectSet

 Isolate objects that match given IDs, using an {{#crossLink "ObjectSet"}}{{/crossLink}} and an IsolateEffect

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_IsolateEffect.html"></iframe>

 ````javascript

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

 // Create some BoxObjects

 new BIMSURFER.BoxObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, -4])
 });

 new BIMSURFER.BoxObject(viewer, {
    id: "bar",
    type: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([4, 0, -4])
 });

 new BIMSURFER.BoxObject(viewer, {
    id: "baz",
    type: "IfcBeam",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, 4])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply an Isolate effect to the ObjectSet
 var isolateEffect = new BIMSURFER.IsolateEffect(viewer, {
    objectSet: objectSet
 });

 // Add Objects to the ObjectSet by ID
 // These Objects become visible
 objectSet.addObjectIds(["foo", "bar", "baz"]);

 // Remove an Object from the ObjectSet by ID
 // That Object becomes invisible again
 objectSet.removeObjectIds(["baz"]);

 ````

 @class IsolateEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this IsolateEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this IsolateEffect to.
 @extends Effect
 */
(function () {

    "use strict";

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

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.active = this.invert ? !selected : !!selected;
        }
    });

})();