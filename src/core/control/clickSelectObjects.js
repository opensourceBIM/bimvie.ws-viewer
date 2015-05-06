/**
 A **ClickSelectObjects** lets you add or remove {{#crossLink "Object"}}Objects{{/crossLink}} to and from an {{#crossLink "ObjectSet"}}ObjectSet{{/crossLink}} by clicking them with the mouse.

 ## Overview

 <ul>
 <li>A ClickSelectObjects adds {{#crossLink "Object"}}Objects{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}} as you
 click them with the mouse, removing them again when you click them a second time.</li>
 <li>Typically a ClickSelectObjects will share an {{#crossLink "ObjectSet"}}{{/crossLink}} with one or
 more {{#crossLink "Effect"}}Effects{{/crossLink}}, in order to select which {{#crossLink "Object"}}Objects{{/crossLink}} are influenced by the {{#crossLink "Effect"}}Effects{{/crossLink}}.</li>
 <li>A ClickSelectObjects will provide its own {{#crossLink "ObjectSet"}}{{/crossLink}} by default.</li>
 <li>Hold down SHIFT while clicking to multi-select.</li>
 </ul>

 ## Overview

 TODO

 ## Example

 In this example we have a {{#crossLink "Viewer"}}{{/crossLink}} with a
 {{#crossLink "Camera"}}{{/crossLink}} that's controlled by a CameraControl.

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer(null, "myDiv", {}, false);

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl
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

 // Create a ClickSelectObjects
 var clickSelectObjects = new BIMSURFER.ClickSelectObjects(viewer, {
    objectSet: objectSet
 });

 ````

 @class ClickSelectObjects
 @module BIMSURFER
 @submodule control
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Camera.
 @param [selection] {Selection} The Selection to update.
 @see {Object}
 @see {ObjectSet}
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.ClickSelectObjects = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.ClickSelectObjects",

        _init: function (cfg) {

            this.selection = cfg.selection || new BIMSURFER.ObjectSet(this.viewer);

            this._multi = false;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this ClickSelectObjects is active or not.
             *
             * Fires a {{#crossLink "ClickSelectObjects/active:event"}}{{/crossLink}} event on change.
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

                        var lastX;
                        var lastY;

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                lastX = e[0];
                                lastY = e[1];
                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {

                                if (((e[0] > lastX) ? (e[0] - lastX < 5) : (lastX - e[0] < 5)) &&
                                    ((e[1] > lastY) ? (e[1] - lastY < 5) : (lastY - e[1] < 5))) {

                                    var multiSelect = input.keyDown[input.KEY_SHIFT];

                                    var hit = self.viewer.pick(lastX, lastY, {});

                                    if (hit) {

                                        var object = hit.object;

                                        if (!self.selection.objects[object.id]) {

                                            // Select

                                            if (!multiSelect) {
                                                self.selection.clear();
                                            }

                                            self.selection.addObjects([object]);

                                        } else {

                                            // Deselect

                                            self.selection.removeObjects([object]);
                                        }
                                    } else {

                                        if (!multiSelect) {
                                            self.selection.clear();
                                        }
                                    }
                                }
                            });

                    } else {

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                    }

                    /**
                     * Fired whenever this ClickSelectObjects's {{#crossLink "ClickSelectObjects/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });
})();