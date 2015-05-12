/**
 A **Viewer** is a WebGL-based 3D viewer for the visualisation and evaluation of BIM models.

 ## Overview

 <ul>
 <li></li>
 </ul>

 ## Example

 In the example below we'll create a Viewer with a {{#crossLink "Camera"}}{{/crossLink}},
 a {{#crossLink "CameraControl"}}{{/crossLink}} and a {{#crossLink "TeapotGeometry"}}{{/crossLink}},
 which is used by an {{#crossLink "Object"}}{{/crossLink}}.
 <br>Finally, we make the {{#crossLink "Camera"}}{{/crossLink}} orbit on each "tick" event emitted by the Viewer.

 <iframe style="width: 600px; height: 400px" src="../../examples/viewer_Viewer.html"></iframe>

 ````javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({

    // ID of the DIV element
    element: "myDiv"
 });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [5, 5, -5]
    });

 // Create a CameraControl to control our Camera with mouse and keyboard
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer, {
        id: "myGeometry"
    });

 // Create an Object that uses the Geometry
 var object1 = new BIMSURFER.Object(viewer, {
        id: "myObject1",
        type: "IfcCovering",
        geometries: [ geometry ]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });
 ````

 @class Viewer
 @module BIMSURFER
 @constructor
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Object.
 @param cfg.element {String|HTMLElement} ID or instance of a DIV element in the page.
 @param cfg.bimServerApi {*} The BIMServer API.
 */
(function () {

    "use strict";

    BIMSURFER.Viewer = function (cfg) {

        var self = this;

        this.className = "BIMSURFER.Viewer";

        // Event management

        // Pub/sub
        this._handleMap = new BIMSURFER.utils.Map(); // Subscription handle pool
        this._locSubs = {}; // A [handle -> callback] map for each location name
        this._handleLocs = {}; // Maps handles to loc names
        this.props = {}; // Maps locations to publications


        // Check arguments

        cfg = cfg || {};

        var element = cfg.element;

        if (!element) {
            throw "Param expected: element";
        }

        if (typeof element == 'string') {
            element = jQuery('div#' + element)[0];
        }

        if (!jQuery(element).is('div')) {
            throw "Can't find div element";
        }

        // Clear container element

        jQuery(element).empty();

        /**
         * The HTML element ocupied by the Viewer
         *
         * @property element
         * @final
         * @type {HTMLElement}
         */
        this.element = element;


        /**
         * The BIMServer API
         *
         * @property bimServerApi
         * @final
         * @type {Object}
         */
        this.bimServerApi = cfg.bimServerApi;


        this.SYSTEM = this;


        /**
         * Servers connected to this Viewer.
         *
         * @property connectedServers
         * @type {Array of BIMSURFER.Server}
         */
        this.connectedServers = [];


        var canvasId = jQuery(this.element).attr('id') + "-canvas";

        /**
         * The HTML Canvas that this Viewer renders to. This is inserted into the element we configured this Viewer with.
         * @property canvas
         * @final
         * @type {HTMLCanvasElement}
         * @final
         */
        this.canvas = jQuery('<canvas />')
            .attr('id', canvasId)
            .attr('width', jQuery(this.element).width())
            .attr('height', jQuery(this.element).height())
            .html('<p>This application requires a browser that supports the <a href="http://www.w3.org/html/wg/html5/">HTML5</a> &lt;canvas&gt; feature.</p>')
            .addClass(this.className.replace(/\./g, "-"))
            .appendTo(this.element);


        /**
         * The SceneJS scene graph that renders 3D content for this Viewer.
         * @property scene
         * @final
         * @type {SceneJS.Scene}
         * @final
         */
        this.scene = SceneJS.createScene({

            canvasId: canvasId,

            // Transparent canvas
            // Less work for the GPU rendering all those background fragments.
            // Let CSS do that work.
            transparent: true,

            nodes: [

                // Node library, where we keep sharable
                // asset nodes, such as geometries
                {
                    type: "library",
                    id: "library"
                },

                // Viewing transform
                {
                    type: "lookAt",
                    id: "theLookat",

                    nodes: [

                        // Projection transform
                        {
                            type: "camera",
                            id: "theCamera",

                            nodes: [

                                // Light sources
                                {
                                    id: "lightsRoot",
                                    lights: [],

                                    nodes: [

                                        // Content is appended below this node
                                        {
                                            id: "contentRoot"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        /**
         * ID of this Viewer
         *
         * @property id
         * @final
         * @type {String}
         */
        this.id = this.scene.getId();

        // Init events

        var canvas = this.scene.getCanvas();

        this.scene.on('tick',
            function (params) {
                self.fire('tick', {
                    time: params.time * 0.001,
                    elapsed: (params.time - params.prevTime) * 0.001
                });
            });

        this._lookatNode = this.scene.getNode('theLookat');

        this._lookatNode.on("matrix",
            function (matrix) {
                self.fire('viewMatrix', matrix);
            });

        this._cameraNode = this.scene.getNode('theCamera');

        this._cameraNode.on("matrix",
            function (matrix) {
                self.fire('projMatrix', matrix);
            });


        // Pool where we'll keep all component IDs
        this._componentIDMap = new BIMSURFER.utils.Map();

        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their IDs.
         * @property components
         * @final
         * @type {{String:Component}}
         */
        this.components = {};


        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their class names.
         * @property classes
         * @final
         * @type {{String:{String:Component}}}
         */
        this.classes = {};


        /**
         * The {{#crossLink "Component"}}Components{{/crossLink}} within this Viewer, mapped to their IFC type names.
         * @property types
         * @final
         * @type {{String:{String:Component}}}
         */
        this.types = {};


        // Add components

        var components = cfg.components;

        if (components) {

            var component;
            var className;
            var constructor;

            for (var i = 0, len = components.length; i < len; i++) {

                component = components[i];
                className = component.className;

                if (className) {
                    constructor = window[className];

                    if (constructor) {

                        // Adds component to this Viewer via #_addComponent
                        new constructor(this, component);
                    }
                }
            }
        }

        if (BIMSURFER.utils.isset(cfg, cfg.autoStart)) {
            if (!BIMSURFER.Util.isset(cfg.autoStart.serverUrl, cfg.autoStart.serverUsername, cfg.autoStart.serverPassword, cfg.autoStart.projectOid)) {
                console.error('Some autostart parameters are missing');
                return;
            }
            var _this = this;
            var BIMServer = new BIMSURFER.Server(this, cfg.autoStart.serverUrl, cfg.autoStart.serverUsername, cfg.autoStart.serverPassword, false, true, true, function () {
                if (BIMServer.loginStatus != 'loggedin') {
                    _this.element.innerHTML = 'Something went wrong while connecting';
                    console.error('Something went wrong while connecting');
                    return;
                }
                var project = BIMServer.getProjectByOid(cfg.autoStart.projectOid);
                project.loadScene((BIMSURFER.Util.isset(cfg.autoStart.revisionOid) ? cfg.autoStart.revisionOid : null), true);
            });
        }

        /**
         * Geometry loaders
         * @property geometryLoaders
         * @type {Array of }
         * @final
         */
        this.geometryLoaders = [];

        // Start the loading loop
        // This just runs forever, polling any loaders that exist on this viewer

        this.scene.on("tick",
            function () {
                self.geometryLoaders.forEach(
                    function (geometryLoader) {
                        geometryLoader.process();
                    });
            });

        /**
         * Input handling for this Viewer.
         * @property input
         * @final
         * @type {BIMSURFER.Input}
         */
        this.input = new BIMSURFER.Input(this);
    };

    /**
     * Adds a {{#crossLink "Component"}}{{/crossLink}} to this viewer.
     *
     * This is called within the constructors of {{#crossLink "Component"}}{{/crossLink}} subclasses.
     *
     * The {{#crossLink "Component"}}{{/crossLink}} is assigned a
     * unique {{#crossLink "Component/id:property"}}{{/crossLink}} if it does not yet have one.
     *
     * @private
     * @param {BIMSURFER.Component} component The Component to add.
     */
    BIMSURFER.Viewer.prototype._addComponent = function (component) {

        var id = component.id;
        var className = component.className;

        // Check for ID clash

        if (id) {
            if (this.components[id]) {
                this.error("A component with this ID already exists in this Viewer: " + id);
                return;
            }
        } else {
            id = component.id = this._componentIDMap.addItem({});
        }

        // Add component to ID map

        this.components[id] = component;

        // Add component to className map

        var classComponents = this.classes[className];
        if (!classComponents) {
            classComponents = this.classes[className] = {};
        }
        classComponents[id] = component;


        // Add component to type map

        if (component.type) {
            var type = component.type;
            var typeComponents = this.types[type];
            if (!typeComponents) {
                typeComponents = this.types[type] = {};
            }
            typeComponents[id] = component;
        }

        /**
         * Fired whenever a Component has been created within this Viewer.
         * @event componentCreated
         * @param {Component} value The component that was created
         */
        this.fire("componentCreated", component, true);
    };

    /**
     * Removes a {{#crossLink "Component"}}{{/crossLink}} from this Viewer.
     *
     * This is called within the destructors of {{#crossLink "Component"}}{{/crossLink}} subclasses.
     *
     * @private
     * @param {BIMSURFER.Component} component The component to remove
     */
    BIMSURFER.Viewer.prototype._removeComponent = function (component) {

        var id = component.id;
        var className = component.className;

        if (!this.components[id]) {
            console.warn("BIMSURFER.Viewer._removeComponent - Component with this ID is not within Viewer: " + id);
            return;
        }

        delete this.components[id];
        delete this.classes[className][id];

        if (component.type) {
            delete this.types[component.type][id];
        }

        this._componentIDMap.removeItem(id);

        /**
         * Fired whenever a component within this Viewer has been destroyed.
         * @event componentDestroyed
         * @param {Component} value The component that was destroyed
         */
        this.fire("componentDestroyed", component, true);
    };

    /**
     * This Viewer's view transformation matrix.
     *
     * @property viewMatrix
     * @final
     * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     * @type {Array of Number}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "viewMatrix", {

        get: function() {
            return this._lookatNode.getMatrix();
        },

        enumerable: true
    });


    /**
     * This Viewer's projection transformation matrix.
     *
     * @property projMatrix
     * @final
     * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     * @type {Array of Number}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "projMatrix", {

        get: function() {
            return this._cameraNode.getMatrix();
        },

        enumerable: true
    });

    /**
     *
     */
    BIMSURFER.Viewer.prototype.pick = function (x, y, options) {

        var hit = this.scene.pick(x, y, options);

        if (hit) {

            var objectId = hit.name;
            var object = this.components[objectId];

            if (object) {
                return {
                    object: object,
                    canvasPos: hit.canvasPos,
                    worldPos: hit.worldPos
                }
            }
        }
    };

    /**
     * Stores a connection to a server for later use.
     *
     * @param {BIMSURFER.Server} server The server connection to store.
     */
    BIMSURFER.Viewer.prototype.addConnectedServer = function (server) {
        if (this.connectedServers.indexOf(server) == -1) {
            this.connectedServers.push(server);
        }
    };

    /**
     * Resizes the viewport and updates the aspect ratio
     *
     * @param {Number} width The new width in px
     * @param {Number} height The new height in px
     */
    BIMSURFER.Viewer.prototype.resize = function (width, height) {

        if (!this.canvas) {
            // TODO: log
            return;
        }

        jQuery(this.canvas).width(width).height(height);

        if (BIMSURFER.Util.isset(this.canvas[0])) {
            this.canvas[0].width = width;
            this.canvas[0].height = height;
        }

        var cameraNode = this.scene.getNode("theCamera");
        var optics = cameraNode.getOptics();
        optics.aspect = jQuery(this.canvas).width() / jQuery(this.canvas).height();
        cameraNode.setOptics(optics);
    };

    /**
     * Loads and shows the geometry of the revisions that are in the load queue
     */
    BIMSURFER.Viewer.prototype.loadGeometry = function (geometryLoader) {

        var self = this;

        this.geometryLoaders.push(geometryLoader);

        // TODO limit to something useful

        if (this.geometryLoaders.length <= 20) {
            geometryLoader.progressListeners.push(
                function (progress) {
                    if (progress == "done") {
                        removeA(self.geometryLoaders, geometryLoader);
                    }
                });
            geometryLoader.start();
        }
    };

    /**
     * Iterates with a callback over Components of the given classes
     *
     * @param {String} classNames List of class names
     * @param {Function} callback Callback called for each Component of the given classes
     */
    BIMSURFER.Viewer.prototype.withClasses = function (classNames, callback) {
        var className;
        for (var i = 0, len = classNames.length; i < len; i++) {
            className = classNames[i];
            var components = this.classes[className];
            if (components) {
                for (var id in components) {
                    if (components.hasOwnProperty(id)) {
                        callback(components[id]);
                    }
                }
            }
        }
    };

    /**
     * Iterates with a callback over Components of the given IFC types
     *
     * @param {String} typeNames List of type names
     * @param {Function} callback Callback called for each Component of the given types
     */
    BIMSURFER.Viewer.prototype.withTypes = function (typeNames, callback) {
        var typeName;
        for (var i = 0, len = typeNames.length; i < len; i++) {
            typeName = typeNames[i];
            var components = this.types[typeName];
            if (components) {
                for (var id in components) {
                    if (components.hasOwnProperty(id)) {
                        callback(components[id]);
                    }
                }
            }
        }
    };

    /**
     * Shows an IFC type of a revision.
     *
     * @param {Array of String} typeNames Names of types to hide
     * @param {BIMSURFER.ProjectRevision instance} revision The revision
     */
    BIMSURFER.Viewer.prototype.showTypes = function (typeNames, revision) {
        this.withTypes(typeNames,
            function (component) {
                component.active = true;

            });
    };

    /**
     * Hides an IFC type of a revision.
     *
     * @param {Array of String} typeNames Names of types to hide
     * @param {BIMSURFER.ProjectRevision instance} revision The revision
     */
    BIMSURFER.Viewer.prototype.hideTypes = function (typeNames, revision) {
        this.withTypes(typeNames,
            function (component) {
                component.active = false;
            });
    };

    /**
     * Hides all the types of a revision
     *
     * @param {BIMSURFER.ProjectRevision} revision The revision to hide
     */
    BIMSURFER.Viewer.prototype.hideRevision = function (revision) {
//        var visibleTypes = revision.visibleTypes.slice(0);
//        for (var i = 0; i < visibleTypes.length; i++) {
//            this.hideType(visibleTypes[i], revision);
//        }
    };

    /**
     * Shows a revision
     *
     * @param {BIMSURFER.ProjectRevision} revision The revision to show
     * @param {Array} [types] The types to show (default = BIMSURFER.constants.defaultTypes)
     */
    BIMSURFER.Viewer.prototype.showRevision = function (revision, types) {

        if (!types) {

            types = [];

            var defaultTypes = BIMSURFER.constants.defaultTypes;

            if (!defaultTypes) {
                this.warn("Property expected in BIMSURFER.constants: defaultTypes");

            } else {
                for (var i = 0; i < revision.ifcTypes.length; i++) {
                    if (defaultTypes.indexOf(revision.ifcTypes[i]) != -1) {
                        types.push(revision.ifcTypes[i]);
                    }
                }
            }
        }

        this.showType(types, revision);
    };

    /**
     * Fires an event on this Viewer.
     *
     * Notifies existing subscribers to the event, retains the event to give to
     * any subsequent notifications on that location as they are made.
     *
     * @method fire
     * @param {String} event The event type name
     * @param {Object} value The event
     * @param {Boolean} [forget=false] When true, does not retain for subsequent subscribers
     */
    BIMSURFER.Viewer.prototype.fire = function (event, value, forget) {
        if (forget !== true) {
            this.props[event] = value; // Save notification
        }
        var subsForLoc = this._locSubs[event];
        var sub;
        if (subsForLoc) { // Notify subscriptions
            for (var handle in subsForLoc) {
                if (subsForLoc.hasOwnProperty(handle)) {
                    sub = subsForLoc[handle];
                    sub.callback.call(sub.scope, value);
                }
            }
        }
    };

    /**
     * Subscribes to an event on this Viewer.
     *
     * The callback is be called with this Viewer as scope.
     *
     * @method on
     * @param {String} event Publication event
     * @param {Function} callback Called when fresh data is available at the event
     * @param {Object} [scope=this] Scope for the callback
     * @return {String} Handle to the subscription, which may be used to unsubscribe with {@link #off}.
     */
    BIMSURFER.Viewer.prototype.on = function (event, callback, scope) {
        var subsForLoc = this._locSubs[event];
        if (!subsForLoc) {
            subsForLoc = {};
            this._locSubs[event] = subsForLoc;
        }
        var handle = this._handleMap.addItem(); // Create unique handle
        subsForLoc[handle] = {
            scope: scope || this,
            callback: callback
        };
        this._handleLocs[handle] = event;
        var value = this.props[event];
        if (value) { // A publication exists, notify callback immediately
            callback.call(scope || this, value);
        }
        return handle;
    };

    /**
     * Cancels an event subscription that was previously made with {{#crossLink "Viewer/on:method"}}{{/crossLink}} or
     * {{#crossLink "Viewer/once:method"}}{{/crossLink}}.
     *
     * @method off
     * @param {String} handle Publication handle
     */
    BIMSURFER.Viewer.prototype.off = function (handle) {
        var event = this._handleLocs[handle];
        if (event) {
            delete this._handleLocs[handle];
            var locSubs = this._locSubs[event];
            if (locSubs) {
                delete locSubs[handle];
            }
            this._handleMap.removeItem(handle); // Release handle
        }
    };

    /**
     * Subscribes to the next occurrence of the given event on this Viewer, then un-subscribes as soon as the event is handled.
     *
     * @method once
     * @param {String} event Data event to listen to
     * @param {Function(data)} callback Called when fresh data is available at the event
     * @param {Object} [scope=this] Scope for the callback
     */
    BIMSURFER.Viewer.prototype.once = function (event, callback, scope) {
        var self = this;
        var handle = this.on(event,
            function (value) {
                self.off(handle);
                callback(value);
            },
            scope);
    };

    /**
     * Logs a console debugging message for this View.
     *
     * The console message will have this format: *````[LOG] BIMSERVER.Viewer: <message>````*
     *
     * @method log
     * @param {String} message The message to log
     */
    BIMSURFER.Viewer.prototype.log = function (message) {
        window.console.log("[LOG] BIMSERVER.Viewer: " + message);
    };

    /**
     * Logs an error for this View to the JavaScript console.
     *
     * The console message will have this format: *````[ERROR] BIMSERVER.Viewer: <message>````*
     *
     * @method error
     * @param {String} message The message to log
     */
    BIMSURFER.Viewer.prototype.error = function (message) {
        window.console.error("[ERROR] BIMSERVER.Viewer: " + message);
    };

})();