import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashComponent } from './components/dash/dash.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
	{ path: '', component: DashComponent },
	{ path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
