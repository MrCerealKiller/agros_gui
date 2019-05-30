import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import * as ROSLIB from 'roslib';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  ros: ROSLIB.Ros = null;
  url: string = "ws://localhost:9090";
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connection$ = this.connectionSubject.asObservable();

  constructor() {
    console.log('ROS Service Instantiated. Attempting to connect...');
    this.requestConnection(this.url);
  }

  requestConnection(url) {
    this.ros = new ROSLIB.Ros({
      url: url
    });

    this.ros.on('connection', function() {
      console.log('Successfully connected to ROS network');
      this.connectionSubject.next(true);
    }.bind(this));

    this.ros.on('error', function(err) {
      console.log('An error occured while connecting to the ROS network:', err);
      this.connectionSubject.next(false);
    }.bind(this));

    this.ros.on('close', function(err) {
      console.log('The connection to the ROS network has been closed');
      this.connectionSubject.next(false);
    }.bind(this));
  }

  getRos() {
    return this.ros;
  }
}
