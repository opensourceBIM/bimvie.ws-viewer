/**
 Manages the cursor icon for a {{#crossLink "Viewer"}}Viewer{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 TODO

 ```` javascript

 ````

 @class Cursor
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, creates this Configs within the
 default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.Cursor = function (viewer) {
        this._element = viewer.element;
        this._element = document.body;
        this._stack = [];
        this._stackLen = 0;
    };

    BIMSURFER.Cursor.prototype.push = function (state) {
        this._element.css("cursor", state);
        this._stack[this._stackLen++] = state;
    };

    BIMSURFER.Cursor.prototype.pop = function () {

        if (this._stackLen <= 0) {

            // Unexpected pop

            this._element.css("cursor", "default");
            this._stackLen = 0;
            return;
        }

        if (this._stackLen === 1) {

            // Last state in stack

            this._element.css("cursor", "default");
            this._stackLen = 0;
            return;
        }

        // Revert to previous stacked state

        --this._stackLen;

        this._element.css("cursor", this._stack[this._stackLen - 1]);
    };

})();
