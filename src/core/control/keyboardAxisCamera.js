/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class KeyboardAxisCamera
 @module BIMSURFER
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

    BIMSURFER.KeyboardAxisCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardAxisCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onKeyDown = null;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var self = this;

                    var input = this.viewer.input;

                    if (value) {

                        this._onKeyDown = input.on("keydown",
                            function (keyCode) {

                                if (!self._camera) {
                                    return;
                                }

                                var camera = self._camera;

                                var center = [0,0,0];

                                switch (keyCode) {

                                    case input.KEY_NUM_1:

                                        // Right view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = center;
                                        camera.eye = [-dist, elev, 0];
                                        camera.up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_2:

                                        // Left view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = center;
                                        camera.eye = [dist, elev, 0];
                                        camera.up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_3:

                                        // Front view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = center;
                                        camera.eye = [0, elev, -dist];
                                        camera.up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_4:

                                        // Back view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = center;
                                        camera.eye = [0, elev, dist];
                                        camera.up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_5:

                                        // Top view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = center;
                                        camera.eye = [0, elev - dist, 0];
                                        camera.up = [ 0, 0, 1 ];

                                        break;

                                    case input.KEY_NUM_6:

                                        // Bottom view

                                        var dist = 10;
                                        var elev = 0;

                                        camera.look = [0, elev, 0 ];
                                        camera.eye = [0, elev + dist, 0];
                                        camera.up = [ 0, 0, -1 ];

                                        break;
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onKeyDown);

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
