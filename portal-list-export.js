// ==UserScript==
// @id             iitc-plugin-ingressdualmap-exporter@OllieTerrance
// @name           IITC plugin: Ingress Dual Map Exporter
// @category       Keys
// @version        0.0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    Exports portals currently in view as a CSV list for use with Ingress Dual Map.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
    // in case IITC is not available yet, define the base plugin object
    if (typeof window.plugin !== "function") {
        window.plugin = function() {};
    }
    // base context for plugin
    window.plugin.ingressdualmap = function() {};
    var self = window.plugin.ingressdualmap;
    self.gen = function gen() {
        var o = []; 
        for (var x in window.portals) {
            var p = window.portals[x];
            var b = window.map.getBounds();
            // skip if not currently visible
            if (p._latlng.lat < b._southWest.lat || p._latlng.lng < b._southWest.lng
                || p._latlng.lat > b._northEast.lat || p._latlng.lng > b._northEast.lng) continue;
            o.push("\"" + p.options.data.title.replace(/\"/g, "\\\"") + "\"," + p._latlng.lat + "," + p._latlng.lng);
        }
        var dialog = window.dialog({
            title: "Ingress Dual Map: CSV export",
            html: '<span>Save the list below as a CSV file, then copy it to <code>/sdcard/IngressDualMap</code> on your phone.</span>'
            + '<textarea id="idmCSVExport" style="width: 600px; height: ' + ($(window).height() - 150) + 'px; margin-top: 5px;"></textarea>'
        }).parent();
        $(".ui-dialog-buttonpane", dialog).remove();
        // width first, then centre
        dialog.css("width", 630).css({
            "top": ($(window).height() - dialog.height()) / 2,
            "left": ($(window).width() - dialog.width()) / 2
        });
        $("#idmCSVExport").val(o.join("\n"));
        return dialog;
    }
    // setup function called by IITC
    self.setup = function init() {
        // add controls to toolbox
        var link = $("<a onclick=\"window.plugin.ingressdualmap.gen();\" title=\"Generate a CSV list of portals and locations for use with Ingress Dual Map.\">IDM Export</a>");
        $("#toolbox").append(link);
        // delete setup to ensure init can't be run again
        delete self.setup;
    }
    // IITC plugin setup
    if (window.iitcLoaded && typeof self.setup === "function") {
        self.setup();
    } else if (window.bootPlugins) {
        window.bootPlugins.push(self.setup);
    } else {
        window.bootPlugins = [self.setup];
    }
}
// inject plugin into page
var script = document.createElement("script");
script.appendChild(document.createTextNode("(" + wrapper + ")();"));
(document.body || document.head || document.documentElement).appendChild(script);
