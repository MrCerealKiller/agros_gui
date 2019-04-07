import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { DashComponent } from './components/dash/dash.component';
import { MapComponent } from './components/map/map.component';
import { StatusComponent } from './components/status/status.component';
import { WaypointsComponent } from './components/waypoints/waypoints.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashComponent,
    MapComponent,
    StatusComponent,
    WaypointsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
