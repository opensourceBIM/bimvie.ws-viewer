/**

 **KeyboardZoomCamera** pans a {{#crossLink "Camera"}}{{/crossLink}} with the keyboard.

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
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardZoomCamera.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardZoomCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardZoomCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 15.0 : 15.0;

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

                                    var wkey = input.keyDown[input.KEY_ADD];
                                    var skey = input.keyDown[input.KEY_SUBTRACT];

                                    if (wkey || skey) {

                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (skey) {
                                            z = elapsed * sensitivity;

                                        } else if (wkey) {
                                            z = -elapsed * sensitivity;
                                        }

                                        self._camera.zoom(z);
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
