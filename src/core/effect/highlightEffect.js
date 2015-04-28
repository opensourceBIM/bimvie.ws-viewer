(function () {

    "use strict";

    /**
     * Applies a highlight effect to the {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.HighlightEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.HighlightEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.highlight = this.invert ? !selected : !!selected;
        }
    });

})();