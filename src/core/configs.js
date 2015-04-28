(function () {

    "use strict";

    /**
     * @constructor
     * @param {Object} bimServerApi A BIMSurfer API
     * @param {String|DOMelement} div The viewport div within which the canvas will be inserted in the DOM
     * @param {Object} [options] Options
     * @param {Boolean} [autoStart=false] Starts this Viewer automatically when true
     */
    BIMSURFER.configs = new (function () {

        this._handleMap = new BIMSURFER.utils.Map(); // Subscription handle pool
        this._locSubs = {}; // A [handle -> callback] map for each location name
        this._handleLocs = {}; // Maps handles to loc names

        /**
         * The properties
         */
        this.props = {};

        /**
         * Fires an event on this Viewer.
         *
         * Notifies existing subscribers to the event, retains the event to give to
         * any subsequent notifications on that location as they are made.
         *
         * @method fire
         * @param {String} event The event type name
         * @param {Object} value The event
         */
        this.set = function (event, value) {
            this.props[event] = value; // Save notification        
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
        this.on = function (event, callback, scope) {
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
        this.off = function (handle) {
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
        this.once = function (event, callback, scope) {
            var self = this;
            var handle = this.on(event,
                function (value) {
                    self.off(handle);
                    callback(value);
                },
                scope);
        };
    })();
})();
    
