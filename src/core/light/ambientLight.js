/**
 A **AmbientLight** defines a directional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>AmbientLights have a position, but no direction.</li>

 <li>AmbientLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>Within bIMSurfer's's Phong lighting calculations, AmbientLight {{#crossLink "AmbientLight/diffuse:property"}}{{/crossLink}} and
 {{#crossLink "AmbientLight/specular:property"}}{{/crossLink}}.</li>

 <li>AmbientLights have {{#crossLink "AmbientLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "AmbientLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "AmbientLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>


 </ul>


 ## Example


 ```` javascript
 TODO
 ````

 As with all components, we can <a href="BIMSURFER.Component.html#changeEvents" class="crosslink">observe and change properties</a> on AmbientLights like so:

 ````Javascript
 var handle = ambientLight.on("diffuse", // Attach a change listener to a property
 function(value) {
        // Property value has changed
    });

 ambientLight.diffuse = [0.4, 0.6, 0.4]; // Fires the change listener

 ambientLight.off(handle); // Detach the change listener
 ````

 @class AmbientLight
 @module BIMSURFER
 @constructor
 @extends Component
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The AmbientLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this AmbientLight.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this AmbientLight.
 */
(function () {

    "use strict";

    BIMSURFER.AmbientLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.AmbientLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "ambient" }, cfg));

            this.color = cfg.color;
        },

        _props: {
            
            /**
             The color of this AmbientLight.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {
                    this._color = value;
                    this._update({
                        color: { r: value[0], g: value[1], b: value[2] }
                    });
                },

                get: function () {
                    return this._color;
                }
            },
        }
    });

})();
