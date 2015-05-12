/**
 A **Label** is a user-defined HTML element that floats over a 3D position within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 <ul>
 <li>When configured with an {{#crossLink "Object"}}{{/crossLink}}, a Label will always track
 its {{#crossLink "Object"}}Object's{{/crossLink}} position, offset by the vector indicated
 in {{#crossLink "Label/pos:property"}}{{/crossLink}}.</li>

 <li>For debugging purposes, an {{#crossLink "Object"}}{{/crossLink}} has its own built-in Label, 
 which can be shown by setting the {{#crossLink "Object"}}Object's{{/crossLink}} 
 {{#crossLink "Object/label:property"}}{{/crossLink}} property true.</li>
 </ul>

 A Label can be queried for its coordinates within each of BIMSurfer's five coordinate systems:

 <ul>
 <li>{{#crossLink "Label/pos:property"}}{{/crossLink}} - 3D coordinates within the Label's local Model coordinate system.</li>
 <li>{{#crossLink "Label/worldPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current World coordinate
 system, after transformation by the {{#crossLink "Label/matrix:property"}}Label's modelling matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Label/viewPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current View
 coordinate system, after transformation by the {{#crossLink "Viewer/viewMatrix:property"}}Viewer's view matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Label/projPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current Projection
 coordinate system, after transformation by the {{#crossLink "Viewer/projMatrix:property"}}Viewer's projection matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Label/canvasPos:property"}}{{/crossLink}} - 2D coordinates within the Viewer's current Canvas
 coordinate system.</li>
 </ul>


 ## Example

 <iframe style="width: 800px; height: 400px" src="../../examples/label_Label.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [20, 15, -20],
        look: [0,-10,0]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them
 // Activate their debug Labels

 var object1 = new BIMSURFER.Object(viewer, {
        id: "object1",
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        id: "object2",
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        id: "object3",
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        id: "object4",
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create some Labels on two of the Objects
 // Each Label displays a snippet of HTML and is positioned relative to its Object's origin

 var label1 = new BIMSURFER.Label(viewer, {
        object: object1,
        text: "<b>Label on Object 'object1'</b><br><br><iframe width='320' height='200' src='https://www.youtube.com/embed/oTONvRtlW44' frameborder='0' allowfullscreen></iframe>",
        pos: [0, 2, 0] // Offset from Object's local Model-space origin
    });

 var label2 = new BIMSURFER.Label(viewer, {
        object: object4,
        text: "<b>First Label on Object 'object2'</b><br>",
        pos: [0, 0, 0] // Offset from Object's local Model-space origin
    });

 var label3 = new BIMSURFER.Label(viewer, {
        object: object4,
        text: "<b>Second label on Object 'object2'</b><br>",
        pos: [0, -2, 0] // Offset from Object's local Model-space origin
    });
 ````

 @class Label
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Label.
 @param [cfg.object] {Object} The {{#crossLink "Object"}}{{/crossLink}} to attach this Label to.
 @param [cfg.text] {String} Text to insert into this Label.
 @param [cfg.pos] {Array of Number} Label's 3D offset from the {{#crossLink "Object"}}Object's{{/crossLink}} origin.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional,
 sixteen element array of elements, an identity matrix by default.
 @extends Position
 */
(function () {

    "use strict";

    BIMSURFER.Label = BIMSURFER.Position.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Label",

        _init: function (cfg) {

            this._super(cfg);

            /**
             * This Label's {{#crossLink "Object"}}{{/crossLink}}.
             *
             * Can be undefined.
             *
             * @property object
             * @type BIMSURFER.Object
             * @final
             */
            this.object = cfg.object;

            $(this.viewer.element).append("<div id ='" + this.id + "' style='position:  absolute; line-height=140%; " +
                "padding:5px; display: none;  border: 1px black solid; top:0px; left: 100px; z-index: 1000; " +
                "background: lightgray; width:auto; height: auto;'>XXXX</div>");

            this.element = $("#" + this.id + "");

            var self = this;

            if (this.object) {
                this._onObjectMatrix = this.object.on("matrix",
                    function (matrix) {

                        self.matrix = matrix;

                    });

                this._onObjectDestroy = this.object.on("destroyed",
                    function () {

                        self.object.off(self._onObjectMatrix);

                        self.object = null;
                    });
            }

            this.text = cfg.text || "";            

            var activate = cfg.active !== false;

            if (!activate) {
                this.active = false;
            }

            this.on("updated",
                function () {

                    var viewPos = self.viewPos;
                    var canvasPos = self.canvasPos;

                    self.element.css({
                        left: canvasPos[0],
                        top: canvasPos[1],
                        zIndex: 100000 + Math.round(viewPos[2])
                    });

                    if (activate) {
                        this.active = true;
                        activate = false;
                    }
                });
        },

        _props: {

            /**
             * Text within this Label.
             *
             * Fires an {{#crossLink "Label/text:event"}}{{/crossLink}} event on change.
             *
             * @property text
             * @type String
             */
            text: {

                set: function (value) {

                    if (this._text === value) {
                        return;
                    }

                    this.element.html(value);

                    /**
                     * Fired whenever this Label's {{#crossLink "Label/text:property"}}{{/crossLink}} property changes.
                     * @event text
                     * @param value The property's new value
                     */
                    this.fire('text', this._text = value);
                },

                get: function () {
                    return this._text;
                }
            },
            
            /**
             * Flag which indicates whether this Label is active or not.
             *
             * Fires an {{#crossLink "Label/active:event"}}{{/crossLink}} event on change.
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
                        this.element.show();

                    } else {
                        this.element.hide();
                    }

                    /**
                     * Fired whenever this Label's {{#crossLink "Label/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            }
        },

        _destroy: function () {

            if (this.object) {

                this.object.off(this._onObjectMatrix);

                this.object.off(this._onObjectDestroy);
            }

            this.element.remove();
        }
    });
})();