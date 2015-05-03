/**
 TODO

 ## Overview

 TODO

 ## Example

 TODO

 @class Selection
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Selection.
 @param [cfg.objects] {{Array of String|Object}} Array of {{#crossLink "Object"}}{{/crossLink}} IDs or instances.
 @extends Object
 */
(function () {

    "use strict";

    /**
     * A selection of {@link BIMSURFER.Object}s within a {@link BIMSURFER.Viewer}.
     */
    BIMSURFER.Selection = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Selection",

        _init: function (cfg) {

            var self = this;

            this.objects = {};

            // Subscribe to each Object's transform matrix
            // so we can mark selection boundary dirty
            this._onObjectMatrix = {};

            this.numObjects = 0;

            this._boundary = {xmin: 0.0, ymin: 0.0, zmin: 0.0, xmax: 0.0, ymax: 0.0, zmax: 0.0 };
            this._center = [0, 0, 0];

            this._boundaryDirty = true;

            this._onComponentDestroyed = this.viewer.on("componentDestroyed",
                function (component) {

                    if (self.objects[component.id]) {

                        delete self.objects[component.id];

                        self._boundaryDirty = true;

                        self.fire("updated", {
                            removed: {
                                objectIds: [component.id]
                            }
                        });
                    }
                });

            if (cfg.objects) {
                this.addObjects(cfg.objects);
            }

            if (cfg.objectIds) {
                this.addObjectIds(cfg.objectIds);
            }

            if (cfg.types) {
                this.addTypes(cfg.types);
            }
        },

        clear: function () {
            for (var objectId in this.objects) {
                if (this.objects.hasOwnProperty(objectId)) {
                    this._removeObject(this.objects[objectId]);
                }
            }

            this.fire("updated", {
                cleared: true
            });
        },

        addObjects: function (objects) {

            for (var i = 0, len = objects.length; i < len; i++) {
                this._addObject(objects[i]);
            }

            this.fire("updated", {
                added: {
                    objects: objects
                }
            });
        },

        _addObject: function (object) {

            var objectId = object.id;

            // Ensure Object is in same Viewer as this Selection
            if (object.viewer != this.viewer) {
                this.warn("Attempted to add object that's not in same BIMSURFER.Viewer: '" + objectId + "'");
                return;
            }

            // Subscribe to each Object's transform matrix
            // so we can mark selection boundary dirty
            this._onObjectMatrix[objectId] = object.on("matrix",
                function () {
                    self._boundaryDirty = true;
                });

            this.objects[objectId] = object;
            this.numObjects++;

            this._boundaryDirty = true;
        },

        _removeObject: function (object) {

            var objectId = object.id;

            if (object.viewer != this.viewer) {
                this.warn("Attempted to remove object that's not in same BIMSURFER.Viewer: '" + objectId + "'");
                return;
            }

            object.off(this._onObjectMatrix[objectId]);

            delete this.objects[objectId];
            this.numObjects--;

            this._boundaryDirty = true;
        },

        removeObjects: function (objects) {

            for (var i = 0, len = objects.length; i < len; i++) {
                this._removeObject(objects[i]);
            }

            this.fire("updated", {
                removed: {
                    objects: objects
                }
            });
        },

        addObjectIds: function (objectIds) {

            var objectId;
            var object;

            for (var i = 0, len = objectIds.length; i < len; i++) {

                objectId = objectIds[i];
                object = this.viewer.components[objectId];

                if (!object) {
                    this.warn("addObjectIds - object not found: '" + objectId + "'");
                    continue;
                }

                this._addObject(object);
            }

            this.fire("updated", {
                added: {
                    objectIds: objectIds
                }
            });
        },

        removeObjectIds: function (objectIds) {

            var objectId;
            var object;

            for (var i = 0, len = objectIds.length; i < len; i++) {

                objectId = objectIds[i];
                object = this.viewer.components[objectId];

                if (!object) {
                    this.warn("removeObjectIds - object not found: '" + objectId + "'");
                    continue;
                }

                this._removeObject(object);
            }

            this.fire("updated", {
                removed: {
                    objectIds: objectIds
                }
            });
        },

        addTypes: function (types) {

            var type;
            var t;
            var objectId;
            var object;

            for (var i = 0, len = types.length; i < len; i++) {

                type = types[i];
                t = this.viewer.types[type];

                if (!t) {
                    this.warn("addTypes - type not found: '" + t + "'");
                    continue;
                }

                for (objectId in t) {
                    if (t.hasOwnProperty(objectId)) {
                        this._addObject(t[objectId]);
                    }
                }
            }

            this.fire("updated", {
                added: {
                    types: types
                }
            });
        },

        removeTypes: function (types) {

            var type;
            var t;
            var objectId;

            for (var i = 0, len = types.length; i < len; i++) {

                type = types[i];
                t = this.viewer.types[type];

                if (!t) {
                    this.warn("removeTypes - type not found: '" + type + "'");
                    continue;
                }

                for (objectId in t) {
                    if (t.hasOwnProperty(objectId)) {
                        this._removeObject(this.objects[objectId]);
                    }
                }
            }

            this.fire("updated", {
                removed: {
                    types: types
                }
            });
        },

        /**
         * Iterates with a callback over the objects in this selection
         *
         * @param {String} typeNames List of type names
         * @param {Function} callback Callback called for each Component of the given types
         */
        withObjects: function (callback) {
            for (var objectId in this.objects) {
                if (this.objects.hasOwnProperty(objectId)) {
                    callback(this.objects[objectId]);
                }
            }
        },

        _rebuildBoundary: function () {

            if (!this._boundaryDirty) {
                return;
            }

            // For an empty selection, boundary is zero volume and centered at the origin

            if (this.numObjects === 0) {
                this._boundary.xmin = 0.0;
                this._boundary.ymin = 0.0;
                this._boundary.zmin = 0.0;
                this._boundary.xmax = 0.0;
                this._boundary.ymax = 0.0;
                this._boundary.zmax = 0.0;

            } else {

                // Set boundary inside-out, ready to expand by each selected object

                this._boundary.xmin = 1000000.0;
                this._boundary.ymin = 1000000.0;
                this._boundary.zmin = 1000000.0;
                this._boundary.xmax = -1000000.0;
                this._boundary.ymax = -1000000.0;
                this._boundary.zmax = -1000000.0;

                var object;
                var boundary;

                for (var objectId in this.objects) {
                    if (this.objects.hasOwnProperty(objectId)) {

                        object = this.objects[objectId];

                        boundary = object.boundary;

                        if (boundary.xmin < this._boundary.xmin) {
                            this._boundary.xmin = boundary.xmin;
                        }
                        if (boundary.ymin < this._boundary.ymin) {
                            this._boundary.ymin = boundary.ymin;
                        }
                        if (boundary.zmin < this._boundary.zmin) {
                            this._boundary.zmin = boundary.zmin;
                        }
                        if (boundary.xmax > this._boundary.xmax) {
                            this._boundary.xmax = boundary.xmax;
                        }
                        if (boundary.ymax > this._boundary.ymax) {
                            this._boundary.ymax = boundary.ymax;
                        }
                        if (boundary.zmax > this._boundary.zmax) {
                            this._boundary.zmax = boundary.zmax;
                        }
                    }
                }
            }

            this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
            this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
            this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;

            this._boundaryDirty = false;
        },

        _props: {

            boundary: {

                get: function () {

                    if (this._boundaryDirty) {

                        this._rebuildBoundary();

                        return this._boundary;
                    }
                }
            },

            center: {

                get: function () {

                    if (this._boundaryDirty) {

                        this._rebuildBoundary();

                        return this._center;
                    }
                }
            }
        },

        _destroy: function () {

            this.clear();

            this.viewer.off(this._onComponentDestroyed);

            this.active = false;
        }
    });

})();