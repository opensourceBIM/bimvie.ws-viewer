/**
 A **MousePanCamera** lets you pan a {{#crossLink "Camera"}}{{/crossLink}} using the mouse.

 ## Overview

 <ul>
 <li>Panning is done by dragging the mouse with the left and right buttons down.</li>
 <li>Panning up and down involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the direction of its {{#crossLink "Camera/up:property"}}{{/crossLink}} vector.</li>
 <li>Panning left and right involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the the vector that is perpendicular to its {{#crossLink "Camera/up:property"}}{{/crossLink}} and {{#crossLink "Camera/eye:property"}}{{/crossLink}}-{{#crossLink "Camera/look:property"}}{{/crossLink}} vector.</li>
 <li>If desired, you can have multiple MousePanCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MousePanCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the MousePanCameras we're driving is the one whose {{#crossLink "MousePanCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MousePanCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>


 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MousePanCamera.html"></iframe>

 @class MousePanCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MousePanCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MousePanCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MousePanCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 0.03 : 0.03;

            this.camera = cfg.camera;

            this._onTick = null;

            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {


            /**
             * Flag which indicates whether this MousePanCamera is active or not.
             *
             * Fires an {{#crossLink "MousePanCamera/active:event"}}{{/crossLink}} event on change.
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

                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function () {

                                if (!self._camera) {
                                    return;
                                }

                                if (xDelta != 0 || yDelta != 0) {

                                    self._camera.pan([xDelta, yDelta, 0]);

                                    xDelta = 0;
                                    yDelta = 0;
                                }
                            });

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                if ((input.mouseDownLeft && input.mouseDownRight) ||
                                    (input.mouseDownLeft && input.keyDown[input.KEY_SHIFT]) ||
                                    input.mouseDownMiddle) {

                                    lastX = e[0];
                                    lastY = e[1];

                                    down = true;

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
                                    xDelta += (e[0] - lastX) * self.sensitivity;
                                    yDelta += (e[1] - lastY) * self.sensitivity;
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
                     * Fired whenever this MousePanCamera's {{#crossLink "MousePanCamera/active:property"}}{{/crossLink}} property changes.
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
