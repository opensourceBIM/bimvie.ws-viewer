/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class MousePanCamera
 @module BIMSURFER
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
        className: "BIMSURFER.KeyboardPanCamera",

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

                        this.fire('active', this._active = true);

                    } else {

                        input.off(this._onTick);

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                        input.off(this._onMouseMove);

                        this.fire('active', this._active = false);
                    }
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
