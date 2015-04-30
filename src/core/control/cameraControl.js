/**

 **Zooms** orbits a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Zoom
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Zoom configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Zoom.
 @param [cfg.camera] {Camera} Camera to control
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

        _init: function (cfg) {

            var viewer = this.viewer;

            this._keyboardAxis = new BIMSURFER.KeyboardAxisCamera(viewer);

            this._keyboardOrbit = new BIMSURFER.KeyboardOrbitCamera(viewer);

            this._mouseOrbit = new BIMSURFER.MouseOrbitCamera(viewer);

            this._keyboardPan = new BIMSURFER.KeyboardPanCamera(viewer, {
                sensitivity: 1
            });

            this._mousePan = new BIMSURFER.MousePanCamera(viewer, {
                sensitivity: 1
            });

            this._keyboardZoom = new BIMSURFER.KeyboardZoomCamera(viewer, {
                sensitivity: 1
            });

            this._mouseZoom = new BIMSURFER.MouseZoomCamera(viewer, {
                sensitivity: 1
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

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    this._keyboardOrbit.active = value;
                    this._mouseOrbit.active = value;
                    this._keyboardPan.active = value;
                    this._mousePan.active = value;

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

            this.active = false;
        }
    });

})();
