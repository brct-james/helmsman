import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FleetOverviewComponent } from './fleet-overview/fleet-overview.component';
import { LedgerOverviewComponent } from './ledger-overview/ledger-overview.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { StarmapComponent } from './starmap/starmap.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'f', redirectTo: 'f/overview', pathMatch: 'full' },
  {
    path: 'f',
    children: [{ path: 'overview', component: FleetOverviewComponent }],
  },
  { path: 'l', redirectTo: 'l/overview', pathMatch: 'full' },
  {
    path: 'l',
    children: [{ path: 'overview', component: LedgerOverviewComponent }],
  },
  { path: 's', redirectTo: 's/map', pathMatch: 'full' },
  { path: 's', children: [{ path: 'map', component: StarmapComponent }] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
