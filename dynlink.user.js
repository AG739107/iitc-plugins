// ==UserScript==
// @id             iitc-plugin-dynamic-link
// @name           IITC plugin: dynamic link
// @category       Misc
// @version        0.0.1.20220528.120300
// @namespace      dynlink
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/dynlink.user.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/dynlink.user.js
// @description    [iitc-2022-05-28-120300] This is the first release.
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
plugin_info.dateTimeVersion = '20220528.120300';
plugin_info.pluginId = 'misc-dynamic-link';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.dynlink = function() {};

window.plugin.dynlink.setupCallback = function() {
    addHook('portalDetailsUpdated', window.plugin.dynlink.addLink);
}

window.plugin.dynlink.addLink = function(d) {
  $('.linkdetails').append('<aside><a href="'
  + window.plugin.dynlink.showPortalData(window.selectedPortal)
  + '">dynamic link</a></aside>');
}

window.plugin.dynlink.showPortalData = function(guid) {
  if (!window.portals[guid]) {
    console.warn ('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }

  var latlng = window.portals[guid].getLatLng();
  var {lat, lng} = latlng;
//  var dynUrl = 'https://map.yahoo.co.jp/place?lat=' + lat + '&lon=' + lng + '&zoom=18&maptype=satellite';
  var dynUrl = 'https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2fportal%2f' + guid + '&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fintel.ingress.com%2fintel%3fpll%3d' + lat + '%2c' + lng;
  return dynUrl;
}

var setup = function () {
  window.plugin.dynlink.setupCallback();
  $('head').append('<style>' +
      '.ui-dialog-dynlink {' +
        'width: auto !important;' +
        'min-width: 400px !important;' +
        //'max-width: 600px !important;' +
    '}' +
      '#dialog-dynlink {' +
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
