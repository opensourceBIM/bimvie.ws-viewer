/**
 A **Download** asynchronously downloads {{#crossLink "Objects"}}{{/crossLink}} from a BIMSurfer into the
 parent {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 The **downloadType** config specifies the type of download:

 <ul>
 <li>"types" - download {{#crossLink "Object"}}Objects{{/crossLink}} of the given IFC type</li>
 <li>"revision" - download {{#crossLink "Object"}}Objects{{/crossLink}} belonging to the given revision</li>
 <li>"oids" - download {{#crossLink "Object"}}Objects{{/crossLink}} having the given IDs</li>
 </ul>

 ## Example 1: General usage

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({
    element: "myDiv"
 });

 // Initiate a Download
 var download = new BIMSURFER.Download(viewer, {
    downloadType: "types",
    models: [foo, bar],
    roid: "xyz",
    types: ["", "", ""],
    schema: ""
 });

 // Subscribe to progress updates
 download.on("progress", function(e) {

    // Total number of Objects being loaded
    var numObjects = e.numObjects;

    // Number of Objects loaded so far
    var numObjectsLoaded = e.numObjectsLoaded;

    // Percentage of Objects loaded so far
    var progress = e.progress;

    //...
 });

 // Subscribe to completion
 download.on("completed", function(e) {
 
    // Number of Objects loaded 
    var numObjectsLoaded = e.numObjectsLoaded;

    // Since this Download component was configured with autoDestroy: true,
    // which is the default, then this Download component will now
    // destroy itself.

    //...

 });

 // Subscribe to errors
 download.on("error", function(e) {
 
    // Error message
    var message = e;

    // Even though this Download component was configured with autoDestroy: true,
    // which is the default, the Download component will not destroy itself
    // since an error occurred.

    //...
 });

 ````

 ## Example 2: Downloading {{#crossLink "Object"}}Objects{{/crossLink}} of specified IFC type

 ```` javascript

 var downloadTypes = new BIMSURFER.Download(viewer, {
    downloadType: "types",
    models: [foo, bar],
    types: [
        "IfcDoor",
        "IfcBuildingElementProxy",
        "IfcWallStandardCase",
        "IfcWall"
    ],
    schema: "XYZ"
 });

 //...

 ````

 ## Example 3: Downloading {{#crossLink "Object"}}Objects{{/crossLink}} for a revision ID

 ```` javascript

 var downloadRevisions = new BIMSURFER.Download(viewer, {
    downloadType: "revision",
    models: [foo, bar],
    roid: "XYZ"
 });

 //...

 ````

 ## Example 4: Downloading {{#crossLink "Object"}}Objects{{/crossLink}} having the given IDs

 ```` javascript

 var downloadByIDs = new BIMSURFER.Download(viewer, {
    downloadType: "oids",
    models: [foo, bar],
    roids: ["XYZ", "XYZ2"],
    oids: ["XYZ", "XYZ2"]
 });

 //...

 ````


 @class Download
 @module BIMSURFER
 @submodule loading
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Label.
 @param [cfg.models] {*} Array of models to load objects from.
 @param [cfg.downloadType] {*} Type download - "types", "revision" or "oids"
 @param [cfg.roids] {*} A list of revision IDs
 @param [cfg.roid] {*} A single revision ID
 @param [cfg.schema] {*} Schema
 @param [cfg.types] {*} Types of objects to download
 @param [cfg.oids] {*} IDs of objects to download
 @param [cfg.autoDestroy=true] {Boolean} Indicates if this Download component should destroy itself when download complete.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Download = BIMSURFER.Component.extend({

        _init: function (cfg) {

            this._api = cfg.api;

            // Download parameters

            this._models = cfg.models;

            this._downloadType = cfg.downloadType;
            this._roids = cfg.roids;
            this._roid = cfg.roid;
            this._schema = cfg.schema;
            this._types = cfg.types;
            this._oids = cfg.oids;

            // API handle

            this._topicId = null;

            // Download progress

            this._downloading = false;
            this._numObjects = 0;
            this._numObjectsLoaded = 0;

            // Queus of incoming data packets

            this._dataPackets = [];

            // Components created for this Download
            // Destroyed when this Download is destroyed

            this._geometries = [];
            this._objects = [];


            var self = this;

            // Find serializer in API

            this._api.getMessagingSerializerByPluginClassName(
                "org.bimserver.serializers.binarygeometry.BinaryGeometryMessagingSerializerPlugin",
                function (serializer) {

                    // Build and send the download command to the API

                    var proc;
                    var params;

                    if (self._downloadType === "types") {

                        proc = "downloadByTypes";

                        params = {
                            roids: [self._roid],
                            schema: self._schema,
                            classNames: self._types,
                            serializerOid: serializer.oid,
                            includeAllSubtypes: false,
                            useObjectIDM: false,
                            sync: false,
                            deep: false
                        };

                    } else if (self._downloadType === "revision") {

                        proc = "download";

                        params = {
                            roid: self._roid,
                            serializerOid: serializer.oid,
                            sync: false,
                            showOwn: true
                        };

                    } else if (self._downloadType === "oids") {

                        proc = "downloadByOids";

                        params = {
                            roids: self._roids,
                            oids: self._oids,
                            serializerOid: serializer.oid,
                            sync: false,
                            deep: false
                        };

                    } else {
                        self.error("Unsupported downloadType: " + self._downloadType);
                        return;
                    }

                    // Send the download request

                    self._api.call("Bimsie1ServiceInterface", proc, params,
                        function (topicId) {

                            self._topicId = topicId;

                            self._api.registerProgressHandler(
                                self._topicId,

                                function (topicId, state) {
                                    self._progressHandler(topicId, state);
                                },

                                function (topicId, state) {
                                    //self._afterRegistration(topicId, state);
                                });
                        },
                        function (err) {

                            var message = "Download failed: " + err.__type + ": " + err.message;

                            self.error(message);
                            self.fire("error", message);
                        });
                });

            // Start processing response data packet queue

            this._tick = this.viewer.on("tick",
                function () {

                    var data = self._dataPackets.shift();

                    while (data != null) {

                        var stream = new BIMSURFER.DataInputStreamReader(null, data);
                        var channel = stream.readInt();
                        var numMessages = stream.readInt();

                        for (var i = 0; i < numMessages; i++) {

                            var messageType = stream.readByte();

                            if (messageType === 0) {
                                self._readStart(stream);

                            } else {
                                self._readObject(stream, messageType);
                            }
                        }

                        data = self._dataPackets.shift();
                    }
                });
        },

        _progressHandler: function (topicId, state) {

            if (topicId === this._topicId) {

                if (state.title == "Done preparing") {

                    if (!this._downloading) {

                        this._downloading = true;

                        this._startDownload();
                    }
                }

                if (state.state == "completed") {

                    this._api.unregisterProgressHandler(this._topicId, this._progressHandler);

                    /**
                     * Fired when this Download has successfully completed.
                     *
                     * @event finished
                     */
                    this.fire("completed", true);
                }
            }
        },

        _startDownload: function () {

            this._numObjectsLoaded = 0;
            this._numObjects = 0;

            //this.viewer.SYSTEM.events.trigger('progressStarted', ['Loading Geometry']);
            //this.viewer.SYSTEM.events.trigger('progressBarStyleChanged', BIMSURFER.Constants.ProgressBarStyle.Continuous);

            // Bind callback to get data

            var self = this;

            this._api.setBinaryDataListener(this._topicId,
                function (data) {
                    self._dataPackets.push(data);
                });

            // Request the data via Web Socket

            this._api.downloadViaWebsocket({
                longActionId: this._topicId,
                topicId: this._topicId
            });
        },

        _readStart: function (stream) {

            var start = stream.readUTF8();

            if (start != "BGS") {
                this.error("Stream does not start with BGS (" + start + ")");
                return false;
            }

            var version = stream.readByte();

            if (version != 4 && version != 5 && version != 6) {
                this.error("Unimplemented version");
                return false;

            } else {
                this._version = version;
            }

            stream.align4();

            var modelBounds = stream.readFloatArray(6);

            modelBounds = {
                min: {x: modelBounds[0], y: modelBounds[1], z: modelBounds[2]},
                max: {x: modelBounds[3], y: modelBounds[4], z: modelBounds[5]}
            };

            // Bump Viewer origin to center the model

            this.viewer.origin = [
                -(modelBounds.max.x + modelBounds.min.x) / 2,
                -(modelBounds.max.y + modelBounds.min.y) / 2,
                -(modelBounds.max.z + modelBounds.min.z) / 2
            ];

            var firstModel = true;

            if (firstModel) {

                // Set up the Viewer's default Camera

                var camera = this.viewer.camera;

                camera.active = true; // Deactivates other Cameras

                camera.eye = [
                    (modelBounds.max.x - modelBounds.min.x) * 0.5,
                    (modelBounds.max.y - modelBounds.min.y) * -1,
                    (modelBounds.max.z - modelBounds.min.z) * 0.5
                ];

                var diagonal = Math.sqrt(
                    Math.pow(modelBounds.max.x - modelBounds.min.x, 2) +
                    Math.pow(modelBounds.max.y - modelBounds.min.y, 2) +
                    Math.pow(modelBounds.max.z - modelBounds.min.z, 2));

                var far = diagonal * 5; // 5 being a guessed constant that should somehow coincide with the max zoom-out-factor

                camera.far = far;
                camera.near = far / 1000;
                camera.fovy = 37.8493;
            }

            this._numObjects = stream.readInt();

            this._notifyProgress();
        },

        _notifyProgress: function () {

            if (this._numObjectsLoaded < this._numObjects) {

                // Download still in progress

                var progress = Math.ceil(100 * this._numObjectsLoaded / this._numObjects);

                if (progress != this._lastProgress) {

                    /**
                     * Fired periodically as downloading progresses, to indicate download progress.
                     * @event progress
                     * @param progress Progress percentage
                     * @param numObjects Total number of objects to download
                     * @param numObjectsLoaded Number of objects downloaded so far
                     */
                    this.fire("progress", {
                        progress: progress,
                        numObjectsLoaded: this._numObjectsLoaded,
                        numObjects: this._numObjects
                    });

                    this._lastProgress = progress;
                }

            } else {

                // Download completed

                this.fire("progress", {
                    progress: 100,
                    numObjectsLoaded: this._numObjectsLoaded,
                    numObjects: this._numObjects
                });

                /**
                 * Fired when download has completed
                 * @event finished
                 */
                this.fire("completed", {
                    numObjects: this._numObjects
                });

                this._api.call("ServiceInterface", "cleanupLongAction", {
                        actionId: this._topicId
                    },
                    function () {
                    });
            }
        },

        /**
         * Reads an object from binary stream.
         *
         * @param stream The binary stream.
         * @param geometryType Type of geometry to read.
         * @private
         */
        _readObject: function (stream, geometryType) {

            var type = stream.readUTF8();
            var roid = stream.readLong();
            var objectId = stream.readLong();

            var geometryId;
            var geometryIds = [];
            var numGeometries;
            var numParts;
            var objectBounds;
            var numIndices;
            var indices;
            var numPositions;
            var positions;
            var numNormals;
            var normals;
            var numColors;
            var colors;

            stream.align4();

            var matrix = stream.readFloatArray(16);

            if (geometryType == 1) {

                objectBounds = stream.readFloatArray(6);
                geometryId = stream.readLong();
                numIndices = stream.readInt();
                indices = stream.readIntArray(numIndices);
                numPositions = stream.readInt();
                positions = stream.readFloatArray(numPositions);
                numNormals = stream.readInt();
                normals = stream.readFloatArray(numNormals);
                numColors = stream.readInt();
                colors = stream.readFloatArray(numColors);

                this._createGeometry(geometryId, positions, normals, colors, indices);

                this._createObject(roid, objectId, objectId, [geometryId], type, matrix);

            } else if (geometryType == 2) {

                geometryId = stream.readLong();

                this._createObject(roid, objectId, objectId, [geometryId], type, matrix);

            } else if (geometryType == 3) {

                numParts = stream.readInt();

                for (var i = 0; i < numParts; i++) {

                    // Object contains multiple geometries

                    geometryId = stream.readLong();
                    numIndices = stream.readInt();
                    indices = stream.readIntArray(numIndices);
                    numPositions = stream.readInt();
                    positions = stream.readFloatArray(numPositions);
                    numNormals = stream.readInt();
                    normals = stream.readFloatArray(numNormals);
                    numColors = stream.readInt();
                    colors = stream.readFloatArray(numColors);

                    this._createGeometry(geometryId, positions, normals, colors, indices);

                    geometryIds.push(geometryId);
                }

                this._createObject(roid, objectId, objectId, geometryIds, type, matrix);

            } else if (geometryType == 4) {

                // Object contains multiple instances of geometries

                numGeometries = stream.readInt();
                geometryIds = [];

                for (var i = 0; i < numGeometries; i++) {
                    geometryIds.push(stream.readLong());
                }

                this._createObject(roid, objectId, objectId, geometryIds, type, matrix);

            } else {

                //this.warn("Unsupported geometry type: " + geometryType);
                return;
            }
        },

        _createGeometry: function (geometryId, positions, normals, colors, indices) {

            var g = new BIMSURFER.Geometry(this.viewer, {
                id: geometryId,
                positions: positions,
                normals: normals,
                colors: colors,
                indices: indices,
                primitive: "triangles"
            });

            this._geometries.push(g);
        },

        _createObject: function (roid, oid, objectId, geometryIds, type, matrix) {

            var self = this;

            if (this.viewer.components[objectId]) {
                this.error("Component with this ID already exists: " + objectId);
                return;
            }

            this._models[roid].get(oid,
                function (object) {

                    var o = new BIMSURFER.Object(self.viewer, {
                        id: objectId,
                        type: type,
                        geometries: geometryIds,
                        matrix: matrix,
                        active: object.trans.mode === 0
                    });

                    self._objects.push(o);

                    self._numObjectsLoaded++;

                    self._notifyProgress();
                });
        },

        _destroy: function () {

            if (this._tick) {
                this.viewer.off(this._tick);
            }

            var i;
            var len;

            for (i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i].destroy();
            }

            for (i = 0, len = this._geometries.length; i < len; i++) {
                this._geometries[i].destroy();
            }
        }
    });

})();
