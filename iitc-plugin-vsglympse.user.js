/*
 * IITC plugin: Very Simple Glympse Layer
 * Copyright (C) 2018 taskjp
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// ==UserScript==
// @id             iitc-plugin-vsglympse@taskjp
// @name           IITC plugin: Very Simple Glympse Layer
// @category       Layer
// @version        0.0.6
// @namespace      iitc-plugin-vsglympse
// @description    Very Simple Glympse Layer for IITC
// @updateURL      https://www.dropbox.com/s/b3wlgs38nlzvq5t/iitc-plugin-vsglympse.meta.js?dl=1
// @downloadURL    https://www.dropbox.com/s/7qq9b4wp0f1s6av/iitc-plugin-vsglympse.user.js?dl=1
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

// Change Log
// 2018-06-03 v0.0.2 non-ascii group name support
// 2018-06-25 v0.0.3 add "Agent" button to show member list
// 2018-07-20 v0.0.4 fix crash when location is not included
// 2022-11-11 v0.0.5 update @match
// 2022-11-14 v0.0.6 support intel-x subdomain

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () {};

    window.plugin.vsglympse = function () {};
    var self = window.plugin.vsglympse;
    self.layerGroup = null;
    self.members = {};

    self.timer = function() {};
    var timer = self.timer;

    timer.start = function() {
        timer.member = setInterval(api.updateMembers, 5000);
        if (api.group()) {
            timer.event = setInterval(api.updateEvents, 15000);
        } else {
            timer.event = null;
        }
    };

    timer.stop = function() {
        clearTimeout(timer.member);
        if (timer.event) {
            clearTimeout(timer.event);
        }
    };


    self.api = function () {};
    var api = self.api;
    api.access_token = null;
    api.url = null;
    api.events = 0;
    api.setup = function () {
        api.login({username: 'viewer', password: 'password', api_key: '0SLq661pXHmqdWgI8Yb1'});
    };

    api.group = function() {
        var matches = api.url.match(/^https?:\/\/glympse\.com\/!(.+)$/);
        if (matches)
            return matches[1];
        return null;
    };

    api.login = function(data) {
        if (api.access_token) {
            if (api.url)
                api.start();
        } else {
            $.ajax({
                       url: '//api.glympse.com/v2/account/login',
                       type: 'GET',
                       data: data,
                       crossDomain: true,
                       success: function(result) {
                           if ((typeof result.response === 'undefined' || typeof result.response.access_token === 'undefined')) return;
                           api.access_token = result.response.access_token;
                           if (api.url) {
                               api.start();
                           }
                       }
                   });
        }
    };

    api.start = function() {
        timer.stop();
        var matches = api.url.match(/^https?:\/\/glympse\.com\/(!)?(.+)$/);
        if (matches) {
            if (matches[1]) {
                api.groups(matches[2]);
            } else {
                api.invite(matches[2], matches[2], 0);
            }
            timer.start();
        }
    };

    api.groups = function(group) {
        $.ajax({
                   url: '//api.glympse.com/v2/groups/' + group,
                   type: 'GET',
                   data: {
                       branding: 'true',
                       oauth_token: api.access_token
                   },
                   crossDomain: true,
                   success: function(response) {
                       api.events = response.response.events;
                       $.each(response.response.members, function (idx, member) {
                           api.invite(member.id, member.invite, 0);
                       });
                   }
               });
    };

    api.invite = function(id, name, next) {
        $.ajax({
                   url: '//api.glympse.com/v2/invites/' + name,
                   type: 'GET',
                   data: {
                       next: next,
                       oauth_token: api.access_token,
                       uncompressed: true,
                   },
                   crossDomain: true,
                   success: function(response) {
                       if (response.result === 'ok') {
                           self.upsertMember(response.response);
                       }
                   }
               });
    };

    api.updateMembers = function() {
        $.each(self.members, function(id, member) {
            api.invite(id, member.invite, member.next);
        });
    };

    api.updateEvents = function() {
        var group = api.group();
        $.ajax({
                   url: '//api.glympse.com/v2/groups/' + group + '/events',
                   data: {
                       next: api.events,
                       oauth_token: api.access_token
                   },
                   success: function(response) {
                       switch (response.result) {
                       case 'ok':
                           api.events = response.response.events;
                           switch (response.response.type) {
                           case 'events':
                               self.handleEvents(response.response.items);
                               break;
                           case 'group':
                               self.handleGroup(response.response.members);
                               break;
                           }
                           break;
                       case 'failure':
                           api.events = 0;
                           self.clearMembers();
                           break;
                       }
                   }
               });
    };

    self.upsertMember = function(member) {
        var dirty = false;
        var m = {};

        if (member.properties) {
            $.each(member.properties, function(i, object) {
                m[object.n] = object.v;
            });
            m.id = m.owner;
        }
        if (!m.id) {
            $.each(self.members, function(key, value) {
                if (value.invite === member.id) {
                    m = self.members[value.id];
                }
            });
        }

        m.invite = member.id;
        m.next = member.next;

        var p = self.members[m.id] ? self.members[m.id] : {};

        if (!m.avatar)
            m.avatar = 'http://cdn.glympse.cc/icon.png'
        if (m.avatar !== p.avatar) {
            dirty = true;
        }
        if (m.name !== p.name){
            dirty = true;
        }
        if (m.end_time) {
            if (m.end_time > new Date()) {
                m.status = 'active';
            } else {
                m.status = 'expired';
            }
            if (m.status !== p.status) {
                dirty = true;
            }
        }

        if (dirty) {
            self.deleteMember(m.id);
        } else {
            m.layer = p.layer;
        }

        if (member.location) {
            var location = member.location[member.location.length - 1];
            m.timestamp = location[0];
            m.lat = location[1] / 1e6;
            m.lng = location[2] / 1e6;
        } else if (!m.lat || !m.lng) {
            return;
        }
        if (!m.layer) {
            if (m.status === 'active') {
                m.layer = L.marker([m.lat, m.lng], {
                                       icon: L.icon({
                                                        iconUrl: m.avatar,
                                                        iconAnchor: [20, 20],
                                                        iconSize: [40, 40],
                                                        className: 'iitc-plugin-vsglympse-active',
                                                    }),
                                       title: m.name,
                                       opacity: 1,
                                       zIndexOffset: 100,
                                   });
                self.layerGroup.addLayer(m.layer);
            } else {
                m.layer = L.marker([m.lat, m.lng], {
                                       icon: L.icon({
                                                        iconUrl: m.avatar,
                                                        iconAnchor: [15, 15],
                                                        iconSize: [30, 30],
                                                        className: 'iitc-plugin-vsglympse-expired',
                                                    }),
                                       title: m.name,
                                       opacity: 0.5,
                                       zIndexOffset: -100,
                                   });
                self.layerGroup.addLayer(m.layer);
            }
        } else {
            m.layer.setLatLng([m.lat, m.lng]);
        }

        self.members[m.id] = m;
    };

    self.deleteMember = function(id) {
        if (self.members[id]) {
            self.layerGroup.removeLayer(self.members[id].layer);
            delete self.members[id];
        }
    };

    self.handleEvents = function(items) {
        $.each(items, function (idx, event) {
            switch (event.type) {
            case 'leave': // Member Has Left Group
                self.deleteMember(event.member);
                break;
            case 'join': // Member Has Joined Group
                // (usually followed by an
                // invite, so do nothing)
                self.deleteMember(event.member);
                break;
            case 'invite': // Member Has been invited
                // to group
                api.invite(event.member, event.invite, 0);
                break;
            }
        });
    };

    self.handleMembers = function(members) {
        $.each(members, function (idx, member) {
            api.invite('????', member.invite, 0);
        });
    };

    self.clearMembers = function() {
        $.each(self.members, function (id, member) {
            if (member.layer)
                self.layerGroup.removeLayer(member.layer);
            delete self.members[id];
        });
    };

    self.inputUrl = function() {
        var url = localStorage.vsglympse;
        if (!url)
            url = 'https://glympse.com/';
        var ret = window.prompt("Input Glympse URL", url);
        if (typeof ret === 'string' && ret !== url) {
            self.clearMembers();
            localStorage.vsglympse = ret;
            api.url = ret;
            api.start();
        }
    };

    self.showList = function() {
        var html = '';

        if (self.members.length === 0) {
            html += '<i>No agent found now</i>';
        } else {
            html += '<table id="iitc-plugin-vsglympse-table">';
            html += '<thead><tr><th>Icon</th><th>Agent</th><th>Status</th></tr></thead>';
            html += '<tbody>';
            var now = new Date;
            $.each(self.members, function(id, member) {
                html += '<tr>';
                html += '<th><img src="'+member.avatar+'" width="32" height="32"/></th>';
                html += '<td><a onclick="window.map.setView(new L.LatLng(' + member.lat + ',' + member.lng + '), 17, {pan: {animate:true}});">' + member.name + '</a></td>';
                if (member.end_time < now) {
                  html += '<td>Expired</td>';
                } else {
                  var expiresIn = Math.ceil((member.end_time - now.getTime()) / 1000 / 60);
                  html += '<td>' + expiresIn + 'min</td>';
                }
                html += '</tr>';
            });
            html += '</tbody>';
            html += '</table>';
        }

        dialog({
            title: 'Very Simple Glympse',
            id: 'vsglympse-agents',
            html: html,
            width: 300,
        });
    };

    self.setup = function () {
        self.layerGroup = new L.LayerGroup();
        window.addLayerGroup('Glympse', self.layerGroup, true);
        $('#toolbox').append('<a onclick="window.plugin.vsglympse.inputUrl()" title="Input Glympse URL">Glympse</a>');
        $('<style>').prop('type', 'text/css').html(
            '.iitc-plugin-vsglympse-active { border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.75); }\n' +
            '.iitc-plugin-vsglympse-expired { border-radius: 50%; border: 3px solid rgba(0, 0, 0, 1.0); }'
        ).appendTo('head');
        $('#toolbox').append('<a onclick="window.plugin.vsglympse.showList();">Agents</a>');
        $('<style>').prop('type', 'text/css').html(
            '#iitc-plugin-vsglympse-table { width: 100% }\n' +
            '#iitc-plugin-vsglympse-table td { vertical-align: middle; border: 1px solid gray; }\n' +
            '#iitc-plugin-vsglympse-table img { border-radius: 50%; }\n' +
            '#iitc-plugin-vsglympse-table th { vertical-align: middle; border: 1px solid gray; }\n'
        ).appendTo('head');

        api.url = localStorage.vsglympse;
        api.setup();
    };

    var setup = function () {
        self.setup();
    };
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
