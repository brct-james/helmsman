import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FleetOverviewComponent } from './fleet-overview/fleet-overview.component';
import { BankOverviewComponent } from './bank-overview/bank-overview.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'f', redirectTo: 'f/overview', pathMatch: 'full'},
    { path: 'f', children: [
        { path: "overview", component: FleetOverviewComponent },
    ]},
    { path: 'b', redirectTo: 'b/overview', pathMatch: 'full'},
    { path: 'b', children: [
        { path: "overview", component: BankOverviewComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
