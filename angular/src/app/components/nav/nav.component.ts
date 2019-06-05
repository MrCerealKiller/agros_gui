import { Component, OnInit } from '@angular/core';

import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public ip: string = 'localhost';

  constructor(private _ros: RosService) { }

  ngOnInit() {
  }

  connect() {
    this._ros.close();
    this._ros.requestConnection(this.ip);
  }
}
