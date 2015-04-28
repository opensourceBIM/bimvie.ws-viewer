/**

 **Pans** orbits a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Pan
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Pan configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Pan.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraPanControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraPanControl",

        _init: function (cfg) {

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

                        var sensitivity = 0.16;
                        var rate = 1;
                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;
                        var eyeVec = BIMSURFER.math.vec3();
                        var lookVec = BIMSURFER.math.vec3();
                        var tempVec3 = BIMSURFER.math.vec3();

                        var self = this;

                        this._onMouseDown = this.viewer.input.on("mousedown",
                            function (coords) {
                                if ((input.mouseDownLeft && input.mouseDownRight) ||
                                    (input.mouseDownLeft && input.keyDown[input.KEY_SHIFT]) ||
                                    input.mouseDownMiddle) {
                                    down = true;
                                    lastX = coords[0];
                                    lastY = coords[1];
                                } else {
                                    down = false;
                                }
                            });

                        this._onMouseUp = this.viewer.input.on("mouseup",
                            function () {
                                down = false;
                            });

                        this._onMouseMove = this.viewer.input.on("mousemove",
                            function (coords) {

                                if (down) {

                                    var camera = self._camera;
                                    var eye = camera.eye;
                                    var look = camera.look;

                                    eyeVec[0] = eye.x;
                                    eyeVec[1] = eye.y;
                                    eyeVec[2] = eye.z;

                                    lookVec[0] = look.x;
                                    lookVec[1] = look.y;
                                    lookVec[2] = look.z;

                                    BIMSURFER.math.subVec3(eyeVec, lookVec, tempVec3);
                                    var lenLook = Math.abs(BIMSURFER.math.lenVec3(tempVec3));
                                    var lenLimits = 200 - 1;
                                    var f = sensitivity * (lenLook / lenLimits);

                                    xDelta += (x - lastX) * f;
                                    yDelta += (y - lastY) * f;

                                    lastX = x;
                                    lastY = y;
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
                                var f = sensitivity * (2.0 + (lenLook / lenLimits));

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
                                        camera.pan(progress);
                                    }
                                }
                            });


                        this.fire('active', this._active = true);

                    } else {

                        input.off(this._onTick);
                        input.off(this._onMouseWheel);

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
