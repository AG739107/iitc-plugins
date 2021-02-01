// ==UserScript==
// @id             iitc-plugin-yahoo-Map-link
// @name           IITC plugin: yahoo Map link
// @category       Misc
// @version        0.0.1.20210201.122900
// @namespace      ymap
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ymaplink.user.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ymaplink.user.js
// @description    [iitc-2021-02-01-122900] This is the first release.
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
plugin_info.dateTimeVersion = '20210201.122900';
plugin_info.pluginId = 'mics-yahoo-map';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.ymap = function() {};

window.plugin.ymap.setupCallback = function() {
    addHook('portalDetailsUpdated', window.plugin.ymap.addLink);
}

window.plugin.ymap.addLink = function(d) {
  $('.linkdetails').append('<aside><a href="'
  + window.plugin.ymap.showPortalData(window.selectedPortal)
  + '">Yahoo!地図</a></aside>');
}

window.plugin.ymap.showPortalData = function(guid) {
  if (!window.portals[guid]) {
    console.warn ('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }

  var latlng = window.portals[guid].getLatLng();
  var {lat, lng} = latlng;
  var ymapUrl = 'https://map.yahoo.co.jp/place?lat=' + lat + '&lon=' + lng + '&zoom=18&maptype=satellite';
  return ymapUrl;
}

var setup = function () {
  window.plugin.ymap.setupCallback();
  $('head').append('<style>' +
      '.ui-dialog-ymap {' +
        'width: auto !important;' +
        'min-width: 400px !important;' +
        //'max-width: 600px !important;' +
    '}' +
      '#dialog-ymap {' +
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
