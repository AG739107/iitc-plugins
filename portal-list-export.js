// ==UserScript==
// @id             iitc-plugin-portal-list-export
// @name           IITC plugin: ingress Portal List Exporter
// @category       Misc
// @version        0.0.1.20210219.1165500
// @namespace      Portal-Export-CSV
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/portal-list-export.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/portal-list-export.js
// @description    [iitc-2021-02-19-165500] This is the first release.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
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
        for (var guid in window.portals) {
            var p = window.portals[guid];
            var b = window.map.getBounds();
            // skip if not currently visible
            if (p._latlng.lat < b._southWest.lat || p._latlng.lng < b._southWest.lng
                || p._latlng.lat > b._northEast.lat || p._latlng.lng > b._northEast.lng) continue;
            o.push("\"" + p.options.data.title.replace(/\"/g, "\\\"") + "\"," + p._latlng.lat + "," + p._latlng.lng + "," + guid);
        }
        var dialog = window.dialog({
            title: "CSV export",
            html: '<span>Save the list below as a CSV file, then copy it.</span>'
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
        var link = $("<a onclick=\"window.plugin.ingressdualmap.gen();\" title=\"Generate a CSV list of portals and locations.\">Export Portal List</a>");
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
