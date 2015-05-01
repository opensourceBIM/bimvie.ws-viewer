/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class KeyboardOrbitCamera
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardOrbitCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardPanCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardPanCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 10.0 : 10.0;

            this.camera = cfg.camera;

            this._onTick = null;

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

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                if (!input.ctrlDown && !input.altDown) {

                                    var wkey = input.keyDown[input.KEY_W];
                                    var skey = input.keyDown[input.KEY_S];
                                    var akey = input.keyDown[input.KEY_A];
                                    var dkey = input.keyDown[input.KEY_D];
                                    var zkey = input.keyDown[input.KEY_Z];
                                    var xkey = input.keyDown[input.KEY_X];

                                    if (wkey || skey || akey || dkey || xkey || zkey) {

                                        var x = 0;
                                        var y = 0;
                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (skey) {
                                            y = elapsed * sensitivity;

                                        } else if (wkey) {
                                            y = -elapsed * sensitivity;
                                        }

                                        if (dkey) {
                                            x = elapsed * sensitivity;

                                        } else if (akey) {
                                            x = -elapsed * sensitivity;
                                        }

                                        if (xkey) {
                                            z = elapsed * sensitivity;

                                        } else if (zkey) {
                                            z = -elapsed * sensitivity;
                                        }

                                        self._camera.pan([x, y, z]);
                                    }
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onTick);

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
