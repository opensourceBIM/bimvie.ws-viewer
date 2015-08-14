/**
 A **MouseZoomCamera** lets you zoom a {{#crossLink "Camera"}}{{/crossLink}} using the mouse wheel.

 ## Overview

 <ul>
 <li>Zooming involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} closer and farther to its {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>If desired, you can have multiple MouseZoomCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MouseZoomCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the MouseZoomCameras we're driving is the one whose {{#crossLink "MouseZoomCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MouseZoomCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MouseZoomCamera.html"></iframe>

 @class MouseZoomCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MouseZoomCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MouseZoomCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MouseZoomCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 1.0 : 1.0;

            this.camera = cfg.camera;

            this._onTick = null;
            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MouseZoomCamera is active or not.
             *
             * Fires an {{#crossLink "MouseZoomCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var delta = 0;
                        var target = 0;
                        var newTarget = false;
                        var targeting = false;
                        var progress = 0;

                        var eyeVec = BIMSURFER.math.vec3();
                        var lookVec = BIMSURFER.math.vec3();
                        var tempVec3 = BIMSURFER.math.vec3();

                        var self = this;

                        this._onMouseWheel = this.viewer.input.on("mousewheel",
                            function (_delta) {

//                                var d = params.d * 0.01;
//
//                                delta = -d;

                                delta = _delta;

                                if (delta === 0) {
                                    targeting = false;
                                    newTarget = false;
                                } else {
                                    newTarget = true;
                                }
                            });

                        this._onTick = this.viewer.on("tick",
                            function () {

                                if (!self._camera) {
                                    return;
                                }

                                var camera = self._camera;

                                var eye = camera.eye;
                                var look = camera.look;

                                eyeVec[0] = eye[0];
                                eyeVec[1] = eye[1];
                                eyeVec[2] = eye[2];

                                lookVec[0] = look[0];
                                lookVec[1] = look[1];
                                lookVec[2] = look[2];

                                BIMSURFER.math.subVec3(eyeVec, lookVec, tempVec3);

                                var lenLook = Math.abs(BIMSURFER.math.lenVec3(tempVec3));
                                var lenLimits = 1000;
                                var f = self.sensitivity * (2.0 + (lenLook / lenLimits));

                                if (newTarget) {
                                    target = delta * f;
                                    progress = 0;
                                    newTarget = false;
                                    targeting = true;
                                }

                                if (targeting) {
                                    if (delta > 0) {
                                        progress += 0.2 * f;
                                        if (progress > target) {
                                            targeting = false;
                                        }
                                    } else if (delta < 0) {
                                        progress -= 0.2 * f;
                                        if (progress < target) {
                                            targeting = false;
                                        }
                                    }
                                    if (targeting) {
                                        camera.zoom(progress);
                                    }
                                }
                            });

                    } else {

                        input.off(this._onTick);
                        input.off(this._onMouseWheel);
                    }

                    /**
                     * Fired whenever this MouseZoomCamera's {{#crossLink "MouseZoomCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

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
                    }
                    this._camera = camera;
                    this._cameraDirty = true;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
