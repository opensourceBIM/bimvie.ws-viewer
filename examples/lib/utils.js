/**
 * @namespace Supports query of params on URL in browser location bar.
 */
(function () {
    "use strict";

    var searchParams;

    function getSearchParams() {
        if (!searchParams) {
            searchParams = {};
            var search = window.location.search.slice(1);
            var params = search.split('&');
            var tokens;
            for (var i = 0, len = params.length; i < len; i++) {
                tokens = params[i].split("=");
                searchParams[tokens[0]] = tokens[1];
            }
        }
        return searchParams;
    }

    function getSearchParam(key) {
        if (!searchParams) {
            getSearchParams();
        }
        return searchParams[key];
    }

    $(document).ready(function () {

        if (getSearchParam("noinfo")) {

            // Hide info DIV

            var info = $("info");

            if (info) {
                info.hide();
            }
        }
    });
})();