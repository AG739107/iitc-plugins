// ==UserScript==
// @id             iitc-plugin-battle-beacon@taskjp
// @name           IITC plugin: Battle Beacon
// @category       Layer
// @version        0.6
// @namespace      iitc-plugin-battle-beacon
// @description    Show rare battle beacon
// @updateURL      https://www.dropbox.com/s/j8n21s35ph6vypo/iitc-plugin-battle-beacon.meta.js?dl=1
// @downloadURL    https://www.dropbox.com/s/xddijivheesxcx1/iitc-plugin-battle-beacon.user.js?dl=1
// @author         taskjp
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // PLUGIN START ////////////////////////////////////////////////////////

    window.plugin.battleBeacon = function() {};
    var self = window.plugin.battleBeacon;

    self.options = {};
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
                className: 'iitc-plugin-battle-beacon iitc-plugin-battle-beacon-19min',
                iconUrl: self.ICON,
                iconAnchor: [32, 50],
                iconSize: [64, 50],
                html: ''
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

    self.nia_only_changed = function() {
    }

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
                console.debug('Beacon', beacon);
                if (beacon === 'Beacon')
                    return true;
                if(beacon === 'Very Rare Battle Beacon' && (self.options.nia_only || !self.options.show_vr))
                    return true;
                var latE6, lngE6, portalName;
                $.each(details.plext.markup, function(idx, value) {
                    switch(value[0]) {
                        case 'PORTAL':
                            latE6 = value[1].latE6;
                            lngE6 = value[1].lngE6;
                            portalName = value[1].name;
                            break;
                        case 'PLAYER':
                            if (!(self.options.nia_only && value[1].plain === 'NIASection14'))
                                return true;
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

            if (text.indexOf(' won a CAT-') >= 0) {
                console.debug('bb', line);
                return;
            }
        })
    }

    self.onBattleBeaconDetected = function(beacon) {
        if (!self.expired(beacon)) {
            self.createMarker(beacon);
        }
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
            const count_down = Math.floor((time - now) / 1000) + 19 * 60
            const layer = self.layers[key]
            if (!layer._icon) // hidden
                return;
            let text = ''
            if (count_down <= -5 * 60) {
                self.layerGroup.removeLayer(layer);
                delete self.bb[key]
                delete self.layers[key]
                continue;
            } else if (count_down <= 0 * 60) {
                layer._icon.className = layer._icon.className.replace(/iitc-plugin-battle-beacon-[1-9]+min/g, "iitc-plugin-battle-beacon-0min");
                text += '00:00'
            } else if (count_down <= 3 * 60) {
                layer._icon.className = layer._icon.className.replace(/iitc-plugin-battle-beacon-[1-9]+min/g, "iitc-plugin-battle-beacon-3min");
                text += self.time2text(count_down)
            } else if (count_down <= 6 * 60) {
                layer._icon.className = layer._icon.className.replace(/iitc-plugin-battle-beacon-[1-9]+min/g, "iitc-plugin-battle-beacon-6min");
                text += self.time2text(count_down - 180)
            } else if (count_down <= 9 * 60) {
                layer._icon.className = layer._icon.className.replace(/iitc-plugin-battle-beacon-[1-9]+min/g, "iitc-plugin-battle-beacon-9min");
                text += self.time2text(count_down - 360)
            } else if (count_down <= 19 * 60) {
                layer._icon.className = layer._icon.className.replace(/iitc-plugin-battle-beacon-[1-9]+min/g, "iitc-plugin-battle-beacon-19min");
                text += self.time2text(count_down - 540)
            }
            layer._icon.innerHTML = text
        }
        localStorage['iitc-plugin-battle-beacon'] = JSON.stringify({
            options: self.options,
            beacons: self.bb})
        if (Object.keys(self.bb).length === 0 && self.timer)
            self.stop();
    }

    self.configure = function() {
        var html = '';

        html += '<h4>Battle Beacon Settings</h4>';
        html += '<label>';
        html += '<input id="battle-beacon-nia-only" type="checkbox" name="nia_only" onchange="window.plugin.battleBeacon.nia_only_changed()"' + (self.options.nia_only ? ' checked="checked"' : '') + ' />';
        html += 'only deployed by NIASection14';
        html += '</label>';

        dialog({
            title: 'Battle Beacon',
            id: 'battle-beacon',
            html: html,
            width: 300,
            closeCallback: function() {
                $('#dialog-battle-beacon').find("input:checkbox").each(function() {
                    var $checkbox = $(this);
                    var key = $checkbox.prop("name");
                    var value = $checkbox.prop('checked');
                    self.options[key] = value;
                    localStorage['iitc-plugin-battle-beacon'] = JSON.stringify({
                        options: self.options,
                        beacons: self.bb})
                });
            }
        });
    }

    self.to_s = function(f) {
        return f.toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
    }

    self.css = function() {
        /*
#dialog-battle-beacon > label {
    display: block;
}
.iitc-plugin-battle-beacon {
    text-align: center;
    line-height: 44px;
    font-size: 16px;
    font-family: monospace;
    -webkit-text-size-adjust:none;
    background-repeat: no-repeat;
    background-size: 64px 50px;
    pointer-events: none;
}
.iitc-plugin-battle-beacon-19min {
    color: #e9ab40;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADwklEQVRoge2a32tbZRjHP+/JWVaqLRbZMhz2olgpOGku3IpT0BvXq+LAv8DdODarkpQOJjiDF3oxOuePbB24erHhhaB4t+1CWq0IE6HZTEVx4IWia7baJOuSnl+PF926pieaLT3nvGjzuUqePO97Pvme8J7Dyav2949tN+CEggEUio2A4IFMu+IdMA04rRR7dDtFigJQLxgqJqaCZwEst8p3f16gbM1rdQubB9q28kTiOUxjE8BTJoo4QK4wxUxhUqtcJBThPrOTx7c8jQLTuF2vOIs6tSKl6t75rmYQE764bx+9vb2++tTUFOfPnaupDQ0N8eTu3b7efD7P2TNnamoDAwM8v3evr3dubo53jx1bp/UygQSQTCZJJBK+eqFQ8AXw2I4d9PT0+Ho3maYvgL6+vrq93d3d6zS+g9G45f9NKwDdAroJZA1YWFigq6vLVy+XSnV7Lcvy1Yt1eovFYt3ecrncpKkfdTA5JgBf/fYZl69NNzVJPB6nra3NV19cXMR13ZqaaZq0t7f7eiuVCrZt18opRUdHh6/Xsiyq1WpTrgC7tg2yc9sgQCGQX4BlWXXPVD0cx6FU52zXQ0TuurdZNvwa0ApAt4BuWgHoFtBNKwDdArppBaBbQDetAHQL6KYVgG4B3bQC0C2gm1YAt1883PEoagPkEVMm2+9/ZOW9Otg/dhXFVhGhbM1je/a/DP/vE49tpiN+6/ml8LPpIWNK1NtKKdW5+UG9dtHiinBcAWp//9E9BrFdggSyP0AhDymlXgpiLgARRESOo9RfQcxngCfIN9lcejKkDRFHjAPJzi8V6pkgZhP4IjuT8v9JGAAhrXoZz7V5FQhiQak4jpMOYJ66hLbsj+fTOYQT651HRI6e+mH0ShBO9Qj1ule1ySBcbXa8CL86c6V3gnRaS6gBfDSbmhfh9WbGiiDgpU/9kbkZtNdqQr/z2XKpOAF8e6/jFHIhmxv5PASlGkIPIEPGc4XXBNzG3bcQlhxbUoCEZ7ZMJPe+J3OpiwqZuOsBwnvjsyOzISqtENnN/80bS4eB6436RPi9smS/FYESEGEAE78cLoA60qjP8Bg9/dOh4DYANDpeVAcCyM8sjIsw80+fi/D1B5dTn0TpFGkAk2Qc8IaXL3FrEcd1ZJgIFr7VRP4AIJsbmQY5u7auRJ0cz6dzUftoeQLiWMYosHrrR8H1lt7Q4RLTcdDvr52/sTMxaK/sUhd5JXtp9J5vloJA2zOwgl16X+BHhIsf5kof6/LQFsCns29anue+7MIwZDxdHn8DWSJQId4/6/kAAAAASUVORK5CYII=);
}
.iitc-plugin-battle-beacon-9min {
    color: #8d8ce7;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADvUlEQVRoge2az2scZRjHP89kug3RDYq0KRZTCCIBI+nBNliFerE5BQP+EZbWqCQhQgXr0oMeSmq1pk3BRkqLB0HxaA8SNSJUhGzrRhQFD0ZttsbsptvdzK/HQ2xMdlbTbmbmRbOf0+6zz/vOZ7+zvDPMvnKwe3SnBacFehCEzYASgE75GhyyLTgnwgHTTokiAPKMJU1qCzwJ4PgVvvrtEovOvFG3uLmneTuPtj2FbW0BeNxGSAFk858ynZ80KpcIBbjLbuWRbU8gYFu36mWvZFIrUSr+39/VjmLCY7t20Ts7G6qfamvjfFW9r6+Px/btC/XmcjkuXriwptbT08PT/f2h3rm5Od44cWKD1stEEkB/qUSX54Xq+y2L81W1h7u66OjoCPVuse1QAJ2dnTV729vbN+S7Gmv9lv83jQBMC5gmkjXgF6DDDk81Z4XzXVhYwHGcUL1QLIZrhULN3sXFxfpEayCHd48qwGc/f8DV61N1TZJKpWhubg7VS6USvu+vqdm2TUtLS6i3XC7juu5aORHS6XSo13EcKpVKXa4Ae3f0smdHL0A+kl+A4zg1z1QtPM+jWONs10JVb7u3Xjb9GtAIwLSAaRoBmBYwTSMA0wKmaQRgWsA0jQBMC5imEYBpAdM0AjAtYJpGALdePJB+CNkEeTSJzc67H1x5L4e7R68hbFdVFp153MD9l+H/fVJNW0mn7l1+o3xvB+ioqLwmItK69T6zdsniq3JSADnYffyARdNeRSPZHyDo/SLybBRzAaiiqnoSkT+imM+CQNEvxrJDkzFtiDhqHdrd+okg+6OYTeGjsenB8J+EERDTqpcJfJcXgCgWlLLneUMRzFOT2Jb98dxQFuX0RudR1eNnvxn5MQqnWsR63au4ZFCu1TtelZ+8ueLrUTpVE2sA78wMzqvycj1jVVEIhs7+mrkZtddqYr/z2XalMAF8eafjBL00lh3+MAalNcQeQIZM4CsvKvjrd/+FsuS5OghofGbLJHLveyY7eFnQidseoLw5PjM8E6PSCond/N+8sXQE+H29PlVmy0vusQSUgAQDmPjhSB7k6Hp9VsDIue9eim4DwHrHS+pAALnphXFVpv/pc1U+P3V18L0knRINYJKMB8HA8iWuGvV8TwdIYOFbTeIPAMayw1OgF6vronJmPDeUTdrHyBMQz7FGgNVbP/J+sPSKCZcmEwf9+vrHN/a09boru9RVnx+7MnLHN0tRYOwZWN4tvqXwLcrlt7PFd015GAvg/ZlXnSDwn/NhADKBKY8/AcPlS8nUxt4XAAAAAElFTkSuQmCC);
}
.iitc-plugin-battle-beacon-6min {
    color: #8d8ce7;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADzElEQVRoge2az2tcVRTHP/flOQ3RCQZJp1gMJRjJRjIL0ywU7MZmacG/wLpoaY3KJESoYJ260EVJrT+mTcHGjbgQFMFF24UkGhEqQqY1EUVBaCQmU2NmJslM3q/jIm3MzBtNO3nvXUrms3pz3rnnfuc7j/Mud6462jOy14BzCvpQKHYCggcy6Yp3zDTgolIc1K0pUhSAes5QTWIqOABguWW+//MKRWtRq7awebB5N08knsE07gN40kQRA8jmJpjKjWsVFwl5uN9s5fH2p1BgGrfjJWdFp6xIKbv/flcziILPHz5MV1eXLz4xMcHlS5cqYi/s28eR2Vlf7pft7Zyam6uI9fX18eyhQ77chYUF3jlzZpuq1wnEgGQySSKR8MVzuZzPgAOmSa/j+HKN5WVOVcW6u7vp7Oz05XZ0dGxLb8W8gVW6R2kYoFuAbgLpAUtLS7S1tfnixULBF5sXYdX0T3sjHodisSKWz+exLMtftypvO6jjyREB+Hr2M67fnKyrSCwWo7m52RdfWVnBdd2KmGmatLS0+HJLpRK2bVeKU4p4PO7LtSyLcrlcl1aA/Xv66d3TD5AL5AmwLKvmL1ULx3Eo1HgyaiEid5xbLzu+BzQM0C1ANw0DdAvQTcMA3QJ00zBAtwDdNAzQLUA3DQN0C9BNwwDdAnTTMOD2xSPxx1A7wI8mZbL3gUc3PqvjPSPzKHaLCEVrEduz/2f4vU+saRfx2K39S+EX00NGlKi3lFKqdddDetVFiyvCWQWooz2nDxo07RckkPMBCnlYKXUkiFoAIoiInEWpv4OoZ4AnyLeZ7OB4SAciThrHkq1fKdTTQVQT+CIzlfL/SRgAIXW9tOfavAwE0VBKjuMMBlCnJqG1/dHpwSzCue3WEZHTF34c/i0ITbUI9b1XtkkjzNc7XoTfnYXC20FqqiZUAz6cSS2K8Fo9Y0UQ8AYvzKVXg9a1mdBXPu3X8mPAd3c7TiFXMtmhz0OQVEHoBqRJe67wioC7dfYthDXHlhQg4SlbJ5K17/ls6qpCxu54gPDu6MzQTIiSNohs8b+6vHYC+GurPBH+KK3Zb0YgCYjQgLFfT+RAndwqz/AYvvjzq8EdANhqvqgmApieWhoVYeq/7ovwzfvXU59EqSlSA8ZJO+ANrL/iqhHHdWSACBrfZiLfAMhkhyZBPq6OK1HnR6cHs1Hr0bID4ljGMLD56EfO9dZe16GlScekP9y8vNyb6Lc3TqmLvJS5NnzXi6Ug0LYHlrML7wn8hHD1g2zhI106tBnw6cwblue5L7owAGlPl45/AEwEUFTxsJ3xAAAAAElFTkSuQmCC);
}
.iitc-plugin-battle-beacon-3min {
    color: #8d8ce7;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADx0lEQVRoge2az2scZRjHP+/sdBuiGwyy3WKQQjBerGQPpmIV1IMNHgKCf4G9GFqjsgkpVLAuHvRQAvVH2hRsPLR4EBRvbQ+SaESoKNnWjSi2eFA03Zomm2Z/zK/HQ5qYzaym2czMi2Y/p91nn/fls99Z3pmdeVV/90iHAScVPIpCsR0QPJApV7xDpgFnlOKAbqdIUQDqeUPFxFTwFIDlVvjmj4ssWnNa3cLmnpZdPJJ6BtPYAfC4iSIOkCtMMl2Y0CoXCQtwl9nGw8knUGAaK/Wys6RTK1Iq7t/f1QxiwhcOHqSrq8tXn5yc5ML58zW1vr4+Htu/39ebz+c5d/ZsTe3ZZJLszZu+3u/27KH/6tUtWi8TSADpdJpUKuWrFwoFXwAP7d1LZ2enr3eHafoCeLpUosdxfL0dsRj9W3Rewdi45f9NMwDdAroJZA2Yn5+nvb3dV18sFuv2Wpblqy/U6b2WTFKqVn312VisQVM/6nB6RAC++PUTrtyYamiSeDxOS0uLr760tITrujU10zRpbW319ZbLZWzbrpVTikQi4eu1LItKpdKQK8C+3b307O4FKATyC7Asq+5RrYfjOBTrHO16iMgd9zbKtl8DmgHoFtBNMwDdArppBqBbQDfNAHQL6KYZgG4B3TQD0C2gm2YAugV00wxg5cX9iQdR2yCPmDLpuPuB1ffqcPfILIpdIsKiNYft2f8y/L9PPLaTRPz2/UvhJ9NDRpSot5RSqm3nvXrtosUV4YQCVH/38QMGsX2CBLI/QCH3KaVeDGIuABFERE6glP85WQMY4Any1WhucCKkDRHHjEPpts8V6skgZhP4bHQ681wQc60npFUv67k2rwBBLChlx3EGA5inLqEt+2P5wRzCya3OIyLHT38/HMyj4DqEet6r2GQRZhsdL8IvzvXi20E6rSfUAD6YycyJ8FojY0UQ8AZP/54tBe21ltCvfJKXF8aBrzc7TiEXR3NDn4agVEPoAWTJeq7wqoC7cfdthKpjSwaQ8MyWieTa91Quc0kh43c8QHhnbGZoJkSlVSK7+C/dqh4F/tyoT4TfylX7zQiUgAgDGP/5aAHUsY36DI/hMz8eWYzCCSL+O5yfnh8TYfqfPhfhy/euZD6K0inSACbIOuANLJ/i1iOO68gAESx8a4n8BsBobmgK5Nz6uhJ1aiw/mIvaR8sdEMcyhoG1Wz8Krld9XYdLcLuNNsG3Ny7c6kn12qu71EVeHr08vOmLpSDQdg+sYBffFfgB4dL7ueKHujy0BfDxzBuW57kvuTAAWU+Xx1/TtlAR3ggY3QAAAABJRU5ErkJggg==);
}
.iitc-plugin-battle-beacon-0min {
    color: #ba3a27;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADpUlEQVRoge2awWubdRjHP8+b125MUxySFSzSIeJJqYdNDwqbBzc8CAP/BA8r06okpcqEzXQHPYzC5syWgasM1IMHEby4g1ScCBOlmbaiOGdxtXaZnUvatHnzvu+zQ1lt80aapu/7/pDmc0qePL8nn3wPv7x585O+3uFuC04LPIEgbAYUH/Sip/4h24JzIuwz7RQrAiDPW5JQW2AvgOMt8u1fFyg7s0bdouberTvY1fUMtnUXwJM2QgdAofglY8VRo3KxcAvutjt5NPUUArZ1p77gzpvUipVF79/Paocx8FhPD/unpgL1U11dnK+rv7BzJwevXQv0fpZKMTQ9var2bCpF9ubNQO/3PT30XbmyQeslQgngwPw8j7huoL7HsjhfV9tr2+xu0GvNzTFUV3u6UmnY251I0LcB31XvG9Kc/y3tAEwLmCaUPeBP4EE7OOq6Fcx3RpVKg94/kkkol1fVfkulqFSrwRmJROuydYQSwHOlElu3bQvU5xvs9q9PTjLUoHehWAzU8pOTfJhMBurO1astmgYJJQDHcXAcp6le13UplUpN9apq072tsun3gHYApgVM0w7AtIBp2gGYFjBNOwDTAqZpB2BawDTtAEwLmKYdgGkB07QDuPPggeTDyCbIIyE23fc8tPxcXuwdnkHYoaqUnVlqfs2gXvR0JLaQ7Ni+9ET5xfbRYVF5S0Skc8t9Zu3ixVPlhADS13t8n0XicUVDOR8g6P0icjCMWQCqqKqeQCT4P1kLWOAr+nWukBmN6EDEUevQY51fCLInjGkKn+bG0gfCmFVPRLte1vdqvAKEsaEsuK6bCWFOQyLb9vPjmQLK6Y3OUdXjZ38cDOev4AZE+r23WCOLMtPqelV+d6+X3g7TqZ5IA3hvIj2ryhutrFVFwc+cnc5WwvZaSeRXPqnLt0aAb9a7TtALucLAJxEorSLyALJkfU95VcFrepFSdWuaBjQ6syViufY9U0hfEnSk6QXKyfzEwESESsvEdvFfmaseBv5eq0+VqYVq7VgMSkCMAYz8ergIcnStPstn8NzPr5XX6guLWH/+jY/9k1dl7L9eV+WrUz+kP4rTKdYARsm64PcvfcXVo67naj8xbHwrif0GQK4wcBH0g/q6qJzJj2cKcfsYuQPiOtYgsPLoR9Hzq0dMuIR32mgdfHfj87ndXftry6fUVV/OXR5c98VSGBi7B1asld5R+Anl0ruF0vumPIwF8PHEm47vey950A9Z35THbXYRQVapE9CkAAAAAElFTkSuQmCC);
}
*/
    };

    var setup = function() {
        $("<style>")
            .prop("type", "text/css")
            .html(self.to_s(self.css)).appendTo("head");
        self.options = {
            nia_only: true,
            show_vr: false,
        };
        self.layerGroup = new L.LayerGroup();
        window.addLayerGroup('Battle Beacon', self.layerGroup, true);
        self.layerGroup.on('add', function () {
            if (Object.keys(self.bb).length > 0)
                self.start();
        });
        self.layerGroup.on('remove', function () {
            self.stop();
        });

        const now = new Date
        var str = localStorage['iitc-plugin-battle-beacon'];
        if (str) {
            try {
                var json = JSON.parse(str);
                self.options = Object.assign(self.options, json.options);
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
        addHook('battleBeaconDetected', self.onBattleBeaconDetected);
        $('#toolbox').append('<a onclick="window.plugin.battleBeacon.configure()">Battle Beacon🛠️</a>');
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
