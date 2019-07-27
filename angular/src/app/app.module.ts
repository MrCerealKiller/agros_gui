import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { DashComponent } from './components/dash/dash.component';
import { MapComponent } from './components/map/map.component';
import { StatusComponent } from './components/status/status.component';
import { WaypointsComponent } from './components/waypoints/waypoints.component';
import { SettingsComponent } from './components/settings/settings.component';

import { RosService } from './services/ros.service';
import { CameraComponent } from './components/camera/camera.component';
import { DepthComponent } from './components/depth/depth.component';
import { VLightBarComponent } from './components/v-light-bar/v-light-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashComponent,
    MapComponent,
    StatusComponent,
    WaypointsComponent,
    SettingsComponent,
    CameraComponent,
    DepthComponent,
    VLightBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    RosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
