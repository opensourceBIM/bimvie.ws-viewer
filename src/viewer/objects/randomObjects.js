/**

 **RandomObjects** is a group of random {{#crossLink "BoxObject"}}BoxObjects{{/crossLink}}, useful for tests and demos.

 ## Overview

 <ul>
 <li>The {{#crossLink "BoxObject"}}BoxObjects{{/crossLink}} are arranged in a 2D grid, and each get an IFC type, picked at random
 from among the {{#crossLink "BIMSURFER.constants/defaultTypes:property"}}{{/crossLink}}.</li>
 </ul>

 ## Example

 In this example we create a RandomObjects containing 55 {{#crossLink "Object"}}Objects{{/crossLink}}:

 <iframe style="width: 600px; height: 400px" src="../../examples/object_RandomObjects.html"></iframe>

 ````javascript
// Create a Viewer
var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

// Create a Camera
var camera = new BIMSURFER.Camera(viewer, {
     eye: [70, 70, -70]
});

// Spin the camera
viewer.on("tick", function () {
    camera.rotateEyeY(0.2);
});

// Create a CameraControl
var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
});

// Create a RandomObjects
var randomObjects = new BIMSURFER.RandomObjects(viewer, {
    numObjects: 55
});
 ````

 @class RandomObjects
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} RandomObjects configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this RandomObjects.
 @param [cfg.numObjects] {Number} Number of {{#crossLink "Object"}}Objects{{/crossLink}} within this RandomObjects.
 @param [cfg.labels] {Boolean} Indicates whether to show debugging {{#crossLink "Label"}}Labels{{/crossLink}} on the {{#crossLink "Object"}}Objects{{/crossLink}} within this RandomObjects.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.RandomObjects = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.RandomObjects",

        _init: function (cfg) {

            this._numObjects = cfg.numObjects || 25;

            /**
             * The {{#crossLink "Objects"}}{{/crossLink}} within this RandomObjects.
             * @type {{Array of Object}}
             */
            this.objects = [];

            this._labels = cfg.labels;

            this._generate();
        },

        _generate: function () {

            var len = Math.sqrt(this._numObjects);

            var xStart = len * -0.5;
            var zStart = len * -0.5;

            var xEnd = len * 0.5;
            var zEnd = len * 0.5;

            var defaultTypes = BIMSURFER.constants.defaultTypes;

            var spacing = 15;

            for (var x = xStart; x < xEnd; x += 1) {
                for (var z = zStart; z < zEnd; z += 1) {

                    this.objects.push(
                        new BIMSURFER.BoxObject(this.viewer, {
                            id: "testObject" + this.objects.length,
                            type: defaultTypes[Math.round(Math.random() * defaultTypes.length)],
                            matrix: BIMSURFER.math.translationMat4v([x * spacing, 0, z * spacing]),
                            label: this._labels
                        }));
                }
            }
        },

        _clear: function () {
            while (this.objects.length > 0) {
                this.objects.pop().destroy();
            }
        },

        _destroy: function () {
            this._clear();
        }
    });
})();
