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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // Base Map
  map: OlMap;
  view: OlView;

  mapLayer: OlTileLayer;
  features: OlVectorLayer;

  tractorFeature: OlFeature;

  constructor() {
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

    //TODO: REMOVE (FOR DEBUG ONLY)
    var initPoint = new OlPoint(fromLonLat([-74.935338, 45.073313]));
    this.tractorFeature.setGeometry(initPoint);
    //END

    this.features = new OlVectorLayer({
      source: new OlVectorSource({
        features: [this.tractorFeature]
      })
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
}
