import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-waypoints',
  templateUrl: './waypoints.component.html',
  styleUrls: ['./waypoints.component.scss']
})
export class WaypointsComponent implements OnInit {

  yaml_path: String = null;
  connection: Subscription;
  loadService: ROSLIB.Service

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
    this.loadService = new ROSLIB.Service({
      ros: this._ros.getRos(),
      name: environment.loadService,
      serviceType: 'agros_paths/GeneratePath'
    });
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  callLoadService() {
    let req = new ROSLIB.ServiceRequest({
      path : {data: this.yaml_path}
    });

    console.log('Calling GeneratePath service with:\n' + req.path.data);
    this.loadService.callService(req, (res) => {
      console.log(res.success);
    });
  }

}
