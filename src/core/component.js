/**

 **Component** is the base class for all components within a {{#crossLink "Viewer"}}{{/crossLink}}.

 <hr>

 *Contents*

 <Ul>
 <li><a href="#ids">Component IDs</a></li>
 <li><a href="#componentProps">Properties</a></li>
 <li><a href="#metadata">Metadata</a></li>
 <li><a href="#logging">Logging</a></li>
 <li><a href="#destruction">Destruction</a></li>
 </ul>

 <hr>

 ## <a name="ids">Component IDs</a>

 Every Component has an ID that's unique within the parent {{#crossLink "Viewer"}}{{/crossLink}}. the {{#crossLink "Viewer"}}{{/crossLink}} generates
 the IDs automatically by default, however you can also specify them yourself. In the example below, we're creating a
 viewer comprised of {{#crossLink "Viewer"}}{{/crossLink}}, {{#crossLink "Material"}}{{/crossLink}}, {{#crossLink "Geometry"}}{{/crossLink}} and
 {{#crossLink "GameObject"}}{{/crossLink}} components, while letting xeoEngine generate its own ID for
 the {{#crossLink "Geometry"}}{{/crossLink}}:

 ````javascript

 ````

 ## <a name="componentProps">Properties</a>

 Almost every property on a xeoEngine Component fires a change event when you update it. For example, we can subscribe
 to the {{#crossLink "Material/diffuse:event"}}{{/crossLink}} event that a
 {{#crossLink "Material"}}{{/crossLink}} fires when its {{#crossLink "Material/diffuse:property"}}{{/crossLink}}
 property is updated, like so:

 ````javascript
 // Bind a change callback to a property
 var handle = material.on("diffuse", function(diffuse) {
    console.log("Material diffuse color has changed to: [" + diffuse[0] + ", " + diffuse[1] + "," + diffuse[2] + "]");
});

 // Change the property value, which fires the callback
 material.diffuse = [ 0.0, 0.5, 0.5 ];

 // Unsubscribe from the property change event
 material.off(handle);
 ````

 We can also subscribe to changes in the way components are attached to each other, since components are properties
 of other components. For example, we can subscribe to the '{{#crossLink "GameObject/material:event"}}{{/crossLink}}' event that a
 {{#crossLink "GameObject"}}GameObject{{/crossLink}} fires when its {{#crossLink "GameObject/material:property"}}{{/crossLink}}
 property is set to a different {{#crossLink "Material"}}Material{{/crossLink}}:

 ```` javascript
 // Bind a change callback to the GameObject's Material
 object1.on("material", function(material) {
    console.log("GameObject's Material has changed to: " + material.id);
});

 // Now replace that Material with another
 object1.material = new BIMSURFER.Material({
    id: "myOtherMaterial",
    diffuse: [ 0.3, 0.3, 0.6 ]
    //..
});
 ````

 ## <a name="metadata">Metadata</a>

 You can set optional **metadata** on your Components, which can be anything you like. These are intended
 to help manage your components within your application code or content pipeline. You could use metadata to attach
 authoring or version information, like this:

 ````javascript
 // Viewer with authoring metadata
 var viewer = new BIMSURFER.Viewer({
    id: "myViewer",
    metadata: {
        title: "My awesome 3D viewer",
        author: "@xeolabs",
 date: "February 13 2015"
 }
 });

 // Material with descriptive metadata
 var material = new BIMSURFER.Material(viewer, {
    id: "myMaterial",
    diffuse: [1, 0, 0],
    metadata: {
        description: "Bright red color with no textures",
        version: "0.1",
        foo: "bar"
    }
});
 ````

 As with all properties, you can subscribe and change the metadata like this:

 ````javascript
 // Subscribe to changes to the Material's metadata
 material.on("metadata", function(value) {
    console.log("Metadata changed: " + JSON.stringify(value));
});

 // Change the Material's metadata, firing our change handler
 material.metadata = {
    description: "Bright red color with no textures",
    version: "0.2",
    foo: "baz"
};
 ````

 ## <a name="logging">Logging</a>

 Components have methods to log ID-prefixed messages to the JavaScript console:

 ````javascript
 material.log("Everything is fine, situation normal.");
 material.warn("Wait, whats that red light?");
 material.error("Aw, snap!");
 ````

 The logged messages will look like this in the console:

 ````text
 [LOG]   myMaterial: Everything is fine, situation normal.
 [WARN]  myMaterial: Wait, whats that red light..
 [ERROR] myMaterial: Aw, snap!
 ````

 ## <a name="destruction">Destruction</a>

 Get notification of destruction directly on the Components:

 ````javascript
 material.on("destroyed", function() {
    this.log("Component was destroyed: " + this.id);
});
 ````

 Or get notification of destruction of any Component within its {{#crossLink "Viewer"}}{{/crossLink}}, indiscriminately:

 ````javascript
 viewer.on("componentDestroyed", function(component) {
    this.log("Component was destroyed: " + component.id);
});
 ````

 Then destroy a component like this:

 ````javascript
 material.destroy();
 ````

 Other Components that are linked to it will fall back on a default of some sort. For example, any
 {{#crossLink "GameObject"}}GameObjects{{/crossLink}} that were linked to our {{#crossLink "Material"}}{{/crossLink}}
 will then automatically link to the {{#crossLink "Viewer"}}Viewer's{{/crossLink}} default {{#crossLink "Viewer/material:property"}}{{/crossLink}}.

 @class Component
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}} - creates this Component
 within the default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted.
 @param [cfg] {*} Component configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Component.

 */
(function () {

    "use strict";

    BIMSURFER.Component = Class.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Component",


        getClassName: function() {

        },

        __init: function (viewer, cfg) {

            cfg = cfg || {};

            /**
             The {{#crossLink "Viewer"}}{{/crossLink}} that contains this Component.

             @property viewer
             @type {Viewer}
             @final
             */
            this.viewer = viewer;

            /**
             Metadata on this component.

             @property metadata
             @type Object
             */
            this.metadata = cfg.metadata || {};

            /**
             Unique ID for this Component within its parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.

             @property id
             @type String
             @final
             */
            this.id = cfg.id;

            /**
             True as soon as this Component has been destroyed

             @property destroyed
             @type Boolean
             */
            this.destroyed = false;

            // Events
            this._handleMap = new BIMSURFER.utils.Map(); // Subscription handle pool
            this._locSubs = {}; // A [handle -> callback] map for each location name
            this._handleLocs = {}; // Maps handles to loc names
            this.props = {}; // Maps locations to publications

            // Add this component to the Viewer
            // Assigns this component an automatic ID if not yet assigned
            this.viewer._addComponent(this);

            // Initialize
            this._init(cfg);
        },

        /**
         * Initializes this component
         * @param cfg
         * @private
         */
        _init: function (cfg) {
        },

        /**
         * Fires an event on this component.
         *
         * Notifies existing subscribers to the event, retains the event to give to
         * any subsequent notifications on that location as they are made.
         *
         * @method fire
         * @param {String} event The event type name
         * @param {Object} value The event
         * @param {Boolean} [forget=false] When true, does not retain for subsequent subscribers
         */
        fire: function (event, value, forget) {
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
        },

        /**
         * Subscribes to an event on this component.
         *
         * The callback is be called with this component as scope.
         *
         * @method on
         * @param {String} event Publication event
         * @param {Function} callback Called when fresh data is available at the event
         * @param {Object} [scope=this] Scope for the callback
         * @return {String} Handle to the subscription, which may be used to unsubscribe with {@link #off}.
         */
        on: function (event, callback, scope) {
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
        },

        /**
         * Cancels an event subscription that was previously made with {{#crossLink "Component/on:method"}}{{/crossLink}} or
         * {{#crossLink "Component/once:method"}}{{/crossLink}}.
         *
         * @method off
         * @param {String} handle Publication handle
         */
        off: function (handle) {
            var event = this._handleLocs[handle];
            if (event) {
                delete this._handleLocs[handle];
                var locSubs = this._locSubs[event];
                if (locSubs) {
                    delete locSubs[handle];
                }
                this._handleMap.removeItem(handle); // Release handle
            }
        },

        /**
         * Subscribes to the next occurrence of the given event, then un-subscribes as soon as the event is handled.
         *
         * @method once
         * @param {String} event Data event to listen to
         * @param {Function(data)} callback Called when fresh data is available at the event
         * @param {Object} [scope=this] Scope for the callback
         */
        once: function (event, callback, scope) {
            var self = this;
            var handle = this.on(event,
                function (value) {
                    self.off(handle);
                    callback(value);
                },
                scope);
        },

        /**
         * Logs a console debugging message for this component.
         *
         * The console message will have this format: *````[LOG] <component id>: <message>````*
         *
         * @method log
         * @param {String} message The message to log
         */
        log: function (message) {
            window.console.log("[LOG] " + this.id + ": " + message);
        },

        /**
         * Logs an error for this component to the JavaScript console.
         *
         * The console message will have this format: *````[ERROR] <component id>: <message>````*
         *
         * @method error
         * @param {String} message The message to log
         */
        error: function (message) {
            window.console.error("[ERROR] " + this.id + ": " + message);
        },

        /**
         * Logs a warning for this component to the JavaScript console.
         *
         * The console message will have this format: *````[WARN] <component id>: <message>````*
         *
         * @method warn
         * @param {String} message The message to log
         */
        warn: function (message) {
            window.console.warn("[WARN] " + this.id + ": " + message);
        },

       /**
         * Destroys this component.
         *
         * Removes this Component from its {{#crossLink "Viewer"}}{{/crossLink}}.
         *
         * Fires a {{#crossLink "Component/destroyed:event"}}{{/crossLink}} event on this Component.
         *
         * @method destroy
         */
        destroy: function () {

            // Remove from Viewer
            this.viewer._removeComponent(this);

            if (this._destroy) {
                this._destroy();
            }

            this.destroyed = true;

            /**
             * Fired when this Component is destroyed.
             * @event destroyed
             */
            this.fire("destroyed");
        }
    });

})();
