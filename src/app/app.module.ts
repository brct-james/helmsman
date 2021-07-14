import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

import { AbbrNumPipe } from './abbr-num.pipe';
import { ArrivalEtaPipe } from './arrival-eta.pipe';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FleetOverviewComponent } from './fleet-overview/fleet-overview.component';
import { BankOverviewComponent } from './bank-overview/bank-overview.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { NetWorthChartComponent } from './net-worth-chart/net-worth-chart.component';
import { AutomationOverviewComponent } from './automation-overview/automation-overview.component';
import { FleetAutomationComponent } from './fleet-automation/fleet-automation.component';
import { ShipAutomationControlsComponent } from './ship-automation-controls/ship-automation-controls.component';
import { LoanAutomationComponent } from './loan-automation/loan-automation.component';
import { ShipCardComponent } from './ship-card/ship-card.component';
import { StructuresOverviewComponent } from './structures-overview/structures-overview.component';
import { LoginComponent } from './login/login.component';
import { FleetSettingsComponent } from './settings/fleet-settings/fleet-settings.component';
import { BadgeComponent } from './badge/badge.component';

const MaterialComponents = [MatSlideToggleModule, MatInputModule];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FleetOverviewComponent,
    BankOverviewComponent,
    SettingsComponent,
    AccountInfoComponent,
    NetWorthChartComponent,
    AutomationOverviewComponent,
    FleetAutomationComponent,
    ShipAutomationControlsComponent,
    LoanAutomationComponent,
    ShipCardComponent,
    StructuresOverviewComponent,
    AbbrNumPipe,
    ArrivalEtaPipe,
    LoginComponent,
    FleetSettingsComponent,
    BadgeComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, ChartsModule, NgxWebstorageModule.forRoot(), BrowserAnimationsModule, MaterialComponents],
  providers: [AbbrNumPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
