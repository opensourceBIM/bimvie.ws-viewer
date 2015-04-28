/**

 **Fly** flys a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Fly
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Fly configuration

 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Fly.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraFlyAnimation = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraFlyAnimation",

        _init: function (cfg) {

            var self = this;

            this._camera = null;

            this._arc = 0.0;

            this._look1 = [0, 0, 0];
            this._eye1 = [0, 0, 0];
            this._up1 = [0, 0, 0];

            this._look2 = [0, 0, 0];
            this._eye2 = [0, 0, 0];
            this._up2 = [0, 0, 0];

            this._vec = [0, 0, 0];

            this._dist = 0;

            this._duration = 0;

            this._flying = false;

            this._ok = null;

            this._onTick = null;

            this._camera = cfg.camera;

            this._tempVec = BIMSURFER.math.vec3();

            this._eyeVec = BIMSURFER.math.vec3();
            this._lookVec = BIMSURFER.math.vec3();

            this._stopFOV = 55;

            this._velocity = 1.0;
        },

        flyTo: function (params, ok) {

            this._ok = ok;

            this._arc = params.arc === undefined ? 0.0 : params.arc;

            var camera = this.camera;

            this._look1 = camera.look;
            this._eye1 = camera.eye;
            this._up1 = camera.up;

            BIMSURFER.math.subVec3(this._eye1, this._look1, this._tempVec);

            this._vec = BIMSURFER.math.normalizeVec3(this._tempVec);

            // Back-off factor in range of [0..1], when 0 is close, 1 is far

            var backOff = params.backOff || 0;

            if (backOff < 0) {
                backOff = 0;

            } else if (backOff > 1) {
                backOff = 1;
            }

            backOff = 1 - backOff;

            // Final camera state

            if (params.boundary) {

                // Zooming to look and eye computed from boundary

                var boundary = params.boundary;
                var dist = params.dist || 2.5;
                var lenVec = Math.abs(BIMSURFER.math.lenVec3(this._vec));
                var diag = BIMSURFER.math.getBoundaryDiag(boundary);
                var len = Math.abs((diag / (1.0 + (backOff * 0.8))) / Math.tan(this._stopFOV / 2));  /// Tweak this to set final camera distance on arrival
                var sca = (len / lenVec) * dist;

                this._look2 = BIMSURFER.math.getBoundaryCenter(boundary);

                if (params.offset) {

                    this._look2[0] += params.offset[0];
                    this._look2[1] += params.offset[1];
                    this._look2[2] += params.offset[2];
                }

                BIMSURFER.math.mulVec3Scalar(this._vec, sca, this._tempVec);

                this._eye2 = BIMSURFER.math.addVec3(this._look2, this._tempVec);
                this._up2 = BIMSURFER.math.vec3();
                this._up2[1] = 1;

            } else {

                // Zooming to specific look and eye points

                var lookat = params;

                var look = lookat.look || camera.look;
                var eye = lookat.eye || camera.eye;
                var up = lookat.up || camera.up;

                var cameraEye = camera.eye;
                var cameraLook = camera.look;
                var cameraUp = camera.up;

                if (look) {

                    this._look2[0] = look[0];
                    this._look2[1] = look[1];
                    this._look2[2] = look[2];

                } else {

                    this._look2[0] = cameraLook[0];
                    this._look2[1] = cameraLook[1];
                    this._look2[2] = cameraLook[2];
                }

                if (eye) {

                    this._eye2[0] = eye[0];
                    this._eye2[1] = eye[1];
                    this._eye2[2] = eye[2];

                } else {

                    this._eye2[0] = cameraEye[0];
                    this._eye2[1] = cameraEye[1];
                    this._eye2[2] = cameraEye[2];
                }

                if (up) {

                    this._up2[0] = up[0];
                    this._up2[1] = up[1];
                    this._up2[2] = up[2];

                } else {

                    this._up2[0] = cameraUp[0];
                    this._up2[1] = cameraUp[1];
                    this._up2[2] = cameraUp[2];
                }
            }

            // Distance to travel

            BIMSURFER.math.subVec3(this._look2, this._look1, this._tempVec);

            var lookDist = Math.abs(BIMSURFER.math.lenVec3(this._tempVec));

            BIMSURFER.math.subVec3(this._eye2, this._eye1, this._tempVec);

            var eyeDist = Math.abs(BIMSURFER.math.lenVec3(this._tempVec));

            this._dist = lookDist > eyeDist ? lookDist : eyeDist;

            // Duration of travel

            this._duration = 1000.0 * ((this._dist / ((params.velocity || this._velocity) * 200.0)) + 1); // extra seconds to ensure arrival

            this._flying = true;

            this.fire("started", params, true);

            var self = this;

            this._tick = this.viewer.on("tick",
                function (params) {
                    self._update(params.time);
                });
        },

        _update: function (time) {

            if (!this._flying) {
                return;
            }

            if (this._time1 === undefined || this._time1 === null) {
                this._time1 = time;
                this._time2 = this._time1 + this._duration;
            }

            if (time > this._time2) {
                this.stop();
                return;
            }

            var t = (time - this._time1) / this._duration;
            var easedTime = this.easing ? this._easeOut(t, 0, 1, 1) : t;

            BIMSURFER.math.lerpVec3(easedTime, 0, 1, this._eye1, this._eye2, this._eyeVec);

            var zoom;

            if (this.arc > 0.0) {

                var f = 1.0 + Math.sin(((Math.PI * 2) * easedTime) - (Math.PI * 0.75));
                zoom = (this._dist * f * (0.1 * this._arc));

                BIMSURFER.math.mulVec3Scalar(this._vec, zoom, this._tempVec);
                BIMSURFER.math.addVec3(this._eyeVec, this._tempVec, this._eyeVec);
            }

            BIMSURFER.math.lerpVec3(easedTime, 0, 1, this._look1, this._look2, this._lookVec);

            if (this.constrainUp) {

                // Interpolating "eye" and "look" but not "up"

                this._camera.look = this._lookVec;
                this._camera.eye = this._eyeVec;

            } else {

                // Interpolating "eye", "look" and "up"

                var up = BIMSURFER.math.lerpVec3(easedTime, 0, 1, this._up1, this._up2, []);

                this._camera.look = this._lookVec;
                this._camera.eye = this._eyeVec;
                this._camera.up = up;
            }
        },

        _easeOut: function (t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (-1 * ts * ts + 4 * tc + -6 * ts + 4 * t);
        },

        _easeIn: function (t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc * ts);
        },

        stop: function () {

            if (!this._flying) {
                return;
            }

            this.viewer.off(this._tick);

            var ok = this._ok;

            if (ok) {
                this._ok = false;
                ok();
            }

            this._flying = false;

            this.fire("stopped", true, true);
        },

        _props: {

            camera: {

                set: function (value) {
                    this._camera = value;
                    this.stop();
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.stop();
        }
    });

})();
