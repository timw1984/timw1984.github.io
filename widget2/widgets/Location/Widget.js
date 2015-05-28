define(['dojo/_base/declare', 'jimu/BaseWidget', 'dojo/dom', "dojo/on",'dojo/_base/lang', "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/tasks/locator", "esri/geometry/Point",
			"esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/graphic"],
function(declare, BaseWidget, dom, on, lang, SimpleMarkerSymbol, SimpleLineSymbol, Color, Locator, Point, webMercatorUtils, InfoTemplate, Graphic) {
  //To create a widget, you need to derive from BaseWidget.
  var mapClick;
  return declare([BaseWidget], {
    // DemoWidget code goes here 
    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-Location',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
     // this.inherited(arguments);
     // this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      console.log('startup');
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOpen: function(){
      console.log('It is open, come on in!');
	  var mapFrame = this;
	  var map = this.map;
	  mapClick = map.on("click", clickLoc);

	  
	  function clickLoc (evt){
	    map.graphics.clear();
		map.infoWindow.hide();
        locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 100);
		Gridlocator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 100);			
		LocPoint = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
		mapFrame.LatTextBox.value = LocPoint.y;
		mapFrame.LongTextBox.value = LocPoint.x;
		Lat = LocPoint.y;
		Long = LocPoint.x;
		DMSLat();
		DMSLong();
		
    };
	  
	  var Long, Lat, Latdegrees, Latminutes, Latseconds;
	  var Longdegrees, Longminutes, Longseconds;
	  var degrees, minutes, seconds, m;
	  var LocPoint, graphic, NGfunction, point;
	  var locator = new Locator(this.config.AddressURL);
	  var Gridlocator = new Locator(this.config.GridURL);
	  var infoTemplate = new InfoTemplate("Location", "Address: ${Address}");
	  
	  locator.on("location-to-address-complete", locateMe);
	  locator.on("error", function(evt){
			graphic = new Graphic(LocPoint, symbol);
			map.graphics.add(graphic);
			map.infoWindow.resize(200,100);
			map.infoWindow.setTitle("Result");
			map.infoWindow.setContent("No Address has been found");
			map.infoWindow.show(LocPoint, map.getInfoWindowAnchor(LocPoint));
			map.centerAndZoom(LocPoint,15);
		});
	  
	  function locateMe(evt) {
		if (evt.address.address) {
			var address = evt.address.address;
			LocPoint = webMercatorUtils.geographicToWebMercator(evt.address.location);
			graphic = new Graphic(LocPoint, symbol, address, infoTemplate);
			map.graphics.add(graphic);
			map.infoWindow.setTitle("Result");
			map.infoWindow.setContent("<b>Address:</b> "  + evt.address.address.Address + "<br></br>" + "<b>City:</b> " + evt.address.address.City + "<br></br>" + 
			"<b>Country:</b> " + evt.address.address.CountryCode );
			map.infoWindow.resize(250,100);
            map.infoWindow.show(LocPoint, map.getInfoWindowAnchor(LocPoint));
            map.centerAndZoom(LocPoint,15);
		}
	   };
	  Gridlocator.on("address-to-locations-complete", locateMeGridAddress);
	  
	  function locateMeGridAddress(evt){    
		FoundPointAr = evt.addresses;
		FoundPoint = FoundPointAr[0];
		LocPoint = FoundPoint.location;
		locator.locationToAddress(LocPoint , 100);	
		Lat = LocPoint.y;
		Long = LocPoint.x;
		DMSLat();
		DMSLong();
		mapFrame.LatTextBox.value = Lat;
		mapFrame.LongTextBox.value = Long;
		map.graphics.clear();
    }
	  	var symbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 15, 
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, 
            new Color([0, 0, 255, 0.5]), 8), 
          new Color([0, 0, 255])
		);
	  
	  //Clear button click event
	  on(this.clear, 'click', lang.hitch(this, function(evt){  
			console.log("It is clear!");
			mapFrame.LatMinTextBox.value = "";
			mapFrame.LatDegTextBox.value = "";
			mapFrame.LatSecTextBox.value = "";
			mapFrame.LongMinTextBox.value = "";
			mapFrame.LongDegTextBox.value = ""
			mapFrame.LongSecTextBox.value = "";
			mapFrame.LatTextBox.value = "";
			mapFrame.LongTextBox.value = "";
			mapFrame.GridTextBox.value = "";

		}));
	  //Lat/Long button click event
	  on(this.latlong, 'click', lang.hitch(this, function(evt){  
			map.graphics.clear();
			Lat = this.LatTextBox.value;
			Long = this.LongTextBox.value;
			LocPoint = new Point([Long,Lat]);
			locator.locationToAddress(LocPoint , 100);
			Gridlocator.locationToAddress(LocPoint, 100);
			DMSLat();
			DMSLong();
		}));
	  //Degrees Minutes Seconds button click event
	  on(this.dms, 'click', lang.hitch(this, function(evt){  
			console.log("It is dms!");
			Latdegrees = mapFrame.LatDegTextBox.value;
			Latminutes = mapFrame.LatMinTextBox.value;
			Latseconds = mapFrame.LatSecTextBox.value;
			LatDMS();
			Longdegrees = mapFrame.LongDegTextBox.value;
			Longminutes = mapFrame.LongMinTextBox.value;
			Longseconds = mapFrame.LongSecTextBox.value;
			LongDMS();
			LocPoint = new Point([Long,Lat]);
			locator.locationToAddress(LocPoint , 100);
			Gridlocator.locationToAddress(LocPoint, 100);
			mapFrame.LongTextBox.value = Long;
			mapFrame.LatTextBox.value = Lat;
			map.graphics.clear();	

		}));
		
	  //Use USNG/MGRS box to get address
	  on(this.grid, 'click', lang.hitch(this, function(evt){
			GridPoint = mapFrame.GridTextBox.value;
			var gridnmb = {MGRS:GridPoint};
			Gridlocator.addressToLocations(gridnmb);
			map.graphics.clear();
		}));
	  Gridlocator.on("location-to-address-complete", locateMeGrid); 
	  function locateMeGrid(evt){
			mapFrame.GridTextBox.value = evt.address.address.MGRS;
	  };
		
	//Transform Decimal Degrees into Degrees Minutes Seconds
	function DMSLat (){
		if (Lat > 0) {
			Latdegrees = Math.floor(Lat);
			m = (Lat-Latdegrees)*60;
			Latminutes = Math.floor(m);
			Latseconds = (m - Latminutes)*60;
		} else {
			Latdegrees = Math.ceil(Lat);
			m = Math.abs((Lat - Latdegrees)*60);
			Latminutes = Math.floor(m);
			Latseconds = (m - Latminutes)*60;
		}		
		mapFrame.LatMinTextBox.value = Latminutes;
		mapFrame.LatDegTextBox.value = Latdegrees;
		mapFrame.LatSecTextBox.value = Latseconds;
	};
		
	function DMSLong (){
		if (Long > 0) {
			Longdegrees = Math.floor(Long);
			m = (Long - Longdegrees)*60;
			Longminutes = Math.floor(m);
			Longseconds = (m - Longminutes)*60;
		} else {
			Longdegrees = Math.ceil(Long);
			m = Math.abs((Long - Longdegrees)*60);
			Longminutes = Math.floor(m);
			Longseconds = (m - Longminutes)*60;
		}
			mapFrame.LongMinTextBox.value = Longminutes;
			mapFrame.LongDegTextBox.value = Longdegrees;
			mapFrame.LongSecTextBox.value = Longseconds;

	};
	
	//Transform Degrees Minutes Seconds into Decimal Degrees
	function LatDMS (){
		if (Latdegrees > 0) {
			Lat = (Number(Latdegrees) +((Latminutes / 60.0) + (Latseconds / 3600.0)));
		} else {
			Lat = (Number(Latdegrees) -((Latminutes / 60.0) + (Latseconds / 3600.0)));
		}
	};
		
	function LongDMS (){
		if (Longdegrees > 0) {
			Long = (Number(Longdegrees) +((Longminutes / 60.0) + (Longseconds / 3600.0)));
		} else {
			Long = (Number(Longdegrees) -((Longminutes / 60.0) + (Longseconds / 3600.0)));
		}
	};
	//When the popup is closed remove the graphic
	map.infoWindow.on("hide", function (){
		map.graphics.clear();
	});

    },
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    onClose: function(){
      console.log('onClose');
	  var test = this;
	  mapClick.remove();
	  
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    }
  });
});