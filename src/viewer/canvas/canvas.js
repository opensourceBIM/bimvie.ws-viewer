/**
 A **Canvas** manages a {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s HTML canvas and its WebGL context.

 ## Overview

 <ul>

 <li>Each {{#crossLink "Viewer"}}Viewer{{/crossLink}} provides a Canvas as a read-only property on itself.</li>

 <li>When a {{#crossLink "Viewer"}}Viewer{{/crossLink}} is configured with the ID of
 an existing <a href="http://www.w3.org/TR/html5/scripting-1.html#the-canvas-element">HTMLCanvasElement</a>, then
 the Canvas will bind to that, otherwise the Canvas will automatically create its own.</li>

 <li>A Canvas will fire a {{#crossLink "Canvas/resized:event"}}{{/crossLink}} event whenever
 the <a href="http://www.w3.org/TR/html5/scripting-1.html#the-canvas-element">HTMLCanvasElement</a> resizes.</li>

 <li>A Canvas is responsible for obtaining a WebGL context from
 the <a href="http://www.w3.org/TR/html5/scripting-1.html#the-canvas-element">HTMLCanvasElement</a>.</li>

 <li>A Canvas also fires a {{#crossLink "Canvas/webglContextLost:event"}}{{/crossLink}} event when the WebGL context is
 lost, and a {{#crossLink "Canvas/webglContextRestored:event"}}{{/crossLink}} when it is restored again.</li>

 <li>The various components within the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}} will transparently recover on
 the {{#crossLink "Canvas/webglContextRestored:event"}}{{/crossLink}} event.</li>

 </ul>

 <img src="http://www.gliffy.com/go/publish/image/7103211/L.png"></img>

 ## Example

 In the example below, we're creating a {{#crossLink "Viewer"}}Viewer{{/crossLink}} without specifying an HTML canvas element
 for it. This causes the {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s Canvas component to create its own default element
 within the page. Then we subscribe to various events fired by that Canvas component.

 ```` javascript
 var viewer = new BIMSURFER.Viewer();

 // Get the Canvas off the Viewer
 // Since we did not configure the Viewer with the ID of a DOM canvas element,
 // the Canvas will create its own canvas element in the DOM
 var canvas = viewer.canvas;

 // Get the WebGL context off the Canvas
 var gl = canvas.gl;

 // Subscribe to Canvas resize events
 canvas.on("resize", function(e) {
        var width = e.width;
        var height = e.height;
        var aspect = e.aspect;
        //...
     });

 // Subscribe to WebGL context loss events on the Canvas
 canvas.on("webglContextLost", function() {
        //...
     });

 // Subscribe to WebGL context restored events on the Canvas
 canvas.on("webglContextRestored", function(gl) {
        var newContext = gl;
        //...
     });
 ````

 @class Canvas
 @module BIMSURFER
 @static
 @param {Viewer} viewer Parent viewer
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Canvas = BIMSURFER.Component.extend({

        className: "BIMSURFER.Canvas",

        _init: function () {

            /**
             * The HTML canvas. When this BIMSURFER.Canvas was configured with the ID of an existing canvas within the DOM,
             * this property will be that element, otherwise it will be a full-page canvas that this Canvas has
             * created by default.
             * @property canvas
             * @type {HTMLCanvasElement}
             * @final
             */
            this.canvas = this.viewer._canvas;

            // If the canvas uses css styles to specify the sizes make sure the basic
            // width and height attributes match or the WebGL context will use 300 x 150

            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;

            // Bind context loss and recovery handlers

            var self = this;

            this.canvas.addEventListener("webglcontextlost",
                function () {

                    /**
                     * Fired wheneber the WebGL context has been lost
                     * @event webglContextLost
                     */
                    self.fire("webglContextLost");
                },
                false);

            this.canvas.addEventListener("webglcontextrestored",
                function () {
                    self._initWebGL();
                    if (self.gl) {

                        /**
                         * Fired whenever the WebGL context has been restored again after having previously being lost
                         * @event webglContextRestored
                         * @param value The WebGL context object
                         */
                        self.fire("webglContextRestored", self.gl);
                    }
                },
                false);

            // Publish canvas size changes on each viewer tick

            var lastWidth = this.canvas.width;
            var lastHeight = this.canvas.height;

            this._tick = this.viewer.on("tick",
                function () {

                    var canvas = self.canvas;

                    if (canvas.width !== lastWidth || canvas.height !== lastHeight) {

                        lastWidth = canvas.width;
                        lastHeight = canvas.height;

                        /**
                         * Fired whenever the canvas has resized
                         * @event resized
                         * @param width {Number} The new canvas width
                         * @param height {Number} The new canvas height
                         * @param aspect {Number} The new canvas aspect ratio
                         */
                        self.fire("resized", {
                            width: canvas.width,
                            height: canvas.height,
                            aspect: canvas.height / canvas.width
                        });
                    }
                });
        },

        /**
         * Attempts to pick a {{#crossLink "GameObject"}}GameObject{{/crossLink}} at the given Canvas-space coordinates within the
         * parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
         *
         * Ignores {{#crossLink "GameObject"}}GameObjects{{/crossLink}} that are attached
         * to either a {{#crossLink "Stage"}}Stage{{/crossLink}} with {{#crossLink "Stage/pickable:property"}}pickable{{/crossLink}}
         * set *false* or a {{#crossLink "Modes"}}Modes{{/crossLink}} with {{#crossLink "Modes/picking:property"}}picking{{/crossLink}} set *false*.
         *
         * On success, will fire a {{#crossLink "Canvas/picked:event"}}{{/crossLink}} event on this Canvas, along with
         * a separate {{#crossLink "GameObject/picked:event"}}{{/crossLink}} event on the target {{#crossLink "GameObject"}}GameObject{{/crossLink}}.
         *
         * @method pick
         * @param {Number} canvasX X-axis Canvas coordinate.
         * @param {Number} canvasY Y-axis Canvas coordinate.
         * @param {*} [options] Pick options.
         * @param {Boolean} [options.rayPick=false] Whether to perform a 3D ray-intersect pick.
         */
        pick: function (canvasX, canvasY, options) {

            /**
             * Fired whenever the {{#crossLink "Canvas/pick:method"}}{{/crossLink}} method succeeds in picking
             * a {{#crossLink "GameObject"}}GameObject{{/crossLink}} in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
             * @event picked
             * @param {String} objectId The ID of the picked {{#crossLink "GameObject"}}GameObject{{/crossLink}} within the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
             * @param {Number} canvasX The X-axis Canvas coordinate that was picked.
             * @param {Number} canvasY The Y-axis Canvas coordinate that was picked.
             */

        },

        _destroy: function () {
            this.viewer.off(this._tick);
        }
    });

})();