import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  viewMedia = 'map-view';
  viewMode = 'status-tab';

  constructor() { }

  ngOnInit() {
  }

}
