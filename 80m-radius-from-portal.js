// ==UserScript==
// @id             iitc-plugin-80m-radius-from-portal
// @name           IITC plugin: Misc: 80m radius from portal
// @category       Misc
// @version        0.1.0.20210310.234500
// @namespace      x80mradius
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/80m-radius-from-portal.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/80m-radius-from-portal.js
// @description    [iitc-2021-03-10-234500] This is the first release.
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


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'iitc';
plugin_info.dateTimeVersion = '20210310.234500';
plugin_info.pluginId = '80m-radius';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.x80mradius = function() {};

window.plugin.x80mradius.setupCallback = function() {
    addHook('portalDetailsUpdated', window.plugin.x80mradius.addLink);
}

window.plugin.x80mradius.addLink = function(d) {
  $('.linkdetails').append('<aside><a onclick="window.plugin.x80mradius.showPortalData(\''+window.selectedPortal+'\')" title="Display raw data of the portal">半径80m</a></aside>');
}

window.plugin.x80mradius.showPortalData = function(guid) {
  if (!window.portals[guid]) {
    console.warn ('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }

  var latlng = window.portals[guid].getLatLng();
  L.circle(latlng, 80,
    { fill: true, color: 'yellow', weight: 3, fillOpacity: 0.05, clickable: false }
  ).addTo(map);


//  dialog({
//    title: title,
//    html: body,
//    id: 'dialog-x80mradius',
//    dialogClass: 'ui-dialog-x80mradius',
//  });
}

var setup = function () {
  window.plugin.x80mradius.setupCallback();
  $('head').append('<style>' +
      '.ui-dialog-x80mradius {' +
        'width: auto !important;' +
        'min-width: 400px !important;' +
        //'max-width: 600px !important;' +
    '}' +
      '#dialog-x80mradius {' +
        'overflow-x: auto;' +
        'overflow-y: auto;' +
    '}' +
    '</style>');
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
