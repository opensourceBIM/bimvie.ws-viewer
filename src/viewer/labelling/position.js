/**
 A **Position** is a spatial location within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 A Position provides its coordinates in each of BIMSurfer's five coordinate systems:

 <ul>
 <li>{{#crossLink "Position/pos:property"}}{{/crossLink}} - 3D coordinates within the Position's local Model coordinate system.</li>
 <li>{{#crossLink "Position/worldPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current World coordinate
 system, after transformation by the {{#crossLink "Position/matrix:property"}}Position's modelling matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/viewPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current View
 coordinate system, after transformation by the {{#crossLink "Viewer/viewMatrix:property"}}Viewer's view matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/projPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current Projection
 coordinate system, after transformation by the {{#crossLink "Viewer/projMatrix:property"}}Viewer's projection matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/canvasPos:property"}}{{/crossLink}} - 2D coordinates within the Viewer's current Canvas
 coordinate system.</li>
 </ul>

 ## Example

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
     eye: [20, 20, -20]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a Position
 new BIMSURFER.Position(viewer, {
    pos: [0,0,0],
    matrix: BIMSURFER.math.translationMat4v([4, 0,0])
 });

 ````

 @class Position
 @module BIMSURFER
 @module labelling
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Position.
 @param [cfg.pos] {Array of Number} Position's 3D location.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Position = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Position",

        _init: function (cfg) {

            this._viewMatrix = this.viewer.viewMatrix;
            this._projMatrix = this.viewer.projMatrix;

            this._pos = [0, 0, 0];
            this._worldPos = [0, 0, 0];
            this._viewPos = [0, 0, 0];
            this._projPos = [0, 0, 0];
            this._canvasPos = [0, 0, 0];

            this._updatedirty = true;
            this._worldPosDirty = true;
            this._viewPosDirty = true;
            this._projPosDirty = true;
            this._canvasPosDirty = true;

            var self = this;

            this._onViewMatrix = this.viewer.on("viewMatrix",
                function (matrix) {

                    self._viewMatrix = matrix;

                    self._updatedirty = true;
                    self._viewPosDirty = true;
                    self._projPosDirty = true;
                    self._canvasPosDirty = true;
                });

            this._onProjMatrix = this.viewer.on("projMatrix",
                function (matrix) {

                    self._projMatrix = matrix;

                    self._updatedirty = true;
                    self._projPosDirty = true;
                    self._canvasPosDirty = true;
                });

            this._onTick = this.viewer.on("tick",
                function () {
                    if (self._updatedirty) {
                        self.fire("updated");
                        self._updatedirty = false;
                    }
                });

            this.pos = cfg.pos;

            this.matrix = cfg.matrix;
        },

        _props: {

            /**
             * The Position's 3D coordinates within its local Model coordinate system, ie. before transformation by
             * the Position's {{#crossLink "Position/matrix:property"}}matrix{{/crossLink}}.
             *
             * @property pos
             * @default [0,0,0]
             * @type {Array of Number}
             */
            pos: {

                set: function (value) {

                    value = value || [0, 0, 0];

                    if (value[0] !== this._pos[0] ||
                        value[1] !== this._pos[1] ||
                        value[2] !== this._pos[2]) {

                        this._pos[0] = value[0];
                        this._pos[1] = value[1];
                        this._pos[2] = value[2];

                        this._updatedirty = true;
                        this._worldPosDirty = true;
                        this._viewPosDirty = true;
                        this._projPosDirty = true;
                        this._canvasPosDirty = true;
                    }
                },

                get: function () {
                    return this._pos;
                }
            },

            /**
             * This Positions's 4x4 modelling transformation matrix.
             *
             * @property matrix
             * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
             * @type {Array of Number}
             */
            matrix: {

                set: function (value) {

                    value = value || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

                    this._updatedirty = true;
                    this._worldPosDirty = true;
                    this._viewPosDirty = true;
                    this._projPosDirty = true;
                    this._canvasPosDirty = true;

                    this._matrix = value;
                },

                get: function () {
                    return this._matrix;
                }
            },

            /**
             * This Position's 3D coordinates within the World coordinate system, ie. after transformation by
             * the Position's {{#crossLink "Position/matrix:property"}}matrix{{/crossLink}} and before
             * transformation by Viewer's {{#crossLink "Viewer/viewMatrix:property"}}viewing matrix{{/crossLink}}.
             *
             * @property worldPos
             * @final
             * @default [0,0,0]
             * @type {Array of Number}
             */
            worldPos: {

                get: function () {

                    if (this._worldPosDirty) {

                        if (this._matrix) {

                            BIMSURFER.math.transformPoint3(this._matrix, this._pos, this._worldPos);

                        } else {

                            this._worldPos[0] = this._pos[0];
                            this._worldPos[1] = this._pos[1];
                            this._worldPos[2] = this._pos[2];
                        }

                        this._worldPosDirty = false;
                    }

                    return this._worldPos;
                }
            },

            /**
             * This Position's 3D coordinates within the View coordinate system, ie. after transformation by
             * the Viewer's {{#crossLink "Viewer/viewMatrix:property"}}view matrix{{/crossLink}} and before
             * transformation by the Viewer's {{#crossLink "Viewer/projMatrix:property"}}projection matrix{{/crossLink}}.
             *
             * @property viewPos
             * @final
             * @type {Array of Number}
             */
            viewPos: {

                get: function () {

                    if (this._viewPosDirty) {

                        BIMSURFER.math.transformPoint3(this._viewMatrix, this.worldPos, this._viewPos);

                        this._viewPos[3] = 1; // Need homogeneous 'w' for perspective division

                        this._viewPosDirty = false;
                    }

                    return this._viewPos;
                }
            },

            /**
             * This Position's 3D homogeneous coordinates within the Projection coordinate system, ie. after transformation by
             * the Viewer's {{#crossLink "Viewer/projMatrix:property"}}projection matrix{{/crossLink}}.
             *
             * @property projPos
             * @final
             * @type {Array of Number}
             */
            projPos: {

                get: function () {

                    if (this._projPosDirty) {

                        BIMSURFER.math.transformPoint3(this._projMatrix, this.viewPos, this._projPos);

                        this._projPosDirty = false;
                    }

                    return this._projPos;
                }
            },

            /**
             * This Position's 2D coordinates within the Canvas coordinate system.
             *
             * @property canvasPos
             * @final
             * @type {Array of Number}
             */
            canvasPos: {

                get: function () {

                    if (this._canvasPosDirty) {

                        var projPos = this.projPos;

                        var x = projPos[0];
                        var y = projPos[1];
                        var w = projPos[3];

                        var canvas = this.viewer.canvas.canvas;

                        this._canvasPos[0] = Math.round((1 + x / w) * canvas.width / 2);
                        this._canvasPos[1] = Math.round((1 - y / w) * canvas.height / 2);

                        this._canvasPosDirty = false;
                    }

                    return this._canvasPos;
                }
            }
        },

        _destroy: function () {

            this.viewer.off(this._onViewMatrix);

            this.viewer.off(this._onProjMatrix);

            this.viewer.off(this._onTick);
        }
    });
})();