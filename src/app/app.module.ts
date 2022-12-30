import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ApiModule, Configuration, ConfigurationParameters } from 'spacetraders-v2-ng';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FleetOverviewComponent } from './fleet-overview/fleet-overview.component';
import { BankOverviewComponent } from './bank-overview/bank-overview.component';
import { SettingsComponent } from './settings/settings.component';
import { StructuresOverviewComponent } from './structures-overview/structures-overview.component';
import { LoginComponent } from './login/login.component';
import { FleetSettingsComponent } from './settings/fleet-settings/fleet-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    // none
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FleetOverviewComponent,
    BankOverviewComponent,
    SettingsComponent,
    StructuresOverviewComponent,
    LoginComponent,
    FleetSettingsComponent
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
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
