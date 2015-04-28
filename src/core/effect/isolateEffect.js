(function () {

    "use strict";

    /**
     * Sets the selected {@link BIMSURFER.Object}s in a  {@link BIMSURFER.Selection} as visible.
     */
    BIMSURFER.IsolateEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.IsolateEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _apply: function (object) {
            var selected = this.selection.objects[object.id];
            object.active = this.invert ? !selected : !!selected;
        }
    });

})();