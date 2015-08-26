/*
 * BIMViews V2.0.0
 *
 * A WebGL-based IFC Viewer for BIMSurfer
 * http://bimwiews.org/
 *
 * Built on 2015-08-26
 *
 * todo
 * Copyright 2015, todo
 * http://bimvie.ws
 *
 */

/**
 The BIMSURFER namespace.


 @class BIMSURFER
 @main BIMSURFER
 @static
 @author xeolabs / http://xeolabs.com/
 */
var BIMSURFER = {

    CLASS: "BIMSURFER",

    VERSION_NUMBER: "2.0 Dev",

    /**
     * Tests if the given object is an array
     * @private
     */
    _isArray: function (testGameObject) {
        return testGameObject && !(testGameObject.propertyIsEnumerable('length')) && typeof testGameObject === 'object' && typeof testGameObject.length === 'number';
    },

    /**
     * Tests if the given value is a string
     * @param value
     * @returns {boolean}
     * @private
     */
    _isString: function (value) {
        return (typeof value === 'string' || value instanceof String);
    },

    /** Returns a shallow copy
     */
    _copy: function (o) {
        return this._apply(o, {});
    },

    /** Add properties of o to o2, overwriting them on o2 if already there
     */
    _apply: function (o, o2) {
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                o2[name] = o[name];
            }
        }
        return o2;
    },

    /**
     * Add properties of o to o2 where undefined or null on o2
     * @private
     */
    _applyIf: function (o, o2) {
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                if (o2[name] === undefined || o2[name] === null) {
                    o2[name] = o[name];
                }
            }
        }
        return o2;
    },

    /**
     * Constructor: BIMSURFER.Class
     * Base class used to construct all other classes. Includes support for multiple inheritance.
     */
    Class: function (baseClass, subClass) {
        var constructor = null;
        var classObject = subClass || baseClass;

        if (typeof classObject.__construct == 'function') {
            constructor = classObject.__construct;
        } else if (typeof baseClass.prototype.__construct == 'function') {
            constructor = function () {
                baseClass.prototype.__construct.apply(this, arguments);
            }
        } else {
            constructor = function () {
            };
        }

        var Class = constructor;

        if (typeof subClass == 'undefined') {
            Class.prototype = classObject
        } else {
            var newClass = function () {
            };
            newClass.prototype = jQuery.extend({}, baseClass.prototype);
            jQuery.extend(newClass.prototype, subClass);
            Class.prototype = new newClass;
        }

        return Class;
    }

};




;if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
    };
}

if (typeof String.prototype.firstUpper != 'function') {
    String.prototype.firstUpper = function() {
        return this.substring(0, 1).toUpperCase() + this.substring(1);
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
        return this.length > str.length && this.lastIndexOf(str) == this.length - str.length;
    };
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (typeof String.prototype.lpad != 'function') {
    String.prototype.lpad = function(padString, length) {
        var str = this;
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    };
}

if (typeof String.prototype.rpad != 'function') {
    String.prototype.rpad = function(padString, length) {
        var str = this;
        while (str.length < length) {
            str = str + padString;
        }
        return str;
    };
}

if (typeof String.prototype.contains != 'function') {
    String.prototype.contains = function(needle) {
        return this.indexOf(needle) != -1;
    };
}

String.prototype.replaceAll = function(search, replace)
{
    //if replace is null, return original string otherwise it will
    //replace search string with 'undefined'.
    if(!replace)
        return this;

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};;BIMSURFER.api = {};

BIMSURFER.api.API = function (baseUrl, notifier) {

    if (typeof jQuery !== 'undefined' && $ !== jQuery)
        var $ = jQuery;

    var self = this;

    this.interfaceMapping = {
        "ServiceInterface": "org.bimserver.ServiceInterface",
        "AuthInterface": "org.bimserver.AuthInterface",
        "SettingsInterface": "org.bimserver.SettingsInterface",
        "AdminInterface": "org.bimserver.AdminInterface",
        "PluginInterface": "org.bimserver.PluginInterface",
        "MetaInterface": "org.bimserver.MetaInterface",
        "Bimsie1LowLevelInterface": "org.buildingsmart.bimsie1.Bimsie1LowLevelInterface",
        "Bimsie1NotificationRegistryInterface": "org.buildingsmart.bimsie1.Bimsie1NotificationRegistryInterface",
        "Bimsie1AuthInterface": "org.buildingsmart.bimsie1.Bimsie1AuthInterface",
        "Bimsie1ServiceInterface": "org.buildingsmart.bimsie1.Bimsie1ServiceInterface"
    };

    this.jsonSerializerFetcher = new BIMSURFER.api.Synchronizer(function (callback) {
        self.call("PluginInterface", "getSerializerByPluginClassName", {pluginClassName: "org.bimserver.serializers.JsonSerializerPlugin"}, function (serializer) {
            callback(serializer.oid);
        });
    });

    this.translations = {
        GETDATAOBJECTSBYTYPE_BUSY: "Loading objects",
        REQUESTPASSWORDCHANGE_BUSY: "Busy sending password reset e-mail",
        REQUESTPASSWORDCHANGE_DONE: "A password reset e-mail has been sent",
        SETSERVERSETTINGS_DONE: "Server settings successfully updated",
        ENABLEPLUGIN_DONE: "Plugin successfully enabled",
        DISABLEPLUGIN_DONE: "Plugin successfully disabled",
        SETDEFAULTWEBMODULE_DONE: "Default webmodule changed",
        SETDEFAULTQUERYENGINE_DONE: "Default Query Engine successfully changed",
        SETDEFAULTMODELMERGER_DONE: "Default Model Merger successfully changed",
        SETDEFAULTSERIALIZER_DONE: "Default Serializer successfully changed",
        SETDEFAULTOBJECTIDM_DONE: "Default ObjectIDM successfully changed",
        SETDEFAULTRENDERENGINE_DONE: "Default Render Engine successfully changed",
        SETDEFAULTMODELCOMPARE_DONE: "Default Model Compare successfully changed",
        LOGIN_BUSY: "Trying to login",
        CHANGEUSERTYPE_DONE: "Type of user successfully changed",
        ADDUSER_DONE: "User successfully added",
        UPDATEINTERNALSERVICE_DONE: "Internal service successfully updated",
        UPDATEMODELCOMPARE_DONE: "Model compare plugin successfully updated",
        UPDATEMODELMERGER_DONE: "Model merger successfully updated",
        UPDATEQUERYENGINE_DONE: "Query engine plugin successfully updated",
        UPDATEOBJECTIDM_DONE: "ObjectIDM succesfully updated",
        UPDATEDESERIALIZER_DONE: "Serializer succesfully updated",
        ADDUSERTOPROJECT_DONE: "User successfully added to project",
        REMOVEUSERFROMPROJECT_DONE: "User successfully removed from project",
        UNDELETEPROJECT_DONE: "Project successfully undeleted",
        DELETEPROJECT_DONE: "Project successfully deleted",
        ADDPROJECT_DONE: "Project successfully added",
        DOWNLOAD_BUSY: "Busy downloading...",
        VALIDATEACCOUNT_DONE: "Account successfully validated, you can now login",
        ADDPROJECTASSUBPROJECT_DONE: "Sub project added successfully",
        DOWNLOADBYJSONQUERY_BUSY: "Downloading BIM",
        CHECKINFROMURL_DONE: "Done checking in from URL",
        GETLOGGEDINUSER_BUSY: "Getting user details",
        SETPLUGINSETTINGS_DONE: "Plugin settings successfully saved",
        GETSERVERINFO_BUSY: "Getting server info",
        GETVERSION_BUSY: "Getting server version",
        GETPROJECTBYPOID_BUSY: "Getting project details",
        GETALLRELATEDPROJECTS_BUSY: "Getting related project's details",
        GETSERIALIZERBYPLUGINCLASSNAME_BUSY: "Getting serializer info",
        CLEANUPLONGACTION_BUSY: "Cleaning up",
        GETREVISIONSUMMARY_BUSY: "Getting revision summary",
        DOWNLOADBYOIDS_BUSY: "Downloading model data",
        REGISTERPROGRESSHANDLER_BUSY: "Registering for updates on progress",
        GETALLREVISIONSOFPROJECT_BUSY: "Getting all revisions of project",
        GETPLUGINDESCRIPTOR_BUSY: "Getting plugin information",
        GETUSERSETTINGS_BUSY: "Getting user settings",
        GETALLQUERYENGINES_BUSY: "Getting query engines",
        REGISTERNEWPROJECTHANDLER_BUSY: "Registering for updates on new projects"
    };

    this.token = null;
    this.baseUrl = baseUrl;
    if (this.baseUrl.substring(this.baseUrl.length - 1) == "/") {
        this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
    }
    this.address = this.baseUrl + "/json";
    this.notifier = notifier;
    if (this.notifier == null) {
        this.notifier = {
            setInfo: function (message, timeout) {
            },
            setSuccess: function (message, timeout) {
            },
            setError: function () {
            },
            resetStatus: function () {
            },
            resetStatusQuick: function () {
            },
            clear: function () {
            }
        };
    }
    this.server = new BIMSURFER.api.Socket(baseUrl, this);
    this.user = null;
    this.listeners = {};
    this.autoLoginTried = false;
    this.serializersByPluginClassName = [];
    this.debug = false;
    this.classes = {};
    this.binaryDataListener = {};
    this.schemas = {};

    this.init = function (callback) {
        self.call("AdminInterface", "getServerInfo", {}, function (serverInfo) {
            self.version = serverInfo.version;
            var versionString = self.version.major + "." + self.version.minor + "." + self.version.revision;

            // Let's do the callback here, saves us 2 roundtrips to the server, and no body is going to use the schema's that soon... (we hope)
            callback(this, serverInfo);
            $.ajax({
                dataType: "json",
                url: self.baseUrl + "/js/ifc2x3tc1.js?_v=" + versionString,
                cache: true,
                success: function (result) {
                    self.schemas["ifc2x3tc1"] = result.classes;
                    self.addSubtypesToSchema(result.classes);
                    $.ajax({
                        dataType: "json",
                        url: self.baseUrl + "/js/ifc4.js?_v=" + versionString,
                        cache: true,
                        success: function (result) {
                            self.schemas["ifc4"] = result.classes;
                            self.addSubtypesToSchema(result.classes);
                        }
                    });
                }
            });
        });
    };

    this.addSubtypesToSchema = function (classes) {
        for (var typeName in classes) {
            var type = classes[typeName];
            if (type.superclasses != null) {
                type.superclasses.forEach(function (superClass) {
                    var directSubClasses = classes[superClass].directSubClasses;
                    if (directSubClasses == null) {
                        directSubClasses = [];
                        classes[superClass].directSubClasses = directSubClasses;
                    }
                    directSubClasses.push(typeName);
                });
            }
        }
    };

    this.getAllSubTypes = function (schema, typeName, callback) {
        var type = schema[typeName];
        if (type.directSubClasses != null) {
            type.directSubClasses.forEach(function (subTypeName) {
                callback(subTypeName);
                self.getAllSubTypes(schema, subTypeName, callback);
            });
        }
    };

    this.log = function (message, message2) {
        if (this.debug) {
            console.log(message, message2);
        }
    };

    this.translate = function (key) {
        key = key.toUpperCase();
        if (this.translations[key] != null) {
            return this.translations[key];
        }
        this.log("translation for " + key + " not found");
        return key;
    };

    this.login = function (username, password, rememberme, callback, errorCallback, options) {
        var request = {
            username: username,
            password: password
        };
        this.call("Bimsie1AuthInterface", "login", request, function (data) {
            self.token = data;
            if (rememberme) {
                $.cookie("autologin" + window.document.location.port, self.token, {expires: 31, path: "/"});
                $.cookie("address" + window.document.location.port, self.baseUrl, {expires: 31, path: "/"});
            } else {
                $.cookie("autologin" + window.document.location.port, self.token, {path: "/"});
                $.cookie("address" + window.document.location.port, self.baseUrl, {path: "/"});
            }
            self.notifier.setInfo("Login successful", 2000);
            self.resolveUser();
            self.server.connect(callback);
        }, errorCallback);
    };

    this.downloadViaWebsocket = function (msg) {
        msg.action = "download";
        msg.token = this.token;
        this.server.send(msg);
    };

    this.setBinaryDataListener = function (channelId, listener) {
        this.binaryDataListener[channelId] = listener;
    };

    this.processNotification = function (message) {
        if (message instanceof ArrayBuffer) {
            var view = new DataView(message, 0, 4);
            var channelId = view.getInt32(0);
            var listener = this.binaryDataListener[channelId];
            listener(message);
        } else {
            var intf = message["interface"];
            if (this.listeners[intf] != null) {
                if (this.listeners[intf][message.method] != null) {
                    var ar = null;
                    this.listeners[intf][message.method].forEach(function (listener) {
                        if (ar == null) {
                            // Only parse the arguments once, or when there are no listeners, not even once
                            ar = [];
                            var i = 0;
                            for (var key in message.parameters) {
                                ar[i++] = message.parameters[key];
                            }
                        }
                        listener.apply(null, ar);
                    });
                } else {
                    console.log("No listeners on interface " + intf + " for method " + message.method);
                }
            } else {
                console.log("No listeners for interface " + intf);
            }
        }
    };

    this.resolveUser = function (callback) {
        this.call("AuthInterface", "getLoggedInUser", {}, function (data) {
            this.user = data;
            if (callback != null) {
                callback(this.user);
            }
        });
    };

    this.logout = function (callback) {
        $.removeCookie("autologin" + window.document.location.port, {path: "/"});
        this.call("Bimsie1AuthInterface", "logout", {}, function () {
            this.notifier.setInfo("Logout successful");
            callback();
        });
    };

    this.generateRevisionDownloadUrl = function (settings) {
        return this.baseUrl + "/download?token=" + this.token + "&longActionId=" + settings.laid + (settings.zip ? "&zip=on" : "") + "&serializerOid=" + settings.serializerOid + "&topicId=" + settings.topicId;
    };

    this.generateExtendedDataDownloadUrl = function (edid) {
        return this.baseUrl + "/download?token=" + this.token + "&action=extendeddata&edid=" + edid;
    };

    this.getSerializerByPluginClassName = function (pluginClassName, callback) {
        if (this.serializersByPluginClassName[name] == null) {
            this.call("PluginInterface", "getSerializerByPluginClassName", {pluginClassName: pluginClassName}, function (serializer) {
                self.serializersByPluginClassName[name] = serializer;
                callback(serializer);
            });
        } else {
            callback(this.serializersByPluginClassName[name]);
        }
    },

        this.getMessagingSerializerByPluginClassName = function (pluginClassName, callback) {
            if (this.serializersByPluginClassName[name] == null) {
                this.call("PluginInterface", "getMessagingSerializerByPluginClassName", {pluginClassName: pluginClassName}, function (serializer) {
                    self.serializersByPluginClassName[name] = serializer;
                    callback(serializer);
                });
            } else {
                callback(this.serializersByPluginClassName[name]);
            }
        },

        this.register = function (interfaceName, methodName, callback, registerCallback) {
            if (callback == null) {
                throw "Cannot register null callback";
            }
            if (this.listeners[interfaceName] == null) {
                this.listeners[interfaceName] = {};
            }
            if (this.listeners[interfaceName][methodName] == null) {
                this.listeners[interfaceName][methodName] = [];
            }
            this.listeners[interfaceName][methodName].push(callback);
            if (registerCallback != null) {
                registerCallback();
            }
        };

    this.registerNewRevisionOnSpecificProjectHandler = function (poid, handler, callback) {
        this.register("Bimsie1NotificationInterface", "newRevision", handler, function () {
            self.call("Bimsie1NotificationRegistryInterface", "registerNewRevisionOnSpecificProjectHandler", {
                endPointId: self.server.endPointId,
                poid: poid
            }, function () {
                if (callback != null) {
                    callback();
                }
            });
        });
    };

    this.registerNewExtendedDataOnRevisionHandler = function (roid, handler, callback) {
        this.register("Bimsie1NotificationInterface", "newExtendedData", handler, function () {
            self.call("Bimsie1NotificationRegistryInterface", "registerNewExtendedDataOnRevisionHandler", {
                endPointId: self.server.endPointId,
                roid: roid
            }, function () {
                if (callback != null) {
                    callback();
                }
            });
        });
    };

    this.registerNewUserHandler = function (handler, callback) {
        this.register("Bimsie1NotificationInterface", "newUser", handler, function () {
            self.call("Bimsie1NotificationRegistryInterface", "registerNewUserHandler", {endPointId: self.server.endPointId}, function () {
                if (callback != null) {
                    callback();
                }
            });
        });
    };

    this.unregisterNewUserHandler = function (handler, callback) {
        this.unregister(handler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterNewUserHandler", {endPointId: self.server.endPointId}, function () {
            if (callback != null) {
                callback();
            }
        });
    };

    this.unregisterChangeProgressProjectHandler = function (poid, newHandler, closedHandler, callback) {
        this.unregister(newHandler);
        this.unregister(closedHandler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterChangeProgressOnProject", {
            poid: poid,
            endPointId: this.server.endPointId
        }, callback);
    };

    this.registerChangeProgressProjectHandler = function (poid, newHandler, closedHandler, callback) {
        this.register("Bimsie1NotificationInterface", "newProgressOnProjectTopic", newHandler, function () {
            self.register("Bimsie1NotificationInterface", "closedProgressOnProjectTopic", closedHandler, function () {
                self.call("Bimsie1NotificationRegistryInterface", "registerChangeProgressOnProject", {
                    poid: poid,
                    endPointId: self.server.endPointId
                }, function () {
                    if (callback != null) {
                        callback();
                    }
                });
            });
        });
    }

    this.unregisterChangeProgressServerHandler = function (newHandler, closedHandler, callback) {
        this.unregister(newHandler);
        this.unregister(closedHandler);
        if (self.server.endPointId != null) {
            self.call("Bimsie1NotificationRegistryInterface", "unregisterChangeProgressOnServer", {endPointId: self.server.endPointId}, callback);
        }
    };

    this.registerChangeProgressServerHandler = function (newHandler, closedHandler, callback) {
        this.register("Bimsie1NotificationInterface", "newProgressOnServerTopic", newHandler, function () {
            self.register("Bimsie1NotificationInterface", "closedProgressOnServerTopic", closedHandler, function () {
                self.call("Bimsie1NotificationRegistryInterface", "registerChangeProgressOnServer", {endPointId: self.server.endPointId}, function () {
                    if (callback != null) {
                        callback();
                    }
                });
            });
        });
    }

    this.unregisterChangeProgressRevisionHandler = function (roid, newHandler, closedHandler, callback) {
        this.unregister(newHandler);
        this.unregister(closedHandler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterChangeProgressOnProject", {
            roid: roid,
            endPointId: this.server.endPointId
        }, callback);
    };

    this.registerChangeProgressRevisionHandler = function (poid, roid, newHandler, closedHandler, callback) {
        this.register("Bimsie1NotificationInterface", "newProgressOnRevisionTopic", newHandler, function () {
            self.register("Bimsie1NotificationInterface", "closedProgressOnRevisionTopic", closedHandler, function () {
                self.call("Bimsie1NotificationRegistryInterface", "registerChangeProgressOnRevision", {
                    poid: poid,
                    roid: roid,
                    endPointId: self.server.endPointId
                }, function () {
                    if (callback != null) {
                        callback();
                    }
                });
            });
        });
    }

    this.registerNewProjectHandler = function (handler, callback) {
        this.register("Bimsie1NotificationInterface", "newProject", handler, function () {
            self.call("Bimsie1NotificationRegistryInterface", "registerNewProjectHandler", {endPointId: self.server.endPointId}, function () {
                if (callback != null) {
                    callback();
                }
            });
        });
    }

    this.unregisterNewProjectHandler = function (handler, callback) {
        this.unregister(handler);
        if (this.server.endPointId != null) {
            this.call("Bimsie1NotificationRegistryInterface", "unregisterNewProjectHandler", {endPointId: this.server.endPointId}, function () {
                if (callback != null) {
                    callback();
                }
            });
        }
    };

    this.unregisterNewRevisionOnSpecificProjectHandler = function (poid, handler, callback) {
        this.unregister(handler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterNewRevisionOnSpecificProjectHandler", {
            endPointId: this.server.endPointId,
            poid: poid
        }, function () {
            if (callback != null) {
                callback();
            }
        });
    };

    this.unregisterNewExtendedDataOnRevisionHandler = function (roid, handler, callback) {
        this.unregister(handler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterNewExtendedDataOnRevisionHandler", {
            endPointId: this.server.endPointId,
            roid: roid
        }, function () {
            if (callback != null) {
                callback();
            }
        });
    };

    this.registerProgressHandler = function (topicId, handler, callback) {
        this.register("Bimsie1NotificationInterface", "progress", handler, function () {
            self.call("Bimsie1NotificationRegistryInterface", "registerProgressHandler", {
                topicId: topicId,
                endPointId: self.server.endPointId
            }, function () {
                if (callback != null) {
                    callback();
                }
            });
        });
    };

    this.unregisterProgressHandler = function (topicId, handler, callback) {
        this.unregister(handler);
        this.call("Bimsie1NotificationRegistryInterface", "unregisterProgressHandler", {
            topicId: topicId,
            endPointId: this.server.endPointId
        }, function () {
        }).done(callback);
    };

    this.unregister = function (listener) {
        for (var i in this.listeners) {
            for (var j in this.listeners[i]) {
                var list = this.listeners[i][j];
                for (var k = 0; k < list.length; k++) {
                    if (list[k] === listener) {
                        list.splice(k, 1);
                        return;
                    }
                }
            }
        }
    };

    this.callWs = function (interfaceName, method, data) {
        var requestObject = {
            request: this.createRequest(interfaceName, method, data)
        };
        if (this.token != null) {
            requestObject.token = this.token;
        }
        this.server.send(requestObject);
    };

    this.createRequest = function (interfaceName, method, data) {
        var object = {};
        object["interface"] = interfaceName;
        object.method = method;
        object.parameters = data;

        return object;
    };

    this.multiCall = function (requests, callback, errorCallback, showBusy, showDone, showError) {
        var promise = new BIMSURFER.api.Promise();
        var request = null;
        if (requests.length == 1) {
            request = requests[0];
            if (this.interfaceMapping[request[0]] == null) {
                this.log("Interface " + request[0] + " not found");
            }
            request = {request: this.createRequest(this.interfaceMapping[request[0]], request[1], request[2])};
        } else if (requests.length > 1) {
            var requestObjects = [];
            requests.forEach(function (request) {
                requestObjects.push(self.createRequest(self.interfaceMapping[request[0]], request[1], request[2]));
            });
            request = {
                requests: requestObjects
            };
        } else if (requests.length == 0) {
            promise.fire();
            callback();
        }

//		this.notifier.clear();

        if (this.token != null) {
            request.token = this.token;
        }

        var key = requests[0][1];
        requests.forEach(function (item, index) {
            if (index > 0) {
                key += "_" + item;
            }
        });

        var showedBusy = false;
        if (showBusy) {
            if (this.lastBusyTimeOut != null) {
                clearTimeout(this.lastBusyTimeOut);
                this.lastBusyTimeOut = null;
            }
            if (typeof window !== 'undefined' && window.setTimeout != null) {
                this.lastBusyTimeOut = window.setTimeout(function () {
                    this.notifier.setInfo(this.translate(key + "_BUSY"), -1);
                    showedBusy = true;
                }, 200);
            }
        }

//		this.notifier.resetStatusQuick();

        this.log("request", request);

        $.ajax(this.address, {
            type: "POST",
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                self.log("response", data);
                var errorsToReport = [];
                if (requests.length == 1) {
                    if (showBusy) {
                        if (self.lastBusyTimeOut != null) {
                            clearTimeout(self.lastBusyTimeOut);
                        }
                    }
                    if (data.response.exception != null) {
                        if (data.response.exception.message == "Invalid token" && !self.autoLoginTried && $.cookie("username" + window.document.location.port) != null && $.cookie("autologin" + window.document.location.port) != null) {
                            self.autologin($.cookie("username" + window.document.location.port), $.cookie("autologin" + window.document.location.port), function () {
                                self.log("Trying to connect with autologin");
                                self.multiCall(requests, callback, errorCallback);
                            });
                        } else {
                            if (showError) {
                                if (self.lastTimeOut != null) {
                                    clearTimeout(self.lastTimeOut);
                                }
                                self.notifier.setError(data.response.exception.message);
                            } else {
                                if (showedBusy) {
                                    self.notifier.resetStatus();
                                }
                            }
                        }
                    } else {
                        if (showDone) {
                            self.notifier.setSuccess(self.translate(key + "_DONE"), 5000);
                        } else {
                            if (showedBusy) {
                                self.notifier.resetStatus();
                            }
                        }
                    }
                } else if (requests.length > 1) {
                    data.responses.forEach(function (response) {
                        if (response.exception != null) {
                            if (errorCallback == null) {
                                self.notifier.setError(response.exception.message);
                            } else {
                                errorsToReport.push(response.exception);
                            }
                        }
                    });
                }
                if (errorsToReport.length > 0) {
                    errorCallback(errorsToReport);
                } else {
                    if (requests.length == 1) {
                        callback(data.response);
                    } else if (requests.length > 1) {
                        callback(data.responses);
                    }
                }
                promise.fire();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == "abort") {
                    // ignore
                } else {
                    self.log(errorThrown);
                    self.log(textStatus);
                    self.log(jqXHR);
                    if (self.lastTimeOut != null) {
                        clearTimeout(self.lastTimeOut);
                    }
                    self.notifier.setError("ERROR_REMOTE_METHOD_CALL");
                }
                if (callback != null) {
                    var result = new Object();
                    result.error = textStatus;
                    result.ok = false;
                    callback(result);
                }
                promise.fire();
            }
        });
        return promise;
    };

    this.getModel = function (poid, roid, schema, deep, callback) {
        var model = new BIMSURFER.api.Model(this, poid, roid, schema);
        model.load(deep, callback);
        return model;
    };

    this.createModel = function (poid, callback) {
        var model = new BIMSURFER.api.Model(this, poid);
        model.init(callback);
        return model;
    };

    this.callWithNoIndication = function (interfaceName, methodName, data, callback) {
        return this.call(interfaceName, methodName, data, callback, null, false, false, false);
    };

    this.callWithFullIndication = function (interfaceName, methodName, data, callback) {
        return this.call(interfaceName, methodName, data, callback, null, true, true, true);
    };

    this.callWithUserErrorIndication = function (action, data, callback) {
        return this.call(interfaceName, methodName, data, callback, null, false, false, true);
    };

    this.callWithUserErrorAndDoneIndication = function (action, data, callback) {
        return this.call(interfaceName, methodName, data, callback, null, false, true, true);
    };

    this.isA = function (schema, typeSubject, typeName) {
        var isa = false;
        if (typeSubject == typeName) {
            return true;
        }
        var subject = this.schemas[schema][typeSubject];
        if (subject == null) {
            console.log(typeSubject, "not found");
        }
        subject.superclasses.some(function (superclass) {
            if (superclass == typeName) {
                isa = true;
                return true;
            }
            if (self.isA(schema, superclass, typeName)) {
                isa = true;
                return true;
            }
            return false;
        });
        return isa;
    };

    this.setToken = function (token, callback, errorCallback) {
        this.token = token;
        this.call("AuthInterface", "getLoggedInUser", {}, function (data) {
            self.user = data;
            self.server.connect(callback);
        }, function () {
            errorCallback();
        });
    };

    this.call = function (interfaceName, methodName, data, callback, errorCallback, showBusy, showDone, showError) {
        var showBusy = typeof showBusy !== 'undefined' ? showBusy : true;
        var showDone = typeof showDone !== 'undefined' ? showDone : false;
        var showError = typeof showError !== 'undefined' ? showError : true;

        return this.multiCall([[
            interfaceName,
            methodName,
            data
        ]], function (data) {
            if (data.exception == null) {
                if (callback != null) {
                    callback(data.result);
                }
            } else {
                if (errorCallback != null) {
                    errorCallback(data.exception);
                }
            }
        }, errorCallback, showBusy, showDone, showError);
    };

    this.server.listener = this.processNotification;
};



;BIMSURFER.api.EventRegistry = function() {

    var o = this;

    o.registry = [];

    this.register = function (fn) {
        var skip = false;
        o.registry.forEach(function (existing) {
            if (existing == fn) {
                skip = true;
            }
        });
        if (!skip) {
            o.registry.push(fn);
        }
    };

    this.unregister = function (fn) {
        var len = o.registry.length;
        while (len--) {
            if (o.registry[len] == fn) {
                o.registry.splice(len, 1);
            }
        }
    };

    this.size = function () {
        return o.registry.length;
    };

    this.trigger = function (callback) {
        o.registry.forEach(callback);
    };

    this.clear = function () {
        o.registry = [];
    };
};

;
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


;BIMSURFER.api.Promise = function(counter) {

    var o = this;

    o.isDone = false;
    o.chains = [];
    o.callback = null;
    o.counter = counter;

    this.done = function(callback){
        if (o.isDone) {
            callback();
        } else {
            if (o.callback != null) {
                if (o.callback instanceof Array) {
                    o.callback.push(callback);
                } else {
                    o.callback = [o.callback, callback];
                }
            } else {
                o.callback = callback;
            }
        }
        return o;
    };

    this.inc = function(){
        if (o.counter == null) {
            o.counter = 0;
        }
        o.counter++;
    };

    this.dec = function(){
        if (o.counter == null) {
            o.counter = 0;
        }
        o.counter--;
        console.log(o.counter);
        if (o.counter == 0) {
            o.done = true;
            o.fire();
        }
    };

    this.fire = function(){
        if (o.isDone) {
            console.log("Promise already fired, not triggering again...");
            return;
        }
        o.isDone = true;
        if (o.callback != null) {
            if (o.callback instanceof Array) {
                o.callback.forEach(function(cb){
                    cb();
                });
            } else {
                o.callback();
            }
        }
    };

    this.chain = function(otherPromise) {
        var promises;
        if (otherPromise instanceof Array) {
            promises = otherPromise;
        } else {
            promises = [otherPromise];
        }
        promises.forEach(function(promise){
            if (!promise.isDone) {
                o.chains.push(promise);
                promise.done(function(){
                    for (var i=o.chains.length-1; i>=0; i--) {
                        if (o.chains[i] == promise) {
                            o.chains.splice(i, 1);
                        }
                    }
                    if (o.chains.length == 0) {
                        o.fire();
                    }
                });
            }
        });
        if (o.chains.length == 0) {
            o.fire();
        }
    };
}
;BIMSURFER.api.Socket = function(baseUrl, bimServerApi) {
    var othis = this;
    this.connected = false;
    this.openCallbacks = [];
    this.endPointId = null;
    this.listener = null;
    this.tosend = [];
    this.tosendAfterConnect = [];
    this.messagesReceived = 0;

    this.connect = function (callback) {
        othis.openCallbacks.push(callback);
        var location = bimServerApi.baseUrl.toString().replace('http://', 'ws://').replace('https://', 'wss://') + "/stream";
        if ("WebSocket" in window) {
            try {
                this._ws = new WebSocket(location);
                this._ws.binaryType = "arraybuffer";
                this._ws.onopen = this._onopen;
                this._ws.onmessage = this._onmessage;
                this._ws.onclose = this._onclose;
                this._ws.onerror = this._onerror;
            } catch (err) {
                bimServerApi.notifier.setError("WebSocket error" + (err.message != null ? (": " + err.message) : ""));
            }
        } else {
            bimServerApi.notifier.setError("This browser does not support websockets <a href=\"https://github.com/opensourceBIM/bimvie.ws/wiki/Requirements\"></a>");
        }
    };

    this._onerror = function (err) {
        console.log(err);
        bimServerApi.notifier.setError("WebSocket error" + (err.message != null ? (": " + err.message) : ""));
    };

    this._onopen = function () {
        while (othis.tosendAfterConnect.length > 0 && othis._ws.readyState == 1) {
            var messageArray = othis.tosendAfterConnect.splice(0, 1);
            othis._sendWithoutEndPoint(messageArray[0]);
        }
    };

    this._sendWithoutEndPoint = function (message) {
        if (othis._ws && othis._ws.readyState == 1) {
            othis._ws.send(message);
        } else {
            othis.tosendAfterConnect.push(message);
        }
    };

    this._send = function (message) {
        if (othis._ws && othis._ws.readyState == 1 && othis.endPointId != null) {
            othis._ws.send(message);
        } else {
            console.log("Waiting", message);
            othis.tosend.push(message);
        }
    };

    this.send = function (object) {
        var str = JSON.stringify(object);
        bimServerApi.log("Sending", str);
        othis._send(str);
    };

    this._onmessage = function (message) {
        othis.messagesReceived++;
        if (othis.messagesReceived % 10 == 0) {
//			console.log(othis.messagesReceived);
        }
        if (message.data instanceof ArrayBuffer) {
            othis.listener(message.data);
        } else {
            var incomingMessage = JSON.parse(message.data);
            bimServerApi.log("incoming", incomingMessage);
            if (incomingMessage.welcome != null) {
                othis._sendWithoutEndPoint(JSON.stringify({"token": bimServerApi.token}));
            } else if (incomingMessage.endpointid != null) {
                othis.endPointId = incomingMessage.endpointid;
                othis.connected = true;
                othis.openCallbacks.forEach(function (callback) {
                    callback();
                });
                while (othis.tosend.length > 0 && othis._ws.readyState == 1) {
                    var messageArray = othis.tosend.splice(0, 1);
                    console.log(messageArray[0]);
                    othis._send(messageArray[0]);
                }
                othis.openCallbacks = [];
            } else {
                if (incomingMessage.request != null) {
                    othis.listener(incomingMessage.request);
                } else if (incomingMessage.requests != null) {
                    incomingMessage.requests.forEach(function (request) {
                        othis.listener(request);
                    });
                }
            }
        }
    };

    this._onclose = function (m) {
        othis._ws = null;
        othis.connected = false;
        othis.openCallbacks = [];
        othis.endpointid = null;
    };
}
;BIMSURFER.api.Synchronizer = function (fetcher) {

    var othis = this;

    othis.result = null;
    othis.state = "none";
    othis.waiters = [];

    this.notify = function (result) {
        othis.result = result;
        othis.state = "done";
        othis.waiters.forEach(function (waiter) {
            waiter(result);
        });
        othis.waiters = [];
    };

    this.fetch = function (callback) {
        if (othis.state == "none") {
            othis.waiters.push(callback);
            othis.state = "fetching";
            fetcher(othis.notify);
        } else if (othis.state == "done") {
            callback(othis.result);
        } else if (othis.state == "fetching") {
            othis.waiters.push(callback)
        }
    };
};BIMSURFER.api.Variable = function(initialValue) {

    var o = this;
    o.value = initialValue;
    o.eventRegistry = new EventRegistry();

    this.set = function (value) {
        o.value = value;
        o.eventRegistry.trigger(function (cb) {
            cb(value);
        });
    };

    this.get = function () {
        return o.value;
    };

    this.register = o.eventRegistry.register;
    this.unregister = o.eventRegistry.unregister;
};
;/*
  Based on Simple JavaScript Inheritance
  By John Resig http://ejohn.org/
  MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {

    var initializing = false;

    var fnTest = /xyz/.test(function () {xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function () {
    };

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {

        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {

            //
            if (name === "_props") {
                var props = prop[name];
                var descriptor;
                for (var key in props) {
                    descriptor = props[key];
                    Object.defineProperty(prototype, key, descriptor);
                }
                continue;
            }

            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor
        function Class() {

            // All construction is actually done in the init method
            if (!initializing && this.__init)
                this.__init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

;BIMSURFER.utils = BIMSURFER.utils || {};

BIMSURFER.utils.isset = function (variable) {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'undefined' || arguments[i] == null) {
            return false;
        }
    }
    return true;
};

BIMSURFER.utils.isArray = function (variable) {
    return Object.prototype.toString.call(variable) === '[object Array]'
};

BIMSURFER.utils.removeA  = function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
};
;(function () {

    "use strict";

    BIMSURFER.utils = BIMSURFER.utils || {};

    /**
     * Generic map of IDs to items - can generate own IDs or accept given IDs. IDs should be strings in order to not
     * clash with internally generated IDs, which are numbers.
     */
    BIMSURFER.utils.Map = function (items, baseId) {

        /**
         * @property Items in this map
         */
        this.items = items || [];

        baseId = baseId || 0;
        var lastUniqueId = baseId + 1;

        /**
         * Adds an item to the map and returns the ID of the item in the map. If an ID is given, the item is
         * mapped to that ID. Otherwise, the map automatically generates the ID and maps to that.
         *
         * id = myMap.addItem("foo") // ID internally generated
         *
         * id = myMap.addItem("foo", "bar") // ID is "foo"
         *
         */
        this.addItem = function () {
            var item;
            if (arguments.length === 2) {
                var id = arguments[0];
                item = arguments[1];
                if (this.items[id]) { // Won't happen if given ID is string
                    throw "ID clash: '" + id + "'";
                }
                this.items[id] = item;
                return id;

            } else {
                while (true) {
                    item = arguments[0];
                    var findId = lastUniqueId++;
                    if (!this.items[findId]) {
                        this.items[findId] = item;
                        return findId;
                    }
                }
            }
        };

        /**
         * Removes the item of the given ID from the map and returns it
         */
        this.removeItem = function (id) {
            var item = this.items[id];
            delete this.items[id];
            return item;
        };
    };

})();;/**
 * Math utilities.
 *
 * @module BIMSURFER
 * @submodule math
 */;/**
 * Math functions, used within BIMSURFER, but also available for you to use in your application code.
 * @module BIMSURFER
 * @submodule math
 * @class math
 * @static
 */
(function () {

    "use strict";

    /*
     * Optimizations made based on glMatrix by Brandon Jones
     */

    /*
     * Copyright (c) 2010 Brandon Jones
     *
     * This software is provided 'as-is', without any express or implied
     * warranty. In no event will the authors be held liable for any damages
     * arising from the use of this software.
     *
     * Permission is granted to anyone to use this software for any purpose,
     * including commercial applications, and to alter it and redistribute it
     * freely, subject to the following restrictions:
     *
     *    1. The origin of this software must not be misrepresented; you must not
     *    claim that you wrote the original software. If you use this software
     *    in a product, an acknowledgment in the product documentation would be
     *    appreciated but is not required.
     *
     *    2. Altered source versions must be plainly marked as such, and must not
     *    be misrepresented as being the original software.
     *
     *    3. This notice may not be removed or altered from any source
     *    distribution.
     */


    BIMSURFER.math = {

        /**
         * Returns a new UUID.
         * @method createUUID
         * @static
         * @return string The new UUID
         */
        createUUID: function () {
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = new Array(36);
            var rnd = 0, r;
            return function () {
                for (var i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[ i ] = '-';
                    } else if (i === 14) {
                        uuid[ i ] = '4';
                    } else {
                        if (rnd <= 0x02) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];
                    }
                }
                return uuid.join('');
            };

        }(),

        vec2: function () {
            return new Float64Array(2);
        },

        vec3: function () {
            return new Float64Array(3);
        },

        vec4: function () {
            return new Float64Array(4);
        },

        /**
         *
         */
        mat3: function () {
            return new Float64Array(9);
        },

        /**
         *
         */
        mat4: function () {
            return new Float64Array(16);
        },

        /**
         * Floating-point modulus
         * @param a
         * @param b
         * @returns {*}
         */
        fmod: function (a, b) {
            if (a < b) {
                console.error("BIMSURFER.math.fmod : Attempting to find modulus within negative range - would be infinite loop - ignoring");
                return a;
            }
            while (b <= a) {
                a -= b;
            }
            return a;
        },

        /**
         * Negates a four-element vector.
         * @method negateVec4
         * @param {Array(Number)} v Vector to negate
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        negateVec4: function (v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = -v[0];
            dest[1] = -v[1];
            dest[2] = -v[2];
            dest[3] = -v[3];
            return dest;
        },

        /**
         * Adds one four-element vector to another.
         * @method addVec4
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        addVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] + v[0];
            dest[1] = u[1] + v[1];
            dest[2] = u[2] + v[2];
            dest[3] = u[3] + v[3];
            return dest;
        },

        /**
         * Adds a scalar value to each element of a four-element vector.
         * @method addVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        addVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] + s;
            dest[1] = v[1] + s;
            dest[2] = v[2] + s;
            dest[3] = v[3] + s;
            return dest;
        },

        /**
         * Adds one three-element vector to another.
         * @method addVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        addVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] + v[0];
            dest[1] = u[1] + v[1];
            dest[2] = u[2] + v[2];
            return dest;
        },

        /**
         * Adds a scalar value to each element of a three-element vector.
         * @method addVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        addVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] + s;
            dest[1] = v[1] + s;
            dest[2] = v[2] + s;
            return dest;
        },

        /**
         * Subtracts one four-element vector from another.
         * @method subVec4
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            dest[2] = u[2] - v[2];
            dest[3] = u[3] - v[3];
            return dest;
        },

        /**
         * Subtracts one three-element vector from another.
         * @method subVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            dest[2] = u[2] - v[2];
            return dest;
        },

        /**
         * Subtracts one two-element vector from another.
         * @method subVec2
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Vector to subtract
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        subVec2: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] - v[0];
            dest[1] = u[1] - v[1];
            return dest;
        },

        /**
         * Subtracts a scalar value from each element of a four-element vector.
         * @method subVec4Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        subVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] - s;
            dest[1] = v[1] - s;
            dest[2] = v[2] - s;
            dest[3] = v[3] - s;
            return dest;
        },

        /**
         * Sets each element of a 4-element vector to a scalar value minus the value of that element.
         * @method subScalarVec4
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        subScalarVec4: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s - v[0];
            dest[1] = s - v[1];
            dest[2] = s - v[2];
            dest[3] = s - v[3];
            return dest;
        },

        /**
         * Multiplies one three-element vector by another.
         * @method mulVec3
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        mulVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] * v[0];
            dest[1] = u[1] * v[1];
            dest[2] = u[2] * v[2];
            dest[3] = u[3] * v[3];
            return dest;
        },

        /**
         * Multiplies each element of a four-element vector by a scalar.
         * @method mulVec34calar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            dest[2] = v[2] * s;
            dest[3] = v[3] * s;
            return dest;
        },

        /**
         * Multiplies each element of a three-element vector by a scalar.
         * @method mulVec3Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            dest[2] = v[2] * s;
            return dest;
        },

        /**
         * Multiplies each element of a two-element vector by a scalar.
         * @method mulVec2Scalar
         * @param {Array(Number)} v The vector
         * @param {Number} s The scalar
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, v otherwise
         */
        mulVec2Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] * s;
            dest[1] = v[1] * s;
            return dest;
        },

        /**
         * Divides one three-element vector by another.
         * @method divVec3
         * @static
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        divVec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] / v[0];
            dest[1] = u[1] / v[1];
            dest[2] = u[2] / v[2];
            return dest;
        },

        /**
         * Divides one four-element vector by another.
         * @method divVec4
         * @static
         * @param {Array(Number)} u First vector
         * @param {Array(Number)} v Second vector
         * @param  {Array(Number)} [dest] Destination vector
         * @return {Array(Number)} dest if specified, u otherwise
         */
        divVec4: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            dest[0] = u[0] / v[0];
            dest[1] = u[1] / v[1];
            dest[2] = u[2] / v[2];
            dest[3] = u[3] / v[3];
            return dest;
        },

        /**
         * @param v vec3
         * @param s scalar
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divScalarVec3: function (s, v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s / v[0];
            dest[1] = s / v[1];
            dest[2] = s / v[2];
            return dest;
        },

        /**
         * @param v vec3
         * @param s scalar
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divVec3Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] / s;
            dest[1] = v[1] / s;
            dest[2] = v[2] / s;
            return dest;
        },

        /**
         * @param v vec4
         * @param s scalar
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        divVec4Scalar: function (v, s, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = v[0] / s;
            dest[1] = v[1] / s;
            dest[2] = v[2] / s;
            dest[3] = v[3] / s;
            return dest;
        },


        /**
         * @param s scalar
         * @param v vec4
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise

         */
        divScalarVec4: function (s, v, dest) {
            if (!dest) {
                dest = v;
            }
            dest[0] = s / v[0];
            dest[1] = s / v[1];
            dest[2] = s / v[2];
            dest[3] = s / v[3];
            return dest;
        },


        dotVec4: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3]);
        },


        cross3Vec4: function (u, v) {
            var u0 = u[0], u1 = u[1], u2 = u[2];
            var v0 = v[0], v1 = v[1], v2 = v[2];
            return [
                    u1 * v2 - u2 * v1,
                    u2 * v0 - u0 * v2,
                    u0 * v1 - u1 * v0,
                0.0];
        },

        /**
         * @param u vec3
         * @param v vec3
         * @param dest vec3 - optional destination
         * @return [] dest if specified, u otherwise
         *
         */
        cross3Vec3: function (u, v, dest) {
            if (!dest) {
                dest = u;
            }
            var x = u[0], y = u[1], z = u[2];
            var x2 = v[0], y2 = v[1], z2 = v[2];
            dest[0] = y * z2 - z * y2;
            dest[1] = z * x2 - x * z2;
            dest[2] = x * y2 - y * x2;
            return dest;
        },

        /**  */
        sqLenVec4: function (v) {
            return BIMSURFER.math.dotVec4(v, v);
        },

        /**  */
        lenVec4: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec4(v));
        },

        /**  */
        dotVec3: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
        },

        /**  */
        dotVec2: function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]);
        },

        /**  */
        sqLenVec3: function (v) {
            return BIMSURFER.math.dotVec3(v, v);
        },

        /**  */
        sqLenVec2: function (v) {
            return BIMSURFER.math.dotVec2(v, v);
        },

        /**  */
        lenVec3: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec3(v));
        },

        /**  */
        lenVec2: function (v) {
            return Math.sqrt(BIMSURFER.math.sqLenVec2(v));
        },

        /**
         * @param v vec3
         * @param dest vec3 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        rcpVec3: function (v, dest) {
            return BIMSURFER.math.divScalarVec3(1.0, v, dest);
        },

        /**
         * @param v vec4
         * @param dest vec4 - optional destination
         * @return [] dest if specified, v otherwise
         *
         */
        normalizeVec4: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec4(v);
            return BIMSURFER.math.mulVec4Scalar(v, f, dest);
        },

        /**  */
        normalizeVec3: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec3(v);
            return BIMSURFER.math.mulVec3Scalar(v, f, dest);
        },

// 
        normalizeVec2: function (v, dest) {
            var f = 1.0 / BIMSURFER.math.lenVec2(v);
            return BIMSURFER.math.mulVec2Scalar(v, f, dest);
        },

        /**  */

        /**  */
        dupMat4: function (m) {
            return m.slice(0, 16);
        },

        /**  */
        mat4To3: function (m) {
            return [
                m[0], m[1], m[2],
                m[4], m[5], m[6],
                m[8], m[9], m[10]
            ];
        },

        /**  */
        m4s: function (s) {
            return [
                s, s, s, s,
                s, s, s, s,
                s, s, s, s,
                s, s, s, s
            ];
        },

        /**  */
        setMat4ToZeroes: function () {
            return BIMSURFER.math.m4s(0.0);
        },

        /**  */
        setMat4ToOnes: function () {
            return BIMSURFER.math.m4s(1.0);
        },

        /**  */
        diagonalMat4v: function (v) {
            return [
                v[0], 0.0, 0.0, 0.0,
                0.0, v[1], 0.0, 0.0,
                0.0, 0.0, v[2], 0.0,
                0.0, 0.0, 0.0, v[3]
            ];
        },

        /**  */
        diagonalMat4c: function (x, y, z, w) {
            return BIMSURFER.math.diagonalMat4v([x, y, z, w]);
        },

        /**  */
        diagonalMat4s: function (s) {
            return BIMSURFER.math.diagonalMat4c(s, s, s, s);
        },

        /**  */
        identityMat4: function () {
            return BIMSURFER.math.diagonalMat4v([1.0, 1.0, 1.0, 1.0]);
        },

        /**  */
        isIdentityMat4: function (m) {
            if (m[0] !== 1.0 || m[1] !== 0.0 || m[2] !== 0.0 || m[3] !== 0.0 ||
                m[4] !== 0.0 || m[5] !== 1.0 || m[6] !== 0.0 || m[7] !== 0.0 ||
                m[8] !== 0.0 || m[9] !== 0.0 || m[10] !== 1.0 || m[11] !== 0.0 ||
                m[12] !== 0.0 || m[13] !== 0.0 || m[14] !== 0.0 || m[15] !== 1.0) {
                return false;
            }
            return true;
        },

        /**
         * @param m mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        negateMat4: function (m, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = -m[0];
            dest[1] = -m[1];
            dest[2] = -m[2];
            dest[3] = -m[3];
            dest[4] = -m[4];
            dest[5] = -m[5];
            dest[6] = -m[6];
            dest[7] = -m[7];
            dest[8] = -m[8];
            dest[9] = -m[9];
            dest[10] = -m[10];
            dest[11] = -m[11];
            dest[12] = -m[12];
            dest[13] = -m[13];
            dest[14] = -m[14];
            dest[15] = -m[15];
            return dest;
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        addMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }
            dest[0] = a[0] + b[0];
            dest[1] = a[1] + b[1];
            dest[2] = a[2] + b[2];
            dest[3] = a[3] + b[3];
            dest[4] = a[4] + b[4];
            dest[5] = a[5] + b[5];
            dest[6] = a[6] + b[6];
            dest[7] = a[7] + b[7];
            dest[8] = a[8] + b[8];
            dest[9] = a[9] + b[9];
            dest[10] = a[10] + b[10];
            dest[11] = a[11] + b[11];
            dest[12] = a[12] + b[12];
            dest[13] = a[13] + b[13];
            dest[14] = a[14] + b[14];
            dest[15] = a[15] + b[15];
            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        addMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] + s;
            dest[1] = m[1] + s;
            dest[2] = m[2] + s;
            dest[3] = m[3] + s;
            dest[4] = m[4] + s;
            dest[5] = m[5] + s;
            dest[6] = m[6] + s;
            dest[7] = m[7] + s;
            dest[8] = m[8] + s;
            dest[9] = m[9] + s;
            dest[10] = m[10] + s;
            dest[11] = m[11] + s;
            dest[12] = m[12] + s;
            dest[13] = m[13] + s;
            dest[14] = m[14] + s;
            dest[15] = m[15] + s;
            return dest;
        },

        /**  */
        addScalarMat4: function (s, m, dest) {
            return BIMSURFER.math.addMat4Scalar(m, s, dest);
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        subMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }
            dest[0] = a[0] - b[0];
            dest[1] = a[1] - b[1];
            dest[2] = a[2] - b[2];
            dest[3] = a[3] - b[3];
            dest[4] = a[4] - b[4];
            dest[5] = a[5] - b[5];
            dest[6] = a[6] - b[6];
            dest[7] = a[7] - b[7];
            dest[8] = a[8] - b[8];
            dest[9] = a[9] - b[9];
            dest[10] = a[10] - b[10];
            dest[11] = a[11] - b[11];
            dest[12] = a[12] - b[12];
            dest[13] = a[13] - b[13];
            dest[14] = a[14] - b[14];
            dest[15] = a[15] - b[15];
            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        subMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] - s;
            dest[1] = m[1] - s;
            dest[2] = m[2] - s;
            dest[3] = m[3] - s;
            dest[4] = m[4] - s;
            dest[5] = m[5] - s;
            dest[6] = m[6] - s;
            dest[7] = m[7] - s;
            dest[8] = m[8] - s;
            dest[9] = m[9] - s;
            dest[10] = m[10] - s;
            dest[11] = m[11] - s;
            dest[12] = m[12] - s;
            dest[13] = m[13] - s;
            dest[14] = m[14] - s;
            dest[15] = m[15] - s;
            return dest;
        },

        /**
         * @param s scalar
         * @param m mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        subScalarMat4: function (s, m, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = s - m[0];
            dest[1] = s - m[1];
            dest[2] = s - m[2];
            dest[3] = s - m[3];
            dest[4] = s - m[4];
            dest[5] = s - m[5];
            dest[6] = s - m[6];
            dest[7] = s - m[7];
            dest[8] = s - m[8];
            dest[9] = s - m[9];
            dest[10] = s - m[10];
            dest[11] = s - m[11];
            dest[12] = s - m[12];
            dest[13] = s - m[13];
            dest[14] = s - m[14];
            dest[15] = s - m[15];
            return dest;
        },

        /**
         * @param a mat4
         * @param b mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, a otherwise
         *
         */
        mulMat4: function (a, b, dest) {
            if (!dest) {
                dest = a;
            }

            // Cache the matrix values (makes for huge speed increases!)
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

            var b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
            var b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
            var b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
            var b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

            dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

            return dest;
        },

        /**
         * @param m mat4
         * @param s scalar
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, m otherwise
         *
         */
        mulMat4Scalar: function (m, s, dest) {
            if (!dest) {
                dest = m;
            }
            dest[0] = m[0] * s;
            dest[1] = m[1] * s;
            dest[2] = m[2] * s;
            dest[3] = m[3] * s;
            dest[4] = m[4] * s;
            dest[5] = m[5] * s;
            dest[6] = m[6] * s;
            dest[7] = m[7] * s;
            dest[8] = m[8] * s;
            dest[9] = m[9] * s;
            dest[10] = m[10] * s;
            dest[11] = m[11] * s;
            dest[12] = m[12] * s;
            dest[13] = m[13] * s;
            dest[14] = m[14] * s;
            dest[15] = m[15] * s;
            return dest;
        },

        /**
         * @param m mat4
         * @param v vec4
         * @return []
         *
         */
        mulMat4v4: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2], v3 = v[3];
            return [
                    m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3,
                    m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3,
                    m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3,
                    m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3
            ];
        },

        /**
         * @param mat mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, mat otherwise
         *
         */
        transposeMat4: function (mat, dest) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            var m4 = mat[4], m14 = mat[14], m8 = mat[8];
            var m13 = mat[13], m12 = mat[12], m9 = mat[9];
            if (!dest || mat === dest) {
                var a01 = mat[1], a02 = mat[2], a03 = mat[3];
                var a12 = mat[6], a13 = mat[7];
                var a23 = mat[11];
                mat[1] = m4;
                mat[2] = m8;
                mat[3] = m12;
                mat[4] = a01;
                mat[6] = m9;
                mat[7] = m13;
                mat[8] = a02;
                mat[9] = a12;
                mat[11] = m14;
                mat[12] = a03;
                mat[13] = a13;
                mat[14] = a23;
                return mat;
            }
            dest[0] = mat[0];
            dest[1] = m4;
            dest[2] = m8;
            dest[3] = m12;
            dest[4] = mat[1];
            dest[5] = mat[5];
            dest[6] = m9;
            dest[7] = m13;
            dest[8] = mat[2];
            dest[9] = mat[6];
            dest[10] = mat[10];
            dest[11] = m14;
            dest[12] = mat[3];
            dest[13] = mat[7];
            dest[14] = mat[11];
            dest[15] = mat[15];
            return dest;
        },

        /**  */
        determinantMat4: function (mat) {
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
            var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
            var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
            return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
                a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
                a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
                a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
                a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
                a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
        },

        /**
         * @param mat mat4
         * @param dest mat4 - optional destination
         * @return {mat4} dest if specified, mat otherwise
         *
         */
        inverseMat4: function (mat, dest) {
            if (!dest) {
                dest = mat;
            }
            // Cache the matrix values (makes for huge speed increases!)
            var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
            var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
            var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
            var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
            var b00 = a00 * a11 - a01 * a10;
            var b01 = a00 * a12 - a02 * a10;
            var b02 = a00 * a13 - a03 * a10;
            var b03 = a01 * a12 - a02 * a11;
            var b04 = a01 * a13 - a03 * a11;
            var b05 = a02 * a13 - a03 * a12;
            var b06 = a20 * a31 - a21 * a30;
            var b07 = a20 * a32 - a22 * a30;
            var b08 = a20 * a33 - a23 * a30;
            var b09 = a21 * a32 - a22 * a31;
            var b10 = a21 * a33 - a23 * a31;
            var b11 = a22 * a33 - a23 * a32;

            // Calculate the determinant (inlined to avoid double-caching)
            var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

            dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
            dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
            dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
            dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
            dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
            dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
            dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
            dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
            dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
            dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
            dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
            dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
            dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

            return dest;
        },

        /**  */
        traceMat4: function (m) {
            return (m[0] + m[5] + m[10] + m[15]);
        },

        /**  */
        translationMat4v: function (v) {
            var m = BIMSURFER.math.identityMat4();
            m[12] = v[0];
            m[13] = v[1];
            m[14] = v[2];
            return m;
        },

        /**  */
        translationMat4c: function (x, y, z) {
            return BIMSURFER.math.translationMat4v([x, y, z]);
        },

        /**  */
        translationMat4s: function (s) {
            return BIMSURFER.math.translationMat4c(s, s, s);
        },

        /**  */
        rotationMat4v: function (anglerad, axis) {
            var ax = BIMSURFER.math.normalizeVec4([axis[0], axis[1], axis[2], 0.0], []);
            var s = Math.sin(anglerad);
            var c = Math.cos(anglerad);
            var q = 1.0 - c;

            var x = ax[0];
            var y = ax[1];
            var z = ax[2];

            var xy, yz, zx, xs, ys, zs;

            //xx = x * x; used once
            //yy = y * y; used once
            //zz = z * z; used once
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;

            var m = BIMSURFER.math.mat4();

            m[0] = (q * x * x) + c;
            m[1] = (q * xy) + zs;
            m[2] = (q * zx) - ys;
            m[3] = 0.0;

            m[4] = (q * xy) - zs;
            m[5] = (q * y * y) + c;
            m[6] = (q * yz) + xs;
            m[7] = 0.0;

            m[8] = (q * zx) + ys;
            m[9] = (q * yz) - xs;
            m[10] = (q * z * z) + c;
            m[11] = 0.0;

            m[12] = 0.0;
            m[13] = 0.0;
            m[14] = 0.0;
            m[15] = 1.0;

            return m;
        },

        /**  */
        rotationMat4c: function (anglerad, x, y, z) {
            return BIMSURFER.math.rotationMat4v(anglerad, [x, y, z]);
        },

        /**  */
        scalingMat4v: function (v) {
            var m = BIMSURFER.math.identityMat4();
            m[0] = v[0];
            m[5] = v[1];
            m[10] = v[2];
            return m;
        },

        /**  */
        scalingMat4c: function (x, y, z) {
            return BIMSURFER.math.scalingMat4v([x, y, z]);
        },

        /**  */
        scalingMat4s: function (s) {
            return BIMSURFER.math.scalingMat4c(s, s, s);
        },

        /**
         * @param pos vec3 position of the viewer
         * @param target vec3 point the viewer is looking at
         * @param up vec3 pointing "up"
         * @param dest mat4 Optional, mat4 frustum matrix will be written into
         *
         * @return {mat4} dest if specified, a new mat4 otherwise
         */
        lookAtMat4v: function (pos, target, up, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }

            var posx = pos[0],
                posy = pos[1],
                posz = pos[2],
                upx = up[0],
                upy = up[1],
                upz = up[2],
                targetx = target[0],
                targety = target[1],
                targetz = target[2];

            if (posx === targetx && posy === targety && posz === targetz) {
                return BIMSURFER.math.identityMat4();
            }

            var z0, z1, z2, x0, x1, x2, y0, y1, y2, len;

            //vec3.direction(eye, center, z);
            z0 = posx - targetx;
            z1 = posy - targety;
            z2 = posz - targetz;

            // normalize (no check needed for 0 because of early return)
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;

            //vec3.normalize(vec3.cross(up, z, x));
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }

            //vec3.normalize(vec3.cross(z, x, y));
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;

            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }

            dest[0] = x0;
            dest[1] = y0;
            dest[2] = z0;
            dest[3] = 0;
            dest[4] = x1;
            dest[5] = y1;
            dest[6] = z1;
            dest[7] = 0;
            dest[8] = x2;
            dest[9] = y2;
            dest[10] = z2;
            dest[11] = 0;
            dest[12] = -(x0 * posx + x1 * posy + x2 * posz);
            dest[13] = -(y0 * posx + y1 * posy + y2 * posz);
            dest[14] = -(z0 * posx + z1 * posy + z2 * posz);
            dest[15] = 1;

            return dest;
        },

        /**  */
        lookAtMat4c: function (posx, posy, posz, targetx, targety, targetz, upx, upy, upz) {
            return BIMSURFER.math.lookAtMat4v([posx, posy, posz], [targetx, targety, targetz], [upx, upy, upz], []);
        },

        /**  */
        orthoMat4c: function (left, right, bottom, top, near, far, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }
            var rl = (right - left);
            var tb = (top - bottom);
            var fn = (far - near);

            dest[0] = 2.0 / rl;
            dest[1] = 0.0;
            dest[2] = 0.0;
            dest[3] = 0.0;

            dest[4] = 0.0;
            dest[5] = 2.0 / tb;
            dest[6] = 0.0;
            dest[7] = 0.0;

            dest[8] = 0.0;
            dest[9] = 0.0;
            dest[10] = -2.0 / fn;
            dest[11] = 0.0;

            dest[12] = -(left + right) / rl;
            dest[13] = -(top + bottom) / tb;
            dest[14] = -(far + near) / fn;
            dest[15] = 1.0;

            return dest;
        },

        /**  */
        frustumMat4v: function (fmin, fmax) {
            var fmin4 = [fmin[0], fmin[1], fmin[2], 0.0];
            var fmax4 = [fmax[0], fmax[1], fmax[2], 0.0];
            var vsum = BIMSURFER.math.mat4();
            BIMSURFER.math.addVec4(fmax4, fmin4, vsum);
            var vdif = BIMSURFER.math.mat4();
            BIMSURFER.math.subVec4(fmax4, fmin4, vdif);
            var t = 2.0 * fmin4[2];

            var m = BIMSURFER.math.mat4();
            var vdif0 = vdif[0], vdif1 = vdif[1], vdif2 = vdif[2];

            m[0] = t / vdif0;
            m[1] = 0.0;
            m[2] = 0.0;
            m[3] = 0.0;

            m[4] = 0.0;
            m[5] = t / vdif1;
            m[6] = 0.0;
            m[7] = 0.0;

            m[8] = vsum[0] / vdif0;
            m[9] = vsum[1] / vdif1;
            m[10] = -vsum[2] / vdif2;
            m[11] = -1.0;

            m[12] = 0.0;
            m[13] = 0.0;
            m[14] = -t * fmax4[2] / vdif2;
            m[15] = 0.0;

            return m;
        },

        /**  */
        frustumMatrix4: function (left, right, bottom, top, near, far, dest) {
            if (!dest) {
                dest = BIMSURFER.math.mat4();
            }
            var rl = (right - left);
            var tb = (top - bottom);
            var fn = (far - near);
            dest[0] = (near * 2) / rl;
            dest[1] = 0;
            dest[2] = 0;
            dest[3] = 0;
            dest[4] = 0;
            dest[5] = (near * 2) / tb;
            dest[6] = 0;
            dest[7] = 0;
            dest[8] = (right + left) / rl;
            dest[9] = (top + bottom) / tb;
            dest[10] = -(far + near) / fn;
            dest[11] = -1;
            dest[12] = 0;
            dest[13] = 0;
            dest[14] = -(far * near * 2) / fn;
            dest[15] = 0;
            return dest;
        },


        /**  */
        perspectiveMatrix4: function (fovyrad, aspectratio, znear, zfar) {
            var pmin = [];
            var pmax = [];

            pmin[2] = znear;
            pmax[2] = zfar;

            pmax[1] = pmin[2] * Math.tan(fovyrad / 2.0);
            pmin[1] = -pmax[1];

            pmax[0] = pmax[1] * aspectratio;
            pmin[0] = -pmax[0];

            return BIMSURFER.math.frustumMat4v(pmin, pmax);
        },

        /**  */
        transformPoint3: function (m, p, q) {
            var p0 = p[0], p1 = p[1], p2 = p[2];
            q = q || [0, 0, 0, 0];
            q[0] = (m[0] * p0) + (m[4] * p1) + (m[8] * p2) + m[12];
            q[1] = (m[1] * p0) + (m[5] * p1) + (m[9] * p2) + m[13];
            q[2] = (m[2] * p0) + (m[6] * p1) + (m[10] * p2) + m[14];
            q[3] = (m[3] * p0) + (m[7] * p1) + (m[11] * p2) + m[15];
            return q;
        },


        /**  */
        transformPoints3: function (m, points) {
            var result = new Array(points.length);
            var len = points.length;
            var p0, p1, p2;
            var pi;

            // cache values
            var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
            var m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
            var m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
            var m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

            for (var i = 0; i < len; ++i) {
                // cache values
                pi = points[i];
                p0 = pi[0];
                p1 = pi[1];
                p2 = pi[2];

                result[i] = [
                        (m0 * p0) + (m4 * p1) + (m8 * p2) + m12,
                        (m1 * p0) + (m5 * p1) + (m9 * p2) + m13,
                        (m2 * p0) + (m6 * p1) + (m10 * p2) + m14,
                        (m3 * p0) + (m7 * p1) + (m11 * p2) + m15
                ];
            }

            return result;
        },

        /**  */
        transformVec3: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2];
            return [
                    (m[0] * v0) + (m[4] * v1) + (m[8] * v2),
                    (m[1] * v0) + (m[5] * v1) + (m[9] * v2),
                    (m[2] * v0) + (m[6] * v1) + (m[10] * v2)
            ];
        },

        transformVec4: function (m, v) {
            var v0 = v[0], v1 = v[1], v2 = v[2], v3 = v[3];
            return [
                    m[ 0] * v0 + m[ 4] * v1 + m[ 8] * v2 + m[12] * v3,
                    m[ 1] * v0 + m[ 5] * v1 + m[ 9] * v2 + m[13] * v3,
                    m[ 2] * v0 + m[ 6] * v1 + m[10] * v2 + m[14] * v3,
                    m[ 3] * v0 + m[ 7] * v1 + m[11] * v2 + m[15] * v3
            ];
        },

        /**  */
        projectVec4: function (v) {
            var f = 1.0 / v[3];
            return [v[0] * f, v[1] * f, v[2] * f, 1.0];
        },

        /**
         *
         */
        vec3ObjToArray: function (v, dest) {
            var result = dest || BIMSURFER.math.vec3();

            result[0] = v.x;
            result[1] = v.y;
            result[2] = v.z;

            return result;
        },

        /**
         *
         */
        vec3ArrayToObj: function (v) {
            return { x: v[0], y: v[1], z: v[2] };
        },

        /**
         *
         * @param min
         * @param max
         */
        AxisBox3: function (min, max) {

            this.verts = [
                [min[0], min[1], min[2]],
                [max[0], min[1], min[2]],
                [max[0], max[1], min[2]],
                [min[0], max[1], min[2]],

                [min[0], min[1], max[2]],
                [max[0], min[1], max[2]],
                [max[0], max[1], max[2]],
                [min[0], max[1], max[2]]
            ];


            this.toBox3 = function () {
                var box = new Human.math.Box3();
                for (var i = 0; i < 8; i++) {
                    var v = this.verts[i];
                    for (var j = 0; j < 3; j++) {
                        if (v[j] < box.min[j]) {
                            box.min[j] = v[j];
                        }
                        if (v[j] > box.max[j]) {
                            box.max[j] = v[j];
                        }
                    }
                }
            };

            this.toBoundary = function () {
                var box = new Human.math.Box3();
                for (var i = 0; i < 8; i++) {
                    var v = this.verts[i];
                    for (var j = 0; j < 3; j++) {
                        if (v[j] < box.min[j]) {
                            box.min[j] = v[j];
                        }
                        if (v[j] > box.max[j]) {
                            box.max[j] = v[j];
                        }
                    }
                }
            };
        },

        lerpVec3: function (t, t1, t2, p1, p2, dest) {
            var result = dest || this.vec3();
            var f = (t - t1) / (t2 - t1);

            result[0] = p1[0] + (f * (p2[0] - p1[0]));
            result[1] = p1[1] + (f * (p2[1] - p1[1]));
            result[2] = p1[2] + (f * (p2[2] - p1[2]));

            return result;
        },

        getBoundaryDiag: function (boundary) {

            var min = this.vec3();
            var max = this.vec3();

            min[0] = boundary.xmin;
            min[1] = boundary.ymin;
            min[2] = boundary.zmin;

            max[0] = boundary.xmax;
            max[1] = boundary.ymax;
            max[2] = boundary.zmax;

            var tempVec = this.vec3();
            this.subVec3(max, min, tempVec);

            return Math.abs(this.lenVec3(tempVec));
        },

        getBoundaryCenter: function (boundary, dest) {
            var r = dest || this.vec3();

            r[0] = (boundary.xmax + boundary.xmin ) * 0.5;
            r[1] = (boundary.ymax + boundary.ymin ) * 0.5;
            r[2] = (boundary.zmax + boundary.zmin ) * 0.5;

            return r;
        }
    };

})();;/**
 * Viewer configuration management.
 *
 * @module BIMSURFER
 * @submodule configs
 */;/**


 ## Overview

 TODO

 ## Example

 TODO

 ```` javascript

 ````

 @class Configs
 @module BIMSURFER
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, creates this Configs within the
 default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted
 @param [cfg] {*} Configs configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Configs.
 @extends Component
 */
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
    
;/**
 * BIMSurfer constants.
 * @module BIMSURFER
 * @submodule configs
 * @class constants
 * @static
 */
if (typeof BIMSURFER.constants != 'object') {
    BIMSURFER.constants = {};
}

/**
 * Time in milliseconds before a connect or login action will timeout
 */
BIMSURFER.constants.timeoutTime = 10000; // ms

/**
 * Default IFC types.
 * @property defaultTypes
 * @namespace BIMSURFER
 * @type {{Array of String}}
 */
BIMSURFER.constants.defaultTypes = [
    "IfcColumn",
    "IfcStair",
    "IfcSlab",
    "IfcWindow",
//	"IfcOpeningElement",
    "IfcDoor",
    "IfcBuildingElementProxy",
    "IfcWallStandardCase",
    "IfcWall",
    "IfcBeam",
    "IfcRailing",
    "IfcProxy",
    "IfcRoof"
];

//writeMaterial(jsonWriter, "IfcSpace", new double[] { 0.137255f, 0.403922f, 0.870588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcRoof", new double[] { 0.837255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSlab", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWall", new double[] { 0.537255f, 0.337255f, 0.237255f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWallStandardCase", new double[] { 1.0f, 1.0f, 1.0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDoor", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcWindow", new double[] { 0.2f, 0.2f, 0.8f }, 0.2f);
//writeMaterial(jsonWriter, "IfcRailing", new double[] { 0.137255f, 0.203922f, 0.270588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcColumn", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcBeam", new double[] { 0.437255f, 0.603922f, 0.370588f, }, 1.0f);
//writeMaterial(jsonWriter, "IfcFurnishingElement", new double[] { 0.437255f, 0.603922f, 0.370588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcCurtainWall", new double[] { 0.5f, 0.5f, 0.5f }, 0.5f);
//writeMaterial(jsonWriter, "IfcStair", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcBuildingElementProxy", new double[] { 0.5f, 0.5f, 0.5f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowSegment", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowFitting", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcFlowTerminal", new double[] { 0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcProxy", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcSite", new double[] { 0.637255f, 0.603922f, 0.670588f }, 1.0f);
//writeMaterial(jsonWriter, "IfcLightFixture", new double[] {0.8470588235f, 0.8470588235f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctSegment", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcDuctFitting", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);
//writeMaterial(jsonWriter, "IfcAirTerminal", new double[] {0.8470588235f, 0.427450980392f, 0f }, 1.0f);

BIMSURFER.constants.materials = {
    IfcSpace: [0.137255, 0.403922, 0.870588, 1.0],
    IfcRoof: [ 0.837255, 0.203922, 0.270588, 1.0],
    IfcSlab: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWall: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcWallStandardCase: [ 0.537255, 0.337255, 0.237255, 1.0],
    IfcDoor: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcWindow: [ 0.137255, 0.403922, 0.870588, 0.5],
    IfcOpeningElement: [ 0.137255, 0.403922, 0.870588, 0],
    IfcRailing: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcColumn: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcBeam: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFurnishingElement: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcCurtainWall: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcStair: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcStairFlight: [ 0.637255, 0.603922, 0.670588, 1.0],
    IfcBuildingElementProxy: [ 0.5, 0.5, 0.5, 1.0],
    IfcFlowSegment: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowitting: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcFlowTerminal: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcProxy: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcSite: [ 0.137255, 0.403922, 0.870588, 1.0],
    IfcLightFixture: [ 0.8470588235, 0.8470588235, 0.870588, 1.0],
    IfcDuctSegment: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDistributionFlowElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcDuctFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcPlate: [ 0.8470588235, 0.427450980392, 0, 0.5],
    IfcAirTerminal: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcMember: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcCovering: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcTransportElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowController: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFlowFitting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcRamp: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFurniture: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcFooting: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSystemFurnitureElement: [ 0.8470588235, 0.427450980392, 0, 1.0],
    IfcSpace: [ 0.137255, 0.303922, 0.570588, 0.5],
    DEFAULT: [ 0.8470588235, 0.427450980392, 0, 1.0]
};

/*
 * Default camera settings
 */
BIMSURFER.constants.camera = {
    maxOrbitSpeed: Math.PI * 0.1,
    orbitSpeedFactor: 0.05,
    zoomSpeedFactor: 0.1,
    panSpeedFactor: 0.6
};

/*
 * Default markup for highlighted objects
 */
BIMSURFER.constants.highlightSelectedObject = {
    type: 'material',
    wire: true,
    id: 'highlight',
    emit: 0.0,
    baseColor: {r: 0.0, g: 1, b: 0}
};

/*
 * Default markup for highlighted special objects
 */
BIMSURFER.constants.highlightSelectedSpecialObject = {
    type: 'material',
    id: 'specialselectedhighlight',
    emit: 1,
    baseColor: {r: 0.16, g: 0.70, b: 0.88},
    shine: 10.0
};

/*
 * Enumeration for progressbar types
 */
BIMSURFER.constants.ProgressBarStyle = {
    Continuous: 1,
    Marquee: 2
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} s The number to clamp
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
BIMSURFER.constants.clamp = function (s, min, max) {
    return Math.min(Math.max(s, min), max);
};;/**

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
 {{#crossLink "GameObject"}}{{/crossLink}} components, while letting BIMSURFER generate its own ID for
 the {{#crossLink "Geometry"}}{{/crossLink}}:

 ````javascript

 ````

 ## <a name="componentProps">Properties</a>

 Almost every property in a Viewer Component fires a change event when you update it. For example, we can subscribe
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

        /**
         * When true, indicates that only one instance of this component type may be active within
         * its {{#crossLink "Viewer"}}{{/crossLink}} at a time. When a component is activated, that has
         * a true value for this flag, then any other active component of the same type will be
         * deactivated first.
         */
        exclusive: false,


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
         * @param {String} handle Subscription handle
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

            // Remove from parent
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
;/**
 * Components for handling user interaction.
 *
 * @module BIMSURFER
 * @submodule input
 */;/**
 Publishes key and mouse events that occur on the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.

 ## Overview

 <ul>
 <li>Each {{#crossLink "Viewer"}}{{/crossLink}} provides an Input on itself as a read-only property.</li>
 </ul>

 ## Example

 In this example, we're subscribing to some mouse and key events that will occur on
 a {{#crossLink "Viewer"}}Viewer's{{/crossLink}} {{#crossLink "Canvas"}}Canvas{{/crossLink}}.

 ````javascript
var viewer = new BIMSURFER.Viewer(...);

 var input = viewer.input;

 // We'll save a handle to this subscription
 // to show how to unsubscribe, further down
 var handle = input.on("mousedown", function(coords) {
       console.log("Mouse down at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("mouseup", function(coords) {
       console.log("Mouse up at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("mouseclicked", function(coords) {
      console.log("Mouse clicked at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("dblclick", function(coords) {
       console.log("Double-click at: x=" + coords[0] + ", y=" + coords[1]);
 });

 input.on("keydown", function(keyCode) {
        switch (keyCode) {

            case this.KEY_A:
               console.log("The 'A' key is down");
               break;

            case this.KEY_B:
               console.log("The 'B' key is down");
               break;

            case this.KEY_C:
               console.log("The 'C' key is down");
               break;

            default:
               console.log("Some other key is down");
       }
     });

 input.on("keyup", function(keyCode) {
        switch (keyCode) {

            case this.KEY_A:
               console.log("The 'A' key is up");
               break;

            case this.KEY_B:
               console.log("The 'B' key is up");
               break;

            case this.KEY_C:
               console.log("The 'C' key is up");
               break;

            default:
               console.log("Some other key is up");
        }
     });

 // TODO: ALT and CTRL keys etc
 ````

 ### Unsubscribing from Events

 In the snippet above, we saved a handle to one of our event subscriptions.

 We can then use that handle to unsubscribe again, like this:

 ````javascript
 input.off(handle);
 ````

 @class Input
 @module BIMSURFER
 @submodule input
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Input = BIMSURFER.Component.extend({

        className: "BIMSURFER.Input",

        _init: function (cfg) {

            var self = this;

            // True when ALT down
            this.altDown = false;

            /** True whenever CTRL is down
             *
             * @type {boolean}
             */
            this.ctrlDown = false;

            /** True whenever left mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownLeft = false;

            /** True whenever middle mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownMiddle = false;

            /** True whenever right mouse button is down
             *
             * @type {boolean}
             */
            this.mouseDownRight = false;

            /** Flag for each key that's down
             *
             * @type {boolean}
             */
            this.keyDown = [];

            /** True while input enabled
             *
             * @type {boolean}
             */
            this.enabled = true;

            var canvas = this.viewer._canvas;


            // Disable context menu events so we can use right-click for things like panning

            document.addEventListener("contextmenu", function(e){
                e.preventDefault();
            }, false);


            // Capture input events and publish them on this component

            document.addEventListener("keydown",
                this._keyDownListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                        if (e.ctrlKey) {
                            self.ctrlDown = true;
                        } else if (e.altKey) {
                            self.altDown = true;
                        } else {
                            self.keyDown[e.keyCode] = true;

                            /**
                             * Fired whenever a key is pressed while the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}} has input focus.
                             * @event keydown
                             * @param value {Number} The key code, for example {{#crossLink "Input/KEY_LEFT_ARROW:property"}}{{/crossLink}},
                             */
                            self.fire("keydown", e.keyCode, true);
                        }
                    }
                }, true);


            document.addEventListener("keyup",
                this._keyUpListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                        if (e.ctrlKey) {
                            self.ctrlDown = false;
                        } else if (e.altKey) {
                            self.altDown = false;
                        } else {
                            self.keyDown[e.keyCode] = false;

                            /**
                             * Fired whenever a key is released while the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}} has input focus.
                             * @event keyup
                             * @param value {Number} The key code, for example {{#crossLink "Input/KEY_LEFT_ARROW:property"}}{{/crossLink}},
                             */
                            self.fire("keyup", e.keyCode, true);
                        }
                    }
                });

            canvas.addEventListener("mousedown",
                this._mouseDownListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = true;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = true;
                            break;
                        case 3:// Right button
                            self.mouseDownRight = true;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is pressed over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousedown
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mousedown", coords, true);
                });

            canvas.addEventListener("mouseup",
                this._mouseUpListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = false;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = false;
                            break;
                        case 3:// Right button
                            self.mouseDownRight = false;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is released over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mouseup
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mouseup", coords, true);
                });

            canvas.addEventListener("dblclick",
                this._dblClickListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    switch (e.which) {
                        case 1:// Left button
                            self.mouseDownLeft = false;
                            self.mouseDownRight = false;
                            break;
                        case 2:// Middle/both buttons
                            self.mouseDownMiddle = false;
                            break;
                        case 3:// Right button
                            self.mouseDownLeft = false;
                            self.mouseDownRight = false;
                            break;
                        default:
                            break;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is double-clicked over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event dblclick
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("dblclick", coords, true);
                });

            canvas.addEventListener("mousemove",
                this._mouseMoveListener = function (e) {
                    if (!self.enabled) {
                        return;
                    }
                    var coords = self._getClickCoordsWithinElement(e);

                    /**
                     * Fired whenever the mouse is moved over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousedown
                     * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                     */
                    self.fire("mousemove", coords, true);
                });

            canvas.addEventListener("mousewheel",
                this._mouseWheelListener = function (e, d) {
                    if (!self.enabled) {
                        return;
                    }

                    var e = window.event || e; // old IE support
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                    /**
                     * Fired whenever the mouse wheel is moved over the parent
                     * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                     * @event mousewheel
                     * @param delta {Number} The mouse wheel delta,
                     */
                    self.fire("mousewheel", delta, true);
                });

            // mouseclicked

            (function () {
                var downX;
                var downY;
                self.on("mousedown",
                    function (params) {
                        downX = params.x;
                        downY = params.y;
                    });

                self.on("mouseup",
                    function (params) {
                        if (downX === params.x && downY === params.y) {

                            /**
                             * Fired whenever the mouse is clicked over the parent
                             * {{#crossLink "Viewer"}}Viewer{{/crossLink}}'s {{#crossLink "Canvas"}}Canvas{{/crossLink}}.
                             * @event mouseclicked
                             * @param value {[Number, Number]} The mouse coordinates within the {{#crossLink "Canvas"}}Canvas{{/crossLink}},
                             */
                            self.fire("mouseclicked", params, true);
                        }
                    });
            })();
        },

        _getClickCoordsWithinElement: function (event) {
            var coords = [0,0];
            if (!event) {
                event = window.event;
                coords.x = event.x;
                coords.y = event.y;
            }
            else {
                var element = event.target;
                var totalOffsetLeft = 0;
                var totalOffsetTop = 0;

                while (element.offsetParent) {
                    totalOffsetLeft += element.offsetLeft;
                    totalOffsetTop += element.offsetTop;
                    element = element.offsetParent;
                }
                coords[0] = event.pageX - totalOffsetLeft;
                coords[1] = event.pageY - totalOffsetTop;
            }
            return coords;
        },

        /**
         * Enable or disable all input handlers
         *
         * @param enable
         */
        setEnabled: function (enable) {
            if (this.enabled !== enable) {
                this.fire("enabled", this.enabled = enable);
            }
        },

        // Key codes

        /**
         * Code for the BACKSPACE key.
         * @property KEY_BACKSPACE
         * @final
         * @type Number
         */
        KEY_BACKSPACE: 8,

        /**
         * Code for the TAB key.
         * @property KEY_TAB
         * @final
         * @type Number
         */
        KEY_TAB: 9,

        /**
         * Code for the ENTER key.
         * @property KEY_ENTER
         * @final
         * @type Number
         */
        KEY_ENTER: 13,

        /**
         * Code for the SHIFT key.
         * @property KEY_SHIFT
         * @final
         * @type Number
         */
        KEY_SHIFT: 16,

        /**
         * Code for the CTRL key.
         * @property KEY_CTRL
         * @final
         * @type Number
         */
        KEY_CTRL: 17,

        /**
         * Code for the ALT key.
         * @property KEY_ALT
         * @final
         * @type Number
         */
        KEY_ALT: 18,

        /**
         * Code for the PAUSE_BREAK key.
         * @property KEY_PAUSE_BREAK
         * @final
         * @type Number
         */
        KEY_PAUSE_BREAK: 19,

        /**
         * Code for the CAPS_LOCK key.
         * @property KEY_CAPS_LOCK
         * @final
         * @type Number
         */
        KEY_CAPS_LOCK: 20,

        /**
         * Code for the ESCAPE key.
         * @property KEY_ESCAPE
         * @final
         * @type Number
         */
        KEY_ESCAPE: 27,

        /**
         * Code for the PAGE_UP key.
         * @property KEY_PAGE_UP
         * @final
         * @type Number
         */
        KEY_PAGE_UP: 33,

        /**
         * Code for the PAGE_DOWN key.
         * @property KEY_PAGE_DOWN
         * @final
         * @type Number
         */
        KEY_PAGE_DOWN: 34,

        /**
         * Code for the END key.
         * @property KEY_END
         * @final
         * @type Number
         */
        KEY_END: 35,

        /**
         * Code for the HOME key.
         * @property KEY_HOME
         * @final
         * @type Number
         */
        KEY_HOME: 36,

        /**
         * Code for the LEFT_ARROW key.
         * @property KEY_LEFT_ARROW
         * @final
         * @type Number
         */
        KEY_LEFT_ARROW: 37,

        /**
         * Code for the UP_ARROW key.
         * @property KEY_UP_ARROW
         * @final
         * @type Number
         */
        KEY_UP_ARROW: 38,

        /**
         * Code for the RIGHT_ARROW key.
         * @property KEY_RIGHT_ARROW
         * @final
         * @type Number
         */
        KEY_RIGHT_ARROW: 39,

        /**
         * Code for the DOWN_ARROW key.
         * @property KEY_DOWN_ARROW
         * @final
         * @type Number
         */
        KEY_DOWN_ARROW: 40,

        /**
         * Code for the INSERT key.
         * @property KEY_INSERT
         * @final
         * @type Number
         */
        KEY_INSERT: 45,

        /**
         * Code for the DELETE key.
         * @property KEY_DELETE
         * @final
         * @type Number
         */
        KEY_DELETE: 46,

        /**
         * Code for the 0 key.
         * @property KEY_NUM_0
         * @final
         * @type Number
         */
        KEY_NUM_0: 48,

        /**
         * Code for the 1 key.
         * @property KEY_NUM_1
         * @final
         * @type Number
         */
        KEY_NUM_1: 49,

        /**
         * Code for the 2 key.
         * @property KEY_NUM_2
         * @final
         * @type Number
         */
        KEY_NUM_2: 50,

        /**
         * Code for the 3 key.
         * @property KEY_NUM_3
         * @final
         * @type Number
         */
        KEY_NUM_3: 51,

        /**
         * Code for the 4 key.
         * @property KEY_NUM_4
         * @final
         * @type Number
         */
        KEY_NUM_4: 52,

        /**
         * Code for the 5 key.
         * @property KEY_NUM_5
         * @final
         * @type Number
         */
        KEY_NUM_5: 53,

        /**
         * Code for the 6 key.
         * @property KEY_NUM_6
         * @final
         * @type Number
         */
        KEY_NUM_6: 54,

        /**
         * Code for the 7 key.
         * @property KEY_NUM_7
         * @final
         * @type Number
         */
        KEY_NUM_7: 55,

        /**
         * Code for the 8 key.
         * @property KEY_NUM_8
         * @final
         * @type Number
         */
        KEY_NUM_8: 56,

        /**
         * Code for the 9 key.
         * @property KEY_NUM_9
         * @final
         * @type Number
         */
        KEY_NUM_9: 57,

        /**
         * Code for the A key.
         * @property KEY_A
         * @final
         * @type Number
         */
        KEY_A: 65,

        /**
         * Code for the B key.
         * @property KEY_B
         * @final
         * @type Number
         */
        KEY_B: 66,

        /**
         * Code for the C key.
         * @property KEY_C
         * @final
         * @type Number
         */
        KEY_C: 67,

        /**
         * Code for the D key.
         * @property KEY_D
         * @final
         * @type Number
         */
        KEY_D: 68,

        /**
         * Code for the E key.
         * @property KEY_E
         * @final
         * @type Number
         */
        KEY_E: 69,

        /**
         * Code for the F key.
         * @property KEY_F
         * @final
         * @type Number
         */
        KEY_F: 70,

        /**
         * Code for the G key.
         * @property KEY_G
         * @final
         * @type Number
         */
        KEY_G: 71,

        /**
         * Code for the H key.
         * @property KEY_H
         * @final
         * @type Number
         */
        KEY_H: 72,

        /**
         * Code for the I key.
         * @property KEY_I
         * @final
         * @type Number
         */
        KEY_I: 73,

        /**
         * Code for the J key.
         * @property KEY_J
         * @final
         * @type Number
         */
        KEY_J: 74,

        /**
         * Code for the K key.
         * @property KEY_K
         * @final
         * @type Number
         */
        KEY_K: 75,

        /**
         * Code for the L key.
         * @property KEY_L
         * @final
         * @type Number
         */
        KEY_L: 76,

        /**
         * Code for the M key.
         * @property KEY_M
         * @final
         * @type Number
         */
        KEY_M: 77,

        /**
         * Code for the N key.
         * @property KEY_N
         * @final
         * @type Number
         */
        KEY_N: 78,

        /**
         * Code for the O key.
         * @property KEY_O
         * @final
         * @type Number
         */
        KEY_O: 79,

        /**
         * Code for the P key.
         * @property KEY_P
         * @final
         * @type Number
         */
        KEY_P: 80,

        /**
         * Code for the Q key.
         * @property KEY_Q
         * @final
         * @type Number
         */
        KEY_Q: 81,

        /**
         * Code for the R key.
         * @property KEY_R
         * @final
         * @type Number
         */
        KEY_R: 82,

        /**
         * Code for the S key.
         * @property KEY_S
         * @final
         * @type Number
         */
        KEY_S: 83,

        /**
         * Code for the T key.
         * @property KEY_T
         * @final
         * @type Number
         */
        KEY_T: 84,

        /**
         * Code for the U key.
         * @property KEY_U
         * @final
         * @type Number
         */
        KEY_U: 85,

        /**
         * Code for the V key.
         * @property KEY_V
         * @final
         * @type Number
         */
        KEY_V: 86,

        /**
         * Code for the W key.
         * @property KEY_W
         * @final
         * @type Number
         */
        KEY_W: 87,

        /**
         * Code for the X key.
         * @property KEY_X
         * @final
         * @type Number
         */
        KEY_X: 88,

        /**
         * Code for the Y key.
         * @property KEY_Y
         * @final
         * @type Number
         */
        KEY_Y: 89,

        /**
         * Code for the Z key.
         * @property KEY_Z
         * @final
         * @type Number
         */
        KEY_Z: 90,

        /**
         * Code for the LEFT_WINDOW key.
         * @property KEY_LEFT_WINDOW
         * @final
         * @type Number
         */
        KEY_LEFT_WINDOW: 91,

        /**
         * Code for the RIGHT_WINDOW key.
         * @property KEY_RIGHT_WINDOW
         * @final
         * @type Number
         */
        KEY_RIGHT_WINDOW: 92,

        /**
         * Code for the SELECT key.
         * @property KEY_SELECT
         * @final
         * @type Number
         */
        KEY_SELECT_KEY: 93,

        /**
         * Code for the number pad 0 key.
         * @property KEY_NUMPAD_0
         * @final
         * @type Number
         */
        KEY_NUMPAD_0: 96,

        /**
         * Code for the number pad 1 key.
         * @property KEY_NUMPAD_1
         * @final
         * @type Number
         */
        KEY_NUMPAD_1: 97,

        /**
         * Code for the number pad 2 key.
         * @property KEY_NUMPAD 2
         * @final
         * @type Number
         */
        KEY_NUMPAD_2: 98,

        /**
         * Code for the number pad 3 key.
         * @property KEY_NUMPAD_3
         * @final
         * @type Number
         */
        KEY_NUMPAD_3: 99,

        /**
         * Code for the number pad 4 key.
         * @property KEY_NUMPAD_4
         * @final
         * @type Number
         */
        KEY_NUMPAD_4: 100,

        /**
         * Code for the number pad 5 key.
         * @property KEY_NUMPAD_5
         * @final
         * @type Number
         */
        KEY_NUMPAD_5: 101,

        /**
         * Code for the number pad 6 key.
         * @property KEY_NUMPAD_6
         * @final
         * @type Number
         */
        KEY_NUMPAD_6: 102,

        /**
         * Code for the number pad 7 key.
         * @property KEY_NUMPAD_7
         * @final
         * @type Number
         */
        KEY_NUMPAD_7: 103,

        /**
         * Code for the number pad 8 key.
         * @property KEY_NUMPAD_8
         * @final
         * @type Number
         */
        KEY_NUMPAD_8: 104,

        /**
         * Code for the number pad 9 key.
         * @property KEY_NUMPAD_9
         * @final
         * @type Number
         */
        KEY_NUMPAD_9: 105,

        /**
         * Code for the MULTIPLY key.
         * @property KEY_MULTIPLY
         * @final
         * @type Number
         */
        KEY_MULTIPLY: 106,

        /**
         * Code for the ADD key.
         * @property KEY_ADD
         * @final
         * @type Number
         */
        KEY_ADD: 107,

        /**
         * Code for the SUBTRACT key.
         * @property KEY_SUBTRACT
         * @final
         * @type Number
         */
        KEY_SUBTRACT: 109,

        /**
         * Code for the DECIMAL POINT key.
         * @property KEY_DECIMAL_POINT
         * @final
         * @type Number
         */
        KEY_DECIMAL_POINT: 110,

        /**
         * Code for the DIVIDE key.
         * @property KEY_DIVIDE
         * @final
         * @type Number
         */
        KEY_DIVIDE: 111,

        /**
         * Code for the F1 key.
         * @property KEY_F1
         * @final
         * @type Number
         */
        KEY_F1: 112,

        /**
         * Code for the F2 key.
         * @property KEY_F2
         * @final
         * @type Number
         */
        KEY_F2: 113,

        /**
         * Code for the F3 key.
         * @property KEY_F3
         * @final
         * @type Number
         */
        KEY_F3: 114,

        /**
         * Code for the F4 key.
         * @property KEY_F4
         * @final
         * @type Number
         */
        KEY_F4: 115,

        /**
         * Code for the F5 key.
         * @property KEY_F5
         * @final
         * @type Number
         */
        KEY_F5: 116,

        /**
         * Code for the F6 key.
         * @property KEY_F6
         * @final
         * @type Number
         */
        KEY_F6: 117,

        /**
         * Code for the F7 key.
         * @property KEY_F7
         * @final
         * @type Number
         */
        KEY_F7: 118,

        /**
         * Code for the F8 key.
         * @property KEY_F8
         * @final
         * @type Number
         */
        KEY_F8: 119,

        /**
         * Code for the F9 key.
         * @property KEY_F9
         * @final
         * @type Number
         */
        KEY_F9: 120,

        /**
         * Code for the F10 key.
         * @property KEY_F10
         * @final
         * @type Number
         */
        KEY_F10: 121,

        /**
         * Code for the F11 key.
         * @property KEY_F11
         * @final
         * @type Number
         */
        KEY_F11: 122,

        /**
         * Code for the F12 key.
         * @property KEY_F12
         * @final
         * @type Number
         */
        KEY_F12: 123,

        /**
         * Code for the NUM_LOCK key.
         * @property KEY_NUM_LOCK
         * @final
         * @type Number
         */
        KEY_NUM_LOCK: 144,

        /**
         * Code for the SCROLL_LOCK key.
         * @property KEY_SCROLL_LOCK
         * @final
         * @type Number
         */
        KEY_SCROLL_LOCK: 145,

        /**
         * Code for the SEMI_COLON key.
         * @property KEY_SEMI_COLON
         * @final
         * @type Number
         */
        KEY_SEMI_COLON: 186,

        /**
         * Code for the EQUAL_SIGN key.
         * @property KEY_EQUAL_SIGN
         * @final
         * @type Number
         */
        KEY_EQUAL_SIGN: 187,

        /**
         * Code for the COMMA key.
         * @property KEY_COMMA
         * @final
         * @type Number
         */
        KEY_COMMA: 188,

        /**
         * Code for the DASH key.
         * @property KEY_DASH
         * @final
         * @type Number
         */
        KEY_DASH: 189,

        /**
         * Code for the PERIOD key.
         * @property KEY_PERIOD
         * @final
         * @type Number
         */
        KEY_PERIOD: 190,

        /**
         * Code for the FORWARD_SLASH key.
         * @property KEY_FORWARD_SLASH
         * @final
         * @type Number
         */
        KEY_FORWARD_SLASH: 191,

        /**
         * Code for the GRAVE_ACCENT key.
         * @property KEY_GRAVE_ACCENT
         * @final
         * @type Number
         */
        KEY_GRAVE_ACCENT: 192,

        /**
         * Code for the OPEN_BRACKET key.
         * @property KEY_OPEN_BRACKET
         * @final
         * @type Number
         */
        KEY_OPEN_BRACKET: 219,

        /**
         * Code for the BACK_SLASH key.
         * @property KEY_BACK_SLASH
         * @final
         * @type Number
         */
        KEY_BACK_SLASH: 220,

        /**
         * Code for the CLOSE_BRACKET key.
         * @property KEY_CLOSE_BRACKET
         * @final
         * @type Number
         */
        KEY_CLOSE_BRACKET: 221,

        /**
         * Code for the SINGLE_QUOTE key.
         * @property KEY_SINGLE_QUOTE
         * @final
         * @type Number
         */
        KEY_SINGLE_QUOTE: 222,

        /**
         * Code for the SPACE key.
         * @property KEY_SPACE
         * @final
         * @type Number
         */
        KEY_SPACE: 32,


        _destroy: function () {
            document.removeEventListener("keydown", this._keyDownListener);
            document.removeEventListener("keyup", this._keyUpListener);
        }
    });

})();

;/**
 A **CameraControl** allows you to pan, rotate and zoom a {{#crossLink "Camera"}}{{/crossLink}} using the mouse and keyboard,
 as well as switch it between preset left, right, anterior, posterior, superior and inferior views.

 ## Overview

 <ul>
 <li>You can have multiple CameraControls within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple CameraControls can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the CameraControl we're driving is the one whose {{#crossLink "Camera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a CameraControl to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 #### Controlling a Camera

 In this example we're viewing a {{#crossLink "RandomObjects"}}{{/crossLink}} with a {{#crossLink "Camera"}}{{/crossLink}} that's controlled by a CameraControl.

 <iframe style="width: 800px; height: 600px" src="../../examples/control_CameraControl.html"></iframe>

 ````Javascript
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 var camera = new BIMSURFER.Camera(viewer, {
        eye: [5, 5, -5]
    });

 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a RandomObjects
 var randomObjects = new BIMSURFER.RandomObjects(viewer, {
        numObjects: 55
    });
 ````

 @class CameraControl
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this CameraControl.
 @param [camera] {Camera} The Camera to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraControl = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraControl",

        /**
          Indicates that only one instance of a CameraControl may be active within
          its {{#crossLink "Viewer"}}{{/crossLink}} at a time. When a CameraControl is activated, that has
          a true value for this flag, then any other active CameraControl will be deactivated first.

         @property exclusive
         @type Boolean
         @final
         */
        exclusive: true,
        
        _init: function (cfg) {

            var self = this;

            var viewer = this.viewer;            

            this._keyboardAxis = new BIMSURFER.KeyboardAxisCamera(viewer, {
                camera: cfg.camera
            });

            this._keyboardOrbit = new BIMSURFER.KeyboardOrbitCamera(viewer, {
                camera: cfg.camera
            });
            
            this._mouseOrbit = new BIMSURFER.MouseOrbitCamera(viewer, {
                camera: cfg.camera
            });

            this._keyboardPan = new BIMSURFER.KeyboardPanCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mousePan = new BIMSURFER.MousePanCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._keyboardZoom = new BIMSURFER.KeyboardZoomCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mouseZoom = new BIMSURFER.MouseZoomCamera(viewer, {
                sensitivity: 1,
                camera: cfg.camera
            });

            this._mousePickObject = new BIMSURFER.MousePickObject(viewer, {
                rayPick: true,
                camera: cfg.camera
            });

            this._cameraFly = new BIMSURFER.CameraFlyAnimation(viewer, {
                camera: cfg.camera
            });

            this._mousePickObject.on("pick",
                function (e) {

                    var diff = BIMSURFER.math.subVec3(self._cameraFly.camera.eye, self._cameraFly.camera.look, []);

                    self._cameraFly.flyTo({
                        look: e.worldPos,
                        eye: [e.worldPos[0] + diff[0], e.worldPos[1] + diff[1], e.worldPos[2] + diff[2]]
                    });
                });

            // Handle when nothing is picked
            this._mousePickObject.on("nopick", function (e) {
                // alert("Mothing picked");
            });

            this.camera = cfg.camera;
            
            this.firstPerson = cfg.firstPerson;

            this.active = cfg.active !== false;
        },

        _props: {

            firstPerson: {

                set: function (value) {

                    this._firstPerson = value;

                    this._keyboardOrbit.firstPerson = value;
                    this._mouseOrbit.firstPerson = value;
                },

                get: function () {
                    return this._firstPerson;
                }
            },

            /**
             * The {{#crossLink "Camera"}}{{/crossLink}} being controlled.
             *
             * Must be within the same {{#crossLink "Viewer"}}{{/crossLink}} as this Object. Defaults to the parent
             * {{#crossLink "Viewer"}}Viewer's{{/crossLink}} default {{#crossLink "Viewer/camera:property"}}camera{{/crossLink}} when set to
             * a null or undefined value.
             *
             * @property camera
             * @type Camera
             */
            camera: {

                set: function (value) {

                    var camera = value;

                    if (camera) {

                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }

                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }

                    } else {

                        // Default to Viewer's default Camera
                        camera = this.viewer.camera;
                    }

                    //   this._cameraFly.camera = camera;

                    this._camera = camera;

                    this._keyboardAxis.camera = camera;

                    this._keyboardOrbit.camera = camera;
                    this._mouseOrbit.camera = camera;

                    this._keyboardPan.camera = camera;
                    this._mousePan.camera = camera;

                    this._keyboardZoom.camera = camera;
                    this._mouseZoom.camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            },

            /**
             * Flag which indicates whether this CameraControl is active or not.
             *
             * Fires an {{#crossLink "CameraControl/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    this._keyboardOrbit.active = value;
                    this._mouseOrbit.active = value;
                    this._keyboardPan.active = value;
                    this._mousePan.active = value;
                    this._mousePickObject.active = value;
                    this._cameraFly.active = value;

                    /**
                     * Fired whenever this CameraControl's {{#crossLink "CameraControl/active:property"}}{{/crossLink}} property changes.
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

            this._keyboardAxis.destroy();
            this._keyboardOrbit.destroy();
            this._mouseOrbit.destroy();
            this._keyboardPan.destroy();
            this._mousePan.destroy();
            this._keyboardZoom.destroy();
            this._mouseZoom.destroy();
            this._mousePickObject.destroy();
            this._cameraFly.destroy();

            this.active = false;
        }
    });

})();
;/**
 A **MouseOrbitCamera** lets you orbit a {{#crossLink "Camera"}}{{/crossLink}} about its point-of-interest using the mouse.

 ## Overview

 <ul>
 <li>Orbiting involves rotating the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}}
 position about its current {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>The orbit is freely rotating, without gimbal-lock.</li>
 <li>If desired, you can have multiple MouseOrbitCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MouseOrbitCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the MouseOrbitCameras we're driving is the one whose {{#crossLink "MouseOrbitCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MouseOrbitCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MouseOrbitCamera.html"></iframe>

 @class MouseOrbitCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MouseOrbitCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MouseOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MouseOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MouseOrbitCamera is active or not.
             *
             * Fires an {{#crossLink "MouseOrbitCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var sensitivity = 0.20;
                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                if (xDelta != 0) {
                                    self._camera.rotateEyeY(-xDelta);
                                    xDelta = 0;
                                }

                                if (yDelta != 0) {
                                    self._camera.rotateEyeX(yDelta);
                                    yDelta = 0;
                                }
                            });

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                if (input.mouseDownLeft
                                    && !input.mouseDownRight
                                    && !input.keyDown[input.KEY_SHIFT]
                                    && !input.mouseDownMiddle) {

                                    down = true;
                                    lastX = e[0];
                                    lastY = e[1];

                                } else {
                                    down = false;
                                }

                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {
                                down = false;
                            });

                        this._onMouseMove = input.on("mousemove",
                            function (e) {
                                if (down) {
                                    xDelta += (e[0] - lastX) * sensitivity;
                                    yDelta += (e[1] - lastY) * sensitivity;
                                    lastX = e[0];
                                    lastY = e[1];
                                }
                            });

                    } else {

                        input.off(this._onTick);

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                        input.off(this._onMouseMove);
                    }

                    /**
                     * Fired whenever this MouseOrbitCamera's {{#crossLink "MouseOrbitCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                    this._cameraDirty = true;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **KeyboardOrbitCamera** lets you orbit a {{#crossLink "Camera"}}{{/crossLink}} about its point-of-interest using the keyboard's arrow keys.

 ## Overview

 <ul>
 <li>Orbiting involves rotating the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}}
 position about its current {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>The orbit is freely rotating, without gimbal-lock.</li>
 <li>If desired, you can have multiple KeyboardOrbitCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple KeyboardOrbitCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the KeyboardOrbitCameras we're driving is the one whose {{#crossLink "KeyboardOrbitCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a KeyboardOrbitCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_KeyboardOrbitCamera.html"></iframe>

 @class KeyboardOrbitCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardAxisCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardOrbitCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardOrbitCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this KeyboardOrbitCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardOrbitCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                var yawRate = 50;
                                var pitchRate = 50;

                                if (!input.ctrlDown && !input.altDown) {

                                    var left = input.keyDown[input.KEY_LEFT_ARROW];
                                    var right = input.keyDown[input.KEY_RIGHT_ARROW];
                                    var up = input.keyDown[input.KEY_UP_ARROW];
                                    var down = input.keyDown[input.KEY_DOWN_ARROW];

                                    if (left || right || up || down) {

                                        var yaw = 0;
                                        var pitch = 0;

                                        if (right) {
                                            yaw = -elapsed * yawRate;

                                        } else if (left) {
                                            yaw = elapsed * yawRate;
                                        }

                                        if (down) {
                                            pitch = elapsed * pitchRate;

                                        } else if (up) {
                                            pitch = -elapsed * pitchRate;
                                        }

                                        if (Math.abs(yaw) > Math.abs(pitch)) {
                                            pitch = 0;
                                        } else {
                                            yaw = 0;
                                        }

                                        if (yaw != 0) {
                                            self._camera.rotateEyeY(yaw);
                                        }

                                        if (pitch != 0) {
                                            self._camera.rotateEyeX(pitch);
                                        }
                                    }
                                }
                            });

                    } else {

                        this.viewer.off(this._onTick);
                    }

                    /**
                     * Fired whenever this KeyboardOrbitCamera's {{#crossLink "KeyboardOrbitCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **MouseZoomCamera** lets you zoom a {{#crossLink "Camera"}}{{/crossLink}} using the mouse wheel.

 ## Overview

 <ul>
 <li>Zooming involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} closer and farther to its {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>If desired, you can have multiple MouseZoomCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MouseZoomCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the MouseZoomCameras we're driving is the one whose {{#crossLink "MouseZoomCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MouseZoomCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MouseZoomCamera.html"></iframe>

 @class MouseZoomCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MouseZoomCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MouseZoomCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MouseZoomCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 1.0 : 1.0;

            this.camera = cfg.camera;

            this._onTick = null;
            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MouseZoomCamera is active or not.
             *
             * Fires an {{#crossLink "MouseZoomCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var delta = 0;
                        var target = 0;
                        var newTarget = false;
                        var targeting = false;
                        var progress = 0;

                        var eyeVec = BIMSURFER.math.vec3();
                        var lookVec = BIMSURFER.math.vec3();
                        var tempVec3 = BIMSURFER.math.vec3();

                        var self = this;

                        this._onMouseWheel = this.viewer.input.on("mousewheel",
                            function (_delta) {

//                                var d = params.d * 0.01;
//
//                                delta = -d;

                                delta = _delta;

                                if (delta === 0) {
                                    targeting = false;
                                    newTarget = false;
                                } else {
                                    newTarget = true;
                                }
                            });

                        this._onTick = this.viewer.on("tick",
                            function () {

                                if (!self._camera) {
                                    return;
                                }

                                var camera = self._camera;

                                var eye = camera.eye;
                                var look = camera.look;

                                eyeVec[0] = eye[0];
                                eyeVec[1] = eye[1];
                                eyeVec[2] = eye[2];

                                lookVec[0] = look[0];
                                lookVec[1] = look[1];
                                lookVec[2] = look[2];

                                BIMSURFER.math.subVec3(eyeVec, lookVec, tempVec3);

                                var lenLook = Math.abs(BIMSURFER.math.lenVec3(tempVec3));
                                var lenLimits = 1000;
                                var f = self.sensitivity * (2.0 + (lenLook / lenLimits));

                                if (newTarget) {
                                    target = delta * f;
                                    progress = 0;
                                    newTarget = false;
                                    targeting = true;
                                }

                                if (targeting) {
                                    if (delta > 0) {
                                        progress += 0.2 * f;
                                        if (progress > target) {
                                            targeting = false;
                                        }
                                    } else if (delta < 0) {
                                        progress -= 0.2 * f;
                                        if (progress < target) {
                                            targeting = false;
                                        }
                                    }
                                    if (targeting) {
                                        camera.zoom(progress);
                                    }
                                }
                            });

                    } else {

                        input.off(this._onTick);
                        input.off(this._onMouseWheel);
                    }

                    /**
                     * Fired whenever this MouseZoomCamera's {{#crossLink "MouseZoomCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                    this._cameraDirty = true;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **KeyboardZoomCamera** lets you zoom a {{#crossLink "Camera"}}{{/crossLink}} using the + and - keys.

 ## Overview

 <ul>
 <li>Zooming involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} closer and farther to its {{#crossLink "Camera/look:property"}}{{/crossLink}} position.</li>
 <li>If desired, you can have multiple KeyboardZoomCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple KeyboardZoomCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the KeyboardZoomCameras we're driving is the one whose {{#crossLink "KeyboardZoomCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a KeyboardZoomCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_KeyboardZoomCamera.html"></iframe>

 @class KeyboardZoomCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardZoomCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardZoomCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardZoomCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 15.0 : 15.0;

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this KeyboardZoomCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardZoomCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                if (!input.ctrlDown && !input.altDown) {

                                    var wkey = input.keyDown[input.KEY_ADD];
                                    var skey = input.keyDown[input.KEY_SUBTRACT];

                                    if (wkey || skey) {

                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (skey) {
                                            z = elapsed * sensitivity;

                                        } else if (wkey) {
                                            z = -elapsed * sensitivity;
                                        }

                                        self._camera.zoom(z);
                                    }
                                }
                            });

                    } else {

                        this.viewer.off(this._onTick);
                    }

                    /**
                     * Fired whenever this KeyboardZoomCamera's {{#crossLink "KeyboardZoomCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **MousePanCamera** lets you pan a {{#crossLink "Camera"}}{{/crossLink}} using the mouse.

 ## Overview

 <ul>
 <li>Panning is done by dragging the mouse with the left and right buttons down.</li>
 <li>Panning up and down involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the direction of its {{#crossLink "Camera/up:property"}}{{/crossLink}} vector.</li>
 <li>Panning left and right involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the the vector that is perpendicular to its {{#crossLink "Camera/up:property"}}{{/crossLink}} and {{#crossLink "Camera/eye:property"}}{{/crossLink}}-{{#crossLink "Camera/look:property"}}{{/crossLink}} vector.</li>
 <li>If desired, you can have multiple MousePanCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple MousePanCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the MousePanCameras we're driving is the one whose {{#crossLink "MousePanCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a MousePanCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>


 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MousePanCamera.html"></iframe>

 @class MousePanCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MousePanCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MousePanCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MousePanCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 0.03 : 0.03;

            this.camera = cfg.camera;

            this._onTick = null;

            this._onMouseDown = null;
            this._onMouseMove = null;
            this._onMouseUp = null;

            this.active = cfg.active !== false;
        },

        _props: {


            /**
             * Flag which indicates whether this MousePanCamera is active or not.
             *
             * Fires an {{#crossLink "MousePanCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var lastX;
                        var lastY;
                        var xDelta = 0;
                        var yDelta = 0;
                        var down = false;

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function () {

                                if (!self._camera) {
                                    return;
                                }

                                if (xDelta != 0 || yDelta != 0) {

                                    self._camera.pan([xDelta, yDelta, 0]);

                                    xDelta = 0;
                                    yDelta = 0;
                                }
                            });

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                if ((input.mouseDownLeft && input.mouseDownRight) ||
                                    (input.mouseDownLeft && input.keyDown[input.KEY_SHIFT]) ||
                                    input.mouseDownMiddle) {

                                    lastX = e[0];
                                    lastY = e[1];

                                    down = true;

                                } else {
                                    down = false;
                                }
                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {
                                down = false;
                            });

                        this._onMouseMove = input.on("mousemove",
                            function (e) {
                                if (down) {
                                    xDelta += (e[0] - lastX) * self.sensitivity;
                                    yDelta += (e[1] - lastY) * self.sensitivity;
                                    lastX = e[0];
                                    lastY = e[1];
                                }
                            });

                    } else {

                        input.off(this._onTick);

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                        input.off(this._onMouseMove);
                    }

                    /**
                     * Fired whenever this MousePanCamera's {{#crossLink "MousePanCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **KeyboardPanCamera** lets you pan a {{#crossLink "Camera"}}{{/crossLink}} using the W, S, A and D keys.

 ## Overview

 <ul>
 <li>Panning up and down involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the direction of its {{#crossLink "Camera/up:property"}}{{/crossLink}} vector.</li>
 <li>Panning backwards and forwards involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the direction of its {{#crossLink "Camera/eye:property"}}{{/crossLink}} - {{#crossLink "Camera/look:property"}}{{/crossLink}} vector.</li>
 <li>Panning left and right involves moving the {{#crossLink "Camera"}}Camera's{{/crossLink}} {{#crossLink "Camera/eye:property"}}{{/crossLink}} and {{#crossLink "Camera/look:property"}}{{/crossLink}} positions along the the vector that is perpendicular to its {{#crossLink "Camera/up:property"}}{{/crossLink}} and {{#crossLink "Camera/eye:property"}}{{/crossLink}}-{{#crossLink "Camera/look:property"}}{{/crossLink}} vector.</li>
 <li>If desired, you can have multiple KeyboardPanCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple KeyboardPanCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}{{/crossLink}}.</li>
 <li>At any instant, the KeyboardPanCameras we're driving is the one whose {{#crossLink "KeyboardPanCamera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a KeyboardPanCameras to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_KeyboardPanCamera.html"></iframe>

 @class KeyboardPanCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardOrbitCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardPanCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardPanCamera",

        _init: function (cfg) {

            var sensitivity = cfg.sensitivity;

            this.sensitivity = sensitivity ? sensitivity * 10.0 : 10.0;

            this.camera = cfg.camera;

            this._onTick = null;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this KeyboardPanCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardPanCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    if (this._active === value) {
                        return;
                    }

                    var input = this.viewer.input;

                    if (value) {

                        var self = this;

                        this._onTick = this.viewer.on("tick",
                            function (params) {

                                if (!self._camera) {
                                    return;
                                }

                                var elapsed = params.elapsed;

                                if (!input.ctrlDown && !input.altDown) {

                                    var wkey = input.keyDown[input.KEY_W];
                                    var skey = input.keyDown[input.KEY_S];
                                    var akey = input.keyDown[input.KEY_A];
                                    var dkey = input.keyDown[input.KEY_D];
                                    var zkey = input.keyDown[input.KEY_Z];
                                    var xkey = input.keyDown[input.KEY_X];

                                    if (wkey || skey || akey || dkey || xkey || zkey) {

                                        var x = 0;
                                        var y = 0;
                                        var z = 0;

                                        var sensitivity = self.sensitivity;

                                        if (skey) {
                                            y = elapsed * sensitivity;

                                        } else if (wkey) {
                                            y = -elapsed * sensitivity;
                                        }

                                        if (dkey) {
                                            x = elapsed * sensitivity;

                                        } else if (akey) {
                                            x = -elapsed * sensitivity;
                                        }

                                        if (xkey) {
                                            z = elapsed * sensitivity;

                                        } else if (zkey) {
                                            z = -elapsed * sensitivity;
                                        }

                                        self._camera.pan([x, y, z]);
                                    }
                                }
                            });

                    } else {

                        this.viewer.off(this._onTick);
                    }

                    /**
                     * Fired whenever this KeyboardPanCamera's {{#crossLink "KeyboardPanCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });

})();
;/**
 A **KeyboardAxisCamera** lets you switch a {{#crossLink "Camera"}}{{/crossLink}} between preset left, right, anterior, posterior, superior and inferior views using the keyboard.

 ## Overview

 <ul>
 <li>If desired, you can have multiple KeyboardAxisCameras within the same {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Multiple KeyboardAxisCameras can drive the same {{#crossLink "Camera"}}{{/crossLink}}, or can each drive their own separate {{#crossLink "Camera"}}Cameras{{/crossLink}}.</li>
 <li>At any instant, the KeyboardAxisCamera we're driving is the one whose {{#crossLink "Camera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>You can switch a KeyboardAxisCamera to a different {{#crossLink "Camera"}}{{/crossLink}} at any time.</li>
 </ul>

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/control_KeyboardAxisCamera.html"></iframe>

 @class KeyboardAxisCamera
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this KeyboardAxisCamera.
 @param [camera] {Camera} The {{#crossLink "Camera"}}{{/crossLink}} to control.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.KeyboardAxisCamera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.KeyboardAxisCamera",

        _init: function (cfg) {

            this.camera = cfg.camera;

            this._onKeyDown = null;

            this._cameraFly = new BIMSURFER.CameraFlyAnimation(this.viewer, {
                camera: this.camera
            });

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this KeyboardAxisCamera is active or not.
             *
             * Fires an {{#crossLink "KeyboardAxisCamera/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._cameraFly.active = value;

                    var self = this;

                    var input = this.viewer.input;

                    if (value) {

                        this._onKeyDown = input.on("keydown",
                            function (keyCode) {

                                if (!self._camera) {
                                    return;
                                }

                                var center = self.viewer.center;

                                var dist;
                                var elev;

                                var eye;
                                var look;
                                var up;

                                switch (keyCode) {

                                    case input.KEY_NUM_1:

                                        // Right view

                                        dist = 100;
                                        elev = 0;

                                        look = center;
                                        eye = [-dist, elev, 0];
                                        up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_2:

                                        // Left view

                                        dist = 100;
                                        elev = 0;

                                        look = center;
                                        eye = [dist, elev, 0];
                                        up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_3:

                                        // Front view

                                        dist = 100;
                                        elev = 0;

                                        look = center;
                                        eye = [0, elev, -dist];
                                        up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_4:

                                        // Back view

                                        dist = 100;
                                        elev = 0;

                                        look = center;
                                        eye = [0, elev, dist];
                                        up = [ 0, 1, 0 ];

                                        break;

                                    case input.KEY_NUM_5:

                                        // Top view

                                        dist = 100;
                                        elev = 0;

                                        look = center;
                                        eye = [0, elev - dist, 0];
                                        up = [ 0, 0, 1 ];

                                        break;

                                    case input.KEY_NUM_6:

                                        // Bottom view

                                        dist = 100;
                                        elev = 0;

                                        look = [0, elev, 0 ];
                                        eye = [0, elev + dist, 0];
                                        up = [ 0, 0, -1 ];

                                        break;
                                }

                                if (look) {

                                    self._cameraFly.flyTo({
                                        look: look,
                                        eye: eye,
                                        up: up
                                    });
                                }
                            });

                    } else {

                        this.viewer.off(this._onKeyDown);
                    }

                    /**
                     * Fired whenever this KeyboardAxisCamera's {{#crossLink "KeyboardAxisCamera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            camera: {

                set: function (value) {
                    var camera = value;
                    if (camera) {
                        if (BIMSURFER._isString(camera)) {
                            camera = this.viewer.components[camera];
                            if (!camera) {
                                this.error("camera", "Camera not found in Viewer: " + value);
                                return;
                            }
                        }
                        if (camera.className != "BIMSURFER.Camera") {
                            this.error("camera", "Value is not a BIMSURFER.Camera");
                            return;
                        }
                    }
                    this._camera = camera;
                },

                get: function () {
                    return this._camera;
                }
            }
        },

        _destroy: function () {
            this.active = false;

            this._cameraFly.destroy();
        }
    });

})();
;/**
 A **MousePickObject** lets you add or remove {{#crossLink "Object"}}Objects{{/crossLink}} to and from an {{#crossLink "ObjectSet"}}ObjectSet{{/crossLink}} by clicking them with the mouse.

 ## Overview

 <ul>
 <li>A MousePickObject adds {{#crossLink "Object"}}Objects{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}} as you
 click them with the mouse, removing them again when you click them a second time.</li>
 <li>Typically a MousePickObject will share an {{#crossLink "ObjectSet"}}{{/crossLink}} with one or
 more {{#crossLink "MousePickObject"}}MousePickObjects{{/crossLink}}, in order to select which {{#crossLink "Object"}}Objects{{/crossLink}} are influenced by the {{#crossLink "MousePickObject"}}MousePickObjects{{/crossLink}}.</li>
 <li>A MousePickObject will provide its own {{#crossLink "ObjectSet"}}{{/crossLink}} by default.</li>
 <li>Hold down SHIFT while clicking to multi-select.</li>
 </ul>

 ## Example

 #### Clicking Objects to add them to a highlighted ObjectSet

 In this example, we view four {{#crossLink "Objects"}}Objects{{/crossLink}} with a {{#crossLink "Camera"}}{{/crossLink}}, which we manipulate with a {{#crossLink "CameraControl"}}{{/crossLink}}.
 <br>We also use a {{#crossLink "MousePickObject"}}{{/crossLink}} to add and remove
 the {{#crossLink "Objects"}}Objects{{/crossLink}} to an {{#crossLink "ObjectSet"}}{{/crossLink}}, to which we're applying
 a {{#crossLink "HighlightMousePickObject"}}{{/crossLink}}.
 <br><br>
 Click on the {{#crossLink "Objects"}}Objects{{/crossLink}} to select and highlight them - hold down SHIFT to multi-select.

 <iframe style="width: 600px; height: 400px" src="../../examples/control_MousePickObject_HighlightMousePickObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [10, 10, -10]
 });

 // Create a CameraControl
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer);

 // Create some Objects
 // Share the Geometry among them

 var object1 = new BIMSURFER.Object(viewer, {
    id: "object1",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, -3])
 });

 var object2 = new BIMSURFER.Object(viewer, {
    id: "object2",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, -3])
 });

 var object3 = new BIMSURFER.Object(viewer, {
    id: "object3",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, 3])
 });

 var object4 = new BIMSURFER.Object(viewer, {
    id: "object4",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, 3])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply a highlight MousePickObject to the ObjectSet
 var highlightMousePickObject = new BIMSURFER.HighlightMousePickObject(viewer, {
    objectSet: objectSet
 });

 // Create a MousePickObject
 var mousePickObject = new BIMSURFER.MousePickObject(viewer, {

    // We want the 3D World-space coordinates of
    // each location we pick
    rayPick: true
 });

 // Handle when Object is picked
 mousePickObject.on("pick", function(e) {
        alert("Picked: " + JSON.stringify(e));
 });

 // Handle when nothing is picked
 mousePickObject.on("nopick", function(e) {
        alert("Mothing picked");
 });
 ````

 @class MousePickObject
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this MousePickObject.
 @param [rayPick=false] {Boolean} Indicates whether this MousePickObject will find the 3D ray intersection whenever it picks a
 {{#crossLink "Object"}}Objects{{/crossLink}}.
 @param [active=true] {Boolean} Indicates whether or not this MousePickObject is active.
 @see {Object}
 @see {ObjectSet}
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.MousePickObject = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.MousePickObject",

        _init: function (cfg) {

            this.rayPick = cfg.rayPick;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this MousePickObject is active or not.
             *
             * Fires a {{#crossLink "MousePickObject/active:event"}}{{/crossLink}} event on change.
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

                        var self = this;

                        var input = this.viewer.input;

                        this._onMouseUp = input.on("dblclick",
                            function (coords) {

                                var hit = self.viewer.pick(coords[0], coords[1], {
                                    rayPick: self._rayPick
                                });

                                if (hit) {
                                    self.fire("pick", hit);

                                } else {
                                    self.fire("nopick", {
                                        canvasPos: e
                                    });
                                }
                            });

                    } else {

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                    }

                    /**
                     * Fired whenever this MousePickObject's {{#crossLink "MousePickObject/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            /**
             * Indicates whether this MousePickObject will find the 3D ray intersection whenever it picks an
             * {{#crossLink "Object"}}Object{{/crossLink}}.
             *
             * When true, this MousePickObject returns the 3D World-space intersection in each
             * {{#crossLink "MousePickObject/picked:event"}}{{/crossLink}} event.
             *
             * Fires a {{#crossLink "MousePickObject/rayPick:event"}}{{/crossLink}} event on change.
             *
             * @property rayPick
             * @type Boolean
             */
            rayPick: {

                set: function (value) {

                    value = !!value;

                    if (this._rayPick === value) {
                        return;
                    }

                    this._dirty = false;

                    /**
                     * Fired whenever this MousePickObject's {{#crossLink "MousePickObject/rayPick:property"}}{{/crossLink}} property changes.
                     * @event rayPick
                     * @param value The property's new value
                     */
                    this.fire('rayPick', this._rayPick = value);
                },

                get: function () {
                    return this._rayPick;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }
    });
})();;/**
 A **ClickSelectObjects** lets you add or remove {{#crossLink "Object"}}Objects{{/crossLink}} to and from an {{#crossLink "ObjectSet"}}ObjectSet{{/crossLink}} by clicking them with the mouse.

 ## Overview

 <ul>
 <li>A ClickSelectObjects adds {{#crossLink "Object"}}Objects{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}} as you
 click them with the mouse, removing them again when you click them a second time.</li>
 <li>Typically a ClickSelectObjects will share an {{#crossLink "ObjectSet"}}{{/crossLink}} with one or
 more {{#crossLink "Effect"}}Effects{{/crossLink}}, in order to select which {{#crossLink "Object"}}Objects{{/crossLink}} are influenced by the {{#crossLink "Effect"}}Effects{{/crossLink}}.</li>
 <li>A ClickSelectObjects will provide its own {{#crossLink "ObjectSet"}}{{/crossLink}} by default.</li>
 <li>Hold down SHIFT while clicking to multi-select.</li>
 </ul>

 ## Example

 #### Clicking Objects to add them to a highlighted ObjectSet

 In this example, we view four {{#crossLink "Objects"}}Objects{{/crossLink}} with a {{#crossLink "Camera"}}{{/crossLink}}, which we manipulate with a {{#crossLink "CameraControl"}}{{/crossLink}}.
 <br>We also use a {{#crossLink "ClickSelectObjects"}}{{/crossLink}} to add and remove
 the {{#crossLink "Objects"}}Objects{{/crossLink}} to an {{#crossLink "ObjectSet"}}{{/crossLink}}, to which we're applying
 a {{#crossLink "HighlightEffect"}}{{/crossLink}}.
 <br><br>
 Click on the {{#crossLink "Objects"}}Objects{{/crossLink}} to select and highlight them - hold down SHIFT to multi-select.

 <iframe style="width: 600px; height: 400px" src="../../examples/control_ClickSelectObjects_HighlightEffect.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [10, 10, -10]
 });

 // Create a CameraControl
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer);

 // Create some Objects
 // Share the Geometry among them

 var object1 = new BIMSURFER.Object(viewer, {
    id: "object1",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, -3])
 });

 var object2 = new BIMSURFER.Object(viewer, {
    id: "object2",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, -3])
 });

 var object3 = new BIMSURFER.Object(viewer, {
    id: "object3",
    type: "IfcDistributionFlowElement",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([-3, 0, 3])
 });

 var object4 = new BIMSURFER.Object(viewer, {
    id: "object4",
    type: "IfcRoof",
    geometries: [ geometry ],
    matrix: BIMSURFER.math.translationMat4v([3, 0, 3])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply a highlight effect to the ObjectSet
 var highlightEffect = new BIMSURFER.HighlightEffect(viewer, {
    objectSet: objectSet
 });

 // Create a ClickSelectObjects to select or unselect the Objects with the mouse
 var clickSelectObjects = new BIMSURFER.ClickSelectObjects(viewer, {
    objectSet: objectSet
 });
 ````

 @class ClickSelectObjects
 @module BIMSURFER
 @submodule input
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Camera.
 @param [selection] {Selection} The Selection to update.
 @see {Object}
 @see {ObjectSet}
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.ClickSelectObjects = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.ClickSelectObjects",

        _init: function (cfg) {

            this.objectSet = cfg.objectSet || new BIMSURFER.ObjectSet(this.viewer);

            this._multi = !!cfg.multi;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this ClickSelectObjects is active or not.
             *
             * Fires a {{#crossLink "ClickSelectObjects/active:event"}}{{/crossLink}} event on change.
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

                        var self = this;

                        var input = this.viewer.input;

                        var lastX;
                        var lastY;

                        this._onMouseDown = input.on("mousedown",
                            function (e) {

                                lastX = e[0];
                                lastY = e[1];
                            });

                        this._onMouseUp = input.on("mouseup",
                            function (e) {

                                if (((e[0] > lastX) ? (e[0] - lastX < 5) : (lastX - e[0] < 5)) &&
                                    ((e[1] > lastY) ? (e[1] - lastY < 5) : (lastY - e[1] < 5))) {

                                    var multiSelect = self._multi || input.keyDown[input.KEY_SHIFT];

                                    var hit = self.viewer.pick(lastX, lastY, {});

                                    if (hit) {

                                        var object = hit.object;

                                        if (!self.objectSet.objects[object.id]) {

                                            // Select

                                            if (!multiSelect) {
                                                self.objectSet.clear();
                                            }

                                            self.objectSet.addObjects([object]);

                                        } else {

                                            // Deselect

                                            self.objectSet.removeObjects([object]);
                                        }
                                    } else {

                                        if (!multiSelect) {
                                            self.objectSet.clear();
                                        }
                                    }
                                }
                            });

                    } else {

                        input.off(this._onMouseDown);
                        input.off(this._onMouseUp);
                    }

                    /**
                     * Fired whenever this ClickSelectObjects's {{#crossLink "ClickSelectObjects/active:property"}}{{/crossLink}} property changes.
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
            this.active = false;
        }
    });
})();;/**
 * Core viewer components.
 *
 * @module BIMSURFER
 * @submodule canvas
 */;/**
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
 @submodule canvas
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

})();;/**
 * Viewer objects and utilities.
 *
 * @module BIMSURFER
 * @submodule objects
 */;/**
 An **Object** is a visible 3D element within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 In the example below we'll create three Objects, each with a unique ID and a modelling transform.

 <iframe style="width: 600px; height: 400px" src="../../examples/object_Object.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [10, 10, -10]
    });

 // Create a CameraControl to control our Camera with mouse and keyboard
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a Geometry
 var geometry = new BIMSURFER.TeapotGeometry(viewer, {
        id: "myGeometry"
    });

 // Create first Object
 // Use the Geometry
 var object21 = new BIMSURFER.Object(viewer, {
        id: "myObject1",
        type: "IfcCovering",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-4, 0,0])
    });

 // Create second Object
 // Reuse the Geometry
 var object2 = new BIMSURFER.Object(viewer, {
        id: "myObject2",
        type: "IfcFlowTerminal",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([4, 0,0])
    });
 ````

 We can then find the objects in the {{#crossLink "Viewer"}}{{/crossLink}} by ID:

 ````javascript
 var foo = viewer.components["myObject1"];
 ````
 or by IFC type:
 ````javascript

 // Get all Objects of the given IFC type
 var wallObjects = viewer.components["IfcWall"];

 // Get our "foo" object from those
 var foo = wallObjects["moObject1"];
 ````



 @class Object
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Object.
 @param [cfg.type] {String} The IFC type of this Object.
 @param [cfg.color] {Array of Number} The color of this Object, defaults to the color of the specified IFC type.
 @param [cfg.geometries] {Array of Geometry} The {{#crossLink "Geometry"}}{{/crossLink}} to render for this Object.
 @param [cfg.clipping=true] {Boolean} Whether this Object is clipped by {{#crossLink "Clips"}}{{/crossLink}}.
 @param [cfg.transparent=false] {Boolean} Whether this Object is transparent or not.
 @param [cfg.opacity=1] {Number} Scalar in range 0-1 that controls opacity, where 0 is completely transparent and 1 is completely opaque.
 Only applies while this Object's {{#crossLink "Object/transparent:property"}}transparent{{/crossLink}} equals ````true````.
 @param [cfg.highlight=false] {Boolean} Whether this Object is highlighted or not.
 @param [cfg.xray=false] {Boolean} Whether this Object is highlighted or not.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Object = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Object",

        _init: function (cfg) {

            this._color = [1, 1, 1, 1];

            this._opacity = 1.0;

            var contentNode = this.viewer.scene.getNode("contentRoot");

            this._rootNode = contentNode.addNode();

            this._enableNode = this._rootNode.addNode({
                type: "enable"
            });

            this._flagsNode = this._enableNode.addNode({
                type: "flags",
                flags: {
                    backfaces: false
                }
            });

            this._materialNode = this._flagsNode.addNode({
                type: "material",
                specularColor: { r: 1, g: 1, b: 1 }
            });

            this._matrixNode = this._materialNode.addNode({
                type: "matrix"
            });

            this._nameNode = this._matrixNode.addNode({
                type: "name",
                name: this.id
            });

            this._geometryNodes = [];

            if (cfg.geometries) {

                // Use the given Geometry components

                var geometries = cfg.geometries;
                var geometry;

                for (var i = 0, len = geometries.length; i < len; i++) {

                    geometry = geometries[i];

                    if (BIMSURFER._isString(geometry)) {

                        // Geometry is the ID of a BIMSURFER.Geometry within the Viewer

                        geometry = this.viewer.components[geometry];

                        if (!geometry) {
                            this.error("geometry[" + i + "] not found in viewer");
                            continue;
                        }

                        if (!geometry.coreId) {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                    } else {

                        // Geometry is an instance of a BIMSURFER.Geometry within the Viewer

                        if (!geometry.coreId) {
                            this.error("geometry[" + i + "] is not a BIMSURFER.Geometry");
                            continue;
                        }

                        if (geometry.viewer.id != this.viewer.id) {
                            this.error("geometry[" + i + "] is not within the same Viewer");
                            continue;
                        }
                    }

                    this._geometryNodes.push(
                        this._nameNode.addNode({
                            type: "geometry",
                            coreId: geometry.coreId
                        }));
                }

            } else {

                // Use the Viewer's default box-shaped  BIMSURFER.Geometry,
                // creating that first if needed

                var geometry = this.viewer.components["geometry.default"];

                if (!geometry) {
                    geometry = new BIMSURFER.Geometry(this.viewer, {
                        id: "geometry.default"
                    });
                }

                this._geometryNodes.push(
                    this._nameNode.addNode({
                        type: "geometry",
                        coreId: geometry.coreId
                    }));
            }

            this._initBoundary();

            this.type = cfg.type;

            if (this.type) {

                if (cfg.color) {

                    this.color = cfg.color;

                } else {

                    var color;

                    var materials = BIMSURFER.constants.materials;

                    if (!materials) {

                        this.warn("Property expected in BIMSURFER.constants: materials");

                    } else {

                        color = materials[this.type];

                        if (!color) {

                            this.log("Material not found for type: ", this.type);

                            color = materials["DEFAULT"];
                        }

                        if (!color) {

                            this.log("Default material not found for type: ", this.type);
                        }
                    }

                    this.color = color || [ 0.8470588235, 0.427450980392, 0, 1.0];
                }

            } else {

                this.color = cfg.color;
            }

            this.transparent = cfg.transparent;

            this.opacity = cfg.opacity;

            this.xray = cfg.xray;

            this.highlight = cfg.highlight;

            this.matrix = cfg.matrix;

            this.label = cfg.label;

            this.active = cfg.active !== false;
        },

        _initBoundary: function () {

            var i, len;

            // Initial inside-out boundary, ready to expand to fit geometry or sub-objects
            this._modelBoundary = {
                xmin: 1000000.0,
                ymin: 1000000.0,
                zmin: 1000000.0,
                xmax: -1000000.0,
                ymax: -1000000.0,
                zmax: -1000000.0
            };

            var geometry;
            for (i = 0, len = this._geometryNodes.length; i < len; i++) {
                geometry = this._geometryNodes[i];
                this._expandBoundaryByBoundary(this._modelBoundary, geometry.getBoundary());
            }

            this._modelCenter = [
                    (this._modelBoundary.xmax + this._modelBoundary.xmin) * 0.5,
                    (this._modelBoundary.ymax + this._modelBoundary.ymin) * 0.5,
                    (this._modelBoundary.zmax + this._modelBoundary.zmin) * 0.5
            ];

            this._modelBoundaryVerts = this._boundaryToVerts(this._modelBoundary);

            this._center = [0, 0, 0];
            this._boundary = null;
        },

        _expandBoundaryByBoundary: function (a, b) {
            if (a.xmin > b.xmin) {
                a.xmin = b.xmin;
            }
            if (a.ymin > b.ymin) {
                a.ymin = b.ymin;
            }
            if (a.zmin > b.zmin) {
                a.zmin = b.zmin;
            }
            if (a.xmax < b.xmax) {
                a.xmax = b.xmax;
            }
            if (a.ymax < b.ymax) {
                a.ymax = b.ymax;
            }
            if (a.zmax < b.zmax) {
                a.zmax = b.zmax;
            }
        },

        _boundaryToVerts: function (boundary) {
            return [
                [boundary.xmin, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymin, boundary.zmin],
                [boundary.xmax, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymax, boundary.zmin],
                [boundary.xmin, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymin, boundary.zmax],
                [boundary.xmax, boundary.ymax, boundary.zmax],
                [boundary.xmin, boundary.ymax, boundary.zmax]
            ];
        },

        _vertsToBoundary: function (verts) {
            var xmin = 100000;
            var ymin = 100000;
            var zmin = 100000;
            var xmax = -100000;
            var ymax = -100000;
            var zmax = -100000;
            var x, y, z;
            for (var i = 0, len = verts.length; i < len; i++) {
                x = verts[i][0];
                y = verts[i][1];
                z = verts[i][2];
                if (x === undefined || x === null ||
                    y === undefined || y === null ||
                    z === undefined || z === null) {
                    continue;
                }
                if (x < xmin) {
                    xmin = x;
                }
                if (y < ymin) {
                    ymin = y;
                }
                if (z < zmin) {
                    zmin = z;
                }
                if (x > xmax) {
                    xmax = x;
                }
                if (y > ymax) {
                    ymax = y;
                }
                if (z > zmax) {
                    zmax = z;
                }
            }
            return { xmin: xmin, ymin: ymin, zmin: zmin, xmax: xmax, ymax: ymax, zmax: zmax };
        },

        _props: {

            /**
             * Whether this Object is active or not.
             *
             * Fires an {{#crossLink "Object/active:event"}}{{/crossLink}} event on change.
             *
             * @property active
             * @type Boolean
             */
            active: {

                set: function (value) {

                    value = !!value;

                    if (this._active === value) {
                        return;
                    }

                    this._enableNode.setEnabled(value);

                    if (this.label) {
                        this.label.active = value;
                    }

                    /**
                     * Fired whenever this Object's {{#crossLink "Object/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            /**
             Whether this Object is transparent.

             @property transparent
             @default false
             @type Boolean
             */
            transparent: {

                set: function (value) {

                    value = !!value;

                    if (this._transparent === value) {
                        return;
                    }

                    this._transparent = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._transparent;
                }
            },

            /**
             Whether this Object is highlighted.

             @property highlighted
             @default false
             @type Boolean
             */
            highlight: {

                set: function (value) {

                    if (this._highlighted === value) {
                        return;
                    }

                    this._highlighted = value;

                    if (value) {
                        this._desaturated = false;
                    }

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._highlighted;
                }
            },

            /**
             Whether this Object is desaturated.

             @property desaturated
             @default false
             @type Boolean
             */
            desaturate: {

                set: function (value) {

                    if (this._desaturated === value) {
                        return;
                    }

                    this._desaturated = value;

                    if (value) {
                        this._highlighted = false;
                    }

                    this._materialNode.setColor(
                        this._desaturated
                            ? { r: 0.4, g: 0.4, b: 0.4 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._desaturated;
                }
            },

            /**
             Whether this Object is X-rayed

             @property xray
             @default false
             @type Boolean
             */
            xray: {

                set: function (value) {

                    value = !!value;

                    if (this._xray === value) {
                        return;
                    }

                    this._xray = value;

                    this._flagsNode.setTransparent(this._transparent || this._xray);

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._xray;
                }
            },

            /**
             The color of this Object.

             @property color
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            color: {

                set: function (value) {

                    if (!value) {

                        var materials = BIMSURFER.constants.materials;

                        if (materials) {
                            value = materials["DEFAULT"];
                        }
                    }

                    this._color = value || [ 0.8470588235, 0.427450980392, 0, 1.0];

                    this._materialNode.setColor(
                        this._highlighted
                            ? { r: 0.7, g: 0.7, b: 0.3 }
                            : { r: this._color[0], g: this._color[1], b: this._color[2] });
                },

                get: function () {
                    return this._color;
                }
            },

            /**
             Factor in the range [0..1] indicating how transparent this Object is.

             A value of 0.0 indicates fully transparent, 1.0 is fully opaque.

             This Object will appear transparent only if {{#crossLink "Object/transparent:property"}}{{/crossLink}} is also
             set to **true**.

             @property opacity
             @default 1.0
             @type Number
             */
            opacity: {

                set: function (value) {

                    this._opacity = value !== null && value !== undefined ? value : 0.4;

                    this._materialNode.setAlpha(this._xray ? 0.7 : (this._transparent ? this._opacity : 1.0));
                },

                get: function () {
                    return this._opacity;
                }
            },

            /**
             * This Object's transformation matrix.
             *
             * @property matrix
             * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
             * @type {Array of Number}
             */
            matrix: {

                set: function (value) {

                    value = value || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

                    this._matrixNode.setElements(value);

                    this._boundary = null;

                    this.fire('matrix', this._matrix = value);
                },

                get: function () {
                    return this._matrix;
                }
            },

            /**
             * The World-space boundary of this Object.
             *
             * @property boundary
             * @type {*}
             */
            boundary: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._boundary;
                }
            },

            /**
             * The World-space center of this Object.
             *
             * @property center
             * @type {Array of Number}
             */
            center: {

                get: function () {

                    if (!this._boundary) {

                        this._boundary = this._vertsToBoundary(
                            BIMSURFER.math.transformPoints3(this._matrix, this._modelBoundaryVerts));

                        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
                        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
                        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;
                    }

                    return this._center;
                }
            },

            /**
             * Indicates if this Object shows a debug {{#crossLink "Label"}}{{/crossLink}}.
             *
             * @property label
             * @type Boolean
             */
            label: {

                set: function (value) {

                    value = !!value;

                    if (!!this._label === value) {
                        return;
                    }

                    if (value) {

                        if (this._label) {


                        } else {

                            this._label = new BIMSURFER.Label(viewer, {
                                object: this,
                                text: "<b>" + this.className + "<hr style=\"height=1px; background: darkgray; border: 0;\"></b>" + (this.type ? ("type='" + this.type + "'<br>") : "") + "id='" + this.id + "'",
                                pos: [0, 0, 0]
                            });
                        }

                    } else {

                        this._label.destroy();

                        this._label = null;
                    }
                },

                get: function () {
                    return !!this._label;
                }
            }
        },

        _destroy: function () {

            this._rootNode.destroy();

            if (this.label) {
                this.label.destroy();
            }
        }
    });

})();;/**
 An **BoxObject** is a box-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/object_BoxObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
     eye: [20, 20, -20]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a BoxObject
 new BIMSURFER.BoxObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.scaleMat4v([1.5, 1.5, 1.5])
 });

 ````

 @class BoxObject
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:BoxObject} Optional map of user-defined metadata to attach to this BoxObject.
 @param [cfg.type] {String} The IFC type of this BoxObject.
 @param [cfg.color] {Array of Number} The color of this BoxObject, defaults to the color of the specified IFC type.
 @param [cfg.geometries] {Array of Geometry} The {{#crossLink "Geometry"}}{{/crossLink}} to render for this BoxObject.
 @param [cfg.clipping=true] {Boolean} Whether this BoxObject is clipped by {{#crossLink "Clips"}}{{/crossLink}}.
 @param [cfg.transparent=false] {Boolean} Whether this BoxObject is transparent or not.
 @param [cfg.opacity=1] {Number} Scalar in range 0-1 that controls opacity, where 0 is completely transparent and 1 is completely opaque.
 Only applies while this BoxObject's {{#crossLink "BoxObject/transparent:property"}}transparent{{/crossLink}} equals ````true````.
 @param [cfg.highlight=false] {Boolean} Whether this BoxObject is highlighted or not.
 @param [cfg.xray=false] {Boolean} Whether this BoxObject is highlighted or not.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.BoxObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.BoxObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.BoxGeometry(this.viewer)
                ]
            }, cfg));
        },

        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();;/**
 An **TeapotObject** is a teapot-shaped {{#crossLink "Object"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/object_TeapotObject.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a TeapotObject
 new BIMSURFER.TeapotObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.scaleMat4v([ 1.5, 1.5, 1.5 ])
 });

 ````

 @class TeapotObject
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxObject.
 @extends Object
 */
(function () {

    "use strict";

    BIMSURFER.TeapotObject = BIMSURFER.Object.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.TeapotObject",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                geometries: [
                    this._geometry = new BIMSURFER.TeapotGeometry(this.viewer)
                ]
            }, cfg));
        },

        _destroy: function () {

            this._geometry.destroy();

            this._super();
        }
    });
})();;/**

 **RandomObjects** is a group of random {{#crossLink "BoxObject"}}BoxObjects{{/crossLink}}, useful for tests and demos.

 ## Overview

 <ul>
 <li>The {{#crossLink "BoxObject"}}BoxObjects{{/crossLink}} are arranged in a 2D grid, and each get an IFC type, picked at random
 from among the {{#crossLink "BIMSURFER.constants/defaultTypes:property"}}{{/crossLink}}.</li>
 </ul>

 ## Example

 In this example we create a RandomObjects containing 55 {{#crossLink "Object"}}Objects{{/crossLink}}:

 <iframe style="width: 600px; height: 400px" src="../../examples/object_RandomObjects.html"></iframe>

 ````javascript
// Create a Viewer
var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

// Create a Camera
var camera = new BIMSURFER.Camera(viewer, {
     eye: [70, 70, -70]
});

// Spin the camera
viewer.on("tick", function () {
    camera.rotateEyeY(0.2);
});

// Create a CameraControl
var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
});

// Create a RandomObjects
var randomObjects = new BIMSURFER.RandomObjects(viewer, {
    numObjects: 55
});
 ````

 @class RandomObjects
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} RandomObjects configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this RandomObjects.
 @param [cfg.numObjects] {Number} Number of {{#crossLink "Object"}}Objects{{/crossLink}} within this RandomObjects.
 @param [cfg.labels] {Boolean} Indicates whether to show debugging {{#crossLink "Label"}}Labels{{/crossLink}} on the {{#crossLink "Object"}}Objects{{/crossLink}} within this RandomObjects.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.RandomObjects = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.RandomObjects",

        _init: function (cfg) {

            this._numObjects = cfg.numObjects || 25;

            /**
             * The {{#crossLink "Objects"}}{{/crossLink}} within this RandomObjects.
             * @type {{Array of Object}}
             */
            this.objects = [];

            this._labels = cfg.labels;

            this._generate();
        },

        _generate: function () {

            var len = Math.sqrt(this._numObjects);

            var xStart = len * -0.5;
            var zStart = len * -0.5;

            var xEnd = len * 0.5;
            var zEnd = len * 0.5;

            var defaultTypes = BIMSURFER.constants.defaultTypes;

            var spacing = 15;

            for (var x = xStart; x < xEnd; x += 1) {
                for (var z = zStart; z < zEnd; z += 1) {

                    this.objects.push(
                        new BIMSURFER.BoxObject(this.viewer, {
                            id: "testObject" + this.objects.length,
                            type: defaultTypes[Math.round(Math.random() * defaultTypes.length)],
                            matrix: BIMSURFER.math.translationMat4v([x * spacing, 0, z * spacing]),
                            label: this._labels
                        }));
                }
            }
        },

        _clear: function () {
            while (this.objects.length > 0) {
                this.objects.pop().destroy();
            }
        },

        _destroy: function () {
            this._clear();
        }
    });
})();
;/**
 An **ObjectSet** is a set of {{#crossLink "Object"}}Objects{{/crossLink}}.

 ## Overview

 <ul>
 <li>Supports addition and removal of {{#crossLink "Object"}}Objects{{/crossLink}} by instance, ID or IFC type.</li>
 <li>Can be queried for the {{#crossLink "ObjectSet/boundary:property"}}{{/crossLink}}
 and {{#crossLink "ObjectSet/center:property"}}{{/crossLink}} of its {{#crossLink "Object"}}Objects{{/crossLink}}.</li>
 <li>Use with a {{#crossLink "ClickSelectObjects"}}{{/crossLink}} to add and remove {{#crossLink "Object"}}Objects{{/crossLink}} with mouse clicks.</li>
 <li>Can be used to mask {{#crossLink "Object"}}Objects{{/crossLink}} for Effects such as {{#crossLink "HighlightEffect"}}{{/crossLink}}, {{#crossLink "XRayEffect"}}{{/crossLink}} and
 {{#crossLink "IsolateEffect"}}{{/crossLink}}.</li>

 </ul>

 ## Example

 #### Highlighting an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
 <br> Then we apply a {{#crossLink "HighlightEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to become highlighted while the other two {{#crossLink "Object"}}Objects{{/crossLink}} remain un-highlighted.

 <iframe style="width: 600px; height: 400px" src="../../examples/object_ObjectSet_addObjects.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [30, 20, -30]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply a Highlight effect to the ObjectSet, which causes the
 // Object in the ObjectSet to become highlighted.

 var highlight = new BIMSURFER.HighlightEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the Highlight to now render
 // that Object as highlighted also

 objectSet.addObjects([object3]);

 ````

 #### Boundaries

 TODO

 @class ObjectSet
 @module BIMSURFER
 @submodule objects
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Selection.
 @param [cfg.objects] {{Array of String|Object}} Array of {{#crossLink "Object"}}{{/crossLink}} IDs or instances.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.ObjectSet = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.ObjectSet",

        _init: function (cfg) {

            var self = this;

            /**
             * The {{#crossLink "Objects"}}{{/crossLink}} within this ObjectSet, mapped to their IDs.
             *
             * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event on change.
             *
             * @property objects
             * @type {{String:Object}}
             */
            this.objects = {};

            // Subscribe to each Object's transform matrix
            // so we can mark selection boundary dirty
            this._onObjectMatrix = {};

            /**
             * The number of {{#crossLink "Objects"}}{{/crossLink}} within this ObjectSet.
             *
             * @property numObjects
             * @type Number
             */
            this.numObjects = 0;

            this._boundary = {xmin: 0.0, ymin: 0.0, zmin: 0.0, xmax: 0.0, ymax: 0.0, zmax: 0.0 };
            this._center = [0, 0, 0];

            this._boundaryDirty = true;

            this._onComponentDestroyed = this.viewer.on("componentDestroyed",
                function (component) {

                    if (self.objects[component.id]) {

                        delete self.objects[component.id];

                        self._boundaryDirty = true;

                        /**
                         * Fired whenever {{#crossLink "Object"}}Objects{{/crossLink}} are added or removed from this ObjectSet.
                         *
                         * Note that this event also indicates that the ObjectSet's {{#crossLink "ObjectSet/boundary:property"}}{{/crossLink}}
                         * and {{#crossLink "ObjectSet/center:property"}}{{/crossLink}} will have updated, accordingly.
                         *
                         * @event updated
                         * @param e The event
                         * @param Boolean [cleared
                         * @param [e.removed] Info on removed Objects
                         * @param {Array of String} [e.removed.objectIds] IDs of removed Objects, when they were removed by ID
                         * @param {{Array of String} [e.removed.types] IFC types of removed Objects, when they were removed by IFC type
                         * @param {} [e.added] Info on added Objects
                         * @param {Array of String} [e.added.objectIds] IDs of added Objects, when they were added by ID
                         * @param {Array of String} [e.added.types] IFC types of added Objects, when they were added by IFC type
                         */
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

        /**
         * Removes all {{#crossLink "Object"}}Objects{{/crossLink}} from this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method clear
         */
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

        /**
         * Adds all {{#crossLink "Object"}}Objects{{/crossLink}} in the {{#crossLink "Viewer"}}{{/crossLink}} to this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method addAllObjects
         */
        addAllObjects: function() {

            var objects = [];

            // Apply effect to Objects in the Viewer
            this.viewer.withClasses(["BIMSURFER.Object"],
                function (object) {
                    objects.push(object);
                });

            this.viewer.withClasses(["BIMSURFER.BoxObject"],
                function (object) {
                    objects.push(object);
                });

            this.viewer.withClasses(["BIMSURFER.TeapotObject"],
                function (object) {
                    objects.push(object);
                });

            this.addObjects(objects);
        },

        /**
         * Adds {{#crossLink "Object"}}Objects{{/crossLink}} instances to this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method addObjects
         * @param {Array of Objects} objects Array of {{#crossLink "Object"}}Objects{{/crossLink}} instances.
         */
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

        /**
         * Removes {{#crossLink "Object"}}Objects{{/crossLink}} instances from this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method removeObjects
         * @param {Array of Objects} objects Array of {{#crossLink "Object"}}Objects{{/crossLink}} instances.
         */
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

        /**
         * Adds {{#crossLink "Object"}}Objects{{/crossLink}} by ID to this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method addObjectIds
         * @param {Array of String} objects Array of {{#crossLink "Object"}}Object{{/crossLink}} IDs.
         */
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

        /**
         * Removes {{#crossLink "Object"}}Objects{{/crossLink}} by ID from this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method removeObjectIds
         * @param {Array of String} objects Array of {{#crossLink "Object"}}Object{{/crossLink}} IDs.
         */
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

        /**
         * Adds {{#crossLink "Object"}}Objects{{/crossLink}} by IFC type to this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method addTypes
         * @param {Array of String} objects Array of IFC types.
         */
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

        /**
         * Removes {{#crossLink "Object"}}Objects{{/crossLink}} by IFC type from this ObjectSet.
         *
         * The {{#crossLink "Object"}}Objects{{/crossLink}} must be in the same {{#crossLink "Viewer"}}{{/crossLink}} as this ObjectSet.
         *
         * Fires an {{#crossLink "ObjectSet/updated:event"}}{{/crossLink}} event.
         *
         * @method removeTypes
         * @param {Array of String} objects Array of IFC types.
         */
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
         * Iterates with a callback over the {{#crossLink "Object"}}Objects{{/crossLink}} in this ObjectSet.
         *
         * @method withObjects
         * @param {Function} callback Callback called for each {{#crossLink "Object"}}{{/crossLink}}.
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
                this._boundary.xmin = -1.0;
                this._boundary.ymin = -1.0;
                this._boundary.zmin = -1.0;
                this._boundary.xmax =  1.0;
                this._boundary.ymax =  1.0;
                this._boundary.zmax =  1.0;

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

            /**
             * The axis-aligned World-space boundary of the {{#crossLink "Object"}}Objects{{/crossLink}} within this ObjectSet.
             *
             * @property boundary
             * @readonly
             * @type {{}}
             */
            boundary: {

                get: function () {

                    if (this._boundaryDirty) {

                        this._rebuildBoundary();
                    }

                    return this._boundary;
                }
            },

            /**
             * The World-space center of the {{#crossLink "Object"}}Objects{{/crossLink}} within this ObjectSet.
             *
             * @property center
             * @readonly
             * @type {{}}
             */
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

})();;/**
 * Camera components.
 *
 * @module BIMSURFER
 * @submodule camera
 */;/**
 A **Camera** defines a viewpoint within a {{#crossLink "Viewer"}}Viewer{{/crossLink}}.

 ## Overview

 <ul>
 <li>You can have an unlimited number of Cameras in a {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>At any instant, the Camera we're looking through is the one whose {{#crossLink "Camera/active:property"}}active{{/crossLink}} property is true.</li>
 <li>Cameras can be controlled with controls such as {{#crossLink "CameraControl"}}{{/crossLink}}, {{#crossLink "KeyboardAxisCamera"}}{{/crossLink}},
 {{#crossLink "KeyboardOrbitCamera"}}{{/crossLink}}, {{#crossLink "KeyboardPanCamera"}}{{/crossLink}}, {{#crossLink "KeyboardZoomCamera"}}{{/crossLink}},
 {{#crossLink "MouseOrbitCamera"}}{{/crossLink}}, {{#crossLink "MousePanCamera"}}{{/crossLink}} and {{#crossLink "MouseZoomCamera"}}{{/crossLink}}.</li>
 </ul>

 ## Example

 In this example we define multiple Cameras looking at a {{#crossLink "TeapotObject"}}{{/crossLink}}, then periodically switch between the Cameras.

 <iframe style="width: 600px; height: 400px" src="../../examples/camera_Camera_multiple.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create an object
 var box = new BIMSURFER.TeapotObject(viewer);

 // Create some Cameras
 var cameras = [

 new BIMSURFER.Camera(viewer, {
        eye: [5, 5, 5],
        active: false
    }),

 new BIMSURFER.Camera(viewer, {
        eye: [-5, 5, 5],
        active: false
    }),

 new BIMSURFER.Camera(viewer, {
        eye: [5, -5, 5],
        active: false
    }),

 new BIMSURFER.Camera(viewer, {
        eye: [5, 5, -5],
        active: false
    }),

 new BIMSURFER.Camera(viewer, {
        eye: [-5, -5, 5],
        active: false
    })
 ];

 // Periodically switch between the Cameras

 var i = -1;
 var last = -1;

 setInterval(function () {

        if (last > -1) {
            cameras[last].active = false
        }

        i = (i + 1) % (cameras.length - 1);

        cameras[i].active = true;

        last = i;

    }, 1000);
 ````

 @class Camera
 @module BIMSURFER
 @submodule camera
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Camera.
 @param [cfg.eye=[0,0,-10]] {Array of Number} Eye position.
 @param [cfg.look=[0,0,0]] {Array of Number} The position of the point-of-interest we're looking at.
 @param [cfg.up=[0,1,0]] {Array of Number} The "up" vector.
 @param [cfg.fovy=60.0] {Number} Field-of-view angle, in degrees, on Y-axis.
 @param [cfg.aspect=1.0] {Number} Aspect ratio.
 @param [cfg.near=0.1] {Number} Position of the near plane on the View-space Z-axis.
 @param [cfg.far=10000] {Number} Position of the far plane on the View-space Z-axis.
 @extends Component
 */
(function () {

    "use strict";

    /**
     * Defines a viewpoint within a {@link Viewer}.
     */
    BIMSURFER.Camera = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Camera",

        /**
         Indicates that only one instance of a Camera may be active within
         its {{#crossLink "Viewer"}}{{/crossLink}} at a time. When a Camera is activated, that has
         a true value for this flag, then any other active Camera will be deactivated first.

         @property exclusive
         @type Boolean
         @final
         */
        exclusive: true,

        
        _init: function (cfg) {

            // The ViewerJS nodes that this Camera controls
            this._lookatNode = this.viewer.scene.getNode('theLookat');
            this._cameraNode = this.viewer.scene.getNode('theCamera');

            // Schedule update of view and projection transforms for next tick
            this._lookatNodeDirty = true;
            this._cameraNodeDirty = true;

            // Camera not at rest now
            this._rested = false;

            this._tickSub = null;


            // TODO: compute/orthogolalize 'up'

            this.eye = cfg.eye;
            this.look = cfg.look;
            this.up = cfg.up;
            this.aspect = cfg.aspect;
            this.fovy = cfg.fovy;
            this.near = cfg.near;
            this.far = cfg.far;
            this.screenPan = cfg.screenPan;

            this.active = cfg.active !== false;
        },

        /**
         * Rotate 'eye' about 'look', around the 'up' vector
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateEyeY: function (angle) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Rotate 'eye' vector about 'up' vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, this._up);
            eye2 = BIMSURFER.math.transformPoint3(mat, eye2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._eye = BIMSURFER.math.addVec3(eye2, this._look, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'eye' about 'look' around the X-axis
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateEyeX: function (angle) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Get orthogonal vector from 'eye' and 'up'
            var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(eye2, []), BIMSURFER.math.normalizeVec3(this._up, []));

            // Rotate 'eye' vector about orthogonal vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, left);
            eye2 = BIMSURFER.math.transformPoint3(mat, eye2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._eye = BIMSURFER.math.addVec3(eye2, this._look, []);

            // Rotate 'up' vector about orthogonal vector
            this._up = BIMSURFER.math.transformPoint3(mat, this._up, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'look' about 'eye', around the 'up' vector
         *
         * <p>Applies constraints added with {@link #addConstraint}.</p>
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateLookY: function (angle) {

            // Get 'look' -> 'eye' vector
            var look2 = BIMSURFER.math.subVec3(this._look, this._eye, []);

            // Rotate 'look' vector about 'up' vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, this._up);
            look2 = BIMSURFER.math.transformPoint3(mat, look2, []);

            // Set look position as 'look' plus 'eye' vector
            this._look = BIMSURFER.math.addVec3(look2, this._eye, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Rotate 'eye' about 'look' around the X-axis
         *
         * @param {Number} angle Angle of rotation in degrees
         */
        rotateLookX: function (angle) {

            // Get 'look' -> 'eye' vector
            var look2 = BIMSURFER.math.subVec3(this._look, this._eye, []);

            // Get orthogonal vector from 'eye' and 'up'
            var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(look2, []), BIMSURFER.math.normalizeVec3(this._up, []));

            // Rotate 'look' vector about orthogonal vector
            var mat = BIMSURFER.math.rotationMat4v(angle * 0.0174532925, left);
            look2 = BIMSURFER.math.transformPoint3(mat, look2, []);

            // Set eye position as 'look' plus 'eye' vector
            this._look = BIMSURFER.math.addVec3(look2, this._eye, []);

            // Rotate 'up' vector about orthogonal vector
            this._up = BIMSURFER.math.transformPoint3(mat, this._up, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Pans the camera along X and Y axis.
         * @param pan The pan vector
         */
        pan: function (pan) {

            // Get 'look' -> 'eye' vector
            var eye2 = BIMSURFER.math.subVec3(this._eye, this._look, []);

            // Building this pan vector
            var vec = [0, 0, 0];
            var v;

            if (pan[0] !== 0) {

                // Pan along orthogonal vector to 'look' and 'up'

                var left = BIMSURFER.math.cross3Vec3(BIMSURFER.math.normalizeVec3(eye2, []), BIMSURFER.math.normalizeVec3(this._up, []));

                v = BIMSURFER.math.mulVec3Scalar(left, pan[0]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            if (pan[1] !== 0) {

                // Pan along 'up' vector

                v = BIMSURFER.math.mulVec3Scalar(BIMSURFER.math.normalizeVec3(this._up, []), pan[1]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            if (pan[3] !== 0) {

                // Pan along 'eye'- -> 'look' vector

                v = BIMSURFER.math.mulVec3Scalar(BIMSURFER.math.normalizeVec3(eye2, []), pan[2]);

                vec[0] += v[0];
                vec[1] += v[1];
                vec[2] += v[2];
            }

            this._eye = BIMSURFER.math.addVec3(this._eye, vec, []);
            this._look = BIMSURFER.math.addVec3(this._look, vec, []);

            this._lookatNodeDirty = true;
        },

        /**
         * Increments/decrements zoom factor, ie. distance between eye and look.
         * @param delta
         */
        zoom: function (delta) {

            var vec = BIMSURFER.math.subVec3(this._eye, this._look, []); // Get vector from eye to look
            var lenLook = Math.abs(BIMSURFER.math.lenVec3(vec, []));    // Get len of that vector
            var newLenLook = Math.abs(lenLook + delta);         // Get new len after zoom

            var dir = BIMSURFER.math.normalizeVec3(vec, []);  // Get normalised vector
            this._eye = BIMSURFER.math.addVec3(this._look, BIMSURFER.math.mulVec3Scalar(dir, newLenLook), []);

            this._lookatNodeDirty = true;
        },

        _props: {

            /**
             * Flag which indicates whether this Camera is active or not.
             *
             * Fires an {{#crossLink "Camera/active:event"}}{{/crossLink}} event on change.
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

                        this._lookatNodeDirty = true;
                        this._cameraNodeDirty = true;

                        var self = this;

                        this._tickSub = this.viewer.on("tick",
                            function () {

                                if (self._lookatNodeDirty) {

                                    // View transform update scheduled for viewer graph

                                    self._lookatNode.setEye(BIMSURFER.math.vec3ArrayToObj(self._eye));
                                    self._lookatNode.setLook(BIMSURFER.math.vec3ArrayToObj(self._look));
                                    self._lookatNode.setUp(BIMSURFER.math.vec3ArrayToObj(self._up));

                                    // Camera not at rest now
                                    self._rested = false;

                                    // Viewer camera position now up to date
                                    self._lookatNodeDirty = false;

                                } else {

                                    // Else camera position now at rest

                                    if (!self._rested) {
                                        self._rested = true;
                                    }
                                }

                                if (self._cameraNodeDirty) {

                                    // Projection update scheduled for viewer graph

                                    // Update the viewer graph

                                    self._cameraNode.set({
                                        optics: {
                                            type: "perspective",
                                            fovy: self.fovy,
                                            near: self.near,
                                            far: self.far
                                        }
                                    });

                                    // Viewer projection now up to date
                                    self._cameraNodeDirty = false;
                                }
                            });

                    } else {

                        this.viewer.off(this._tickSub);
                    }

                    /**
                     * Fired whenever this Camera's {{#crossLink "Camera/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);
                },

                get: function () {
                    return this._active;
                }
            },

            aspect: {

                set: function (value) {
                    this._aspect = value || 1.0;
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._aspect;
                }
            },

            /**
             * Position of the eye.
             * Fires an {{#crossLink "Camera/eye:event"}}{{/crossLink}} event on change.
             * @property eye
             * @default [0,0,-10]
             * @type Array(Number)
             */
            eye: {

                set: function (value) {
                    if (!this._eye) {
                        this._eye = [0, 0, 0];
                    }
                    this._eye[0] = value ? value[0] : 0;
                    this._eye[1] = value ? value[1] : 1;
                    this._eye[2] = value ? value[2] : -10;

                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._eye;
                }
            },

            /**
             * Position of the point-of-interest.
             * Fires a {{#crossLink "Camera/look:event"}}{{/crossLink}} event on change.
             * @property look
             * @default [0,0,0]
             * @type Array(Number)
             */
            look: {

                set: function (value) {
                    if (!this._look) {
                        this._look = [0, 0, 0];
                    }
                    this._look[0] = value ? value[0] : 0;
                    this._look[1] = value ? value[1] : 0;
                    this._look[2] = value ? value[2] : 0;

                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._look;
                }
            },

            /**
             * Direction of the "up" vector.
             * Fires an {{#crossLink "Camera/up:event"}}{{/crossLink}} event on change.
             * @property up
             * @default [0,1,0]
             * @type Array(Number)
             */
            up: {

                set: function (value) {
                    if (!this._up) {
                        this._up = [0, 0, 0];
                    }
                    this._up[0] = value ? value[0] : 0;
                    this._up[1] = value ? value[1] : 1;
                    this._up[2] = value ? value[2] : 0;

                    this._lookatNodeDirty = true;
                },

                get: function () {
                    return this._up;
                }
            },

            /**
             * Field-of-view angle on Y-axis.
             * Fires an {{#crossLink "Camera/fovy:event"}}{{/crossLink}} event on change.
             * @property up
             * @default 60
             * @type Number
             */
            fovy: {

                set: function (value) {
                    this._fovy = value || 60;
                    this._cameraNodeDirty = true;

                    /**
                     * Fired whenever this Camera's {{#crossLink "Camera/fovy:property"}}{{/crossLink}} property changes.
                     * @event fovy
                     * @param value The property's new value
                     */
                    this.fire('fovy', this._fovy);
                },

                get: function () {
                    return this._fovy;
                }
            },

            /**
             * Distance to near clip plane in normalized device coordinates [0..1].
             * Fires an {{#crossLink "Camera/near:event"}}{{/crossLink}} event on change.
             * @property near
             * @default 0.1
             * @type Number
             */
            near: {

                set: function (value) {
                    this._near = value || 0.1;
                    this._cameraNodeDirty = true;

                    /**
                     * Fired whenever this Camera's {{#crossLink "Camera/near:property"}}{{/crossLink}} property changes.
                     * @event near
                     * @param value The property's new value
                     */
                    this.fire('near', this._near);
                },

                get: function () {
                    return this._near;
                }
            },

            /**
             * Distance to far clip plane in normalized device coordinates [0..1].
             * Fires an {{#crossLink "Camera/far:event"}}{{/crossLink}} event on change.
             * @property far
             * @default 10000
             * @type Number
             */
            far: {

                set: function (value) {
                    this._far = value || 10000;
                    this._cameraNodeDirty = true;
                },

                get: function () {

                    /**
                     * Fired whenever this Camera's {{#crossLink "Camera/far:property"}}{{/crossLink}} property changes.
                     * @event far
                     * @param value The property's new value
                     */
                    return this._far;
                }
            },


            screenPan: {

                set: function (value) {
                    this._screenPan = value || [0, 0];
                    this._cameraNodeDirty = true;
                },

                get: function () {
                    return this._screenPan;
                }
            }
        },

        _destroy: function () {
            this.active = false;
        }

    });

})();;/**
 * Light source objects.
 *
 * @module BIMSURFER
 * @submodule lighting
 */;/**

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
;/**

 An **AmbientLight** is a {{#crossLink "Light"}}{{/crossLink}} that defines an ambient light source of fixed intensity and color that affects all attached {{#crossLink "Object"}}Objects{{/crossLink}}
 equally.

 ## Overview

 <ul>

 <li>You only need one AmbientLight in your {{#crossLink "Viewer"}}{{/crossLink}}.</li>
 <li>Normally you would combine AmbientLights with {{#crossLink "DirLight"}}DirLights{{/crossLink}} and/or
 {{#crossLink "PointLight"}}PointLights{{/crossLink}}.</li>

 </ul>

 ## Example

 In the example below we're illuminating a {{#crossLink "TeapotObject"}}{{/crossLink}} with a single AmbientLight.

 <iframe style="width: 600px; height: 400px" src="../../examples/light_AmbientLight.html"></iframe>

 ```` javascript
// Create a Viewer
var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

// Create a Camera
var camera = new BIMSURFER.Camera(viewer, {
    eye: [5, 5, -5]
});

// Create a camera orbit control
var control = new BIMSURFER.CameraControl(viewer, {
     camera: camera
});

// Create a TeapotObject
var teapot = new BIMSURFER.TeapotObject(viewer);

// Create an AmbientLight
var ambientLight = new BIMSURFER.AmbientLight(viewer, {
     color: [0.4, 0.4, 0.4]
});

 ````

 @class AmbientLight
 @module BIMSURFER
 @submodule lighting
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, creates this AmbientLight within the
 default {{#crossLink "Viewer"}}Viewer{{/crossLink}} when omitted
 @param [cfg] {*} AmbientLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this AmbientLight.
 @param [cfg.ambient=[0.7, 0.7, 0.8]] {Array(Number)} The color of this AmbientLight.
 @extends Light
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
            }
        }
    });

})();
;/**
 A **PointLight** is a {{#crossLink "Light"}}{{/crossLink}} that defines a positional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>PointLights have a position, but no direction.</li>

 <li>PointLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>PointLights have {{#crossLink "PointLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "PointLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "PointLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>

 </ul>


 ## Example

 In the example below we're illuminating a {{#crossLink "TeapotObject"}}{{/crossLink}} with a single PointLight.

 <iframe style="width: 600px; height: 400px" src="../../examples/light_PointLight.html"></iframe>

 ```` javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [5, 5, -5]
 });

 // Create a camera orbit control
 var control = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a TeapotObject
 var teapot = new BIMSURFER.TeapotObject(viewer);

 // Create a PointLight
 var pointLight = new BIMSURFER.PointLight(viewer, {
        color: [0.9, 0.9, 0.9],
        pos: [-10.0, 10.0, 10.0],
        constantAttenuation: 0.0,
        linearAttenuation: 0.0,
        quadraticAttenuation: 0.0,
        space: "view"
    });

 ````

 @class PointLight
 @module BIMSURFER
 @submodule lighting
 @constructor
 @extends Light
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The PointLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this PointLight.
 @param [cfg.pos=[ 1.0, 1.0, 1.0 ]] {Array(Number)} Position, in either World or View space, depending on the value of the **space** parameter.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this PointLight.
 @param [cfg.constantAttenuation=0] {Number} Constant attenuation factor.
 @param [cfg.linearAttenuation=0] {Number} Linear attenuation factor.
 @param [cfg.quadraticAttenuation=0] {Number} Quadratic attenuation factor.
 @param [cfg.space="view"] {String} The coordinate system this PointLight is defined in - "view" or "space".
 */
(function () {

    "use strict";

    BIMSURFER.PointLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.PointLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({
                mode: "point" }, cfg));

            this.pos = cfg.pos;
            this.color = cfg.color;
            this.constantAttenuation = cfg.constantAttenuation;
            this.linearAttenuation = cfg.linearAttenuation;
            this.quadraticAttenuation = cfg.quadraticAttenuation;
            this.space = cfg.space;
        },

        _props: {

            /**
             The position of this PointLight.

             This will be either World- or View-space, depending on the value of {{#crossLink "PointLight/space:property"}}{{/crossLink}}.

             @property pos
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            pos: {

                set: function (value) {
                    this._pos = value;
                    this._update({
                        pos: { x: value[0], y: value[1], z: value[2] }
                    });
                },

                get: function () {
                    return this._pos;
                }
            },

            /**
             The color of this PointLight.

             @property color
             @default [0.7, 0.7, 0.8]
             @type Array(Number)
             */
            color: {

                set: function (value) {
                    this._color = value;
                    this._update({
                        color: { r: value[0], g: value[1], b: value[2] },
                        specularColor: { r: value[0], g: value[1], b: value[2] }
                    });
                },

                get: function () {
                    return this._color;
                }
            },

            /**
             The constant attenuation factor for this PointLight.

             @property constantAttenuation
             @default 0
             @type Number
             */
            constantAttenuation: {

                set: function (value) {
                    this._update({
                        constantAttenuation: this._constantAttenuation = value
                    });
                },

                get: function () {
                    return this._constantAttenuation;
                }
            },

            /**
             The linear attenuation factor for this PointLight.

             @property linearAttenuation
             @default 0
             @type Number
             */
            linearAttenuation: {

                set: function (value) {
                    this._update({
                        linearAttenuation: this._linearAttenuation = value
                    });
                },

                get: function () {
                    return this._linearAttenuation;
                }
            },

            /**
             The quadratic attenuation factor for this Pointlight.

             @property quadraticAttenuation
             @default 0
             @type Number
             */
            quadraticAttenuation: {

                set: function (value) {
                    this._update({
                        quadraticAttenuation: this._quadraticAttenuation = value
                    });
                },

                get: function () {
                    return this._quadraticAttenuation;
                }
            },

            /**
             Indicates which coordinate space this PointLight is in.

             Supported values are:

             <ul>
             <li>"view" - View space, aligned within the view volume as if fixed to the viewer's head</li>
             <li>"world" - World space, fixed within the world, moving within the view volume with respect to camera</li>
             </ul>

             @property space
             @default "view"
             @type String
             */
            space: {

                set: function (value) {
                    this._update({
                        space: this._space = value
                    });
                },

                get: function () {
                    return this._space;
                }
            }
        }
    });

})();
;/**
 A **DirLight** is a {{#crossLink "Light"}}{{/crossLink}} that defines a directional light source that originates from a single point and spreads outward in all directions.

 ## Overview

 <ul>

 <li>DirLights have a position, but no direction.</li>

 <li>DirLights may be defined in either **World** or **View** coordinate space. When in World-space, their position
 is relative to the World coordinate system, and will appear to move as the {{#crossLink "Camera"}}{{/crossLink}} moves.
 When in View-space, their position is relative to the View coordinate system, and will behave as if fixed to the viewer's
 head as the {{#crossLink "Camera"}}{{/crossLink}} moves.</li>

 <li>Within bIMSurfer's's Phong lighting calculations, DirLight {{#crossLink "DirLight/diffuse:property"}}{{/crossLink}} and
 {{#crossLink "DirLight/specular:property"}}{{/crossLink}}.</li>

 <li>DirLights have {{#crossLink "DirLight/constantAttenuation:property"}}{{/crossLink}}, {{#crossLink "DirLight/linearAttenuation:property"}}{{/crossLink}} and
 {{#crossLink "DirLight/quadraticAttenuation:property"}}{{/crossLink}} factors, which indicate how their intensity attenuates over distance.</li>


 </ul>


 ## Example

 In the example below we're illuminating a {{#crossLink "TeapotObject"}}{{/crossLink}} with a single DirLight.

 <iframe style="width: 600px; height: 400px" src="../../examples/light_DirLight.html"></iframe>

 ```` javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
      eye: [5, 5, -5]
 });

 // Create a camera orbit control
 var control = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create a TeapotObject
 var teapot = new BIMSURFER.TeapotObject(viewer);

 // Create a DirLight
 var dirLight = new BIMSURFER.DirLight(viewer, {
        color: [0.9, 0.9, 0.9],
        dir: [1.0, 0.0, -.5],
        space: "view"
    });
 ````

 @class DirLight
 @module BIMSURFER
 @submodule lighting
 @constructor
 @extends Light
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} The DirLight configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DirLight.
 @param [cfg.dir=[ 1.0, 1.0, 1.0 ]] {Array(Number)} Direction, in either World or View space, depending on the value of the **space** parameter.
 @param [cfg.color=[0.7, 0.7, 0.8 ]] {Array(Number)} Diffuse color of this DirLight.
 @param [cfg.space="view"] {String} The coordinate system this DirLight is defined in - "view" or "space".
 */
(function () {

    "use strict";

    BIMSURFER.DirLight = BIMSURFER.Light.extend({

        className: "BIMSURFER.DirLight",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({ mode: "dir" }, cfg));

            this.dir = cfg.dir;
            this.color = cfg.color;
            this.space = cfg.space;
        },

        _props: {

            /**
             The direction of this DirLight.

             This will be either World- or View-space, depending on the value of {{#crossLink "DirLight/space:property"}}{{/crossLink}}.

             @property dir
             @default [1.0, 1.0, 1.0]
             @type Array(Number)
             */
            dir: {

                set: function (value) {
                    this._dir = value;
                    this._update({
                        dir: { x: value[0], y: value[1], z: value[2] }
                    });
                },

                get: function () {
                    return this._dir;
                }
            },

            /**
             The color of this DirLight.

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

            /**
             Indicates which coordinate space this DirLight is in.

             Supported values are:

             <ul>
             <li>"view" - View space, aligned within the view volume as if fixed to the viewer's head</li>
             <li>"world" - World space, fixed within the world, moving within the view volume with respect to camera</li>
             </ul>

             @property space
             @default "view"
             @type String
             */
            space: {

                set: function (value) {
                    this._update({
                        space: this._space = value
                    });
                },

                get: function () {
                    return this._space;
                }
            }
        }
    });

})();
;/**
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

 // Initiate a download of a bunch of objects

 var download = new BIMSURFER.Download(viewer, {
    downloadType: "oids",
    models: [myModel],
    roid: ["xyz","xyz2"],
    oids: ["xyz","xyz2"],
    schema: "xyz"
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

    //...

 });

 // Subscribe to errors
 download.on("error", function(e) {
 
    // Error message
    var message = e;

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
;/**
 * Geometry components.
 *
 * @module BIMSURFER
 * @submodule geometry
 */;/**
 TODO

 ## Overview

 TODO

 ## Example

 #### Creating a triangle mesh Geometry

 <iframe style="width: 600px; height: 400px" src="../../examples/geometry_Geometry.html">Run this example</iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a triangle mesh Geometry

 var geometry = new BIMSURFER.Geometry(viewer, {

    primitive: "triangles",

    positions: [
        5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, 5, // v0-v1-v2-v3 front
        5, 5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, // v0-v3-v4-v5 right
        5, 5, 5, 5, 5, -5, -5, 5, -5, -5, 5, 5, // v0-v5-v6-v1 top
        -5, 5, 5, -5, 5, -5, -5, -5, -5, -5, -5, 5, // v1-v6-v7-v2 left
        -5, -5, -5, 5, -5, -5, 5, -5, 5, -5, -5, 5, // v7-v4-v3-v2 bottom
        5, -5, -5, -5, -5, -5, -5, 5, -5, 5, 5, -5 // v4-v7-v6-v5 back
    ],

    normals: [
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
       -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 // v4-v7-v6-v5 back
    ],

    indices: [
        0, 1, 2, 0, 2, 3, // back
        4, 5, 6, 4, 6, 7,  // front
        8, 9, 10, 8, 10, 11, // right
        12, 13, 14, 12, 14, 15, // top
        16, 17, 18, 16, 18, 19, // left
        20, 21, 22, 20, 22, 23 // bottom
    ]
 });

 // Create an Object that uses our Geometry
 // Note that an Object can have multiple Geometries

 new BIMSURFER.BoxObject(viewer, {
    id: "foo",
    type: "IfcWall",
    geometries: [ geometry ]
 });

 ````

 @class Geometry
 @module BIMSURFER
 @submodule geometry
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxGeometry.
 @param [cfg.primitive="triangles"] {String} The primitive type. Accepted values are 'points', 'lines', 'line-loop', 'line-strip', 'triangles', 'triangle-strip' and 'triangle-fan'.
 @param [cfg.positions] {Array of Number} Positions array.
 @param [cfg.normals] {Array of Number} Normals array.
 @param [cfg.uv] {Array of Number} UVs array.
 @param [cfg.uv2] {Array of Number} Second UVs array, for a second UV level.
 @param [cfg.colors] {Array of Number} Vertex colors.
 @param [cfg.indices] {Array of Number} Indices array.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Geometry = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Geometry",

        _init: function (cfg) {

            var libraryNode = this.viewer.scene.getNode("library");

            if (cfg.positions && cfg.indices) {

                this._geometryNode = libraryNode.addNode({
                    type: "geometry",
                    primitive: cfg.primitive || "triangles",
                    positions: cfg.positions,
                    normals: cfg.normals,
                    uv: cfg.uv,
                    indices: cfg.indices
                });
            } else {

                // Default box geometry

                this._geometryNode = libraryNode.addNode({

                    type: "geometry",

                    primitive: "triangles",

                    positions: [
                        5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, 5, // v0-v1-v2-v3 front
                        5, 5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, // v0-v3-v4-v5 right
                        5, 5, 5, 5, 5, -5, -5, 5, -5, -5, 5, 5, // v0-v5-v6-v1 top
                        -5, 5, 5, -5, 5, -5, -5, -5, -5, -5, -5, 5, // v1-v6-v7-v2 left
                        -5, -5, -5, 5, -5, -5, 5, -5, 5, -5, -5, 5, // v7-v4-v3-v2 bottom
                        5, -5, -5, -5, -5, -5, -5, 5, -5, 5, 5, -5 // v4-v7-v6-v5 back
                    ],

                    normals: [
                        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 // v4-v7-v6-v5 back
                    ],

                    uv: [
                        5, 5, 0, 5, 0, 0, 5, 0, // v0-v1-v2-v3 front
                        0, 5, 0, 0, 5, 0, 5, 5, // v0-v3-v4-v5 right
                        5, 0, 5, 5, 0, 5, 0, 0, // v0-v5-v6-v1 top
                        5, 5, 0, 5, 0, 0, 5, 0, // v1-v6-v7-v2 left
                        0, 0, 5, 0, 5, 5, 0, 5, // v7-v4-v3-v2 bottom
                        0, 0, 5, 0, 5, 5, 0, 5 // v4-v7-v6-v5 back
                    ],

                    indices: [
                        0, 1, 2, 0, 2, 3, // back
                        4, 5, 6, 4, 6, 7,  // front
                        8, 9, 10, 8, 10, 11, // right
                        12, 13, 14, 12, 14, 15, // top
                        16, 17, 18, 16, 18, 19, // left
                        20, 21, 22, 20, 22, 23 // bottom

                    ]
                });
            }

            this.coreId = this._geometryNode.getCoreId();

            this.boundary = this._geometryNode.getBoundary();
        },

        _destroy: function () {
            this._geometryNode.destroy();
        }
    });

})();;/**
 An **BoxGeometry** is a box-shaped {{#crossLink "Geometry"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/geometry_BoxGeometry.html"></iframe>

 ````javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a BoxGeometry
 var boxGeometry = new BIMSURFER.BoxGeometry(viewer);

 // Create an Object that uses our BoxGeometry
 // Note that an Object can have multiple Geometries

 new BIMSURFER.Object(viewer, {
    id: "foo",
    type: "IfcWall",
    geometries: [ boxGeometry ]
 });
````

 @class BoxGeometry
 @module BIMSURFER
 @submodule geometry
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxGeometry.
 @extends Geometry
 */
(function () {

    "use strict";

    BIMSURFER.BoxGeometry = BIMSURFER.Geometry.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.BoxGeometry",

        _init: function (cfg) {

            this._super(BIMSURFER._apply({

                    primitive: "triangles",

                    positions: [
                        5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, 5, // v0-v1-v2-v3 front
                        5, 5, 5, 5, -5, 5, 5, -5, -5, 5, 5, -5, // v0-v3-v4-v5 right
                        5, 5, 5, 5, 5, -5, -5, 5, -5, -5, 5, 5, // v0-v5-v6-v1 top
                        -5, 5, 5, -5, 5, -5, -5, -5, -5, -5, -5, 5, // v1-v6-v7-v2 left
                        -5, -5, -5, 5, -5, -5, 5, -5, 5, -5, -5, 5, // v7-v4-v3-v2 bottom
                        5, -5, -5, -5, -5, -5, -5, 5, -5, 5, 5, -5 // v4-v7-v6-v5 back
                    ],

                    normals: [
                        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
                        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
                        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
                        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
                        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
                        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 // v4-v7-v6-v5 back
                    ],

                    uv: [
                        5, 5, 0, 5, 0, 0, 5, 0, // v0-v1-v2-v3 front
                        0, 5, 0, 0, 5, 0, 5, 5, // v0-v3-v4-v5 right
                        5, 0, 5, 5, 0, 5, 0, 0, // v0-v5-v6-v1 top
                        5, 5, 0, 5, 0, 0, 5, 0, // v1-v6-v7-v2 left
                        0, 0, 5, 0, 5, 5, 0, 5, // v7-v4-v3-v2 bottom
                        0, 0, 5, 0, 5, 5, 0, 5 // v4-v7-v6-v5 back
                    ],

                    indices: [
                        0, 1, 2, 0, 2, 3, // back
                        4, 5, 6, 4, 6, 7,  // front
                        8, 9, 10, 8, 10, 11, // right
                        12, 13, 14, 12, 14, 15, // top
                        16, 17, 18, 16, 18, 19, // left
                        20, 21, 22, 20, 22, 23 // bottom

                    ]
                },

                cfg));
        }
    });
})();;/**
 An **TeapotGeometry** is a teapot-shaped {{#crossLink "Geometry"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 <iframe style="width: 600px; height: 400px" src="../../examples/geometry_TeapotGeometry.html"></iframe>

 ````javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a TeapotGeometry
 var teapotGeometry = new BIMSURFER.TeapotGeometry(viewer);

 // Create an Object that uses our TeapotGeometry
 // Note that an Object can have multiple Geometries

 new BIMSURFER.Object(viewer, {
    id: "foo",
    type: "IfcWall",
    geometries: [ teapotGeometry ]
 });
 ````


 @class TeapotGeometry
 @module BIMSURFER
 @submodule geometry
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this BoxGeometry.
 @extends Geometry
 */
(function () {

    "use strict";

    BIMSURFER.TeapotGeometry = BIMSURFER.Geometry.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.TeapotGeometry",

        _init: function (cfg) {
            this._super(BIMSURFER._apply(this._build(cfg), cfg));
        },

        _build: function (params) {

            params = params || {};

            var coreId = "geometry/teapot_" + (params.wire ? "wire" : "_solid");

            // If a node core already exists for a prim with the given properties,
            // then for efficiency we'll share that core rather than create another geometry
            if (this.viewer.scene.hasCore("geometry", coreId)) {
                return {
                    type: "geometry",
                    coreId: coreId
                };
            }

            // Otherwise, create a new geometry

            var positions = [
                [-3.000000, 1.650000, 0.000000],
                [-2.987110, 1.650000, -0.098438],
                [-2.987110, 1.650000, 0.098438],
                [-2.985380, 1.567320, -0.049219],
                [-2.985380, 1.567320, 0.049219],
                [-2.983500, 1.483080, 0.000000],
                [-2.981890, 1.723470, -0.049219],
                [-2.981890, 1.723470, 0.049219],
                [-2.976560, 1.798530, 0.000000],
                [-2.970900, 1.486210, -0.098438],
                [-2.970900, 1.486210, 0.098438],
                [-2.963880, 1.795340, -0.098438],
                [-2.963880, 1.795340, 0.098438],
                [-2.962210, 1.570170, -0.133594],
                [-2.962210, 1.570170, 0.133594],
                [-2.958640, 1.720570, -0.133594],
                [-2.958640, 1.720570, 0.133594],
                [-2.953130, 1.650000, -0.168750],
                [-2.953130, 1.650000, 0.168750],
                [-2.952470, 1.403740, -0.049219],
                [-2.952470, 1.403740, 0.049219],
                [-2.937700, 1.494470, -0.168750],
                [-2.937700, 1.494470, 0.168750],
                [-2.935230, 1.852150, -0.049219],
                [-2.935230, 1.852150, 0.049219],
                [-2.933590, 1.320120, 0.000000],
                [-2.930450, 1.786930, -0.168750],
                [-2.930450, 1.786930, 0.168750],
                [-2.930370, 1.411500, -0.133594],
                [-2.930370, 1.411500, 0.133594],
                [-2.921880, 1.325530, -0.098438],
                [-2.921880, 1.325530, 0.098438],
                [-2.912780, 1.844170, -0.133594],
                [-2.912780, 1.844170, 0.133594],
                [-2.906250, 1.910160, 0.000000],
                [-2.894230, 1.904570, -0.098438],
                [-2.894230, 1.904570, 0.098438],
                [-2.891380, 1.579100, -0.196875],
                [-2.891380, 1.579100, 0.196875],
                [-2.890990, 1.339800, -0.168750],
                [-2.890990, 1.339800, 0.168750],
                [-2.890650, 1.712080, -0.196875],
                [-2.890650, 1.712080, 0.196875],
                [-2.883460, 1.245790, -0.048343],
                [-2.883460, 1.245790, 0.048343],
                [-2.863460, 1.257130, -0.132718],
                [-2.863460, 1.257130, 0.132718],
                [-2.862660, 1.434830, -0.196875],
                [-2.862660, 1.434830, 0.196875],
                [-2.862550, 1.889830, -0.168750],
                [-2.862550, 1.889830, 0.168750],
                [-2.850000, 1.650000, -0.225000],
                [-2.850000, 1.650000, 0.225000],
                [-2.849710, 1.161550, 0.000000],
                [-2.847100, 1.820820, -0.196875],
                [-2.847100, 1.820820, 0.196875],
                [-2.841940, 1.946920, -0.049219],
                [-2.841940, 1.946920, 0.049219],
                [-2.829000, 1.761400, -0.225000],
                [-2.829000, 1.761400, 0.225000],
                [-2.828670, 1.175980, -0.094933],
                [-2.828670, 1.175980, 0.094933],
                [-2.824700, 1.521940, -0.225000],
                [-2.824700, 1.521940, 0.225000],
                [-2.821150, 1.935200, -0.133594],
                [-2.821150, 1.935200, 0.133594],
                [-2.812310, 1.187190, -0.168750],
                [-2.812310, 1.187190, 0.168750],
                [-2.805010, 1.289970, -0.196875],
                [-2.805010, 1.289970, 0.196875],
                [-2.797270, 1.383110, -0.225000],
                [-2.797270, 1.383110, 0.225000],
                [-2.789060, 1.990140, 0.000000],
                [-2.788360, 1.699320, -0.196875],
                [-2.788360, 1.699320, 0.196875],
                [-2.778210, 1.982830, -0.098438],
                [-2.778210, 1.982830, 0.098438],
                [-2.774420, 1.527380, -0.196875],
                [-2.774420, 1.527380, 0.196875],
                [-2.773560, 1.098600, -0.084375],
                [-2.773560, 1.098600, 0.084375],
                [-2.766410, 1.845120, -0.225000],
                [-2.766410, 1.845120, 0.225000],
                [-2.760340, 1.900900, -0.196875],
                [-2.760340, 1.900900, 0.196875],
                [-2.749600, 1.963560, -0.168750],
                [-2.749600, 1.963560, 0.168750],
                [-2.748310, 1.785700, -0.196875],
                [-2.748310, 1.785700, 0.196875],
                [-2.746880, 1.650000, -0.168750],
                [-2.746880, 1.650000, 0.168750],
                [-2.731250, 1.007810, 0.000000],
                [-2.727560, 1.735870, -0.168750],
                [-2.727560, 1.735870, 0.168750],
                [-2.720360, 1.690830, -0.133594],
                [-2.720360, 1.690830, 0.133594],
                [-2.719480, 1.249770, -0.225000],
                [-2.719480, 1.249770, 0.225000],
                [-2.716780, 1.144680, -0.196875],
                [-2.716780, 1.144680, 0.196875],
                [-2.712890, 1.650000, -0.098438],
                [-2.712890, 1.650000, 0.098438],
                [-2.708990, 1.541770, -0.133594],
                [-2.708990, 1.541770, 0.133594],
                [-2.703540, 1.426410, -0.168750],
                [-2.703540, 1.426410, 0.168750],
                [-2.700980, 1.037840, -0.168750],
                [-2.700980, 1.037840, 0.168750],
                [-2.700000, 1.650000, 0.000000],
                [-2.699650, 2.010790, -0.048346],
                [-2.699650, 2.010790, 0.048346],
                [-2.697120, 1.687930, -0.049219],
                [-2.697120, 1.687930, 0.049219],
                [-2.694130, 1.727460, -0.098438],
                [-2.694130, 1.727460, 0.098438],
                [-2.686620, 1.546690, -0.049219],
                [-2.686620, 1.546690, 0.049219],
                [-2.682630, 1.762350, -0.133594],
                [-2.682630, 1.762350, 0.133594],
                [-2.681480, 1.996460, -0.132721],
                [-2.681480, 1.996460, 0.132721],
                [-2.681440, 1.724270, 0.000000],
                [-2.675740, 1.270850, -0.196875],
                [-2.675740, 1.270850, 0.196875],
                [-2.672650, 1.440680, -0.098438],
                [-2.672650, 1.440680, 0.098438],
                [-2.670260, 1.800400, -0.168750],
                [-2.670260, 1.800400, 0.168750],
                [-2.667800, 1.846230, -0.196875],
                [-2.667800, 1.846230, 0.196875],
                [-2.662790, 1.905100, -0.225000],
                [-2.662790, 1.905100, 0.225000],
                [-2.660940, 1.446090, 0.000000],
                [-2.660180, 1.754370, -0.049219],
                [-2.660180, 1.754370, 0.049219],
                [-2.638580, 1.785670, -0.098438],
                [-2.638580, 1.785670, 0.098438],
                [-2.634380, 1.103910, -0.225000],
                [-2.634380, 1.103910, 0.225000],
                [-2.630740, 1.956740, -0.196875],
                [-2.630740, 1.956740, 0.196875],
                [-2.626560, 1.780080, 0.000000],
                [-2.625000, 2.043750, 0.000000],
                [-2.624640, 1.305020, -0.132813],
                [-2.624640, 1.305020, 0.132813],
                [-2.606420, 1.317450, -0.048438],
                [-2.606420, 1.317450, 0.048438],
                [-2.606320, 2.026440, -0.094945],
                [-2.606320, 2.026440, 0.094945],
                [-2.591800, 2.012990, -0.168750],
                [-2.591800, 2.012990, 0.168750],
                [-2.571730, 1.834290, -0.168750],
                [-2.571730, 1.834290, 0.168750],
                [-2.567770, 1.169970, -0.168750],
                [-2.567770, 1.169970, 0.168750],
                [-2.554600, 1.183040, -0.095315],
                [-2.554600, 1.183040, 0.095315],
                [-2.549750, 1.890590, -0.196875],
                [-2.549750, 1.890590, 0.196875],
                [-2.549540, 0.878984, -0.084375],
                [-2.549540, 0.878984, 0.084375],
                [-2.546430, 1.831970, -0.132721],
                [-2.546430, 1.831970, 0.132721],
                [-2.537500, 1.200000, 0.000000],
                [-2.527210, 1.819200, -0.048346],
                [-2.527210, 1.819200, 0.048346],
                [-2.518750, 1.945310, -0.225000],
                [-2.518750, 1.945310, 0.225000],
                [-2.516830, 0.932671, -0.196875],
                [-2.516830, 0.932671, 0.196875],
                [-2.471840, 1.006490, -0.196875],
                [-2.471840, 1.006490, 0.196875],
                [-2.445700, 1.877640, -0.168750],
                [-2.445700, 1.877640, 0.168750],
                [-2.439130, 1.060180, -0.084375],
                [-2.439130, 1.060180, 0.084375],
                [-2.431180, 1.864180, -0.094945],
                [-2.431180, 1.864180, 0.094945],
                [-2.412500, 1.846870, 0.000000],
                [-2.388280, 0.716602, 0.000000],
                [-2.382250, 0.737663, -0.095854],
                [-2.382250, 0.737663, 0.095854],
                [-2.378840, 2.052020, -0.084375],
                [-2.378840, 2.052020, 0.084375],
                [-2.377660, 0.753680, -0.168750],
                [-2.377660, 0.753680, 0.168750],
                [-2.364750, 0.798761, -0.199836],
                [-2.364750, 0.798761, 0.199836],
                [-2.354300, 0.835254, -0.225000],
                [-2.354300, 0.835254, 0.225000],
                [-2.343840, 0.871747, -0.199836],
                [-2.343840, 0.871747, 0.199836],
                [-2.341150, 1.999720, -0.196875],
                [-2.341150, 1.999720, 0.196875],
                [-2.330930, 0.916827, -0.168750],
                [-2.330930, 0.916827, 0.168750],
                [-2.320310, 0.953906, 0.000000],
                [-2.289320, 1.927820, -0.196875],
                [-2.289320, 1.927820, 0.196875],
                [-2.251620, 1.875520, -0.084375],
                [-2.251620, 1.875520, 0.084375],
                [-2.247410, 0.882285, -0.084375],
                [-2.247410, 0.882285, 0.084375],
                [-2.173630, 0.844043, 0.000000],
                [-2.168530, 0.826951, -0.097184],
                [-2.168530, 0.826951, 0.097184],
                [-2.164770, 0.814364, -0.168750],
                [-2.164770, 0.814364, 0.168750],
                [-2.156880, 0.786694, -0.187068],
                [-2.156880, 0.786694, 0.187068],
                [-2.156250, 2.092970, 0.000000],
                [-2.154120, 0.740520, -0.215193],
                [-2.154120, 0.740520, 0.215193],
                [-2.150170, 0.694734, -0.215193],
                [-2.150170, 0.694734, 0.215193],
                [-2.147420, 0.648560, -0.187068],
                [-2.147420, 0.648560, 0.187068],
                [-2.144960, 0.612777, -0.132948],
                [-2.144960, 0.612777, 0.132948],
                [-2.143710, 0.591789, -0.048573],
                [-2.143710, 0.591789, 0.048573],
                [-2.142330, 2.058360, -0.168750],
                [-2.142330, 2.058360, 0.168750],
                [-2.111720, 1.982230, -0.225000],
                [-2.111720, 1.982230, 0.225000],
                [-2.084470, 0.789526, -0.048905],
                [-2.084470, 0.789526, 0.048905],
                [-2.081100, 1.906090, -0.168750],
                [-2.081100, 1.906090, 0.168750],
                [-2.078340, 0.770387, -0.133280],
                [-2.078340, 0.770387, 0.133280],
                [-2.067190, 1.871480, 0.000000],
                [-2.000000, 0.750000, 0.000000],
                [-1.995700, 0.737109, -0.098438],
                [-1.995700, 0.737109, 0.098438],
                [-1.984380, 0.703125, -0.168750],
                [-1.984380, 0.703125, 0.168750],
                [-1.978520, 0.591650, 0.000000],
                [-1.969370, 0.670825, -0.202656],
                [-1.969370, 0.670825, 0.202656],
                [-1.968360, 0.655078, -0.210938],
                [-1.968360, 0.655078, 0.210938],
                [-1.960000, 0.750000, -0.407500],
                [-1.960000, 0.750000, 0.407500],
                [-1.958730, 0.925195, -0.201561],
                [-1.958730, 0.925195, 0.201561],
                [-1.957030, 1.100390, 0.000000],
                [-1.950000, 0.600000, -0.225000],
                [-1.950000, 0.600000, 0.225000],
                [-1.938950, 0.591650, -0.403123],
                [-1.938950, 0.591650, 0.403123],
                [-1.931640, 0.544922, -0.210938],
                [-1.931640, 0.544922, 0.210938],
                [-1.930690, 0.522583, -0.198676],
                [-1.930690, 0.522583, 0.198676],
                [-1.921880, 0.453516, 0.000000],
                [-1.917890, 1.100390, -0.398745],
                [-1.917890, 1.100390, 0.398745],
                [-1.915620, 0.496875, -0.168750],
                [-1.915620, 0.496875, 0.168750],
                [-1.904300, 0.462891, -0.098438],
                [-1.904300, 0.462891, 0.098438],
                [-1.900000, 0.450000, 0.000000],
                [-1.892280, 0.670825, -0.593047],
                [-1.892280, 0.670825, 0.593047],
                [-1.883440, 0.453516, -0.391582],
                [-1.883440, 0.453516, 0.391582],
                [-1.882060, 0.925195, -0.589845],
                [-1.882060, 0.925195, 0.589845],
                [-1.881390, 1.286130, -0.193602],
                [-1.881390, 1.286130, 0.193602],
                [-1.855120, 0.522583, -0.581402],
                [-1.855120, 0.522583, 0.581402],
                [-1.845000, 0.750000, -0.785000],
                [-1.845000, 0.750000, 0.785000],
                [-1.843750, 1.471870, 0.000000],
                [-1.833170, 1.890680, -0.084375],
                [-1.833170, 1.890680, 0.084375],
                [-1.831800, 1.946490, -0.196875],
                [-1.831800, 1.946490, 0.196875],
                [-1.829920, 2.023230, -0.196875],
                [-1.829920, 2.023230, 0.196875],
                [-1.828550, 2.079040, -0.084375],
                [-1.828550, 2.079040, 0.084375],
                [-1.825180, 0.591650, -0.776567],
                [-1.825180, 0.591650, 0.776567],
                [-1.817580, 0.343945, -0.187036],
                [-1.817580, 0.343945, 0.187036],
                [-1.807750, 1.286130, -0.566554],
                [-1.807750, 1.286130, 0.566554],
                [-1.806870, 1.471870, -0.375664],
                [-1.806870, 1.471870, 0.375664],
                [-1.805360, 1.100390, -0.768135],
                [-1.805360, 1.100390, 0.768135],
                [-1.772930, 0.453516, -0.754336],
                [-1.772930, 0.453516, 0.754336],
                [-1.750000, 0.234375, 0.000000],
                [-1.746440, 0.343945, -0.547339],
                [-1.746440, 0.343945, 0.547339],
                [-1.744330, 0.670825, -0.949871],
                [-1.744330, 0.670825, 0.949871],
                [-1.734910, 0.925195, -0.944741],
                [-1.734910, 0.925195, 0.944741],
                [-1.715000, 0.234375, -0.356563],
                [-1.715000, 0.234375, 0.356562],
                [-1.710080, 0.522583, -0.931218],
                [-1.710080, 0.522583, 0.931218],
                [-1.700860, 1.471870, -0.723672],
                [-1.700860, 1.471870, 0.723672],
                [-1.666400, 1.286130, -0.907437],
                [-1.666400, 1.286130, 0.907437],
                [-1.662500, 0.750000, -1.125000],
                [-1.662500, 0.750000, 1.125000],
                [-1.655160, 1.860940, -0.170322],
                [-1.655160, 1.860940, 0.170322],
                [-1.647420, 0.159961, -0.169526],
                [-1.647420, 0.159961, 0.169526],
                [-1.644640, 0.591650, -1.112920],
                [-1.644640, 0.591650, 1.112920],
                [-1.626780, 1.100390, -1.100830],
                [-1.626780, 1.100390, 1.100830],
                [-1.614370, 0.234375, -0.686875],
                [-1.614370, 0.234375, 0.686875],
                [-1.609890, 0.343945, -0.876660],
                [-1.609890, 0.343945, 0.876660],
                [-1.600000, 1.875000, 0.000000],
                [-1.597560, 0.453516, -1.081060],
                [-1.597560, 0.453516, 1.081060],
                [-1.590370, 1.860940, -0.498428],
                [-1.590370, 1.860940, 0.498428],
                [-1.584380, 1.910160, -0.168750],
                [-1.584380, 1.910160, 0.168750],
                [-1.582940, 0.159961, -0.496099],
                [-1.582940, 0.159961, 0.496099],
                [-1.578130, 0.085547, 0.000000],
                [-1.550000, 1.987500, -0.225000],
                [-1.550000, 1.987500, 0.225000],
                [-1.546560, 0.085547, -0.321543],
                [-1.546560, 0.085547, 0.321543],
                [-1.532970, 0.670825, -1.265670],
                [-1.532970, 0.670825, 1.265670],
                [-1.532620, 1.471870, -1.037110],
                [-1.532620, 1.471870, 1.037110],
                [-1.524690, 0.925195, -1.258830],
                [-1.524690, 0.925195, 1.258830],
                [-1.523670, 0.042773, -0.156792],
                [-1.523670, 0.042773, 0.156792],
                [-1.515630, 2.064840, -0.168750],
                [-1.515630, 2.064840, 0.168750],
                [-1.502870, 0.522583, -1.240810],
                [-1.502870, 0.522583, 1.240810],
                [-1.500000, 0.000000, 0.000000],
                [-1.500000, 2.100000, 0.000000],
                [-1.500000, 2.250000, 0.000000],
                [-1.470000, 0.000000, -0.305625],
                [-1.470000, 0.000000, 0.305625],
                [-1.470000, 2.250000, -0.305625],
                [-1.470000, 2.250000, 0.305625],
                [-1.466020, 1.860940, -0.798320],
                [-1.466020, 1.860940, 0.798320],
                [-1.464490, 1.286130, -1.209120],
                [-1.464490, 1.286130, 1.209120],
                [-1.464030, 0.042773, -0.458833],
                [-1.464030, 0.042773, 0.458833],
                [-1.459860, 2.286910, -0.150226],
                [-1.459860, 2.286910, 0.150226],
                [-1.459170, 0.159961, -0.794590],
                [-1.459170, 0.159961, 0.794590],
                [-1.455820, 0.085547, -0.619414],
                [-1.455820, 0.085547, 0.619414],
                [-1.454690, 0.234375, -0.984375],
                [-1.454690, 0.234375, 0.984375],
                [-1.449220, 2.323830, 0.000000],
                [-1.420230, 2.323830, -0.295278],
                [-1.420230, 2.323830, 0.295278],
                [-1.420000, 0.750000, -1.420000],
                [-1.420000, 0.750000, 1.420000],
                [-1.414820, 0.343945, -1.168120],
                [-1.414820, 0.343945, 1.168120],
                [-1.411910, 2.336130, -0.145291],
                [-1.411910, 2.336130, 0.145291],
                [-1.404750, 0.591650, -1.404750],
                [-1.404750, 0.591650, 1.404750],
                [-1.403130, 2.348440, 0.000000],
                [-1.402720, 2.286910, -0.439618],
                [-1.402720, 2.286910, 0.439618],
                [-1.400000, 2.250000, 0.000000],
                [-1.389490, 1.100390, -1.389490],
                [-1.389490, 1.100390, 1.389490],
                [-1.383750, 0.000000, -0.588750],
                [-1.383750, 0.000000, 0.588750],
                [-1.383750, 2.250000, -0.588750],
                [-1.383750, 2.250000, 0.588750],
                [-1.380470, 2.323830, 0.000000],
                [-1.377880, 2.336130, -0.141789],
                [-1.377880, 2.336130, 0.141789],
                [-1.376330, 2.286910, -0.141630],
                [-1.376330, 2.286910, 0.141630],
                [-1.375060, 2.348440, -0.285887],
                [-1.375060, 2.348440, 0.285887],
                [-1.372000, 2.250000, -0.285250],
                [-1.372000, 2.250000, 0.285250],
                [-1.364530, 0.453516, -1.364530],
                [-1.364530, 0.453516, 1.364530],
                [-1.356650, 2.336130, -0.425177],
                [-1.356650, 2.336130, 0.425177],
                [-1.352860, 2.323830, -0.281271],
                [-1.352860, 2.323830, 0.281271],
                [-1.349570, 0.042773, -0.734902],
                [-1.349570, 0.042773, 0.734902],
                [-1.336900, 2.323830, -0.568818],
                [-1.336900, 2.323830, 0.568818],
                [-1.323950, 2.336130, -0.414929],
                [-1.323950, 2.336130, 0.414929],
                [-1.322460, 2.286910, -0.414464],
                [-1.322460, 2.286910, 0.414464],
                [-1.311820, 0.085547, -0.887695],
                [-1.311820, 0.085547, 0.887695],
                [-1.309060, 1.471870, -1.309060],
                [-1.309060, 1.471870, 1.309060],
                [-1.300000, 2.250000, 0.000000],
                [-1.294380, 2.348440, -0.550727],
                [-1.294380, 2.348440, 0.550727],
                [-1.293050, 2.286910, -0.704126],
                [-1.293050, 2.286910, 0.704126],
                [-1.291500, 2.250000, -0.549500],
                [-1.291500, 2.250000, 0.549500],
                [-1.288390, 1.860940, -1.063730],
                [-1.288390, 1.860940, 1.063730],
                [-1.282370, 0.159961, -1.058760],
                [-1.282370, 0.159961, 1.058760],
                [-1.274000, 2.250000, -0.264875],
                [-1.274000, 2.250000, 0.264875],
                [-1.273480, 2.323830, -0.541834],
                [-1.273480, 2.323830, 0.541834],
                [-1.267660, 2.274900, -0.130448],
                [-1.267660, 2.274900, 0.130448],
                [-1.265670, 0.670825, -1.532970],
                [-1.265670, 0.670825, 1.532970],
                [-1.260940, 2.299800, 0.000000],
                [-1.258830, 0.925195, -1.524690],
                [-1.258830, 0.925195, 1.524690],
                [-1.250570, 2.336130, -0.680997],
                [-1.250570, 2.336130, 0.680997],
                [-1.246880, 0.000000, -0.843750],
                [-1.246880, 0.000000, 0.843750],
                [-1.246880, 2.250000, -0.843750],
                [-1.246880, 2.250000, 0.843750],
                [-1.242500, 0.234375, -1.242500],
                [-1.242500, 0.234375, 1.242500],
                [-1.240810, 0.522583, -1.502870],
                [-1.240810, 0.522583, 1.502870],
                [-1.235720, 2.299800, -0.256916],
                [-1.235720, 2.299800, 0.256916],
                [-1.220430, 2.336130, -0.664583],
                [-1.220430, 2.336130, 0.664583],
                [-1.219060, 2.286910, -0.663837],
                [-1.219060, 2.286910, 0.663837],
                [-1.218050, 2.274900, -0.381740],
                [-1.218050, 2.274900, 0.381740],
                [-1.209120, 1.286130, -1.464490],
                [-1.209120, 1.286130, 1.464490],
                [-1.204660, 2.323830, -0.815186],
                [-1.204660, 2.323830, 0.815186],
                [-1.199250, 2.250000, -0.510250],
                [-1.199250, 2.250000, 0.510250],
                [-1.196510, 2.319430, -0.123125],
                [-1.196510, 2.319430, 0.123125],
                [-1.186040, 0.042773, -0.979229],
                [-1.186040, 0.042773, 0.979229],
                [-1.168120, 0.343945, -1.414820],
                [-1.168120, 0.343945, 1.414820],
                [-1.166350, 2.348440, -0.789258],
                [-1.166350, 2.348440, 0.789258],
                [-1.163750, 2.250000, -0.787500],
                [-1.163750, 2.250000, 0.787500],
                [-1.163220, 2.299800, -0.494918],
                [-1.163220, 2.299800, 0.494918],
                [-1.156250, 2.339060, 0.000000],
                [-1.149680, 2.319430, -0.360312],
                [-1.149680, 2.319430, 0.360312],
                [-1.147520, 2.323830, -0.776514],
                [-1.147520, 2.323830, 0.776514],
                [-1.136370, 2.286910, -0.938220],
                [-1.136370, 2.286910, 0.938220],
                [-1.133120, 2.339060, -0.235586],
                [-1.133120, 2.339060, 0.235586],
                [-1.125000, 0.750000, -1.662500],
                [-1.125000, 0.750000, 1.662500],
                [-1.122810, 2.274900, -0.611424],
                [-1.122810, 2.274900, 0.611424],
                [-1.120470, 0.085547, -1.120470],
                [-1.120470, 0.085547, 1.120470],
                [-1.112920, 0.591650, -1.644640],
                [-1.112920, 0.591650, 1.644640],
                [-1.100830, 1.100390, -1.626780],
                [-1.100830, 1.100390, 1.626780],
                [-1.099040, 2.336130, -0.907402],
                [-1.099040, 2.336130, 0.907402],
                [-1.081060, 0.453516, -1.597560],
                [-1.081060, 0.453516, 1.597560],
                [-1.080630, 2.250000, -0.731250],
                [-1.080630, 2.250000, 0.731250],
                [-1.072550, 2.336130, -0.885531],
                [-1.072550, 2.336130, 0.885531],
                [-1.071350, 2.286910, -0.884537],
                [-1.071350, 2.286910, 0.884537],
                [-1.066640, 2.339060, -0.453828],
                [-1.066640, 2.339060, 0.453828],
                [-1.065000, 0.000000, -1.065000],
                [-1.065000, 0.000000, 1.065000],
                [-1.065000, 2.250000, -1.065000],
                [-1.065000, 2.250000, 1.065000],
                [-1.063730, 1.860940, -1.288390],
                [-1.063730, 1.860940, 1.288390],
                [-1.059790, 2.319430, -0.577104],
                [-1.059790, 2.319430, 0.577104],
                [-1.058760, 0.159961, -1.282370],
                [-1.058760, 0.159961, 1.282370],
                [-1.048150, 2.299800, -0.709277],
                [-1.048150, 2.299800, 0.709277],
                [-1.037110, 1.471870, -1.532620],
                [-1.037110, 1.471870, 1.532620],
                [-1.028940, 2.323830, -1.028940],
                [-1.028940, 2.323830, 1.028940],
                [-0.996219, 2.348440, -0.996219],
                [-0.996219, 2.348440, 0.996219],
                [-0.994000, 2.250000, -0.994000],
                [-0.994000, 2.250000, 0.994000],
                [-0.986761, 2.274900, -0.814698],
                [-0.986761, 2.274900, 0.814698],
                [-0.984375, 0.234375, -1.454690],
                [-0.984375, 0.234375, 1.454690],
                [-0.980719, 2.369530, -0.100920],
                [-0.980719, 2.369530, 0.100920],
                [-0.980133, 2.323830, -0.980133],
                [-0.980133, 2.323830, 0.980133],
                [-0.979229, 0.042773, -1.186040],
                [-0.979229, 0.042773, 1.186040],
                [-0.961133, 2.339060, -0.650391],
                [-0.961133, 2.339060, 0.650391],
                [-0.949871, 0.670825, -1.744330],
                [-0.949871, 0.670825, 1.744330],
                [-0.944741, 0.925195, -1.734910],
                [-0.944741, 0.925195, 1.734910],
                [-0.942332, 2.369530, -0.295330],
                [-0.942332, 2.369530, 0.295330],
                [-0.938220, 2.286910, -1.136370],
                [-0.938220, 2.286910, 1.136370],
                [-0.931373, 2.319430, -0.768968],
                [-0.931373, 2.319430, 0.768968],
                [-0.931218, 0.522583, -1.710080],
                [-0.931218, 0.522583, 1.710080],
                [-0.923000, 2.250000, -0.923000],
                [-0.923000, 2.250000, 0.923000],
                [-0.907437, 1.286130, -1.666400],
                [-0.907437, 1.286130, 1.666400],
                [-0.907402, 2.336130, -1.099040],
                [-0.907402, 2.336130, 1.099040],
                [-0.895266, 2.299800, -0.895266],
                [-0.895266, 2.299800, 0.895266],
                [-0.887695, 0.085547, -1.311820],
                [-0.887695, 0.085547, 1.311820],
                [-0.885531, 2.336130, -1.072550],
                [-0.885531, 2.336130, 1.072550],
                [-0.884537, 2.286910, -1.071350],
                [-0.884537, 2.286910, 1.071350],
                [-0.876660, 0.343945, -1.609890],
                [-0.876660, 0.343945, 1.609890],
                [-0.868654, 2.369530, -0.473023],
                [-0.868654, 2.369530, 0.473023],
                [-0.843750, 0.000000, -1.246880],
                [-0.843750, 0.000000, 1.246880],
                [-0.843750, 2.250000, -1.246880],
                [-0.843750, 2.250000, 1.246880],
                [-0.825000, 2.400000, 0.000000],
                [-0.820938, 2.339060, -0.820938],
                [-0.820938, 2.339060, 0.820938],
                [-0.815186, 2.323830, -1.204660],
                [-0.815186, 2.323830, 1.204660],
                [-0.814698, 2.274900, -0.986761],
                [-0.814698, 2.274900, 0.986761],
                [-0.808500, 2.400000, -0.168094],
                [-0.808500, 2.400000, 0.168094],
                [-0.798320, 1.860940, -1.466020],
                [-0.798320, 1.860940, 1.466020],
                [-0.794590, 0.159961, -1.459170],
                [-0.794590, 0.159961, 1.459170],
                [-0.789258, 2.348440, -1.166350],
                [-0.789258, 2.348440, 1.166350],
                [-0.787500, 2.250000, -1.163750],
                [-0.787500, 2.250000, 1.163750],
                [-0.785000, 0.750000, -1.845000],
                [-0.785000, 0.750000, 1.845000],
                [-0.776567, 0.591650, -1.825180],
                [-0.776567, 0.591650, 1.825180],
                [-0.776514, 2.323830, -1.147520],
                [-0.776514, 2.323830, 1.147520],
                [-0.768968, 2.319430, -0.931373],
                [-0.768968, 2.319430, 0.931373],
                [-0.768135, 1.100390, -1.805360],
                [-0.768135, 1.100390, 1.805360],
                [-0.763400, 2.369530, -0.630285],
                [-0.763400, 2.369530, 0.630285],
                [-0.761063, 2.400000, -0.323813],
                [-0.761063, 2.400000, 0.323813],
                [-0.754336, 0.453516, -1.772930],
                [-0.754336, 0.453516, 1.772930],
                [-0.734902, 0.042773, -1.349570],
                [-0.734902, 0.042773, 1.349570],
                [-0.731250, 2.250000, -1.080630],
                [-0.731250, 2.250000, 1.080630],
                [-0.723672, 1.471870, -1.700860],
                [-0.723672, 1.471870, 1.700860],
                [-0.709277, 2.299800, -1.048150],
                [-0.709277, 2.299800, 1.048150],
                [-0.704126, 2.286910, -1.293050],
                [-0.704126, 2.286910, 1.293050],
                [-0.686875, 0.234375, -1.614370],
                [-0.686875, 0.234375, 1.614370],
                [-0.685781, 2.400000, -0.464063],
                [-0.685781, 2.400000, 0.464063],
                [-0.680997, 2.336130, -1.250570],
                [-0.680997, 2.336130, 1.250570],
                [-0.664583, 2.336130, -1.220430],
                [-0.664583, 2.336130, 1.220430],
                [-0.663837, 2.286910, -1.219060],
                [-0.663837, 2.286910, 1.219060],
                [-0.650391, 2.339060, -0.961133],
                [-0.650391, 2.339060, 0.961133],
                [-0.631998, 2.430470, -0.064825],
                [-0.631998, 2.430470, 0.064825],
                [-0.630285, 2.369530, -0.763400],
                [-0.630285, 2.369530, 0.763400],
                [-0.619414, 0.085547, -1.455820],
                [-0.619414, 0.085547, 1.455820],
                [-0.611424, 2.274900, -1.122810],
                [-0.611424, 2.274900, 1.122810],
                [-0.607174, 2.430470, -0.190548],
                [-0.607174, 2.430470, 0.190548],
                [-0.593047, 0.670825, -1.892280],
                [-0.593047, 0.670825, 1.892280],
                [-0.589845, 0.925195, -1.882060],
                [-0.589845, 0.925195, 1.882060],
                [-0.588750, 0.000000, -1.383750],
                [-0.588750, 0.000000, 1.383750],
                [-0.588750, 2.250000, -1.383750],
                [-0.588750, 2.250000, 1.383750],
                [-0.585750, 2.400000, -0.585750],
                [-0.585750, 2.400000, 0.585750],
                [-0.581402, 0.522583, -1.855120],
                [-0.581402, 0.522583, 1.855120],
                [-0.577104, 2.319430, -1.059790],
                [-0.577104, 2.319430, 1.059790],
                [-0.568818, 2.323830, -1.336900],
                [-0.568818, 2.323830, 1.336900],
                [-0.566554, 1.286130, -1.807750],
                [-0.566554, 1.286130, 1.807750],
                [-0.559973, 2.430470, -0.304711],
                [-0.559973, 2.430470, 0.304711],
                [-0.550727, 2.348440, -1.294380],
                [-0.550727, 2.348440, 1.294380],
                [-0.549500, 2.250000, -1.291500],
                [-0.549500, 2.250000, 1.291500],
                [-0.547339, 0.343945, -1.746440],
                [-0.547339, 0.343945, 1.746440],
                [-0.541834, 2.323830, -1.273480],
                [-0.541834, 2.323830, 1.273480],
                [-0.510250, 2.250000, -1.199250],
                [-0.510250, 2.250000, 1.199250],
                [-0.498428, 1.860940, -1.590370],
                [-0.498428, 1.860940, 1.590370],
                [-0.496099, 0.159961, -1.582940],
                [-0.496099, 0.159961, 1.582940],
                [-0.494918, 2.299800, -1.163220],
                [-0.494918, 2.299800, 1.163220],
                [-0.491907, 2.430470, -0.406410],
                [-0.491907, 2.430470, 0.406410],
                [-0.473023, 2.369530, -0.868654],
                [-0.473023, 2.369530, 0.868654],
                [-0.464063, 2.400000, -0.685781],
                [-0.464063, 2.400000, 0.685781],
                [-0.458833, 0.042773, -1.464030],
                [-0.458833, 0.042773, 1.464030],
                [-0.456250, 2.460940, 0.000000],
                [-0.453828, 2.339060, -1.066640],
                [-0.453828, 2.339060, 1.066640],
                [-0.439618, 2.286910, -1.402720],
                [-0.439618, 2.286910, 1.402720],
                [-0.438241, 2.460940, -0.091207],
                [-0.438241, 2.460940, 0.091207],
                [-0.425177, 2.336130, -1.356650],
                [-0.425177, 2.336130, 1.356650],
                [-0.420891, 2.460940, -0.179078],
                [-0.420891, 2.460940, 0.179078],
                [-0.414929, 2.336130, -1.323950],
                [-0.414929, 2.336130, 1.323950],
                [-0.414464, 2.286910, -1.322460],
                [-0.414464, 2.286910, 1.322460],
                [-0.407500, 0.750000, -1.960000],
                [-0.407500, 0.750000, 1.960000],
                [-0.406410, 2.430470, -0.491907],
                [-0.406410, 2.430470, 0.491907],
                [-0.403123, 0.591650, -1.938950],
                [-0.403123, 0.591650, 1.938950],
                [-0.398745, 1.100390, -1.917890],
                [-0.398745, 1.100390, 1.917890],
                [-0.391582, 0.453516, -1.883440],
                [-0.391582, 0.453516, 1.883440],
                [-0.381740, 2.274900, -1.218050],
                [-0.381740, 2.274900, 1.218050],
                [-0.375664, 1.471870, -1.806870],
                [-0.375664, 1.471870, 1.806870],
                [-0.372159, 2.460940, -0.251889],
                [-0.372159, 2.460940, 0.251889],
                [-0.362109, 2.897170, 0.000000],
                [-0.360312, 2.319430, -1.149680],
                [-0.360312, 2.319430, 1.149680],
                [-0.356563, 0.234375, 1.715000],
                [-0.356562, 0.234375, -1.715000],
                [-0.340625, 2.950780, 0.000000],
                [-0.337859, 2.923970, -0.069278],
                [-0.337859, 2.923970, 0.069278],
                [-0.334238, 2.897170, -0.142705],
                [-0.334238, 2.897170, 0.142705],
                [-0.330325, 2.864210, -0.067672],
                [-0.330325, 2.864210, 0.067672],
                [-0.325000, 2.831250, 0.000000],
                [-0.323938, 2.460940, -0.323938],
                [-0.323938, 2.460940, 0.323938],
                [-0.323813, 2.400000, -0.761063],
                [-0.323813, 2.400000, 0.761063],
                [-0.321543, 0.085547, -1.546560],
                [-0.321543, 0.085547, 1.546560],
                [-0.315410, 2.505470, -0.064395],
                [-0.315410, 2.505470, 0.064395],
                [-0.314464, 2.950780, -0.134407],
                [-0.314464, 2.950780, 0.134407],
                [-0.305625, 0.000000, -1.470000],
                [-0.305625, 0.000000, 1.470000],
                [-0.305625, 2.250000, -1.470000],
                [-0.305625, 2.250000, 1.470000],
                [-0.304711, 2.430470, -0.559973],
                [-0.304711, 2.430470, 0.559973],
                [-0.299953, 2.831250, -0.127984],
                [-0.299953, 2.831250, 0.127984],
                [-0.295330, 2.369530, -0.942332],
                [-0.295330, 2.369530, 0.942332],
                [-0.295278, 2.323830, -1.420230],
                [-0.295278, 2.323830, 1.420230],
                [-0.287197, 2.923970, -0.194300],
                [-0.287197, 2.923970, 0.194300],
                [-0.285887, 2.348440, -1.375060],
                [-0.285887, 2.348440, 1.375060],
                [-0.285250, 2.250000, -1.372000],
                [-0.285250, 2.250000, 1.372000],
                [-0.281271, 2.323830, -1.352860],
                [-0.281271, 2.323830, 1.352860],
                [-0.280732, 2.864210, -0.189856],
                [-0.280732, 2.864210, 0.189856],
                [-0.274421, 2.968800, -0.056380],
                [-0.274421, 2.968800, 0.056380],
                [-0.267832, 2.505470, -0.180879],
                [-0.267832, 2.505470, 0.180879],
                [-0.264875, 2.250000, -1.274000],
                [-0.264875, 2.250000, 1.274000],
                [-0.257610, 2.897170, -0.257610],
                [-0.257610, 2.897170, 0.257610],
                [-0.256916, 2.299800, -1.235720],
                [-0.256916, 2.299800, 1.235720],
                [-0.251889, 2.460940, -0.372159],
                [-0.251889, 2.460940, 0.372159],
                [-0.250872, 2.757420, -0.051347],
                [-0.250872, 2.757420, 0.051347],
                [-0.242477, 2.950780, -0.242477],
                [-0.242477, 2.950780, 0.242477],
                [-0.235586, 2.339060, -1.133120],
                [-0.235586, 2.339060, 1.133120],
                [-0.233382, 2.968800, -0.158018],
                [-0.233382, 2.968800, 0.158018],
                [-0.231125, 2.831250, -0.231125],
                [-0.231125, 2.831250, 0.231125],
                [-0.230078, 2.986820, 0.000000],
                [-0.213159, 2.757420, -0.144103],
                [-0.213159, 2.757420, 0.144103],
                [-0.212516, 2.986820, -0.091113],
                [-0.212516, 2.986820, 0.091113],
                [-0.202656, 0.670825, -1.969370],
                [-0.202656, 0.670825, 1.969370],
                [-0.201561, 0.925195, -1.958730],
                [-0.201561, 0.925195, 1.958730],
                [-0.200000, 2.550000, 0.000000],
                [-0.198676, 0.522583, -1.930690],
                [-0.198676, 0.522583, 1.930690],
                [-0.196875, 2.683590, 0.000000],
                [-0.194300, 2.923970, -0.287197],
                [-0.194300, 2.923970, 0.287197],
                [-0.193602, 1.286130, -1.881390],
                [-0.193602, 1.286130, 1.881390],
                [-0.190548, 2.430470, -0.607174],
                [-0.190548, 2.430470, 0.607174],
                [-0.189856, 2.864210, -0.280732],
                [-0.189856, 2.864210, 0.280732],
                [-0.187036, 0.343945, -1.817580],
                [-0.187036, 0.343945, 1.817580],
                [-0.184500, 2.550000, -0.078500],
                [-0.184500, 2.550000, 0.078500],
                [-0.181661, 2.683590, -0.077405],
                [-0.181661, 2.683590, 0.077405],
                [-0.180879, 2.505470, -0.267832],
                [-0.180879, 2.505470, 0.267832],
                [-0.179078, 2.460940, -0.420891],
                [-0.179078, 2.460940, 0.420891],
                [-0.176295, 2.581200, -0.036001],
                [-0.176295, 2.581200, 0.036001],
                [-0.174804, 2.648000, -0.035727],
                [-0.174804, 2.648000, 0.035727],
                [-0.170322, 1.860940, -1.655160],
                [-0.170322, 1.860940, 1.655160],
                [-0.169526, 0.159961, -1.647420],
                [-0.169526, 0.159961, 1.647420],
                [-0.168094, 2.400000, -0.808500],
                [-0.168094, 2.400000, 0.808500],
                [-0.166797, 2.612400, 0.000000],
                [-0.164073, 2.986820, -0.164073],
                [-0.164073, 2.986820, 0.164073],
                [-0.158018, 2.968800, -0.233382],
                [-0.158018, 2.968800, 0.233382],
                [-0.156792, 0.042773, -1.523670],
                [-0.156792, 0.042773, 1.523670],
                [-0.153882, 2.612400, -0.065504],
                [-0.153882, 2.612400, 0.065504],
                [-0.150226, 2.286910, -1.459860],
                [-0.150226, 2.286910, 1.459860],
                [-0.149710, 2.581200, -0.101116],
                [-0.149710, 2.581200, 0.101116],
                [-0.148475, 2.648000, -0.100316],
                [-0.148475, 2.648000, 0.100316],
                [-0.145291, 2.336130, -1.411910],
                [-0.145291, 2.336130, 1.411910],
                [-0.144103, 2.757420, -0.213159],
                [-0.144103, 2.757420, 0.213159],
                [-0.142705, 2.897170, -0.334238],
                [-0.142705, 2.897170, 0.334238],
                [-0.142000, 2.550000, -0.142000],
                [-0.142000, 2.550000, 0.142000],
                [-0.141789, 2.336130, -1.377880],
                [-0.141789, 2.336130, 1.377880],
                [-0.141630, 2.286910, -1.376330],
                [-0.141630, 2.286910, 1.376330],
                [-0.139898, 2.683590, -0.139898],
                [-0.139898, 2.683590, 0.139898],
                [-0.134407, 2.950780, -0.314464],
                [-0.134407, 2.950780, 0.314464],
                [-0.130448, 2.274900, -1.267660],
                [-0.130448, 2.274900, 1.267660],
                [-0.127984, 2.831250, -0.299953],
                [-0.127984, 2.831250, 0.299953],
                [-0.123125, 2.319430, -1.196510],
                [-0.123125, 2.319430, 1.196510],
                [-0.118458, 2.612400, -0.118458],
                [-0.118458, 2.612400, 0.118458],
                [-0.110649, 2.993410, -0.022778],
                [-0.110649, 2.993410, 0.022778],
                [-0.101116, 2.581200, -0.149710],
                [-0.101116, 2.581200, 0.149710],
                [-0.100920, 2.369530, -0.980719],
                [-0.100920, 2.369530, 0.980719],
                [-0.100316, 2.648000, -0.148475],
                [-0.100316, 2.648000, 0.148475],
                [-0.094147, 2.993410, -0.063797],
                [-0.094147, 2.993410, 0.063797],
                [-0.091207, 2.460940, -0.438241],
                [-0.091207, 2.460940, 0.438241],
                [-0.091113, 2.986820, -0.212516],
                [-0.091113, 2.986820, 0.212516],
                [-0.078500, 2.550000, -0.184500],
                [-0.078500, 2.550000, 0.184500],
                [-0.077405, 2.683590, -0.181661],
                [-0.077405, 2.683590, 0.181661],
                [-0.069278, 2.923970, -0.337859],
                [-0.069278, 2.923970, 0.337859],
                [-0.067672, 2.864210, -0.330325],
                [-0.067672, 2.864210, 0.330325],
                [-0.065504, 2.612400, -0.153882],
                [-0.065504, 2.612400, 0.153882],
                [-0.064825, 2.430470, -0.631998],
                [-0.064825, 2.430470, 0.631998],
                [-0.064395, 2.505470, -0.315410],
                [-0.064395, 2.505470, 0.315410],
                [-0.063797, 2.993410, -0.094147],
                [-0.063797, 2.993410, 0.094147],
                [-0.056380, 2.968800, -0.274421],
                [-0.056380, 2.968800, 0.274421],
                [-0.051347, 2.757420, -0.250872],
                [-0.051347, 2.757420, 0.250872],
                [-0.036001, 2.581200, -0.176295],
                [-0.036001, 2.581200, 0.176295],
                [-0.035727, 2.648000, -0.174804],
                [-0.035727, 2.648000, 0.174804],
                [-0.022778, 2.993410, -0.110649],
                [-0.022778, 2.993410, 0.110649],
                [0.000000, 0.000000, -1.500000],
                [0.000000, 0.000000, 1.500000],
                [0.000000, 0.085547, -1.578130],
                [0.000000, 0.085547, 1.578130],
                [0.000000, 0.234375, -1.750000],
                [0.000000, 0.234375, 1.750000],
                [0.000000, 0.453516, -1.921880],
                [0.000000, 0.453516, 1.921880],
                [0.000000, 0.591650, -1.978520],
                [0.000000, 0.591650, 1.978520],
                [0.000000, 0.750000, -2.000000],
                [0.000000, 0.750000, 2.000000],
                [0.000000, 1.100390, -1.957030],
                [0.000000, 1.100390, 1.957030],
                [0.000000, 1.471870, -1.843750],
                [0.000000, 1.471870, 1.843750],
                [0.000000, 2.250000, -1.500000],
                [0.000000, 2.250000, -1.400000],
                [0.000000, 2.250000, -1.300000],
                [0.000000, 2.250000, 1.300000],
                [0.000000, 2.250000, 1.400000],
                [0.000000, 2.250000, 1.500000],
                [0.000000, 2.299800, -1.260940],
                [0.000000, 2.299800, 1.260940],
                [0.000000, 2.323830, -1.449220],
                [0.000000, 2.323830, -1.380470],
                [0.000000, 2.323830, 1.380470],
                [0.000000, 2.323830, 1.449220],
                [0.000000, 2.339060, -1.156250],
                [0.000000, 2.339060, 1.156250],
                [0.000000, 2.348440, -1.403130],
                [0.000000, 2.348440, 1.403130],
                [0.000000, 2.400000, -0.825000],
                [0.000000, 2.400000, 0.825000],
                [0.000000, 2.460940, -0.456250],
                [0.000000, 2.460940, 0.456250],
                [0.000000, 2.550000, -0.200000],
                [0.000000, 2.550000, 0.200000],
                [0.000000, 2.612400, -0.166797],
                [0.000000, 2.612400, 0.166797],
                [0.000000, 2.683590, -0.196875],
                [0.000000, 2.683590, 0.196875],
                [0.000000, 2.831250, -0.325000],
                [0.000000, 2.831250, 0.325000],
                [0.000000, 2.897170, -0.362109],
                [0.000000, 2.897170, 0.362109],
                [0.000000, 2.950780, -0.340625],
                [0.000000, 2.950780, 0.340625],
                [0.000000, 2.986820, -0.230078],
                [0.000000, 2.986820, 0.230078],
                [0.000000, 3.000000, 0.000000],
                [0.022778, 2.993410, -0.110649],
                [0.022778, 2.993410, 0.110649],
                [0.035727, 2.648000, -0.174804],
                [0.035727, 2.648000, 0.174804],
                [0.036001, 2.581200, -0.176295],
                [0.036001, 2.581200, 0.176295],
                [0.051347, 2.757420, -0.250872],
                [0.051347, 2.757420, 0.250872],
                [0.056380, 2.968800, -0.274421],
                [0.056380, 2.968800, 0.274421],
                [0.063797, 2.993410, -0.094147],
                [0.063797, 2.993410, 0.094147],
                [0.064395, 2.505470, -0.315410],
                [0.064395, 2.505470, 0.315410],
                [0.064825, 2.430470, -0.631998],
                [0.064825, 2.430470, 0.631998],
                [0.065504, 2.612400, -0.153882],
                [0.065504, 2.612400, 0.153882],
                [0.067672, 2.864210, -0.330325],
                [0.067672, 2.864210, 0.330325],
                [0.069278, 2.923970, -0.337859],
                [0.069278, 2.923970, 0.337859],
                [0.077405, 2.683590, -0.181661],
                [0.077405, 2.683590, 0.181661],
                [0.078500, 2.550000, -0.184500],
                [0.078500, 2.550000, 0.184500],
                [0.091113, 2.986820, -0.212516],
                [0.091113, 2.986820, 0.212516],
                [0.091207, 2.460940, -0.438241],
                [0.091207, 2.460940, 0.438241],
                [0.094147, 2.993410, -0.063797],
                [0.094147, 2.993410, 0.063797],
                [0.100316, 2.648000, -0.148475],
                [0.100316, 2.648000, 0.148475],
                [0.100920, 2.369530, -0.980719],
                [0.100920, 2.369530, 0.980719],
                [0.101116, 2.581200, -0.149710],
                [0.101116, 2.581200, 0.149710],
                [0.110649, 2.993410, -0.022778],
                [0.110649, 2.993410, 0.022778],
                [0.118458, 2.612400, -0.118458],
                [0.118458, 2.612400, 0.118458],
                [0.123125, 2.319430, -1.196510],
                [0.123125, 2.319430, 1.196510],
                [0.127984, 2.831250, -0.299953],
                [0.127984, 2.831250, 0.299953],
                [0.130448, 2.274900, -1.267660],
                [0.130448, 2.274900, 1.267660],
                [0.134407, 2.950780, -0.314464],
                [0.134407, 2.950780, 0.314464],
                [0.139898, 2.683590, -0.139898],
                [0.139898, 2.683590, 0.139898],
                [0.141630, 2.286910, -1.376330],
                [0.141630, 2.286910, 1.376330],
                [0.141789, 2.336130, -1.377880],
                [0.141789, 2.336130, 1.377880],
                [0.142000, 2.550000, -0.142000],
                [0.142000, 2.550000, 0.142000],
                [0.142705, 2.897170, -0.334238],
                [0.142705, 2.897170, 0.334238],
                [0.144103, 2.757420, -0.213159],
                [0.144103, 2.757420, 0.213159],
                [0.145291, 2.336130, -1.411910],
                [0.145291, 2.336130, 1.411910],
                [0.148475, 2.648000, -0.100316],
                [0.148475, 2.648000, 0.100316],
                [0.149710, 2.581200, -0.101116],
                [0.149710, 2.581200, 0.101116],
                [0.150226, 2.286910, -1.459860],
                [0.150226, 2.286910, 1.459860],
                [0.153882, 2.612400, -0.065504],
                [0.153882, 2.612400, 0.065504],
                [0.156792, 0.042773, -1.523670],
                [0.156792, 0.042773, 1.523670],
                [0.158018, 2.968800, -0.233382],
                [0.158018, 2.968800, 0.233382],
                [0.164073, 2.986820, -0.164073],
                [0.164073, 2.986820, 0.164073],
                [0.166797, 2.612400, 0.000000],
                [0.168094, 2.400000, -0.808500],
                [0.168094, 2.400000, 0.808500],
                [0.169526, 0.159961, -1.647420],
                [0.169526, 0.159961, 1.647420],
                [0.170322, 1.860940, -1.655160],
                [0.170322, 1.860940, 1.655160],
                [0.174804, 2.648000, -0.035727],
                [0.174804, 2.648000, 0.035727],
                [0.176295, 2.581200, -0.036001],
                [0.176295, 2.581200, 0.036001],
                [0.179078, 2.460940, -0.420891],
                [0.179078, 2.460940, 0.420891],
                [0.180879, 2.505470, -0.267832],
                [0.180879, 2.505470, 0.267832],
                [0.181661, 2.683590, -0.077405],
                [0.181661, 2.683590, 0.077405],
                [0.184500, 2.550000, -0.078500],
                [0.184500, 2.550000, 0.078500],
                [0.187036, 0.343945, -1.817580],
                [0.187036, 0.343945, 1.817580],
                [0.189856, 2.864210, -0.280732],
                [0.189856, 2.864210, 0.280732],
                [0.190548, 2.430470, -0.607174],
                [0.190548, 2.430470, 0.607174],
                [0.193602, 1.286130, -1.881390],
                [0.193602, 1.286130, 1.881390],
                [0.194300, 2.923970, -0.287197],
                [0.194300, 2.923970, 0.287197],
                [0.196875, 2.683590, 0.000000],
                [0.198676, 0.522583, -1.930690],
                [0.198676, 0.522583, 1.930690],
                [0.200000, 2.550000, 0.000000],
                [0.201561, 0.925195, -1.958730],
                [0.201561, 0.925195, 1.958730],
                [0.202656, 0.670825, -1.969370],
                [0.202656, 0.670825, 1.969370],
                [0.212516, 2.986820, -0.091113],
                [0.212516, 2.986820, 0.091113],
                [0.213159, 2.757420, -0.144103],
                [0.213159, 2.757420, 0.144103],
                [0.230078, 2.986820, 0.000000],
                [0.231125, 2.831250, -0.231125],
                [0.231125, 2.831250, 0.231125],
                [0.233382, 2.968800, -0.158018],
                [0.233382, 2.968800, 0.158018],
                [0.235586, 2.339060, -1.133120],
                [0.235586, 2.339060, 1.133120],
                [0.242477, 2.950780, -0.242477],
                [0.242477, 2.950780, 0.242477],
                [0.250872, 2.757420, -0.051347],
                [0.250872, 2.757420, 0.051347],
                [0.251889, 2.460940, -0.372159],
                [0.251889, 2.460940, 0.372159],
                [0.256916, 2.299800, -1.235720],
                [0.256916, 2.299800, 1.235720],
                [0.257610, 2.897170, -0.257610],
                [0.257610, 2.897170, 0.257610],
                [0.264875, 2.250000, -1.274000],
                [0.264875, 2.250000, 1.274000],
                [0.267832, 2.505470, -0.180879],
                [0.267832, 2.505470, 0.180879],
                [0.274421, 2.968800, -0.056380],
                [0.274421, 2.968800, 0.056380],
                [0.280732, 2.864210, -0.189856],
                [0.280732, 2.864210, 0.189856],
                [0.281271, 2.323830, -1.352860],
                [0.281271, 2.323830, 1.352860],
                [0.285250, 2.250000, -1.372000],
                [0.285250, 2.250000, 1.372000],
                [0.285887, 2.348440, -1.375060],
                [0.285887, 2.348440, 1.375060],
                [0.287197, 2.923970, -0.194300],
                [0.287197, 2.923970, 0.194300],
                [0.295278, 2.323830, -1.420230],
                [0.295278, 2.323830, 1.420230],
                [0.295330, 2.369530, -0.942332],
                [0.295330, 2.369530, 0.942332],
                [0.299953, 2.831250, -0.127984],
                [0.299953, 2.831250, 0.127984],
                [0.304711, 2.430470, -0.559973],
                [0.304711, 2.430470, 0.559973],
                [0.305625, 0.000000, -1.470000],
                [0.305625, 0.000000, 1.470000],
                [0.305625, 2.250000, -1.470000],
                [0.305625, 2.250000, 1.470000],
                [0.314464, 2.950780, -0.134407],
                [0.314464, 2.950780, 0.134407],
                [0.315410, 2.505470, -0.064395],
                [0.315410, 2.505470, 0.064395],
                [0.321543, 0.085547, -1.546560],
                [0.321543, 0.085547, 1.546560],
                [0.323813, 2.400000, -0.761063],
                [0.323813, 2.400000, 0.761063],
                [0.323938, 2.460940, -0.323938],
                [0.323938, 2.460940, 0.323938],
                [0.325000, 2.831250, 0.000000],
                [0.330325, 2.864210, -0.067672],
                [0.330325, 2.864210, 0.067672],
                [0.334238, 2.897170, -0.142705],
                [0.334238, 2.897170, 0.142705],
                [0.337859, 2.923970, -0.069278],
                [0.337859, 2.923970, 0.069278],
                [0.340625, 2.950780, 0.000000],
                [0.356562, 0.234375, 1.715000],
                [0.356563, 0.234375, -1.715000],
                [0.360312, 2.319430, -1.149680],
                [0.360312, 2.319430, 1.149680],
                [0.362109, 2.897170, 0.000000],
                [0.372159, 2.460940, -0.251889],
                [0.372159, 2.460940, 0.251889],
                [0.375664, 1.471870, -1.806870],
                [0.375664, 1.471870, 1.806870],
                [0.381740, 2.274900, -1.218050],
                [0.381740, 2.274900, 1.218050],
                [0.391582, 0.453516, -1.883440],
                [0.391582, 0.453516, 1.883440],
                [0.398745, 1.100390, -1.917890],
                [0.398745, 1.100390, 1.917890],
                [0.403123, 0.591650, -1.938950],
                [0.403123, 0.591650, 1.938950],
                [0.406410, 2.430470, -0.491907],
                [0.406410, 2.430470, 0.491907],
                [0.407500, 0.750000, -1.960000],
                [0.407500, 0.750000, 1.960000],
                [0.414464, 2.286910, -1.322460],
                [0.414464, 2.286910, 1.322460],
                [0.414929, 2.336130, -1.323950],
                [0.414929, 2.336130, 1.323950],
                [0.420891, 2.460940, -0.179078],
                [0.420891, 2.460940, 0.179078],
                [0.425177, 2.336130, -1.356650],
                [0.425177, 2.336130, 1.356650],
                [0.438241, 2.460940, -0.091207],
                [0.438241, 2.460940, 0.091207],
                [0.439618, 2.286910, -1.402720],
                [0.439618, 2.286910, 1.402720],
                [0.453828, 2.339060, -1.066640],
                [0.453828, 2.339060, 1.066640],
                [0.456250, 2.460940, 0.000000],
                [0.458833, 0.042773, -1.464030],
                [0.458833, 0.042773, 1.464030],
                [0.464063, 2.400000, -0.685781],
                [0.464063, 2.400000, 0.685781],
                [0.473023, 2.369530, -0.868654],
                [0.473023, 2.369530, 0.868654],
                [0.491907, 2.430470, -0.406410],
                [0.491907, 2.430470, 0.406410],
                [0.494918, 2.299800, -1.163220],
                [0.494918, 2.299800, 1.163220],
                [0.496099, 0.159961, -1.582940],
                [0.496099, 0.159961, 1.582940],
                [0.498428, 1.860940, -1.590370],
                [0.498428, 1.860940, 1.590370],
                [0.510250, 2.250000, -1.199250],
                [0.510250, 2.250000, 1.199250],
                [0.541834, 2.323830, -1.273480],
                [0.541834, 2.323830, 1.273480],
                [0.547339, 0.343945, -1.746440],
                [0.547339, 0.343945, 1.746440],
                [0.549500, 2.250000, -1.291500],
                [0.549500, 2.250000, 1.291500],
                [0.550727, 2.348440, -1.294380],
                [0.550727, 2.348440, 1.294380],
                [0.559973, 2.430470, -0.304711],
                [0.559973, 2.430470, 0.304711],
                [0.566554, 1.286130, -1.807750],
                [0.566554, 1.286130, 1.807750],
                [0.568818, 2.323830, -1.336900],
                [0.568818, 2.323830, 1.336900],
                [0.577104, 2.319430, -1.059790],
                [0.577104, 2.319430, 1.059790],
                [0.581402, 0.522583, -1.855120],
                [0.581402, 0.522583, 1.855120],
                [0.585750, 2.400000, -0.585750],
                [0.585750, 2.400000, 0.585750],
                [0.588750, 0.000000, -1.383750],
                [0.588750, 0.000000, 1.383750],
                [0.588750, 2.250000, -1.383750],
                [0.588750, 2.250000, 1.383750],
                [0.589845, 0.925195, -1.882060],
                [0.589845, 0.925195, 1.882060],
                [0.593047, 0.670825, -1.892280],
                [0.593047, 0.670825, 1.892280],
                [0.607174, 2.430470, -0.190548],
                [0.607174, 2.430470, 0.190548],
                [0.611424, 2.274900, -1.122810],
                [0.611424, 2.274900, 1.122810],
                [0.619414, 0.085547, -1.455820],
                [0.619414, 0.085547, 1.455820],
                [0.630285, 2.369530, -0.763400],
                [0.630285, 2.369530, 0.763400],
                [0.631998, 2.430470, -0.064825],
                [0.631998, 2.430470, 0.064825],
                [0.650391, 2.339060, -0.961133],
                [0.650391, 2.339060, 0.961133],
                [0.663837, 2.286910, -1.219060],
                [0.663837, 2.286910, 1.219060],
                [0.664583, 2.336130, -1.220430],
                [0.664583, 2.336130, 1.220430],
                [0.680997, 2.336130, -1.250570],
                [0.680997, 2.336130, 1.250570],
                [0.685781, 2.400000, -0.464063],
                [0.685781, 2.400000, 0.464063],
                [0.686875, 0.234375, -1.614370],
                [0.686875, 0.234375, 1.614370],
                [0.704126, 2.286910, -1.293050],
                [0.704126, 2.286910, 1.293050],
                [0.709277, 2.299800, -1.048150],
                [0.709277, 2.299800, 1.048150],
                [0.723672, 1.471870, -1.700860],
                [0.723672, 1.471870, 1.700860],
                [0.731250, 2.250000, -1.080630],
                [0.731250, 2.250000, 1.080630],
                [0.734902, 0.042773, -1.349570],
                [0.734902, 0.042773, 1.349570],
                [0.754336, 0.453516, -1.772930],
                [0.754336, 0.453516, 1.772930],
                [0.761063, 2.400000, -0.323813],
                [0.761063, 2.400000, 0.323813],
                [0.763400, 2.369530, -0.630285],
                [0.763400, 2.369530, 0.630285],
                [0.768135, 1.100390, -1.805360],
                [0.768135, 1.100390, 1.805360],
                [0.768968, 2.319430, -0.931373],
                [0.768968, 2.319430, 0.931373],
                [0.776514, 2.323830, -1.147520],
                [0.776514, 2.323830, 1.147520],
                [0.776567, 0.591650, -1.825180],
                [0.776567, 0.591650, 1.825180],
                [0.785000, 0.750000, -1.845000],
                [0.785000, 0.750000, 1.845000],
                [0.787500, 2.250000, -1.163750],
                [0.787500, 2.250000, 1.163750],
                [0.789258, 2.348440, -1.166350],
                [0.789258, 2.348440, 1.166350],
                [0.794590, 0.159961, -1.459170],
                [0.794590, 0.159961, 1.459170],
                [0.798320, 1.860940, -1.466020],
                [0.798320, 1.860940, 1.466020],
                [0.808500, 2.400000, -0.168094],
                [0.808500, 2.400000, 0.168094],
                [0.814698, 2.274900, -0.986761],
                [0.814698, 2.274900, 0.986761],
                [0.815186, 2.323830, -1.204660],
                [0.815186, 2.323830, 1.204660],
                [0.820938, 2.339060, -0.820938],
                [0.820938, 2.339060, 0.820938],
                [0.825000, 2.400000, 0.000000],
                [0.843750, 0.000000, -1.246880],
                [0.843750, 0.000000, 1.246880],
                [0.843750, 2.250000, -1.246880],
                [0.843750, 2.250000, 1.246880],
                [0.868654, 2.369530, -0.473023],
                [0.868654, 2.369530, 0.473023],
                [0.876660, 0.343945, -1.609890],
                [0.876660, 0.343945, 1.609890],
                [0.884537, 2.286910, -1.071350],
                [0.884537, 2.286910, 1.071350],
                [0.885531, 2.336130, -1.072550],
                [0.885531, 2.336130, 1.072550],
                [0.887695, 0.085547, -1.311820],
                [0.887695, 0.085547, 1.311820],
                [0.895266, 2.299800, -0.895266],
                [0.895266, 2.299800, 0.895266],
                [0.907402, 2.336130, -1.099040],
                [0.907402, 2.336130, 1.099040],
                [0.907437, 1.286130, -1.666400],
                [0.907437, 1.286130, 1.666400],
                [0.923000, 2.250000, -0.923000],
                [0.923000, 2.250000, 0.923000],
                [0.931218, 0.522583, -1.710080],
                [0.931218, 0.522583, 1.710080],
                [0.931373, 2.319430, -0.768968],
                [0.931373, 2.319430, 0.768968],
                [0.938220, 2.286910, -1.136370],
                [0.938220, 2.286910, 1.136370],
                [0.942332, 2.369530, -0.295330],
                [0.942332, 2.369530, 0.295330],
                [0.944741, 0.925195, -1.734910],
                [0.944741, 0.925195, 1.734910],
                [0.949871, 0.670825, -1.744330],
                [0.949871, 0.670825, 1.744330],
                [0.961133, 2.339060, -0.650391],
                [0.961133, 2.339060, 0.650391],
                [0.979229, 0.042773, -1.186040],
                [0.979229, 0.042773, 1.186040],
                [0.980133, 2.323830, -0.980133],
                [0.980133, 2.323830, 0.980133],
                [0.980719, 2.369530, -0.100920],
                [0.980719, 2.369530, 0.100920],
                [0.984375, 0.234375, -1.454690],
                [0.984375, 0.234375, 1.454690],
                [0.986761, 2.274900, -0.814698],
                [0.986761, 2.274900, 0.814698],
                [0.994000, 2.250000, -0.994000],
                [0.994000, 2.250000, 0.994000],
                [0.996219, 2.348440, -0.996219],
                [0.996219, 2.348440, 0.996219],
                [1.028940, 2.323830, -1.028940],
                [1.028940, 2.323830, 1.028940],
                [1.037110, 1.471870, -1.532620],
                [1.037110, 1.471870, 1.532620],
                [1.048150, 2.299800, -0.709277],
                [1.048150, 2.299800, 0.709277],
                [1.058760, 0.159961, -1.282370],
                [1.058760, 0.159961, 1.282370],
                [1.059790, 2.319430, -0.577104],
                [1.059790, 2.319430, 0.577104],
                [1.063730, 1.860940, -1.288390],
                [1.063730, 1.860940, 1.288390],
                [1.065000, 0.000000, -1.065000],
                [1.065000, 0.000000, 1.065000],
                [1.065000, 2.250000, -1.065000],
                [1.065000, 2.250000, 1.065000],
                [1.066640, 2.339060, -0.453828],
                [1.066640, 2.339060, 0.453828],
                [1.071350, 2.286910, -0.884537],
                [1.071350, 2.286910, 0.884537],
                [1.072550, 2.336130, -0.885531],
                [1.072550, 2.336130, 0.885531],
                [1.080630, 2.250000, -0.731250],
                [1.080630, 2.250000, 0.731250],
                [1.081060, 0.453516, -1.597560],
                [1.081060, 0.453516, 1.597560],
                [1.099040, 2.336130, -0.907402],
                [1.099040, 2.336130, 0.907402],
                [1.100830, 1.100390, -1.626780],
                [1.100830, 1.100390, 1.626780],
                [1.112920, 0.591650, -1.644640],
                [1.112920, 0.591650, 1.644640],
                [1.120470, 0.085547, -1.120470],
                [1.120470, 0.085547, 1.120470],
                [1.122810, 2.274900, -0.611424],
                [1.122810, 2.274900, 0.611424],
                [1.125000, 0.750000, -1.662500],
                [1.125000, 0.750000, 1.662500],
                [1.133120, 2.339060, -0.235586],
                [1.133120, 2.339060, 0.235586],
                [1.136370, 2.286910, -0.938220],
                [1.136370, 2.286910, 0.938220],
                [1.147520, 2.323830, -0.776514],
                [1.147520, 2.323830, 0.776514],
                [1.149680, 2.319430, -0.360312],
                [1.149680, 2.319430, 0.360312],
                [1.156250, 2.339060, 0.000000],
                [1.163220, 2.299800, -0.494918],
                [1.163220, 2.299800, 0.494918],
                [1.163750, 2.250000, -0.787500],
                [1.163750, 2.250000, 0.787500],
                [1.166350, 2.348440, -0.789258],
                [1.166350, 2.348440, 0.789258],
                [1.168120, 0.343945, -1.414820],
                [1.168120, 0.343945, 1.414820],
                [1.186040, 0.042773, -0.979229],
                [1.186040, 0.042773, 0.979229],
                [1.196510, 2.319430, -0.123125],
                [1.196510, 2.319430, 0.123125],
                [1.199250, 2.250000, -0.510250],
                [1.199250, 2.250000, 0.510250],
                [1.204660, 2.323830, -0.815186],
                [1.204660, 2.323830, 0.815186],
                [1.209120, 1.286130, -1.464490],
                [1.209120, 1.286130, 1.464490],
                [1.218050, 2.274900, -0.381740],
                [1.218050, 2.274900, 0.381740],
                [1.219060, 2.286910, -0.663837],
                [1.219060, 2.286910, 0.663837],
                [1.220430, 2.336130, -0.664583],
                [1.220430, 2.336130, 0.664583],
                [1.235720, 2.299800, -0.256916],
                [1.235720, 2.299800, 0.256916],
                [1.240810, 0.522583, -1.502870],
                [1.240810, 0.522583, 1.502870],
                [1.242500, 0.234375, -1.242500],
                [1.242500, 0.234375, 1.242500],
                [1.246880, 0.000000, -0.843750],
                [1.246880, 0.000000, 0.843750],
                [1.246880, 2.250000, -0.843750],
                [1.246880, 2.250000, 0.843750],
                [1.250570, 2.336130, -0.680997],
                [1.250570, 2.336130, 0.680997],
                [1.258830, 0.925195, -1.524690],
                [1.258830, 0.925195, 1.524690],
                [1.260940, 2.299800, 0.000000],
                [1.265670, 0.670825, -1.532970],
                [1.265670, 0.670825, 1.532970],
                [1.267660, 2.274900, -0.130448],
                [1.267660, 2.274900, 0.130448],
                [1.273480, 2.323830, -0.541834],
                [1.273480, 2.323830, 0.541834],
                [1.274000, 2.250000, -0.264875],
                [1.274000, 2.250000, 0.264875],
                [1.282370, 0.159961, -1.058760],
                [1.282370, 0.159961, 1.058760],
                [1.288390, 1.860940, -1.063730],
                [1.288390, 1.860940, 1.063730],
                [1.291500, 2.250000, -0.549500],
                [1.291500, 2.250000, 0.549500],
                [1.293050, 2.286910, -0.704126],
                [1.293050, 2.286910, 0.704126],
                [1.294380, 2.348440, -0.550727],
                [1.294380, 2.348440, 0.550727],
                [1.300000, 2.250000, 0.000000],
                [1.309060, 1.471870, -1.309060],
                [1.309060, 1.471870, 1.309060],
                [1.311820, 0.085547, -0.887695],
                [1.311820, 0.085547, 0.887695],
                [1.322460, 2.286910, -0.414464],
                [1.322460, 2.286910, 0.414464],
                [1.323950, 2.336130, -0.414929],
                [1.323950, 2.336130, 0.414929],
                [1.336900, 2.323830, -0.568818],
                [1.336900, 2.323830, 0.568818],
                [1.349570, 0.042773, -0.734902],
                [1.349570, 0.042773, 0.734902],
                [1.352860, 2.323830, -0.281271],
                [1.352860, 2.323830, 0.281271],
                [1.356650, 2.336130, -0.425177],
                [1.356650, 2.336130, 0.425177],
                [1.364530, 0.453516, -1.364530],
                [1.364530, 0.453516, 1.364530],
                [1.372000, 2.250000, -0.285250],
                [1.372000, 2.250000, 0.285250],
                [1.375060, 2.348440, -0.285887],
                [1.375060, 2.348440, 0.285887],
                [1.376330, 2.286910, -0.141630],
                [1.376330, 2.286910, 0.141630],
                [1.377880, 2.336130, -0.141789],
                [1.377880, 2.336130, 0.141789],
                [1.380470, 2.323830, 0.000000],
                [1.383750, 0.000000, -0.588750],
                [1.383750, 0.000000, 0.588750],
                [1.383750, 2.250000, -0.588750],
                [1.383750, 2.250000, 0.588750],
                [1.389490, 1.100390, -1.389490],
                [1.389490, 1.100390, 1.389490],
                [1.400000, 2.250000, 0.000000],
                [1.402720, 2.286910, -0.439618],
                [1.402720, 2.286910, 0.439618],
                [1.403130, 2.348440, 0.000000],
                [1.404750, 0.591650, -1.404750],
                [1.404750, 0.591650, 1.404750],
                [1.411910, 2.336130, -0.145291],
                [1.411910, 2.336130, 0.145291],
                [1.414820, 0.343945, -1.168120],
                [1.414820, 0.343945, 1.168120],
                [1.420000, 0.750000, -1.420000],
                [1.420000, 0.750000, 1.420000],
                [1.420230, 2.323830, -0.295278],
                [1.420230, 2.323830, 0.295278],
                [1.449220, 2.323830, 0.000000],
                [1.454690, 0.234375, -0.984375],
                [1.454690, 0.234375, 0.984375],
                [1.455820, 0.085547, -0.619414],
                [1.455820, 0.085547, 0.619414],
                [1.459170, 0.159961, -0.794590],
                [1.459170, 0.159961, 0.794590],
                [1.459860, 2.286910, -0.150226],
                [1.459860, 2.286910, 0.150226],
                [1.464030, 0.042773, -0.458833],
                [1.464030, 0.042773, 0.458833],
                [1.464490, 1.286130, -1.209120],
                [1.464490, 1.286130, 1.209120],
                [1.466020, 1.860940, -0.798320],
                [1.466020, 1.860940, 0.798320],
                [1.470000, 0.000000, -0.305625],
                [1.470000, 0.000000, 0.305625],
                [1.470000, 2.250000, -0.305625],
                [1.470000, 2.250000, 0.305625],
                [1.500000, 0.000000, 0.000000],
                [1.500000, 2.250000, 0.000000],
                [1.502870, 0.522583, -1.240810],
                [1.502870, 0.522583, 1.240810],
                [1.523670, 0.042773, -0.156792],
                [1.523670, 0.042773, 0.156792],
                [1.524690, 0.925195, -1.258830],
                [1.524690, 0.925195, 1.258830],
                [1.532620, 1.471870, -1.037110],
                [1.532620, 1.471870, 1.037110],
                [1.532970, 0.670825, -1.265670],
                [1.532970, 0.670825, 1.265670],
                [1.546560, 0.085547, -0.321543],
                [1.546560, 0.085547, 0.321543],
                [1.578130, 0.085547, 0.000000],
                [1.582940, 0.159961, -0.496099],
                [1.582940, 0.159961, 0.496099],
                [1.590370, 1.860940, -0.498428],
                [1.590370, 1.860940, 0.498428],
                [1.597560, 0.453516, -1.081060],
                [1.597560, 0.453516, 1.081060],
                [1.609890, 0.343945, -0.876660],
                [1.609890, 0.343945, 0.876660],
                [1.614370, 0.234375, -0.686875],
                [1.614370, 0.234375, 0.686875],
                [1.626780, 1.100390, -1.100830],
                [1.626780, 1.100390, 1.100830],
                [1.644640, 0.591650, -1.112920],
                [1.644640, 0.591650, 1.112920],
                [1.647420, 0.159961, -0.169526],
                [1.647420, 0.159961, 0.169526],
                [1.655160, 1.860940, -0.170322],
                [1.655160, 1.860940, 0.170322],
                [1.662500, 0.750000, -1.125000],
                [1.662500, 0.750000, 1.125000],
                [1.666400, 1.286130, -0.907437],
                [1.666400, 1.286130, 0.907437],
                [1.700000, 0.450000, 0.000000],
                [1.700000, 0.485449, -0.216563],
                [1.700000, 0.485449, 0.216563],
                [1.700000, 0.578906, -0.371250],
                [1.700000, 0.578906, 0.371250],
                [1.700000, 0.711035, -0.464063],
                [1.700000, 0.711035, 0.464063],
                [1.700000, 0.862500, -0.495000],
                [1.700000, 0.862500, 0.495000],
                [1.700000, 1.013970, -0.464063],
                [1.700000, 1.013970, 0.464063],
                [1.700000, 1.146090, -0.371250],
                [1.700000, 1.146090, 0.371250],
                [1.700000, 1.239550, -0.216563],
                [1.700000, 1.239550, 0.216563],
                [1.700000, 1.275000, 0.000000],
                [1.700860, 1.471870, -0.723672],
                [1.700860, 1.471870, 0.723672],
                [1.710080, 0.522583, -0.931218],
                [1.710080, 0.522583, 0.931218],
                [1.715000, 0.234375, -0.356562],
                [1.715000, 0.234375, 0.356563],
                [1.734910, 0.925195, -0.944741],
                [1.734910, 0.925195, 0.944741],
                [1.744330, 0.670825, -0.949871],
                [1.744330, 0.670825, 0.949871],
                [1.746440, 0.343945, -0.547339],
                [1.746440, 0.343945, 0.547339],
                [1.750000, 0.234375, 0.000000],
                [1.772930, 0.453516, -0.754336],
                [1.772930, 0.453516, 0.754336],
                [1.805360, 1.100390, -0.768135],
                [1.805360, 1.100390, 0.768135],
                [1.806870, 1.471870, -0.375664],
                [1.806870, 1.471870, 0.375664],
                [1.807750, 1.286130, -0.566554],
                [1.807750, 1.286130, 0.566554],
                [1.808680, 0.669440, -0.415335],
                [1.808680, 0.669440, 0.415335],
                [1.815230, 0.556498, -0.292881],
                [1.815230, 0.556498, 0.292881],
                [1.817580, 0.343945, -0.187036],
                [1.817580, 0.343945, 0.187036],
                [1.818500, 0.493823, -0.107904],
                [1.818500, 0.493823, 0.107904],
                [1.825180, 0.591650, -0.776567],
                [1.825180, 0.591650, 0.776567],
                [1.843750, 1.471870, 0.000000],
                [1.844080, 1.273110, -0.106836],
                [1.844080, 1.273110, 0.106836],
                [1.845000, 0.750000, -0.785000],
                [1.845000, 0.750000, 0.785000],
                [1.849890, 1.212450, -0.289984],
                [1.849890, 1.212450, 0.289984],
                [1.855120, 0.522583, -0.581402],
                [1.855120, 0.522583, 0.581402],
                [1.860070, 1.106280, -0.412082],
                [1.860070, 1.106280, 0.412082],
                [1.872860, 0.972820, -0.473131],
                [1.872860, 0.972820, 0.473131],
                [1.881390, 1.286130, -0.193602],
                [1.881390, 1.286130, 0.193602],
                [1.882060, 0.925195, -0.589845],
                [1.882060, 0.925195, 0.589845],
                [1.883440, 0.453516, -0.391582],
                [1.883440, 0.453516, 0.391582],
                [1.886520, 0.830257, -0.473131],
                [1.886520, 0.830257, 0.473131],
                [1.892280, 0.670825, -0.593047],
                [1.892280, 0.670825, 0.593047],
                [1.908980, 0.762851, -0.457368],
                [1.908980, 0.762851, 0.457368],
                [1.917890, 1.100390, -0.398745],
                [1.917890, 1.100390, 0.398745],
                [1.921880, 0.453516, 0.000000],
                [1.925720, 0.624968, -0.368660],
                [1.925720, 0.624968, 0.368660],
                [1.930690, 0.522583, -0.198676],
                [1.930690, 0.522583, 0.198676],
                [1.935200, 0.536667, -0.215052],
                [1.935200, 0.536667, 0.215052],
                [1.938790, 0.503174, 0.000000],
                [1.938950, 0.591650, -0.403123],
                [1.938950, 0.591650, 0.403123],
                [1.957030, 1.100390, 0.000000],
                [1.958730, 0.925195, -0.201561],
                [1.958730, 0.925195, 0.201561],
                [1.960000, 0.750000, -0.407500],
                [1.960000, 0.750000, 0.407500],
                [1.969370, 0.670825, -0.202656],
                [1.969370, 0.670825, 0.202656],
                [1.978520, 0.591650, 0.000000],
                [1.984960, 1.304590, 0.000000],
                [1.991360, 1.273310, -0.210782],
                [1.991360, 1.273310, 0.210782],
                [2.000000, 0.750000, 0.000000],
                [2.007990, 0.721263, -0.409761],
                [2.007990, 0.721263, 0.409761],
                [2.008210, 1.190840, -0.361340],
                [2.008210, 1.190840, 0.361340],
                [2.024710, 0.614949, -0.288958],
                [2.024710, 0.614949, 0.288958],
                [2.032050, 1.074240, -0.451675],
                [2.032050, 1.074240, 0.451675],
                [2.033790, 0.556062, -0.106458],
                [2.033790, 0.556062, 0.106458],
                [2.059380, 0.940576, -0.481787],
                [2.059380, 0.940576, 0.481787],
                [2.086440, 1.330480, -0.101581],
                [2.086440, 1.330480, 0.101581],
                [2.086700, 0.806915, -0.451675],
                [2.086700, 0.806915, 0.451675],
                [2.101410, 1.278150, -0.275720],
                [2.101410, 1.278150, 0.275720],
                [2.110530, 0.690317, -0.361340],
                [2.110530, 0.690317, 0.361340],
                [2.127390, 0.607845, -0.210782],
                [2.127390, 0.607845, 0.210782],
                [2.127600, 1.186560, -0.391812],
                [2.127600, 1.186560, 0.391812],
                [2.133790, 0.576563, 0.000000],
                [2.160540, 1.071430, -0.449859],
                [2.160540, 1.071430, 0.449859],
                [2.169220, 0.790259, -0.399360],
                [2.169220, 0.790259, 0.399360],
                [2.179690, 1.385160, 0.000000],
                [2.189760, 1.358870, -0.195542],
                [2.189760, 1.358870, 0.195542],
                [2.194810, 0.691761, -0.281559],
                [2.194810, 0.691761, 0.281559],
                [2.195710, 0.948444, -0.449859],
                [2.195710, 0.948444, 0.449859],
                [2.208370, 0.637082, -0.103732],
                [2.208370, 0.637082, 0.103732],
                [2.216310, 1.289570, -0.335215],
                [2.216310, 1.289570, 0.335215],
                [2.220200, 0.891314, -0.434457],
                [2.220200, 0.891314, 0.434457],
                [2.248570, 1.433000, -0.092384],
                [2.248570, 1.433000, 0.092384],
                [2.253840, 1.191600, -0.419019],
                [2.253840, 1.191600, 0.419019],
                [2.259440, 0.772489, -0.349967],
                [2.259440, 0.772489, 0.349967],
                [2.268570, 1.390160, -0.250758],
                [2.268570, 1.390160, 0.250758],
                [2.281890, 0.696393, -0.204147],
                [2.281890, 0.696393, 0.204147],
                [2.290410, 0.667529, 0.000000],
                [2.296880, 1.079300, -0.446953],
                [2.296880, 1.079300, 0.446953],
                [2.299250, 0.874953, -0.384664],
                [2.299250, 0.874953, 0.384664],
                [2.303580, 1.315200, -0.356340],
                [2.303580, 1.315200, 0.356340],
                [2.306440, 1.504400, 0.000000],
                [2.318380, 1.483560, -0.173996],
                [2.318380, 1.483560, 0.173996],
                [2.330690, 0.784406, -0.271218],
                [2.330690, 0.784406, 0.271218],
                [2.339910, 0.966989, -0.419019],
                [2.339910, 0.966989, 0.419019],
                [2.347590, 0.734271, -0.099922],
                [2.347590, 0.734271, 0.099922],
                [2.347590, 1.220960, -0.409131],
                [2.347590, 1.220960, 0.409131],
                [2.349840, 1.428640, -0.298279],
                [2.349840, 1.428640, 0.298279],
                [2.353180, 1.568160, -0.080823],
                [2.353180, 1.568160, 0.080823],
                [2.375750, 1.535310, -0.219377],
                [2.375750, 1.535310, 0.219377],
                [2.377440, 0.869019, -0.335215],
                [2.377440, 0.869019, 0.335215],
                [2.387500, 1.650000, 0.000000],
                [2.394320, 1.350980, -0.372849],
                [2.394320, 1.350980, 0.372849],
                [2.394600, 1.120300, -0.409131],
                [2.394600, 1.120300, 0.409131],
                [2.400390, 1.634690, -0.149297],
                [2.400390, 1.634690, 0.149297],
                [2.403990, 0.799722, -0.195542],
                [2.403990, 0.799722, 0.195542],
                [2.414060, 0.773438, 0.000000],
                [2.415240, 1.477810, -0.311747],
                [2.415240, 1.477810, 0.311747],
                [2.434380, 1.594340, -0.255938],
                [2.434380, 1.594340, 0.255938],
                [2.438610, 1.026060, -0.356340],
                [2.438610, 1.026060, 0.356340],
                [2.445310, 1.261960, -0.397705],
                [2.445310, 1.261960, 0.397705],
                [2.451680, 1.805340, -0.063087],
                [2.451680, 1.805340, 0.063087],
                [2.464890, 1.405520, -0.357931],
                [2.464890, 1.405520, 0.357931],
                [2.473620, 0.951099, -0.250758],
                [2.473620, 0.951099, 0.250758],
                [2.477680, 1.786380, -0.171237],
                [2.477680, 1.786380, 0.171237],
                [2.482420, 1.537280, -0.319922],
                [2.482420, 1.537280, 0.319922],
                [2.493620, 0.908264, -0.092384],
                [2.493620, 0.908264, 0.092384],
                [2.496300, 1.172950, -0.372849],
                [2.496300, 1.172950, 0.372849],
                [2.501560, 1.971090, 0.000000],
                [2.517270, 1.965550, -0.103052],
                [2.517270, 1.965550, 0.103052],
                [2.517920, 1.328310, -0.357931],
                [2.517920, 1.328310, 0.357931],
                [2.523180, 1.753220, -0.243336],
                [2.523180, 1.753220, 0.243336],
                [2.537500, 1.471870, -0.341250],
                [2.537500, 1.471870, 0.341250],
                [2.540780, 1.095290, -0.298279],
                [2.540780, 1.095290, 0.298279],
                [2.549110, 2.044640, -0.047716],
                [2.549110, 2.044640, 0.047716],
                [2.558690, 1.950950, -0.176660],
                [2.558690, 1.950950, 0.176660],
                [2.567570, 1.256030, -0.311747],
                [2.567570, 1.256030, 0.311747],
                [2.572250, 1.040360, -0.173996],
                [2.572250, 1.040360, 0.173996],
                [2.579100, 2.121970, 0.000000],
                [2.580390, 1.711530, -0.279386],
                [2.580390, 1.711530, 0.279386],
                [2.581010, 2.037730, -0.129515],
                [2.581010, 2.037730, 0.129515],
                [2.584180, 1.019530, 0.000000],
                [2.592580, 1.406470, -0.319922],
                [2.592580, 1.406470, 0.319922],
                [2.598490, 2.119920, -0.087812],
                [2.598490, 2.119920, 0.087812],
                [2.601780, 1.554720, -0.304019],
                [2.601780, 1.554720, 0.304019],
                [2.607070, 1.198530, -0.219377],
                [2.607070, 1.198530, 0.219377],
                [2.611620, 1.691280, -0.287908],
                [2.611620, 1.691280, 0.287908],
                [2.617250, 1.930310, -0.220825],
                [2.617250, 1.930310, 0.220825],
                [2.629630, 1.165680, -0.080823],
                [2.629630, 1.165680, 0.080823],
                [2.637880, 2.025550, -0.180818],
                [2.637880, 2.025550, 0.180818],
                [2.640630, 1.349410, -0.255938],
                [2.640630, 1.349410, 0.255938],
                [2.649600, 2.114510, -0.150535],
                [2.649600, 2.114510, 0.150535],
                [2.650840, 2.185470, -0.042461],
                [2.650840, 2.185470, 0.042461],
                [2.653910, 1.504200, -0.264113],
                [2.653910, 1.504200, 0.264113],
                [2.665420, 1.649250, -0.266995],
                [2.665420, 1.649250, 0.266995],
                [2.674610, 1.309060, -0.149297],
                [2.674610, 1.309060, 0.149297],
                [2.678230, 1.782540, -0.252819],
                [2.678230, 1.782540, 0.252819],
                [2.684380, 1.906640, -0.235547],
                [2.684380, 1.906640, 0.235547],
                [2.687500, 1.293750, 0.000000],
                [2.691900, 2.183610, -0.115251],
                [2.691900, 2.183610, 0.115251],
                [2.696450, 1.463800, -0.185857],
                [2.696450, 1.463800, 0.185857],
                [2.700000, 2.250000, 0.000000],
                [2.708080, 2.010370, -0.208084],
                [2.708080, 2.010370, 0.208084],
                [2.717030, 1.611670, -0.213596],
                [2.717030, 1.611670, 0.213596],
                [2.720760, 1.440720, -0.068474],
                [2.720760, 1.440720, 0.068474],
                [2.725780, 2.250000, -0.082031],
                [2.725780, 2.250000, 0.082031],
                [2.725990, 2.106430, -0.175250],
                [2.725990, 2.106430, 0.175250],
                [2.736000, 1.751550, -0.219519],
                [2.736000, 1.751550, 0.219519],
                [2.750210, 2.269190, -0.039734],
                [2.750210, 2.269190, 0.039734],
                [2.751500, 1.882970, -0.220825],
                [2.751500, 1.882970, 0.220825],
                [2.753540, 1.585080, -0.124598],
                [2.753540, 1.585080, 0.124598],
                [2.767380, 1.575000, 0.000000],
                [2.775560, 2.284000, 0.000000],
                [2.780990, 1.994370, -0.208084],
                [2.780990, 1.994370, 0.208084],
                [2.783030, 1.726700, -0.154476],
                [2.783030, 1.726700, 0.154476],
                [2.793750, 2.250000, -0.140625],
                [2.793750, 2.250000, 0.140625],
                [2.797820, 2.271750, -0.107849],
                [2.797820, 2.271750, 0.107849],
                [2.799490, 2.292750, -0.076904],
                [2.799490, 2.292750, 0.076904],
                [2.800000, 2.250000, 0.000000],
                [2.804690, 2.098100, -0.200713],
                [2.804690, 2.098100, 0.200713],
                [2.809900, 1.712500, -0.056912],
                [2.809900, 1.712500, 0.056912],
                [2.810060, 1.862330, -0.176660],
                [2.810060, 1.862330, 0.176660],
                [2.812010, 2.178150, -0.169843],
                [2.812010, 2.178150, 0.169843],
                [2.812740, 2.297540, -0.035632],
                [2.812740, 2.297540, 0.035632],
                [2.817190, 2.250000, -0.049219],
                [2.817190, 2.250000, 0.049219],
                [2.825000, 2.306250, 0.000000],
                [2.830110, 2.271290, -0.025891],
                [2.830110, 2.271290, 0.025891],
                [2.840630, 2.292190, 0.000000],
                [2.844790, 2.299640, -0.029993],
                [2.844790, 2.299640, 0.029993],
                [2.850920, 2.307160, -0.065625],
                [2.850920, 2.307160, 0.065625],
                [2.851180, 1.979190, -0.180818],
                [2.851180, 1.979190, 0.180818],
                [2.851480, 1.847730, -0.103052],
                [2.851480, 1.847730, 0.103052],
                [2.860480, 2.300930, -0.096716],
                [2.860480, 2.300930, 0.096716],
                [2.862500, 2.250000, -0.084375],
                [2.862500, 2.250000, 0.084375],
                [2.862630, 2.292980, -0.054346],
                [2.862630, 2.292980, 0.054346],
                [2.865740, 2.272010, -0.070276],
                [2.865740, 2.272010, 0.070276],
                [2.867190, 1.842190, 0.000000],
                [2.872280, 2.294250, -0.131836],
                [2.872280, 2.294250, 0.131836],
                [2.883390, 2.089770, -0.175250],
                [2.883390, 2.089770, 0.175250],
                [2.888360, 2.301190, -0.081409],
                [2.888360, 2.301190, 0.081409],
                [2.898270, 2.170880, -0.194382],
                [2.898270, 2.170880, 0.194382],
                [2.908050, 1.967000, -0.129515],
                [2.908050, 1.967000, 0.129515],
                [2.919240, 2.309550, -0.112500],
                [2.919240, 2.309550, 0.112500],
                [2.920640, 2.295070, -0.093164],
                [2.920640, 2.295070, 0.093164],
                [2.932790, 2.131030, -0.172211],
                [2.932790, 2.131030, 0.172211],
                [2.939800, 2.273260, -0.158936],
                [2.939800, 2.273260, 0.158936],
                [2.939960, 1.960100, -0.047716],
                [2.939960, 1.960100, 0.047716],
                [2.959780, 2.081680, -0.150535],
                [2.959780, 2.081680, 0.150535],
                [2.969950, 2.274120, -0.103564],
                [2.969950, 2.274120, 0.103564],
                [3.000000, 2.250000, -0.187500],
                [3.000000, 2.250000, -0.112500],
                [3.000000, 2.250000, 0.112500],
                [3.000000, 2.250000, 0.187500],
                [3.002810, 2.304840, -0.142529],
                [3.002810, 2.304840, 0.142529],
                [3.010890, 2.076270, -0.087812],
                [3.010890, 2.076270, 0.087812],
                [3.015780, 2.305710, -0.119971],
                [3.015780, 2.305710, 0.119971],
                [3.030270, 2.074220, 0.000000],
                [3.041500, 2.125670, -0.116276],
                [3.041500, 2.125670, 0.116276],
                [3.043230, 2.211080, -0.166431],
                [3.043230, 2.211080, 0.166431],
                [3.068420, 2.173450, -0.143215],
                [3.068420, 2.173450, 0.143215],
                [3.079290, 2.123060, -0.042838],
                [3.079290, 2.123060, 0.042838],
                [3.093160, 2.298780, -0.175781],
                [3.093160, 2.298780, 0.175781],
                [3.096680, 2.301420, -0.124219],
                [3.096680, 2.301420, 0.124219],
                [3.126560, 2.316800, -0.150000],
                [3.126560, 2.316800, 0.150000],
                [3.126720, 2.277290, -0.103564],
                [3.126720, 2.277290, 0.103564],
                [3.126910, 2.171280, -0.083542],
                [3.126910, 2.171280, 0.083542],
                [3.137500, 2.250000, -0.084375],
                [3.137500, 2.250000, 0.084375],
                [3.149100, 2.170460, 0.000000],
                [3.153370, 2.275520, -0.158936],
                [3.153370, 2.275520, 0.158936],
                [3.168950, 2.211180, -0.112353],
                [3.168950, 2.211180, 0.112353],
                [3.182810, 2.250000, -0.049219],
                [3.182810, 2.250000, 0.049219],
                [3.200000, 2.250000, 0.000000],
                [3.206250, 2.250000, -0.140625],
                [3.206250, 2.250000, 0.140625],
                [3.207460, 2.312510, -0.119971],
                [3.207460, 2.312510, 0.119971],
                [3.212560, 2.210430, -0.041393],
                [3.212560, 2.210430, 0.041393],
                [3.216920, 2.310730, -0.142529],
                [3.216920, 2.310730, 0.142529],
                [3.230940, 2.279400, -0.070276],
                [3.230940, 2.279400, 0.070276],
                [3.267240, 2.278140, -0.025891],
                [3.267240, 2.278140, 0.025891],
                [3.272720, 2.307760, -0.093164],
                [3.272720, 2.307760, 0.093164],
                [3.274220, 2.250000, -0.082031],
                [3.274220, 2.250000, 0.082031],
                [3.295340, 2.277030, -0.107849],
                [3.295340, 2.277030, 0.107849],
                [3.300000, 2.250000, 0.000000],
                [3.314050, 2.303310, -0.131836],
                [3.314050, 2.303310, 0.131836],
                [3.330730, 2.309850, -0.054346],
                [3.330730, 2.309850, 0.054346],
                [3.333890, 2.324050, -0.112500],
                [3.333890, 2.324050, 0.112500],
                [3.334890, 2.317020, -0.081409],
                [3.334890, 2.317020, 0.081409],
                [3.342360, 2.280060, -0.039734],
                [3.342360, 2.280060, 0.039734],
                [3.355430, 2.302700, 0.000000],
                [3.359250, 2.314650, -0.096716],
                [3.359250, 2.314650, 0.096716],
                [3.379120, 2.316580, -0.029993],
                [3.379120, 2.316580, 0.029993],
                [3.386840, 2.304810, -0.076904],
                [3.386840, 2.304810, 0.076904],
                [3.402210, 2.326440, -0.065625],
                [3.402210, 2.326440, 0.065625],
                [3.406390, 2.318500, -0.035632],
                [3.406390, 2.318500, 0.035632],
                [3.408380, 2.315430, 0.000000],
                [3.428120, 2.327340, 0.000000]
            ];

            var indices = [
                [1454, 1468, 1458],
                [1448, 1454, 1458],
                [1461, 1448, 1458],
                [1468, 1461, 1458],
                [1429, 1454, 1440],
                [1421, 1429, 1440],
                [1448, 1421, 1440],
                [1454, 1448, 1440],
                [1380, 1429, 1398],
                [1373, 1380, 1398],
                [1421, 1373, 1398],
                [1429, 1421, 1398],
                [1327, 1380, 1349],
                [1319, 1327, 1349],
                [1373, 1319, 1349],
                [1380, 1373, 1349],
                [1448, 1461, 1460],
                [1456, 1448, 1460],
                [1471, 1456, 1460],
                [1461, 1471, 1460],
                [1421, 1448, 1442],
                [1433, 1421, 1442],
                [1456, 1433, 1442],
                [1448, 1456, 1442],
                [1373, 1421, 1400],
                [1382, 1373, 1400],
                [1433, 1382, 1400],
                [1421, 1433, 1400],
                [1319, 1373, 1351],
                [1329, 1319, 1351],
                [1382, 1329, 1351],
                [1373, 1382, 1351],
                [1264, 1327, 1289],
                [1258, 1264, 1289],
                [1319, 1258, 1289],
                [1327, 1319, 1289],
                [1192, 1264, 1228],
                [1188, 1192, 1228],
                [1258, 1188, 1228],
                [1264, 1258, 1228],
                [1100, 1192, 1157],
                [1098, 1100, 1157],
                [1188, 1098, 1157],
                [1192, 1188, 1157],
                [922, 1100, 1006],
                [928, 922, 1006],
                [1098, 928, 1006],
                [1100, 1098, 1006],
                [1258, 1319, 1291],
                [1266, 1258, 1291],
                [1329, 1266, 1291],
                [1319, 1329, 1291],
                [1188, 1258, 1230],
                [1194, 1188, 1230],
                [1266, 1194, 1230],
                [1258, 1266, 1230],
                [1098, 1188, 1159],
                [1102, 1098, 1159],
                [1194, 1102, 1159],
                [1188, 1194, 1159],
                [928, 1098, 1008],
                [933, 928, 1008],
                [1102, 933, 1008],
                [1098, 1102, 1008],
                [1456, 1471, 1475],
                [1481, 1456, 1475],
                [1482, 1481, 1475],
                [1471, 1482, 1475],
                [1433, 1456, 1450],
                [1444, 1433, 1450],
                [1481, 1444, 1450],
                [1456, 1481, 1450],
                [1382, 1433, 1412],
                [1392, 1382, 1412],
                [1444, 1392, 1412],
                [1433, 1444, 1412],
                [1329, 1382, 1357],
                [1331, 1329, 1357],
                [1392, 1331, 1357],
                [1382, 1392, 1357],
                [1481, 1482, 1490],
                [1500, 1481, 1490],
                [1502, 1500, 1490],
                [1482, 1502, 1490],
                [1444, 1481, 1470],
                [1465, 1444, 1470],
                [1500, 1465, 1470],
                [1481, 1500, 1470],
                [1392, 1444, 1431],
                [1410, 1392, 1431],
                [1465, 1410, 1431],
                [1444, 1465, 1431],
                [1331, 1392, 1371],
                [1345, 1331, 1371],
                [1410, 1345, 1371],
                [1392, 1410, 1371],
                [1266, 1329, 1297],
                [1276, 1266, 1297],
                [1331, 1276, 1297],
                [1329, 1331, 1297],
                [1194, 1266, 1232],
                [1200, 1194, 1232],
                [1276, 1200, 1232],
                [1266, 1276, 1232],
                [1102, 1194, 1163],
                [1106, 1102, 1163],
                [1200, 1106, 1163],
                [1194, 1200, 1163],
                [933, 1102, 1016],
                [929, 933, 1016],
                [1106, 929, 1016],
                [1102, 1106, 1016],
                [1276, 1331, 1307],
                [1283, 1276, 1307],
                [1345, 1283, 1307],
                [1331, 1345, 1307],
                [1200, 1276, 1238],
                [1210, 1200, 1238],
                [1283, 1210, 1238],
                [1276, 1283, 1238],
                [1106, 1200, 1167],
                [1116, 1106, 1167],
                [1210, 1116, 1167],
                [1200, 1210, 1167],
                [929, 1106, 1022],
                [923, 929, 1022],
                [1116, 923, 1022],
                [1106, 1116, 1022],
                [755, 922, 849],
                [757, 755, 849],
                [928, 757, 849],
                [922, 928, 849],
                [663, 755, 698],
                [667, 663, 698],
                [757, 667, 698],
                [755, 757, 698],
                [591, 663, 627],
                [597, 591, 627],
                [667, 597, 627],
                [663, 667, 627],
                [528, 591, 566],
                [536, 528, 566],
                [597, 536, 566],
                [591, 597, 566],
                [757, 928, 847],
                [753, 757, 847],
                [933, 753, 847],
                [928, 933, 847],
                [667, 757, 696],
                [661, 667, 696],
                [753, 661, 696],
                [757, 753, 696],
                [597, 667, 625],
                [589, 597, 625],
                [661, 589, 625],
                [667, 661, 625],
                [536, 597, 564],
                [526, 536, 564],
                [589, 526, 564],
                [597, 589, 564],
                [475, 528, 506],
                [482, 475, 506],
                [536, 482, 506],
                [528, 536, 506],
                [426, 475, 457],
                [434, 426, 457],
                [482, 434, 457],
                [475, 482, 457],
                [401, 426, 415],
                [407, 401, 415],
                [434, 407, 415],
                [426, 434, 415],
                [386, 401, 397],
                [393, 386, 397],
                [407, 393, 397],
                [401, 407, 397],
                [482, 536, 504],
                [473, 482, 504],
                [526, 473, 504],
                [536, 526, 504],
                [434, 482, 455],
                [422, 434, 455],
                [473, 422, 455],
                [482, 473, 455],
                [407, 434, 413],
                [399, 407, 413],
                [422, 399, 413],
                [434, 422, 413],
                [393, 407, 395],
                [383, 393, 395],
                [399, 383, 395],
                [407, 399, 395],
                [753, 933, 839],
                [749, 753, 839],
                [929, 749, 839],
                [933, 929, 839],
                [661, 753, 692],
                [655, 661, 692],
                [749, 655, 692],
                [753, 749, 692],
                [589, 661, 623],
                [579, 589, 623],
                [655, 579, 623],
                [661, 655, 623],
                [526, 589, 558],
                [524, 526, 558],
                [579, 524, 558],
                [589, 579, 558],
                [749, 929, 833],
                [741, 749, 833],
                [923, 741, 833],
                [929, 923, 833],
                [655, 749, 688],
                [647, 655, 688],
                [741, 647, 688],
                [749, 741, 688],
                [579, 655, 617],
                [574, 579, 617],
                [647, 574, 617],
                [655, 647, 617],
                [524, 579, 548],
                [512, 524, 548],
                [574, 512, 548],
                [579, 574, 548],
                [473, 526, 498],
                [463, 473, 498],
                [524, 463, 498],
                [526, 524, 498],
                [422, 473, 443],
                [411, 422, 443],
                [463, 411, 443],
                [473, 463, 443],
                [399, 422, 405],
                [374, 399, 405],
                [411, 374, 405],
                [422, 411, 405],
                [383, 399, 380],
                [372, 383, 380],
                [374, 372, 380],
                [399, 374, 380],
                [463, 524, 484],
                [447, 463, 484],
                [512, 447, 484],
                [524, 512, 484],
                [411, 463, 424],
                [392, 411, 424],
                [447, 392, 424],
                [463, 447, 424],
                [374, 411, 385],
                [357, 374, 385],
                [392, 357, 385],
                [411, 392, 385],
                [372, 374, 365],
                [353, 372, 365],
                [357, 353, 365],
                [374, 357, 365],
                [400, 386, 396],
                [406, 400, 396],
                [393, 406, 396],
                [386, 393, 396],
                [425, 400, 414],
                [433, 425, 414],
                [406, 433, 414],
                [400, 406, 414],
                [474, 425, 456],
                [481, 474, 456],
                [433, 481, 456],
                [425, 433, 456],
                [527, 474, 505],
                [535, 527, 505],
                [481, 535, 505],
                [474, 481, 505],
                [406, 393, 394],
                [398, 406, 394],
                [383, 398, 394],
                [393, 383, 394],
                [433, 406, 412],
                [421, 433, 412],
                [398, 421, 412],
                [406, 398, 412],
                [481, 433, 454],
                [472, 481, 454],
                [421, 472, 454],
                [433, 421, 454],
                [535, 481, 503],
                [525, 535, 503],
                [472, 525, 503],
                [481, 472, 503],
                [590, 527, 565],
                [596, 590, 565],
                [535, 596, 565],
                [527, 535, 565],
                [662, 590, 626],
                [666, 662, 626],
                [596, 666, 626],
                [590, 596, 626],
                [754, 662, 697],
                [756, 754, 697],
                [666, 756, 697],
                [662, 666, 697],
                [919, 754, 848],
                [927, 919, 848],
                [756, 927, 848],
                [754, 756, 848],
                [596, 535, 563],
                [588, 596, 563],
                [525, 588, 563],
                [535, 525, 563],
                [666, 596, 624],
                [660, 666, 624],
                [588, 660, 624],
                [596, 588, 624],
                [756, 666, 695],
                [752, 756, 695],
                [660, 752, 695],
                [666, 660, 695],
                [927, 756, 846],
                [932, 927, 846],
                [752, 932, 846],
                [756, 752, 846],
                [398, 383, 379],
                [373, 398, 379],
                [372, 373, 379],
                [383, 372, 379],
                [421, 398, 404],
                [410, 421, 404],
                [373, 410, 404],
                [398, 373, 404],
                [472, 421, 442],
                [462, 472, 442],
                [410, 462, 442],
                [421, 410, 442],
                [525, 472, 497],
                [523, 525, 497],
                [462, 523, 497],
                [472, 462, 497],
                [373, 372, 364],
                [356, 373, 364],
                [353, 356, 364],
                [372, 353, 364],
                [410, 373, 384],
                [391, 410, 384],
                [356, 391, 384],
                [373, 356, 384],
                [462, 410, 423],
                [446, 462, 423],
                [391, 446, 423],
                [410, 391, 423],
                [523, 462, 483],
                [511, 523, 483],
                [446, 511, 483],
                [462, 446, 483],
                [588, 525, 557],
                [578, 588, 557],
                [523, 578, 557],
                [525, 523, 557],
                [660, 588, 622],
                [654, 660, 622],
                [578, 654, 622],
                [588, 578, 622],
                [752, 660, 691],
                [748, 752, 691],
                [654, 748, 691],
                [660, 654, 691],
                [932, 752, 838],
                [926, 932, 838],
                [748, 926, 838],
                [752, 748, 838],
                [578, 523, 547],
                [573, 578, 547],
                [511, 573, 547],
                [523, 511, 547],
                [654, 578, 616],
                [646, 654, 616],
                [573, 646, 616],
                [578, 573, 616],
                [748, 654, 687],
                [740, 748, 687],
                [646, 740, 687],
                [654, 646, 687],
                [926, 748, 832],
                [918, 926, 832],
                [740, 918, 832],
                [748, 740, 832],
                [1099, 919, 1005],
                [1097, 1099, 1005],
                [927, 1097, 1005],
                [919, 927, 1005],
                [1191, 1099, 1156],
                [1187, 1191, 1156],
                [1097, 1187, 1156],
                [1099, 1097, 1156],
                [1263, 1191, 1227],
                [1257, 1263, 1227],
                [1187, 1257, 1227],
                [1191, 1187, 1227],
                [1326, 1263, 1288],
                [1318, 1326, 1288],
                [1257, 1318, 1288],
                [1263, 1257, 1288],
                [1097, 927, 1007],
                [1101, 1097, 1007],
                [932, 1101, 1007],
                [927, 932, 1007],
                [1187, 1097, 1158],
                [1193, 1187, 1158],
                [1101, 1193, 1158],
                [1097, 1101, 1158],
                [1257, 1187, 1229],
                [1265, 1257, 1229],
                [1193, 1265, 1229],
                [1187, 1193, 1229],
                [1318, 1257, 1290],
                [1328, 1318, 1290],
                [1265, 1328, 1290],
                [1257, 1265, 1290],
                [1379, 1326, 1348],
                [1372, 1379, 1348],
                [1318, 1372, 1348],
                [1326, 1318, 1348],
                [1428, 1379, 1397],
                [1420, 1428, 1397],
                [1372, 1420, 1397],
                [1379, 1372, 1397],
                [1453, 1428, 1439],
                [1447, 1453, 1439],
                [1420, 1447, 1439],
                [1428, 1420, 1439],
                [1468, 1453, 1457],
                [1461, 1468, 1457],
                [1447, 1461, 1457],
                [1453, 1447, 1457],
                [1372, 1318, 1350],
                [1381, 1372, 1350],
                [1328, 1381, 1350],
                [1318, 1328, 1350],
                [1420, 1372, 1399],
                [1432, 1420, 1399],
                [1381, 1432, 1399],
                [1372, 1381, 1399],
                [1447, 1420, 1441],
                [1455, 1447, 1441],
                [1432, 1455, 1441],
                [1420, 1432, 1441],
                [1461, 1447, 1459],
                [1471, 1461, 1459],
                [1455, 1471, 1459],
                [1447, 1455, 1459],
                [1101, 932, 1015],
                [1105, 1101, 1015],
                [926, 1105, 1015],
                [932, 926, 1015],
                [1193, 1101, 1162],
                [1199, 1193, 1162],
                [1105, 1199, 1162],
                [1101, 1105, 1162],
                [1265, 1193, 1231],
                [1275, 1265, 1231],
                [1199, 1275, 1231],
                [1193, 1199, 1231],
                [1328, 1265, 1296],
                [1330, 1328, 1296],
                [1275, 1330, 1296],
                [1265, 1275, 1296],
                [1105, 926, 1021],
                [1115, 1105, 1021],
                [918, 1115, 1021],
                [926, 918, 1021],
                [1199, 1105, 1166],
                [1209, 1199, 1166],
                [1115, 1209, 1166],
                [1105, 1115, 1166],
                [1275, 1199, 1237],
                [1282, 1275, 1237],
                [1209, 1282, 1237],
                [1199, 1209, 1237],
                [1330, 1275, 1306],
                [1344, 1330, 1306],
                [1282, 1344, 1306],
                [1275, 1282, 1306],
                [1381, 1328, 1356],
                [1391, 1381, 1356],
                [1330, 1391, 1356],
                [1328, 1330, 1356],
                [1432, 1381, 1411],
                [1443, 1432, 1411],
                [1391, 1443, 1411],
                [1381, 1391, 1411],
                [1455, 1432, 1449],
                [1480, 1455, 1449],
                [1443, 1480, 1449],
                [1432, 1443, 1449],
                [1471, 1455, 1474],
                [1482, 1471, 1474],
                [1480, 1482, 1474],
                [1455, 1480, 1474],
                [1391, 1330, 1370],
                [1409, 1391, 1370],
                [1344, 1409, 1370],
                [1330, 1344, 1370],
                [1443, 1391, 1430],
                [1464, 1443, 1430],
                [1409, 1464, 1430],
                [1391, 1409, 1430],
                [1480, 1443, 1469],
                [1499, 1480, 1469],
                [1464, 1499, 1469],
                [1443, 1464, 1469],
                [1482, 1480, 1489],
                [1502, 1482, 1489],
                [1499, 1502, 1489],
                [1480, 1499, 1489],
                [1500, 1502, 1533],
                [1572, 1500, 1533],
                [1585, 1572, 1533],
                [1502, 1585, 1533],
                [1465, 1500, 1519],
                [1555, 1465, 1519],
                [1572, 1555, 1519],
                [1500, 1572, 1519],
                [1410, 1465, 1496],
                [1510, 1410, 1496],
                [1555, 1510, 1496],
                [1465, 1555, 1496],
                [1345, 1410, 1427],
                [1436, 1345, 1427],
                [1510, 1436, 1427],
                [1410, 1510, 1427],
                [1283, 1345, 1341],
                [1333, 1283, 1341],
                [1436, 1333, 1341],
                [1345, 1436, 1341],
                [1210, 1283, 1270],
                [1242, 1210, 1270],
                [1333, 1242, 1270],
                [1283, 1333, 1270],
                [1116, 1210, 1184],
                [1143, 1116, 1184],
                [1242, 1143, 1184],
                [1210, 1242, 1184],
                [923, 1116, 1037],
                [917, 923, 1037],
                [1143, 917, 1037],
                [1116, 1143, 1037],
                [1572, 1585, 1599],
                [1611, 1572, 1599],
                [1622, 1611, 1599],
                [1585, 1622, 1599],
                [1555, 1572, 1574],
                [1570, 1555, 1574],
                [1611, 1570, 1574],
                [1572, 1611, 1574],
                [1510, 1555, 1537],
                [1527, 1510, 1537],
                [1570, 1527, 1537],
                [1555, 1570, 1537],
                [1436, 1510, 1494],
                [1467, 1436, 1494],
                [1527, 1467, 1494],
                [1510, 1527, 1494],
                [1611, 1622, 1624],
                [1626, 1611, 1624],
                [1633, 1626, 1624],
                [1622, 1633, 1624],
                [1570, 1611, 1601],
                [1589, 1570, 1601],
                [1626, 1589, 1601],
                [1611, 1626, 1601],
                [1527, 1570, 1561],
                [1535, 1527, 1561],
                [1589, 1535, 1561],
                [1570, 1589, 1561],
                [1467, 1527, 1508],
                [1479, 1467, 1508],
                [1535, 1479, 1508],
                [1527, 1535, 1508],
                [1333, 1436, 1394],
                [1359, 1333, 1394],
                [1467, 1359, 1394],
                [1436, 1467, 1394],
                [1242, 1333, 1299],
                [1254, 1242, 1299],
                [1359, 1254, 1299],
                [1333, 1359, 1299],
                [1143, 1242, 1198],
                [1149, 1143, 1198],
                [1254, 1149, 1198],
                [1242, 1254, 1198],
                [917, 1143, 1057],
                [915, 917, 1057],
                [1149, 915, 1057],
                [1143, 1149, 1057],
                [1359, 1467, 1414],
                [1367, 1359, 1414],
                [1479, 1367, 1414],
                [1467, 1479, 1414],
                [1254, 1359, 1311],
                [1262, 1254, 1311],
                [1367, 1262, 1311],
                [1359, 1367, 1311],
                [1149, 1254, 1212],
                [1155, 1149, 1212],
                [1262, 1155, 1212],
                [1254, 1262, 1212],
                [915, 1149, 1065],
                [913, 915, 1065],
                [1155, 913, 1065],
                [1149, 1155, 1065],
                [741, 923, 818],
                [712, 741, 818],
                [917, 712, 818],
                [923, 917, 818],
                [647, 741, 671],
                [613, 647, 671],
                [712, 613, 671],
                [741, 712, 671],
                [574, 647, 585],
                [522, 574, 585],
                [613, 522, 585],
                [647, 613, 585],
                [512, 574, 514],
                [419, 512, 514],
                [522, 419, 514],
                [574, 522, 514],
                [447, 512, 428],
                [342, 447, 428],
                [419, 342, 428],
                [512, 419, 428],
                [392, 447, 359],
                [308, 392, 359],
                [342, 308, 359],
                [447, 342, 359],
                [357, 392, 329],
                [291, 357, 329],
                [308, 291, 329],
                [392, 308, 329],
                [353, 357, 314],
                [275, 353, 314],
                [291, 275, 314],
                [357, 291, 314],
                [712, 917, 798],
                [706, 712, 798],
                [915, 706, 798],
                [917, 915, 798],
                [613, 712, 657],
                [601, 613, 657],
                [706, 601, 657],
                [712, 706, 657],
                [522, 613, 556],
                [496, 522, 556],
                [601, 496, 556],
                [613, 601, 556],
                [419, 522, 461],
                [388, 419, 461],
                [496, 388, 461],
                [522, 496, 461],
                [706, 915, 790],
                [700, 706, 790],
                [913, 700, 790],
                [915, 913, 790],
                [601, 706, 643],
                [593, 601, 643],
                [700, 593, 643],
                [706, 700, 643],
                [496, 601, 544],
                [488, 496, 544],
                [593, 488, 544],
                [601, 593, 544],
                [388, 496, 441],
                [376, 388, 441],
                [488, 376, 441],
                [496, 488, 441],
                [342, 419, 361],
                [320, 342, 361],
                [388, 320, 361],
                [419, 388, 361],
                [308, 342, 310],
                [293, 308, 310],
                [320, 293, 310],
                [342, 320, 310],
                [291, 308, 289],
                [257, 291, 289],
                [293, 257, 289],
                [308, 293, 289],
                [275, 291, 270],
                [246, 275, 270],
                [257, 246, 270],
                [291, 257, 270],
                [320, 388, 344],
                [312, 320, 344],
                [376, 312, 344],
                [388, 376, 344],
                [293, 320, 302],
                [274, 293, 302],
                [312, 274, 302],
                [320, 312, 302],
                [257, 293, 268],
                [243, 257, 268],
                [274, 243, 268],
                [293, 274, 268],
                [246, 257, 245],
                [232, 246, 245],
                [243, 232, 245],
                [257, 243, 245],
                [356, 353, 313],
                [290, 356, 313],
                [275, 290, 313],
                [353, 275, 313],
                [391, 356, 328],
                [307, 391, 328],
                [290, 307, 328],
                [356, 290, 328],
                [446, 391, 358],
                [341, 446, 358],
                [307, 341, 358],
                [391, 307, 358],
                [511, 446, 427],
                [418, 511, 427],
                [341, 418, 427],
                [446, 341, 427],
                [573, 511, 513],
                [521, 573, 513],
                [418, 521, 513],
                [511, 418, 513],
                [646, 573, 584],
                [612, 646, 584],
                [521, 612, 584],
                [573, 521, 584],
                [740, 646, 670],
                [711, 740, 670],
                [612, 711, 670],
                [646, 612, 670],
                [918, 740, 817],
                [916, 918, 817],
                [711, 916, 817],
                [740, 711, 817],
                [290, 275, 269],
                [256, 290, 269],
                [246, 256, 269],
                [275, 246, 269],
                [307, 290, 288],
                [292, 307, 288],
                [256, 292, 288],
                [290, 256, 288],
                [341, 307, 309],
                [319, 341, 309],
                [292, 319, 309],
                [307, 292, 309],
                [418, 341, 360],
                [387, 418, 360],
                [319, 387, 360],
                [341, 319, 360],
                [256, 246, 244],
                [242, 256, 244],
                [232, 242, 244],
                [246, 232, 244],
                [292, 256, 267],
                [273, 292, 267],
                [242, 273, 267],
                [256, 242, 267],
                [319, 292, 301],
                [311, 319, 301],
                [273, 311, 301],
                [292, 273, 301],
                [387, 319, 343],
                [375, 387, 343],
                [311, 375, 343],
                [319, 311, 343],
                [521, 418, 460],
                [495, 521, 460],
                [387, 495, 460],
                [418, 387, 460],
                [612, 521, 555],
                [600, 612, 555],
                [495, 600, 555],
                [521, 495, 555],
                [711, 612, 656],
                [705, 711, 656],
                [600, 705, 656],
                [612, 600, 656],
                [916, 711, 797],
                [914, 916, 797],
                [705, 914, 797],
                [711, 705, 797],
                [495, 387, 440],
                [487, 495, 440],
                [375, 487, 440],
                [387, 375, 440],
                [600, 495, 543],
                [592, 600, 543],
                [487, 592, 543],
                [495, 487, 543],
                [705, 600, 642],
                [699, 705, 642],
                [592, 699, 642],
                [600, 592, 642],
                [914, 705, 789],
                [912, 914, 789],
                [699, 912, 789],
                [705, 699, 789],
                [1115, 918, 1036],
                [1142, 1115, 1036],
                [916, 1142, 1036],
                [918, 916, 1036],
                [1209, 1115, 1183],
                [1241, 1209, 1183],
                [1142, 1241, 1183],
                [1115, 1142, 1183],
                [1282, 1209, 1269],
                [1332, 1282, 1269],
                [1241, 1332, 1269],
                [1209, 1241, 1269],
                [1344, 1282, 1340],
                [1435, 1344, 1340],
                [1332, 1435, 1340],
                [1282, 1332, 1340],
                [1409, 1344, 1426],
                [1509, 1409, 1426],
                [1435, 1509, 1426],
                [1344, 1435, 1426],
                [1464, 1409, 1495],
                [1554, 1464, 1495],
                [1509, 1554, 1495],
                [1409, 1509, 1495],
                [1499, 1464, 1518],
                [1571, 1499, 1518],
                [1554, 1571, 1518],
                [1464, 1554, 1518],
                [1502, 1499, 1532],
                [1585, 1502, 1532],
                [1571, 1585, 1532],
                [1499, 1571, 1532],
                [1142, 916, 1056],
                [1148, 1142, 1056],
                [914, 1148, 1056],
                [916, 914, 1056],
                [1241, 1142, 1197],
                [1253, 1241, 1197],
                [1148, 1253, 1197],
                [1142, 1148, 1197],
                [1332, 1241, 1298],
                [1358, 1332, 1298],
                [1253, 1358, 1298],
                [1241, 1253, 1298],
                [1435, 1332, 1393],
                [1466, 1435, 1393],
                [1358, 1466, 1393],
                [1332, 1358, 1393],
                [1148, 914, 1064],
                [1154, 1148, 1064],
                [912, 1154, 1064],
                [914, 912, 1064],
                [1253, 1148, 1211],
                [1261, 1253, 1211],
                [1154, 1261, 1211],
                [1148, 1154, 1211],
                [1358, 1253, 1310],
                [1366, 1358, 1310],
                [1261, 1366, 1310],
                [1253, 1261, 1310],
                [1466, 1358, 1413],
                [1478, 1466, 1413],
                [1366, 1478, 1413],
                [1358, 1366, 1413],
                [1509, 1435, 1493],
                [1526, 1509, 1493],
                [1466, 1526, 1493],
                [1435, 1466, 1493],
                [1554, 1509, 1536],
                [1569, 1554, 1536],
                [1526, 1569, 1536],
                [1509, 1526, 1536],
                [1571, 1554, 1573],
                [1610, 1571, 1573],
                [1569, 1610, 1573],
                [1554, 1569, 1573],
                [1585, 1571, 1598],
                [1622, 1585, 1598],
                [1610, 1622, 1598],
                [1571, 1610, 1598],
                [1526, 1466, 1507],
                [1534, 1526, 1507],
                [1478, 1534, 1507],
                [1466, 1478, 1507],
                [1569, 1526, 1560],
                [1588, 1569, 1560],
                [1534, 1588, 1560],
                [1526, 1534, 1560],
                [1610, 1569, 1600],
                [1625, 1610, 1600],
                [1588, 1625, 1600],
                [1569, 1588, 1600],
                [1622, 1610, 1623],
                [1633, 1622, 1623],
                [1625, 1633, 1623],
                [1610, 1625, 1623],
                [1626, 1633, 1628],
                [1621, 1626, 1628],
                [1629, 1621, 1628],
                [1633, 1629, 1628],
                [1589, 1626, 1607],
                [1584, 1589, 1607],
                [1621, 1584, 1607],
                [1626, 1621, 1607],
                [1621, 1629, 1616],
                [1603, 1621, 1616],
                [1612, 1603, 1616],
                [1629, 1612, 1616],
                [1584, 1621, 1593],
                [1568, 1584, 1593],
                [1603, 1568, 1593],
                [1621, 1603, 1593],
                [1535, 1589, 1563],
                [1529, 1535, 1563],
                [1584, 1529, 1563],
                [1589, 1584, 1563],
                [1479, 1535, 1512],
                [1473, 1479, 1512],
                [1529, 1473, 1512],
                [1535, 1529, 1512],
                [1529, 1584, 1557],
                [1521, 1529, 1557],
                [1568, 1521, 1557],
                [1584, 1568, 1557],
                [1473, 1529, 1504],
                [1452, 1473, 1504],
                [1521, 1452, 1504],
                [1529, 1521, 1504],
                [1603, 1612, 1580],
                [1559, 1603, 1580],
                [1566, 1559, 1580],
                [1612, 1566, 1580],
                [1568, 1603, 1565],
                [1525, 1568, 1565],
                [1559, 1525, 1565],
                [1603, 1559, 1565],
                [1521, 1568, 1523],
                [1484, 1521, 1523],
                [1525, 1484, 1523],
                [1568, 1525, 1523],
                [1452, 1521, 1477],
                [1406, 1452, 1477],
                [1484, 1406, 1477],
                [1521, 1484, 1477],
                [1367, 1479, 1417],
                [1361, 1367, 1417],
                [1473, 1361, 1417],
                [1479, 1473, 1417],
                [1262, 1367, 1313],
                [1260, 1262, 1313],
                [1361, 1260, 1313],
                [1367, 1361, 1313],
                [1361, 1473, 1404],
                [1355, 1361, 1404],
                [1452, 1355, 1404],
                [1473, 1452, 1404],
                [1260, 1361, 1303],
                [1248, 1260, 1303],
                [1355, 1248, 1303],
                [1361, 1355, 1303],
                [1155, 1262, 1214],
                [1151, 1155, 1214],
                [1260, 1151, 1214],
                [1262, 1260, 1214],
                [913, 1155, 1067],
                [911, 913, 1067],
                [1151, 911, 1067],
                [1155, 1151, 1067],
                [1151, 1260, 1204],
                [1147, 1151, 1204],
                [1248, 1147, 1204],
                [1260, 1248, 1204],
                [911, 1151, 1062],
                [909, 911, 1062],
                [1147, 909, 1062],
                [1151, 1147, 1062],
                [1355, 1452, 1384],
                [1323, 1355, 1384],
                [1406, 1323, 1384],
                [1452, 1406, 1384],
                [1248, 1355, 1287],
                [1236, 1248, 1287],
                [1323, 1236, 1287],
                [1355, 1323, 1287],
                [1147, 1248, 1190],
                [1135, 1147, 1190],
                [1236, 1135, 1190],
                [1248, 1236, 1190],
                [909, 1147, 1051],
                [907, 909, 1051],
                [1135, 907, 1051],
                [1147, 1135, 1051],
                [1559, 1566, 1531],
                [1514, 1559, 1531],
                [1515, 1514, 1531],
                [1566, 1515, 1531],
                [1525, 1559, 1517],
                [1486, 1525, 1517],
                [1514, 1486, 1517],
                [1559, 1514, 1517],
                [1484, 1525, 1488],
                [1438, 1484, 1488],
                [1486, 1438, 1488],
                [1525, 1486, 1488],
                [1406, 1484, 1425],
                [1363, 1406, 1425],
                [1438, 1363, 1425],
                [1484, 1438, 1425],
                [1514, 1515, 1506],
                [1498, 1514, 1506],
                [1501, 1498, 1506],
                [1515, 1501, 1506],
                [1486, 1514, 1492],
                [1463, 1486, 1492],
                [1498, 1463, 1492],
                [1514, 1498, 1492],
                [1438, 1486, 1446],
                [1408, 1438, 1446],
                [1463, 1408, 1446],
                [1486, 1463, 1446],
                [1363, 1438, 1386],
                [1343, 1363, 1386],
                [1408, 1343, 1386],
                [1438, 1408, 1386],
                [1323, 1406, 1337],
                [1293, 1323, 1337],
                [1363, 1293, 1337],
                [1406, 1363, 1337],
                [1236, 1323, 1268],
                [1220, 1236, 1268],
                [1293, 1220, 1268],
                [1323, 1293, 1268],
                [1135, 1236, 1182],
                [1122, 1135, 1182],
                [1220, 1122, 1182],
                [1236, 1220, 1182],
                [907, 1135, 1035],
                [905, 907, 1035],
                [1122, 905, 1035],
                [1135, 1122, 1035],
                [1293, 1363, 1317],
                [1281, 1293, 1317],
                [1343, 1281, 1317],
                [1363, 1343, 1317],
                [1220, 1293, 1246],
                [1208, 1220, 1246],
                [1281, 1208, 1246],
                [1293, 1281, 1246],
                [1122, 1220, 1172],
                [1114, 1122, 1172],
                [1208, 1114, 1172],
                [1220, 1208, 1172],
                [905, 1122, 1026],
                [903, 905, 1026],
                [1114, 903, 1026],
                [1122, 1114, 1026],
                [700, 913, 788],
                [704, 700, 788],
                [911, 704, 788],
                [913, 911, 788],
                [593, 700, 641],
                [595, 593, 641],
                [704, 595, 641],
                [700, 704, 641],
                [704, 911, 793],
                [708, 704, 793],
                [909, 708, 793],
                [911, 909, 793],
                [595, 704, 651],
                [607, 595, 651],
                [708, 607, 651],
                [704, 708, 651],
                [488, 593, 542],
                [494, 488, 542],
                [595, 494, 542],
                [593, 595, 542],
                [376, 488, 438],
                [382, 376, 438],
                [494, 382, 438],
                [488, 494, 438],
                [494, 595, 552],
                [500, 494, 552],
                [607, 500, 552],
                [595, 607, 552],
                [382, 494, 451],
                [403, 382, 451],
                [500, 403, 451],
                [494, 500, 451],
                [708, 909, 804],
                [718, 708, 804],
                [907, 718, 804],
                [909, 907, 804],
                [607, 708, 665],
                [619, 607, 665],
                [718, 619, 665],
                [708, 718, 665],
                [500, 607, 568],
                [532, 500, 568],
                [619, 532, 568],
                [607, 619, 568],
                [403, 500, 471],
                [449, 403, 471],
                [532, 449, 471],
                [500, 532, 471],
                [312, 376, 340],
                [318, 312, 340],
                [382, 318, 340],
                [376, 382, 340],
                [274, 312, 300],
                [285, 274, 300],
                [318, 285, 300],
                [312, 318, 300],
                [318, 382, 350],
                [327, 318, 350],
                [403, 327, 350],
                [382, 403, 350],
                [285, 318, 306],
                [295, 285, 306],
                [327, 295, 306],
                [318, 327, 306],
                [243, 274, 264],
                [250, 243, 264],
                [285, 250, 264],
                [274, 285, 264],
                [232, 243, 239],
                [237, 232, 239],
                [250, 237, 239],
                [243, 250, 239],
                [250, 285, 272],
                [266, 250, 272],
                [295, 266, 272],
                [285, 295, 272],
                [237, 250, 254],
                [255, 237, 254],
                [266, 255, 254],
                [250, 266, 254],
                [327, 403, 378],
                [371, 327, 378],
                [449, 371, 378],
                [403, 449, 378],
                [295, 327, 324],
                [322, 295, 324],
                [371, 322, 324],
                [327, 371, 324],
                [266, 295, 298],
                [304, 266, 298],
                [322, 304, 298],
                [295, 322, 298],
                [255, 266, 287],
                [296, 255, 287],
                [304, 296, 287],
                [266, 304, 287],
                [718, 907, 820],
                [733, 718, 820],
                [905, 733, 820],
                [907, 905, 820],
                [619, 718, 673],
                [635, 619, 673],
                [733, 635, 673],
                [718, 733, 673],
                [532, 619, 587],
                [562, 532, 587],
                [635, 562, 587],
                [619, 635, 587],
                [449, 532, 518],
                [492, 449, 518],
                [562, 492, 518],
                [532, 562, 518],
                [733, 905, 829],
                [739, 733, 829],
                [903, 739, 829],
                [905, 903, 829],
                [635, 733, 683],
                [645, 635, 683],
                [739, 645, 683],
                [733, 739, 683],
                [562, 635, 609],
                [572, 562, 609],
                [645, 572, 609],
                [635, 645, 609],
                [492, 562, 538],
                [510, 492, 538],
                [572, 510, 538],
                [562, 572, 538],
                [371, 449, 430],
                [417, 371, 430],
                [492, 417, 430],
                [449, 492, 430],
                [322, 371, 367],
                [369, 322, 367],
                [417, 369, 367],
                [371, 417, 367],
                [304, 322, 333],
                [338, 304, 333],
                [369, 338, 333],
                [322, 369, 333],
                [296, 304, 316],
                [334, 296, 316],
                [338, 334, 316],
                [304, 338, 316],
                [417, 492, 469],
                [445, 417, 469],
                [510, 445, 469],
                [492, 510, 469],
                [369, 417, 409],
                [390, 369, 409],
                [445, 390, 409],
                [417, 445, 409],
                [338, 369, 363],
                [355, 338, 363],
                [390, 355, 363],
                [369, 390, 363],
                [334, 338, 346],
                [351, 334, 346],
                [355, 351, 346],
                [338, 355, 346],
                [242, 232, 238],
                [249, 242, 238],
                [237, 249, 238],
                [232, 237, 238],
                [273, 242, 263],
                [284, 273, 263],
                [249, 284, 263],
                [242, 249, 263],
                [249, 237, 253],
                [265, 249, 253],
                [255, 265, 253],
                [237, 255, 253],
                [284, 249, 271],
                [294, 284, 271],
                [265, 294, 271],
                [249, 265, 271],
                [311, 273, 299],
                [317, 311, 299],
                [284, 317, 299],
                [273, 284, 299],
                [375, 311, 339],
                [381, 375, 339],
                [317, 381, 339],
                [311, 317, 339],
                [317, 284, 305],
                [326, 317, 305],
                [294, 326, 305],
                [284, 294, 305],
                [381, 317, 349],
                [402, 381, 349],
                [326, 402, 349],
                [317, 326, 349],
                [265, 255, 286],
                [303, 265, 286],
                [296, 303, 286],
                [255, 296, 286],
                [294, 265, 297],
                [321, 294, 297],
                [303, 321, 297],
                [265, 303, 297],
                [326, 294, 323],
                [370, 326, 323],
                [321, 370, 323],
                [294, 321, 323],
                [402, 326, 377],
                [448, 402, 377],
                [370, 448, 377],
                [326, 370, 377],
                [487, 375, 437],
                [493, 487, 437],
                [381, 493, 437],
                [375, 381, 437],
                [592, 487, 541],
                [594, 592, 541],
                [493, 594, 541],
                [487, 493, 541],
                [493, 381, 450],
                [499, 493, 450],
                [402, 499, 450],
                [381, 402, 450],
                [594, 493, 551],
                [606, 594, 551],
                [499, 606, 551],
                [493, 499, 551],
                [699, 592, 640],
                [703, 699, 640],
                [594, 703, 640],
                [592, 594, 640],
                [912, 699, 787],
                [910, 912, 787],
                [703, 910, 787],
                [699, 703, 787],
                [703, 594, 650],
                [707, 703, 650],
                [606, 707, 650],
                [594, 606, 650],
                [910, 703, 792],
                [908, 910, 792],
                [707, 908, 792],
                [703, 707, 792],
                [499, 402, 470],
                [531, 499, 470],
                [448, 531, 470],
                [402, 448, 470],
                [606, 499, 567],
                [618, 606, 567],
                [531, 618, 567],
                [499, 531, 567],
                [707, 606, 664],
                [719, 707, 664],
                [618, 719, 664],
                [606, 618, 664],
                [908, 707, 803],
                [906, 908, 803],
                [719, 906, 803],
                [707, 719, 803],
                [303, 296, 315],
                [337, 303, 315],
                [334, 337, 315],
                [296, 334, 315],
                [321, 303, 332],
                [368, 321, 332],
                [337, 368, 332],
                [303, 337, 332],
                [370, 321, 366],
                [416, 370, 366],
                [368, 416, 366],
                [321, 368, 366],
                [448, 370, 429],
                [491, 448, 429],
                [416, 491, 429],
                [370, 416, 429],
                [337, 334, 345],
                [354, 337, 345],
                [351, 354, 345],
                [334, 351, 345],
                [368, 337, 362],
                [389, 368, 362],
                [354, 389, 362],
                [337, 354, 362],
                [416, 368, 408],
                [444, 416, 408],
                [389, 444, 408],
                [368, 389, 408],
                [491, 416, 468],
                [509, 491, 468],
                [444, 509, 468],
                [416, 444, 468],
                [531, 448, 517],
                [561, 531, 517],
                [491, 561, 517],
                [448, 491, 517],
                [618, 531, 586],
                [634, 618, 586],
                [561, 634, 586],
                [531, 561, 586],
                [719, 618, 672],
                [732, 719, 672],
                [634, 732, 672],
                [618, 634, 672],
                [906, 719, 819],
                [904, 906, 819],
                [732, 904, 819],
                [719, 732, 819],
                [561, 491, 537],
                [571, 561, 537],
                [509, 571, 537],
                [491, 509, 537],
                [634, 561, 608],
                [644, 634, 608],
                [571, 644, 608],
                [561, 571, 608],
                [732, 634, 682],
                [738, 732, 682],
                [644, 738, 682],
                [634, 644, 682],
                [904, 732, 828],
                [902, 904, 828],
                [738, 902, 828],
                [732, 738, 828],
                [1154, 912, 1066],
                [1150, 1154, 1066],
                [910, 1150, 1066],
                [912, 910, 1066],
                [1261, 1154, 1213],
                [1259, 1261, 1213],
                [1150, 1259, 1213],
                [1154, 1150, 1213],
                [1150, 910, 1061],
                [1146, 1150, 1061],
                [908, 1146, 1061],
                [910, 908, 1061],
                [1259, 1150, 1203],
                [1247, 1259, 1203],
                [1146, 1247, 1203],
                [1150, 1146, 1203],
                [1366, 1261, 1312],
                [1360, 1366, 1312],
                [1259, 1360, 1312],
                [1261, 1259, 1312],
                [1478, 1366, 1416],
                [1472, 1478, 1416],
                [1360, 1472, 1416],
                [1366, 1360, 1416],
                [1360, 1259, 1302],
                [1354, 1360, 1302],
                [1247, 1354, 1302],
                [1259, 1247, 1302],
                [1472, 1360, 1403],
                [1451, 1472, 1403],
                [1354, 1451, 1403],
                [1360, 1354, 1403],
                [1146, 908, 1050],
                [1136, 1146, 1050],
                [906, 1136, 1050],
                [908, 906, 1050],
                [1247, 1146, 1189],
                [1235, 1247, 1189],
                [1136, 1235, 1189],
                [1146, 1136, 1189],
                [1354, 1247, 1286],
                [1322, 1354, 1286],
                [1235, 1322, 1286],
                [1247, 1235, 1286],
                [1451, 1354, 1383],
                [1405, 1451, 1383],
                [1322, 1405, 1383],
                [1354, 1322, 1383],
                [1534, 1478, 1511],
                [1528, 1534, 1511],
                [1472, 1528, 1511],
                [1478, 1472, 1511],
                [1588, 1534, 1562],
                [1583, 1588, 1562],
                [1528, 1583, 1562],
                [1534, 1528, 1562],
                [1528, 1472, 1503],
                [1520, 1528, 1503],
                [1451, 1520, 1503],
                [1472, 1451, 1503],
                [1583, 1528, 1556],
                [1567, 1583, 1556],
                [1520, 1567, 1556],
                [1528, 1520, 1556],
                [1625, 1588, 1606],
                [1620, 1625, 1606],
                [1583, 1620, 1606],
                [1588, 1583, 1606],
                [1633, 1625, 1627],
                [1629, 1633, 1627],
                [1620, 1629, 1627],
                [1625, 1620, 1627],
                [1620, 1583, 1592],
                [1602, 1620, 1592],
                [1567, 1602, 1592],
                [1583, 1567, 1592],
                [1629, 1620, 1615],
                [1612, 1629, 1615],
                [1602, 1612, 1615],
                [1620, 1602, 1615],
                [1520, 1451, 1476],
                [1483, 1520, 1476],
                [1405, 1483, 1476],
                [1451, 1405, 1476],
                [1567, 1520, 1522],
                [1524, 1567, 1522],
                [1483, 1524, 1522],
                [1520, 1483, 1522],
                [1602, 1567, 1564],
                [1558, 1602, 1564],
                [1524, 1558, 1564],
                [1567, 1524, 1564],
                [1612, 1602, 1579],
                [1566, 1612, 1579],
                [1558, 1566, 1579],
                [1602, 1558, 1579],
                [1136, 906, 1034],
                [1121, 1136, 1034],
                [904, 1121, 1034],
                [906, 904, 1034],
                [1235, 1136, 1181],
                [1219, 1235, 1181],
                [1121, 1219, 1181],
                [1136, 1121, 1181],
                [1322, 1235, 1267],
                [1292, 1322, 1267],
                [1219, 1292, 1267],
                [1235, 1219, 1267],
                [1405, 1322, 1336],
                [1362, 1405, 1336],
                [1292, 1362, 1336],
                [1322, 1292, 1336],
                [1121, 904, 1025],
                [1113, 1121, 1025],
                [902, 1113, 1025],
                [904, 902, 1025],
                [1219, 1121, 1171],
                [1207, 1219, 1171],
                [1113, 1207, 1171],
                [1121, 1113, 1171],
                [1292, 1219, 1245],
                [1280, 1292, 1245],
                [1207, 1280, 1245],
                [1219, 1207, 1245],
                [1362, 1292, 1316],
                [1342, 1362, 1316],
                [1280, 1342, 1316],
                [1292, 1280, 1316],
                [1483, 1405, 1424],
                [1437, 1483, 1424],
                [1362, 1437, 1424],
                [1405, 1362, 1424],
                [1524, 1483, 1487],
                [1485, 1524, 1487],
                [1437, 1485, 1487],
                [1483, 1437, 1487],
                [1558, 1524, 1516],
                [1513, 1558, 1516],
                [1485, 1513, 1516],
                [1524, 1485, 1516],
                [1566, 1558, 1530],
                [1515, 1566, 1530],
                [1513, 1515, 1530],
                [1558, 1513, 1530],
                [1437, 1362, 1385],
                [1407, 1437, 1385],
                [1342, 1407, 1385],
                [1362, 1342, 1385],
                [1485, 1437, 1445],
                [1462, 1485, 1445],
                [1407, 1462, 1445],
                [1437, 1407, 1445],
                [1513, 1485, 1491],
                [1497, 1513, 1491],
                [1462, 1497, 1491],
                [1485, 1462, 1491],
                [1515, 1513, 1505],
                [1501, 1515, 1505],
                [1497, 1501, 1505],
                [1513, 1497, 1505],
                [331, 325, 277],
                [228, 331, 277],
                [231, 228, 277],
                [325, 231, 277],
                [336, 331, 279],
                [224, 336, 279],
                [228, 224, 279],
                [331, 228, 279],
                [228, 231, 200],
                [173, 228, 200],
                [178, 173, 200],
                [231, 178, 200],
                [224, 228, 198],
                [167, 224, 198],
                [173, 167, 198],
                [228, 173, 198],
                [348, 336, 281],
                [222, 348, 281],
                [224, 222, 281],
                [336, 224, 281],
                [352, 348, 283],
                [210, 352, 283],
                [222, 210, 283],
                [348, 222, 283],
                [222, 224, 193],
                [150, 222, 193],
                [167, 150, 193],
                [224, 167, 193],
                [210, 222, 183],
                [142, 210, 183],
                [150, 142, 183],
                [222, 150, 183],
                [177, 178, 165],
                [136, 177, 165],
                [141, 136, 165],
                [178, 141, 165],
                [173, 177, 162],
                [127, 173, 162],
                [136, 127, 162],
                [177, 136, 162],
                [167, 173, 158],
                [131, 167, 158],
                [152, 131, 158],
                [173, 152, 158],
                [131, 152, 129],
                [82, 131, 129],
                [127, 82, 129],
                [152, 127, 129],
                [136, 141, 134],
                [114, 136, 134],
                [121, 114, 134],
                [141, 121, 134],
                [127, 136, 118],
                [93, 127, 118],
                [114, 93, 118],
                [136, 114, 118],
                [114, 121, 112],
                [101, 114, 112],
                [108, 101, 112],
                [121, 108, 112],
                [93, 114, 95],
                [90, 93, 95],
                [101, 90, 95],
                [114, 101, 95],
                [82, 127, 88],
                [59, 82, 88],
                [93, 59, 88],
                [127, 93, 88],
                [59, 93, 74],
                [52, 59, 74],
                [90, 52, 74],
                [93, 90, 74],
                [150, 167, 140],
                [86, 150, 140],
                [131, 86, 140],
                [167, 131, 140],
                [86, 131, 84],
                [50, 86, 84],
                [82, 50, 84],
                [131, 82, 84],
                [148, 150, 120],
                [76, 148, 120],
                [86, 76, 120],
                [150, 86, 120],
                [142, 148, 110],
                [72, 142, 110],
                [76, 72, 110],
                [148, 76, 110],
                [76, 86, 65],
                [36, 76, 65],
                [50, 36, 65],
                [86, 50, 65],
                [72, 76, 57],
                [34, 72, 57],
                [36, 34, 57],
                [76, 36, 57],
                [50, 82, 55],
                [27, 50, 55],
                [59, 27, 55],
                [82, 59, 55],
                [27, 59, 42],
                [18, 27, 42],
                [52, 18, 42],
                [59, 52, 42],
                [36, 50, 33],
                [12, 36, 33],
                [27, 12, 33],
                [50, 27, 33],
                [34, 36, 24],
                [8, 34, 24],
                [12, 8, 24],
                [36, 12, 24],
                [12, 27, 16],
                [2, 12, 16],
                [18, 2, 16],
                [27, 18, 16],
                [8, 12, 7],
                [0, 8, 7],
                [2, 0, 7],
                [12, 2, 7],
                [347, 352, 282],
                [221, 347, 282],
                [210, 221, 282],
                [352, 210, 282],
                [335, 347, 280],
                [223, 335, 280],
                [221, 223, 280],
                [347, 221, 280],
                [221, 210, 182],
                [149, 221, 182],
                [142, 149, 182],
                [210, 142, 182],
                [223, 221, 192],
                [166, 223, 192],
                [149, 166, 192],
                [221, 149, 192],
                [330, 335, 278],
                [227, 330, 278],
                [223, 227, 278],
                [335, 223, 278],
                [325, 330, 276],
                [231, 325, 276],
                [227, 231, 276],
                [330, 227, 276],
                [227, 223, 197],
                [172, 227, 197],
                [166, 172, 197],
                [223, 166, 197],
                [231, 227, 199],
                [178, 231, 199],
                [172, 178, 199],
                [227, 172, 199],
                [147, 142, 109],
                [75, 147, 109],
                [72, 75, 109],
                [142, 72, 109],
                [149, 147, 119],
                [85, 149, 119],
                [75, 85, 119],
                [147, 75, 119],
                [75, 72, 56],
                [35, 75, 56],
                [34, 35, 56],
                [72, 34, 56],
                [85, 75, 64],
                [49, 85, 64],
                [35, 49, 64],
                [75, 35, 64],
                [166, 149, 139],
                [130, 166, 139],
                [85, 130, 139],
                [149, 85, 139],
                [130, 85, 83],
                [81, 130, 83],
                [49, 81, 83],
                [85, 49, 83],
                [35, 34, 23],
                [11, 35, 23],
                [8, 11, 23],
                [34, 8, 23],
                [49, 35, 32],
                [26, 49, 32],
                [11, 26, 32],
                [35, 11, 32],
                [11, 8, 6],
                [1, 11, 6],
                [0, 1, 6],
                [8, 0, 6],
                [26, 11, 15],
                [17, 26, 15],
                [1, 17, 15],
                [11, 1, 15],
                [81, 49, 54],
                [58, 81, 54],
                [26, 58, 54],
                [49, 26, 54],
                [58, 26, 41],
                [51, 58, 41],
                [17, 51, 41],
                [26, 17, 41],
                [172, 166, 157],
                [151, 172, 157],
                [130, 151, 157],
                [166, 130, 157],
                [151, 130, 128],
                [126, 151, 128],
                [81, 126, 128],
                [130, 81, 128],
                [176, 172, 161],
                [135, 176, 161],
                [126, 135, 161],
                [172, 126, 161],
                [178, 176, 164],
                [141, 178, 164],
                [135, 141, 164],
                [176, 135, 164],
                [126, 81, 87],
                [92, 126, 87],
                [58, 92, 87],
                [81, 58, 87],
                [92, 58, 73],
                [89, 92, 73],
                [51, 89, 73],
                [58, 51, 73],
                [135, 126, 117],
                [113, 135, 117],
                [92, 113, 117],
                [126, 92, 117],
                [141, 135, 133],
                [121, 141, 133],
                [113, 121, 133],
                [135, 113, 133],
                [113, 92, 94],
                [100, 113, 94],
                [89, 100, 94],
                [92, 89, 94],
                [121, 113, 111],
                [108, 121, 111],
                [100, 108, 111],
                [113, 100, 111],
                [101, 108, 116],
                [125, 101, 116],
                [132, 125, 116],
                [108, 132, 116],
                [90, 101, 103],
                [105, 90, 103],
                [125, 105, 103],
                [101, 125, 103],
                [52, 90, 78],
                [71, 52, 78],
                [105, 71, 78],
                [90, 105, 78],
                [125, 132, 146],
                [156, 125, 146],
                [163, 156, 146],
                [132, 163, 146],
                [105, 125, 144],
                [154, 105, 144],
                [156, 154, 144],
                [125, 156, 144],
                [71, 105, 123],
                [138, 71, 123],
                [154, 138, 123],
                [105, 154, 123],
                [18, 52, 38],
                [22, 18, 38],
                [63, 22, 38],
                [52, 63, 38],
                [22, 63, 48],
                [40, 22, 48],
                [71, 40, 48],
                [63, 71, 48],
                [2, 18, 14],
                [10, 2, 14],
                [22, 10, 14],
                [18, 22, 14],
                [0, 2, 4],
                [5, 0, 4],
                [10, 5, 4],
                [2, 10, 4],
                [10, 22, 29],
                [31, 10, 29],
                [40, 31, 29],
                [22, 40, 29],
                [5, 10, 20],
                [25, 5, 20],
                [31, 25, 20],
                [10, 31, 20],
                [40, 71, 69],
                [67, 40, 69],
                [97, 67, 69],
                [71, 97, 69],
                [67, 97, 99],
                [107, 67, 99],
                [138, 107, 99],
                [97, 138, 99],
                [31, 40, 46],
                [61, 31, 46],
                [67, 61, 46],
                [40, 67, 46],
                [25, 31, 44],
                [53, 25, 44],
                [61, 53, 44],
                [31, 61, 44],
                [53, 67, 80],
                [91, 53, 80],
                [107, 91, 80],
                [67, 107, 80],
                [154, 163, 175],
                [195, 154, 175],
                [196, 195, 175],
                [163, 196, 175],
                [138, 154, 171],
                [189, 138, 171],
                [195, 189, 171],
                [154, 195, 171],
                [195, 196, 202],
                [207, 195, 202],
                [203, 207, 202],
                [196, 203, 202],
                [205, 203, 226],
                [234, 205, 226],
                [232, 234, 226],
                [203, 232, 226],
                [207, 205, 230],
                [236, 207, 230],
                [234, 236, 230],
                [205, 234, 230],
                [191, 195, 209],
                [241, 191, 209],
                [236, 241, 209],
                [195, 236, 209],
                [189, 191, 212],
                [248, 189, 212],
                [241, 248, 212],
                [191, 241, 212],
                [107, 138, 169],
                [185, 107, 169],
                [189, 185, 169],
                [138, 189, 169],
                [91, 107, 160],
                [179, 91, 160],
                [185, 179, 160],
                [107, 185, 160],
                [187, 189, 214],
                [252, 187, 214],
                [248, 252, 214],
                [189, 248, 214],
                [185, 187, 216],
                [259, 185, 216],
                [252, 259, 216],
                [187, 252, 216],
                [181, 185, 218],
                [261, 181, 218],
                [259, 261, 218],
                [185, 259, 218],
                [179, 181, 220],
                [262, 179, 220],
                [261, 262, 220],
                [181, 261, 220],
                [1, 0, 3],
                [9, 1, 3],
                [5, 9, 3],
                [0, 5, 3],
                [17, 1, 13],
                [21, 17, 13],
                [9, 21, 13],
                [1, 9, 13],
                [9, 5, 19],
                [30, 9, 19],
                [25, 30, 19],
                [5, 25, 19],
                [21, 9, 28],
                [39, 21, 28],
                [30, 39, 28],
                [9, 30, 28],
                [51, 17, 37],
                [62, 51, 37],
                [21, 62, 37],
                [17, 21, 37],
                [62, 21, 47],
                [70, 62, 47],
                [39, 70, 47],
                [21, 39, 47],
                [30, 25, 43],
                [60, 30, 43],
                [53, 60, 43],
                [25, 53, 43],
                [39, 30, 45],
                [66, 39, 45],
                [60, 66, 45],
                [30, 60, 45],
                [66, 53, 79],
                [106, 66, 79],
                [91, 106, 79],
                [53, 91, 79],
                [70, 39, 68],
                [96, 70, 68],
                [66, 96, 68],
                [39, 66, 68],
                [96, 66, 98],
                [137, 96, 98],
                [106, 137, 98],
                [66, 106, 98],
                [89, 51, 77],
                [104, 89, 77],
                [70, 104, 77],
                [51, 70, 77],
                [100, 89, 102],
                [124, 100, 102],
                [104, 124, 102],
                [89, 104, 102],
                [108, 100, 115],
                [132, 108, 115],
                [124, 132, 115],
                [100, 124, 115],
                [104, 70, 122],
                [153, 104, 122],
                [137, 153, 122],
                [70, 137, 122],
                [124, 104, 143],
                [155, 124, 143],
                [153, 155, 143],
                [104, 153, 143],
                [132, 124, 145],
                [163, 132, 145],
                [155, 163, 145],
                [124, 155, 145],
                [106, 91, 159],
                [184, 106, 159],
                [179, 184, 159],
                [91, 179, 159],
                [137, 106, 168],
                [188, 137, 168],
                [184, 188, 168],
                [106, 184, 168],
                [180, 179, 219],
                [260, 180, 219],
                [262, 260, 219],
                [179, 262, 219],
                [184, 180, 217],
                [258, 184, 217],
                [260, 258, 217],
                [180, 260, 217],
                [186, 184, 215],
                [251, 186, 215],
                [258, 251, 215],
                [184, 258, 215],
                [188, 186, 213],
                [247, 188, 213],
                [251, 247, 213],
                [186, 251, 213],
                [153, 137, 170],
                [194, 153, 170],
                [188, 194, 170],
                [137, 188, 170],
                [163, 153, 174],
                [196, 163, 174],
                [194, 196, 174],
                [153, 194, 174],
                [190, 188, 211],
                [240, 190, 211],
                [247, 240, 211],
                [188, 247, 211],
                [194, 190, 208],
                [235, 194, 208],
                [240, 235, 208],
                [190, 240, 208],
                [196, 194, 201],
                [203, 196, 201],
                [206, 203, 201],
                [194, 206, 201],
                [204, 206, 229],
                [233, 204, 229],
                [235, 233, 229],
                [206, 235, 229],
                [203, 204, 225],
                [232, 203, 225],
                [233, 232, 225],
                [204, 233, 225],
                [1552, 1553, 1587],
                [1632, 1552, 1587],
                [1630, 1632, 1587],
                [1553, 1630, 1587],
                [1550, 1552, 1591],
                [1637, 1550, 1591],
                [1632, 1637, 1591],
                [1552, 1632, 1591],
                [1632, 1630, 1647],
                [1665, 1632, 1647],
                [1663, 1665, 1647],
                [1630, 1663, 1647],
                [1637, 1632, 1651],
                [1673, 1637, 1651],
                [1665, 1673, 1651],
                [1632, 1665, 1651],
                [1548, 1550, 1595],
                [1641, 1548, 1595],
                [1637, 1641, 1595],
                [1550, 1637, 1595],
                [1546, 1548, 1597],
                [1645, 1546, 1597],
                [1641, 1645, 1597],
                [1548, 1641, 1597],
                [1641, 1637, 1657],
                [1679, 1641, 1657],
                [1673, 1679, 1657],
                [1637, 1673, 1657],
                [1645, 1641, 1660],
                [1688, 1645, 1660],
                [1679, 1688, 1660],
                [1641, 1679, 1660],
                [1665, 1663, 1677],
                [1695, 1665, 1677],
                [1693, 1695, 1677],
                [1663, 1693, 1677],
                [1673, 1665, 1683],
                [1705, 1673, 1683],
                [1695, 1705, 1683],
                [1665, 1695, 1683],
                [1695, 1693, 1707],
                [1718, 1695, 1707],
                [1712, 1718, 1707],
                [1693, 1712, 1707],
                [1705, 1695, 1709],
                [1725, 1705, 1709],
                [1718, 1725, 1709],
                [1695, 1718, 1709],
                [1679, 1673, 1692],
                [1714, 1679, 1692],
                [1705, 1714, 1692],
                [1673, 1705, 1692],
                [1688, 1679, 1703],
                [1729, 1688, 1703],
                [1714, 1729, 1703],
                [1679, 1714, 1703],
                [1714, 1705, 1723],
                [1739, 1714, 1723],
                [1725, 1739, 1723],
                [1705, 1725, 1723],
                [1729, 1714, 1733],
                [1752, 1729, 1733],
                [1739, 1752, 1733],
                [1714, 1739, 1733],
                [1544, 1546, 1605],
                [1649, 1544, 1605],
                [1645, 1649, 1605],
                [1546, 1645, 1605],
                [1542, 1544, 1576],
                [1614, 1542, 1576],
                [1609, 1614, 1576],
                [1544, 1609, 1576],
                [1614, 1609, 1635],
                [1653, 1614, 1635],
                [1649, 1653, 1635],
                [1609, 1649, 1635],
                [1649, 1645, 1669],
                [1699, 1649, 1669],
                [1688, 1699, 1669],
                [1645, 1688, 1669],
                [1653, 1649, 1662],
                [1681, 1653, 1662],
                [1675, 1681, 1662],
                [1649, 1675, 1662],
                [1681, 1675, 1690],
                [1711, 1681, 1690],
                [1699, 1711, 1690],
                [1675, 1699, 1690],
                [1540, 1542, 1578],
                [1618, 1540, 1578],
                [1614, 1618, 1578],
                [1542, 1614, 1578],
                [1618, 1614, 1639],
                [1655, 1618, 1639],
                [1653, 1655, 1639],
                [1614, 1653, 1639],
                [1538, 1540, 1582],
                [1619, 1538, 1582],
                [1618, 1619, 1582],
                [1540, 1618, 1582],
                [1619, 1618, 1643],
                [1658, 1619, 1643],
                [1655, 1658, 1643],
                [1618, 1655, 1643],
                [1655, 1653, 1667],
                [1685, 1655, 1667],
                [1681, 1685, 1667],
                [1653, 1681, 1667],
                [1685, 1681, 1697],
                [1720, 1685, 1697],
                [1711, 1720, 1697],
                [1681, 1711, 1697],
                [1658, 1655, 1671],
                [1686, 1658, 1671],
                [1685, 1686, 1671],
                [1655, 1685, 1671],
                [1686, 1685, 1701],
                [1721, 1686, 1701],
                [1720, 1721, 1701],
                [1685, 1720, 1701],
                [1699, 1688, 1716],
                [1743, 1699, 1716],
                [1729, 1743, 1716],
                [1688, 1729, 1716],
                [1711, 1699, 1727],
                [1754, 1711, 1727],
                [1743, 1754, 1727],
                [1699, 1743, 1727],
                [1743, 1729, 1748],
                [1770, 1743, 1748],
                [1752, 1770, 1748],
                [1729, 1752, 1748],
                [1754, 1743, 1760],
                [1786, 1754, 1760],
                [1770, 1786, 1760],
                [1743, 1770, 1760],
                [1720, 1711, 1735],
                [1762, 1720, 1735],
                [1754, 1762, 1735],
                [1711, 1754, 1735],
                [1721, 1720, 1741],
                [1768, 1721, 1741],
                [1762, 1768, 1741],
                [1720, 1762, 1741],
                [1762, 1754, 1776],
                [1796, 1762, 1776],
                [1786, 1796, 1776],
                [1754, 1786, 1776],
                [1768, 1762, 1782],
                [1801, 1768, 1782],
                [1796, 1801, 1782],
                [1762, 1796, 1782],
                [1718, 1712, 1731],
                [1746, 1718, 1731],
                [1744, 1746, 1731],
                [1712, 1744, 1731],
                [1725, 1718, 1737],
                [1758, 1725, 1737],
                [1746, 1758, 1737],
                [1718, 1746, 1737],
                [1739, 1725, 1750],
                [1780, 1739, 1750],
                [1758, 1780, 1750],
                [1725, 1758, 1750],
                [1752, 1739, 1765],
                [1800, 1752, 1765],
                [1780, 1800, 1765],
                [1739, 1780, 1765],
                [1746, 1744, 1756],
                [1772, 1746, 1756],
                [1763, 1772, 1756],
                [1744, 1763, 1756],
                [1758, 1746, 1767],
                [1788, 1758, 1767],
                [1772, 1788, 1767],
                [1746, 1772, 1767],
                [1772, 1763, 1790],
                [1814, 1772, 1790],
                [1806, 1814, 1790],
                [1763, 1806, 1790],
                [1788, 1772, 1803],
                [1832, 1788, 1803],
                [1814, 1832, 1803],
                [1772, 1814, 1803],
                [1780, 1758, 1784],
                [1816, 1780, 1784],
                [1788, 1816, 1784],
                [1758, 1788, 1784],
                [1800, 1780, 1808],
                [1839, 1800, 1808],
                [1816, 1839, 1808],
                [1780, 1816, 1808],
                [1839, 1788, 1845],
                [1898, 1839, 1845],
                [1832, 1898, 1845],
                [1788, 1832, 1845],
                [1770, 1752, 1774],
                [1794, 1770, 1774],
                [1778, 1794, 1774],
                [1752, 1778, 1774],
                [1786, 1770, 1792],
                [1810, 1786, 1792],
                [1794, 1810, 1792],
                [1770, 1794, 1792],
                [1794, 1778, 1798],
                [1822, 1794, 1798],
                [1800, 1822, 1798],
                [1778, 1800, 1798],
                [1810, 1794, 1818],
                [1843, 1810, 1818],
                [1822, 1843, 1818],
                [1794, 1822, 1818],
                [1796, 1786, 1805],
                [1824, 1796, 1805],
                [1810, 1824, 1805],
                [1786, 1810, 1805],
                [1801, 1796, 1812],
                [1825, 1801, 1812],
                [1824, 1825, 1812],
                [1796, 1824, 1812],
                [1824, 1810, 1830],
                [1861, 1824, 1830],
                [1843, 1861, 1830],
                [1810, 1843, 1830],
                [1825, 1824, 1841],
                [1870, 1825, 1841],
                [1861, 1870, 1841],
                [1824, 1861, 1841],
                [1822, 1800, 1828],
                [1874, 1822, 1828],
                [1839, 1874, 1828],
                [1800, 1839, 1828],
                [1843, 1822, 1859],
                [1892, 1843, 1859],
                [1874, 1892, 1859],
                [1822, 1874, 1859],
                [1892, 1839, 1886],
                [1911, 1892, 1886],
                [1878, 1911, 1886],
                [1839, 1878, 1886],
                [1911, 1878, 1909],
                [1935, 1911, 1909],
                [1898, 1935, 1909],
                [1878, 1898, 1909],
                [1861, 1843, 1880],
                [1902, 1861, 1880],
                [1892, 1902, 1880],
                [1843, 1892, 1880],
                [1870, 1861, 1890],
                [1905, 1870, 1890],
                [1902, 1905, 1890],
                [1861, 1902, 1890],
                [1902, 1892, 1907],
                [1923, 1902, 1907],
                [1911, 1923, 1907],
                [1892, 1911, 1907],
                [1923, 1911, 1930],
                [1949, 1923, 1930],
                [1935, 1949, 1930],
                [1911, 1935, 1930],
                [1905, 1902, 1913],
                [1926, 1905, 1913],
                [1923, 1926, 1913],
                [1902, 1923, 1913],
                [1926, 1923, 1939],
                [1952, 1926, 1939],
                [1949, 1952, 1939],
                [1923, 1949, 1939],
                [1539, 1538, 1581],
                [1617, 1539, 1581],
                [1619, 1617, 1581],
                [1538, 1619, 1581],
                [1617, 1619, 1642],
                [1654, 1617, 1642],
                [1658, 1654, 1642],
                [1619, 1658, 1642],
                [1541, 1539, 1577],
                [1613, 1541, 1577],
                [1617, 1613, 1577],
                [1539, 1617, 1577],
                [1613, 1617, 1638],
                [1652, 1613, 1638],
                [1654, 1652, 1638],
                [1617, 1654, 1638],
                [1654, 1658, 1670],
                [1684, 1654, 1670],
                [1686, 1684, 1670],
                [1658, 1686, 1670],
                [1684, 1686, 1700],
                [1719, 1684, 1700],
                [1721, 1719, 1700],
                [1686, 1721, 1700],
                [1652, 1654, 1666],
                [1680, 1652, 1666],
                [1684, 1680, 1666],
                [1654, 1684, 1666],
                [1680, 1684, 1696],
                [1710, 1680, 1696],
                [1719, 1710, 1696],
                [1684, 1719, 1696],
                [1543, 1541, 1575],
                [1608, 1543, 1575],
                [1613, 1608, 1575],
                [1541, 1613, 1575],
                [1608, 1613, 1634],
                [1648, 1608, 1634],
                [1652, 1648, 1634],
                [1613, 1652, 1634],
                [1545, 1543, 1604],
                [1644, 1545, 1604],
                [1648, 1644, 1604],
                [1543, 1648, 1604],
                [1648, 1652, 1661],
                [1674, 1648, 1661],
                [1680, 1674, 1661],
                [1652, 1680, 1661],
                [1674, 1680, 1689],
                [1698, 1674, 1689],
                [1710, 1698, 1689],
                [1680, 1710, 1689],
                [1644, 1648, 1668],
                [1687, 1644, 1668],
                [1698, 1687, 1668],
                [1648, 1698, 1668],
                [1719, 1721, 1740],
                [1761, 1719, 1740],
                [1768, 1761, 1740],
                [1721, 1768, 1740],
                [1710, 1719, 1734],
                [1753, 1710, 1734],
                [1761, 1753, 1734],
                [1719, 1761, 1734],
                [1761, 1768, 1781],
                [1795, 1761, 1781],
                [1801, 1795, 1781],
                [1768, 1801, 1781],
                [1753, 1761, 1775],
                [1785, 1753, 1775],
                [1795, 1785, 1775],
                [1761, 1795, 1775],
                [1698, 1710, 1726],
                [1742, 1698, 1726],
                [1753, 1742, 1726],
                [1710, 1753, 1726],
                [1687, 1698, 1715],
                [1728, 1687, 1715],
                [1742, 1728, 1715],
                [1698, 1742, 1715],
                [1742, 1753, 1759],
                [1769, 1742, 1759],
                [1785, 1769, 1759],
                [1753, 1785, 1759],
                [1728, 1742, 1747],
                [1751, 1728, 1747],
                [1769, 1751, 1747],
                [1742, 1769, 1747],
                [1547, 1545, 1596],
                [1640, 1547, 1596],
                [1644, 1640, 1596],
                [1545, 1644, 1596],
                [1549, 1547, 1594],
                [1636, 1549, 1594],
                [1640, 1636, 1594],
                [1547, 1640, 1594],
                [1640, 1644, 1659],
                [1678, 1640, 1659],
                [1687, 1678, 1659],
                [1644, 1687, 1659],
                [1636, 1640, 1656],
                [1672, 1636, 1656],
                [1678, 1672, 1656],
                [1640, 1678, 1656],
                [1551, 1549, 1590],
                [1631, 1551, 1590],
                [1636, 1631, 1590],
                [1549, 1636, 1590],
                [1553, 1551, 1586],
                [1630, 1553, 1586],
                [1631, 1630, 1586],
                [1551, 1631, 1586],
                [1631, 1636, 1650],
                [1664, 1631, 1650],
                [1672, 1664, 1650],
                [1636, 1672, 1650],
                [1630, 1631, 1646],
                [1663, 1630, 1646],
                [1664, 1663, 1646],
                [1631, 1664, 1646],
                [1678, 1687, 1702],
                [1713, 1678, 1702],
                [1728, 1713, 1702],
                [1687, 1728, 1702],
                [1672, 1678, 1691],
                [1704, 1672, 1691],
                [1713, 1704, 1691],
                [1678, 1713, 1691],
                [1713, 1728, 1732],
                [1738, 1713, 1732],
                [1751, 1738, 1732],
                [1728, 1751, 1732],
                [1704, 1713, 1722],
                [1724, 1704, 1722],
                [1738, 1724, 1722],
                [1713, 1738, 1722],
                [1664, 1672, 1682],
                [1694, 1664, 1682],
                [1704, 1694, 1682],
                [1672, 1704, 1682],
                [1663, 1664, 1676],
                [1693, 1663, 1676],
                [1694, 1693, 1676],
                [1664, 1694, 1676],
                [1694, 1704, 1708],
                [1717, 1694, 1708],
                [1724, 1717, 1708],
                [1704, 1724, 1708],
                [1693, 1694, 1706],
                [1712, 1693, 1706],
                [1717, 1712, 1706],
                [1694, 1717, 1706],
                [1795, 1801, 1811],
                [1823, 1795, 1811],
                [1825, 1823, 1811],
                [1801, 1825, 1811],
                [1785, 1795, 1804],
                [1809, 1785, 1804],
                [1823, 1809, 1804],
                [1795, 1823, 1804],
                [1823, 1825, 1840],
                [1860, 1823, 1840],
                [1870, 1860, 1840],
                [1825, 1870, 1840],
                [1809, 1823, 1829],
                [1842, 1809, 1829],
                [1860, 1842, 1829],
                [1823, 1860, 1829],
                [1769, 1785, 1791],
                [1793, 1769, 1791],
                [1809, 1793, 1791],
                [1785, 1809, 1791],
                [1751, 1769, 1773],
                [1777, 1751, 1773],
                [1793, 1777, 1773],
                [1769, 1793, 1773],
                [1793, 1809, 1817],
                [1821, 1793, 1817],
                [1842, 1821, 1817],
                [1809, 1842, 1817],
                [1777, 1793, 1797],
                [1799, 1777, 1797],
                [1821, 1799, 1797],
                [1793, 1821, 1797],
                [1860, 1870, 1889],
                [1901, 1860, 1889],
                [1905, 1901, 1889],
                [1870, 1905, 1889],
                [1842, 1860, 1879],
                [1891, 1842, 1879],
                [1901, 1891, 1879],
                [1860, 1901, 1879],
                [1901, 1905, 1912],
                [1922, 1901, 1912],
                [1926, 1922, 1912],
                [1905, 1926, 1912],
                [1922, 1926, 1938],
                [1948, 1922, 1938],
                [1952, 1948, 1938],
                [1926, 1952, 1938],
                [1891, 1901, 1906],
                [1910, 1891, 1906],
                [1922, 1910, 1906],
                [1901, 1922, 1906],
                [1910, 1922, 1929],
                [1934, 1910, 1929],
                [1948, 1934, 1929],
                [1922, 1948, 1929],
                [1821, 1842, 1858],
                [1873, 1821, 1858],
                [1891, 1873, 1858],
                [1842, 1891, 1858],
                [1799, 1821, 1827],
                [1838, 1799, 1827],
                [1873, 1838, 1827],
                [1821, 1873, 1827],
                [1838, 1891, 1885],
                [1877, 1838, 1885],
                [1910, 1877, 1885],
                [1891, 1910, 1885],
                [1877, 1910, 1908],
                [1895, 1877, 1908],
                [1934, 1895, 1908],
                [1910, 1934, 1908],
                [1738, 1751, 1764],
                [1779, 1738, 1764],
                [1799, 1779, 1764],
                [1751, 1799, 1764],
                [1724, 1738, 1749],
                [1757, 1724, 1749],
                [1779, 1757, 1749],
                [1738, 1779, 1749],
                [1717, 1724, 1736],
                [1745, 1717, 1736],
                [1757, 1745, 1736],
                [1724, 1757, 1736],
                [1712, 1717, 1730],
                [1744, 1712, 1730],
                [1745, 1744, 1730],
                [1717, 1745, 1730],
                [1779, 1799, 1807],
                [1815, 1779, 1807],
                [1838, 1815, 1807],
                [1799, 1838, 1807],
                [1757, 1779, 1783],
                [1787, 1757, 1783],
                [1815, 1787, 1783],
                [1779, 1815, 1783],
                [1787, 1838, 1844],
                [1831, 1787, 1844],
                [1895, 1831, 1844],
                [1838, 1895, 1844],
                [1745, 1757, 1766],
                [1771, 1745, 1766],
                [1787, 1771, 1766],
                [1757, 1787, 1766],
                [1744, 1745, 1755],
                [1763, 1744, 1755],
                [1771, 1763, 1755],
                [1745, 1771, 1755],
                [1771, 1787, 1802],
                [1813, 1771, 1802],
                [1831, 1813, 1802],
                [1787, 1831, 1802],
                [1763, 1771, 1789],
                [1806, 1763, 1789],
                [1813, 1806, 1789],
                [1771, 1813, 1789],
                [1814, 1806, 1820],
                [1836, 1814, 1820],
                [1826, 1836, 1820],
                [1806, 1826, 1820],
                [1832, 1814, 1834],
                [1872, 1832, 1834],
                [1836, 1872, 1834],
                [1814, 1836, 1834],
                [1898, 1832, 1888],
                [1915, 1898, 1888],
                [1872, 1915, 1888],
                [1832, 1872, 1888],
                [1836, 1826, 1847],
                [1857, 1836, 1847],
                [1850, 1857, 1847],
                [1826, 1850, 1847],
                [1872, 1836, 1863],
                [1882, 1872, 1863],
                [1857, 1882, 1863],
                [1836, 1857, 1863],
                [1915, 1872, 1900],
                [1919, 1915, 1900],
                [1882, 1919, 1900],
                [1872, 1882, 1900],
                [1935, 1898, 1928],
                [1954, 1935, 1928],
                [1915, 1954, 1928],
                [1898, 1915, 1928],
                [1949, 1935, 1951],
                [1969, 1949, 1951],
                [1954, 1969, 1951],
                [1935, 1954, 1951],
                [1952, 1949, 1962],
                [1974, 1952, 1962],
                [1969, 1974, 1962],
                [1949, 1969, 1962],
                [1954, 1915, 1941],
                [1958, 1954, 1941],
                [1919, 1958, 1941],
                [1915, 1919, 1941],
                [1969, 1954, 1965],
                [1971, 1969, 1965],
                [1958, 1971, 1965],
                [1954, 1958, 1965],
                [1974, 1969, 1973],
                [1975, 1974, 1973],
                [1971, 1975, 1973],
                [1969, 1971, 1973],
                [1857, 1850, 1855],
                [1867, 1857, 1855],
                [1853, 1867, 1855],
                [1850, 1853, 1855],
                [1882, 1857, 1876],
                [1884, 1882, 1876],
                [1867, 1884, 1876],
                [1857, 1867, 1876],
                [1919, 1882, 1904],
                [1917, 1919, 1904],
                [1884, 1917, 1904],
                [1882, 1884, 1904],
                [1867, 1853, 1852],
                [1849, 1867, 1852],
                [1837, 1849, 1852],
                [1853, 1837, 1852],
                [1884, 1867, 1869],
                [1865, 1884, 1869],
                [1849, 1865, 1869],
                [1867, 1849, 1869],
                [1917, 1884, 1894],
                [1897, 1917, 1894],
                [1865, 1897, 1894],
                [1884, 1865, 1894],
                [1958, 1919, 1937],
                [1947, 1958, 1937],
                [1917, 1947, 1937],
                [1919, 1917, 1937],
                [1971, 1958, 1960],
                [1956, 1971, 1960],
                [1947, 1956, 1960],
                [1958, 1947, 1960],
                [1975, 1971, 1967],
                [1963, 1975, 1967],
                [1956, 1963, 1967],
                [1971, 1956, 1967],
                [1947, 1917, 1921],
                [1925, 1947, 1921],
                [1897, 1925, 1921],
                [1917, 1897, 1921],
                [1956, 1947, 1943],
                [1932, 1956, 1943],
                [1925, 1932, 1943],
                [1947, 1925, 1943],
                [1963, 1956, 1945],
                [1933, 1963, 1945],
                [1932, 1933, 1945],
                [1956, 1932, 1945],
                [1948, 1952, 1961],
                [1968, 1948, 1961],
                [1974, 1968, 1961],
                [1952, 1974, 1961],
                [1934, 1948, 1950],
                [1953, 1934, 1950],
                [1968, 1953, 1950],
                [1948, 1968, 1950],
                [1895, 1934, 1927],
                [1914, 1895, 1927],
                [1953, 1914, 1927],
                [1934, 1953, 1927],
                [1968, 1974, 1972],
                [1970, 1968, 1972],
                [1975, 1970, 1972],
                [1974, 1975, 1972],
                [1953, 1968, 1964],
                [1957, 1953, 1964],
                [1970, 1957, 1964],
                [1968, 1970, 1964],
                [1914, 1953, 1940],
                [1918, 1914, 1940],
                [1957, 1918, 1940],
                [1953, 1957, 1940],
                [1831, 1895, 1887],
                [1871, 1831, 1887],
                [1914, 1871, 1887],
                [1895, 1914, 1887],
                [1813, 1831, 1833],
                [1835, 1813, 1833],
                [1871, 1835, 1833],
                [1831, 1871, 1833],
                [1806, 1813, 1819],
                [1826, 1806, 1819],
                [1835, 1826, 1819],
                [1813, 1835, 1819],
                [1871, 1914, 1899],
                [1881, 1871, 1899],
                [1918, 1881, 1899],
                [1914, 1918, 1899],
                [1835, 1871, 1862],
                [1856, 1835, 1862],
                [1881, 1856, 1862],
                [1871, 1881, 1862],
                [1826, 1835, 1846],
                [1850, 1826, 1846],
                [1856, 1850, 1846],
                [1835, 1856, 1846],
                [1970, 1975, 1966],
                [1955, 1970, 1966],
                [1963, 1955, 1966],
                [1975, 1963, 1966],
                [1957, 1970, 1959],
                [1946, 1957, 1959],
                [1955, 1946, 1959],
                [1970, 1955, 1959],
                [1918, 1957, 1936],
                [1916, 1918, 1936],
                [1946, 1916, 1936],
                [1957, 1946, 1936],
                [1955, 1963, 1944],
                [1931, 1955, 1944],
                [1933, 1931, 1944],
                [1963, 1933, 1944],
                [1946, 1955, 1942],
                [1924, 1946, 1942],
                [1931, 1924, 1942],
                [1955, 1931, 1942],
                [1916, 1946, 1920],
                [1896, 1916, 1920],
                [1924, 1896, 1920],
                [1946, 1924, 1920],
                [1881, 1918, 1903],
                [1883, 1881, 1903],
                [1916, 1883, 1903],
                [1918, 1916, 1903],
                [1856, 1881, 1875],
                [1866, 1856, 1875],
                [1883, 1866, 1875],
                [1881, 1883, 1875],
                [1850, 1856, 1854],
                [1853, 1850, 1854],
                [1866, 1853, 1854],
                [1856, 1866, 1854],
                [1883, 1916, 1893],
                [1864, 1883, 1893],
                [1896, 1864, 1893],
                [1916, 1896, 1893],
                [1866, 1883, 1868],
                [1848, 1866, 1868],
                [1864, 1848, 1868],
                [1883, 1864, 1868],
                [1853, 1866, 1851],
                [1837, 1853, 1851],
                [1848, 1837, 1851],
                [1866, 1848, 1851],
                [1069, 952, 992],
                [1072, 1069, 992],
                [952, 1072, 992],
                [1069, 1072, 1094],
                [1118, 1069, 1094],
                [1134, 1118, 1094],
                [1072, 1134, 1094],
                [1030, 952, 984],
                [1069, 1030, 984],
                [952, 1069, 984],
                [1030, 1069, 1076],
                [1080, 1030, 1076],
                [1118, 1080, 1076],
                [1069, 1118, 1076],
                [1118, 1134, 1133],
                [1131, 1118, 1133],
                [1139, 1131, 1133],
                [1134, 1139, 1133],
                [1131, 1139, 1129],
                [1110, 1131, 1129],
                [1127, 1110, 1129],
                [1139, 1127, 1129],
                [1080, 1118, 1104],
                [1088, 1080, 1104],
                [1131, 1088, 1104],
                [1118, 1131, 1104],
                [1088, 1131, 1096],
                [1074, 1088, 1096],
                [1110, 1074, 1096],
                [1131, 1110, 1096],
                [980, 952, 964],
                [1030, 980, 964],
                [952, 1030, 964],
                [980, 1030, 1028],
                [1002, 980, 1028],
                [1080, 1002, 1028],
                [1030, 1080, 1028],
                [951, 952, 954],
                [980, 951, 954],
                [952, 980, 954],
                [951, 980, 962],
                [949, 951, 962],
                [1002, 949, 962],
                [980, 1002, 962],
                [1002, 1080, 1059],
                [1012, 1002, 1059],
                [1088, 1012, 1059],
                [1080, 1088, 1059],
                [1012, 1088, 1053],
                [998, 1012, 1053],
                [1074, 998, 1053],
                [1088, 1074, 1053],
                [949, 1002, 974],
                [947, 949, 974],
                [1012, 947, 974],
                [1002, 1012, 974],
                [947, 1012, 972],
                [945, 947, 972],
                [998, 945, 972],
                [1012, 998, 972],
                [1110, 1127, 1082],
                [1047, 1110, 1082],
                [1060, 1047, 1082],
                [1127, 1060, 1082],
                [1074, 1110, 1071],
                [1004, 1074, 1071],
                [1047, 1004, 1071],
                [1110, 1047, 1071],
                [1047, 1060, 1039],
                [1024, 1047, 1039],
                [1031, 1024, 1039],
                [1060, 1031, 1039],
                [1024, 1031, 1041],
                [1049, 1024, 1041],
                [1063, 1049, 1041],
                [1031, 1063, 1041],
                [1004, 1047, 1018],
                [994, 1004, 1018],
                [1024, 994, 1018],
                [1047, 1024, 1018],
                [994, 1024, 1020],
                [1010, 994, 1020],
                [1049, 1010, 1020],
                [1024, 1049, 1020],
                [998, 1074, 1014],
                [976, 998, 1014],
                [1004, 976, 1014],
                [1074, 1004, 1014],
                [945, 998, 960],
                [943, 945, 960],
                [976, 943, 960],
                [998, 976, 960],
                [976, 1004, 986],
                [970, 976, 986],
                [994, 970, 986],
                [1004, 994, 986],
                [970, 994, 990],
                [978, 970, 990],
                [1010, 978, 990],
                [994, 1010, 990],
                [943, 976, 956],
                [941, 943, 956],
                [970, 941, 956],
                [976, 970, 956],
                [941, 970, 958],
                [939, 941, 958],
                [978, 939, 958],
                [970, 978, 958],
                [875, 952, 901],
                [951, 875, 901],
                [952, 951, 901],
                [875, 951, 893],
                [853, 875, 893],
                [949, 853, 893],
                [951, 949, 893],
                [825, 952, 891],
                [875, 825, 891],
                [952, 875, 891],
                [825, 875, 827],
                [775, 825, 827],
                [853, 775, 827],
                [875, 853, 827],
                [853, 949, 881],
                [843, 853, 881],
                [947, 843, 881],
                [949, 947, 881],
                [843, 947, 883],
                [857, 843, 883],
                [945, 857, 883],
                [947, 945, 883],
                [775, 853, 796],
                [767, 775, 796],
                [843, 767, 796],
                [853, 843, 796],
                [767, 843, 802],
                [781, 767, 802],
                [857, 781, 802],
                [843, 857, 802],
                [786, 952, 871],
                [825, 786, 871],
                [952, 825, 871],
                [786, 825, 779],
                [737, 786, 779],
                [775, 737, 779],
                [825, 775, 779],
                [782, 952, 863],
                [786, 782, 863],
                [952, 786, 863],
                [782, 786, 761],
                [720, 782, 761],
                [737, 720, 761],
                [786, 737, 761],
                [737, 775, 751],
                [724, 737, 751],
                [767, 724, 751],
                [775, 767, 751],
                [724, 767, 759],
                [745, 724, 759],
                [781, 745, 759],
                [767, 781, 759],
                [720, 737, 722],
                [715, 720, 722],
                [724, 715, 722],
                [737, 724, 722],
                [715, 724, 726],
                [727, 715, 726],
                [745, 727, 726],
                [724, 745, 726],
                [857, 945, 895],
                [879, 857, 895],
                [943, 879, 895],
                [945, 943, 895],
                [781, 857, 841],
                [851, 781, 841],
                [879, 851, 841],
                [857, 879, 841],
                [879, 943, 899],
                [885, 879, 899],
                [941, 885, 899],
                [943, 941, 899],
                [885, 941, 897],
                [877, 885, 897],
                [939, 877, 897],
                [941, 939, 897],
                [851, 879, 869],
                [861, 851, 869],
                [885, 861, 869],
                [879, 885, 869],
                [861, 885, 865],
                [845, 861, 865],
                [877, 845, 865],
                [885, 877, 865],
                [745, 781, 784],
                [808, 745, 784],
                [851, 808, 784],
                [781, 851, 784],
                [727, 745, 773],
                [794, 727, 773],
                [808, 794, 773],
                [745, 808, 773],
                [808, 851, 837],
                [831, 808, 837],
                [861, 831, 837],
                [851, 861, 837],
                [831, 861, 835],
                [806, 831, 835],
                [845, 806, 835],
                [861, 845, 835],
                [794, 808, 816],
                [823, 794, 816],
                [831, 823, 816],
                [808, 831, 816],
                [823, 831, 814],
                [791, 823, 814],
                [806, 791, 814],
                [831, 806, 814],
                [785, 952, 862],
                [782, 785, 862],
                [952, 782, 862],
                [785, 782, 760],
                [736, 785, 760],
                [720, 736, 760],
                [782, 720, 760],
                [824, 952, 870],
                [785, 824, 870],
                [952, 785, 870],
                [824, 785, 778],
                [774, 824, 778],
                [736, 774, 778],
                [785, 736, 778],
                [736, 720, 721],
                [723, 736, 721],
                [715, 723, 721],
                [720, 715, 721],
                [723, 715, 725],
                [744, 723, 725],
                [727, 744, 725],
                [715, 727, 725],
                [774, 736, 750],
                [766, 774, 750],
                [723, 766, 750],
                [736, 723, 750],
                [766, 723, 758],
                [780, 766, 758],
                [744, 780, 758],
                [723, 744, 758],
                [874, 952, 890],
                [824, 874, 890],
                [952, 824, 890],
                [874, 824, 826],
                [852, 874, 826],
                [774, 852, 826],
                [824, 774, 826],
                [950, 952, 900],
                [874, 950, 900],
                [952, 874, 900],
                [950, 874, 892],
                [948, 950, 892],
                [852, 948, 892],
                [874, 852, 892],
                [852, 774, 795],
                [842, 852, 795],
                [766, 842, 795],
                [774, 766, 795],
                [842, 766, 801],
                [856, 842, 801],
                [780, 856, 801],
                [766, 780, 801],
                [948, 852, 880],
                [946, 948, 880],
                [842, 946, 880],
                [852, 842, 880],
                [946, 842, 882],
                [944, 946, 882],
                [856, 944, 882],
                [842, 856, 882],
                [744, 727, 772],
                [807, 744, 772],
                [794, 807, 772],
                [727, 794, 772],
                [780, 744, 783],
                [850, 780, 783],
                [807, 850, 783],
                [744, 807, 783],
                [807, 794, 815],
                [830, 807, 815],
                [823, 830, 815],
                [794, 823, 815],
                [830, 823, 813],
                [805, 830, 813],
                [791, 805, 813],
                [823, 791, 813],
                [850, 807, 836],
                [860, 850, 836],
                [830, 860, 836],
                [807, 830, 836],
                [860, 830, 834],
                [844, 860, 834],
                [805, 844, 834],
                [830, 805, 834],
                [856, 780, 840],
                [878, 856, 840],
                [850, 878, 840],
                [780, 850, 840],
                [944, 856, 894],
                [942, 944, 894],
                [878, 942, 894],
                [856, 878, 894],
                [878, 850, 868],
                [884, 878, 868],
                [860, 884, 868],
                [850, 860, 868],
                [884, 860, 864],
                [876, 884, 864],
                [844, 876, 864],
                [860, 844, 864],
                [942, 878, 898],
                [940, 942, 898],
                [884, 940, 898],
                [878, 884, 898],
                [940, 884, 896],
                [938, 940, 896],
                [876, 938, 896],
                [884, 876, 896],
                [979, 952, 953],
                [950, 979, 953],
                [952, 950, 953],
                [979, 950, 961],
                [1001, 979, 961],
                [948, 1001, 961],
                [950, 948, 961],
                [1029, 952, 963],
                [979, 1029, 963],
                [952, 979, 963],
                [1029, 979, 1027],
                [1079, 1029, 1027],
                [1001, 1079, 1027],
                [979, 1001, 1027],
                [1001, 948, 973],
                [1011, 1001, 973],
                [946, 1011, 973],
                [948, 946, 973],
                [1011, 946, 971],
                [997, 1011, 971],
                [944, 997, 971],
                [946, 944, 971],
                [1079, 1001, 1058],
                [1087, 1079, 1058],
                [1011, 1087, 1058],
                [1001, 1011, 1058],
                [1087, 1011, 1052],
                [1073, 1087, 1052],
                [997, 1073, 1052],
                [1011, 997, 1052],
                [1068, 952, 983],
                [1029, 1068, 983],
                [952, 1029, 983],
                [1068, 1029, 1075],
                [1117, 1068, 1075],
                [1079, 1117, 1075],
                [1029, 1079, 1075],
                [1072, 952, 991],
                [1068, 1072, 991],
                [952, 1068, 991],
                [1072, 1068, 1093],
                [1134, 1072, 1093],
                [1117, 1134, 1093],
                [1068, 1117, 1093],
                [1117, 1079, 1103],
                [1130, 1117, 1103],
                [1087, 1130, 1103],
                [1079, 1087, 1103],
                [1130, 1087, 1095],
                [1109, 1130, 1095],
                [1073, 1109, 1095],
                [1087, 1073, 1095],
                [1134, 1117, 1132],
                [1139, 1134, 1132],
                [1130, 1139, 1132],
                [1117, 1130, 1132],
                [1139, 1130, 1128],
                [1127, 1139, 1128],
                [1109, 1127, 1128],
                [1130, 1109, 1128],
                [997, 944, 959],
                [975, 997, 959],
                [942, 975, 959],
                [944, 942, 959],
                [1073, 997, 1013],
                [1003, 1073, 1013],
                [975, 1003, 1013],
                [997, 975, 1013],
                [975, 942, 955],
                [969, 975, 955],
                [940, 969, 955],
                [942, 940, 955],
                [969, 940, 957],
                [977, 969, 957],
                [938, 977, 957],
                [940, 938, 957],
                [1003, 975, 985],
                [993, 1003, 985],
                [969, 993, 985],
                [975, 969, 985],
                [993, 969, 989],
                [1009, 993, 989],
                [977, 1009, 989],
                [969, 977, 989],
                [1109, 1073, 1070],
                [1046, 1109, 1070],
                [1003, 1046, 1070],
                [1073, 1003, 1070],
                [1127, 1109, 1081],
                [1060, 1127, 1081],
                [1046, 1060, 1081],
                [1109, 1046, 1081],
                [1046, 1003, 1017],
                [1023, 1046, 1017],
                [993, 1023, 1017],
                [1003, 993, 1017],
                [1023, 993, 1019],
                [1048, 1023, 1019],
                [1009, 1048, 1019],
                [993, 1009, 1019],
                [1060, 1046, 1038],
                [1031, 1060, 1038],
                [1023, 1031, 1038],
                [1046, 1023, 1038],
                [1031, 1023, 1040],
                [1063, 1031, 1040],
                [1048, 1063, 1040],
                [1023, 1048, 1040],
                [1049, 1063, 1120],
                [1161, 1049, 1120],
                [1170, 1161, 1120],
                [1063, 1170, 1120],
                [1010, 1049, 1092],
                [1126, 1010, 1092],
                [1161, 1126, 1092],
                [1049, 1161, 1092],
                [1165, 1170, 1224],
                [1272, 1165, 1224],
                [1279, 1272, 1224],
                [1170, 1279, 1224],
                [1161, 1165, 1216],
                [1250, 1161, 1216],
                [1272, 1250, 1216],
                [1165, 1272, 1216],
                [1141, 1161, 1196],
                [1234, 1141, 1196],
                [1250, 1234, 1196],
                [1161, 1250, 1196],
                [1126, 1141, 1178],
                [1206, 1126, 1178],
                [1234, 1206, 1178],
                [1141, 1234, 1178],
                [978, 1010, 1045],
                [1043, 978, 1045],
                [1126, 1043, 1045],
                [1010, 1126, 1045],
                [939, 978, 966],
                [937, 939, 966],
                [1043, 937, 966],
                [978, 1043, 966],
                [1084, 1126, 1153],
                [1174, 1084, 1153],
                [1206, 1174, 1153],
                [1126, 1206, 1153],
                [1043, 1084, 1112],
                [1124, 1043, 1112],
                [1174, 1124, 1112],
                [1084, 1174, 1112],
                [982, 1043, 1055],
                [1033, 982, 1055],
                [1124, 1033, 1055],
                [1043, 1124, 1055],
                [937, 982, 968],
                [935, 937, 968],
                [1033, 935, 968],
                [982, 1033, 968],
                [1272, 1279, 1321],
                [1369, 1272, 1321],
                [1376, 1369, 1321],
                [1279, 1376, 1321],
                [1250, 1272, 1309],
                [1347, 1250, 1309],
                [1369, 1347, 1309],
                [1272, 1369, 1309],
                [1234, 1250, 1285],
                [1315, 1234, 1285],
                [1347, 1315, 1285],
                [1250, 1347, 1285],
                [1206, 1234, 1252],
                [1278, 1206, 1252],
                [1315, 1278, 1252],
                [1234, 1315, 1252],
                [1369, 1376, 1388],
                [1402, 1369, 1388],
                [1415, 1402, 1388],
                [1376, 1415, 1388],
                [1347, 1369, 1375],
                [1378, 1347, 1375],
                [1402, 1378, 1375],
                [1369, 1402, 1375],
                [1402, 1415, 1419],
                [1423, 1402, 1419],
                [1434, 1423, 1419],
                [1415, 1434, 1419],
                [1378, 1402, 1396],
                [1390, 1378, 1396],
                [1423, 1390, 1396],
                [1402, 1423, 1396],
                [1315, 1347, 1339],
                [1335, 1315, 1339],
                [1378, 1335, 1339],
                [1347, 1378, 1339],
                [1278, 1315, 1305],
                [1295, 1278, 1305],
                [1335, 1295, 1305],
                [1315, 1335, 1305],
                [1335, 1378, 1365],
                [1353, 1335, 1365],
                [1390, 1353, 1365],
                [1378, 1390, 1365],
                [1295, 1335, 1325],
                [1301, 1295, 1325],
                [1353, 1301, 1325],
                [1335, 1353, 1325],
                [1174, 1206, 1222],
                [1226, 1174, 1222],
                [1278, 1226, 1222],
                [1206, 1278, 1222],
                [1124, 1174, 1176],
                [1169, 1124, 1176],
                [1226, 1169, 1176],
                [1174, 1226, 1176],
                [1033, 1124, 1108],
                [1078, 1033, 1108],
                [1169, 1078, 1108],
                [1124, 1169, 1108],
                [935, 1033, 988],
                [931, 935, 988],
                [1078, 931, 988],
                [1033, 1078, 988],
                [1226, 1278, 1256],
                [1240, 1226, 1256],
                [1295, 1240, 1256],
                [1278, 1295, 1256],
                [1169, 1226, 1202],
                [1180, 1169, 1202],
                [1240, 1180, 1202],
                [1226, 1240, 1202],
                [1240, 1295, 1274],
                [1244, 1240, 1274],
                [1301, 1244, 1274],
                [1295, 1301, 1274],
                [1180, 1240, 1218],
                [1186, 1180, 1218],
                [1244, 1186, 1218],
                [1240, 1244, 1218],
                [1078, 1169, 1138],
                [1086, 1078, 1138],
                [1180, 1086, 1138],
                [1169, 1180, 1138],
                [931, 1078, 996],
                [925, 931, 996],
                [1086, 925, 996],
                [1078, 1086, 996],
                [1086, 1180, 1145],
                [1090, 1086, 1145],
                [1186, 1090, 1145],
                [1180, 1186, 1145],
                [925, 1086, 1000],
                [921, 925, 1000],
                [1090, 921, 1000],
                [1086, 1090, 1000],
                [877, 939, 889],
                [812, 877, 889],
                [937, 812, 889],
                [939, 937, 889],
                [845, 877, 810],
                [729, 845, 810],
                [812, 729, 810],
                [877, 812, 810],
                [873, 937, 887],
                [822, 873, 887],
                [935, 822, 887],
                [937, 935, 887],
                [812, 873, 800],
                [731, 812, 800],
                [822, 731, 800],
                [873, 822, 800],
                [771, 812, 743],
                [681, 771, 743],
                [731, 681, 743],
                [812, 731, 743],
                [729, 771, 702],
                [649, 729, 702],
                [681, 649, 702],
                [771, 681, 702],
                [806, 845, 763],
                [694, 806, 763],
                [729, 694, 763],
                [845, 729, 763],
                [791, 806, 735],
                [684, 791, 735],
                [694, 684, 735],
                [806, 694, 735],
                [714, 729, 677],
                [621, 714, 677],
                [649, 621, 677],
                [729, 649, 677],
                [694, 714, 659],
                [605, 694, 659],
                [621, 605, 659],
                [714, 621, 659],
                [690, 694, 639],
                [583, 690, 639],
                [605, 583, 639],
                [694, 605, 639],
                [684, 690, 631],
                [575, 684, 631],
                [583, 575, 631],
                [690, 583, 631],
                [822, 935, 867],
                [777, 822, 867],
                [931, 777, 867],
                [935, 931, 867],
                [731, 822, 747],
                [686, 731, 747],
                [777, 686, 747],
                [822, 777, 747],
                [681, 731, 679],
                [629, 681, 679],
                [686, 629, 679],
                [731, 686, 679],
                [649, 681, 633],
                [577, 649, 633],
                [629, 577, 633],
                [681, 629, 633],
                [777, 931, 859],
                [769, 777, 859],
                [925, 769, 859],
                [931, 925, 859],
                [686, 777, 717],
                [675, 686, 717],
                [769, 675, 717],
                [777, 769, 717],
                [769, 925, 855],
                [765, 769, 855],
                [921, 765, 855],
                [925, 921, 855],
                [675, 769, 710],
                [669, 675, 710],
                [765, 669, 710],
                [769, 765, 710],
                [629, 686, 653],
                [615, 629, 653],
                [675, 615, 653],
                [686, 675, 653],
                [577, 629, 599],
                [560, 577, 599],
                [615, 560, 599],
                [629, 615, 599],
                [615, 675, 637],
                [611, 615, 637],
                [669, 611, 637],
                [675, 669, 637],
                [560, 615, 581],
                [554, 560, 581],
                [611, 554, 581],
                [615, 611, 581],
                [621, 649, 603],
                [540, 621, 603],
                [577, 540, 603],
                [649, 577, 603],
                [605, 621, 570],
                [508, 605, 570],
                [540, 508, 570],
                [621, 540, 570],
                [583, 605, 546],
                [486, 583, 546],
                [508, 486, 546],
                [605, 508, 546],
                [575, 583, 534],
                [478, 575, 534],
                [486, 478, 534],
                [583, 486, 534],
                [540, 577, 550],
                [520, 540, 550],
                [560, 520, 550],
                [577, 560, 550],
                [508, 540, 516],
                [477, 508, 516],
                [520, 477, 516],
                [540, 520, 516],
                [520, 560, 530],
                [502, 520, 530],
                [554, 502, 530],
                [560, 554, 530],
                [477, 520, 490],
                [465, 477, 490],
                [502, 465, 490],
                [520, 502, 490],
                [486, 508, 480],
                [453, 486, 480],
                [477, 453, 480],
                [508, 477, 480],
                [478, 486, 467],
                [439, 478, 467],
                [453, 439, 467],
                [486, 453, 467],
                [453, 477, 459],
                [432, 453, 459],
                [465, 432, 459],
                [477, 465, 459],
                [439, 453, 436],
                [420, 439, 436],
                [432, 420, 436],
                [453, 432, 436],
                [805, 791, 734],
                [693, 805, 734],
                [684, 693, 734],
                [791, 684, 734],
                [844, 805, 762],
                [728, 844, 762],
                [693, 728, 762],
                [805, 693, 762],
                [689, 684, 630],
                [582, 689, 630],
                [575, 582, 630],
                [684, 575, 630],
                [693, 689, 638],
                [604, 693, 638],
                [582, 604, 638],
                [689, 582, 638],
                [713, 693, 658],
                [620, 713, 658],
                [604, 620, 658],
                [693, 604, 658],
                [728, 713, 676],
                [648, 728, 676],
                [620, 648, 676],
                [713, 620, 676],
                [876, 844, 809],
                [811, 876, 809],
                [728, 811, 809],
                [844, 728, 809],
                [938, 876, 888],
                [936, 938, 888],
                [811, 936, 888],
                [876, 811, 888],
                [770, 728, 701],
                [680, 770, 701],
                [648, 680, 701],
                [728, 648, 701],
                [811, 770, 742],
                [730, 811, 742],
                [680, 730, 742],
                [770, 680, 742],
                [872, 811, 799],
                [821, 872, 799],
                [730, 821, 799],
                [811, 730, 799],
                [936, 872, 886],
                [934, 936, 886],
                [821, 934, 886],
                [872, 821, 886],
                [582, 575, 533],
                [485, 582, 533],
                [478, 485, 533],
                [575, 478, 533],
                [604, 582, 545],
                [507, 604, 545],
                [485, 507, 545],
                [582, 485, 545],
                [620, 604, 569],
                [539, 620, 569],
                [507, 539, 569],
                [604, 507, 569],
                [648, 620, 602],
                [576, 648, 602],
                [539, 576, 602],
                [620, 539, 602],
                [485, 478, 466],
                [452, 485, 466],
                [439, 452, 466],
                [478, 439, 466],
                [507, 485, 479],
                [476, 507, 479],
                [452, 476, 479],
                [485, 452, 479],
                [452, 439, 435],
                [431, 452, 435],
                [420, 431, 435],
                [439, 420, 435],
                [476, 452, 458],
                [464, 476, 458],
                [431, 464, 458],
                [452, 431, 458],
                [539, 507, 515],
                [519, 539, 515],
                [476, 519, 515],
                [507, 476, 515],
                [576, 539, 549],
                [559, 576, 549],
                [519, 559, 549],
                [539, 519, 549],
                [519, 476, 489],
                [501, 519, 489],
                [464, 501, 489],
                [476, 464, 489],
                [559, 519, 529],
                [553, 559, 529],
                [501, 553, 529],
                [519, 501, 529],
                [680, 648, 632],
                [628, 680, 632],
                [576, 628, 632],
                [648, 576, 632],
                [730, 680, 678],
                [685, 730, 678],
                [628, 685, 678],
                [680, 628, 678],
                [821, 730, 746],
                [776, 821, 746],
                [685, 776, 746],
                [730, 685, 746],
                [934, 821, 866],
                [930, 934, 866],
                [776, 930, 866],
                [821, 776, 866],
                [628, 576, 598],
                [614, 628, 598],
                [559, 614, 598],
                [576, 559, 598],
                [685, 628, 652],
                [674, 685, 652],
                [614, 674, 652],
                [628, 614, 652],
                [614, 559, 580],
                [610, 614, 580],
                [553, 610, 580],
                [559, 553, 580],
                [674, 614, 636],
                [668, 674, 636],
                [610, 668, 636],
                [614, 610, 636],
                [776, 685, 716],
                [768, 776, 716],
                [674, 768, 716],
                [685, 674, 716],
                [930, 776, 858],
                [924, 930, 858],
                [768, 924, 858],
                [776, 768, 858],
                [768, 674, 709],
                [764, 768, 709],
                [668, 764, 709],
                [674, 668, 709],
                [924, 768, 854],
                [920, 924, 854],
                [764, 920, 854],
                [768, 764, 854],
                [977, 938, 965],
                [1042, 977, 965],
                [936, 1042, 965],
                [938, 936, 965],
                [1009, 977, 1044],
                [1125, 1009, 1044],
                [1042, 1125, 1044],
                [977, 1042, 1044],
                [981, 936, 967],
                [1032, 981, 967],
                [934, 1032, 967],
                [936, 934, 967],
                [1042, 981, 1054],
                [1123, 1042, 1054],
                [1032, 1123, 1054],
                [981, 1032, 1054],
                [1083, 1042, 1111],
                [1173, 1083, 1111],
                [1123, 1173, 1111],
                [1042, 1123, 1111],
                [1125, 1083, 1152],
                [1205, 1125, 1152],
                [1173, 1205, 1152],
                [1083, 1173, 1152],
                [1048, 1009, 1091],
                [1160, 1048, 1091],
                [1125, 1160, 1091],
                [1009, 1125, 1091],
                [1063, 1048, 1119],
                [1170, 1063, 1119],
                [1160, 1170, 1119],
                [1048, 1160, 1119],
                [1140, 1125, 1177],
                [1233, 1140, 1177],
                [1205, 1233, 1177],
                [1125, 1205, 1177],
                [1160, 1140, 1195],
                [1249, 1160, 1195],
                [1233, 1249, 1195],
                [1140, 1233, 1195],
                [1164, 1160, 1215],
                [1271, 1164, 1215],
                [1249, 1271, 1215],
                [1160, 1249, 1215],
                [1170, 1164, 1223],
                [1279, 1170, 1223],
                [1271, 1279, 1223],
                [1164, 1271, 1223],
                [1032, 934, 987],
                [1077, 1032, 987],
                [930, 1077, 987],
                [934, 930, 987],
                [1123, 1032, 1107],
                [1168, 1123, 1107],
                [1077, 1168, 1107],
                [1032, 1077, 1107],
                [1173, 1123, 1175],
                [1225, 1173, 1175],
                [1168, 1225, 1175],
                [1123, 1168, 1175],
                [1205, 1173, 1221],
                [1277, 1205, 1221],
                [1225, 1277, 1221],
                [1173, 1225, 1221],
                [1077, 930, 995],
                [1085, 1077, 995],
                [924, 1085, 995],
                [930, 924, 995],
                [1168, 1077, 1137],
                [1179, 1168, 1137],
                [1085, 1179, 1137],
                [1077, 1085, 1137],
                [1085, 924, 999],
                [1089, 1085, 999],
                [920, 1089, 999],
                [924, 920, 999],
                [1179, 1085, 1144],
                [1185, 1179, 1144],
                [1089, 1185, 1144],
                [1085, 1089, 1144],
                [1225, 1168, 1201],
                [1239, 1225, 1201],
                [1179, 1239, 1201],
                [1168, 1179, 1201],
                [1277, 1225, 1255],
                [1294, 1277, 1255],
                [1239, 1294, 1255],
                [1225, 1239, 1255],
                [1239, 1179, 1217],
                [1243, 1239, 1217],
                [1185, 1243, 1217],
                [1179, 1185, 1217],
                [1294, 1239, 1273],
                [1300, 1294, 1273],
                [1243, 1300, 1273],
                [1239, 1243, 1273],
                [1233, 1205, 1251],
                [1314, 1233, 1251],
                [1277, 1314, 1251],
                [1205, 1277, 1251],
                [1249, 1233, 1284],
                [1346, 1249, 1284],
                [1314, 1346, 1284],
                [1233, 1314, 1284],
                [1271, 1249, 1308],
                [1368, 1271, 1308],
                [1346, 1368, 1308],
                [1249, 1346, 1308],
                [1279, 1271, 1320],
                [1376, 1279, 1320],
                [1368, 1376, 1320],
                [1271, 1368, 1320],
                [1314, 1277, 1304],
                [1334, 1314, 1304],
                [1294, 1334, 1304],
                [1277, 1294, 1304],
                [1346, 1314, 1338],
                [1377, 1346, 1338],
                [1334, 1377, 1338],
                [1314, 1334, 1338],
                [1334, 1294, 1324],
                [1352, 1334, 1324],
                [1300, 1352, 1324],
                [1294, 1300, 1324],
                [1377, 1334, 1364],
                [1389, 1377, 1364],
                [1352, 1389, 1364],
                [1334, 1352, 1364],
                [1368, 1346, 1374],
                [1401, 1368, 1374],
                [1377, 1401, 1374],
                [1346, 1377, 1374],
                [1376, 1368, 1387],
                [1415, 1376, 1387],
                [1401, 1415, 1387],
                [1368, 1401, 1387],
                [1401, 1377, 1395],
                [1422, 1401, 1395],
                [1389, 1422, 1395],
                [1377, 1389, 1395],
                [1415, 1401, 1418],
                [1434, 1415, 1418],
                [1422, 1434, 1418],
                [1401, 1422, 1418]
            ];


            return {
                type: "geometry",
                coreId: coreId,
                primitive: params.wire ? "lines" : "triangles",
                positions: new Float32Array(flatten(positions, 3)),
                indices: new Uint16Array(flatten(reverse(indices))),
                normals: new Float32Array(flatten(calculateNormals(positions, indices), 3))
            };
        }

    });

    function calculateNormals(positions, indices) {
        var nvecs = new Array(positions.length);

        for (var i = 0; i < indices.length; i++) {
            var j0 = indices[i][0];
            var j1 = indices[i][1];
            var j2 = indices[i][2];

            var v1 = positions[j0];
            var v2 = positions[j1];
            var v3 = positions[j2];

            v2 = BIMSURFER.math.subVec4(v2, v1, [0, 0, 0, 0]);
            v3 = BIMSURFER.math.subVec4(v3, v1, [0, 0, 0, 0]);

            var n = BIMSURFER.math.normalizeVec4(BIMSURFER.math.cross3Vec4(v2, v3, [0, 0, 0, 0]), [0, 0, 0, 0]);

            if (!nvecs[j0]) nvecs[j0] = [];
            if (!nvecs[j1]) nvecs[j1] = [];
            if (!nvecs[j2]) nvecs[j2] = [];

            nvecs[j0].push(n);
            nvecs[j1].push(n);
            nvecs[j2].push(n);
        }

        var normals = new Array(positions.length);

        // now go through and average out everything
        for (var i = 0; i < nvecs.length; i++) {
            var count = nvecs[i].length;
            var x = 0;
            var y = 0;
            var z = 0;
            for (var j = 0; j < count; j++) {
                x += nvecs[i][j][0];
                y += nvecs[i][j][1];
                z += nvecs[i][j][2];
            }
            normals[i] = [-(x / count), -(y / count), -(z / count)];
        }
        return normals;
    }

    function flatten(ar, numPerElement) {
        var result = [];
        for (var i = 0; i < ar.length; i++) {
            if (numPerElement && ar[i].length != numPerElement)
                throw SceneJS_error.fatalError("Bad geometry array element");
            for (var j = 0; j < ar[i].length; j++)
                result.push(ar[i][j]);
        }
        return result;
    }

    function reverse(ar) {
        var result = [];
        for (var i = 0; i < ar.length; i++) {
            var temp = [];
            for (var j = ar[i].length - 1; j >= 0; j--) {
                temp.push(ar[i][j]);
            }
            result.push(temp);
        }
        return result;
    }

})();;/**
 * Rendering effects components.
 *
 * @module BIMSURFER
 * @submodule effects
 */;/**
 An **Effect** is a the base class for visual effects that are applied to {{#crossLink "ObjectSet"}}ObjectSets{{/crossLink}}.

 ## Overview

 <ul>
 <li>Effect is subclassed by {{#crossLink "HighlightEffect"}}{{/crossLink}}, {{#crossLink "IsolateEffect"}}{{/crossLink}} and {{#crossLink "XRayEffect"}}{{/crossLink}}.</li>
 <li>Multiple Effects can share the same {{#crossLink "ObjectSet"}}{{/crossLink}} if required.</li>
 <li>An Effect will provide its own default {{#crossLink "ObjectSet"}}{{/crossLink}} when you don't configure it with one.</li>
 </ul>

 @class Effect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Effect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this Effect to.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Effect = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Effect",

        _init: function (cfg) {

            /**
             * The {{#crossLink "ObjectSet"}}{{/crossLink}} that this Effect applies to.
             *
             * @property objectSet
             * @type ObjectSet
             */
            this.objectSet = cfg.objectSet || new BIMSURFER.ObjectSet(this.viewer);

            this._dirty = true;

            var self = this;

            this._onObjectSetUpdated = this.objectSet.on("updated",
                function () {
                    self._dirty = true;
                });

            this.invert = cfg.invert;

            this.active = cfg.active !== false;
        },

        _props: {

            /**
             * Flag which indicates whether this Effect is active or not.
             *
             * Fires an {{#crossLink "Effect/active:event"}}{{/crossLink}} event on change.
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

                        var self = this;


                        this._tickSub = this.viewer.on("tick",
                            function () {

                                if (self._dirty) {

                                    if (self._apply) {
                                        self._apply();
                                    }

                                    if (self._applyObject) {

                                        // Apply effect to Objects in the Viewer
                                        self.viewer.withClasses(["BIMSURFER.Object"],
                                            function (object) {
                                                self._applyObject.call(self, object);
                                            });

                                        self.viewer.withClasses(["BIMSURFER.BoxObject"],
                                            function (object) {
                                                self._applyObject.call(self, object);
                                            });

                                    }

                                    self._dirty = false;
                                }
                            });

                    } else {

                        this.viewer.off(this._tickSub);
                    }

                    /**
                     * Fired whenever this Effect's {{#crossLink "Effect/active:property"}}{{/crossLink}} property changes.
                     * @event active
                     * @param value The property's new value
                     */
                    this.fire('active', this._active = value);

                    this._dirty = true;
                },

                get: function () {
                    return this._active;
                }
            },

            /**
             * Flag which inverts the {{#crossLink "Object"}}Objects{{/crossLink}} that this Effect applies to.
             *
             * <ul>
             *     <li>When true, this Effect applies to {{#crossLink "Object"}}Objects{{/crossLink}} that are in
             *     the {{#crossLink "Component/viewer:property"}}{{/crossLink}} but **not** in the {{#crossLink "Effect/objectSet:property"}}{{/crossLink}}.</li>
             *
             *     <li>When false, this Effect applies to {{#crossLink "Object"}}Objects{{/crossLink}} that are in
             *     the {{#crossLink "Component/viewer:property"}}{{/crossLink}} and **also** in the {{#crossLink "Effect/objectSet:property"}}{{/crossLink}}.</li>
             * </ul>
             *
             * Fires an {{#crossLink "Effect/invert:event"}}{{/crossLink}} event on change.
             *
             * @property invert
             * @type Boolean
             */
            invert: {

                set: function (value) {

                    value = !!value;

                    if (this._invert === value) {
                        return;
                    }

                    this._dirty = false;

                    /**
                     * Fired whenever this Effect's {{#crossLink "Effect/invert:property"}}{{/crossLink}} property changes.
                     * @event invert
                     * @param value The property's new value
                     */
                    this.fire('invert', this._invert = value);
                },

                get: function () {
                    return this._invert;
                }
            }
        },

        _destroy: function () {

            this.objectSet.off(this._onObjectSetUpdated);

            this.active = false;
        }

    });

})();;/**
 A **LabelEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that labels on the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Labelling an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
 <br> Then we apply a {{#crossLink "LabelEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to become labeled, while the other
 two {{#crossLink "Object"}}Objects{{/crossLink}} remain without labels.

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_LabelEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [30, 20, -30]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply a Labels effect to the ObjectSet, which causes the
 // Object in the ObjectSet to become labelsed.

 var labels = new BIMSURFER.LabelEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the Labels to now render
 // that Object as labelsed also

 objectSet.addObjects([object3]);

 ````

 @class LabelEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this LabelEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this LabelEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    var labelPool = [];
    var lenLabelPool = 0;

    function getLabel() {
        return lenLabelPool > 0 ? labelPool[--lenLabelPool] : new Label();
    }

    function putLabel(label) {
        labelPool.push(label);
    }

    BIMSURFER.LabelEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.LabelEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.label = this.invert ? !selected : !!selected;
        }
    });


})();;/**
 A **HighlightEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that highlights the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Highlighting an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
<br> Then we apply a {{#crossLink "HighlightEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to become highlighted while the other two {{#crossLink "Object"}}Objects{{/crossLink}} remain un-highlighted.

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_HighlightEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [30, 20, -30]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply a Highlight effect to the ObjectSet, which causes the
 // Object in the ObjectSet to become highlighted.

 var highlight = new BIMSURFER.HighlightEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the Highlight to now render
 // that Object as highlighted also

 objectSet.addObjects([object3]);

 ````

 @class HighlightEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this HighlightEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this HighlightEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    BIMSURFER.HighlightEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.HighlightEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.highlight = this.invert ? !selected : !!selected;
        }
    });

})();;/**
 A **DesaturateEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that desaturates the colours of
 {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Desaturating an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
<br> Then we apply a {{#crossLink "DesaturateEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing the colour of
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to become desaturated while the other two {{#crossLink "Object"}}Objects{{/crossLink}} remain normal.

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_DesaturateEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [30, 20, -30]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply a Desaturate effect to the ObjectSet, which causes the
 // Object in the ObjectSet to become desaturated.

 var desaturate = new BIMSURFER.DesaturateEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the Desaturate to now render
 // that Object as desaturated also

 objectSet.addObjects([object3]);

 ````

 @class DesaturateEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DesaturateEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this DesaturateEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    BIMSURFER.DesaturateEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.DesaturateEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.desaturate = this.invert ? !selected : !!selected;
        }
    });

})();;/**
 A **IsolateEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that exclusively shows the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### Isolating an ObjectSet

 Isolate objects that match given IDs, using an {{#crossLink "ObjectSet"}}{{/crossLink}} and an IsolateEffect

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_IsolateEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
    eye: [0, 0, -10]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create some BoxObjects

 new BIMSURFER.BoxObject(viewer, {
    id: "foo",
    type: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, -4])
 });

 new BIMSURFER.BoxObject(viewer, {
    id: "bar",
    type: "IfcWall",
    matrix: BIMSURFER.math.translationMat4v([4, 0, -4])
 });

 new BIMSURFER.BoxObject(viewer, {
    id: "baz",
    type: "IfcBeam",
    matrix: BIMSURFER.math.translationMat4v([-4, 0, 4])
 });

 // Create an ObjectSet
 var objectSet = new BIMSURFER.ObjectSet(viewer);

 // Apply an Isolate effect to the ObjectSet
 var isolateEffect = new BIMSURFER.IsolateEffect(viewer, {
    objectSet: objectSet
 });

 // Add Objects to the ObjectSet by ID
 // These Objects become visible
 objectSet.addObjectIds(["foo", "bar", "baz"]);

 // Remove an Object from the ObjectSet by ID
 // That Object becomes invisible again
 objectSet.removeObjectIds(["baz"]);

 ````

 @class IsolateEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this IsolateEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this IsolateEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    BIMSURFER.IsolateEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.IsolateEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.active = this.invert ? !selected : !!selected;
        }
    });

})();;/**
 An **XRayEffect** is an {{#crossLink "Effect"}}{{/crossLink}} that creates an X-ray view of the {{#crossLink "Object"}}Objects{{/crossLink}} within an {{#crossLink "ObjectSet"}}{{/crossLink}}.

 ## Overview

 TODO

 ## Example

 #### XRaying an ObjectSet

 In this example we create four {{#crossLink "Object"}}Objects{{/crossLink}}, then add two of them to an {{#crossLink "ObjectSet"}}{{/crossLink}}.
 <br>Then we apply an {{#crossLink "XRayEffect"}}{{/crossLink}} to the {{#crossLink "ObjectSet"}}{{/crossLink}}, causing
 it's {{#crossLink "Object"}}Objects{{/crossLink}} to remain opaque while the other two {{#crossLink "Object"}}Objects{{/crossLink}} become transparent.

 <iframe style="width: 600px; height: 400px" src="../../examples/effect_XRayEffect.html"></iframe>

 ````javascript

 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [20, 10, -20]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them

 var object1 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create an ObjectSet that initially contains one of our Objects

 var objectSet = new BIMSURFER.ObjectSet(viewer, {
        objects: [object1 ]
    });

 // Apply an XRay effect to the ObjectSet, which causes all Objects in the Viewer
 // that are not in the ObjectSet to become transparent.

 var xray = new BIMSURFER.XRayEffect(viewer, {
        objectSet: objectSet
    });

 // Add a second Object to the ObjectSet, causing the XRay to now render
 // that Object as opaque also

 objectSet.addObjects([object3]);

 // Adjust the opacity of the transparent Objects

 object2.opacity = 0.2;
 object4.opacity = 0.2;
 ````

 @class XRayEffect
 @module BIMSURFER
 @submodule effect
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this XRayEffect.
 @param [cfg.objectSet] {ObjectSet} The {{#crossLink "ObjectSet"}}{{/crossLink}} to apply this XRayEffect to.
 @extends Effect
 */
(function () {

    "use strict";

    BIMSURFER.XRayEffect = BIMSURFER.Effect.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.XRayEffect",

        _init: function (cfg) {
            this._super(cfg);
        },

        _applyObject: function (object) {
            var selected = this.objectSet.objects[object.id];
            object.xray = this.invert ? !!selected : !selected;
        }
    });

})();;/**
 * Components for displaying labels on objects.
 *
 * @module BIMSURFER
 * @submodule labelling
 */;/**
 A **Position** is a spatial location within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 A Position provides its coordinates in each of BIMSurfer's five coordinate systems:

 <ul>
 <li>{{#crossLink "Position/pos:property"}}{{/crossLink}} - 3D coordinates within the Position's local Model coordinate system.</li>
 <li>{{#crossLink "Position/worldPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current World coordinate
 system, after transformation by the {{#crossLink "Position/matrix:property"}}Position's modelling matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/viewPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current View
 coordinate system, after transformation by the {{#crossLink "Viewer/viewMatrix:property"}}Viewer's view matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/projPos:property"}}{{/crossLink}} - 3D coordinates within the Viewer's current Projection
 coordinate system, after transformation by the {{#crossLink "Viewer/projMatrix:property"}}Viewer's projection matrix{{/crossLink}}.</li>
 <li>{{#crossLink "Position/canvasPos:property"}}{{/crossLink}} - 2D coordinates within the Viewer's current Canvas
 coordinate system.</li>
 </ul>

 ## Example

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
     eye: [20, 20, -20]
 });

 // Create a CameraControl to interact with the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
    camera: camera
 });

 // Create a Position
 new BIMSURFER.Position(viewer, {
    pos: [0,0,0],
    matrix: BIMSURFER.math.translationMat4v([4, 0,0])
 });

 ````

 @class Position
 @module BIMSURFER
 @module labelling
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Position.
 @param [cfg.pos] {Array of Number} Position's 3D location.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional, sixteen element array of elements, an identity matrix by default.
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.Position = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Position",

        _init: function (cfg) {

            this._viewMatrix = this.viewer.viewMatrix;
            this._projMatrix = this.viewer.projMatrix;

            this._pos = [0, 0, 0];
            this._worldPos = [0, 0, 0];
            this._viewPos = [0, 0, 0];
            this._projPos = [0, 0, 0];
            this._canvasPos = [0, 0, 0];

            this._updatedirty = true;
            this._worldPosDirty = true;
            this._viewPosDirty = true;
            this._projPosDirty = true;
            this._canvasPosDirty = true;

            var self = this;

            this._onViewMatrix = this.viewer.on("viewMatrix",
                function (matrix) {

                    self._viewMatrix = matrix;

                    self._updatedirty = true;
                    self._viewPosDirty = true;
                    self._projPosDirty = true;
                    self._canvasPosDirty = true;
                });

            this._onProjMatrix = this.viewer.on("projMatrix",
                function (matrix) {

                    self._projMatrix = matrix;

                    self._updatedirty = true;
                    self._projPosDirty = true;
                    self._canvasPosDirty = true;
                });

            this._onTick = this.viewer.on("tick",
                function () {
                    if (self._updatedirty) {
                        self.fire("updated");
                        self._updatedirty = false;
                    }
                });

            this.pos = cfg.pos;

            this.matrix = cfg.matrix;
        },

        _props: {

            /**
             * The Position's 3D coordinates within its local Model coordinate system, ie. before transformation by
             * the Position's {{#crossLink "Position/matrix:property"}}matrix{{/crossLink}}.
             *
             * @property pos
             * @default [0,0,0]
             * @type {Array of Number}
             */
            pos: {

                set: function (value) {

                    value = value || [0, 0, 0];

                    if (value[0] !== this._pos[0] ||
                        value[1] !== this._pos[1] ||
                        value[2] !== this._pos[2]) {

                        this._pos[0] = value[0];
                        this._pos[1] = value[1];
                        this._pos[2] = value[2];

                        this._updatedirty = true;
                        this._worldPosDirty = true;
                        this._viewPosDirty = true;
                        this._projPosDirty = true;
                        this._canvasPosDirty = true;
                    }
                },

                get: function () {
                    return this._pos;
                }
            },

            /**
             * This Positions's 4x4 modelling transformation matrix.
             *
             * @property matrix
             * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
             * @type {Array of Number}
             */
            matrix: {

                set: function (value) {

                    value = value || [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

                    this._updatedirty = true;
                    this._worldPosDirty = true;
                    this._viewPosDirty = true;
                    this._projPosDirty = true;
                    this._canvasPosDirty = true;

                    this._matrix = value;
                },

                get: function () {
                    return this._matrix;
                }
            },

            /**
             * This Position's 3D coordinates within the World coordinate system, ie. after transformation by
             * the Position's {{#crossLink "Position/matrix:property"}}matrix{{/crossLink}} and before
             * transformation by Viewer's {{#crossLink "Viewer/viewMatrix:property"}}viewing matrix{{/crossLink}}.
             *
             * @property worldPos
             * @final
             * @default [0,0,0]
             * @type {Array of Number}
             */
            worldPos: {

                get: function () {

                    if (this._worldPosDirty) {

                        if (this._matrix) {

                            BIMSURFER.math.transformPoint3(this._matrix, this._pos, this._worldPos);

                        } else {

                            this._worldPos[0] = this._pos[0];
                            this._worldPos[1] = this._pos[1];
                            this._worldPos[2] = this._pos[2];
                        }

                        this._worldPosDirty = false;
                    }

                    return this._worldPos;
                }
            },

            /**
             * This Position's 3D coordinates within the View coordinate system, ie. after transformation by
             * the Viewer's {{#crossLink "Viewer/viewMatrix:property"}}view matrix{{/crossLink}} and before
             * transformation by the Viewer's {{#crossLink "Viewer/projMatrix:property"}}projection matrix{{/crossLink}}.
             *
             * @property viewPos
             * @final
             * @type {Array of Number}
             */
            viewPos: {

                get: function () {

                    if (this._viewPosDirty) {

                        BIMSURFER.math.transformPoint3(this._viewMatrix, this.worldPos, this._viewPos);

                        this._viewPos[3] = 1; // Need homogeneous 'w' for perspective division

                        this._viewPosDirty = false;
                    }

                    return this._viewPos;
                }
            },

            /**
             * This Position's 3D homogeneous coordinates within the Projection coordinate system, ie. after transformation by
             * the Viewer's {{#crossLink "Viewer/projMatrix:property"}}projection matrix{{/crossLink}}.
             *
             * @property projPos
             * @final
             * @type {Array of Number}
             */
            projPos: {

                get: function () {

                    if (this._projPosDirty) {

                        BIMSURFER.math.transformPoint3(this._projMatrix, this.viewPos, this._projPos);

                        this._projPosDirty = false;
                    }

                    return this._projPos;
                }
            },

            /**
             * This Position's 2D coordinates within the Canvas coordinate system.
             *
             * @property canvasPos
             * @final
             * @type {Array of Number}
             */
            canvasPos: {

                get: function () {

                    if (this._canvasPosDirty) {

                        var projPos = this.projPos;

                        var x = projPos[0];
                        var y = projPos[1];
                        var w = projPos[3];

                        var canvas = this.viewer.canvas.canvas;

                        this._canvasPos[0] = Math.round((1 + x / w) * canvas.width / 2);
                        this._canvasPos[1] = Math.round((1 - y / w) * canvas.height / 2);

                        this._canvasPosDirty = false;
                    }

                    return this._canvasPos;
                }
            }
        },

        _destroy: function () {

            this.viewer.off(this._onViewMatrix);

            this.viewer.off(this._onProjMatrix);

            this.viewer.off(this._onTick);
        }
    });
})();;/**
 A **Label** is a user-defined HTML element that floats over a 3D position within a {{#crossLink "Viewer"}}{{/crossLink}}.

 ## Overview

 <ul>
 <li>When configured with an {{#crossLink "Object"}}{{/crossLink}}, a Label will always track
 its {{#crossLink "Object"}}Object's{{/crossLink}} position, offset by the vector indicated
 in {{#crossLink "Label/pos:property"}}{{/crossLink}}.</li>

 <li>For debugging purposes, an {{#crossLink "Object"}}{{/crossLink}} has its own built-in Label, 
 which can be shown by setting the {{#crossLink "Object"}}Object's{{/crossLink}} 
 {{#crossLink "Object/label:property"}}{{/crossLink}} property true.</li>
 </ul>



 ## Example

 <iframe style="width: 800px; height: 600px" src="../../examples/label_Label.html"></iframe>

 ````Javascript
 // Create a Viewer
 var viewer = new BIMSURFER.Viewer({ element: "myDiv" });

 // Create a Camera
 var camera = new BIMSURFER.Camera(viewer, {
        eye: [20, 15, -20],
        look: [0,-10,0]
    });

 // Spin the camera
 viewer.on("tick", function () {
        camera.rotateEyeY(0.2);
    });

 // Create a CameraControl so we can move the Camera
 var cameraControl = new BIMSURFER.CameraControl(viewer, {
        camera: camera
    });

 // Create an AmbientLight
 var ambientLight = new BIMSURFER.AmbientLight(viewer, {
        color: [0.7, 0.7, 0.7]
    });

 // Create a DirLight
 var dirLight1 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [1.0, 0.0, 0.0],
        space: "view"
    });

 // Create a DirLight
 var dirLight2 = new BIMSURFER.DirLight(viewer, {
        color: [0.6, 0.9, 0.9],
        dir: [-0.5, 0.0, -1.0],
        space: "view"
    });

 // Create a BoxGeometry
 var geometry = new BIMSURFER.BoxGeometry(viewer, {
        id: "myGeometry"
    });

 // Create some Objects
 // Share the BoxGeometry among them
 // Activate their debug Labels

 var object1 = new BIMSURFER.Object(viewer, {
        id: "object1",
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, -8])
    });

 var object2 = new BIMSURFER.Object(viewer, {
        id: "object2",
        type: "IfcDistributionFlowElement",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, -8])
    });

 var object3 = new BIMSURFER.Object(viewer, {
        id: "object3",
        type: "IfcRailing",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([-8, 0, 8])
    });

 var object4 = new BIMSURFER.Object(viewer, {
        id: "object4",
        type: "IfcRoof",
        geometries: [ geometry ],
        matrix: BIMSURFER.math.translationMat4v([8, 0, 8])
    });

 // Create some Labels on two of the Objects
 // Each Label displays a snippet of HTML and is positioned relative to its Object's origin

 var label1 = new BIMSURFER.Label(viewer, {
        object: object1,
        text: "<b>Label on Object 'object1'</b><br><br><iframe width='320' height='200' " +
            "src='https://www.youtube.com/embed/oTONvRtlW44' frameborder='0' allowfullscreen></iframe>",
        pos: [0, 2, 0] // Offset from Object's local Model-space origin
    });

 var label2 = new BIMSURFER.Label(viewer, {
        object: object4,
        text: "<b>First Label on Object 'object2'</b><br>",
        pos: [0, 0, 0] // Offset from Object's local Model-space origin
    });

 var label3 = new BIMSURFER.Label(viewer, {
        object: object4,
        text: "<b>Second label on Object 'object2'</b><br>",
        pos: [0, -2, 0] // Offset from Object's local Model-space origin
    });
 ````

 @class Label
 @module BIMSURFER
 @submodule labelling
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}{{/crossLink}}.
 @param [cfg] {*} Configs
 @param [cfg.id] {String} Optional ID, unique among all components in the parent viewer, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this Label.
 @param [cfg.object] {Object} The {{#crossLink "Object"}}{{/crossLink}} to attach this Label to.
 @param [cfg.text] {String} Text to insert into this Label.
 @param [cfg.pos] {Array of Number} Label's 3D offset from the {{#crossLink "Object"}}Object's{{/crossLink}} origin.
 @param [cfg.matrix=[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]] {Array of Number} Transform matrix - a one-dimensional,
 sixteen element array of elements, an identity matrix by default.
 @extends Position
 */
(function () {

    "use strict";

    BIMSURFER.Label = BIMSURFER.Position.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.Label",

        _init: function (cfg) {

            this._super(cfg);

            /**
             * This Label's {{#crossLink "Object"}}{{/crossLink}}.
             *
             * Can be undefined.
             *
             * @property object
             * @type BIMSURFER.Object
             * @final
             */
            this.object = cfg.object;

            $(this.viewer.element).append("<div id ='" + this.id + "' style='position:  absolute; line-height=140%; " +
                "padding:5px; display: none;  border: 1px black solid; top:0px; left: 100px; z-index: 1000; " +
                "background: lightgray; width:auto; height: auto;'>XXXX</div>");

            this.element = $("#" + this.id + "");

            var self = this;

            if (this.object) {
                this._onObjectMatrix = this.object.on("matrix",
                    function (matrix) {

                        self.matrix = matrix;

                    });

                this._onObjectDestroy = this.object.on("destroyed",
                    function () {

                        self.object.off(self._onObjectMatrix);

                        self.object = null;
                    });
            }

            this.text = cfg.text || "";            

            var activate = cfg.active !== false;

            if (!activate) {
                this.active = false;
            }

            this.on("updated",
                function () {

                    var viewPos = self.viewPos;
                    var canvasPos = self.canvasPos;

                    self.element.css({
                        left: canvasPos[0],
                        top: canvasPos[1],
                        zIndex: 100000 + Math.round(viewPos[2])
                    });

                    if (activate) {
                        this.active = true;
                        activate = false;
                    }
                });
        },

        _props: {

            /**
             * Text within this Label.
             *
             * Fires an {{#crossLink "Label/text:event"}}{{/crossLink}} event on change.
             *
             * @property text
             * @type String
             */
            text: {

                set: function (value) {

                    if (this._text === value) {
                        return;
                    }

                    this.element.html(value);

                    /**
                     * Fired whenever this Label's {{#crossLink "Label/text:property"}}{{/crossLink}} property changes.
                     * @event text
                     * @param value The property's new value
                     */
                    this.fire('text', this._text = value);
                },

                get: function () {
                    return this._text;
                }
            },
            
            /**
             * Flag which indicates whether this Label is active or not.
             *
             * Fires an {{#crossLink "Label/active:event"}}{{/crossLink}} event on change.
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
                        this.element.show();

                    } else {
                        this.element.hide();
                    }

                    /**
                     * Fired whenever this Label's {{#crossLink "Label/active:property"}}{{/crossLink}} property changes.
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

            if (this.object) {

                this.object.off(this._onObjectMatrix);

                this.object.off(this._onObjectDestroy);
            }

            this.element.remove();
        }
    });
})();;/**
 * Animation components.
 *
 * @module BIMSURFER
 * @submodule animation
 */;/**

 **Fly** flys a {{#crossLink "Camera"}}{{/crossLink}}

 ## Overview

 ## Example

 TODO

 ````javascript
 TODO
 ````
 @class CameraFlyAnimation
 @module BIMSURFER
 @submodule animation
 @constructor
 @param [viewer] {Viewer} Parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}.
 @param [cfg] {*} Fly configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Viewer"}}Viewer{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this CameraFlyAnimation.
 @param [cfg.camera] {Camera} Camera to control
 @extends Component
 */
(function () {

    "use strict";

    BIMSURFER.CameraFlyAnimation = BIMSURFER.Component.extend({

        /**
         JavaScript class name for this Component.

         @property className
         @type String
         @final
         */
        className: "BIMSURFER.CameraFlyAnimation",

        _init: function (cfg) {

            this._look1 = [0, 0, 0];
            this._eye1 = [0, 0, 0];
            this._up1 = [0, 0, 0];

            this._look2 = [0, 0, 0];
            this._eye2 = [0, 0, 0];
            this._up2 = [0, 0, 0];

            this._vec = [0, 0, 0];

            this._dist = 0;

            this._flying = false;

            this._ok = null;

            this._onTick = null;

            this._camera = cfg.camera;

            this._tempVec = BIMSURFER.math.vec3();

            this._eyeVec = BIMSURFER.math.vec3();
            this._lookVec = BIMSURFER.math.vec3();

            this._stopFOV = 55;

            this._time1 = null;
            this._time2 = null;

            this.easing = cfg.easing !== false;

            this.duration = cfg.duration || 0.5;

            this.camera = cfg.camera;
        },

        /**
         * Begins flying this CameraFlyAnimation's {{#crossLink "Camera"}}{{/crossLink}} to the given target.
         *
         * <ul>
         *     <li>When the target is a boundary, the {{#crossLink "Camera"}}{{/crossLink}} will fly towards the target
         *     and stop when the target fills most of the canvas.</li>
         *     <li>When the target is an explicit {{#crossLink "Camera"}}{{/crossLink}} position, given as ````eye````, ````look```` and ````up````
         *      vectors, then this CameraFlyAnimation will interpolate the {{#crossLink "Camera"}}{{/crossLink}} to that target and stop there.</li>
         * @method flyTo
         * @param params  {*} Flight parameters
         * @param[params.arc=0]  {Number} Factor in range [0..1] indicating how much the
         * {{#crossLink "Camera/eye:property"}}Camera's eye{{/crossLink}} position will
         * swing away from its {{#crossLink "Camera/eye:property"}}look{{/crossLink}} position as it flies to the target.
         * @param [params.boundary] {{xmin:Number, ymin:Number, zmin: Number, xmax: Number, ymax: Number, zmax: Number }}  Boundary target to fly to.
         * @param [params.eye] {Array of Number} Position to fly the {{#crossLink "Camera/eye:property"}}Camera's eye{{/crossLink}} position to.
         * @param [params.look] {Array of Number} Position to fly the {{#crossLink "Camera/look:property"}}Camera's look{{/crossLink}} position to.
         * @param [params.up] {Array of Number} Position to fly the {{#crossLink "Camera/up:property"}}Camera's up{{/crossLink}} vector to.
         * @param [ok] {Function} Callback fired on arrival
         */
        flyTo: function (params, ok) {

            if (this._flying) {
                this.stop();
            }

            this._ok = ok;

            this._arc = params.arc === undefined ? 0.0 : params.arc;

            var camera = this.camera;

            // Set up initial camera state

            this._look1 = camera.look;
            this._look1 = [this._look1[0], this._look1[1], this._look1[2]];

            this._eye1 = camera.eye;
            this._eye1 = [this._eye1[0], this._eye1[1], this._eye1[2]];

            this._up1 = camera.up;
            this._up1 = [this._up1[0], this._up1[1], this._up1[2]];

            // Get normalized eye->look vector

            this._vec = BIMSURFER.math.normalizeVec3(BIMSURFER.math.subVec3(this._eye1, this._look1, []));

            // Back-off factor in range of [0..1], when 0 is close, 1 is far

            var backOff = params.backOff || 0.5;

            if (backOff < 0) {
                backOff = 0;

            } else if (backOff > 1) {
                backOff = 1;
            }

            backOff = 1 - backOff;

            // Set up final camera state

            if (params.boundary) {

                // Zooming to look and eye computed from boundary

                var boundary = params.boundary;

                if (boundary.xmax <= boundary.xmin || boundary.ymax <= boundary.ymin || boundary.zmax <= boundary.zmin) {
                    return;
                }

                var dist = params.dist || 2.5;
                var lenVec = Math.abs(BIMSURFER.math.lenVec3(this._vec));
                var diag = BIMSURFER.math.getBoundaryDiag(boundary);
                var len = Math.abs((diag / (1.0 + (backOff * 0.8))) / Math.tan(this._stopFOV / 2));  /// Tweak this to set final camera distance on arrival
                var sca = (len / lenVec) * dist;

                this._look2 = BIMSURFER.math.getBoundaryCenter(boundary);
                this._look2 = [this._look2[0], this._look2[1], this._look2[2]];

                if (params.offset) {

                    this._look2[0] += params.offset[0];
                    this._look2[1] += params.offset[1];
                    this._look2[2] += params.offset[2];
                }

                this._eye2 = BIMSURFER.math.addVec3(this._look2, BIMSURFER.math.mulVec3Scalar(this._vec, sca, []));
                this._up2 = BIMSURFER.math.vec3();
                this._up2[1] = 1;

            } else {

                // Zooming to specific look and eye points

                var lookat = params;

                var look = lookat.look || camera.look;
                var eye = lookat.eye || camera.eye;
                var up = lookat.up || camera.up;

                var cameraEye = camera.eye;
                var cameraLook = camera.look;
                var cameraUp = camera.up;

                if (look) {

                    this._look2[0] = look[0];
                    this._look2[1] = look[1];
                    this._look2[2] = look[2];

                } else {

                    this._look2[0] = cameraLook[0];
                    this._look2[1] = cameraLook[1];
                    this._look2[2] = cameraLook[2];
                }

                if (eye) {

                    this._eye2[0] = eye[0];
                    this._eye2[1] = eye[1];
                    this._eye2[2] = eye[2];

                } else {

                    this._eye2[0] = cameraEye[0];
                    this._eye2[1] = cameraEye[1];
                    this._eye2[2] = cameraEye[2];
                }

                if (up) {

                    this._up2[0] = up[0];
                    this._up2[1] = up[1];
                    this._up2[2] = up[2];

                } else {

                    this._up2[0] = cameraUp[0];
                    this._up2[1] = cameraUp[1];
                    this._up2[2] = cameraUp[2];
                }
            }

            this.fire("started", params, true);

            var self = this;

            this._time1 = (new Date()).getTime();
            this._time2 = this._time1 + this._duration;

            this._tick = this.viewer.on("tick",
                function (params) {
                    self._update(params.time * 1000.0);
                });

            this._flying = true;
        },

        _update: function (time) {

            if (!this._flying) {
                return;
            }

            time = (new Date()).getTime();

            var t = (time - this._time1) / (this._time2 - this._time1);

            if (t > 1) {
                this.stop();
                return;
            }

            t = this.easing ? this._ease(t, 0, 1, 1) : t;

            this._camera.eye = BIMSURFER.math.lerpVec3(t, 0, 1, this._eye1, this._eye2, []);
            this._camera.look = BIMSURFER.math.lerpVec3(t, 0, 1, this._look1, this._look2, []);
            this._camera.up = BIMSURFER.math.lerpVec3(t, 0, 1, this._up1, this._up2, []);
        },

        // Quadratic easing out - decelerating to zero velocity
        // http://gizma.com/easing

        _ease: function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        },

        stop: function () {

            if (!this._flying) {
                return;
            }

            this.viewer.off(this._tick);

            this._flying = false;

            this._time1 = null;
            this._time2 = null;

            this.fire("stopped", true, true);

            var ok = this._ok;

            if (ok) {
                this._ok = false;
                ok();
            }
        },

        _props: {

            camera: {

                set: function (value) {
                    this._camera = value;
                    this.stop();
                },

                get: function () {
                    return this._camera;
                }
            },

            duration: {

                set: function (value) {
                    this._duration = value * 1000.0;
                    this.stop();
                },

                get: function () {
                    return this._duration * 0.001;
                }
            }
        },

        _destroy: function () {
            this.stop();
        }
    });

})();
;/**
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
;/**
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
            element = document.getElementById(element);
        }

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

        var canvasId = "canvas-" + BIMSURFER.math.createUUID();
        var body = document.getElementsByTagName("body")[0];
        var div = document.createElement('div');

        var style = div.style;
        style.height = "100%";
        style.width = "100%";
        style.padding = "0";
        style.margin = "0";
        style.background = "black";
        style.float = "left";
        //style.left = "0";
        //style.top = "0";
        // style.position = "absolute";
        // style["z-index"] = "10000";

        div.innerHTML += '<canvas id="' + canvasId + '" style="width: 100%; height: 100%; float: left; margin: 0; padding: 0;"></canvas>';

        element.appendChild(div);

        /**
         * The HTML Canvas that this Viewer renders to. This is inserted into the element we configured this Viewer with.
         * @property canvas
         * @final
         * @type {HTMLCanvasElement}
         * @final
         */
        this._canvas = document.getElementById(canvasId);

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

                                        // Origin translation
                                        {
                                            type: "translate",
                                            id: "theOrigin",

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

        this._originNode = this.scene.getNode('theOrigin');

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
         * Map of components that have an 'exclusive' property. This is used to ensure that
         * only one of these component types is active within this Viewer at a time.
         */
        this._onComponentActive = {};

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


        // Add components here

        /**
         * Canvas manager for this Viewer.
         * @property canvas
         * @final
         * @type {BIMSURFER.Canvas}
         */
        this.canvas = new BIMSURFER.Canvas(this);

        /**
         * Input handling for this Viewer.
         * @property input
         * @final
         * @type {BIMSURFER.Input}
         */
        this.input = new BIMSURFER.Input(this);

        /**
         * Cursor icon control for this Viewer.
         * @property cursor
         * @final
         * @type {BIMSURFER.Cursor}
         */
        this.cursor = new BIMSURFER.Cursor(this);

        /**
         * The default {{#crossLink "Camera"}}{{/crossLink}} for this Viewer.
         *
         * This {{#crossLink "Camera"}}{{/crossLink}} is active by default, and becomes inactive
         * as soon as you activate some other {{#crossLink "Camera"}}{{/crossLink}} in this Viewer.
         *
         * Any components that you create for this Viewer, that require a {{#crossLink "Camera"}}{{/crossLink}},
         * will fall back on this one by default.
         *
         * @property camera
         * @final
         * @type {BIMSURFER.Camera}
         */
        this.camera = new BIMSURFER.Camera(this);

        /**
         * The number of {{#crossLink "Objects"}}{{/crossLink}} within this ObjectSet.
         *
         * @property numObjects
         * @type Number
         */
        this.numObjects = 0;

        this._boundary = {xmin: 0.0, ymin: 0.0, zmin: 0.0, xmax: 0.0, ymax: 0.0, zmax: 0.0};
        this._center = [0, 0, 0];

        this._boundaryDirty = true;

        this.origin = cfg.origin;
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

        var self = this;

        // When the component has an 'exclusive' property set true, then only one instance of that component
        // type may be active within the Viewer at a time. When a component is activated, that has a true value
        // for this flag, then any other active component of the same type will be deactivated first.

        if (component.exclusive === true) {

            if (component.active) {
                self.deactivateOthers(component);
            }

            this._onComponentActive[component.id] = component.on("active",
                function (active) {

                    if (active) {
                        self._deactivateOthers(component);
                    }
                });
        }

        this._boundaryDirty = true;

        /**
         * Fired whenever a Component has been created within this Viewer.
         * @event componentCreated
         * @param {Component} value The component that was created
         */
        this.fire("componentCreated", component, true);
    };

    // Deactivates all other components within this Viewer, that have same className as that given.
    BIMSURFER.Viewer.prototype._deactivateOthers = function (component) {
        this.withClasses([component.className],
            function (otherComponent) {
                if (otherComponent.id !== component.id) {
                    otherComponent.active = false;
                }
            });
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

        this._boundaryDirty = true;

        this._componentIDMap.removeItem(id);

        if (component.exclusive === true) {
            component.off(this._onComponentActive[component.id]);
            delete this._onComponentActive[component.id];
        }

        /**
         * Fired whenever a component within this Viewer has been destroyed.
         * @event componentDestroyed
         * @param {Component} value The component that was destroyed
         */
        this.fire("componentDestroyed", component, true);
    };

    /**
     * World-space origin.
     *
     * @property origin
     * @final
     * @type {*}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "origin", {

        get: function () {
            return this._origin;
        },

        set: function (origin) {
            this._origin = origin || [0, 0, 0];
            this._originNode.setXYZ(this._origin);
            this._boundaryDirty = true;
        },

        enumerable: true
    });

    /**
     * This Viewer's view transformation matrix.
     *
     * @property viewMatrix
     * @final
     * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     * @type {Array of Number}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "viewMatrix", {

        get: function () {
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

        get: function () {
            return this._cameraNode.getMatrix();
        },

        enumerable: true
    });

    /**
     * Boundary of all bounded components in this Viewer.
     *
     * @property boundary
     * @final
     * @type {*}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "boundary", {

        get: function () {

            if (this._boundaryDirty) {
                this._rebuildBoundary();
            }

            return this._boundary;
        },

        enumerable: true
    });

    /**
     * Center of all bounded components in this Viewer.
     *
     * @property center
     * @final
     * @type {*}
     */
    Object.defineProperty(BIMSURFER.Viewer.prototype, "center", {

        get: function () {

            if (this._boundaryDirty) {
                this._rebuildBoundary();
            }

            return this._center;
        },

        enumerable: true
    });


    BIMSURFER.Viewer.prototype._rebuildBoundary = function () {

        if (!this._boundaryDirty) {
            return;
        }

        // For an empty selection, boundary is zero volume and centered at the origin

        if (this.numObjects === 0) {
            this._boundary.xmin = -1.0;
            this._boundary.ymin = -1.0;
            this._boundary.zmin = -1.0;
            this._boundary.xmax = 1.0;
            this._boundary.ymax = 1.0;
            this._boundary.zmax = 1.0;

        } else {

            // Set boundary inside-out, ready to expand by each selected object

            this._boundary.xmin = 1000000.0;
            this._boundary.ymin = 1000000.0;
            this._boundary.zmin = 1000000.0;
            this._boundary.xmax = -1000000.0;
            this._boundary.ymax = -1000000.0;
            this._boundary.zmax = -1000000.0;

            var component;
            var boundary;

            for (var componentId in this.components) {
                if (this.components.hasOwnProperty(componentId)) {

                    component = this.components[componentId];

                    boundary = component.boundary;

                    if (boundary) {

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
        }

        this._center[0] = (this._boundary.xmax + this._boundary.xmin) * 0.5;
        this._center[1] = (this._boundary.ymax + this._boundary.ymin) * 0.5;
        this._center[2] = (this._boundary.zmax + this._boundary.zmin) * 0.5;

        this._boundaryDirty = false;
    };

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
     * Resizes the viewport and updates the aspect ratio
     *
     * @param {Number} width The new width in px
     * @param {Number} height The new height in px
     */
    BIMSURFER.Viewer.prototype.resize = function (width, height) {

        return;

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
        optics.aspect = this.canvas.width() / this.canvas.height();
        cameraNode.setOptics(optics);
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