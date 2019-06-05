import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-depth',
  templateUrl: './depth.component.html',
  styleUrls: ['./depth.component.scss']
})
export class DepthComponent implements OnInit {

  // Initialized with temporary image
  img: string = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAASFBMVEUAAAAAAADMzMz/AABmZmaZmZnMAABmAACZAAAzAAAzMzP/MzPMZmaZMzPMMzP/MwD/////Zmb/ZgBmMzPMmZmZZmb/mQD/mZlxvxKlAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffCBIMMyVTqZicAAACK0lEQVRIx43W63aDIAwA4KJJhVjrVtfu/d90kASIFlzzp5fDd5KAgJdLJwa8fB6YYojBXz4EQw1EgNPxAGDHqzpDBqDV0EN5DDoToIhagkSAOwb2DIEBRLEWINJf2DQspCQ7AwiUy0M69pEFyCR/xZCl4cTE/CgQtYoU2xZC2J6YiXNHA3ai4uApRwjaj+RBs+JWpKHLcrstiyAz3WjFUFJMk4/jf39+fqPyCdXJLmmwzi4L7+8a8avPhlwtzSQRcY0x3+9z+mSz8bSY0jRJWoEirtdxlM+IluczEXA7In+FbVm8jJ9jqIpmC2nBSjc6XXFZwvS83XwC4/wdI5pRDLczUE6TSJoPisRrDhNCkqFSmTY/pN6ZpIo05pguGZk1qawSKL3PxnznNIGHkDSjK1/q4tZNnlFI0CdNCeiTooRjXVfTTV5PJnggWTxejzNCDfJ6PdYWGd6zXHOWR7ewXi/jOrYJ8PbCvFH8cSGFlBmjQoZC/Dup68LbjAmWR39fWaOu1MRFCNg0rWesrCQTU1njuaxPZW1lX1neYRXwvgy1rkLQGN2WZVOWJHFPDZBPMUTXMVZAvZ+gnolqfBlvT6VEymGJelzryedL7M4+MFdTvIwAnDn8JnPCupbgO7KaeijHLz1xNKzseBVweTPketEQQgDagLAhssFWIl6P5j3OpK5QzgB8lXVufiFoFkl/n71fZIPlDeYsxa64+l7yH1BFUAv6ANgZ7wz/A295IO9de7kCAAAAAElFTkSuQmCC';

  // ROS
  connection: Subscription;
  depthSub: ROSLIB.Topic;

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
    this.depthSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.depthTopic,
      messageType: 'sensor_msgs/CompressedImage'
    });
    this.depthSub.subscribe(function(message) {
      this.img = message.data;;
    }.bind(this));
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
