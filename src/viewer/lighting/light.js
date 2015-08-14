/**

 **Light** is the base class for all light source classes in BIMViewer.

 ## Overview

 <ul>
 <li>Light is subclassed by {{#crossLink "AmbientLight"}}{{/crossLink}}, {{#crossLink "DirLight"}}{{/crossLink}} and {{#crossLink "PointLight"}}{{/crossLink}}.</li>
 <li>The number of Lights allowed is governed by the number of ````varying```` types supported in your WebGL.</li>
 </ul>
 @class Light
 @module BIMSURFER
 @submodule lighting
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Light configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Light.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Light = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Light",

        _init: function (cfg) {

            this._lightsManager = getLightsManager(this.viewer);

            this._lightsManager.createLight(this.id, cfg);

            this.active = cfg.active !== false;
        },

        _update: function (params) {
            this._lightsManager.updateLight(this.id, params);
        },

        _props: {

            /**
             * Flag which indicates whether this Light is active or not.
             *
             * Fires an {{#crossLink "Light/active:event"}}{{/crossLink}} event on change.
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

                        this._lightsManager.activateLight(this.id);

                    } else {

                        this._lightsManager.deactivateLight(this.id);
                    }

                    /**
                     * Fired whenever this Light's {{#crossLink "Light/active:property"}}{{/crossLink}} property changes.
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

            this._lightsManager.destroyLight(this.id);

            putLightsManager(this._lightsManager);
        }
    });

    function LightsManager(id, viewer) {

        this.id = id;
        this.viewer = viewer;
        this._lightsNode = null;
        this.lights = [];
        this.lightsMap = {};
        this.activeLights = {};
        this.useCount = 0;

        this.lightNodeDirty = true;
        this.lightsUpdate = null;

        var self = this;

        this.tickSub = viewer.on("tick",
            function () {

                if (self.lightNodeDirty) {

                    // Build list of lights params

                    var lights = [];
                    var i;
                    var activeLight;

                    for (var id in self.lightsMap) {
                        if (self.lightsMap.hasOwnProperty(id)) {

                            if (self.activeLights[id] === true) {

                                // Light is active, add to list
                                i = self.lightsMap[id];
                                activeLight = self.lights[i];
                                lights.push(activeLight);
                            }
                        }
                    }

                    // Update lights node

                    self._createLightsNode(lights);
                    self.lightNodeDirty = false;
                }

                if (self.lightsUpdate && self._lightsNode) {
                    self._lightsNode.setLights(self.lightsUpdate);
                    self.lightsUpdate = null;
                }
            });
    }

    LightsManager.prototype._createLightsNode = function (lights) {

        this._destroyLightsNode();

        // Insert lights node above scene graph content root

        var contentRootNode = this.viewer.scene.getNode("contentRoot");

        var parent = contentRootNode.parent;

        var children = parent.disconnectNodes();

        this._lightsNode = parent.addNode({
            type: "lights",
            lights: lights
        });

        this._lightsNode.addNodes(children);
    };

    //
    LightsManager.prototype._destroyLightsNode = function () {

        if (!this._lightsNode) {
            return;
        }

        // Extract lights node from scene graph,
        // moving its children up to its parent

        this._lightsNode.splice();
        this._lightsNode.destroy();
        this._lightsNode = null;
    };

    LightsManager.prototype.createLight = function (lightId, params) {
        this.lights.push(params);
        this.lightsMap[lightId] = this.lights.length - 1;
        this.activeLights[lightId] = params.active !== false;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.activateLight = function (lightId) {
        this.activeLights[lightId] = true;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.deactivateLight = function (lightId) {
        this.activeLights[lightId] = false;
        this.lightNodeDirty = true;
    };

    LightsManager.prototype.updateLight = function (lightId, params) {
        if (!this.lightsUpdate) {
            this.lightsUpdate = {};
        }
        var idx = this.lightsMap[lightId];
        var light = this.lightsUpdate[idx] || (this.lightsUpdate[idx] = {});
        BIMSURFER._apply(params, light);
    };

    LightsManager.prototype.destroyLight = function (lightId) {

        var i = this.lightsMap[lightId];

        // Delete light
        this.lights.splice(i, 1);
        delete this.lightsMap[lightId];
        delete this.activeLights[lightId];
        delete this.lightsUpdate[lightId];

        // Adjust indices in lights map
        for (var id in this.lightsMap) {
            if (this.lightsMap.hasOwnProperty(id)) {
                if (this.lightsMap[id] >= i) {
                    this.lightsMap[id]--;
                }
            }
        }

        this.lightNodeDirty = true;
    };

    LightsManager.prototype.destroy = function () {
        this.viewer.off(this.tickSub);
        this._destroyLightsNode();
    };


    // A LightsManager for each Viewer,
    // created on-demand by BIMSURFER.Lights components
    var managers = {};


    // Gets a LightsManager for the given Viewer
    // reuses any instance already created for that Viewer
    function getLightsManager(viewer) {
        var id = viewer.id;
        var manager = managers[id];
        if (!manager) {
            manager = new LightsManager(id, viewer);
            managers[id] = manager;
        }
        manager.useCount++;
        return manager;
    }

    // Releases a LightsManager to the pool, destroying it if
    // there are no more references to it
    function putLightsManager(manager) {
        if (--manager.useCount <= 0) {
            delete managers[manager.id];
            manager.destroy();
        }
    }
})();
