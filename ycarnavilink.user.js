// ==UserScript==
// @id             iitc-plugin-yahooCarNaviLink
// @name           IITC plugin: yahoo CarNavi Link
// @category       Misc
// @version        0.0.1.20200924.200000
// @description    none
// @updateURL      https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ycarnavilink.user.js
// @downloadURL    https://raw.githubusercontent.com/AG739107/iitc-plugins/master/ycarnavilink.user.js
// @namespace      https://raw.githubusercontent.com/AG739107/iitc-plugins
// @include        https://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

/* globals $ */

function wrapper(plugin_info) {
  // Ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {};

  // PLUGIN START //////////////////////////////////////////////////////////

  // Use own namespace for plugin
  window.plugin.ycarnavi = function () {};
  
  var permalinkUrl2 = '/intel?ll='+lat+','+lng+'&z=17&pll='+lat+','+lng;

  // non-android - a permalink for the portal
  var permaHtml2 = $('<div>').html( $('<a>').attr({href:permalinkUrl, title:'Create a URL link to this portal'}).text('ポータルへリンク2') ).html();
  linkDetails.push ( '<aside>'+permaHtml+'</aside>' );

  // PLUGIN END //////////////////////////////////////////////////////////

  // Add the script info data to the function as a property
  setup.info = plugin_info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);

  // If IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end

// Inject code into site context
var script = document.createElement('script');
var info = {};

if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
