/**
 A **KeyboardOrbitCamera** lets you orbit a {{#crossLink "Camera"}}{{/crossLink}} about its point-of-interest using the keyboard's arrow keys.

 ## Overview

 <ul>
 <li>Orbiting involves rotating the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}}
 position about its current {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>The orbit is freely rotating, without gimbal-lock.</li>
 <li>If desired, you can have multiple KeyboardOrbitCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple KeyboardOrbitCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the KeyboardOrbitCameras we're driving is the one whose {{#crossLink "KeyboardOrbitCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a KeyboardOrbitCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_KeyboardOrbitCamera.html"></iframe>

 @class KeyboardOrbitCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardAxisCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this KeyboardOrbitCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardOrbitCamera/active:event"}}{{/crossLink}} event on change.
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

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                var yawRate = 50;
                                var pitchRate = 50;

                                if (!input.ctrlDown && !input.altDown) {

                                    var left = input.keyDown[input.KEY_LEFT_ARROW];
                                    var right = input.keyDown[input.KEY_RIGHT_ARROW];
                                    var up = input.keyDown[input.KEY_UP_ARROW];
                                    var down = input.keyDown[input.KEY_DOWN_ARROW];

                                    if (left || right || up || down) {

                                        var yaw = 0;
                                        var pitch = 0;

                                        if (right) {
                                            yaw = -elapsed * yawRate;

                                        } else if (left) {
                                            yaw = elapsed * yawRate;
                                        }

                                        if (down) {
                                            pitch = elapsed * pitchRate;

                                        } else if (up) {
                                            pitch = -elapsed * pitchRate;
                                        }

                                        if (Math.abs(yaw) > Math.abs(pitch)) {
                                            pitch = 0;
                                        } else {
                                            yaw = 0;
                                        }

                                        if (yaw != 0) {
                                            self._camera.rotateEyeY(yaw);
                                        }

                                        if (pitch != 0) {
                                            self._camera.rotateEyeX(pitch);
                                        }
                                    }
                                }
                            });

                    } else {

                        this.viewer.off(this._onTick);
                    }

                    /**
                     * Fired whenever this KeyboardOrbitCamera's {{#crossLink "KeyboardOrbitCamera/active:property"}}{{/crossLink}} property changes.
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
