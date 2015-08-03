/**
 A **MouseOrbitCamera** lets you orbit a {{#crossLink "Camera"}}{{/crossLink}} about its point-of-interest using the mouse.

 ## Overview

 <ul>
 <li>Orbiting involves rotating the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}}
 position about its current {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>The orbit is freely rotating, without gimbal-lock.</li>
 <li>If desired, you can have multiple MouseOrbitCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MouseOrbitCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the MouseOrbitCameras we're driving is the one whose {{#crossLink "MouseOrbitCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MouseOrbitCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MouseOrbitCamera.html"></iframe>

 @class MouseOrbitCamera
 @module BIMSURFER
 @submodule control
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MouseOrbitCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MouseOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MouseOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MouseOrbitCamera is active or not.
             *
             * Fires an {{#crossLink "MouseOrbitCamera/active:event"}}{{/crossLink}} event on change.
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

                        var sensitivity = 0.20;
                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                if (xDelta != 0) {
                                    self._camera.rotateEyeY(-xDelta);
                                    xDelta = 0;
                                }

                                if (yDelta != 0) {
                                    self._camera.rotateEyeX(yDelta);
                                    yDelta = 0;
                                }
                            });

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                if (input.mouseDownLeft
                                    && !input.mouseDownRight
                                    && !input.keyDown[input.KEY_SHIFT]
                                    && !input.mouseDownMiddle) {

                                    down = true;
                                    lastX = e[0];
                                    lastY = e[1];

                                } else {
                                    down = false;
                                }

                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {
                                down = false;
                            });

                        this._onMouseMove = input.on("mousemove",
                            function (e) {
                                if (down) {
                                    xDelta += (e[0] - lastX) * sensitivity;
                                    yDelta += (e[1] - lastY) * sensitivity;
                                    lastX = e[0];
                                    lastY = e[1];
                                }
                            });

                    } else {

                        input.off(this._onTick);

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                        input.off(this._onMouseMove);
                    }

                    /**
                     * Fired whenever this MouseOrbitCamera's {{#crossLink "MouseOrbitCamera/active:property"}}{{/crossLink}} property changes.
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
