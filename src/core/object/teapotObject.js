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