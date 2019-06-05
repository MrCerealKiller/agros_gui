import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import * as ROSLIB from 'roslib';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  ros: ROSLIB.Ros = null;
  ip: string = 'localhost';
  port: string = '9090'
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connection$ = this.connectionSubject.asObservable();

  constructor() {
    console.log('ROS Service Instantiated. Attempting to connect...');
    this.requestConnection(this.ip);
  }

  requestConnection(ip) {
    this.ros = new ROSLIB.Ros({
      url: ('ws://' + ip + ':' + this.port)
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

  close() {
    if (this.ros != null) {
      this.ros.close();
    }
  }

  getRos() {
    return this.ros;
  }
}
