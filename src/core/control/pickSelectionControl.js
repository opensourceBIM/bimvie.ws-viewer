(function () {

    "use strict";

    /**
     * Selects {@link BIMSURFER.Object}s within a {@link BIMSURFER.Selection}.
     */
    BIMSURFER.PickSelectionControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.PickSelectionControl",

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

                        this._onPicked = this.viewer.on("picked",
                            function (params) {

                                //var multiSelect =

                                var object = params.object;

                                if (!self.selection.objects[object.id]) {

                                    // Select

                                    if (!self._multi) {
                                        self.selection.clear();
                                    }

                                    self.selection.addObjects([object]);

                                } else {

                                    // Deselect

                                    self.selection.removeObjects([object]);
                                }
                            });

                        this._onNothingPicked = this.viewer.on("nothingPicked",
                            function () {

                                if (!self._multi) {
                                    self.selection.clear();
                                }
                            });

                        this.fire('active', this._active = true);

                    } else {

                        this.viewer.off(this._onPicked);
                        this.viewer.off(this._onNothingPicked);

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