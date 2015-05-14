/**

 **Fly** flys a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class CameraFlyAnimation
 @module BIMSURFER
 @submodule animate
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

            this._flying = false;

            this._ok = null;

            this._onTick = null;

            this._camera = cfg.camera;

            this._tempVec = BIMSURFER.math.vec3();

            this._eyeVec = BIMSURFER.math.vec3();
            this._lookVec = BIMSURFER.math.vec3();

            this._stopFOV = 55;

            this._velocity = 1.0;

            this._time1 = null;
            this._time2 = null;

            this.easing = cfg.easing !== false;

            this.duration = cfg.duration || 0.5;
        },

        /**
         * Begins flying this CameraFlyAnimation's {{#crossLink "Camera"}}{{/crossLink}} to the given target.
         *
         * <ul>
         *     <li>When the target is a boundary, the {{#crossLink "Camera"}}{{/crossLink}} will fly towards the target
         *     and stop when the target fills most of the canvas.</li>
         *     <li>When the target is an explicit {{#crossLink "Camera"}}{{/crossLink}} position, given as ````eye````, ````look```` and ````up````
         *      vectors, then this CameraFlyAnimation will interpolate the {{#crossLink "Camera"}}{{/crossLink}} to that target and stop there.</li>
         * @method flyTo
         * @param params  {*} Flight parameters
         * @param[params.arc=0]  {Number} Factor in range [0..1] indicating how much the
         * {{#crossLink "Camera/eye:property"}}Camera's eye{{/crossLink}} position will
         * swing away from its {{#crossLink "Camera/eye:property"}}look{{/crossLink}} position as it flies to the target.
         * @param [params.boundary] {{xmin:Number, ymin:Number, zmin: Number, xmax: Number, ymax: Number, zmax: Number }}  Boundary target to fly to.
         * @param [params.eye] {Array of Number} Position to fly the {{#crossLink "Camera/eye:property"}}Camera's eye{{/crossLink}} position to.
         * @param [params.look] {Array of Number} Position to fly the {{#crossLink "Camera/look:property"}}Camera's look{{/crossLink}} position to.
         * @param [params.up] {Array of Number} Position to fly the {{#crossLink "Camera/up:property"}}Camera's up{{/crossLink}} vector to.
         * @param [ok] {Function} Callback fired on arrival
         */
        flyTo: function (params, ok) {

            if (this._flying) {
                this.stop();
            }

            this._ok = ok;

            this._arc = params.arc === undefined ? 0.0 : params.arc;

            var camera = this.camera;

            // Set up initial camera state

            this._look1 = camera.look;
            this._look1 = [this._look1[0], this._look1[1], this._look1[2]];

            this._eye1 = camera.eye;
            this._eye1 = [this._eye1[0], this._eye1[1], this._eye1[2]];

            this._up1 = camera.up;
            this._up1 = [this._up1[0], this._up1[1], this._up1[2]];

            // Get normalized eye->look vector

            this._vec = BIMSURFER.math.normalizeVec3(BIMSURFER.math.subVec3(this._eye1, this._look1, []));

            // Back-off factor in range of [0..1], when 0 is close, 1 is far

            var backOff = params.backOff || 0.5;

            if (backOff < 0) {
                backOff = 0;

            } else if (backOff > 1) {
                backOff = 1;
            }

            backOff = 1 - backOff;

            // Set up final camera state

            if (params.boundary) {

                // Zooming to look and eye computed from boundary

                var boundary = params.boundary;

                if (boundary.xmax <= boundary.xmin || boundary.ymax <= boundary.ymin || boundary.zmax <= boundary.zmin) {
                    return;
                }

                var dist = params.dist || 2.5;
                var lenVec = Math.abs(BIMSURFER.math.lenVec3(this._vec));
                var diag = BIMSURFER.math.getBoundaryDiag(boundary);
                var len = Math.abs((diag / (1.0 + (backOff * 0.8))) / Math.tan(this._stopFOV / 2));  /// Tweak this to set final camera distance on arrival
                var sca = (len / lenVec) * dist;

                this._look2 = BIMSURFER.math.getBoundaryCenter(boundary);
                this._look2 = [this._look2[0], this._look2[1], this._look2[2]];

                if (params.offset) {

                    this._look2[0] += params.offset[0];
                    this._look2[1] += params.offset[1];
                    this._look2[2] += params.offset[2];
                }

                this._eye2 = BIMSURFER.math.addVec3(this._look2, BIMSURFER.math.mulVec3Scalar(this._vec, sca, []));
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

            var lookDist = Math.abs(BIMSURFER.math.lenVec3(BIMSURFER.math.subVec3(this._look2, this._look1, [])));

            var eyeDist = Math.abs(BIMSURFER.math.lenVec3(BIMSURFER.math.subVec3(this._eye2, this._eye1, [])));

            this._dist = lookDist > eyeDist ? lookDist : eyeDist;


            this.fire("started", params, true);


            var self = this;

            this._time1 = (new Date()).getTime();
            this._time2 = this._time1 + this._duration;

            this._tick = this.viewer.on("tick",
                function (params) {
                    self._update(params.time * 1000.0);
                });

            this._flying = true;
        },

        _update: function (time) {

            if (!this._flying) {
                return;
            }

            time = (new Date()).getTime();

            var t = (time - this._time1) / (this._time2 - this._time1);

            if (t > 1) {
                //  this.stop();
                return;
            }

            t = this.easing ? this._ease(t, 0, 1, 1) : t;

            if (t > 1.0) {
                this.stop();
                return;
            }

            this._camera.eye = BIMSURFER.math.lerpVec3(t, 0, 1, this._eye1, this._eye2, []);
            this._camera.look = BIMSURFER.math.lerpVec3(t, 0, 1, this._look1, this._look2, []);
            this._camera.up = BIMSURFER.math.lerpVec3(t, 0, 1, this._up1, this._up2, []);
        },

        // Quadratic easing out - decelerating to zero velocity
        // http://gizma.com/easing

        _ease: function (t, b, c, d) {
            t /= d;
            return -c * t*(t-2) + b;
        },

        stop: function () {

            if (!this._flying) {
                return;
            }

            this.viewer.off(this._tick);

            this._flying = false;

            this._time1 = null;
            this._time2 = null;

            this.fire("stopped", true, true);

            var ok = this._ok;

            if (ok) {
                this._ok = false;
                ok();
            }
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
            },

            duration: {

                set: function (value) {
                    this._duration = value * 1000.0;
                    this.stop();
                },

                get: function () {
                    return this._duration * 0.001;
                }
            }
        },

        _destroy: function () {
            this.stop();
        }
    });

})();
