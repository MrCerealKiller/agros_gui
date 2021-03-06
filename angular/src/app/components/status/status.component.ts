import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  // System Status
  sysSpeed: number = 0;
  sysHeading: number = 0;
  sysLat: number = 0;
  sysLon: number = 0;

  // Target Status
  tarDistance: number = 0;
  bearing: number = 0;
  tarLat: number = 0;
  tarLon: number = 0

  // ROS
  connection: Subscription;
  sysSpeedSub: ROSLIB.Topic;
  sysHeadingSub: ROSLIB.Topic;
  sysCoordsSub: ROSLIB.Topic;
  tarDistanceSub: ROSLIB.Topic;
  bearingSub: ROSLIB.Topic;
  tarLatSub: ROSLIB.Topic;
  tarLonSub: ROSLIB.Topic;

  constructor(private _ros: RosService) {
    this.connection = this._ros.connection$.subscribe(data => {
      if (data) {
        this.listen();
      }
    });
  }

  ngOnInit() {
  }

  listen() {
    // System Speed ------------------------------------------------------------
    this.sysSpeedSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.sysSpeedTopic,
      messageType: 'std_msgs/Float64'
    });
    this.sysSpeedSub.subscribe(function(message) {
      this.sysSpeed = message.data;
    }.bind(this));

    // System Heading ----------------------------------------------------------
    this.sysHeadingSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.sysHeadingTopic,
      messageType: 'std_msgs/Float64'
    });
    this.sysHeadingSub.subscribe(function(message) {
      this.sysHeading = (message.data / Math.PI) * 180;
    }.bind(this));

    // System Coordinates ------------------------------------------------------
    this.sysCoordsSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.sysCoordsTopic,
      messageType: 'sensor_msgs/NavSatFix'
    });
    this.sysCoordsSub.subscribe(function(message) {
      this.sysLat = message.latitude;
      this.sysLon = message.longitude;
    }.bind(this));

    // Target Distance ---------------------------------------------------------
    this.tarDistanceSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.tarDistanceTopic,
      messageType: 'std_msgs/Float64'
    });
    this.tarDistanceSub.subscribe(function(message) {
      this.tarDistance = (message.data / 1000);
    }.bind(this));

    // Target Bearing ----------------------------------------------------------
    this.bearingSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.bearingTopic,
      messageType: 'std_msgs/Float64'
    });
    this.bearingSub.subscribe(function(message) {
      this.bearing = (message.data / Math.PI) * 180;
    }.bind(this));

    // Target Latitude ---------------------------------------------------------
    this.tarLatSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.tarLatTopic,
      messageType: 'std_msgs/Float64'
    });
    this.tarLatSub.subscribe(function(message) {
      this.tarLat = message.data;
    }.bind(this));

    // Target Longitude --------------------------------------------------------
    this.tarLonSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.tarLonTopic,
      messageType: 'std_msgs/Float64'
    });
    this.tarLonSub.subscribe(function(message) {
      this.tarLon = message.data;
    }.bind(this));
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
