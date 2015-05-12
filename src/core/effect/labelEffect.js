/**
 A **LabelEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that highlights the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Labelling an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
 <br> Then we apply a {{#crossLink "LabelEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to become labeled, while the other
 two {{#crossLink "Object"}}Objects{{/crossLink}} remain without labels.

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_LabelEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [30, 20, -30]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply a Labels effect to the ObjectSet, which causes the
 // Object in the ObjectSet to become labelsed.

 var labels = new BIMSURFER.LabelEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the Labels to now render
 // that Object as labelsed also

 objectSet.addObjects([object3]);

 ````

 @class LabelEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this LabelEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this LabelEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    var labelPool = [];
    var lenLabelPool = 0;

    function getLabel() {
        return lenLabelPool > 0 ? labelPool[--lenLabelPool] : new Label();
    }

    function putLabel(label) {
        labelPool.push(label);
    }

    BIMSURFER.LabelEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.LabelEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.label = this.invert ? !selected : !!selected;
        }
    });


})();