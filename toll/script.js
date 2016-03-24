      var map, formerRenderer528;
    
      require([ 
	  "esri/map",
        "esri/renderers/Renderer",
        "esri/renderers/SimpleRenderer",
        "esri/dijit/Search",
        "esri/layers/FeatureLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "dojo/parser",
        "dojo/colors",
        "dojo/_base/array",
		"dojo/dom",
		"esri/domUtils",
		"esri/dijit/LocateButton",
		"esri/dijit/HomeButton",
		 "dojo/on",
		 "dojo/mouse",
		 "esri/Color",
		 "esri/dijit/Legend",
		 "esri/symbols/SimpleLineSymbol",
		 "dijit/form/ToggleButton",
		"dijit/layout/BorderContainer", "dijit/layout/ContentPane", 
      "dijit/layout/AccordionContainer",
        "dojo/domReady!"
      ], function( 
	  Map,
        Renderer,
        SimpleRenderer,
        Search,
        FeatureLayer,
        PictureMarkerSymbol,
        InfoTemplate,
        parser,
        colors,
        arrayUtils,
		dom,
		domUtils,
		LocateButton,
		HomeButton,
		on,
		mouse,
		Color,
		Legend,
		SimpleLineSymbol
      ) {
	parser.parse();
	

	var lods = [ 	 {"level" : 10, "resolution" : 152.8740565701464, "scale" : 577790.554288},
					 {"level" : 11, "resolution" : 76.4370282850732, "scale" : 288895.277144},
					 {"level" : 12, "resolution" : 38.2185141425366, "scale" : 144447.638572},
					 {"level" : 13, "resolution" : 19.1092570712683, "scale" : 72223.819286},
           			 {"level" : 14, "resolution" : 9.55462853563415, "scale" : 36111.909643},
					 {"level" : 15, "resolution" : 4.77731426794937, "scale" : 18055.954822},
					 {"level" : 16, "resolution" : 2.38865713397468, "scale" : 9027.977411},
					 {"level" : 17, "resolution" : 1.19432856685505, "scale" : 4513.988705},
					 {"level" : 18, "resolution" : 0.597164283559817, "scale" : 2256.994353}];

	  
	var infoTemplate = new InfoTemplate("${NAME}", "Motorcycles and 2 Axles: <b>${Moto2Ax}</b><br></br> Motorcycles and 2 Axles Epass: <b>${Moto2AxEP}</b> <br></br>  3 Axles: <b>${3Ax}</b><br></br> 3 Axles Epass: <b>${3AxEP}</b> <br></br>  4 Axles: <b>${4Ax}</b><br></br> 4 Axles Epass: <b>${4AxEP}</b><br></br>  5 or more Axles: <b>${5ormoreAx}</b><br></br> 5 or more Axles Epass: <b>${5ormoreAxEP}</b>   ");

     map = new Map("map", {basemap:"topo", center:[-81.3391, 28.4679], lods: lods,zoom:0});
	 
	  var home = new HomeButton({
        map: map
      }, "HomeButton");
      home.startup();

      var search = new Search({
            map: map
         }, "search");
         search.startup();
		 
		 var geoLocate = new LocateButton({
			map: map,
			highlightLocation: false
		}, "LocateButtonDiv");
		geoLocate.startup();


	 	var cfx = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/arcgis/rest/services/Existing_CFX_System/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
		  outFields:["*"]
        }); 
		
		var cfxprop = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/ArcGIS/rest/services/Future_CFX_Segments/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
		  outFields:["*"]
        }); 
		
		var turn = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/arcgis/rest/services/Florida_Turnpike_System/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
		  outFields:["*"]
        }); 
		
		var opw = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/arcgis/rest/services/Osceola_Parkway/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
		  outFields:["*"]
        }); 
		
		var tollLayer = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/arcgis/rest/services/CFEA_TOLL/FeatureServer/0", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields:["*"],
			infoTemplate :infoTemplate
		});
		
		var TPtollLayer = new FeatureLayer("http://services6.arcgis.com/JcSnorSBV0EzWsKT/arcgis/rest/services/Florida_Turnpike_Toll_Plaza/FeatureServer/0", {
			mode: FeatureLayer.MODE_ONDEMAND,
			outFields:["*"],
			infoTemplate :infoTemplate
		});
		
 
		
		 
  
  
   map.on("layers-add-result", function (evt) {
	domUtils.show(dom.byId('legendWrapper'));
        var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
		 var layername = layer.layer.name;
		 var layerfinal = layername.replace(/_/g, ' ');
		 var legendvalue = layer.layer.fields[layer.layer.fields.length-1].name;
          return {layer:layer.layer, title:layerfinal, legend:legendvalue };
        });
        if (layerInfo.length > 0) {
		function compare(a,b) {
			if (a.legend > b.legend)
				return -1;
			else if (a.legend < b.legend)
				return 1;
			else 
				return 0;
		}

			var myfinallegend = layerInfo.sort(compare);
			
          var legendDijit = new Legend({
            map: map,
            layerInfos: myfinallegend
          }, "legenddiv");
          legendDijit.startup();
        }

      });
	  
	map.addLayers([turn,cfxprop,cfx,opw,tollLayer,TPtollLayer]);
	
      });