/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class ClickSelectObjects
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Camera.
 @param [selection] {Selection} The Selection to update.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.ClickSelectObjects = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.ClickSelectObjects",

        _init: function (cfg) {

            this.selection = cfg.selection || new BIMSURFER.Selection(this.viewer);

            this._multi = false;

            this.active = cfg.active !== false;
        },

        _props: {

            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        var self = this;

                        var input = this.viewer.input;

                        var lastX;
                        var lastY;

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                lastX = e[0];
                                lastY = e[1];
                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {

                                if (((e[0] > lastX) ? (e[0] - lastX < 5) : (lastX - e[0] < 5)) &&
                                    ((e[1] > lastY) ? (e[1] - lastY < 5) : (lastY - e[1] < 5))) {

                                    var multiSelect = input.keyDown[input.KEY_SHIFT];

                                    var hit = self.viewer.pick(lastX, lastY, {});

                                    if (hit) {

                                        var object = hit.object;

                                        if (!self.selection.objects[object.id]) {

                                            // Select

                                            if (!multiSelect) {
                                                self.selection.clear();
                                            }

                                            self.selection.addObjects([object]);

                                        } else {

                                            // Deselect

                                            self.selection.removeObjects([object]);
                                        }
                                    } else {

                                        if (!multiSelect) {
                                            self.selection.clear();
                                        }
                                    }
                                }
                            });


                        this.fire('active', this._active = true);

                    } else {

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);

                        this.fire('active', this._active = false);
                    }
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });
})();