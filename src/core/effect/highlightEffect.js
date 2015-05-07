/**
 A **HighlightEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that highlights the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 Highlight objects that match given IDs, using an {{#crossLink "ObjectSet"}}{{/crossLink}} and a HighlightEffect:

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

 new BIMSURFER.BoxObject(viewer, {
    objectId: "baz",
    ifcType: "IfcBeam",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, 4])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply a highlight effect to the ObjectSet
 var highlightEffect = new BIMSURFER.HighlightEffect(viewer, {
        objectSet: objectSet
    });

 // Add Objects to the ObjectSet by ID
 // These Objects become highlighted
 objectSet.addObjectIds(["foo", "bar", "baz"]);

 // Remove an Object from the ObjectSet by ID
 // That Object becomes non-highlighted again
 objectSet.removeObjectIds(["baz"]);

 ````

 @class HighlightEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this HighlightEffect.
 @param [selection] {Selection} The {{#crossLink "Selection"}}{{/crossLink}} to update.
 @extends Effect
 */
(function () {

    "use strict";

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
            var selected = this.objectSet.objects[object.id];
            object.highlight = this.invert ? !selected : !!selected;
        }
    });

})();