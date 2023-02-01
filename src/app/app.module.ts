import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  ApiModule,
  Configuration,
  ConfigurationParameters,
} from 'spacetraders-v2-ng';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FleetOverviewComponent } from './fleet-overview/fleet-overview.component';
import { LedgerOverviewComponent } from './ledger-overview/ledger-overview.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { FleetSettingsComponent } from './settings/fleet-settings/fleet-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShipCardComponent } from './ship-card/ship-card.component';
import { ArrivalEtaPipe } from './arrival-eta.pipe';
import { FleetAutomationComponent } from './fleet-automation/fleet-automation.component';
import { StarmapComponent } from './starmap/starmap.component';
import { NgChartsModule } from 'ng2-charts';
import { StarpanelComponent } from './starmap/starpanel/starpanel.component';
import { ShipDetailsComponent } from './ship-details/ship-details.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    // none
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FleetOverviewComponent,
    LedgerOverviewComponent,
    SettingsComponent,
    LoginComponent,
    FleetSettingsComponent,
    ShipCardComponent,
    ArrivalEtaPipe,
    FleetAutomationComponent,
    StarmapComponent,
    StarpanelComponent,
    ShipDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonToggleModule,
    ClipboardModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
