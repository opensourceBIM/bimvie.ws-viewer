
BIMSURFER.api.Model = function (bimServerApi, poid, roid, schema) {

    if (typeof jQuery !== 'undefined' && $ !== jQuery)
        var $ = jQuery;

    var self = this;

    self.schema = schema;
    self.bimServerApi = bimServerApi;
    self.poid = poid;
    self.roid = roid;
    self.waiters = [];

    self.objects = {};
    self.objectsByGuid = {};
    self.objectsByName = {};

    self.oidsFetching = {};
    self.guidsFetching = {};
    self.namesFetching = {};

    // Those are only fully loaded types (all of them), should not be stored here if loaded partially
    self.loadedTypes = [];
    self.loadedDeep = false;
    self.changedObjectOids = {};
    self.doneCallbacks = [];
    self.runningCalls = 0;
    self.loading = false;
    self.logging = true;

    self.changes = 0;
    self.changeListeners = [];

    self.transactionSynchronizer = new BIMSURFER.api.Synchronizer(function (callback) {
        bimServerApi.call("Bimsie1LowLevelInterface", "startTransaction", {poid: self.poid}, function (tid) {
            callback(tid);
        });
    });

    this.init = function (callback) {
        self.incrementRunningCalls("init");
        self.transactionSynchronizer.fetch(function () {
            callback(self);
            self.decrementRunningCalls("init");
        });
    };

    this.load = function (deep, modelLoadCallback) {
        if (deep) {
            self.loading = true;
            self.incrementRunningCalls("load");
            self.bimServerApi.jsonSerializerFetcher.fetch(function (jsonSerializerOid) {
                bimServerApi.call("Bimsie1ServiceInterface", "download", {
                    roid: self.roid,
                    serializerOid: jsonSerializerOid,
                    showOwn: true,
                    sync: true
                }, function (laid) {
                    var url = bimServerApi.generateRevisionDownloadUrl({
                        laid: laid,
                        topicId: laid,
                        serializerOid: jsonSerializerOid
                    });
                    $.getJSON(url, function (data, textStatus, jqXHR) {
                        data.objects.forEach(function (object) {
                            self.objects[object._i] = self.createWrapper(object, object._t);
                        });
                        self.loading = false;
                        self.loadedDeep = true;
                        self.waiters.forEach(function (waiter) {
                            waiter();
                        });
                        self.waiters = [];
                        bimServerApi.call("ServiceInterface", "cleanupLongAction", {actionId: laid}, function () {
                            if (modelLoadCallback != null) {
                                modelLoadCallback(self);
                            }
                            self.decrementRunningCalls("load");
                        });
                    });
                });
            });
        } else {
            self.loaded = true;
            if (modelLoadCallback != null) {
                modelLoadCallback(self);
            }
        }
    };

    this.create = function (className, object, callback) {
        self.incrementRunningCalls("create (" + className + ")");
        self.transactionSynchronizer.fetch(function (tid) {
            object._t = className;
            var wrapper = self.createWrapper({}, className);
            bimServerApi.call("Bimsie1LowLevelInterface", "createObject", {
                tid: tid,
                className: className
            }, function (oid) {
                wrapper._i = oid;
                self.objects[object._i] = wrapper;
                object._s = 1;
                if (callback != null) {
                    callback(object);
                }
                self.decrementRunningCalls("create (" + className + ")");
            });
        });
        return object;
    };

    this.incrementRunningCalls = function (method) {
        self.runningCalls++;
        self.bimServerApi.log("inc", method, self.runningCalls);
    };

    this.decrementRunningCalls = function (method) {
        self.runningCalls--;
        self.bimServerApi.log("dec", method, self.runningCalls);
        if (self.runningCalls == 0) {
            self.doneCallbacks.forEach(function (cb) {
                cb(self);
            });
        }
    };

    this.done = function (doneCallback) {
        if (self.runningCalls == 0) {
            self.bimServerApi.log("immediately done");
            doneCallback(self);
        } else {
            self.doneCallbacks.push(doneCallback);
        }
    };

    this.waitForLoaded = function (callback) {
        if (self.loaded) {
            callback();
        } else {
            self.waiters.push(callback);
        }
    };

    this.commit = function (comment, callback) {
        self.transactionSynchronizer.fetch(function (tid) {
            bimServerApi.call("Bimsie1LowLevelInterface", "commitTransaction", {
                tid: tid,
                comment: comment
            }, function (roid) {
                if (callback != null) {
                    callback(roid);
                }
            });
        });
    };

    this.abort = function (callback) {
        self.transactionSynchronizer.fetch(function (tid) {
            bimServerApi.call("Bimsie1LowLevelInterface", "abortTransaction", {tid: tid}, function (roid) {
                if (callback != null) {
                    callback();
                }
            });
        });
    };

    this.addChangeListener = function (changeListener) {
        self.changeListeners.push(changeListener);
    };

    this.incrementChanges = function () {
        self.changes++;
        self.changeListeners.forEach(function (changeListener) {
            changeListener(self.changes);
        });
    };

    this.extendClass = function (wrapperClass, typeName) {
        var realType = self.bimServerApi.schemas[self.schema][typeName];
        realType.superclasses.forEach(function (typeName) {
            self.extendClass(wrapperClass, typeName);
        });
        for (var fieldName in realType.fields) {
            var field = realType.fields[fieldName];
            (function (field, fieldName) {
                if (field.reference) {
                    wrapperClass["set" + fieldName.firstUpper() + "Wrapped"] = function (typeName, value) {
                        var object = this.object;
                        object[fieldName] = {_t: typeName, value: value};
                        self.incrementRunningCalls("set" + fieldName.firstUpper() + "Wrapped");
                        self.transactionSynchronizer.fetch(function (tid) {
                            var type = self.bimServerApi.schema[typeName];
                            var wrappedValueType = type.fields.wrappedValue;
                            if (wrappedValueType.type == "string") {
                                bimServerApi.call("Bimsie1LowLevelInterface", "setWrappedStringAttribute", {
                                    tid: tid,
                                    oid: object._i,
                                    attributeName: fieldName,
                                    type: typeName,
                                    value: value
                                }, function () {
                                    if (object.changedFields == null) {
                                        object.changedFields = {};
                                    }
                                    object.changedFields[fieldName] = true;
                                    self.changedObjectOids[object.oid] = true;
                                    self.incrementChanges();
                                    self.decrementRunningCalls("set" + fieldName.firstUpper() + "Wrapped");
                                });
                            }
                        });
                    };
                    wrapperClass["set" + fieldName.firstUpper()] = function (value) {
                        var object = this.object;
                        self.transactionSynchronizer.fetch(function (tid) {
                            object[fieldName] = value;
                            self.incrementRunningCalls("set" + fieldName.firstUpper());
                            if (value == null) {
                                bimServerApi.call("Bimsie1LowLevelInterface", "unsetReference", {
                                    tid: tid,
                                    oid: object._i,
                                    referenceName: fieldName,
                                }, function () {
                                    self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    if (object.changedFields == null) {
                                        object.changedFields = {};
                                    }
                                    object.changedFields[fieldName] = true;
                                    self.changedObjectOids[object.oid] = true;
                                });
                            } else {
                                bimServerApi.call("Bimsie1LowLevelInterface", "setReference", {
                                    tid: tid,
                                    oid: object._i,
                                    referenceName: fieldName,
                                    referenceOid: value._i
                                }, function () {
                                    self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    if (object.changedFields == null) {
                                        object.changedFields = {};
                                    }
                                    object.changedFields[fieldName] = true;
                                    self.changedObjectOids[object.oid] = true;
                                });
                            }
                        });
                    };
                    wrapperClass["add" + fieldName.firstUpper()] = function (value, callback) {
                        var object = this.object;
                        self.transactionSynchronizer.fetch(function (tid) {
                            if (object[fieldName] == null) {
                                object[fieldName] = [];
                            }
                            object[fieldName].push(value);
                            self.incrementRunningCalls("add" + fieldName.firstUpper());
                            bimServerApi.call("Bimsie1LowLevelInterface", "addReference", {
                                tid: tid,
                                oid: object._i,
                                referenceName: fieldName,
                                referenceOid: value._i
                            }, function () {
                                self.decrementRunningCalls("add" + fieldName.firstUpper());
                                if (object.changedFields == null) {
                                    object.changedFields = {};
                                }
                                object.changedFields[fieldName] = true;
                                self.changedObjectOids[object.oid] = true;
                                if (callback != null) {
                                    callback();
                                }
                            });
                        });
                    };
                    wrapperClass["remove" + fieldName.firstUpper()] = function (value, callback) {
                        var object = this.object;
                        self.transactionSynchronizer.fetch(function (tid) {
                            var list = object[fieldName];
                            var index = list.indexOf(value);
                            list.splice(index, 1);

                            self.incrementRunningCalls("remove" + fieldName.firstUpper());
                            bimServerApi.call("Bimsie1LowLevelInterface", "removeReference", {
                                tid: tid,
                                oid: object._i,
                                referenceName: fieldName,
                                index: index
                            }, function () {
                                self.decrementRunningCalls("remove" + fieldName.firstUpper());
                                if (object.changedFields == null) {
                                    object.changedFields = {};
                                }
                                object.changedFields[fieldName] = true;
                                self.changedObjectOids[object.oid] = true;
                                if (callback != null) {
                                    callback();
                                }
                            });
                        });
                    };
                    wrapperClass["get" + fieldName.firstUpper()] = function (callback) {
                        var object = this.object;
                        var model = this.model;
                        var promise = new BIMSURFER.api.Promise();
                        if (object[fieldName] != null) {
                            if (field.many) {
                                object[fieldName].forEach(function (item) {
                                    callback(item);
                                });
                            } else {
                                callback(object[fieldName]);
                            }
                            promise.fire();
                            return promise;
                        }
                        var embValue = object["_e" + fieldName];
                        if (embValue != null) {
                            callback(embValue);
                            promise.fire();
                            return promise;
                        }
                        var value = object["_r" + fieldName];
                        if (field.many) {
                            if (object[fieldName] == null) {
                                object[fieldName] = [];
                            }
                            if (value != null) {
                                model.get(value, function (v) {
                                    object[fieldName].push(v);
                                    callback(v);
                                }).done(function () {
                                    promise.fire();
                                });
                            } else {
                                promise.fire();
                            }
                        } else {
                            if (value != null) {
                                var ref = self.objects[value];
                                if (value == -1) {
                                    callback(null);
                                    promise.fire();
                                } else if (ref == null || ref.object._s == 0) {
                                    model.get(value, function (v) {
                                        object[fieldName] = v;
                                        callback(v);
                                    }).done(function () {
                                        promise.fire();
                                    });
                                } else {
                                    object[fieldName] = ref;
                                    callback(ref);
                                    promise.fire();
                                }
                            } else {
                                callback(null);
                                promise.fire();
                            }
                        }
                        return promise;
                    };
                } else {
                    wrapperClass["get" + fieldName.firstUpper()] = function (callback) {
                        var object = this.object;
                        if (field.many) {
                            if (object[fieldName] == null) {
                                object[fieldName] = [];
                            }
                            object[fieldName].push = function (val) {
                            };
                        }
                        if (callback != null) {
                            callback(object[fieldName]);
                        }
                        return object[fieldName];
                    };
                    wrapperClass["set" + fieldName.firstUpper()] = function (value) {
                        var object = this.object;
                        object[fieldName] = value;
                        self.incrementRunningCalls("set" + fieldName.firstUpper());
                        self.transactionSynchronizer.fetch(function (tid) {
                            if (field.many) {
                                bimServerApi.call("Bimsie1LowLevelInterface", "setDoubleAttributes", {
                                    tid: tid,
                                    oid: object._i,
                                    attributeName: fieldName,
                                    values: value
                                }, function () {
                                    self.decrementRunningCalls("set" + fieldName.firstUpper());
                                });
                            } else {
                                if (value == null) {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "unsetAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else if (field.type == "string") {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "setStringAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName,
                                        value: value
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else if (field.type == "double") {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "setDoubleAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName,
                                        value: value
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else if (field.type == "boolean") {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "setBooleanAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName,
                                        value: value
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else if (field.type == "int") {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "setIntegerAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName,
                                        value: value
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else if (field.type == "enum") {
                                    bimServerApi.call("Bimsie1LowLevelInterface", "setEnumAttribute", {
                                        tid: tid,
                                        oid: object._i,
                                        attributeName: fieldName,
                                        value: value
                                    }, function () {
                                        self.decrementRunningCalls("set" + fieldName.firstUpper());
                                    });
                                } else {
                                    self.bimServerApi.log("Unimplemented type " + typeof value);
                                    self.decrementRunningCalls("set" + fieldName.firstUpper());
                                }
                                object[fieldName] = value;
                            }
                            if (object.changedFields == null) {
                                object.changedFields = {};
                            }
                            object.changedFields[fieldName] = true;
                            self.changedObjectOids[object.oid] = true;
                        });
                    };
                }
            })(field, fieldName);
        }
    };

    this.dumpByType = function () {
        var mapLoaded = {};
        var mapNotLoaded = {};
        for (var oid in self.objects) {
            var object = self.objects[oid];
            var type = object.getType();
            var counter = mapLoaded[type];
            if (object.object._s == 1) {
                if (counter == null) {
                    mapLoaded[type] = 1;
                } else {
                    mapLoaded[type] = counter + 1;
                }
            }
            if (object.object._s == 0) {
                var counter = mapNotLoaded[type];
                if (counter == null) {
                    mapNotLoaded[type] = 1;
                } else {
                    mapNotLoaded[type] = counter + 1;
                }
            }
        }
        console.log("LOADED");
        for (var type in mapLoaded) {
            console.log(type, mapLoaded[type]);
        }
        console.log("NOT_LOADED");
        for (var type in mapNotLoaded) {
            console.log(type, mapNotLoaded[type]);
        }
    };

    this.getClass = function (typeName) {
        if (self.bimServerApi.classes[typeName] == null) {
            var realType = self.bimServerApi.schemas[self.schema][typeName];
            if (realType == null) {
                if (typeName == "GeometryInfo") {
                    return null;
                }
                throw "Type " + typeName + " not found in schema " + self.schema;
            }

            var wrapperClass = {};

            wrapperClass.isA = function (typeName) {
                return self.bimServerApi.isA(self.schema, this.object._t, typeName);
            };
            wrapperClass.getType = function () {
                return this.object._t;
            };
            wrapperClass.remove = function (removeCallback) {
                self.incrementRunningCalls("removeObject");
                self.transactionSynchronizer.fetch(function (tid) {
                    bimServerApi.call("Bimsie1LowLevelInterface", "removeObject", {
                        tid: tid,
                        oid: this.object._i
                    }, function () {
                        if (removeCallback != null) {
                            removeCallback();
                        }
                        delete self.objects[this.object._i];
                        self.decrementRunningCalls("removeObject");
                    });
                });
            };

            self.extendClass(wrapperClass, typeName);

            self.bimServerApi.classes[typeName] = wrapperClass;
        }
        return self.bimServerApi.classes[typeName];
    };

    this.createWrapper = function (object, typeName) {
        if (self.objects[object._i] != null) {
            console.log("Warning!", object);
        }
        object.oid = object._i;
        var cl = self.getClass(typeName);
        var wrapper = Object.create(cl);
        // transient variables
        wrapper.trans = {
            mode: 2
        };
        wrapper.oid = object.oid;
        wrapper.model = self;
        wrapper.object = object;
        return wrapper;
    };

    this.size = function (callback) {
        bimServerApi.call("Bimsie1ServiceInterface", "getRevision", {roid: roid}, function (revision) {
            callback(revision.size);
        });
    };

    this.count = function (type, includeAllSubTypes, callback) {
        // TODO use includeAllSubTypes
        self.incrementRunningCalls("count (" + type + ")");
        bimServerApi.call("Bimsie1LowLevelInterface", "count", {roid: roid, className: type}, function (size) {
            callback(size);
            self.decrementRunningCalls("count (" + type + ")");
        });
    };

    this.getByX = function (methodName, keyname, fetchingMap, targetMap, interfaceMethodName, interfaceFieldName, getValueMethod, list, callback) {
        var promise = new BIMSURFER.api.Promise();
        self.incrementRunningCalls(methodName + "(" + list + ")");
        if (typeof list == "string" || typeof list == "number") {
            list = [list];
        }
        self.waitForLoaded(function () {
            var len = list.length;
            // Iterating in reverse order because we remove items from this array
            while (len--) {
                var item = list[len];
                if (targetMap[item] != null) {
                    // Already loaded? Remove from list and call callback
                    var existingObject = targetMap[item].object;
                    if (existingObject._s == 1) {
                        var index = list.indexOf(item);
                        list.splice(index, 1);
                        callback(targetMap[item]);
                    }
                } else if (fetchingMap[item] != null) {
                    // Already loading? Add the callback to the list and remove from fetching list
                    fetchingMap[item].push(callback);
                    var index = list.indexOf(item);
                    list.splice(index, 1);
                }
            }
            // Any left?
            if (list.length > 0) {
                list.forEach(function (item) {
                    fetchingMap[item] = [];
                });
                self.bimServerApi.jsonSerializerFetcher.fetch(function (jsonSerializerOid) {
                    var request = {
                        roids: [self.roid],
                        serializerOid: jsonSerializerOid,
                        deep: false,
                        sync: true
                    };
                    request[interfaceFieldName] = list;
                    bimServerApi.call("Bimsie1ServiceInterface", interfaceMethodName, request, function (laid) {
                        var url = bimServerApi.generateRevisionDownloadUrl({
                            laid: laid,
                            topicId: laid,
                            serializerOid: jsonSerializerOid
                        });
                        $.getJSON(url, function (data, textStatus, jqXHR) {
                            if (data.objects.length > 0) {
                                var done = 0;
                                data.objects.forEach(function (object) {
                                    var wrapper = null;
                                    if (self.objects[object._i] != null) {
                                        wrapper = self.objects[object._i];
                                        if (wrapper.object._s != 1) {
                                            wrapper.object = object;
                                        }
                                    } else {
                                        wrapper = self.createWrapper(object, object._t);
                                    }
                                    var item = getValueMethod(object);
                                    // Checking the value again, because sometimes serializers send more objects...
                                    if ($.inArray(item, list) != -1) {
                                        targetMap[item] = wrapper;
                                        if (fetchingMap[item] != null) {
                                            fetchingMap[item].forEach(function (cb) {
                                                cb(wrapper);
                                            });
                                            delete fetchingMap[item];
                                        }
                                        callback(wrapper);
                                    }
                                    done++;
                                    if (done == data.objects.length) {
                                        bimServerApi.call("ServiceInterface", "cleanupLongAction", {actionId: laid}, function () {
                                            self.decrementRunningCalls(methodName + "(" + list + ")");
                                            promise.fire();
                                        });
                                    }
                                });
                            } else {
                                self.bimServerApi.log("Object with " + keyname + " " + list + " not found");
                                callback(null);
                                promise.fire();
                            }
                        });
                    });
                });
            } else {
                self.decrementRunningCalls(methodName + "(" + list + ")");
                promise.fire();
            }
        });
        return promise;
    };

    this.getByGuids = function (guids, callback) {
        return self.getByX("getByGuid", "guid", self.guidsFetching, self.objectsByGuid, "downloadByGuids", "guids", function (object) {
            return object.GlobalId
        }, guids, callback);
    };

    this.get = function (oids, callback) {
        return self.getByX("get", "OID", self.oidsFetching, self.objects, "downloadByOids", "oids", function (object) {
            return object._i
        }, oids, callback);
    };

    this.getByName = function (names, callback) {
        return self.getByX("getByName", "name", self.namesFetching, self.objectsByName, "downloadByNames", "names", function (object) {
            return object.getName == null ? null : object.getName()
        }, names, callback);
    };

    this.query = function (query, callback) {
        var promise = new BIMSURFER.api.Promise();
        var fullTypesLoading = {};
        query.queries.forEach(function (subQuery) {
            if (subQuery.type != null) {
                fullTypesLoading[subQuery.type] = true;
                self.loadedTypes[subQuery.type] = {};
                if (subQuery.includeAllSubTypes) {
                    var schema = self.bimServerApi.schemas[self.schema];
                    self.bimServerApi.getAllSubTypes(schema, subQuery.type, function (subTypeName) {
                        fullTypesLoading[subTypeName] = true;
                        self.loadedTypes[subTypeName] = {};
                    });
                }
            }
        });
        self.waitForLoaded(function () {
            self.bimServerApi.jsonSerializerFetcher.fetch(function (jsonSerializerOid) {
                bimServerApi.callWithFullIndication("Bimsie1ServiceInterface", "downloadByJsonQuery", {
                    roids: [self.roid],
                    jsonQuery: JSON.stringify(query),
                    serializerOid: jsonSerializerOid,
                    sync: true
                }, function (laid) {
                    var url = bimServerApi.generateRevisionDownloadUrl({
                        laid: laid,
                        topicId: laid,
                        serializerOid: jsonSerializerOid
                    });
                    self.bimServerApi.notifier.setInfo("Getting model data...", -1);
                    $.getJSON(url, function (data, textStatus, jqXHR) {
//						console.log("query", data.objects.length);
                        data.objects.forEach(function (object) {
                            var wrapper = self.objects[object._i];
                            if (wrapper == null) {
                                wrapper = self.createWrapper(object, object._t);
                                self.objects[object._i] = wrapper;
                                if (fullTypesLoading[object._t] != null) {
                                    self.loadedTypes[object._t][wrapper.oid] = wrapper;
                                }
                            } else {
                                if (object._s == 1) {
                                    wrapper.object = object;
                                }
                            }
//							if (self.loadedTypes[wrapper.getType()] == null) {
//								self.loadedTypes[wrapper.getType()] = {};
//							}
//							self.loadedTypes[wrapper.getType()][object._i] = wrapper;
                            if (object._s == 1) {
                                callback(wrapper);
                            }
                        });
//						self.dumpByType();
                        bimServerApi.call("ServiceInterface", "cleanupLongAction", {actionId: laid}, function () {
                            promise.fire();
                            self.bimServerApi.notifier.setSuccess("Model data successfully downloaded...");
                        });
                    });
                });
            });
        });
        return promise;
    };

    this.getAllOfType = function (type, includeAllSubTypes, callback) {
        var promise = new BIMSURFER.api.Promise();
        self.incrementRunningCalls("getAllOfType");
        self.waitForLoaded(function () {
            if (self.loadedDeep) {
                for (var oid in self.objects) {
                    var object = self.objects[oid];
                    if (object._t == type) {
                        callback(object);
                    }
                }
                self.decrementRunningCalls("getAllOfType");
                promise.fire();
            } else {
                var types = [];
                if (includeAllSubTypes) {
                    self.bimServerApi.getAllSubTypes(self.bimServerApi.schemas[self.schema], type, function (type) {
                        types.push(type);
                    });
                } else {
                    types.push(type);
                }

                var typesToLoad = [];

                types.forEach(function (type) {
                    if (self.loadedTypes[type] != null) {
                        for (var oid in self.loadedTypes[type]) {
                            callback(self.loadedTypes[type][oid]);
                        }
                    } else {
                        typesToLoad.push(type);
                    }
                });

                if (typesToLoad.length > 0) {
                    self.bimServerApi.jsonSerializerFetcher.fetch(function (jsonSerializerOid) {
                        bimServerApi.call("Bimsie1ServiceInterface", "downloadByTypes", {
                            roids: [self.roid],
                            classNames: typesToLoad,
                            schema: "ifc2x3tc1",
                            includeAllSubtypes: false,
                            serializerOid: jsonSerializerOid,
                            useObjectIDM: false,
                            deep: false,
                            sync: true
                        }, function (laid) {
                            var url = bimServerApi.generateRevisionDownloadUrl({
                                laid: laid,
                                topicId: laid,
                                serializerOid: jsonSerializerOid
                            });
                            $.getJSON(url, function (data, textStatus, jqXHR) {
                                if (self.loadedTypes[type] == null) {
                                    self.loadedTypes[type] = {};
                                }
                                data.objects.forEach(function (object) {
                                    if (self.objects[object._i] != null) {
                                        // Hmm we are doing a query on type, but some objects have already loaded, let's use those instead
                                        var wrapper = self.objects[object._i];
                                        if (wrapper.object._s == 1) {
                                            if (wrapper.isA(type)) {
                                                self.loadedTypes[type][object._i] = wrapper;
                                                callback(wrapper);
                                            }
                                        } else {
                                            // Replace the value with something that's LOADED
                                            wrapper.object = object;
                                            if (wrapper.isA(type)) {
                                                self.loadedTypes[type][object._i] = wrapper;
                                                callback(wrapper);
                                            }
                                        }
                                    } else {
                                        var wrapper = self.createWrapper(object, object._t);
                                        self.objects[object._i] = wrapper;
                                        if (wrapper.isA(type) && object._s == 1) {
                                            self.loadedTypes[type][object._i] = wrapper;
                                            callback(wrapper);
                                        }
                                    }
                                });
                                bimServerApi.call("ServiceInterface", "cleanupLongAction", {actionId: laid}, function () {
                                    self.decrementRunningCalls("getAllOfType");
                                    promise.fire();
                                });
                            });
                        });
                    });
                } else {
                    self.decrementRunningCalls("getAllOfType");
                    promise.fire();
                }
            }
        });
        return promise;
    };
};


