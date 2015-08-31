BIMSURFER.api = {};

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
            self = this;
            if (typeof window !== 'undefined' && window.setTimeout != null) {
                this.lastBusyTimeOut = window.setTimeout(function () {
                    self.notifier.setInfo(self.translate(key + "_BUSY"), -1);
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



