/**
 An **TeapotObject** is a teapot-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 TODO

 @class TeapotObject
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxObject.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.TeapotObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.TeapotObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.TeapotGeometry(this.viewer)
                ]
            }, cfg));
        },

        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();