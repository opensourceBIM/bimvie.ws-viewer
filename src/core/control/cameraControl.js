/**
 A **CameraControl** allows you to pan, rotate and zoom a {{#crossLink "Camera"}}{{/crossLink}} using the mouse and keyboard,
 as well as switch it between preset left, right, anterior, posterior, superior and inferior views.

 ## Overview

 <ul>
 <li>You can have multiple CameraControls within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple CameraControls can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the CameraControl we're driving is the one whose {{#crossLink "Camera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a CameraControl to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 #### Controlling a Camera

 In this example we're viewing a {{#crossLink "TeapotObject"}}{{/crossLink}} with a {{#crossLink "Camera"}}{{/crossLink}} that's controlled by a CameraControl.

 <iframe style="width: 800px; height: 600px" src="../../examples/control_CameraControl.html"></iframe>

 ````Javascript
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 var camera = new BIMSURFER.Camera(viewer, {
        eye: [5, 5, -5]
    });

 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a RandomObjects
 var randomObjects = new BIMSURFER.RandomObjects(viewer, {
        numObjects: 55
    });
 ````

 @class CameraControl
 @module BIMSURFER
 @submodule control
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Camera.
 @param [camera] {Camera} The Camera to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraControl",

        /**
          Indicates that only one instance of a CameraControl may be active within
          its {{#crossLink "Viewer"}}{{/crossLink}} at a time. When a CameraControl is activated, that has
          a true value for this flag, then any other active CameraControl will be deactivated first.

         @property exclusive
         @type Boolean
         @final
         */
        exclusive: true,
        
        _init: function (cfg) {

            var self = this;

            var viewer = this.viewer;            

            this._keyboardAxis = new BIMSURFER.KeyboardAxisCamera(viewer, {
                camera: cfg.camera
            });

            this._keyboardOrbit = new BIMSURFER.KeyboardOrbitCamera(viewer, {
                camera: cfg.camera
            });
            
            this._mouseOrbit = new BIMSURFER.MouseOrbitCamera(viewer, {
                camera: cfg.camera
            });

            this._keyboardPan = new BIMSURFER.KeyboardPanCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mousePan = new BIMSURFER.MousePanCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._keyboardZoom = new BIMSURFER.KeyboardZoomCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mouseZoom = new BIMSURFER.MouseZoomCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mousePickObject = new BIMSURFER.MousePickObject(viewer, {
                rayPick: true,
                camera: cfg.camera
            });

            this._cameraFly = new BIMSURFER.CameraFlyAnimation(viewer, {
                camera: cfg.camera
            });

            this._mousePickObject.on("pick",
                function (e) {

                    var diff = BIMSURFER.math.subVec3(self._cameraFly.camera.eye, self._cameraFly.camera.look, []);

                    self._cameraFly.flyTo({
                        look: e.worldPos,
                        eye: [e.worldPos[0] + diff[0], e.worldPos[1] + diff[1], e.worldPos[2] + diff[2]]
                    });
                });

            // Handle when nothing is picked
            this._mousePickObject.on("nopick", function (e) {
                // alert("Mothing picked");
            });

            this.camera = cfg.camera;
            
            this.firstPerson = cfg.firstPerson;

            this.active = cfg.active !== false;
        },

        _props: {

            firstPerson: {

                set: function (value) {

                    this._firstPerson = value;

                    this._keyboardOrbit.firstPerson = value;
                    this._mouseOrbit.firstPerson = value;
                },

                get: function () {
                    return this._firstPerson;
                }
            },

            /**
             * The {{#crossLink "Camera"}}{{/crossLink}} being controlled.
             *
             * Must be within the same {{#crossLink "Viewer"}}{{/crossLink}} as this Object. Defaults to the parent
             * {{#crossLink "Viewer"}}Viewer's{{/crossLink}} default {{#crossLink "Viewer/camera:property"}}camera{{/crossLink}} when set to
             * a null or undefined value.
             *
             * @property camera
             * @type Camera
             */
            camera: {

                set: function (value) {

                    var camera = value;

                    if (camera) {

                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }

                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }

                    } else {

                        // Default to Viewer's default Camera
                        camera = this.viewer.camera;
                    }

                    //   this._cameraFly.camera = camera;

                    this._camera = camera;

                    this._keyboardAxis.camera = camera;

                    this._keyboardOrbit.camera = camera;
                    this._mouseOrbit.camera = camera;

                    this._keyboardPan.camera = camera;
                    this._mousePan.camera = camera;

                    this._keyboardZoom.camera = camera;
                    this._mouseZoom.camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            },

            /**
             * Flag which indicates whether this CameraControl is active or not.
             *
             * Fires an {{#crossLink "CameraControl/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    this._keyboardOrbit.active = value;
                    this._mouseOrbit.active = value;
                    this._keyboardPan.active = value;
                    this._mousePan.active = value;
                    this._mousePickObject.active = value;
                    this._cameraFly.active = value;

                    /**
                     * Fired whenever this CameraControl's {{#crossLink "CameraControl/active:property"}}{{/crossLink}} property changes.
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

            this._keyboardAxis.destroy();
            this._keyboardOrbit.destroy();
            this._mouseOrbit.destroy();
            this._keyboardPan.destroy();
            this._mousePan.destroy();
            this._keyboardZoom.destroy();
            this._mouseZoom.destroy();
            this._mousePickObject.destroy();
            this._cameraFly.destroy();

            this.active = false;
        }
    });

})();
