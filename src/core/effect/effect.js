/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class Effect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Effect.
 @param [selection] {Selection} The {{#crossLink "Selection"}}{{/crossLink}} to update.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Effect = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Effect",

        _init: function (cfg) {

            this.selection = cfg.selection || new BIMSURFER.Selection(this.viewer);

            this._dirty = true;

            var self = this;

            this._onSelectionUpdated = this.selection.on("updated",
                function () {
                    self._dirty = true;
                });

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this Effect is active or not.
             *
             * Fires an {{#crossLink "Effect/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    if (value) {

                        var self = this;

                        this._tickSub = this.viewer.on("tick",
                            function () {

                                if (self._dirty) {

                                    if (self._apply) {

                                        // Apply effect to Objects in the Viewer
                                        self.viewer.withClasses(["BIMSURFER.Object"],
                                            function (object) {
                                                self._apply.call(self, object);
                                            });
                                    }

                                    self._dirty = false;
                                }
                            });

                    } else {

                        this.viewer.off(this._tickSub);
                    }

                    /**
                     * Fired whenever this Effect's {{#crossLink "Effect/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);

                    this._dirty = true;
                },

                get: function () {
                    return this._active;
                }
            },

            invert: {

                set: function (value) {

                    if (this._invert === value) {
                        return;
                    }

                    self._dirty = false;

                    this.fire('invert', this._invert = true);
                },

                get: function () {
                    return this._invert;
                }
            }
        },

        _destroy: function () {

            this.selection.off(this._onSelectionUpdated);

            this.active = false;
        }

    });

})();