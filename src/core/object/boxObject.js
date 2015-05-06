/**
 An **BoxObject** is a box-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 TODO

 @class BoxObject
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

    BIMSURFER.BoxObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.BoxObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.BoxGeometry(this.viewer)
                ]
            }, cfg));
        },


        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();