/**
 An **Object** is a visible 3D element within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 In the example below we'll create three Objects, each with a unique ID and a modelling transform.

 <iframe style="width: 600px; height: 400px" src="../../examples/object_Object.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [10, 10, -10]
    });

 // Create a CameraControl to control our Camera with mouse and keyboard
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer, {
        id: "myGeometry"
    });

 // Create first Object
 // Use the Geometry
 var object21 = new BIMSURFER.Object(viewer, {
        id: "myObject1",
        type: "IfcCovering",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-4, 0,0])
    });

 // Create second Object
 // Reuse the Geometry
 var object2 = new BIMSURFER.Object(viewer, {
        id: "myObject2",
        type: "IfcFlowTerminal",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([4, 0,0])
    });
 ````

 We can then find the objects in the {{#crossLink "Viewer"}}{{/crossLink}} by ID:

 ````javascript
 var foo = viewer.components["myObject1"];
 ````
 or by IFC type:
 ````javascript

 // Get all Objects of the given IFC type
 var wallObjects = viewer.components["IfcWall"];

 // Get our "foo" object from those
 var foo = wallObjects["moObject1"];
 ````



 @class Object
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Object.
 @param [cfg.type] {String} The IFC type of this Object.
 @param [cfg.color] {Array of Number} The color of this Object, defaults to the color of the specified IFC type.
 @param [cfg.geometries] {Array of Geometry} The {{#crossLink "Geometry"}}{{/crossLink}} to render for this Object.
 @param [cfg.clipping=true] {Boolean} Whether this Object is clipped by {{#crossLink "Clips"}}{{/crossLink}}.
 @param [cfg.transparent=false] {Boolean} Whether this Object is transparent or not.
 @param [cfg.opacity=1] {Number} Scalar in range 0-1 that controls opacity, where 0 is completely transparent and 1 is completely opaque.
 Only applies while this Object's {{#crossLink "Object/transparent:property"}}transparent{{/crossLink}} equals ````true````.
 @param [cfg.highlight=false] {Boolean} Whether this Object is highlighted or not.
 @param [cfg.xray=false] {Boolean} Whether this Object is highlighted or not.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Object = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Object",

        _init: function (cfg) {

            this._color = [1, 1, 1, 1];

            this._opacity = 1.0;

            var contentNode = this.viewer.scene.getNode("contentRoot");

            this._rootNode = contentNode.addNode();

            this._enableNode = this._rootNode.addNode({
                type: "enable"
            });

            this._flagsNode = this._enableNode.addNode({
                type: "flags",
                flags: {
                    backfaces: false
                }
            });

            this._materialNode = this._flagsNode.addNode({
                type: "material",
                specularColor: { r: 1, g: 1, b: 1 }
            });

            this._matrixNode = this._materialNode.addNode({
                type: "matrix"
            });

            this._nameNode = this._matrixNode.addNode({
                type: "name",
                name: this.id
            });

            this._geometryNodes = [];

            if (cfg.geometries) {

                // Use the given Geometry components

                var geometries = cfg.geometries;
                var geometry;

                for (var i = 0, len = geometries.length; i < len; i++) {

                    geometry = geometries[i];

                    if (BIMSURFER._isString(geometry)) {

                        // Geometry is the ID of a BIMSURFER.Geometry within the Viewer

                        geometry = this.viewer.components[geometry];

                        if (!geometry) {
                            this.error("geometry[" + i + "] not found in viewer");
                            continue;
                        }

                        if (!geometry.coreId) {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                    } else {

                        // Geometry is an instance of a BIMSURFER.Geometry within the Viewer

                        if (!geometry.coreId) {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                        if (geometry.viewer.id != this.viewer.id) {
                            this.error("geometry[" + i + "] is not within the same Viewer");
                            continue;
                        }
                    }

                    this._geometryNodes.push(
                        this._nameNode.addNode({
                            type: "geometry",
                            coreId: geometry.coreId
                        }));
                }

            } else {

                // Use the Viewer's default box-shaped  BIMSURFER.Geometry,
                // creating that first if needed

                var geometry = this.viewer.components["geometry.default"];

                if (!geometry) {
                    geometry = new BIMSURFER.Geometry(this.viewer, {
                        id: "geometry.default"
                    });
                }

                this._geometryNodes.push(
                    this._nameNode.addNode({
                        type: "geometry",
                        coreId: geometry.coreId
                    }));
            }

            this._initBoundary();

            this.type = cfg.type;

            if (this.type) {

                if (cfg.color) {

                    this.color = cfg.color;

                } else {

                    var color;

                    var materials = BIMSURFER.constants.materials;

                    if (!materials) {

                        this.warn("Property expected in BIMSURFER.constants: materials");

                    } else {

                        color = materials[this.type];

                        if (!color) {

                            this.log("Material not found for type: ", this.type);

                            color = materials["DEFAULT"];
                        }

                        if (!color) {

                            this.log("Default material not found for type: ", this.type);
                        }
                    }

                    this.color = color || [ 0.8470588235, 0.427450980392, 0, 1.0];
                }

            } else {

                this.color = cfg.color;
            }

            this.transparent = cfg.transparent;

            this.opacity = cfg.opacity;

            this.xray = cfg.xray;

            this.highlight = cfg.highlight;

            this.matrix = cfg.matrix;

            this.label = cfg.label;

            this.active = cfg.active !== false;
        },

        _initBoundary: function () {

            var i, len;

            // Initial inside-out boundary, ready to expand to fit geometry or sub-objects
            this._modelBoundary = {
                xmin: 1000000.0,
                ymin: 1000000.0,
                zmin: 1000000.0,
                xmax: -1000000.0,
                ymax: -1000000.0,
                zmax: -1000000.0
            };

            var geometry;
            for (i = 0, len = this._geometryNodes.length; i < len; i++) {
                geometry = this._geometryNodes[i];
                this._expandBoundaryByBoundary(this._modelBoundary, geometry.getBoundary());
            }

            this._modelCenter = [
                    (this._modelBoundary.xmax + this._modelBoundary.xmin) * 0.5,
                    (this._modelBoundary.ymax + this._modelBoundary.ymin) * 0.5,
                    (this._modelBoundary.zmax + this._modelBoundary.zmin) * 0.5
            ];

            this._modelBoundaryVerts = this._boundaryToVerts(this._modelBoundary);

            this._center = [0, 0, 0];
            this._boundary = null;
        },

        _expandBoundaryByBoundary: function (a, b) {
            if (a.xmin > b.xmin) {
                a.xmin = b.xmin;
            }
            if (a.ymin > b.ymin) {
                a.ymin = b.ymin;
            }
            if (a.zmin > b.zmin) {
                a.zmin = b.zmin;
            }
            if (a.xmax < b.xmax) {
                a.xmax = b.xmax;
            }
            if (a.ymax < b.ymax) {
                a.ymax = b.ymax;
            }
            if (a.zmax < b.zmax) {
                a.zmax = b.zmax;
            }
        },

        _boundaryToVerts: function (boundary) {
            return [
                [boundary.xmin, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymax, boundary.zmax],
                [boundary.xmin, boundary.ymax, boundary.zmax]
            ];
        },

        _vertsToBoundary: function (verts) {
            var xmin = 100000;
            var ymin = 100000;
            var zmin = 100000;
            var xmax = -100000;
            var ymax = -100000;
            var zmax = -100000;
            var x, y, z;
            for (var i = 0, len = verts.length; i < len; i++) {
                x = verts[i][0];
                y = verts[i][1];
                z = verts[i][2];
                if (x === undefined || x === null ||
                    y === undefined || y === null ||
                    z === undefined || z === null) {
                    continue;
                }
                if (x < xmin) {
                    xmin = x;
                }
                if (y < ymin) {
                    ymin = y;
                }
                if (z < zmin) {
                    zmin = z;
                }
                if (x > xmax) {
                    xmax = x;
                }
                if (y > ymax) {
                    ymax = y;
                }
                if (z > zmax) {
                    zmax = z;
                }
            }
            return { xmin: xmin, ymin: ymin, zmin: zmin, xmax: xmax, ymax: ymax, zmax: zmax };
        },

        _props: {

            /**
             * Whether this Object is active or not.
             *
             * Fires an {{#crossLink "Object/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._enableNode.setEnabled(value);

                    if (this.label) {
                        this.label.active = value;
                    }

                    /**
                     * Fired whenever this Object's {{#crossLink "Object/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            /**
             Whether this Object is transparent.

             @property transparent
             @default false
             @type Boolean
             */
            transparent: {

                set: function (value) {

                    value = !!value;

                    if (this._transparent === value) {
                        return;
                    }

                    this._transparent = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._transparent;
                }
            },

            /**
             Whether this Object is highlighted.

             @property highlighted
             @default false
             @type Boolean
             */
            highlight: {

                set: function (value) {

                    if (this._highlighted === value) {
                        return;
                    }

                    this._highlighted = value;

                    if (value) {
                        this._desaturated = false;
                    }

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._highlighted;
                }
            },

            /**
             Whether this Object is desaturated.

             @property desaturated
             @default false
             @type Boolean
             */
            desaturate: {

                set: function (value) {

                    if (this._desaturated === value) {
                        return;
                    }

                    this._desaturated = value;

                    if (value) {
                        this._highlighted = false;
                    }

                    this._materialNode.setColor(
                        this._desaturated
                            ? { r: 0.4, g: 0.4, b: 0.4 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._desaturated;
                }
            },

            /**
             Whether this Object is X-rayed

             @property xray
             @default false
             @type Boolean
             */
            xray: {

                set: function (value) {

                    value = !!value;

                    if (this._xray === value) {
                        return;
                    }

                    this._xray = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._xray;
                }
            },

            /**
             The color of this Object.

             @property color
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            color: {

                set: function (value) {

                    if (!value) {

                        var materials = BIMSURFER.constants.materials;

                        if (materials) {
                            value = materials["DEFAULT"];
                        }
                    }

                    this._color = value || [ 0.8470588235, 0.427450980392, 0, 1.0];

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._color;
                }
            },

            /**
             Factor in the range [0..1] indicating how transparent this Object is.

             A value of 0.0 indicates fully transparent, 1.0 is fully opaque.

             This Object will appear transparent only if {{#crossLink "Object/transparent:property"}}{{/crossLink}} is also
             set to **true**.

             @property opacity
             @default 1.0
             @type Number
             */
            opacity: {

                set: function (value) {

                    this._opacity = value !== null && value !== undefined ? value : 0.4;

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._opacity;
                }
            },

            /**
             * This Object's transformation matrix.
             *
             * @property matrix
             * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
             * @type {Array of Number}
             */
            matrix: {

                set: function (value) {

                    value = value || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

                    this._matrixNode.setElements(value);

                    this._boundary = null;

                    this.fire('matrix', this._matrix = value);
                },

                get: function () {
                    return this._matrix;
                }
            },

            /**
             * The World-space boundary of this Object.
             *
             * @property boundary
             * @type {*}
             */
            boundary: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._boundary;
                }
            },

            /**
             * The World-space center of this Object.
             *
             * @property center
             * @type {Array of Number}
             */
            center: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._center;
                }
            },

            /**
             * Indicates if this Object shows a debug {{#crossLink "Label"}}{{/crossLink}}.
             *
             * @property label
             * @type Boolean
             */
            label: {

                set: function (value) {

                    value = !!value;

                    if (!!this._label === value) {
                        return;
                    }

                    if (value) {

                        if (this._label) {


                        } else {

                            this._label = new BIMSURFER.Label(viewer, {
                                object: this,
                                text: "<b>" + this.className + "<hr style=\"height=1px; background: darkgray; border: 0;\"></b>" + (this.type ? ("type='" + this.type + "'<br>") : "") + "id='" + this.id + "'",
                                pos: [0, 0, 0]
                            });
                        }

                    } else {

                        this._label.destroy();

                        this._label = null;
                    }
                },

                get: function () {
                    return !!this._label;
                }
            }
        },

        _destroy: function () {

            this._rootNode.destroy();

            if (this.label) {
                this.label.destroy();
            }
        }
    });

})();