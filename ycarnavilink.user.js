// ==UserScript==
// @id             iitc-plugin-yahooCarNaviLink
// @name           IITC plugin: yahoo CarNavi Link
// @category       Misc
// @version        0.0.1.20200925.144300
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
  var glyph = {
    1: parseInt('00000001', 2),
    2: parseInt('00000010', 2),
    3: parseInt('00000100', 2),
    4: parseInt('00001000', 2),
    5: parseInt('00010000', 2),
    6: parseInt('00100000', 2),
    7: parseInt('01000000', 2),
    8: parseInt('10000000', 2)
  };

  // Use own namespace for plugin
  window.plugin.aurora = function () {};

  // Delay in ms
  window.plugin.aurora.SYNC_DELAY = 5000;


  window.plugin.aurora.glyphed = {};
  window.plugin.aurora.updateQueue = {};
  window.plugin.aurora.updatingQueue = {};

  window.plugin.aurora.enableSync = false;

  window.plugin.aurora.disabledMessage = null;
  window.plugin.aurora.contentHTML = null;

  window.plugin.aurora.onPortalDetailsUpdated = function () {
    var $preview = $('#portaldetails > .imgpreview');

    if (typeof(Storage) === 'undefined') {
      $preview.after(window.plugin.aurora.disabledMessage);
      return;
    }

    var guid = window.selectedPortal;

    $preview.after(window.plugin.aurora.contentHTML);
    window.plugin.aurora.updateCheckedAndHighlight(guid);
  };

  window.plugin.aurora.setupCSS = function () {
    $('<style>')
      .prop('type', 'text/css')
      .html('#aurora-container {'
          + 'display: block;'
          + 'text-align: center;'
          + 'margin: 6px 3px 1px 3px;'
          + 'padding: 0 4px;}'
        + '.aurora-container label {'
          + 'white-space: nowrap;'
          + 'margin: 0 0.3em;}'
        + '.aurora-container input {'
          + 'vertical-align: middle;}'
        + '#aurora-portals {'
          + 'border-collapse: collapse;'
          + 'empty-cells: show;'
          + 'width: 100%;}'
        + '#aurora-portals th, #aurora-portals td {'
          + 'padding: 3px; color: white;'
          + ' background-color: #1b415e;'
          + ' border-bottom: 1px solid #0b314e;}')
      .appendTo('head');
  };

  window.plugin.aurora.setupContent = function () {
    window.plugin.aurora.contentHTML = '<div class="aurora-container" id="aurora-container">Aurora '
      + '<label><input type="checkbox" id="glyph_1" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 1)"> 1</label>'
      + '<label><input type="checkbox" id="glyph_2" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 2)"> 2</label>'
      + '<label><input type="checkbox" id="glyph_3" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 3)"> 3</label>'
      + '<label><input type="checkbox" id="glyph_4" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 4)"> 4</label>'
      + '<label><input type="checkbox" id="glyph_5" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 5)"> 5</label>'
      + '<label><input type="checkbox" id="glyph_6" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 6)"> 6</label>'
      + '<label><input type="checkbox" id="glyph_7" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 7)"> 7</label>'
      + '<label><input type="checkbox" id="glyph_8" onclick="window.plugin.aurora.updateGlyphed($(this).prop(\'checked\'), 8)"> 8</label>'
      + '</div>';

    window.plugin.aurora.disabledMessage = '<div id="aurora-container" class="help" title="Your browser does not support localStorage">Plugin Aurora disabled</div>';

    $("#toolbox").append('<a onclick="window.plugin.aurora.showList();" title="Show portals for Aurora Glyph Hack Challenge">Aurora portals</a>');
  };

  window.plugin.aurora.isPortalInPolygon = function (portal, latLngsObjectsArray) {
    var portalCoords = portal.split(',');

    var x = portalCoords[0];
    var y = portalCoords[1];

    var inside = false;

    for (var i = 0, j = latLngsObjectsArray.length - 1; i < latLngsObjectsArray.length; j = i++) {
      var xi = latLngsObjectsArray[i].lat, yi = latLngsObjectsArray[i].lng;
      var xj = latLngsObjectsArray[j].lat, yj = latLngsObjectsArray[j].lng;

      var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };


  var setup = function () {
    window.plugin.aurora.setupCSS();
    window.plugin.aurora.setupContent();
    window.addHook('portalDetailsUpdated', window.plugin.aurora.onPortalDetailsUpdated);
  };
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
