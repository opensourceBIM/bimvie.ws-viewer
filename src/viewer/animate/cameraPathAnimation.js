(function () {

    "use strict";

    /**
     * Animates a {@link BIMSURFER.Camera} along a path.
     */
    BIMSURFER.CameraPathAnimation = BIMSURFER.Class(BIMSURFER.Control, {

        CLASS: "BIMSURFER.CameraPathAnimation",

        // The SceneJS "lookat" node that this Camera controls
        _lookat: null,

        /**
         * Constructor.
         *
         * @constructor
         */
        __construct: function () {
            this.events = new BIMSURFER.Events(this);
        },

        /**
         * Activates this camera
         */
        activate: function () {

            if (this.SYSTEM == null || !this.SYSTEM.sceneLoaded) {
                console.error('Cannot activate ' + this.CLASS + ': Surfer or scene not ready');
                return null;
            }

            // Bail if already active
            if (this.active) {
                return this;
            }

            // Find scene node
            this._lookat = this.SYSTEM.scene.findNode('theLookat');

            // Activate
            this.active = true;
            this.initEvents();
            this.events.trigger('activated');

            return this;
        },

        /**
         * Initializes the events necessary for the operation of this control
         *
         * @return this
         */
        initEvents: function () {
            return this;
        }

    });
})();