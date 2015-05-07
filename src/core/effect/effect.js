/**
 An **Effect** is a the base class for visual effects that are applied to {{#crossLink "ObjectSet"}}ObjectSets{{/crossLink}}.

 ## Overview

 <ul>
 <li>Effect is subclassed by {{#crossLink "HighlightEffect"}}{{/crossLink}}, {{#crossLink "IsolateEffect"}}{{/crossLink}} and {{#crossLink "XRayEffect"}}{{/crossLink}}.</li>
 <li>Multiple Effects can share the same {{#crossLink "ObjectSet"}}{{/crossLink}} if required.</li>
 <li>An Effect will provide its own default {{#crossLink "ObjectSet"}}{{/crossLink}} when you don't configure it with one.</li>
 </ul>

 @class Effect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Effect.
 @param [objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this Effect to.
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

            /**
             * The {{#crossLink "ObjectSet"}}{{/crossLink}} that this Effect applies to.
             *
             * @property objectSet
             * @type ObjectSet
             */
            this.objectSet = cfg.objectSet || new BIMSURFER.ObjectSet(this.viewer);

            this._dirty = true;

            var self = this;

            this._onObjectSetUpdated = this.objectSet.on("updated",
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

            /**
             * Flag which inverts the {{#crossLink "Object"}}Objects{{/crossLink}} that this Effect applies to.
             *
             * <ul>
             *     <li>When true, this Effect applies to {{#crossLink "Object"}}Objects{{/crossLink}} that are in
             *     the {{#crossLink "Component/viewer:property"}}{{/crossLink}} but **not** in the {{#crossLink "Effect/objectSet:property"}}{{/crossLink}}.</li>
             *
             *     <li>When false, this Effect applies to {{#crossLink "Object"}}Objects{{/crossLink}} that are in
             *     the {{#crossLink "Component/viewer:property"}}{{/crossLink}} and **also** in the {{#crossLink "Effect/objectSet:property"}}{{/crossLink}}.</li>
             * </ul>
             *
             * Fires an {{#crossLink "Effect/invert:event"}}{{/crossLink}} event on change.
             *
             * @property invert
             * @type Boolean
             */
            invert: {

                set: function (value) {

                    if (this._invert === value) {
                        return;
                    }

                    self._dirty = false;

                    /**
                     * Fired whenever this Effect's {{#crossLink "Effect/invert:property"}}{{/crossLink}} property changes.
                     * @event invert
                     * @param value The property's new value
                     */
                    this.fire('invert', this._invert = true);
                },

                get: function () {
                    return this._invert;
                }
            }
        },

        _destroy: function () {

            this.objectSet.off(this._onObjectSetUpdated);

            this.active = false;
        }

    });

})();