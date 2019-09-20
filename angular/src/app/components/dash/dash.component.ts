import { DOCUMENT } from '@angular/common';
import { Component,
         ViewChild,
         OnInit,
         ElementRef,
         Inject,
         HostListener } from '@angular/core';

import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  @ViewChild('tools') toolsRef: ElementRef;
  @ViewChild('map') mapRef: MapComponent;

  viewMedia = 'map-view';
  viewMode = 'status-tab';

  isToolsFs: boolean = false;

  constructor(@Inject(DOCUMENT) private _document: any) { }

  ngOnInit() { }

  @HostListener('fullscreenchange', ['$event']) onMouseEnter(event: any) {
    if (event.target.id == 'tools') {
      this.isToolsFs = !this.isToolsFs;
      try {
        this.mapRef.setIsFullscreen(this.isToolsFs);
      } catch (e) { /*ignore*/ }
    }
  }

  toggleFullscreen() {
    if (this.isToolsFs) {
      if (this._document.exitFullscreen) {
        this._document.exitFullscreen();
      }
    } else if (this.toolsRef.nativeElement.requestFullscreen) {
      this.toolsRef.nativeElement.requestFullscreen();
    }
  }
}
