/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class XRayEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this XRayEffect.
 @param [selection] {Selection} The {{#crossLink "Selection"}}{{/crossLink}} to update.
 @extends Effect
 */
(function () {

    "use strict";

    BIMSURFER.XRayEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.XRayEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.xray = this.invert ? !!selected : !selected;
        }
    });

})();