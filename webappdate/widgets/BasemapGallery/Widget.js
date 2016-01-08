///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
var added,mapmouseoverhandle;
define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    "dojo/Deferred",
    'jimu/BaseWidget',
    'jimu/portalUtils',
    'jimu/PanelManager',
    "jimu/SpatialReference/wkidUtils",
    'jimu/portalUrlUtils',
    'jimu/utils',
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    'esri/dijit/BasemapGallery',
	"esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters","esri/dijit/Popup","esri/InfoTemplate",
    'dojo/_base/lang',
    'dojo/_base/array',
    "dojo/_base/html",
    "dojo/query",
    'dojo/on',
	"dojo/dom-construct",
	"dojo/dom-class",
    'dojo/promise/all',
	"dojo/dom-attr",
	"dojo/dom",
    './utils',
	"dojo/_base/connect"
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    Deferred,
    BaseWidget,
    portalUtils,
    PanelManager,
    SRUtils,
    portalUrlUtils,
    jimuUtils,
    Basemap,
    BasemapLayer,
    BasemapGallery, IdentifyTask, IdentifyParameters,Popup,InfoTemplate,
    lang,
    array,
    html,
    query,
    on,
	domConstruct,
	domClass,
    all,
	domAttr,
	dom,
    utils) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
	
      name: 'BasemapGallery',
      baseClass: 'jimu-widget-basemapgallery',
      basemapGallery: null,
      spatialRef: null,
	
      startup: function() {
		added = "no";
		//var added = no;
        /*jshint unused: false*/
        this.inherited(arguments);
        this.initBasemaps();
      },

      resize: function() {
        this._responsive();
      },

      _responsive: function() {
        // the default width of esriBasemapGalleryNode is 85px,
        // margin-left is 10px, margin-right is 10px;
        var paneNode = query('#' + this.id)[0];
        var width = html.getStyle(paneNode, 'width');
        var column      = parseInt(width / 105, 10);
        if (column > 0) {
          var margin      = width % 105;
          var addWidth    = parseInt(margin / column, 10);
          query('.esriBasemapGalleryNode', this.id).forEach(function(node) {
            html.setStyle(node, 'width', 85 + addWidth + 'px');
          });
        }
      },

      initBasemaps: function() {
        var basemapsDef;
        var portalSelfDef;
        var config = lang.clone(this.config.basemapGallery);

        //load form portal or config file.
        if (!config.basemaps || config.basemaps.length === 0) {
          basemapsDef = utils._loadPortalBaseMaps(this.appConfig.portalUrl,
                                                  this.map.spatialReference);
        } else {
          basemapsDef = new Deferred();
          basemapsDef.resolve(config.basemaps);
        }

        var portal = portalUtils.getPortal(this.appConfig.portalUrl);
        portalSelfDef = portal.loadSelfInfo();
        all({
          'portalSelf': portalSelfDef,
          'basemaps': basemapsDef
        }).then(lang.hitch(this, function(result) {
          var basemaps = result.basemaps;
          var basemapObjs = [];
          var i = 0;
          var webmapBasemap = this._getWebmapBasemap();

          basemaps = array.filter(basemaps, function(basemap) {
            if(!basemap || !basemap.title) {
              return false;
            }
            var bingKeyResult;
            var spatialReferenceResult;
            // first, filter bingMaps
            if(result.portalSelf.bingKey) {
              // has bingKey, can add any bing map or not;
              bingKeyResult = true;
            } else if(!utils.isBingMap(basemap)) {
              // do not have bingKey and basemap is not bingMap.
              bingKeyResult = true;
            } else {
              // do not show basemap if do not has bingKey as well as basemap is bingMap.
              bingKeyResult = false;
            }

            // second, filter spatialReference.
            // only show basemaps who has same spatialReference with current map.
            if (SRUtils.isSameSR(this.map.spatialReference.wkid,
                                  basemap.spatialReference.wkid)) {
              spatialReferenceResult = true;
            } else {
              spatialReferenceResult = false;
            }

            // basemap does not have title means basemap load failed.
            return basemap.title && bingKeyResult && spatialReferenceResult;
          }, this);

          // if basemap of current webmap is not include, so add it.
          for(i = 0; i < basemaps.length; i++) {
            if (utils.compareSameBasemapByOrder(basemaps[i], webmapBasemap)) {
              break;
            }
          }
          if(i === basemaps.length) {
            basemaps.push(webmapBasemap);
          }

          for (i = 0; i < basemaps.length; i++) {
            var n = basemaps[i].layers.length;
            var layersArray = [];
            for (var j = 0; j < n; j++) {
              layersArray.push(new BasemapLayer(basemaps[i].layers[j]));
            }
            basemaps[i].layers = layersArray;
            if (!basemaps[i].thumbnailUrl) {
              basemaps[i].thumbnailUrl = this.folderUrl + "images/default.jpg";
            } else {
              if (basemaps[i].thumbnailUrl.indexOf('//') === 0) {
                basemaps[i].thumbnailUrl = basemaps[i].thumbnailUrl +
                                           utils.getToken(this.appConfig.portalUrl);
              } else {
                basemaps[i].thumbnailUrl =
                  jimuUtils.processUrlInWidgetConfig(basemaps[i].thumbnailUrl, this.folderUrl);
              }
              // else if(basemaps[i].thumbnailUrl.startWith('/') ||
              //   basemaps[i].thumbnailUrl.startWith('data')){
              //   basemaps[i].thumbnailUrl = basemaps[i].thumbnailUrl;
              // }else{
              //   //if path is relative, relative to widget's folder
              //   basemaps[i].thumbnailUrl = this.appUrl + basemaps[i].thumbnailUrl;
              // }
            }
            basemapObjs.push(new Basemap(basemaps[i]));
          }

          config.map = this.map;
          if (this.appConfig.portalUrl) {
            config.portalUrl = this.appConfig.portalUrl;
          }
          config.basemaps = basemapObjs;
          config.showArcGISBasemaps = false;
          config.bingMapsKey = result.portalSelf.bingKey;
          this.basemapGallery = new BasemapGallery(config, this.basemapGalleryDiv);
          this.basemapGallery.startup();
          this.own(on(this.basemapGallery,
                      "selection-change",
                      lang.hitch(this, this.selectionChange)));
          this._responsive();
        }));
      },

      _getWebmapBasemap: function() {
        var thumbnailUrl;
        if (this.map.itemInfo.item.thumbnail) {
          thumbnailUrl = portalUrlUtils.getItemUrl(this.appConfig.portalUrl,
                         this.map.itemInfo.item.id) + "/info/" + this.map.itemInfo.item.thumbnail;
        } else {
          thumbnailUrl = null;
        }
        return {
          title: this.map.itemInfo.itemData.baseMap.title,
          thumbnailUrl: thumbnailUrl,
          layers: this.map.itemInfo.itemData.baseMap.baseMapLayers,
          spatialReference: this.map.spatialReference
        };
      },
	
      selectionChange: function() {
	/////////////////////////////////////////////////////////// Image Date ///////////////////////////////////////////////////////////////////////////////
		domConstruct.destroy("myDate");
		if (added == "yes"){
			mapmouseoverhandle.remove();
		}

		var mymap = this.map;
		var identifyTask, identifyParams;
        var basemap = this.basemapGallery.getSelected();
		 
         var layers = basemap.getLayers();
		
		 if (basemap.title == "Imagery" || basemap.title == "Imagery with Labels" ){
			var basemapURL = basemap.layers[0].url;
			identifyTask = new IdentifyTask(basemapURL);
			identifyParams = new IdentifyParameters(basemapURL);
			identifyParams.tolerance = 1;
			identifyParams.returnGeometry = true;
			identifyParams.layerIds = [0,1,2,3];
			identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_TOP;
			identifyParams.width = mymap.width;
			identifyParams.height = mymap.height;
			
			//console.log("Yup its Imagery");
			
			var myDiv = domConstruct.toDom("<div id='myDate' style='right:70px;bottom:22px;position:absolute;background:rgba(255,255,255,0.7);margin: 0 5px 0 0;padding: 0 4px;color:#666666;text-align:left;z-index: 9;'>Click on map for Aerial Date</div>");  
			domConstruct.place(myDiv, "map");  

			mapmouseoverhandle = mymap.on("click", mouseclickevent);
			
			function mouseclickevent(event){
				identifyParams.geometry = event.mapPoint;
				identifyParams.mapExtent = mymap.extent;
				var deferred = identifyTask
				.execute(identifyParams)
				.addCallback(function (response) {
				 return array.map(response, function (result) {
                var feature = result.feature;
                var layerName = result.layerName;
				dojo.byId("myDate").innerHTML = "Aerial Date: " + result.feature.attributes.SRC_DATE2;
					return feature;
              });
            });
		 //mymap.infoWindow.setFeatures([deferred]);
         //mymap.infoWindow.show(event.mapPoint);
				added = "yes";
			};
		} else {
			//console.log("Nope, not Imagery");
			added = "no";
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //if (layers.length > 0) {
        //   this.publishData(layers);
        // }
        if (this.isOnScreen) {
          PanelManager.getInstance().closePanel(this.id + '_panel');
        }
      }

    });

    return clazz;
  });