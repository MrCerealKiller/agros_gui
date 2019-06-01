import { Component, OnInit } from '@angular/core';

// OpenLayers Imports
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import OlView from 'ol/View';

import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlIcon from 'ol/style/Icon';
import {Circle, Fill, Stroke, Style} from 'ol/style';

import { fromLonLat } from 'ol/proj';

// ROS Imports
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // Tractor Marker Status
  lat: number = 45.073313;
  lon: number = -74.935338;
  heading: number = 0;

  // ROS
  connection: Subscription;
  coordsSub: ROSLIB.Topic;
  headingSub: ROSLIB.Topic;

  // Base Map
  map: OlMap;
  view: OlView;

  mapLayer: OlTileLayer;
  features: OlVectorLayer;

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

    this.features = new OlVectorLayer({
      source: new OlVectorSource({
        features: [this.tractorFeature]
      })
    });

    // Initialize ROS
    this.connection = this._ros.connection$.subscribe(data => {
      if (data) {
        this.listen();
      }
    });
  }

  ngOnInit() {
    this.view = new OlView({
      center: fromLonLat([-74.935338, 45.073313]),
      zoom: 15
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.mapLayer, this.features],
      view: this.view
    });
  }

  listen() {
    // System Coordinates ------------------------------------------------------
    this.coordsSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: '/gps/raw',
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
      name: '/state/yaw',
      messageType: 'std_msgs/Float64'
    });
    this.headingSub.subscribe(function(message) {
      this.heading = (message.data / 180.0) * 3.14159265359;
      this.updateMarker();
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
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
