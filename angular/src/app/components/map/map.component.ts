import { Component, OnInit, Input } from '@angular/core';

// OpenLayers Imports
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import OlView from 'ol/View';

import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlLineString from 'ol/geom/LineString';
import OlIcon from 'ol/style/Icon';
import {Circle, Fill, Stroke, Style} from 'ol/style';

import { fromLonLat } from 'ol/proj';
import { containsCoordinate } from 'ol/extent';

// ROS Imports
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() isFullscreen: boolean = false;

  // Tractor Marker Status
  lat: number = 45.505337;
  lon: number = -73.579901;
  heading: number = 0;

  // Route
  route: any;

  // ROS
  connection: Subscription;
  coordsSub: ROSLIB.Topic;
  headingSub: ROSLIB.Topic;
  routeSub: ROSLIB.Topic;

  // Base Map
  map: OlMap;
  view: OlView;

  mapLayer: OlTileLayer;
  routeLayer: OlVectorLayer;
  tractorLayer: OlVectorLayer;

  routeFeature: OlFeature;
  tractorFeature: OlFeature;

  constructor(private _ros: RosService) {
    // Initialize Map Components
    this.mapLayer = new OlTileLayer({
      source: new OlXYZ({
        url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      })
    });

    this.tractorFeature = new OlFeature();
    this.tractorFeature.setStyle(new Style({
      image: new OlIcon({
        src: 'assets/tractor_marker.png',
        scale: '0.25'
      })
    }));

    this.tractorLayer = new OlVectorLayer({
      source: new OlVectorSource({
        features: [this.tractorFeature]
      })
    });

    this.routeFeature = new OlFeature();

    this.routeLayer = new OlVectorLayer({
      source: new OlVectorSource({
        features: [this.routeFeature]
      }),
      style: new Style({
        fill: new Fill({ color: '#FF00FF', weight: 4 }),
        stroke: new Stroke({ color: '#FF00FF', width: 2 })
      })
    });

    this.view = new OlView({
      center: fromLonLat([this.lon, this.lat]),
      zoom: 15
    });

    // Initialize ROS
    this.connection = this._ros.connection$.subscribe(data => {
      if (data) {
        this.listen();
      }
    });
  }

  ngOnInit() {
    this.map = new OlMap({
      target: 'map',
      layers: [this.mapLayer, this.routeLayer, this.tractorLayer],
      view: this.view
    });

    let that = this;
    setTimeout(function() {
      that.map.updateSize();
    }, 200);
  }

  listen() {
    // System Coordinates ------------------------------------------------------
    this.coordsSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.sysCoordsTopic,
      messageType: 'sensor_msgs/NavSatFix'
    });
    this.coordsSub.subscribe(function(message) {
      this.lat = message.latitude;
      this.lon = message.longitude;
      this.updateMarker();
    }.bind(this));

    // System Heading ----------------------------------------------------------
    this.headingSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.sysHeadingTopic,
      messageType: 'std_msgs/Float64'
    });
    this.headingSub.subscribe(function(message) {
      this.heading = (message.data / 180.0) * 3.14159265359;
      this.updateMarker();
    }.bind(this));

    // System Heading ----------------------------------------------------------
    this.routeSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.routeTopic,
      messageType: 'geographic_msgs/RouteNetwork'
    });
    this.routeSub.subscribe(function(message) {
      this.route = message.points
      this.updateRoute()
    }.bind(this));
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  updateMarker() {
    var loc = fromLonLat([this.lon, this.lat]);
    var point = new OlPoint(loc);
    this.tractorFeature.getStyle().getImage().setRotation(this.heading);
    this.tractorFeature.setGeometry(point);

    var extent = this.map.getView().calculateExtent(this.map.getSize());
    if (!containsCoordinate(extent, loc)) {
      this.map.getView().animate({center: loc});
    }
  }

  updateRoute() {
    var coords = [];
    for (let p of this.route) {
      var loc = fromLonLat([p.position.longitude, p.position.latitude]);
      coords.push(loc)
    }
    var line = new OlLineString(coords)
    this.routeFeature.setGeometry(line)
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  setIsFullscreen(isFullscreen) {
    this.isFullscreen = isFullscreen;
    let that = this;
    setTimeout(function() {
      that.map.updateSize();
    }, 200);
  }
}
