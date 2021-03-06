// bring this thing to life...
var thisitem = sessionStorage.getItem('maptext');
	console.log(thisitem);
require([
  "dojo/_base/array",
  "dojo/_base/declare",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-style",

  "dojo/on",
  "dojo/query",
  "dojo/Stateful",
  "dojo/string",

  "extras/GridManager",
  "extras/TextSelector",
  "extras/formatters",

  // load templates for require only and full html page
  "dojo/text!templates/require-only.txt",
  "dojo/text!templates/full-html.txt"
], function(
  arrayUtils, declare, dom, domAttr, domStyle, 
  on, query, Stateful, string,
  GridManager, TextSelector, formatters,
  requireOnly, fullHtml
) {
	var updated, finalupdate, HomeThere; 
  // creates two dgrids:  one for esri, one for dojo
  // pass IDs of dom elements where grids will be created
  var gm = new GridManager({
    dojoGridId: "dojo-list",
    esriGridId: "esri-list"
  });
  gm.on("change", updateRequire);

  // simple require() template as well as full html doc template
  var templates = {
    fullHtml: {
      content: fullHtml,
      pad: "        "
    },
    requireOnly: {
      content: requireOnly,
      pad: "  "
    }
  };
  var config = new Stateful();
  config.set("templates", templates);
  config.watch("current", updateTemplate);
  
  // utility class to format module IDs and aliases
  
  config.set("current", "requireOnly");

  // click anywhere in the require to select all of it for easy copying
  var textSelector = new TextSelector({ id: "output" });

  var moduleFilter = dom.byId("module-filter");
  moduleFilter.focus();
  on(moduleFilter, "keyup", filterModules);

  // show/hide settings
  on(dom.byId("settings"), "click", function() {
    domStyle.set(dom.byId("settingsPane"), "display", "block");
  });
  on(dom.byId("settingsClose"), "click", function() {
    domStyle.set(dom.byId("settingsPane"), "display", "none");
  });

  // monitor radio buttons that specify which template to use
  query("input[type=radio]").forEach(function(radio) {
    on(radio, "change", function() {
      if ( config.get("templates").hasOwnProperty(this.value) ) {
        config.set("current", this.value);
      } else {
        console.log("radio button change::unknown template");
      }
    });
  });

  // monitor check boxes and update grid with dojo modules accordingly
  query("input[type=checkbox]").forEach(function(checkbox) {
    on(checkbox, "change", gm.updateDojoPackages);
  });

  function updateRequire(evt) {
	arrayUtils.map(gm.esriSelection, function(evt){
		if(evt.alias == "HomeButton"){
			HomeThere = "yes";
		}	
	});
	console.log(evt);
    var templateName = config.get("current");
    var template = config.get("templates")[templateName];
    var content = template.content;
    var pad = template.pad;
    var mids = formatters.mids(gm.esriSelection, gm.dojoSelection, pad); 
    var aliases = formatters.aliases(gm.esriSelection, gm.dojoSelection, pad);
	if (mids == ""){
		updated = string.substitute(content, [mids, aliases]);
		var mapr = '"esri/map"';
		var mapf = "Map";
		finalupdate = updated.replace("mapreq", mapr).replace("mapfun", mapf).replace("themappart", thisitem).replace("homebutton", "").replace(/^(\r\n)|(\n)/,'').replace("homepart",'').replace("homesty",'');
	} else {
		if (HomeThere == "yes") {
			updated = string.substitute(content, [mids, aliases]);
			var mapr = '"esri/map",';
			var mapf = "Map,";
			var homey = '&lt;div id="homediv"&gt;&lt;/div&gt;';
			var homecode = 'var home = new HomeButton({ map: map}, "homediv"); <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;home.startup();<br>';
			var homestylecode = '#homediv {position: absolute; top: 95px; left: 20px; z-index: 50; }';
			finalupdate = updated.replace("mapreq", mapr).replace("mapfun", mapf).replace("themappart", thisitem).replace("homebutton", homey).replace("homepart", homecode).replace("homesty", homestylecode);
			HomeThere = "no";
		} else {
			updated = string.substitute(content, [mids, aliases]);
			var mapr = '"esri/map",';
			var mapf = "Map,";
			finalupdate = updated.replace("mapreq", mapr).replace("mapfun", mapf).replace("themappart", thisitem).replace("homebutton", "").replace(/^(\r\n)|(\n)/,'').replace("homepart",'').replace("homesty",'');
		}
	}

    dom.byId("output").innerHTML = finalupdate;
  }

  function updateTemplate(property, oldVal, newVal) {
    // console.log("update template", arguments);
    if ( !config.get("templates").hasOwnProperty(newVal) ) {
      console.log("unknown template", newVal);
      return;
    }
    updateRequire();
  }

  function filterModules(e) {
    // selected is a string of module IDs appened to the query passed to the store
    // this is done so that selected modules aren't hidden
    var selected = "";
    if ( gm.esriSelection.length ) {
      selected = selected + "|" + arrayUtils.map(gm.esriSelection, function(m) {
        return m.id;
      }).join("|");
    }
    if ( gm.dojoSelection.length ) {
      selected = selected + "|" + arrayUtils.map(gm.dojoSelection, function(m) {
        return m.id;
      }).join("|");
    }
    // console.log("selected", selected);
    gm.esriGrid.set("query", {
      id: new RegExp(this.value + selected, "i") 
    });
    gm.dojoGrid.set("query", {
      id: new RegExp(this.value + selected, "i") 
    });
  }
});