function loadBimServerApi(address, notifier, ok, error) {

	if (notifier == null) {

		function Notifier() {
			var othis = this;

			this.setSelector = function(selector) {
			};

			this.clear = function() {
			};

			this.resetStatus = function(){
			};

			this.resetStatusQuick = function(){
			};

			this.setSuccess = function(status, timeToShow) {
				console.log("success", status);
			};

			this.setInfo = function(info, timeToShow) {
				console.log("info", info);
			};

			this.setError = function(error) {
				console.log("error", error);
			};
		}

		notifier = new Notifier();
	}

	var timeoutId = window.setTimeout(function() {
		notifier.setError("Could not connect");
		error();
	}, 3000);

	if (address.endsWith("/")) {
		address = address.substring(0, address.length - 1);
	}

	$.getScript(address + "/js/bimserverapi.js").done(function(){

		window.clearTimeout(timeoutId);

		if (typeof BimServerApi != 'function') {
			notifier.setError("Could not connect");
			error();

		} else {

			if (BimServerApi != null) {
				var bimServerApi = new BimServerApi(address, notifier);
				bimServerApi.init(function(api, serverInfo){

					// Wait for the schemas to load

					var i = setInterval(function() {
						if (bimServerApi.schemas["ifc2x3tc1"] && bimServerApi.schemas["ifc4"]) {
							clearInterval(i);
							ok(bimServerApi, serverInfo);
						}
					}, 200);
				});

			} else {
				window.clearTimeout(timeoutId);
				notifier.setError("Could not find BIMserver API");
				error();
			}
		}

	}).fail(function(jqxhr, settings, exception){
		window.clearTimeout(timeoutId);
		notifier.setError("Could not connect");
		error();
	});
}