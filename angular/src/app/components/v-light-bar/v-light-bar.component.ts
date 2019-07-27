import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

const N_LIGHTS: number = 15; // An odd number is recommended
const MAX_RANGE: number = 30; // TODO test for reliable range

interface VLBCircle {
    bg: string;
    isActive: boolean;
}

@Component({
  selector: 'app-v-light-bar',
  templateUrl: './v-light-bar.component.html',
  styleUrls: ['./v-light-bar.component.scss']
})
export class VLightBarComponent implements OnInit {

  lights: VLBCircle[];
  bearing: number = 0.0;
  bearingAbs: number = 0.0;
  direction: string = "Right"
  isInRange: boolean = false;
  activeIdx: number = 8;

  connection: Subscription;
  bearingSub: ROSLIB.Topic;

  constructor(private _ros: RosService) {
    this.connection = this._ros.connection$.subscribe(data => {
      if (data) {
        this.listen();
      }
    });
  }

  listen() {
    this.bearingSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.bearingTopic,
      messageType: 'std_msgs/Float64'
    });
    this.bearingSub.subscribe(function(message) {
      this.bearing = (message.data / Math.PI) * 180;
      this.assignActive();
      this.update();
    }.bind(this));
  }

  ngOnInit() {
    this.lights = []
    for (let i = 0; i < N_LIGHTS; i++) {
      let light = {
        bg:"light",
        isActive: false
      }
      this.lights.push(light);
    }
  }

  assignActive() {
    let bearingCon = Math.min(Math.max(this.bearing, -45.0), 45.0);
    this.activeIdx = Math.round(((bearingCon + 45.0) / 90.0) * 14.0);
  }

  update() {
    // Update bearing visually
    this.bearingAbs = Math.abs(this.bearing);
    if (this.bearing < 0) {
      this.direction = "Left";
    } else {
      this.direction = "Right";
    }

    // Check if in range
    if ((Math.abs(this.bearing) - MAX_RANGE) < 0) {
      this.isInRange = true;
    } else {
      this.isInRange = false;
    }

    // Update lights
    for (let i = 0; i < N_LIGHTS; i++) {
      if (i == this.activeIdx) {
        if (this.isInRange) {
          this.lights[i].bg = "success";
        } else {
          this.lights[i].bg = "danger";
        }
        this.lights[i].isActive = true;
      } else {
        this.lights[i].bg = "light"
        this.lights[i].isActive = false;
      }
    }
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
