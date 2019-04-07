import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  sys_speed = 12.6;
  sys_heading = 140.0;
  sys_lat = 45.068746;
  sys_lon = -74.930188;

  tar_distance = 0.37;
  tar_heading = 124.0;
  tar_lat = 45.069540;
  tar_lon = -74.928897

  constructor() { }

  ngOnInit() {
  }

}
