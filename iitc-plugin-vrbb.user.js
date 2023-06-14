// ==UserScript==
// @id             iitc-plugin-vrbb@taskjp
// @name           IITC plugin: Very Rare Battle Beacon
// @category       Layer
// @version        0.6
// @namespace      iitc-plugin-vrbb
// @description    Show very rare battle beacon icon
// @updateURL      https://www.dropbox.com/s/1bnupibpypg1i3l/iitc-plugin-vrbb.meta.js?dl=1
// @downloadURL    https://www.dropbox.com/s/pq93snc6ai4aqnc/iitc-plugin-vrbb.user.js?dl=1
// @author         taskjp
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // PLUGIN START ////////////////////////////////////////////////////////

    window.plugin.vrbb = function() {};
    var self = window.plugin.vrbb;

    self.bb = {};
    self.layers = {};
    self.layerGroup = null;

    self.genHashKey = function(data) {
        return data.latE6 + '_' + data.lngE6 + '_' + data.timestamp ;
    };

    self.expired = function(beacon) {
        const time = new Date(beacon.timestamp);
        const count_down = (time - new Date) / 1000 + 19 * 60
        return (count_down < -5 * 60);
    };

    self.createMarker = function(bb, force = false) {
        var key = self.genHashKey(bb);
        if (!force && (key in self.bb))
            return;
        var layer = L.marker([bb.latE6/1e6, bb.lngE6/1e6], {
            icon: L.divIcon({
                className: 'iitc-plugin-vrbb iitc-plugin-vrbb-99min',
                iconUrl: self.ICON,
                iconAnchor: [32, 83],
                iconSize: [64, 77]
            }),
            title: bb.portalName,
            opacity: 1,
            zIndexOffset: 1000,
            riseOnHover: true
        });
        self.layerGroup.addLayer(layer);
        self.bb[key] = bb;
        self.layers[key] = layer;
        if (!force)
            self.start();
    };

    self.onPublicChatDataAvailable = function(data) {
        $.each(data.result, function(idx, line) {
            var details = line[2];
            if(! details) { return true; }
            if(! details.plext) { return true; }
            var text = details.plext.text;
            var deployed = 'deployed a ';
            var pos1 = text.indexOf(deployed);
            var pos2 = text.indexOf(" Beacon on ", pos1);
            if(text && pos1 >= 0 && pos2 >= 0) {
                var beacon = text.substring(pos1 + deployed.length, pos2 + ' Beacon'.length);
                if(beacon !== 'Very Rare Battle Beacon')
                    return true;
                var latE6, lngE6, portalName;
                $.each(details.plext.markup, function(idx, value) {
                    switch(value[0]) {
                        case 'PORTAL':
                            latE6 = value[1].latE6;
                            lngE6 = value[1].lngE6;
                            portalName = value[1].name;
                            break;
                    }
                });
                if(! latE6 || ! lngE6) { return true; }

                var timestamp = line[1];

                var bb = {
                    type: beacon,
                    latE6: latE6,
                    lngE6: lngE6,
                    portalName: portalName,
                    timestamp: timestamp,
                };
                console.debug('bb detected', bb);
                if (!self.expired(bb)) {
                    self.createMarker(bb);
                }
                return;
            }
        })
    }

    self.timer = null;
    self.start = function() {
        if (!window.map.hasLayer(self.layerGroup))
            return;
        if (self.timer)
            return;
        self.timeout()
        self.timer = setInterval(self.timeout, 1000);
    }
    self.stop = function() {
        clearInterval(self.timer);
        self.timer = null;
        self.timeout()
    }

    self.time2text = function(time) {
        return self.pad(time / 60) + ':' + self.pad(time % 60)
    }
    self.pad = function (d) {
        d = Math.floor(d)
        return (d < 10) ? '0' + d.toFixed(0) : d.toFixed(0);
    }
    self.timeout = function() {
        const now = new Date
        for (var key in self.bb) {
            const bb = self.bb[key]
            const time = new Date(bb.timestamp);
            const count_down = Math.floor((time - now) / 1000) + 15 * 60
            const layer = self.layers[key]
            let text = '<br />'
            if (count_down <= -5 * 60) {
                self.layerGroup.removeLayer(layer);
                delete self.bb[key]
                delete self.layers[key]
            } else if (layer._icon) {// not hidden
                if (count_down <= 0 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-0min");
                    text += '00:00'
                } else if (count_down <= 3 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-3min");
                    text += self.time2text(count_down)
                } else if (count_down <= 6 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-6min");
                    text += self.time2text(count_down - 180)
                } else if (count_down <= 9 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-9min");
                    text += self.time2text(count_down - 360)
                } else if (count_down <= 12 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-12min");
                    text += self.time2text(count_down - 540)
                } else if (count_down <= 15 * 60) {
                    layer._icon.className = layer._icon.className.replace(/iitc-plugin-vrbb-[1-9]+min/g, "iitc-plugin-vrbb-15min");
                    text += self.time2text(count_down - 720)
                }
                layer._icon.innerHTML = text
            }
        }
        localStorage['iitc-plugin-vrbb'] = JSON.stringify({
            beacons: self.bb})
        if (Object.keys(self.bb).length === 0 && self.timer)
            self.stop();
    }

    var setup = function() {
        $("<style>")
            .prop("type", "text/css")
            .html("\
.iitc-plugin-vrbb {\
text-align: center;\
line-height: 34px;\
font-size: 16px;\
font-family: monospace;\
-webkit-text-size-adjust:none;\
background-repeat: no-repeat;\
background-size: 64px 79px;\
pointer-events: none;\
color: #e9ab40;\
}\
.iitc-plugin-vrbb-99min {\
color: #e9ab40;\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-15min {\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-12min {\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-9min {\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-6min {\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-3min {\
background-image: url(data:image/png;base64,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);\
}\
.iitc-plugin-vrbb-0min {\
color: #ba3a27;\
background-image: url(data:image/png;base64,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);\
}\
").appendTo("head");
        self.layerGroup = new L.LayerGroup();
        window.addLayerGroup('Very Rare Battle Beacon', self.layerGroup, true);
        self.layerGroup.on('add', function () {
            if (Object.keys(self.bb).length > 0)
                self.start();
        });
        self.layerGroup.on('remove', function () {
            self.stop();
        });

        const now = new Date
        var str = localStorage['iitc-plugin-vrbb'];
        if (str) {
            try {
                var json = JSON.parse(str);
                self.bb = Object.assign(json.beacons, {});
            } catch (e) {
            }
        }

        for (var key in self.bb) {
            var bb = self.bb[key];
            if (self.expired(bb)) {
                delete self.bb[key]
            } else {
                self.createMarker(bb, true);
            }
        }
        addHook('publicChatDataAvailable', self.onPublicChatDataAvailable);
        if (Object.keys(self.bb).length > 0)
            self.start();
    }

    // PLUGIN END //////////////////////////////////////////////////////////

    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
