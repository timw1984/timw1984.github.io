require([
    "esri/map",
	"esri/Color",
	"esri/geometry/Point",
	"esri/geometry/webMercatorUtils",
	"esri/graphic",
	"esri/dijit/Legend",
	"dojo/_base/array",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/renderers/TemporalRenderer",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/TimeExtent",
    "dojox/mobile",
    "dojox/mobile/parser",
    "esri/sniff",
    "dojox/mobile/deviceTheme",
    "dojo/dom",
    "dijit/registry",
    "dojo/on",
	"dojo/_base/window",
	"esri/dijit/PopupMobile",
	"esri/InfoTemplate",
	"dojox/mobile/ProgressIndicator",
	"dojo/dom-construct",
    "dojox/mobile/ToolBarButton",
    "dojox/mobile/View",
    "dojox/mobile/ContentPane"
  ],

    function (Map,Color,Point,webMercatorUtils,Graphic,Legend,arrayUtils,FeatureLayer, SimpleRenderer, TemporalRenderer,
     SimpleLineSymbol, SimpleMarkerSymbol, TimeExtent, mobile, parser, has, dTheme, dom, registry, on,win,PopupMobile,InfoTemplate,ProgressIndicator,domConstruct) {
	
	  var toggler = "notoggler";
	  var map, featureLayer;
	  var myid;
	  var OBJECTID_COUNTER = 1000;
	  var TRACKID_COUNTER = 1;
      parser.parse();
      mobile.hideAddressBar();
	  var popup = new PopupMobile(null, domConstruct.create("div"));
      map = new Map("map", {basemap:"topo", center:[-81.3961, 28.4009], zoom:10,infoWindow:popup, slider:false});

	  var infoTemplate = new InfoTemplate("${NAME}", "Motorcycles and 2 Axles: <b>${Moto2Ax}</b><br></br> Motorcycles and 2 Axles Epass: <b>${Moto2AxEP}</b> <br></br>  3 Axles: <b>${3Ax}</b><br></br> 3 Axles Epass: <b>${3AxEP}</b> <br></br>  4 Axles: <b>${4Ax}</b><br></br> 4 Axles Epass: <b>${4AxEP}</b><br></br>  5 or more Axles: <b>${5ormoreAx}</b><br></br> 5 or more Axles Epass: <b>${5ormoreAxEP}</b>   ");

      map.on("load", mapLoadHandler);
	  
	
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

      var resizeEvt = (window.onorientationchange !== undefined && !has('android')) ? "orientationchange" : "resize";
      on(window, resizeEvt, resizeMap);

      function mapLoadHandler(evt) {
		if (navigator.geolocation) {
			console.log("Got it");
		}
        resizeMap();
        registry.byId('mapView').on('AfterTransitionIn', resizeMap);
      }

      function resizeMap() {
        mobile.hideAddressBar();
        adjustMapHeight();
        map.resize();
        map.reposition();
      }

      function adjustMapHeight() {
        var availHeight = mobile.getScreenSize().h - registry.byId('header').domNode.clientHeight - 1;
        if (has('iphone') || has('ipod')) {
          availHeight += iphoneAdjustment();
        }
        dom.byId("map").style.height = availHeight + "px";
      }

      function iphoneAdjustment() {
        var sz = mobile.getScreenSize();
        if (sz.h > sz.w) { //portrait
          //Need to add address bar height back to map
          return screen.availHeight - window.innerHeight - 40;
          /* 40 = height of bottom safari toolbar */
        }
        else { //landscape
          //Need to react to full screen / bottom bar visible toggles
          var _conn = on(window, 'resize', function () {
            _conn.remove();
            resizeMap();
          });
          return 0;
        }
      }
	  
	  registry.byId('trackButton').on("click", toggleclick);
	  
	function toggleclick (evt){
		if ( toggler == "notoggler") {
			toggler = "toggled";
			dojo.byId("trackButton").innerHTML = "Hide Location";
			      var layerDefinition = {
        "objectIdField": "OBJECTID",
        "trackIdField": "TrackID",
        "geometryType": "esriGeometryPoint",
        "timeInfo": {
          "startTimeField": "DATETIME",
          "endTimeField": null,
          "timeExtent": [1277412330365],
          "timeInterval": 1,
          "timeIntervalUnits": "esriTimeUnitsMinutes"
        },
        "fields": [
          {
            "name": "OBJECTID",
            "type": "esriFieldTypeOID",
            "alias": "OBJECTID",
            "sqlType": "sqlTypeOther"
          },
          {
            "name": "TrackID",
            "type": "esriFieldTypeInteger",
            "alias": "TrackID"
          },
          {
            "name": "DATETIME",
            "type": "esriFieldTypeDate",
            "alias": "DATETIME"
          }
        ]
      };

      var featureCollection = {
        layerDefinition: layerDefinition,
        featureSet: null
      };
      featureLayer = new FeatureLayer(featureCollection);

      //setup a temporal renderer
      var sms = new SimpleMarkerSymbol().setColor(new Color([0, 0, 0,0])).setSize(8);
	  sms.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0,0]), 1));
      var observationRenderer = new SimpleRenderer(sms);
	  var mystyle = new SimpleMarkerSymbol();
	  mystyle.setColor(new Color([255, 0, 0]));
      var latestObservationRenderer = new SimpleRenderer(mystyle);
     
      var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0]), 3);

      var renderer = new TemporalRenderer(observationRenderer, latestObservationRenderer,
        null, null);
      featureLayer.setRenderer(renderer);
      map.addLayer(featureLayer);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
		myid = navigator.geolocation.watchPosition(showLocation, locationError);
      }
			
	  } else {
			toggler = "notoggler";
			dojo.byId("trackButton").innerHTML = "Show my location";
			navigator.geolocation.clearWatch(myid);
			map.removeLayer(featureLayer);
			map.graphics.clear();
	  }			
	};
	  
	 function locationError(error){
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location not provided");
          break;

        case error.POSITION_UNAVAILABLE:
          alert("Current location not available");
          break;

        case error.TIMEOUT:
          alert("Timeout");
          break;

        default:
          alert("unknown error");
          break;
      }
    }
	  
	function zoomToLocation(location){
      var pt = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude,
        location.coords.latitude));
      map.centerAndZoom(pt, 14);
    }
	
	function showLocation(location){
      if (location.coords.accuracy <= 500) {
        var now = new Date();
        var attributes = {};
        attributes.OBJECTID = OBJECTID_COUNTER;
        attributes.DATETIME = now.getTime();
        attributes.TrackID = TRACKID_COUNTER;

        OBJECTID_COUNTER++;
        TRACKID_COUNTER++;

        var pt = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude,
          location.coords.latitude));
        var graphic = new Graphic(new Point(pt, map.spatialReference), null, attributes);

        featureLayer.applyEdits([graphic], null, null, function (adds){
          map.setTimeExtent(new TimeExtent(null, new Date()));
          map.centerAt(graphic.geometry);
        });
      }
      else {
       // console.log("Point not added due to low accuracy: " + location.coords.accuracy);
      }
    }
	   map.on("layers-add-result", function (evt) {

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
          }, "legendijit");
          legendDijit.startup();
        }

      });
	  map.addLayers([turn,cfxprop,cfx,opw,tollLayer,TPtollLayer]);
    });