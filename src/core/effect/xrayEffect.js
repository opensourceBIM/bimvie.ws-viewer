(function () {

    "use strict";

    /**
     * Applies an X-Ray effect to the {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
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