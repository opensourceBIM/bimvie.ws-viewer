/**

 **KeyboardPanCamera** pans a {{#crossLink "Camera"}}{{/crossLink}} with the keyboard.

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class Orbit
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Orbit configuration

 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardPanCamera.
 @param [cfg.camera] {Camera} Camera to control
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

            this.sensitivity = cfg.sensitivity || 10;

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

                                    var w = input.keyDown[input.KEY_W];
                                    var s = input.keyDown[input.KEY_S];
                                    var a = input.keyDown[input.KEY_A];
                                    var d = input.keyDown[input.KEY_D];

                                    if (w || s || a || d) {

                                        var x = 0;
                                        var y = 0;
                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (s) {
                                            y = elapsed * sensitivity;

                                        } else if (w) {
                                            y = -elapsed * sensitivity;
                                        }

                                        if (d) {
                                            x = elapsed * sensitivity;

                                        } else if (a) {
                                            x = -elapsed * sensitivity;
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
