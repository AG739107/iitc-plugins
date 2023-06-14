// ==UserScript==
// @id             iitc-plugin-import-area
// @name           IITC Plugin: Area 
// @category       Layer
// @version        20230610002552
// @namespace      https://ech0u.satellite.ooo/scripts/iitc/iitc-plugin-area
// @updateURL      https://ech0u.satellite.ooo/scripts/iitc/iitc-plugin-area.meta.js
// @downloadURL    https://ech0u.satellite.ooo/scripts/iitc/iitc-plugin-area.user.js
// @description    none
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

var setup = function() {
  var layerGroup = L.layerGroup();

  var draw_dataEA = {"type":"polygon","latLngs":[{"lat":36.39800382677536,"lng":138.25523614883423},{"lat":36.395715307300335,"lng":138.25287580490112},{"lat":36.39858674077926,"lng":138.2507622241974},{"lat":36.40008070781968,"lng":138.25201213359833},{"lat":36.40073376965075,"lng":138.2523138821125},{"lat":36.39987777178594,"lng":138.2543832063675},{"lat":36.39973960226824,"lng":138.25550436973572},{"lat":36.399342363536526,"lng":138.25584769248962}],"color":"#00ff00"};
  layerGroup.addLayer(L.polygon(draw_dataEA.latLngs, {color: draw_dataEA.color, opacity: 0.5} ));
  var draw_dataEB = {"type":"polygon","latLngs":[{"lat":36.39987777178594,"lng":138.2543832063675},{"lat":36.40073376965075,"lng":138.2523138821125},{"lat":36.401821834033065,"lng":138.2528154551983},{"lat":36.40330278607338,"lng":138.25057446956635},{"lat":36.404696280039715,"lng":138.25127720832825},{"lat":36.40323694259531,"lng":138.2566738128662},{"lat":36.39973960226824,"lng":138.25550436973572}],"color":"#00ff00"};
  layerGroup.addLayer(L.polygon(draw_dataEB.latLngs, {color: draw_dataEB.color, opacity: 0.5} ));
//  var draw_dataEC = {"type":"polygon","latLngs":[{"lat":36.40405512480436,"lng":138.25364157557487},{"lat":36.40658733335349,"lng":138.25344443321225},{"lat":36.407822105884165,"lng":138.2527792453766},{"lat":36.40762350743083,"lng":138.2546031475067},{"lat":36.4059958,"lng":138.2594954},{"lat":36.4015185,"lng":138.2628643},{"lat":36.40323910139876,"lng":138.25664699077606}],"color":"#00ff00"};
//  layerGroup.addLayer(L.polygon(draw_dataEC.latLngs, {color: draw_dataEC.color, opacity: 0.5} ));
  var draw_dataEC1 = {"type":"polygon","latLngs":[{"lat":36.407822645553175,"lng":138.25278460979462},{"lat":36.40658733335349,"lng":138.25344912707806},{"lat":36.405600256757964,"lng":138.25352557003498},{"lat":36.40554574860903,"lng":138.2542584836483},{"lat":36.40548314514329,"lng":138.25477212667465},{"lat":36.405486922940064,"lng":138.25521267950535},{"lat":36.405476129234486,"lng":138.2554641366005},{"lat":36.40607895539363,"lng":138.2555640488863},{"lat":36.40685123525038,"lng":138.25564719736576},{"lat":36.40670552265742,"lng":138.25503900647163},{"lat":36.40692031371751,"lng":138.25518921017647},{"lat":36.40740871831477,"lng":138.25525224208832},{"lat":36.40762458677162,"lng":138.25459979474545}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataEC1.latLngs, {color: draw_dataEC1.color, opacity: 0.5} ));
  var draw_dataEC2 = {"type":"polygon","latLngs":[{"lat":36.405598098020114,"lng":138.2535269111395},{"lat":36.4040583629754,"lng":138.25364492833614},{"lat":36.40313601846738,"lng":138.25702048838136},{"lat":36.40423970033864,"lng":138.25748786330223},{"lat":36.40469196251373,"lng":138.25531661510468},{"lat":36.40547289112255,"lng":138.2554641366005},{"lat":36.405484224513806,"lng":138.25521267950535},{"lat":36.40548152608748,"lng":138.2547701150179},{"lat":36.405544129554514,"lng":138.25425647199154}],"color":"#00ff00"};
  layerGroup.addLayer(L.polygon(draw_dataEC2.latLngs, {color: draw_dataEC2.color, opacity: 0.5} ));
  var draw_dataEC3 = {"type":"polygon","latLngs":[{"lat":36.40740817864288,"lng":138.2552555948496},{"lat":36.406920853392805,"lng":138.25519323349},{"lat":36.4067098400715,"lng":138.2550437003374},{"lat":36.40685717168358,"lng":138.2556525617838},{"lat":36.4060875902912,"lng":138.2555694133043},{"lat":36.405473430807874,"lng":138.25546748936176},{"lat":36.40469520065823,"lng":138.2553206384182},{"lat":36.404244017889745,"lng":138.2574912160635},{"lat":36.40481069439075,"lng":138.25773932039738},{"lat":36.406526889439064,"lng":138.25791031122208}],"color":"#4a86e8"};
  layerGroup.addLayer(L.polygon(draw_dataEC3.latLngs, {color: draw_dataEC3.color, opacity: 0.5} ));
  var draw_dataEC4 = {"type":"polygon","latLngs":[{"lat":36.406526889439064,"lng":138.25791366398335},{"lat":36.40480961501086,"lng":138.2577420026064},{"lat":36.40402867973575,"lng":138.25740337371826},{"lat":36.40313439936266,"lng":138.25702250003815},{"lat":36.40152229401896,"lng":138.2628623396158},{"lat":36.40599530477367,"lng":138.25949549674988}],"color":"#ff00ff"};
  layerGroup.addLayer(L.polygon(draw_dataEC4.latLngs, {color: draw_dataEC4.color, opacity: 0.5} ));    var draw_dataEF = {"type":"polygon","latLngs":[{"lat":36.39973960226824,"lng":138.25550436973572},{"lat":36.403241260202165,"lng":138.2566684484482},{"lat":36.4015185,"lng":138.2628643},{"lat":36.3993078,"lng":138.2640445},{"lat":36.399342363536526,"lng":138.25584769248962}],"color":"#00ff00"};
  layerGroup.addLayer(L.polygon(draw_dataEF.latLngs, {color: draw_dataEF.color, opacity: 0.5} ));
  var draw_dataEH = {"type":"polygon","latLngs":[{"lat":36.3993078,"lng":138.2640445},{"lat":36.399342363536526,"lng":138.25584769248962},{"lat":36.39800382677536,"lng":138.25523614883423},{"lat":36.395715847053445,"lng":138.25287446379662},{"lat":36.394715678121095,"lng":138.25458705425262},{"lat":36.39527270849373,"lng":138.2575535774231},{"lat":36.39397944193019,"lng":138.25998902320862},{"lat":36.3962507,"lng":138.2657289}],"color":"#00ff00"};
  layerGroup.addLayer(L.polygon(draw_dataEH.latLngs, {color: draw_dataEH.color, opacity: 0.5} ));
  var draw_dataKA = {"type":"polygon","latLngs":[{"lat":36.379594449225614,"lng":138.272665143013},{"lat":36.3835591,"lng":138.2679015},{"lat":36.3835326,"lng":138.2634772},{"lat":36.376825972069355,"lng":138.2685399055481}],"color":"#a24ac3"};
  layerGroup.addLayer(L.polygon(draw_dataKA.latLngs, {color: draw_dataKA.color, opacity: 0.5} ));
  var draw_dataKB = {"type":"polygon","latLngs":[{"lat":36.376825972069355,"lng":138.2685399055481},{"lat":36.379594449225614,"lng":138.272665143013},{"lat":36.3772017,"lng":138.276447},{"lat":36.3744245,"lng":138.2747089}],"color":"#a24ac3"};
  layerGroup.addLayer(L.polygon(draw_dataKB.latLngs, {color: draw_dataKB.color, opacity: 0.5} ));
  var draw_dataSA = {"type":"polygon","latLngs":[{"lat":36.40715723080614,"lng":138.2397973537445},{"lat":36.4043325,"lng":138.2381605},{"lat":36.40280086306998,"lng":138.2418143749237},{"lat":36.40061179322967,"lng":138.24706077575684},{"lat":36.3965961793769,"lng":138.24468970298767},{"lat":36.40287426276536,"lng":138.23214769363403},{"lat":36.4059742,"lng":138.234508},{"lat":36.40549933569962,"lng":138.23555946350098},{"lat":36.40781347117936,"lng":138.23751211166382}],"color":"#ff00ff"};
  layerGroup.addLayer(L.polygon(draw_dataSA.latLngs, {color: draw_dataSA.color, opacity: 0.5} ));
  var draw_dataSB = {"type":"polygon","latLngs":[{"lat":36.39346558379983,"lng":138.25673013925552},{"lat":36.395715307300335,"lng":138.25287580490112},{"lat":36.39858674077926,"lng":138.2507622241974},{"lat":36.40061179322967,"lng":138.24706077575684},{"lat":36.3965961793769,"lng":138.24468970298767},{"lat":36.3913539798571,"lng":138.25405597686768}],"color":"#ff00ff"};
  layerGroup.addLayer(L.polygon(draw_dataSB.latLngs, {color: draw_dataSB.color, opacity: 0.5} ));
  var draw_dataSC = {"type":"polygon","latLngs":[{"lat":36.3913539798571,"lng":138.25405597686768},{"lat":36.3835326,"lng":138.2634772},{"lat":36.3835591,"lng":138.2679015},{"lat":36.39065441743583,"lng":138.26245665550232},{"lat":36.39299490404426,"lng":138.25936675071713},{"lat":36.39397944193019,"lng":138.25998902320862},{"lat":36.39527918556762,"lng":138.25755894184113},{"lat":36.39472107572139,"lng":138.25457900762558},{"lat":36.39346558379983,"lng":138.2567274570465}],"color":"#ff00ff"};
  layerGroup.addLayer(L.polygon(draw_dataSC.latLngs, {color: draw_dataSC.color, opacity: 0.5} ));
  var draw_dataWA = {"type":"polygon","latLngs":[{"lat":36.40670822104126,"lng":138.24372947216034},{"lat":36.405128031426116,"lng":138.24294090270996},{"lat":36.40280086306998,"lng":138.2418143749237},{"lat":36.4043325,"lng":138.2381605},{"lat":36.40715723080614,"lng":138.2397973537445},{"lat":36.40903095508508,"lng":138.24089169502258},{"lat":36.40843948479046,"lng":138.244566321373}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWA.latLngs, {color: draw_dataWA.color, opacity: 0.5} ));
  var draw_dataWB = {"type":"polygon","latLngs":[{"lat":36.4041436,"lng":138.245548},{"lat":36.405128031426116,"lng":138.24294090270996},{"lat":36.40280086306998,"lng":138.2418143749237},{"lat":36.40061179322967,"lng":138.24706077575684},{"lat":36.40278791017537,"lng":138.24647605419156},{"lat":36.4031333,"lng":138.2453113}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWB.latLngs, {color: draw_dataWB.color, opacity: 0.5} ));
  var draw_dataWC = {"type":"polygon","latLngs":[{"lat":36.4041436,"lng":138.245548},{"lat":36.405128031426116,"lng":138.24294090270996},{"lat":36.40670822104126,"lng":138.24372947216034},{"lat":36.40502009380441,"lng":138.25006887316704},{"lat":36.40464015218328,"lng":138.2472163438797},{"lat":36.40278791017537,"lng":138.24647605419156},{"lat":36.4031333,"lng":138.2453113}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWC.latLngs, {color: draw_dataWC.color, opacity: 0.5} ));
  var draw_dataWF = {"type":"polygon","latLngs":[{"lat":36.40278791017537,"lng":138.24647605419156},{"lat":36.40464015218328,"lng":138.2472163438797},{"lat":36.40502009380441,"lng":138.25006887316704},{"lat":36.404696280039715,"lng":138.25127720832825},{"lat":36.40330278607338,"lng":138.25057446956635},{"lat":36.40061179322967,"lng":138.24706077575684}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWF.latLngs, {color: draw_dataWF.color, opacity: 0.5} ));
  var draw_dataWH = {"type":"polygon","latLngs":[{"lat":36.40008070781968,"lng":138.25201213359833},{"lat":36.401821834033065,"lng":138.2528181374073},{"lat":36.40330278607338,"lng":138.25057446956635},{"lat":36.40061179322967,"lng":138.24706077575684},{"lat":36.39858674077926,"lng":138.2507622241974}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWH.latLngs, {color: draw_dataWH.color, opacity: 0.5} ));
  var draw_dataWJ = {"type":"polygon","latLngs":[{"lat":36.40670822104126,"lng":138.24372947216034},{"lat":36.40502009380441,"lng":138.25006887316704},{"lat":36.40405512480436,"lng":138.25364157557487},{"lat":36.40658733335349,"lng":138.25344443321225},{"lat":36.407822105884165,"lng":138.2527792453766},{"lat":36.40843948479046,"lng":138.244566321373}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWJ.latLngs, {color: draw_dataWJ.color, opacity: 0.5} ));
  var draw_dataWL = {"type":"polygon","latLngs":[{"lat":36.40781347117936,"lng":138.23751211166382},{"lat":36.40549933569962,"lng":138.23555946350098},{"lat":36.4059742,"lng":138.234508},{"lat":36.4103002,"lng":138.2379198},{"lat":36.40903095508508,"lng":138.24089169502258},{"lat":36.40715723080614,"lng":138.2397973537445}],"color":"#ff0000"};
  layerGroup.addLayer(L.polygon(draw_dataWL.latLngs, {color: draw_dataWL.color, opacity: 0.5} ));

  window.addLayerGroup("Area", layerGroup, true);
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
