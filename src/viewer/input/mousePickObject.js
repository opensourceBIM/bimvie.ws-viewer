/**
 A **MousePickObject** lets you add or remove {{#crossLink "Object"}}Objects{{/crossLink}} to and from an {{#crossLink "ObjectSet"}}ObjectSet{{/crossLink}} by clicking them with the mouse.

 ## Overview

 <ul>
 <li>A MousePickObject adds {{#crossLink "Object"}}Objects{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}} as you
 click them with the mouse, removing them again when you click them a second time.</li>
 <li>Typically a MousePickObject will share an {{#crossLink "ObjectSet"}}{{/crossLink}} with one or
 more {{#crossLink "MousePickObject"}}MousePickObjects{{/crossLink}}, in order to select which {{#crossLink "Object"}}Objects{{/crossLink}} are influenced by the {{#crossLink "MousePickObject"}}MousePickObjects{{/crossLink}}.</li>
 <li>A MousePickObject will provide its own {{#crossLink "ObjectSet"}}{{/crossLink}} by default.</li>
 <li>Hold down SHIFT while clicking to multi-select.</li>
 </ul>

 ## Example

 #### Clicking Objects to add them to a highlighted ObjectSet

 In this example, we view four {{#crossLink "Objects"}}Objects{{/crossLink}} with a {{#crossLink "Camera"}}{{/crossLink}}, which we manipulate with a {{#crossLink "CameraControl"}}{{/crossLink}}.
 <br>We also use a {{#crossLink "MousePickObject"}}{{/crossLink}} to add and remove
 the {{#crossLink "Objects"}}Objects{{/crossLink}} to an {{#crossLink "ObjectSet"}}{{/crossLink}}, to which we're applying
 a {{#crossLink "HighlightMousePickObject"}}{{/crossLink}}.
 <br><br>
 Click on the {{#crossLink "Objects"}}Objects{{/crossLink}} to select and highlight them - hold down SHIFT to multi-select.

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MousePickObject_HighlightMousePickObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [10, 10, -10]
 });

 // Create a CameraControl
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer);

 // Create some Objects
 // Share the Geometry among them

 var object1 = new BIMSURFER.Object(viewer, {
    id: "object1",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, -3])
 });

 var object2 = new BIMSURFER.Object(viewer, {
    id: "object2",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, -3])
 });

 var object3 = new BIMSURFER.Object(viewer, {
    id: "object3",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, 3])
 });

 var object4 = new BIMSURFER.Object(viewer, {
    id: "object4",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, 3])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply a highlight MousePickObject to the ObjectSet
 var highlightMousePickObject = new BIMSURFER.HighlightMousePickObject(viewer, {
    objectSet: objectSet
 });

 // Create a MousePickObject
 var mousePickObject = new BIMSURFER.MousePickObject(viewer, {

    // We want the 3D World-space coordinates of
    // each location we pick
    rayPick: true
 });

 // Handle when Object is picked
 mousePickObject.on("pick", function(e) {
        alert("Picked: " + JSON.stringify(e));
 });

 // Handle when nothing is picked
 mousePickObject.on("nopick", function(e) {
        alert("Mothing picked");
 });
 ````

 @class MousePickObject
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MousePickObject.
 @param [rayPick=false] {Boolean} Indicates whether this MousePickObject will find the 3D ray intersection whenever it picks a
 {{#crossLink "Object"}}Objects{{/crossLink}}.
 @param [active=true] {Boolean} Indicates whether or not this MousePickObject is active.
 @see {Object}
 @see {ObjectSet}
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MousePickObject = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MousePickObject",

        _init: function (cfg) {

            this.rayPick = cfg.rayPick;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MousePickObject is active or not.
             *
             * Fires a {{#crossLink "MousePickObject/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        var self = this;

                        var input = this.viewer.input;

                        this._onMouseUp = input.on("dblclick",
                            function (coords) {

                                var hit = self.viewer.pick(coords[0], coords[1], {
                                    rayPick: self._rayPick
                                });

                                if (hit) {
                                    self.fire("pick", hit);

                                } else {
                                    self.fire("nopick", {
                                        canvasPos: e
                                    });
                                }
                            });

                    } else {

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                    }

                    /**
                     * Fired whenever this MousePickObject's {{#crossLink "MousePickObject/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            /**
             * Indicates whether this MousePickObject will find the 3D ray intersection whenever it picks an
             * {{#crossLink "Object"}}Object{{/crossLink}}.
             *
             * When true, this MousePickObject returns the 3D World-space intersection in each
             * {{#crossLink "MousePickObject/picked:event"}}{{/crossLink}} event.
             *
             * Fires a {{#crossLink "MousePickObject/rayPick:event"}}{{/crossLink}} event on change.
             *
             * @property rayPick
             * @type Boolean
             */
            rayPick: {

                set: function (value) {

                    value = !!value;

                    if (this._rayPick === value) {
                        return;
                    }

                    this._dirty = false;

                    /**
                     * Fired whenever this MousePickObject's {{#crossLink "MousePickObject/rayPick:property"}}{{/crossLink}} property changes.
                     * @event rayPick
                     * @param value The property's new value
                     */
                    this.fire('rayPick', this._rayPick = value);
                },

                get: function () {
                    return this._rayPick;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });
})();