// ==UserScript==
// @id             iitc-plugin-yahoo-CarNavi-link
// @name           IITC plugin: yahoo CarNavi link
// @category       Misc
// @version        0.0.1.20200925.213200
// @namespace      rawdata
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ycarnavilink.user.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ycarnavilink.user.js
// @description    [iitc-2020-09-25-213200] This is the first release.
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
plugin_info.dateTimeVersion = '20170108.21732';
plugin_info.pluginId = 'debug-raw-portal-data';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.rawdata = function() {};

window.plugin.rawdata.setupCallback = function() {
    addHook('portalDetailsUpdated', window.plugin.rawdata.addLink);
}

window.plugin.rawdata.addLink = function(d) {
  $('.linkdetails').append('<aside><a onclick="yjcarnavi://navi/select?point=current&point=35.923515,136.4225">Yカーナビ</a></aside>');
/*  $('.linkdetails').append('<aside><a href="'
  + window.plugin.rawdata.showPortalData(window.selectedPortal)
  + '">Yカーナビ</a></aside>'); */
}

window.plugin.rawdata.showPortalData = function(guid) {
  if (!window.portals[guid]) {
    console.warn ('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }

  var latlng = window.portals[guid].getLatLng();
  var {lat, lng} = latlng;
  var ycarnaviUrl = 'yjcarnavi://navi/select?point=current&point=' + lat + ',' + lng;
  return ycarnaviUrl;
}

var setup = function () {
  window.plugin.rawdata.setupCallback();
  $('head').append('<style>' +
      '.ui-dialog-rawdata {' +
        'width: auto !important;' +
        'min-width: 400px !important;' +
        //'max-width: 600px !important;' +
    '}' +
      '#dialog-rawdata {' +
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
