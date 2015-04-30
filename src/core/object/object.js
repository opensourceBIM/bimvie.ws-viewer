(function () {

    "use strict";

    /**
     * Defines an object within a {@link BIMSURFER.Viewer}.
     */
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
                type: "flags"
            });

            this._materialNode = this._flagsNode.addNode({
                type: "material",
                specularColor: { r: 0, g: 0, b: 0 }
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

            if (cfg.ifcType) {

                var ifcType = cfg.ifcType;

                if (cfg.color) {

                    this.color = cfg.color;

                } else {

                    var color;

                    var materials = BIMSURFER.constants.materials;

                    if (!materials) {

                        this.warn("Property expected in BIMSURFER.constants: materials");

                    } else {

                        color = materials[ifcType];

                        if (!color) {

                            this.log("Material not found for ifcType: ", ifcType);

                            color = materials["DEFAULT"];
                        }

                        if (!color) {

                            this.log("Default material not found for ifcType: ", ifcType);
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

            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._enableNode.setEnabled(value);

                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

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

            highlight: {

                set: function (value) {

                    if (this._highlighted === value) {
                        return;
                    }

                    this._highlighted = value;

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._highlighted;
                }
            },

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

            opacity: {

                set: function (value) {

                    this._opacity = value !== null && value !== undefined ? value : 1.0;

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._opacity;
                }
            },

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
            }
        },

        _destroy: function () {
            this._rootNode.destroy();
        }
    });

})();